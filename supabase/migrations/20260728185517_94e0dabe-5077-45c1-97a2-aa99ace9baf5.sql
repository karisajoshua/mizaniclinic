-- 1. Roles system
DO $$ BEGIN
  CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins manage roles" ON public.user_roles;
CREATE POLICY "Admins manage roles"
  ON public.user_roles FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Seed existing admins
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::public.app_role FROM auth.users
WHERE lower(email) IN ('admin@mizaniclinic.com', 'tessangelika@gmail.com')
ON CONFLICT (user_id, role) DO NOTHING;

-- 2. Safe referrer lookup for registration (replaces public read of profiles)
CREATE OR REPLACE FUNCTION public.lookup_referrer(p_code text)
RETURNS TABLE(id uuid, full_name text)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT p.id, p.full_name
  FROM public.profiles p
  WHERE p.ambassador_id = p_code OR p.user_referral_id = p_code
  LIMIT 1
$$;

GRANT EXECUTE ON FUNCTION public.lookup_referrer(text) TO anon, authenticated;

-- 3. Lock down profiles
DROP POLICY IF EXISTS "Enable read access for all users" ON public.profiles;
DROP POLICY IF EXISTS "Allow update for authenticated users" ON public.profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.profiles;

CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT TO authenticated
  USING (id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT TO authenticated
  WITH CHECK (id = auth.uid());

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE TO authenticated
  USING (id = auth.uid() OR public.has_role(auth.uid(), 'admin'))
  WITH CHECK (id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

-- 4. Receipt codes
DROP POLICY IF EXISTS "Allow update for authenticated users" ON public.receipt_codes;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.receipt_codes;
DROP POLICY IF EXISTS "Allow users to view available codes" ON public.receipt_codes;

CREATE POLICY "Admins can view receipt codes"
  ON public.receipt_codes FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR used_by = auth.uid());

CREATE POLICY "Admins can insert receipt codes"
  ON public.receipt_codes FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update receipt codes"
  ON public.receipt_codes FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 5. Stats / earnings / bonuses: remove blanket public write access
DROP POLICY IF EXISTS "Enable read access for all users" ON public.ambassador_stats;
DROP POLICY IF EXISTS "System can insert/update stats" ON public.ambassador_stats;
DROP POLICY IF EXISTS "System can manage stats" ON public.ambassador_stats;
DROP POLICY IF EXISTS "System can update stats" ON public.ambassador_stats;

CREATE POLICY "Users can view their own stats"
  ON public.ambassador_stats FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins manage stats"
  ON public.ambassador_stats FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "System can insert earnings" ON public.earnings;
DROP POLICY IF EXISTS "System can manage earnings" ON public.earnings;
DROP POLICY IF EXISTS "Users can view their earnings" ON public.earnings;
DROP POLICY IF EXISTS "Users can view their own earnings" ON public.earnings;

CREATE POLICY "Users can view their own earnings"
  ON public.earnings FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins manage earnings"
  ON public.earnings FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "System can insert/update team bonuses" ON public.team_bonuses;
DROP POLICY IF EXISTS "System can manage bonuses" ON public.team_bonuses;
DROP POLICY IF EXISTS "System can update team bonuses" ON public.team_bonuses;
DROP POLICY IF EXISTS "Users can view their bonuses" ON public.team_bonuses;
DROP POLICY IF EXISTS "Users can view their own team bonuses" ON public.team_bonuses;

CREATE POLICY "Users can view their own team bonuses"
  ON public.team_bonuses FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins manage team bonuses"
  ON public.team_bonuses FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 6. Referrals: only the signing-up user can create their referral row
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.referrals;
CREATE POLICY "Referred user can create referral"
  ON public.referrals FOR INSERT TO authenticated
  WITH CHECK (referred_id = auth.uid());

DROP POLICY IF EXISTS "Users can view referrals they are involved in" ON public.referrals;
DROP POLICY IF EXISTS "Users can view their referrals" ON public.referrals;
CREATE POLICY "Users can view their referrals"
  ON public.referrals FOR SELECT TO authenticated
  USING (referrer_id = auth.uid() OR referred_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

-- 7. Iris analyses: use role instead of hardcoded emails
DROP POLICY IF EXISTS "Admins can view all iris analyses" ON public.iris_analyses;
CREATE POLICY "Admins can view all iris analyses"
  ON public.iris_analyses FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- 8. Country limits: admins can manage
DROP POLICY IF EXISTS "Admins manage country limits" ON public.country_limits;
CREATE POLICY "Admins manage country limits"
  ON public.country_limits FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

GRANT SELECT, INSERT, UPDATE, DELETE ON public.country_limits TO authenticated;
GRANT SELECT, UPDATE ON public.ambassador_stats TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.earnings TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.team_bonuses TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.receipt_codes TO authenticated;

-- 9. doctor_availability: drop blanket manage policy (edge functions use service role)
DROP POLICY IF EXISTS "Edge functions can manage availability" ON public.doctor_availability;
DROP POLICY IF EXISTS "Admins manage availability" ON public.doctor_availability;
CREATE POLICY "Admins manage availability"
  ON public.doctor_availability FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
