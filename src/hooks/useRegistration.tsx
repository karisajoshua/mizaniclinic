
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
      console.log('Starting registration process...');
      
      // Validate referral code exists (security definer RPC — no public profile access)
      const { data: referrerRows, error: referrerError } = await supabase
        .rpc('lookup_referrer', { p_code: formData.referralCode });

      const referrerProfile = Array.isArray(referrerRows) ? referrerRows[0] : referrerRows;

      if (referrerError || !referrerProfile) {
        console.error('Invalid referral code:', referrerError);
        toast({
          title: "Invalid Referral Code",
          description: `The referral code "${formData.referralCode}" does not exist. Please check the code and try again.`,
          variant: "destructive",
        });
        return;
      }


      console.log('Valid referral code found from:', referrerProfile.full_name);
      
      // First create the user account
      const { error: authError } = await signUp(formData.email, formData.password, formData.fullName);

      if (authError) {
        console.error('Auth error:', authError);
        toast({
          title: "Registration Failed",
          description: authError.message,
          variant: "destructive",
        });
        return;
      }

      // Get the current user after signup
      const { data: { user }, error: getUserError } = await supabase.auth.getUser();

      if (getUserError || !user) {
        console.error('Failed to get user after signup:', getUserError);
        toast({
          title: "Registration Failed",
          description: "Failed to create user account. Please try again.",
          variant: "destructive",
        });
        return;
      }

      console.log('User created successfully:', user.id);
      
      // Generate ambassador ID using the database function
      const { data: ambassadorIdResult, error: idError } = await supabase
        .rpc('generate_ambassador_id', {
          p_region: formData.region,
          p_country: formData.country
        });

      if (idError || !ambassadorIdResult) {
        console.error('Error generating ambassador ID:', idError);
        
        toast({
          title: "Registration Failed",
          description: "Failed to generate ambassador ID. Please try again.",
          variant: "destructive"
        });
        return;
      }

      const ambassadorId = ambassadorIdResult;
      console.log('Generated ambassador ID:', ambassadorId);

      // Create both profile and ambassador registration in a transaction-like manner
      const registrationData = {
        fullName: formData.fullName,
        email: formData.email,
        region: formData.region,
        country: formData.country,
        referralCode: formData.referralCode,
        phone: formData.phone,
        ambassadorId,
        userId: user.id,
        registrationDate: new Date().toISOString()
      };

      // Create profile with complete data including both ambassador_id and user_referral_id
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          full_name: formData.fullName,
          phone: formData.phone,
          region: formData.region,
          country: formData.country,
          ambassador_id: ambassadorId,
          user_referral_id: ambassadorId, // Set user_referral_id to the same as ambassador_id
          referral_code: formData.referralCode,
          status: 'pending',
          payment_status: 'pending',
          registration_data: registrationData
        });

      if (profileError) {
        console.error('Profile creation error:', profileError);
        
        toast({
          title: "Registration Failed",
          description: "Failed to create user profile. Please try again.",
          variant: "destructive"
        });
        return;
      }

      // Create ambassador registration record -- removed
      // const { error: ambassadorError } = await supabase
      //   .from('ambassador_registrations')
      //   .insert({
      //     user_id: user.id,
      //     ambassador_id: ambassadorId,
      //     region: formData.region,
      //     country: formData.country,
      //     referral_code: formData.referralCode,
      //     status: 'pending'
      //   });

      // if (ambassadorError) {
      //   console.error('Ambassador registration error:', ambassadorError);
        
      //   // Clean up created profile if ambassador registration fails
      //   await supabase.from('profiles').delete().eq('id', user.id);
        
      //   toast({
      //     title: "Registration Failed",
      //     description: "Failed to complete ambassador registration. Please try again.",
      //     variant: "destructive"
      //   });
      //   return;
      // }

      // Create referral record to track the relationship
      const { error: referralError } = await supabase
        .from('referrals')
        .insert({
          referrer_id: referrerProfile.id,
          referred_id: user.id,
          referral_code: formData.referralCode,
          country: formData.country,
          status: 'pending'
        });

      if (referralError) {
        console.error('Referral creation error:', referralError);
        // Don't fail registration for referral tracking error, just log it

        toast({
          title: "Referral Created",
          description: "Your ambassador has been notified"
        });
      }

      console.log('Registration completed successfully');

      // Store registration data for the payment page
      localStorage.setItem('registrationData', JSON.stringify(registrationData));

      toast({
        title: "Registration Successful!",
        description: `Please complete payment to activate your account.`,
      });

      // Navigate to payment page
      navigate('/payment');

    } catch (error) {
      console.error('Unexpected registration error:', error);
      toast({
        title: "Registration Failed",
        description: "An unexpected error occurred. Please try again.",
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
