-- Reconstructed bootstrap for the schema that predates the checked-in migrations.
-- Generated with `supabase migration new restore_initial_schema`, then dated
-- before the first migration so a fresh `supabase db reset` can replay history.
-- Existing installations MUST keep their schema: this block is a no-op there.
DO $bootstrap$
BEGIN
  IF to_regclass('public.profiles') IS NOT NULL THEN RETURN; END IF;

  CREATE TABLE public.profiles (
    id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name text, phone text, country text, region text, ambassador_id text,
    user_referral_id text, referral_code text, status text DEFAULT 'pending',
    payment_status text DEFAULT 'pending', receipt_code text, activated_at timestamptz,
    payment_verified_at timestamptz, registration_data jsonb,
    registration_date timestamptz DEFAULT now(), created_at timestamptz DEFAULT now(), updated_at timestamptz DEFAULT now()
  );
  CREATE TABLE public.country_limits (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(), country_code text NOT NULL UNIQUE,
    country_name text NOT NULL UNIQUE, ambassador_limit integer NOT NULL DEFAULT 100 CHECK (ambassador_limit > 0),
    current_count integer NOT NULL DEFAULT 0, is_active boolean NOT NULL DEFAULT true,
    premium_unlocked boolean NOT NULL DEFAULT false, created_at timestamptz DEFAULT now(), updated_at timestamptz DEFAULT now()
  );
  CREATE TABLE public.referrals (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    referrer_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
    referred_id uuid UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
    referral_code text NOT NULL, country text, status text NOT NULL DEFAULT 'pending',
    joined_date timestamptz NOT NULL DEFAULT now(), activated_date timestamptz, created_at timestamptz DEFAULT now(),
    CHECK (referrer_id <> referred_id)
  );
  CREATE TABLE public.receipt_codes (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(), code text NOT NULL UNIQUE, status text NOT NULL DEFAULT 'available',
    used_by uuid REFERENCES auth.users(id), used_at timestamptz, created_at timestamptz DEFAULT now()
  );
  CREATE TABLE public.earnings (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
    earning_type text NOT NULL, amount_usd numeric NOT NULL DEFAULT 0, amount_local numeric NOT NULL DEFAULT 0,
    currency text NOT NULL DEFAULT 'TZS', commission_rate numeric, status text NOT NULL DEFAULT 'pending',
    source_transaction_id uuid, earned_date timestamptz NOT NULL DEFAULT now(), paid_date timestamptz, created_at timestamptz DEFAULT now()
  );
  CREATE TABLE public.ambassador_stats (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id uuid UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
    total_earnings_usd numeric NOT NULL DEFAULT 0, activation_pack_earnings_usd numeric NOT NULL DEFAULT 0,
    direct_sales_earnings_usd numeric NOT NULL DEFAULT 0, second_level_earnings_usd numeric NOT NULL DEFAULT 0,
    team_bonus_earnings_usd numeric NOT NULL DEFAULT 0, total_referrals integer NOT NULL DEFAULT 0,
    active_referrals integer NOT NULL DEFAULT 0, pending_referrals integer NOT NULL DEFAULT 0,
    current_commission_tier text NOT NULL DEFAULT 'Standard', next_payout_date date,
    last_calculated timestamptz DEFAULT now(), created_at timestamptz DEFAULT now(), updated_at timestamptz DEFAULT now()
  );
  CREATE TABLE public.team_bonuses (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
    bonus_type text NOT NULL, current_amount_usd numeric NOT NULL DEFAULT 0, target_amount_usd numeric NOT NULL,
    progress_percentage numeric NOT NULL DEFAULT 0, period_type text NOT NULL DEFAULT 'lifetime',
    period_start date, period_end date, achieved boolean NOT NULL DEFAULT false, achieved_date timestamptz,
    created_at timestamptz DEFAULT now(), updated_at timestamptz DEFAULT now()
  );
  CREATE TABLE public.commission_tiers (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(), tier_name text NOT NULL UNIQUE,
    activation_pack_commission numeric NOT NULL, direct_sales_commission_min numeric NOT NULL,
    direct_sales_commission_max numeric NOT NULL, second_level_commission numeric NOT NULL,
    is_active boolean DEFAULT true, requirements jsonb DEFAULT '{}', created_at timestamptz DEFAULT now()
  );
  CREATE TABLE public.products (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(), name text NOT NULL, description text, product_type text NOT NULL,
    price_usd numeric NOT NULL, price_local numeric NOT NULL, currency text NOT NULL DEFAULT 'TZS',
    commission_eligible boolean DEFAULT true, is_active boolean DEFAULT true, created_at timestamptz DEFAULT now()
  );
  CREATE TABLE public.sales (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(), seller_id uuid REFERENCES public.profiles(id),
    customer_id uuid REFERENCES public.profiles(id), product_id uuid REFERENCES public.products(id),
    quantity integer NOT NULL DEFAULT 1 CHECK (quantity > 0), unit_price_usd numeric NOT NULL, unit_price_local numeric NOT NULL,
    total_amount_usd numeric NOT NULL CHECK (total_amount_usd >= 0), total_amount_local numeric NOT NULL CHECK (total_amount_local >= 0),
    currency text NOT NULL DEFAULT 'TZS', sale_date timestamptz NOT NULL DEFAULT now(), commission_paid boolean DEFAULT false, created_at timestamptz DEFAULT now()
  );
  CREATE TABLE public.notifications (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    title text NOT NULL, message text NOT NULL, notification_type text NOT NULL, is_read boolean DEFAULT false,
    action_url text, created_at timestamptz DEFAULT now()
  );
  CREATE TABLE public.doctor_availability (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(), doctor_name text NOT NULL, available_date date NOT NULL,
    start_time time NOT NULL, end_time time NOT NULL, slot_duration integer NOT NULL DEFAULT 30,
    max_bookings_per_slot integer NOT NULL DEFAULT 1, is_available boolean DEFAULT true, created_at timestamptz DEFAULT now()
  );
  CREATE TABLE public.appointments (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    doctor_name text NOT NULL DEFAULT 'Dr. Mwaka', appointment_date date NOT NULL, appointment_time time NOT NULL,
    status text NOT NULL DEFAULT 'pending', payment_status text NOT NULL DEFAULT 'pending',
    stripe_session_id text, amount numeric NOT NULL DEFAULT 50, patient_notes text,
    created_at timestamptz DEFAULT now(), updated_at timestamptz DEFAULT now()
  );

  -- Later historical migrations replace these workflow definitions before use.
  CREATE FUNCTION public.generate_ambassador_id(p_region text, p_country text) RETURNS text
    LANGUAGE sql SET search_path = public AS $fn$ SELECT 'MAP-' || upper(substr(replace(gen_random_uuid()::text, '-', ''),1,12)) $fn$;
  CREATE FUNCTION public.generate_progressive_ambassador_id() RETURNS text
    LANGUAGE sql SET search_path = public AS $fn$ SELECT public.generate_ambassador_id('Dar es Salaam','Tanzania') $fn$;
  CREATE FUNCTION public.calculate_ambassador_stats(target_user_id uuid) RETURNS void
    LANGUAGE plpgsql SET search_path = public AS $fn$ BEGIN RETURN; END $fn$;
  CREATE FUNCTION public.trigger_update_ambassador_stats() RETURNS trigger
    LANGUAGE plpgsql SET search_path = public AS $fn$ BEGIN RETURN NEW; END $fn$;
  CREATE FUNCTION public.verify_receipt_code(p_receipt_code text, p_uid uuid) RETURNS text
    LANGUAGE plpgsql SET search_path = public AS $fn$ BEGIN RAISE EXCEPTION 'Apply all migrations before activating users'; END $fn$;
  CREATE FUNCTION public.get_email_by_referral_code(input_referral_code text) RETURNS text
    LANGUAGE sql SECURITY DEFINER SET search_path = public AS $fn$
      SELECT u.email::text FROM auth.users u JOIN public.profiles p ON p.id = u.id
      WHERE upper(p.ambassador_id) = upper(btrim(input_referral_code)) OR upper(p.user_referral_id) = upper(btrim(input_referral_code)) LIMIT 1
    $fn$;
  CREATE FUNCTION public.get_user_by_ambassador_id(p_ambassador_id text)
    RETURNS TABLE(email text, full_name text, user_id uuid)
    LANGUAGE sql SECURITY DEFINER SET search_path = public AS $fn$
      SELECT u.email::text, p.full_name, p.id FROM auth.users u JOIN public.profiles p ON p.id = u.id
      WHERE p.id = auth.uid() AND p.ambassador_id = p_ambassador_id
    $fn$;

  ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
  ALTER TABLE public.country_limits ENABLE ROW LEVEL SECURITY;
  ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;
  ALTER TABLE public.receipt_codes ENABLE ROW LEVEL SECURITY;
  ALTER TABLE public.earnings ENABLE ROW LEVEL SECURITY;
  ALTER TABLE public.ambassador_stats ENABLE ROW LEVEL SECURITY;
  ALTER TABLE public.team_bonuses ENABLE ROW LEVEL SECURITY;
  ALTER TABLE public.commission_tiers ENABLE ROW LEVEL SECURITY;
  ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
  ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;
  ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
  ALTER TABLE public.doctor_availability ENABLE ROW LEVEL SECURITY;
  ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
  GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;
  GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
  GRANT SELECT ON public.country_limits, public.products, public.commission_tiers TO anon;
  CREATE POLICY "Country limits visible" ON public.country_limits FOR SELECT USING (true);
  CREATE POLICY "Products visible" ON public.products FOR SELECT USING (is_active);
  CREATE POLICY "Commission tiers visible" ON public.commission_tiers FOR SELECT USING (is_active);
  CREATE POLICY "Availability visible" ON public.doctor_availability FOR SELECT TO authenticated USING (true);
  CREATE POLICY "Own appointments" ON public.appointments FOR SELECT TO authenticated USING (user_id = auth.uid());
  CREATE POLICY "Book own appointment" ON public.appointments FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid() AND status = 'pending' AND payment_status = 'pending' AND stripe_session_id IS NULL);
  CREATE POLICY "Update own appointments" ON public.appointments FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
  CREATE POLICY "Own notifications" ON public.notifications FOR SELECT TO authenticated USING (user_id = auth.uid());
  CREATE POLICY "Read own notifications" ON public.notifications FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
  CREATE POLICY "Own sales" ON public.sales FOR SELECT TO authenticated USING (seller_id = auth.uid() OR customer_id = auth.uid());
END
$bootstrap$;
