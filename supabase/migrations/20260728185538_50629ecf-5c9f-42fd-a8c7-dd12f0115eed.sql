ALTER FUNCTION public.calculate_ambassador_stats(uuid) SET search_path = public;
ALTER FUNCTION public.generate_ambassador_id(text, text) SET search_path = public;
ALTER FUNCTION public.generate_progressive_ambassador_id() SET search_path = public;
ALTER FUNCTION public.get_email_by_referral_code(text) SET search_path = public;
ALTER FUNCTION public.get_user_by_ambassador_id(text) SET search_path = public;
ALTER FUNCTION public.trigger_update_ambassador_stats() SET search_path = public;
ALTER FUNCTION public.verify_receipt_code(text, uuid) SET search_path = public;

REVOKE EXECUTE ON FUNCTION public.calculate_ambassador_stats(uuid) FROM anon;
REVOKE EXECUTE ON FUNCTION public.get_user_by_ambassador_id(text) FROM anon;
REVOKE EXECUTE ON FUNCTION public.verify_receipt_code(text, uuid) FROM anon;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM anon;

DROP POLICY IF EXISTS "System can insert notifications" ON public.notifications;
CREATE POLICY "Admins can insert notifications"
  ON public.notifications FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));