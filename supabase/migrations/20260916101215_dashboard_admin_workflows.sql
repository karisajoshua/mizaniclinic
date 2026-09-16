-- Account activation remains an offline receipt workflow. All money is recorded
-- in USD plus its original local amount; changing rates never rewrites earnings.
INSERT INTO public.system_settings(key, value, description) VALUES
 ('premium_commission_rates','{"activation_pack":0.70,"direct_sales":0.35,"second_level":0.20}', 'Premium rates for new transactions'),
 ('admin_alerts','{"registrations":true,"payouts":true,"country_limits":true,"milestones":true}', 'In-app admin alert visibility'),
 ('payment_instructions','{"instructions":"Pay the clinic separately and obtain a receipt code. Enter that code below to activate your account.","support_phone":"+255747100100"}', 'Offline receipt instructions')
ON CONFLICT(key) DO NOTHING;

CREATE TABLE public.admin_audit_log (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), actor_id uuid REFERENCES auth.users(id),
 action text NOT NULL, record_id uuid, details jsonb NOT NULL DEFAULT '{}', created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.admin_audit_log ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON public.admin_audit_log TO authenticated;
GRANT ALL ON public.admin_audit_log TO service_role;
CREATE POLICY "Admin audit read" ON public.admin_audit_log FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));

CREATE OR REPLACE FUNCTION public.save_platform_settings(p_settings jsonb)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE k text; rates jsonb; field text; previous jsonb;
BEGIN
 IF auth.uid() IS NULL OR NOT public.has_role(auth.uid(),'admin') THEN RAISE EXCEPTION 'Only administrators can save settings'; END IF;
 IF jsonb_typeof(p_settings) IS DISTINCT FROM 'object' OR NOT p_settings ?& ARRAY['commission_rates','premium_commission_rates','activation_pack','admin_alerts','payment_instructions'] THEN RAISE EXCEPTION 'Missing settings'; END IF;
 FOREACH k IN ARRAY ARRAY['commission_rates','premium_commission_rates'] LOOP
  rates := p_settings->k;
  FOREACH field IN ARRAY ARRAY['activation_pack','direct_sales','second_level'] LOOP
   IF jsonb_typeof(rates->field) IS DISTINCT FROM 'number' OR (rates->>field)::numeric NOT BETWEEN 0 AND 1 THEN RAISE EXCEPTION 'Commission rates must be between 0 and 1'; END IF;
  END LOOP;
  IF (rates->>'activation_pack')::numeric + (rates->>'second_level')::numeric > 1 OR (rates->>'direct_sales')::numeric + (rates->>'second_level')::numeric > 1 THEN RAISE EXCEPTION 'Combined commissions cannot exceed 100 percent'; END IF;
 END LOOP;
 -- A Standard seller may have a Premium sponsor (and vice versa).
 IF greatest((p_settings->'commission_rates'->>'activation_pack')::numeric,(p_settings->'premium_commission_rates'->>'activation_pack')::numeric,
             (p_settings->'commission_rates'->>'direct_sales')::numeric,(p_settings->'premium_commission_rates'->>'direct_sales')::numeric)
    + greatest((p_settings->'commission_rates'->>'second_level')::numeric,(p_settings->'premium_commission_rates'->>'second_level')::numeric) > 1 THEN RAISE EXCEPTION 'Mixed-tier commissions cannot exceed 100 percent'; END IF;
 FOREACH field IN ARRAY ARRAY['price_usd','price_local'] LOOP
  IF jsonb_typeof(p_settings->'activation_pack'->field) IS DISTINCT FROM 'number' OR (p_settings->'activation_pack'->>field)::numeric <= 0 THEN RAISE EXCEPTION 'Pack prices must be positive'; END IF;
 END LOOP;
 IF p_settings->'activation_pack'->>'currency' IS DISTINCT FROM 'TZS' THEN RAISE EXCEPTION 'Activation local currency must be TZS'; END IF;
 FOREACH field IN ARRAY ARRAY['registrations','payouts','country_limits','milestones'] LOOP
  IF jsonb_typeof(p_settings->'admin_alerts'->field) IS DISTINCT FROM 'boolean' THEN RAISE EXCEPTION 'Alert settings must be booleans'; END IF;
 END LOOP;
 IF jsonb_typeof(p_settings->'payment_instructions'->'instructions') IS DISTINCT FROM 'string'
    OR length(btrim(p_settings->'payment_instructions'->>'instructions')) NOT BETWEEN 1 AND 2000
    OR jsonb_typeof(p_settings->'payment_instructions'->'support_phone') IS DISTINCT FROM 'string'
    OR length(p_settings->'payment_instructions'->>'support_phone') > 40 THEN RAISE EXCEPTION 'Invalid payment instructions'; END IF;
 SELECT jsonb_object_agg(key,value) INTO previous FROM public.system_settings;
 FOREACH k IN ARRAY ARRAY['commission_rates','premium_commission_rates','activation_pack','admin_alerts','payment_instructions'] LOOP
  INSERT INTO public.system_settings(key,value) VALUES(k,p_settings->k) ON CONFLICT(key) DO UPDATE SET value=EXCLUDED.value;
 END LOOP;
 INSERT INTO public.admin_audit_log(actor_id,action,details) VALUES(auth.uid(),'settings_saved',jsonb_build_object('before',previous,'after',p_settings));
END $$;
-- Prevent direct REST writes from skipping validation and the audit log.
REVOKE INSERT, UPDATE, DELETE ON public.system_settings FROM authenticated, anon;

CREATE OR REPLACE FUNCTION public.is_premium_ambassador(p_user uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
 SELECT coalesce((SELECT cl.premium_unlocked OR (
  SELECT count(*) FROM public.profiles p2 WHERE p2.country IN (cl.country_name,cl.country_code) AND p2.status IN ('active','activated')
 ) >= cl.ambassador_limit
 FROM public.profiles p JOIN public.country_limits cl ON p.country IN (cl.country_name,cl.country_code)
 WHERE p.id=p_user AND cl.is_active LIMIT 1),false)
$$;
CREATE OR REPLACE FUNCTION public.commission_rates_for(p_user uuid)
RETURNS jsonb LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
 SELECT value FROM public.system_settings WHERE key = CASE WHEN public.is_premium_ambassador(p_user) THEN 'premium_commission_rates' ELSE 'commission_rates' END
$$;

-- SECURITY INVOKER is deliberate: direct API writes run as authenticated,
-- while authorized SECURITY DEFINER workflows below run as the DB owner.
CREATE OR REPLACE FUNCTION public.guard_profile_privileged_fields()
RETURNS trigger LANGUAGE plpgsql SECURITY INVOKER SET search_path = public AS $$
BEGIN
 IF current_user IN ('postgres','supabase_admin','service_role') THEN RETURN NEW; END IF;
 IF TG_OP = 'INSERT' THEN
  IF coalesce(NEW.status,'pending') <> 'pending' OR coalesce(NEW.payment_status,'pending') <> 'pending'
     OR NEW.receipt_code IS NOT NULL OR NEW.payment_verified_at IS NOT NULL OR NEW.activated_at IS NOT NULL
     OR NEW.ambassador_id IS NOT NULL OR NEW.user_referral_id IS NOT NULL OR NEW.referral_code IS NOT NULL THEN
   RAISE EXCEPTION 'Complete registration and receipt verification using the authorized workflow';
  END IF;
 ELSIF NEW.status IS DISTINCT FROM OLD.status OR NEW.payment_status IS DISTINCT FROM OLD.payment_status
    OR NEW.receipt_code IS DISTINCT FROM OLD.receipt_code OR NEW.activated_at IS DISTINCT FROM OLD.activated_at
    OR NEW.payment_verified_at IS DISTINCT FROM OLD.payment_verified_at OR NEW.ambassador_id IS DISTINCT FROM OLD.ambassador_id
    OR NEW.user_referral_id IS DISTINCT FROM OLD.user_referral_id OR NEW.referral_code IS DISTINCT FROM OLD.referral_code
    OR NEW.country IS DISTINCT FROM OLD.country THEN
  RAISE EXCEPTION 'Activation, payment, referral and country fields require an authorized workflow';
 END IF;
 RETURN NEW;
END $$;
DROP TRIGGER IF EXISTS guard_profile_privileged_fields ON public.profiles;
CREATE TRIGGER guard_profile_privileged_fields BEFORE INSERT OR UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.guard_profile_privileged_fields();

ALTER TABLE public.receipt_codes ADD COLUMN IF NOT EXISTS amount_usd numeric,
 ADD COLUMN IF NOT EXISTS amount_local numeric, ADD COLUMN IF NOT EXISTS currency text;
-- Never invent amounts for already-used legacy receipts. They remain explicitly
-- unvalued in reports until staff reconcile them against the original receipt.
CREATE OR REPLACE FUNCTION public.snapshot_receipt_amount()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE pack jsonb;
BEGIN
 SELECT value INTO pack FROM public.system_settings WHERE key='activation_pack';
 NEW.code := upper(btrim(NEW.code));
 IF NEW.code = '' THEN RAISE EXCEPTION 'Receipt code is required'; END IF;
 NEW.amount_usd := coalesce(NEW.amount_usd,(pack->>'price_usd')::numeric);
 NEW.amount_local := coalesce(NEW.amount_local,(pack->>'price_local')::numeric);
 NEW.currency := coalesce(NEW.currency,pack->>'currency');
 IF NEW.amount_usd <= 0 OR NEW.amount_local <= 0 OR NEW.currency <> 'TZS' THEN RAISE EXCEPTION 'Invalid receipt amount'; END IF;
 RETURN NEW;
END $$;
CREATE TRIGGER snapshot_receipt_amount BEFORE INSERT ON public.receipt_codes FOR EACH ROW EXECUTE FUNCTION public.snapshot_receipt_amount();

CREATE OR REPLACE FUNCTION public.verify_receipt_code(p_receipt_code text, p_uid uuid)
RETURNS text LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_uid uuid := auth.uid(); v_code text := upper(btrim(coalesce(p_receipt_code,'')));
 receipt public.receipt_codes%ROWTYPE; profile public.profiles%ROWTYPE; pack jsonb;
 sponsor uuid; sponsor2 uuid; rate numeric;
BEGIN
 IF v_uid IS NULL OR (p_uid IS NOT NULL AND p_uid <> v_uid) THEN RAISE EXCEPTION 'Not authorised to verify this receipt code'; END IF;
 -- Lock the account before claiming the receipt: concurrent requests cannot
 -- consume different receipts for the same activation.
 SELECT * INTO profile FROM public.profiles WHERE id=v_uid FOR UPDATE;
 IF NOT FOUND OR profile.ambassador_id IS NULL THEN RAISE EXCEPTION 'Complete registration before verifying payment'; END IF;
 IF profile.payment_verified_at IS NOT NULL THEN
  IF profile.receipt_code = v_code AND EXISTS (SELECT 1 FROM public.receipt_codes WHERE upper(btrim(code))=v_code AND used_by=v_uid AND status='used') THEN RETURN 'Receipt already verified'; END IF;
  RAISE EXCEPTION 'This account already has a verified receipt';
 END IF;
 SELECT value INTO pack FROM public.system_settings WHERE key='activation_pack';
 UPDATE public.receipt_codes SET status='used',used_by=v_uid,used_at=now(),
   amount_usd=coalesce(amount_usd,(pack->>'price_usd')::numeric),
   amount_local=coalesce(amount_local,(pack->>'price_local')::numeric), currency=coalesce(currency,pack->>'currency')
 WHERE upper(btrim(code))=v_code AND (status='available' OR (status='used' AND used_by=v_uid)) RETURNING * INTO receipt;
 IF NOT FOUND THEN RAISE EXCEPTION 'Receipt code not found or already used. Please check your code.'; END IF;
 UPDATE public.profiles SET status='active',payment_status='completed',receipt_code=v_code,
  payment_verified_at=now(),activated_at=coalesce(activated_at,now()),updated_at=now() WHERE id=v_uid;
 UPDATE public.referrals SET status='active',activated_date=coalesce(activated_date,now()) WHERE referred_id=v_uid;
 SELECT referrer_id INTO sponsor FROM public.referrals WHERE referred_id=v_uid ORDER BY created_at,id LIMIT 1;
 IF sponsor IS NOT NULL AND sponsor <> v_uid THEN
  rate := (public.commission_rates_for(sponsor)->>'activation_pack')::numeric;
  INSERT INTO public.earnings(user_id,earning_type,amount_usd,amount_local,currency,commission_rate,status,source_transaction_id)
   VALUES(sponsor,'activation_pack',round(receipt.amount_usd*rate,2),round(receipt.amount_local*rate,2),receipt.currency,rate,'pending',v_uid) ON CONFLICT DO NOTHING;
  SELECT referrer_id INTO sponsor2 FROM public.referrals WHERE referred_id=sponsor ORDER BY created_at,id LIMIT 1;
  IF sponsor2 IS NOT NULL AND sponsor2 NOT IN (v_uid,sponsor) THEN
   rate := (public.commission_rates_for(sponsor2)->>'second_level')::numeric;
   INSERT INTO public.earnings(user_id,earning_type,amount_usd,amount_local,currency,commission_rate,status,source_transaction_id)
    VALUES(sponsor2,'second_level',round(receipt.amount_usd*rate,2),round(receipt.amount_local*rate,2),receipt.currency,rate,'pending',v_uid) ON CONFLICT DO NOTHING;
  END IF;
 END IF;
 RETURN 'Receipt verified successfully';
END $$;

CREATE OR REPLACE FUNCTION public.create_sales_commissions()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE sponsor uuid; rate numeric;
BEGIN
 IF NEW.seller_id IS NULL THEN RETURN NEW; END IF;
 IF NEW.total_amount_usd < 0 OR NEW.total_amount_local < 0 THEN RAISE EXCEPTION 'Sale amounts cannot be negative'; END IF;
 IF NEW.product_id IS NOT NULL AND NOT coalesce((SELECT commission_eligible FROM public.products WHERE id=NEW.product_id),false) THEN RETURN NEW; END IF;
 rate := (public.commission_rates_for(NEW.seller_id)->>'direct_sales')::numeric;
 INSERT INTO public.earnings(user_id,earning_type,amount_usd,amount_local,currency,commission_rate,status,source_transaction_id,earned_date)
  VALUES(NEW.seller_id,'direct_sales',round(NEW.total_amount_usd*rate,2),round(NEW.total_amount_local*rate,2),NEW.currency,rate,'pending',NEW.id,coalesce(NEW.sale_date,now())) ON CONFLICT DO NOTHING;
 SELECT referrer_id INTO sponsor FROM public.referrals WHERE referred_id=NEW.seller_id ORDER BY created_at,id LIMIT 1;
 IF sponsor IS NOT NULL AND sponsor <> NEW.seller_id THEN
  rate := (public.commission_rates_for(sponsor)->>'second_level')::numeric;
  INSERT INTO public.earnings(user_id,earning_type,amount_usd,amount_local,currency,commission_rate,status,source_transaction_id,earned_date)
   VALUES(sponsor,'second_level',round(NEW.total_amount_usd*rate,2),round(NEW.total_amount_local*rate,2),NEW.currency,rate,'pending',NEW.id,coalesce(NEW.sale_date,now())) ON CONFLICT DO NOTHING;
 END IF;
 RETURN NEW;
END $$;
-- Only staff/service records of real sales may create commissions.
REVOKE INSERT, UPDATE, DELETE ON public.sales FROM authenticated, anon;
GRANT INSERT ON public.sales TO authenticated;
DROP POLICY IF EXISTS "Staff record sales" ON public.sales;
CREATE POLICY "Staff record sales" ON public.sales AS RESTRICTIVE FOR INSERT TO authenticated WITH CHECK(public.has_role(auth.uid(),'admin'));
CREATE POLICY "Sales staff insert" ON public.sales FOR INSERT TO authenticated WITH CHECK(public.has_role(auth.uid(),'admin'));
DROP POLICY IF EXISTS "Staff read sales" ON public.sales;
CREATE POLICY "Staff read sales" ON public.sales FOR SELECT TO authenticated USING(public.has_role(auth.uid(),'admin'));

ALTER TABLE public.earnings ADD COLUMN IF NOT EXISTS payout_reference text;
CREATE OR REPLACE FUNCTION public.transition_earnings(p_ids uuid[],p_status text,p_reference text DEFAULT NULL)
RETURNS integer LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE n integer; expected text;
BEGIN
 IF auth.uid() IS NULL OR NOT public.has_role(auth.uid(),'admin') THEN RAISE EXCEPTION 'Only administrators can change payout status'; END IF;
 IF p_status IS NULL OR p_status NOT IN ('approved','paid') THEN RAISE EXCEPTION 'Choose approved or paid'; END IF;
 IF coalesce(cardinality(p_ids),0)=0 THEN RETURN 0; END IF;
 IF cardinality(p_ids)>1000 THEN RAISE EXCEPTION 'Process at most 1000 commissions at a time'; END IF;
 expected := CASE p_status WHEN 'approved' THEN 'pending' ELSE 'approved' END;
 IF p_status='paid' AND (p_reference IS NULL OR length(btrim(p_reference)) NOT BETWEEN 3 AND 120) THEN RAISE EXCEPTION 'Enter the completed payment reference'; END IF;
 -- Lock in a stable order. Mixed/stale batches fail atomically.
 PERFORM id FROM public.earnings WHERE id=ANY(p_ids) ORDER BY id FOR UPDATE;
 IF (SELECT count(*) FROM public.earnings WHERE id=ANY(p_ids) AND status=expected) <> (SELECT count(DISTINCT id) FROM unnest(p_ids) id)
   OR array_position(p_ids,NULL) IS NOT NULL THEN RAISE EXCEPTION 'Some commissions no longer have the required status. Refresh and try again.'; END IF;
 UPDATE public.earnings SET status=p_status,
  approved_date=CASE WHEN p_status='approved' THEN now() ELSE approved_date END,
  paid_date=CASE WHEN p_status='paid' THEN now() ELSE paid_date END,
  payout_reference=CASE WHEN p_status='paid' THEN btrim(p_reference) ELSE payout_reference END WHERE id=ANY(p_ids);
 GET DIAGNOSTICS n=ROW_COUNT;
 INSERT INTO public.admin_audit_log(actor_id,action,record_id,details)
 SELECT auth.uid(),'commission_'||p_status,id,jsonb_build_object('reference',p_reference,'amount_usd',amount_usd) FROM public.earnings WHERE id=ANY(p_ids);
 RETURN n;
END $$;
-- Retire the shortcut RPC and direct status updates (including admin REST).
REVOKE ALL ON FUNCTION public.set_earnings_status(uuid[],text) FROM PUBLIC, anon, authenticated;
REVOKE INSERT, UPDATE, DELETE ON public.earnings FROM authenticated, anon;

CREATE OR REPLACE FUNCTION public.approve_verified_ambassadors(p_ids uuid[])
RETURNS integer LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE n integer;
BEGIN
 IF auth.uid() IS NULL OR NOT public.has_role(auth.uid(),'admin') THEN RAISE EXCEPTION 'Only administrators can approve ambassadors'; END IF;
 IF coalesce(cardinality(p_ids),0)=0 THEN RETURN 0; END IF;
 PERFORM id FROM public.profiles WHERE id=ANY(p_ids) ORDER BY id FOR UPDATE;
 IF EXISTS(SELECT 1 FROM unnest(p_ids) i LEFT JOIN public.profiles p ON p.id=i
   WHERE p.id IS NULL OR p.payment_verified_at IS NULL OR p.payment_status NOT IN ('completed','confirmed','paid')
   OR NOT EXISTS(SELECT 1 FROM public.receipt_codes r WHERE upper(btrim(r.code))=p.receipt_code AND r.used_by=p.id AND r.status='used')) THEN
  RAISE EXCEPTION 'Every account must verify its receipt before approval';
 END IF;
 UPDATE public.profiles SET status='active',activated_at=coalesce(activated_at,now()),updated_at=now() WHERE id=ANY(p_ids) AND status='pending';
 GET DIAGNOSTICS n=ROW_COUNT;
 INSERT INTO public.admin_audit_log(actor_id,action,details) VALUES(auth.uid(),'verified_accounts_approved',jsonb_build_object('ids',p_ids,'count',n));
 RETURN n;
END $$;

CREATE OR REPLACE FUNCTION public.sync_country_membership()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
 IF TG_OP <> 'INSERT' AND OLD.status IN ('active','activated') THEN
  UPDATE public.country_limits SET current_count=greatest(0,current_count-1),updated_at=now() WHERE OLD.country IN (country_name,country_code);
 END IF;
 IF TG_OP <> 'DELETE' AND NEW.status IN ('active','activated') THEN
  UPDATE public.country_limits SET current_count=current_count+1,updated_at=now() WHERE NEW.country IN (country_name,country_code);
 END IF;
 RETURN coalesce(NEW,OLD);
END $$;
CREATE TRIGGER sync_country_membership AFTER INSERT OR UPDATE OF status,country OR DELETE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.sync_country_membership();
UPDATE public.country_limits cl SET current_count=(SELECT count(*) FROM public.profiles p WHERE p.country IN(cl.country_name,cl.country_code) AND p.status IN ('active','activated'));

-- Reinstall the stats triggers missing from the original migration history.
DO $$ DECLARE t record; BEGIN
 FOR t IN SELECT tgname, tgrelid::regclass AS relation FROM pg_trigger
  WHERE NOT tgisinternal AND tgfoid='public.trigger_update_ambassador_stats()'::regprocedure AND tgrelid IN ('public.earnings'::regclass,'public.referrals'::regclass)
 LOOP EXECUTE format('DROP TRIGGER %I ON %s',t.tgname,t.relation); END LOOP;
END $$;
CREATE OR REPLACE FUNCTION public.trigger_update_ambassador_stats()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE previous_user uuid; next_user uuid;
BEGIN
 IF TG_OP <> 'INSERT' THEN
  IF TG_TABLE_NAME='referrals' THEN previous_user:=OLD.referrer_id; ELSE previous_user:=OLD.user_id; END IF;
 END IF;
 IF TG_OP <> 'DELETE' THEN
  IF TG_TABLE_NAME='referrals' THEN next_user:=NEW.referrer_id; ELSE next_user:=NEW.user_id; END IF;
 END IF;
 IF previous_user IS NOT NULL THEN PERFORM public.calculate_ambassador_stats(previous_user); END IF;
 IF next_user IS NOT NULL AND next_user IS DISTINCT FROM previous_user THEN PERFORM public.calculate_ambassador_stats(next_user); END IF;
 RETURN coalesce(NEW,OLD);
END $$;
CREATE TRIGGER sync_earnings_stats AFTER INSERT OR UPDATE OR DELETE ON public.earnings FOR EACH ROW EXECUTE FUNCTION public.trigger_update_ambassador_stats();
CREATE TRIGGER sync_referral_stats AFTER INSERT OR UPDATE OR DELETE ON public.referrals FOR EACH ROW EXECUTE FUNCTION public.trigger_update_ambassador_stats();
REVOKE ALL ON FUNCTION public.calculate_ambassador_stats(uuid),public.commission_rates_for(uuid),public.is_premium_ambassador(uuid),public.generate_ambassador_id(text,text),public.generate_progressive_ambassador_id() FROM PUBLIC,anon,authenticated;
REVOKE INSERT,UPDATE,DELETE ON public.referrals FROM authenticated,anon;
-- Admin analytics and member totals aggregate source records directly, so they
-- remain accurate even if an old cached stats row was never recalculated.
CREATE INDEX IF NOT EXISTS earnings_user_status_idx ON public.earnings(user_id,status);
CREATE INDEX IF NOT EXISTS earnings_earned_idx ON public.earnings(earned_date);
CREATE INDEX IF NOT EXISTS earnings_paid_idx ON public.earnings(paid_date) WHERE status='paid';
CREATE INDEX IF NOT EXISTS referrals_sponsor_idx ON public.referrals(referrer_id,status);
CREATE INDEX IF NOT EXISTS profiles_country_status_idx ON public.profiles(country,status);

CREATE OR REPLACE FUNCTION public.get_ambassador_dashboard()
RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
DECLARE uid uuid:=auth.uid(); result jsonb; own_country text; country public.country_limits%ROWTYPE;
 bike public.team_bonuses%ROWTYPE; car public.team_bonuses%ROWTYPE;
 day_start timestamptz:=date_trunc('day',now() AT TIME ZONE 'Africa/Dar_es_Salaam') AT TIME ZONE 'Africa/Dar_es_Salaam';
 week_start timestamptz:=date_trunc('week',now() AT TIME ZONE 'Africa/Dar_es_Salaam') AT TIME ZONE 'Africa/Dar_es_Salaam';
 today date:=(now() AT TIME ZONE 'Africa/Dar_es_Salaam')::date;
BEGIN
 IF uid IS NULL THEN RAISE EXCEPTION 'Sign in to view your dashboard'; END IF;
 SELECT p.country INTO own_country FROM public.profiles p WHERE p.id=uid;
 SELECT * INTO country FROM public.country_limits cl WHERE own_country IN(cl.country_name,cl.country_code) AND is_active LIMIT 1;
 SELECT * INTO bike FROM public.team_bonuses WHERE user_id=uid AND bonus_type='motorbike'
   AND (period_start IS NULL OR period_start<=today) AND (period_end IS NULL OR period_end>=today) ORDER BY updated_at DESC,id LIMIT 1;
 SELECT * INTO car FROM public.team_bonuses WHERE user_id=uid AND bonus_type='car'
   AND period_start<=today AND period_end>=today ORDER BY updated_at DESC,id LIMIT 1;
 SELECT jsonb_build_object(
  'totalEarnings',coalesce(sum(amount_usd) FILTER(WHERE status<>'cancelled'),0),
  'pendingEarnings',coalesce(sum(amount_usd) FILTER(WHERE status='pending'),0),
  'approvedEarnings',coalesce(sum(amount_usd) FILTER(WHERE status='approved'),0),
  'paidEarnings',coalesce(sum(amount_usd) FILTER(WHERE status='paid'),0),
  'todayEarnings',coalesce(sum(amount_usd) FILTER(WHERE status<>'cancelled' AND earned_date>=day_start AND earned_date<day_start+interval '1 day'),0),
  'activationPackEarnings',coalesce(sum(amount_usd) FILTER(WHERE status<>'cancelled' AND earning_type='activation_pack'),0),
  'directReferralEarnings',coalesce(sum(amount_usd) FILTER(WHERE status<>'cancelled' AND earning_type='direct_sales'),0),
  'secondLevelEarnings',coalesce(sum(amount_usd) FILTER(WHERE status<>'cancelled' AND earning_type='second_level'),0)
 ) INTO result FROM public.earnings WHERE user_id=uid;
 result:=result||(SELECT jsonb_build_object(
  'totalReferrals',count(*),'activeReferrals',count(*) FILTER(WHERE status='active'),
  'pendingReferrals',count(*) FILTER(WHERE status='pending'),
  'referralsThisWeek',count(*) FILTER(WHERE joined_date>=week_start AND joined_date<week_start+interval '1 week')
 ) FROM public.referrals WHERE referrer_id=uid);
 RETURN result||jsonb_build_object(
  'countriesReached',(SELECT count(DISTINCT cl.id) FROM public.referrals r JOIN public.country_limits cl ON r.country IN(cl.country_name,cl.country_code) WHERE r.referrer_id=uid AND r.status='active' AND cl.is_active),
  'availableCountries',(SELECT count(*) FROM public.country_limits WHERE is_active),
  'referralsByCountry',coalesce((SELECT jsonb_object_agg(name,n) FROM (SELECT coalesce(cl.country_name,r.country,'Unknown') name,count(*) n FROM public.referrals r LEFT JOIN public.country_limits cl ON r.country IN(cl.country_name,cl.country_code) WHERE referrer_id=uid AND r.status='active' GROUP BY 1) countries),'{}'::jsonb),
  'motorbikeTarget',coalesce(bike.target_amount_usd,400),'carTarget',coalesce(car.target_amount_usd,2400),
  'teamProgressLevel1',coalesce(bike.current_amount_usd,0),'teamProgressLevel2',coalesce(car.current_amount_usd,0),
  'motorbikeAchieved',coalesce(bike.achieved,false),'carAchieved',coalesce(car.achieved,false),
  'countryName',coalesce(country.country_name,own_country,''),'ambassadorLimit',coalesce(country.ambassador_limit,0),
  'countryActiveCount',coalesce(country.current_count,0),
  'currentCommissionTier',CASE WHEN public.is_premium_ambassador(uid) THEN 'Premium' ELSE 'Standard' END,
  'commissionRates',public.commission_rates_for(uid),
  'premiumRates',(SELECT value FROM public.system_settings WHERE key='premium_commission_rates'),
  'nextPayoutDate',(SELECT next_payout_date FROM public.ambassador_stats WHERE user_id=uid)
 );
END $$;

CREATE OR REPLACE FUNCTION public.get_admin_report(p_months integer DEFAULT 6)
RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
DECLARE metrics jsonb; result jsonb; activation numeric; sales numeric; appointments numeric;
 month_start timestamptz:=date_trunc('month',now() AT TIME ZONE 'Africa/Dar_es_Salaam') AT TIME ZONE 'Africa/Dar_es_Salaam';
BEGIN
 IF auth.uid() IS NULL OR NOT public.has_role(auth.uid(),'admin') THEN RAISE EXCEPTION 'Only administrators can view reports'; END IF;
 IF p_months IS NULL OR p_months NOT BETWEEN 1 AND 24 THEN RAISE EXCEPTION 'Choose 1 to 24 months'; END IF;
 SELECT coalesce(sum(amount_usd),0) INTO activation FROM public.receipt_codes WHERE status='used';
 SELECT coalesce(sum(total_amount_usd),0) INTO sales FROM public.sales;
 SELECT coalesce(sum(amount),0) INTO appointments FROM public.appointments WHERE payment_status='paid';
 SELECT jsonb_build_object('totalUsers',count(*),'activeUsers',count(*) FILTER(WHERE status IN ('active','activated')),
  'pendingUsers',count(*) FILTER(WHERE status='pending')) INTO metrics FROM public.profiles;
 metrics:=metrics||(SELECT jsonb_build_object(
  'pendingPayoutsUsd',coalesce(sum(amount_usd) FILTER(WHERE status='pending'),0),'pendingPayoutCount',count(*) FILTER(WHERE status='pending'),
  'approvedPayoutsUsd',coalesce(sum(amount_usd) FILTER(WHERE status='approved'),0),'approvedPayoutCount',count(*) FILTER(WHERE status='approved'),
  'paidThisMonthUsd',coalesce(sum(amount_usd) FILTER(WHERE status='paid' AND paid_date>=month_start AND paid_date<month_start+interval '1 month'),0),
  'paidThisMonthCount',count(*) FILTER(WHERE status='paid' AND paid_date>=month_start AND paid_date<month_start+interval '1 month')
 ) FROM public.earnings);
 metrics:=metrics||jsonb_build_object('totalRevenueUsd',activation+sales+appointments,
  'activationRevenueUsd',activation,'salesRevenueUsd',sales,'appointmentRevenueUsd',appointments,
  'activationRevenueEstimated',(SELECT count(*) FROM public.receipt_codes WHERE status='used' AND amount_usd IS NULL));
 result:=jsonb_build_object('metrics',metrics);
 result:=result||jsonb_build_object('monthly',(
  SELECT jsonb_agg(jsonb_build_object('month',to_char(m AT TIME ZONE 'Africa/Dar_es_Salaam','YYYY-MM'),
   'ambassadors',(SELECT count(*) FROM public.profiles WHERE coalesce(registration_date,created_at)>=m AND coalesce(registration_date,created_at)<m+interval '1 month'),
   'earnings',(SELECT coalesce(sum(amount_usd),0) FROM public.earnings WHERE status<>'cancelled' AND earned_date>=m AND earned_date<m+interval '1 month'),
   'paid',(SELECT coalesce(sum(amount_usd),0) FROM public.earnings WHERE status='paid' AND paid_date>=m AND paid_date<m+interval '1 month')) ORDER BY m)
  FROM generate_series(month_start-make_interval(months=>p_months-1),month_start,interval '1 month') m));
 result:=result||jsonb_build_object('countries',coalesce((SELECT jsonb_agg(jsonb_build_object('name',name,'value',n) ORDER BY n DESC,name)
  FROM (SELECT coalesce(cl.country_name,p.country,'Unknown') name,count(*) n FROM public.profiles p LEFT JOIN public.country_limits cl ON p.country IN(cl.country_name,cl.country_code) GROUP BY 1) counts),'[]'::jsonb));
 result:=result||jsonb_build_object('earningsBreakdown',coalesce((SELECT jsonb_agg(jsonb_build_object('type',earning_type,'amount',amount) ORDER BY earning_type)
  FROM (SELECT earning_type,sum(amount_usd) amount FROM public.earnings WHERE status<>'cancelled' AND earned_date>=month_start-make_interval(months=>p_months-1) AND earned_date<month_start+interval '1 month' GROUP BY earning_type) groups),'[]'::jsonb));
 result:=result||jsonb_build_object('topPerformers',coalesce((SELECT jsonb_agg(to_jsonb(ranking) ORDER BY earnings DESC,name)
  FROM (SELECT coalesce(p.full_name,'Unnamed') name,coalesce(p.region,'Unknown') region,
    (SELECT count(*) FROM public.referrals WHERE referrer_id=p.id AND status='active') referrals,
    coalesce(sum(e.amount_usd) FILTER(WHERE e.status<>'cancelled'),0) earnings
   FROM public.profiles p LEFT JOIN public.earnings e ON e.user_id=p.id AND e.earned_date>=month_start-make_interval(months=>p_months-1) AND e.earned_date<month_start+interval '1 month' GROUP BY p.id ORDER BY earnings DESC,p.id LIMIT 10) ranking),'[]'::jsonb));
 RETURN result;
END $$;

CREATE OR REPLACE FUNCTION public.get_recent_referrals()
RETURNS TABLE(name text, join_date date, location text, status text)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
 SELECT coalesce(p.full_name,'Ambassador'),(r.joined_date AT TIME ZONE 'Africa/Dar_es_Salaam')::date,
  coalesce(p.region,r.country,''),r.status FROM public.referrals r JOIN public.profiles p ON p.id=r.referred_id
 WHERE r.referrer_id=auth.uid() ORDER BY r.joined_date DESC,r.id LIMIT 10
$$;

REVOKE ALL ON FUNCTION public.save_platform_settings(jsonb),public.transition_earnings(uuid[],text,text),public.approve_verified_ambassadors(uuid[]),public.get_ambassador_dashboard(),public.get_admin_report(integer),public.get_recent_referrals() FROM PUBLIC,anon;
GRANT EXECUTE ON FUNCTION public.save_platform_settings(jsonb),public.transition_earnings(uuid[],text,text),public.approve_verified_ambassadors(uuid[]),public.get_ambassador_dashboard(),public.get_admin_report(integer),public.get_recent_referrals() TO authenticated;
REVOKE ALL ON FUNCTION public.has_role(uuid,public.app_role),public.get_user_by_ambassador_id(text) FROM PUBLIC,anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid,public.app_role),public.get_user_by_ambassador_id(text) TO authenticated;
GRANT SELECT,INSERT ON public.iris_analyses TO authenticated;

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

  IF v_referrer = v_uid THEN RAISE EXCEPTION 'You cannot refer yourself'; END IF;

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


CREATE OR REPLACE FUNCTION public.get_admin_ambassadors()
RETURNS TABLE(id uuid,full_name text,phone text,region text,country text,ambassador_id text,
 status text,joined_at timestamptz,activated_at timestamptz,total_referrals bigint,active_referrals bigint,total_earnings numeric,tier text,receipt_verified boolean)
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
BEGIN
 IF auth.uid() IS NULL OR NOT public.has_role(auth.uid(),'admin') THEN RAISE EXCEPTION 'Only administrators can view ambassadors'; END IF;
 RETURN QUERY
 WITH earnings_totals AS (SELECT e.user_id,sum(e.amount_usd) total FROM public.earnings e WHERE e.status<>'cancelled' GROUP BY e.user_id),
 referral_totals AS (SELECT r.referrer_id,count(*) total,count(*) FILTER(WHERE r.status='active') active FROM public.referrals r GROUP BY r.referrer_id)
 SELECT p.id,p.full_name,p.phone,p.region,p.country,p.ambassador_id,p.status,coalesce(p.registration_date,p.created_at),p.activated_at,
 coalesce(r.total,0),coalesce(r.active,0),coalesce(e.total,0),CASE WHEN public.is_premium_ambassador(p.id) THEN 'Premium' ELSE 'Standard' END,
 (p.payment_verified_at IS NOT NULL AND p.payment_status IN ('completed','confirmed','paid') AND EXISTS(SELECT 1 FROM public.receipt_codes rc WHERE rc.used_by=p.id AND rc.status='used' AND upper(btrim(rc.code))=p.receipt_code))
 FROM public.profiles p LEFT JOIN earnings_totals e ON e.user_id=p.id LEFT JOIN referral_totals r ON r.referrer_id=p.id;
END $$;
REVOKE ALL ON FUNCTION public.get_admin_ambassadors() FROM PUBLIC,anon;
GRANT EXECUTE ON FUNCTION public.get_admin_ambassadors() TO authenticated;
