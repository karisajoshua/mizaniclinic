\set ON_ERROR_STOP on
BEGIN;
SELECT set_config('mizani.bootstrap_email', :'admin_email', true);
DO $$
DECLARE uid uuid; ambassador text;
BEGIN
 SELECT id INTO uid FROM auth.users WHERE lower(email)=lower(current_setting('mizani.bootstrap_email'));
 IF uid IS NULL THEN RAISE EXCEPTION 'Create this exact account in Supabase Auth first'; END IF;
 INSERT INTO public.user_roles(user_id,role) VALUES(uid,'admin') ON CONFLICT(user_id,role) DO NOTHING;
 IF NOT EXISTS(SELECT 1 FROM public.profiles WHERE id=uid) THEN
  ambassador:=public.generate_ambassador_id('Dar es Salaam','Tanzania');
  INSERT INTO public.profiles(id,full_name,country,region,ambassador_id,user_referral_id,status,payment_status)
  VALUES(uid,'Clinic Administrator','Tanzania','Dar es Salaam',ambassador,ambassador,'pending','pending');
 END IF;
END $$;
SELECT p.ambassador_id FROM public.profiles p JOIN auth.users u ON p.id=u.id WHERE lower(u.email)=lower(current_setting('mizani.bootstrap_email'));
COMMIT;
