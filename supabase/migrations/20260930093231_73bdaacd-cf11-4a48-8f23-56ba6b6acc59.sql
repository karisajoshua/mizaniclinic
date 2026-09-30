CREATE OR REPLACE FUNCTION public.phone_registered(p_phone text)
RETURNS text LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
DECLARE d text := regexp_replace(coalesce(p_phone,''), '\D', '', 'g'); n text; l text; r text;
BEGIN
  IF d = '' THEN RETURN NULL; END IF;
  IF d LIKE '0%' THEN n := '255' || substr(d,2); ELSE n := d; END IF;
  IF n LIKE '255%' THEN l := '0' || substr(n,4); ELSE l := n; END IF;
  SELECT coalesce(p.ambassador_id, 'existing account') INTO r
  FROM auth.users u LEFT JOIN public.profiles p ON p.id = u.id
  WHERE u.email IN (n || '@ambassadors.mizanihealth.app', l || '@ambassadors.mizanihealth.app', d || '@ambassadors.mizanihealth.app')
  LIMIT 1;
  RETURN r;
END; $$;
REVOKE ALL ON FUNCTION public.phone_registered(text) FROM public;
GRANT EXECUTE ON FUNCTION public.phone_registered(text) TO anon, authenticated;