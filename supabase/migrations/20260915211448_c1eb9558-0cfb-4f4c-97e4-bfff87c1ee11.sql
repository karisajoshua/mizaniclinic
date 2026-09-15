
-- =========================================================
-- PHASE 1: receipt codes single-use + profile field lockdown
-- =========================================================

CREATE UNIQUE INDEX IF NOT EXISTS receipt_codes_code_norm_uidx
  ON public.receipt_codes (upper(btrim(code)));

CREATE OR REPLACE FUNCTION public.guard_profile_privileged_fields()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NULL OR public.has_role(auth.uid(), 'admin') THEN
    RETURN NEW;
  END IF;

  IF NEW.status IS DISTINCT FROM OLD.status
     OR NEW.payment_status IS DISTINCT FROM OLD.payment_status
     OR NEW.receipt_code IS DISTINCT FROM OLD.receipt_code
     OR NEW.activated_at IS DISTINCT FROM OLD.activated_at
     OR NEW.payment_verified_at IS DISTINCT FROM OLD.payment_verified_at
     OR NEW.ambassador_id IS DISTINCT FROM OLD.ambassador_id THEN
    RAISE EXCEPTION 'You are not allowed to change your activation or payment status';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS guard_profile_privileged_fields ON public.profiles;
CREATE TRIGGER guard_profile_privileged_fields
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.guard_profile_privileged_fields();

-- =========================================================
-- PHASE 2: commissions - no duplicates, three states
-- =========================================================

UPDATE public.earnings SET status = 'paid' WHERE status IS NULL;

ALTER TABLE public.earnings
  ALTER COLUMN status SET DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS approved_date timestamptz;

CREATE OR REPLACE FUNCTION public.validate_earning_status()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.status NOT IN ('pending','approved','paid','cancelled') THEN
    RAISE EXCEPTION 'Invalid commission status: %', NEW.status;
  END IF;
  IF NEW.status = 'approved' AND NEW.approved_date IS NULL THEN
    NEW.approved_date := now();
  END IF;
  IF NEW.status = 'paid' AND NEW.paid_date IS NULL THEN
    NEW.paid_date := now();
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS validate_earning_status ON public.earnings;
CREATE TRIGGER validate_earning_status
  BEFORE INSERT OR UPDATE ON public.earnings
  FOR EACH ROW EXECUTE FUNCTION public.validate_earning_status();

-- remove any existing duplicates before enforcing uniqueness
DELETE FROM public.earnings e
USING public.earnings d
WHERE e.user_id = d.user_id
  AND e.earning_type = d.earning_type
  AND e.source_transaction_id IS NOT NULL
  AND e.source_transaction_id = d.source_transaction_id
  AND e.ctid > d.ctid;

CREATE UNIQUE INDEX IF NOT EXISTS earnings_no_duplicates_uidx
  ON public.earnings (user_id, earning_type, source_transaction_id)
  WHERE source_transaction_id IS NOT NULL;

ALTER TABLE public.ambassador_stats
  ADD COLUMN IF NOT EXISTS pending_earnings_usd numeric NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS approved_earnings_usd numeric NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS paid_earnings_usd numeric NOT NULL DEFAULT 0;

CREATE OR REPLACE FUNCTION public.calculate_ambassador_stats(target_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  total_earnings numeric := 0;
  pending_e numeric := 0;
  approved_e numeric := 0;
  paid_e numeric := 0;
  activation_earnings numeric := 0;
  direct_earnings numeric := 0;
  second_level_earnings numeric := 0;
  bonus_earnings numeric := 0;
  total_refs integer := 0;
  active_refs integer := 0;
  pending_refs integer := 0;
BEGIN
  SELECT
    COALESCE(SUM(amount_usd) FILTER (WHERE status <> 'cancelled'), 0),
    COALESCE(SUM(amount_usd) FILTER (WHERE status = 'pending'), 0),
    COALESCE(SUM(amount_usd) FILTER (WHERE status = 'approved'), 0),
    COALESCE(SUM(amount_usd) FILTER (WHERE status = 'paid'), 0),
    COALESCE(SUM(amount_usd) FILTER (WHERE earning_type = 'activation_pack' AND status <> 'cancelled'), 0),
    COALESCE(SUM(amount_usd) FILTER (WHERE earning_type = 'direct_sales' AND status <> 'cancelled'), 0),
    COALESCE(SUM(amount_usd) FILTER (WHERE earning_type = 'second_level' AND status <> 'cancelled'), 0),
    COALESCE(SUM(amount_usd) FILTER (WHERE earning_type IN ('team_bonus_level1','team_bonus_level2') AND status <> 'cancelled'), 0)
  INTO total_earnings, pending_e, approved_e, paid_e,
       activation_earnings, direct_earnings, second_level_earnings, bonus_earnings
  FROM public.earnings
  WHERE user_id = target_user_id;

  SELECT COUNT(*), COUNT(*) FILTER (WHERE status = 'active'), COUNT(*) FILTER (WHERE status = 'pending')
  INTO total_refs, active_refs, pending_refs
  FROM public.referrals
  WHERE referrer_id = target_user_id;

  INSERT INTO public.ambassador_stats (
    user_id, total_earnings_usd, pending_earnings_usd, approved_earnings_usd, paid_earnings_usd,
    activation_pack_earnings_usd, direct_sales_earnings_usd, second_level_earnings_usd,
    team_bonus_earnings_usd, total_referrals, active_referrals, pending_referrals,
    last_calculated, updated_at
  ) VALUES (
    target_user_id, total_earnings, pending_e, approved_e, paid_e,
    activation_earnings, direct_earnings, second_level_earnings,
    bonus_earnings, total_refs, active_refs, pending_refs, now(), now()
  )
  ON CONFLICT (user_id) DO UPDATE SET
    total_earnings_usd = EXCLUDED.total_earnings_usd,
    pending_earnings_usd = EXCLUDED.pending_earnings_usd,
    approved_earnings_usd = EXCLUDED.approved_earnings_usd,
    paid_earnings_usd = EXCLUDED.paid_earnings_usd,
    activation_pack_earnings_usd = EXCLUDED.activation_pack_earnings_usd,
    direct_sales_earnings_usd = EXCLUDED.direct_sales_earnings_usd,
    second_level_earnings_usd = EXCLUDED.second_level_earnings_usd,
    team_bonus_earnings_usd = EXCLUDED.team_bonus_earnings_usd,
    total_referrals = EXCLUDED.total_referrals,
    active_referrals = EXCLUDED.active_referrals,
    pending_referrals = EXCLUDED.pending_referrals,
    last_calculated = EXCLUDED.last_calculated,
    updated_at = EXCLUDED.updated_at;
END;
$$;

-- sales commissions now land as pending, and never duplicate
CREATE OR REPLACE FUNCTION public.create_sales_commissions()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_referrer uuid;
BEGIN
  IF NEW.seller_id IS NULL THEN
    RETURN NEW;
  END IF;

  INSERT INTO public.earnings (user_id, earning_type, amount_usd, amount_local, currency, commission_rate, status, source_transaction_id, earned_date)
  VALUES (NEW.seller_id, 'direct_sales', round(NEW.total_amount_usd * 0.25, 2), round(NEW.total_amount_local * 0.25, 2), NEW.currency, 0.25, 'pending', NEW.id, COALESCE(NEW.sale_date, now()))
  ON CONFLICT DO NOTHING;

  SELECT referrer_id INTO v_referrer FROM public.referrals WHERE referred_id = NEW.seller_id LIMIT 1;
  IF v_referrer IS NOT NULL THEN
    INSERT INTO public.earnings (user_id, earning_type, amount_usd, amount_local, currency, commission_rate, status, source_transaction_id, earned_date)
    VALUES (v_referrer, 'second_level', round(NEW.total_amount_usd * 0.10, 2), round(NEW.total_amount_local * 0.10, 2), NEW.currency, 0.10, 'pending', NEW.id, COALESCE(NEW.sale_date, now()))
    ON CONFLICT DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$;

-- =========================================================
-- PHASE 1b: atomic receipt verification
-- =========================================================

CREATE OR REPLACE FUNCTION public.verify_receipt_code(p_receipt_code text, p_uid uuid)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_code text := upper(btrim(coalesce(p_receipt_code, '')));
  v_meta jsonb;
  v_uid uuid := auth.uid();
  v_country text;
  v_referrer uuid;
  v_referrer2 uuid;
  v_pack_usd numeric := 35;
  v_rate numeric := 2500;
  v_claimed integer;
BEGIN
  IF v_uid IS NULL OR (p_uid IS NOT NULL AND p_uid <> v_uid) THEN
    RAISE EXCEPTION 'Not authorised to verify this receipt code';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.receipt_codes WHERE upper(btrim(code)) = v_code) THEN
    RAISE EXCEPTION 'Receipt code not found. Please check the code and try again.';
  END IF;

  -- atomic claim: only one concurrent caller can win this update
  UPDATE public.receipt_codes
  SET status = 'used', used_by = v_uid, used_at = now()
  WHERE upper(btrim(code)) = v_code
    AND (status = 'available' OR used_by = v_uid);
  GET DIAGNOSTICS v_claimed = ROW_COUNT;

  IF v_claimed = 0 THEN
    RAISE EXCEPTION 'This receipt code has already been used.';
  END IF;

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

  UPDATE public.referrals
  SET status = 'active', activated_date = now()
  WHERE referred_id = v_uid AND status <> 'active'
  RETURNING referrer_id INTO v_referrer;

  IF v_referrer IS NULL THEN
    SELECT referrer_id INTO v_referrer FROM public.referrals WHERE referred_id = v_uid LIMIT 1;
  END IF;

  IF v_referrer IS NOT NULL THEN
    INSERT INTO public.earnings (user_id, earning_type, amount_usd, amount_local, currency, commission_rate, status, source_transaction_id, earned_date)
    VALUES (v_referrer, 'activation_pack', round(v_pack_usd * 0.35, 2), round(v_pack_usd * 0.35 * v_rate, 2), 'TZS', 0.35, 'pending', v_uid, now())
    ON CONFLICT DO NOTHING;

    SELECT referrer_id INTO v_referrer2 FROM public.referrals WHERE referred_id = v_referrer LIMIT 1;
    IF v_referrer2 IS NOT NULL THEN
      INSERT INTO public.earnings (user_id, earning_type, amount_usd, amount_local, currency, commission_rate, status, source_transaction_id, earned_date)
      VALUES (v_referrer2, 'second_level', round(v_pack_usd * 0.10, 2), round(v_pack_usd * 0.10 * v_rate, 2), 'TZS', 0.10, 'pending', v_uid, now())
      ON CONFLICT DO NOTHING;
    END IF;
  END IF;

  IF v_country IS NOT NULL THEN
    UPDATE public.country_limits cl
    SET current_count = (
      SELECT count(*) FROM public.profiles p
      WHERE p.status = 'active' AND p.country = cl.country_name
    ),
    premium_unlocked = (
      SELECT count(*) FROM public.profiles p
      WHERE p.status = 'active' AND p.country = cl.country_name
    ) >= cl.ambassador_limit,
    updated_at = now()
    WHERE cl.country_name = v_country;
  END IF;

  RETURN 'Receipt verified successfully';
END;
$$;

-- =========================================================
-- PHASE 5: collision-safe ambassador ID generation
-- =========================================================

CREATE OR REPLACE FUNCTION public.generate_ambassador_id(p_region text, p_country text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  country_code text;
  region_code text;
  next_number integer;
  new_id text;
BEGIN
  CASE p_country
    WHEN 'Tanzania' THEN country_code := 'T';
    WHEN 'Kenya' THEN country_code := 'K';
    WHEN 'Uganda' THEN country_code := 'U';
    WHEN 'Rwanda' THEN country_code := 'R';
    WHEN 'Burundi' THEN country_code := 'B';
    WHEN 'South Sudan' THEN country_code := 'S';
    WHEN 'Ethiopia' THEN country_code := 'E';
    WHEN 'Somalia' THEN country_code := 'O';
    WHEN 'Djibouti' THEN country_code := 'D';
    WHEN 'Eritrea' THEN country_code := 'A';
    ELSE country_code := 'T';
  END CASE;

  CASE p_region
    WHEN 'Dar es Salaam' THEN region_code := 'DSM';
    WHEN 'Arusha' THEN region_code := 'ARU';
    WHEN 'Mwanza' THEN region_code := 'MWZ';
    WHEN 'Dodoma' THEN region_code := 'DOD';
    WHEN 'Mbeya' THEN region_code := 'MBE';
    WHEN 'Morogoro' THEN region_code := 'MOR';
    WHEN 'Tanga' THEN region_code := 'TAN';
    WHEN 'Kilimanjaro' THEN region_code := 'KIL';
    WHEN 'Nairobi' THEN region_code := 'NAI';
    WHEN 'Mombasa' THEN region_code := 'MOM';
    WHEN 'Kisumu' THEN region_code := 'KIS';
    WHEN 'Kampala' THEN region_code := 'KAM';
    WHEN 'Gulu' THEN region_code := 'GUL';
    WHEN 'Kigali' THEN region_code := 'KIG';
    WHEN 'Bujumbura' THEN region_code := 'BUJ';
    WHEN 'Juba' THEN region_code := 'JUB';
    WHEN 'Addis Ababa' THEN region_code := 'ADD';
    WHEN 'Mogadishu' THEN region_code := 'MOG';
    WHEN 'Djibouti City' THEN region_code := 'DJI';
    WHEN 'Asmara' THEN region_code := 'ASM';
    ELSE region_code := 'GEN';
  END CASE;

  -- serialise concurrent generation per country
  PERFORM pg_advisory_xact_lock(hashtext('ambassador_id_' || country_code));

  LOOP
    SELECT GREATEST(
      COALESCE(MAX(
        CASE WHEN ambassador_id ~ ('^MAP-' || country_code || '\d{4}[A-Z]{3}$')
             THEN CAST(SUBSTRING(ambassador_id FROM 6 FOR 4) AS INTEGER) ELSE 0 END
      ), 0), 1000
    ) + 1
    INTO next_number
    FROM public.profiles
    WHERE ambassador_id LIKE 'MAP-' || country_code || '%';

    new_id := 'MAP-' || country_code || LPAD(next_number::text, 4, '0') || region_code;

    EXIT WHEN NOT EXISTS (SELECT 1 FROM public.profiles WHERE ambassador_id = new_id);
  END LOOP;

  RETURN new_id;
END;
$$;

CREATE UNIQUE INDEX IF NOT EXISTS profiles_ambassador_id_uidx
  ON public.profiles (ambassador_id) WHERE ambassador_id IS NOT NULL;

-- =========================================================
-- PHASE 6: appointments - no double booking, availability enforced
-- =========================================================

CREATE UNIQUE INDEX IF NOT EXISTS appointments_no_double_booking_uidx
  ON public.appointments (doctor_name, appointment_date, appointment_time)
  WHERE status <> 'cancelled';

CREATE OR REPLACE FUNCTION public.validate_appointment_slot()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM public.doctor_availability da
    WHERE da.doctor_name = NEW.doctor_name
      AND da.available_date = NEW.appointment_date
      AND da.is_available = true
      AND NEW.appointment_time >= da.start_time
      AND NEW.appointment_time < da.end_time
  ) THEN
    RAISE EXCEPTION 'That time is outside the doctor''s available hours';
  END IF;

  IF NEW.appointment_date < CURRENT_DATE THEN
    RAISE EXCEPTION 'Cannot book an appointment in the past';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS validate_appointment_slot ON public.appointments;
CREATE TRIGGER validate_appointment_slot
  BEFORE INSERT ON public.appointments
  FOR EACH ROW EXECUTE FUNCTION public.validate_appointment_slot();

-- users may no longer confirm their own appointment or mark it paid
CREATE OR REPLACE FUNCTION public.guard_appointment_payment_fields()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NULL OR public.has_role(auth.uid(), 'admin') THEN
    RETURN NEW;
  END IF;

  IF NEW.payment_status IS DISTINCT FROM OLD.payment_status
     OR NEW.stripe_session_id IS DISTINCT FROM OLD.stripe_session_id
     OR (NEW.status IS DISTINCT FROM OLD.status AND NEW.status <> 'cancelled') THEN
    RAISE EXCEPTION 'Only payment verification can change the booking status';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS guard_appointment_payment_fields ON public.appointments;
CREATE TRIGGER guard_appointment_payment_fields
  BEFORE UPDATE ON public.appointments
  FOR EACH ROW EXECUTE FUNCTION public.guard_appointment_payment_fields();

-- =========================================================
-- Admin-configurable system settings (Phase 4)
-- =========================================================

CREATE TABLE IF NOT EXISTS public.system_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text NOT NULL UNIQUE,
  value jsonb NOT NULL DEFAULT '{}'::jsonb,
  description text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.system_settings TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.system_settings TO authenticated;
GRANT ALL ON public.system_settings TO service_role;

ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read settings" ON public.system_settings;
CREATE POLICY "Anyone can read settings" ON public.system_settings
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins manage settings" ON public.system_settings;
CREATE POLICY "Admins manage settings" ON public.system_settings
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

DROP TRIGGER IF EXISTS update_system_settings_updated_at ON public.system_settings;
CREATE TRIGGER update_system_settings_updated_at
  BEFORE UPDATE ON public.system_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.system_settings (key, value, description) VALUES
  ('commission_rates', '{"activation_pack":0.35,"direct_sales":0.25,"second_level":0.10}'::jsonb, 'Commission percentages'),
  ('activation_pack', '{"price_usd":35,"price_local":87500,"currency":"TZS"}'::jsonb, 'Activation pack pricing'),
  ('appointment', '{"price_usd":25,"doctor_name":"Dr. Mwaka"}'::jsonb, 'Consultation pricing')
ON CONFLICT (key) DO NOTHING;

-- admin payout workflow helper
CREATE OR REPLACE FUNCTION public.set_earnings_status(p_ids uuid[], p_status text)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE v_count integer;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Only administrators can change payout status';
  END IF;
  IF p_status NOT IN ('pending','approved','paid','cancelled') THEN
    RAISE EXCEPTION 'Invalid status';
  END IF;

  UPDATE public.earnings
  SET status = p_status,
      approved_date = CASE WHEN p_status IN ('approved','paid') THEN COALESCE(approved_date, now()) ELSE approved_date END,
      paid_date = CASE WHEN p_status = 'paid' THEN COALESCE(paid_date, now()) ELSE paid_date END
  WHERE id = ANY(p_ids);
  GET DIAGNOSTICS v_count = ROW_COUNT;
  RETURN v_count;
END;
$$;
