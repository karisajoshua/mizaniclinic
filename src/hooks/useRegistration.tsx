
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

export interface RegistrationData {
  fullName: string;
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

      // Normalise phone: 0712..., +255 712..., 255712... all become 255712...
      let phoneDigits = formData.phone.replace(/\D/g, '');
      if (phoneDigits.startsWith('0')) phoneDigits = '255' + phoneDigits.slice(1);
      const internalEmail = `${phoneDigits}@ambassadors.mizanihealth.app`;

      const takenMessage = (id?: string | null) =>
        `This phone number already has an account${id && id !== 'existing account' ? ` (${id})` : ''}. Ask them to sign in with their Ambassador ID, or use a different phone number.`;

      const { data: existingId } = await supabase.rpc('phone_registered' as any, { p_phone: formData.phone });
      if (existingId) {
        toast({ title: "Phone Number Already Registered", description: takenMessage(existingId as string), variant: "destructive" });
        return;
      }

      // If a sponsor is signed in on this device, sign them out so the new member gets their own session
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      const sponsorWasSignedIn = !!currentSession;
      if (sponsorWasSignedIn) {
        await supabase.auth.signOut();
      }

      // Create the user account (auto signs in)
      const { error: authError } = await signUp(internalEmail, formData.password, formData.fullName);

      if (authError) {
        const already = /already registered|already exists/i.test(authError.message);
        toast({
          title: already ? "Phone Number Already Registered" : "Registration Failed",
          description: already ? takenMessage() : authError.message,
          variant: "destructive",
        });
        return;
      }
      if (sponsorWasSignedIn) {
        toast({ title: "Sponsor signed out", description: "You were signed out so the new member could register. Sign back in with your Ambassador ID afterwards." });
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
        email: internalEmail,
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
