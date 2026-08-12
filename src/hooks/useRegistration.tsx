
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

export interface RegistrationData {
  fullName: string;
  email: string;
  password: string;
  referralCode: string;
  region: string;
  country: string;
  phone: string;
}

export const useRegistration = () => {
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const submitRegistration = async (formData: RegistrationData) => {
    setLoading(true);

    try {
      // Validate referral code exists (security definer RPC — no public profile access)
      const { data: referrerRows, error: referrerError } = await supabase
        .rpc('lookup_referrer', { p_code: formData.referralCode });

      const referrerProfile = Array.isArray(referrerRows) ? referrerRows[0] : referrerRows;

      if (referrerError || !referrerProfile) {
        toast({
          title: "Invalid Referral Code",
          description: `The referral code "${formData.referralCode}" does not exist. Please check the code and try again.`,
          variant: "destructive",
        });
        return;
      }

      // Create the user account (auto signs in)
      const { error: authError } = await signUp(formData.email, formData.password, formData.fullName);

      if (authError) {
        toast({
          title: "Registration Failed",
          description: authError.message,
          variant: "destructive",
        });
        return;
      }

      const { data: { user }, error: getUserError } = await supabase.auth.getUser();

      if (getUserError || !user) {
        toast({
          title: "Registration Failed",
          description: getUserError?.message || "Could not establish a session after sign up. Please sign in and try again.",
          variant: "destructive",
        });
        return;
      }

      // Create profile + referral atomically on the server
      const { data: ambassadorId, error: regError } = await supabase.rpc(
        'register_ambassador' as any,
        {
          p_full_name: formData.fullName,
          p_phone: formData.phone,
          p_region: formData.region,
          p_country: formData.country,
          p_referral_code: formData.referralCode,
        }
      );

      if (regError || !ambassadorId) {
        console.error('Registration RPC error:', regError);
        toast({
          title: "Registration Failed",
          description: regError?.message || "Could not create your ambassador profile. Please try again.",
          variant: "destructive",
        });
        return;
      }

      const registrationData = {
        fullName: formData.fullName,
        email: formData.email,
        region: formData.region,
        country: formData.country,
        referralCode: formData.referralCode,
        phone: formData.phone,
        ambassadorId: ambassadorId as string,
        userId: user.id,
        registrationDate: new Date().toISOString()
      };

      localStorage.setItem('registrationData', JSON.stringify(registrationData));

      toast({
        title: "Registration Successful!",
        description: `Your Ambassador ID is ${ambassadorId}. Please complete payment to activate your account.`,
      });

      navigate('/payment');

    } catch (error: any) {
      console.error('Unexpected registration error:', error);
      toast({
        title: "Registration Failed",
        description: error?.message || "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    submitRegistration
  };
};
