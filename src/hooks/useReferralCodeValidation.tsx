
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface ReferralValidationResult {
  isValid: boolean;
  isChecking: boolean;
  sponsorName: string | null;
  error: string | null;
}

export const useReferralCodeValidation = (referralCode: string) => {
  const [result, setResult] = useState<ReferralValidationResult>({
    isValid: false,
    isChecking: false,
    sponsorName: null,
    error: null
  });

  useEffect(() => {
    // Reset state if code is empty
    if (!referralCode.trim()) {
      setResult({
        isValid: false,
        isChecking: false,
        sponsorName: null,
        error: null
      });
      return;
    }

    // Only validate if format is correct
    const isValidFormat = /^MCA25-[A-Z0-9]+$/.test(referralCode);
    if (!isValidFormat) {
      setResult({
        isValid: false,
        isChecking: false,
        sponsorName: null,
        error: null
      });
      return;
    }

    // Debounce the validation
    const timeoutId = setTimeout(async () => {
      setResult(prev => ({ ...prev, isChecking: true, error: null }));

      try {
        console.log('Validating referral code:', referralCode);
        
        const { data: profiles, error } = await supabase
          .from('profiles')
          .select('full_name, ambassador_id, user_referral_id')
          .or(`ambassador_id.eq."${referralCode}",user_referral_id.eq."${referralCode}"`)
          .limit(1);

        if (error) {
          console.error('Error validating referral code:', error);
          setResult({
            isValid: false,
            isChecking: false,
            sponsorName: null,
            error: 'Error checking referral code. Please try again.'
          });
          return;
        }

        if (profiles && profiles.length > 0) {
          const sponsor = profiles[0];
          console.log('Valid referral code found from:', sponsor.full_name);
          setResult({
            isValid: true,
            isChecking: false,
            sponsorName: sponsor.full_name || 'Unknown Sponsor',
            error: null
          });
        } else {
          console.log('No profile found for referral code:', referralCode);
          setResult({
            isValid: false,
            isChecking: false,
            sponsorName: null,
            error: 'Referral code not found. Please check and try again.'
          });
        }
      } catch (error) {
        console.error('Unexpected error validating referral code:', error);
        setResult({
          isValid: false,
          isChecking: false,
          sponsorName: null,
          error: 'Unexpected error occurred. Please try again.'
        });
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(timeoutId);
  }, [referralCode]);

  return result;
};
