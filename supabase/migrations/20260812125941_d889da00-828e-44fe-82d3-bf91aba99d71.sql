
-- 1. Atomic registration function
CREATE OR REPLACE FUNCTION public.register_ambassador(
  p_full_name text,
  p_phone text,
  p_region text,
  p_country text,
  p_referral_code text
)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_uid uuid := auth.uid();
  v_code text := upper(trim(coalesce(p_referral_code, '')));
  v_referrer uuid;
  v_amb text;
  v_existing text;
BEGIN
  IF v_uid IS NULL THEN
    RAISE EXCEPTION 'You must be signed in to complete registration';
  END IF;

  SELECT p.id INTO v_referrer
  FROM public.profiles p
  WHERE upper(p.ambassador_id) = v_code OR upper(p.user_referral_id) = v_code
  LIMIT 1;

  IF v_referrer IS NULL THEN
    RAISE EXCEPTION 'Referral code % does not exist', v_code;
  END IF;

  SELECT ambassador_id INTO v_existing FROM public.profiles WHERE id = v_uid;

  IF v_existing IS NOT NULL THEN
    v_amb := v_existing;
  ELSE
    v_amb := public.generate_ambassador_id(p_region, p_country);
  END IF;

  INSERT INTO public.profiles (
    id, full_name, phone, region, country, ambassador_id, user_referral_id,
    referral_code, status, payment_status, registration_data
  ) VALUES (
    v_uid, p_full_name, p_phone, p_region, p_country, v_amb, v_amb,
    v_code, 'pending', 'pending',
    jsonb_build_object(
      'fullName', p_full_name, 'region', p_region, 'country', p_country,
      'referralCode', v_code, 'phone', p_phone, 'ambassadorId', v_amb,
      'userId', v_uid, 'registrationDate', now()
    )
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name = COALESCE(public.profiles.full_name, EXCLUDED.full_name),
    phone = COALESCE(public.profiles.phone, EXCLUDED.phone),
    region = COALESCE(public.profiles.region, EXCLUDED.region),
    country = COALESCE(public.profiles.country, EXCLUDED.country),
    ambassador_id = COALESCE(public.profiles.ambassador_id, EXCLUDED.ambassador_id),
    user_referral_id = COALESCE(public.profiles.user_referral_id, EXCLUDED.user_referral_id),
    referral_code = COALESCE(public.profiles.referral_code, EXCLUDED.referral_code),
    updated_at = now();

  INSERT INTO public.referrals (referrer_id, referred_id, referral_code, country, status)
  SELECT v_referrer, v_uid, v_code, p_country, 'pending'
  WHERE NOT EXISTS (
    SELECT 1 FROM public.referrals r WHERE r.referred_id = v_uid
  );

  RETURN v_amb;
END;
$$;

REVOKE ALL ON FUNCTION public.register_ambassador(text, text, text, text, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.register_ambassador(text, text, text, text, text) TO authenticated;

-- 2. Resilient receipt verification
CREATE OR REPLACE FUNCTION public.verify_receipt_code(p_receipt_code text, p_uid uuid)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_code text := upper(trim(coalesce(p_receipt_code, '')));
  v_status text;
  v_meta jsonb;
BEGIN
  IF auth.uid() IS NULL OR (p_uid IS NOT NULL AND p_uid <> auth.uid()) THEN
    RAISE EXCEPTION 'Not authorised to verify this receipt code';
  END IF;

  SELECT status INTO v_status FROM public.receipt_codes WHERE upper(trim(code)) = v_code;

  IF v_status IS NULL THEN
    RAISE EXCEPTION 'Receipt code not found. Please check the code and try again.';
  END IF;

  IF v_status <> 'available' THEN
    RAISE EXCEPTION 'This receipt code has already been used.';
  END IF;

  UPDATE public.receipt_codes
  SET status = 'used', used_by = auth.uid(), used_at = now()
  WHERE upper(trim(code)) = v_code;

  -- Ensure a profile exists before activating
  IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid()) THEN
    SELECT raw_user_meta_data INTO v_meta FROM auth.users WHERE id = auth.uid();
    INSERT INTO public.profiles (id, full_name, status, payment_status)
    VALUES (auth.uid(), COALESCE(v_meta->>'full_name', 'Ambassador'), 'pending', 'pending');
  END IF;

  UPDATE public.profiles
  SET status = 'active',
      payment_status = 'completed',
      receipt_code = v_code,
      payment_verified_at = now(),
      activated_at = now(),
      updated_at = now()
  WHERE id = auth.uid();

  RETURN 'Receipt verified successfully';
END;
$$;

REVOKE ALL ON FUNCTION public.verify_receipt_code(text, uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.verify_receipt_code(text, uuid) TO authenticated;

-- 3. Backfill accounts without a profile
INSERT INTO public.profiles (id, full_name, status, payment_status, ambassador_id, user_referral_id, country, region)
SELECT u.id,
       COALESCE(u.raw_user_meta_data->>'full_name', split_part(u.email, '@', 1)),
       'pending', 'pending',
       public.generate_ambassador_id('Dar es Salaam', 'Tanzania'),
       public.generate_ambassador_id('Dar es Salaam', 'Tanzania'),
       'Tanzania', 'Dar es Salaam'
FROM auth.users u
WHERE NOT EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = u.id);
