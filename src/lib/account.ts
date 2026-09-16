import type { Tables } from '@/integrations/supabase/types';

type PaymentProfile = Pick<Tables<'profiles'>, 'status' | 'payment_status' | 'payment_verified_at' | 'receipt_code'>;

// Navigation state and local storage are never evidence of payment.
export function hasVerifiedPayment(profile: PaymentProfile | null | undefined): boolean {
  return Boolean(profile && ['active', 'activated'].includes(profile.status ?? '') &&
    ['completed', 'confirmed', 'paid'].includes(profile.payment_status ?? '') &&
    profile.payment_verified_at && profile.receipt_code?.trim());
}
