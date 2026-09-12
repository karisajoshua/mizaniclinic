
CREATE OR REPLACE FUNCTION public.trigger_update_ambassador_stats()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
DECLARE
  v_user uuid;
BEGIN
  IF TG_TABLE_NAME = 'referrals' THEN
    v_user := CASE WHEN TG_OP = 'DELETE' THEN OLD.referrer_id ELSE NEW.referrer_id END;
  ELSE
    v_user := CASE WHEN TG_OP = 'DELETE' THEN OLD.user_id ELSE NEW.user_id END;
  END IF;

  IF v_user IS NOT NULL THEN
    PERFORM public.calculate_ambassador_stats(v_user);
  END IF;

  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  END IF;
  RETURN NEW;
END;
$function$;
