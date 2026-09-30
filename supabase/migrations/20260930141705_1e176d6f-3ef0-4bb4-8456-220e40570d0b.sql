CREATE OR REPLACE FUNCTION public.guard_profile_privileged_fields()
 RETURNS trigger LANGUAGE plpgsql SECURITY INVOKER SET search_path TO 'public'
AS $function$
BEGIN
  -- Updates made inside trusted server functions (verify_receipt_code,
  -- register_ambassador) run as the function owner, not as the member.
  IF current_user NOT IN ('authenticated', 'anon') THEN
    RETURN NEW;
  END IF;

  IF auth.uid() IS NULL
     OR public.has_role(auth.uid(), 'admin') THEN
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
$function$;

-- Settings are only readable by signed-in users
DROP POLICY IF EXISTS "Anyone can read settings" ON public.system_settings;
REVOKE SELECT ON public.system_settings FROM anon;
CREATE POLICY "Signed-in users can read settings" ON public.system_settings
  FOR SELECT TO authenticated USING (auth.uid() IS NOT NULL);