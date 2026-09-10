
-- 1. Activation commissions inside verify_receipt_code
CREATE OR REPLACE FUNCTION public.verify_receipt_code(p_receipt_code text, p_uid uuid)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_code text := upper(trim(coalesce(p_receipt_code, '')));
  v_status text;
  v_meta jsonb;
  v_uid uuid := auth.uid();
  v_country text;
  v_referrer uuid;
  v_referrer2 uuid;
  v_pack_usd numeric := 35;
  v_rate numeric := 2500;
BEGIN
  IF v_uid IS NULL OR (p_uid IS NOT NULL AND p_uid <> v_uid) THEN
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
  SET status = 'used', used_by = v_uid, used_at = now()
  WHERE upper(trim(code)) = v_code;

  IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = v_uid) THEN
    SELECT raw_user_meta_data INTO v_meta FROM auth.users WHERE id = v_uid;
    INSERT INTO public.profiles (id, full_name, status, payment_status)
    VALUES (v_uid, COALESCE(v_meta->>'full_name', 'Ambassador'), 'pending', 'pending');
  END IF;

  UPDATE public.profiles
  SET status = 'active',
      payment_status = 'completed',
      receipt_code = v_code,
      payment_verified_at = now(),
      activated_at = now(),
      updated_at = now()
  WHERE id = v_uid
  RETURNING country INTO v_country;

  -- Mark the referral active
  UPDATE public.referrals
  SET status = 'active', activated_date = now()
  WHERE referred_id = v_uid AND status <> 'active'
  RETURNING referrer_id INTO v_referrer;

  IF v_referrer IS NULL THEN
    SELECT referrer_id INTO v_referrer FROM public.referrals WHERE referred_id = v_uid LIMIT 1;
  END IF;

  IF v_referrer IS NOT NULL THEN
    -- Direct sponsor: 35% of the activation pack
    INSERT INTO public.earnings (user_id, earning_type, amount_usd, amount_local, currency, commission_rate, status, source_transaction_id, earned_date)
    VALUES (v_referrer, 'activation_pack', round(v_pack_usd * 0.35, 2), round(v_pack_usd * 0.35 * v_rate, 2), 'TZS', 0.35, 'paid', v_uid, now());

    -- First generation: 10% of the activation pack
    SELECT referrer_id INTO v_referrer2 FROM public.referrals WHERE referred_id = v_referrer LIMIT 1;
    IF v_referrer2 IS NOT NULL THEN
      INSERT INTO public.earnings (user_id, earning_type, amount_usd, amount_local, currency, commission_rate, status, source_transaction_id, earned_date)
      VALUES (v_referrer2, 'second_level', round(v_pack_usd * 0.10, 2), round(v_pack_usd * 0.10 * v_rate, 2), 'TZS', 0.10, 'paid', v_uid, now());
    END IF;
  END IF;

  -- Keep the country ambassador count in sync
  IF v_country IS NOT NULL THEN
    UPDATE public.country_limits cl
    SET current_count = (
      SELECT count(*) FROM public.profiles p
      WHERE p.status = 'active' AND p.country = cl.country_name
    ), updated_at = now()
    WHERE cl.country_name = v_country;
  END IF;

  RETURN 'Receipt verified successfully';
END;
$function$;

-- 2. Sales commissions: 25% direct, 10% first generation
CREATE OR REPLACE FUNCTION public.create_sales_commissions()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_referrer uuid;
BEGIN
  IF NEW.seller_id IS NULL THEN
    RETURN NEW;
  END IF;

  INSERT INTO public.earnings (user_id, earning_type, amount_usd, amount_local, currency, commission_rate, status, source_transaction_id, earned_date)
  VALUES (NEW.seller_id, 'direct_sales', round(NEW.total_amount_usd * 0.25, 2), round(NEW.total_amount_local * 0.25, 2), NEW.currency, 0.25, 'paid', NEW.id, COALESCE(NEW.sale_date, now()));

  SELECT referrer_id INTO v_referrer FROM public.referrals WHERE referred_id = NEW.seller_id LIMIT 1;
  IF v_referrer IS NOT NULL THEN
    INSERT INTO public.earnings (user_id, earning_type, amount_usd, amount_local, currency, commission_rate, status, source_transaction_id, earned_date)
    VALUES (v_referrer, 'second_level', round(NEW.total_amount_usd * 0.10, 2), round(NEW.total_amount_local * 0.10, 2), NEW.currency, 0.10, 'paid', NEW.id, COALESCE(NEW.sale_date, now()));
  END IF;

  RETURN NEW;
END;
$function$;

DROP TRIGGER IF EXISTS create_commissions_on_sale ON public.sales;
CREATE TRIGGER create_commissions_on_sale
AFTER INSERT ON public.sales
FOR EACH ROW EXECUTE FUNCTION public.create_sales_commissions();

-- 3. Recalculate country counts from real data
UPDATE public.country_limits cl
SET current_count = (
  SELECT count(*) FROM public.profiles p
  WHERE p.status = 'active' AND p.country = cl.country_name
), updated_at = now();

-- 4. Storage access rules
DROP POLICY IF EXISTS "Public read access to public buckets" ON storage.objects;
CREATE POLICY "Public read access to public buckets"
ON storage.objects FOR SELECT
USING (bucket_id IN ('oleifera','mizaniclinic','som','wealthywithyou','gachiku'));

DROP POLICY IF EXISTS "Authenticated users can upload" ON storage.objects;
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id IN ('oleifera','mizaniclinic','som','wealthywithyou','gachiku') AND owner = auth.uid());

DROP POLICY IF EXISTS "Owners can update their files" ON storage.objects;
CREATE POLICY "Owners can update their files"
ON storage.objects FOR UPDATE TO authenticated
USING (owner = auth.uid()) WITH CHECK (owner = auth.uid());

DROP POLICY IF EXISTS "Owners can delete their files" ON storage.objects;
CREATE POLICY "Owners can delete their files"
ON storage.objects FOR DELETE TO authenticated
USING (owner = auth.uid());

DROP POLICY IF EXISTS "Admins manage all files" ON storage.objects;
CREATE POLICY "Admins manage all files"
ON storage.objects FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));
