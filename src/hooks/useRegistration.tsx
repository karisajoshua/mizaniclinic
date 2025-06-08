
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { validateEmail, validatePhone, validateName } from '@/utils/inputValidation';

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
      
      // Input validation
      if (!formData.fullName.trim() || !formData.email.trim() || !formData.password.trim() || 
          !formData.referralCode.trim() || !formData.region.trim() || !formData.phone.trim()) {
        toast({
          title: "Registration Failed",
          description: "All fields are required. Please fill in all information.",
          variant: "destructive",
        });
        return;
      }

      // Validate email format
      if (!validateEmail(formData.email)) {
        toast({
          title: "Registration Failed",
          description: "Please enter a valid email address.",
          variant: "destructive",
        });
        return;
      }

      // Validate phone format
      if (!validatePhone(formData.phone)) {
        toast({
          title: "Registration Failed",
          description: "Please enter a valid phone number.",
          variant: "destructive",
        });
        return;
      }

      // Validate name
      const nameValidation = validateName(formData.fullName);
      if (!nameValidation.isValid) {
        toast({
          title: "Registration Failed",
          description: nameValidation.message,
          variant: "destructive",
        });
        return;
      }

      console.log('Looking for referral code:', formData.referralCode);
      
      // Get referrer profile (referral code already validated in real-time)
      const { data: profiles, error: referrerError } = await supabase
        .from('profiles')
        .select('*')
        .or(`ambassador_id.eq.${formData.referralCode},user_referral_id.eq.${formData.referralCode}`);

      if (referrerError || !profiles || profiles.length === 0) {
        console.error('Referral code validation failed during registration:', referrerError);
        toast({
          title: "Registration Failed",
          description: "Referral code validation failed. Please try again.",
          variant: "destructive",
        });
        return;
      }

      const referrerProfile = profiles[0];
      console.log('Valid referral code confirmed from:', referrerProfile.full_name);
      
      // Create the user account
      const { error: authError } = await signUp(formData.email, formData.password, formData.fullName);

      if (authError) {
        console.error('Auth error:', authError);
        if (authError.message.includes('already registered')) {
          toast({
            title: "Registration Failed",
            description: "This email is already registered. Please try signing in or use a different email.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Registration Failed",
            description: authError.message,
            variant: "destructive",
          });
        }
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

      // Create complete profile with all data
      const registrationData = {
        fullName: formData.fullName.trim(),
        email: formData.email.trim().toLowerCase(),
        region: formData.region,
        country: formData.country,
        referralCode: formData.referralCode.trim(),
        phone: formData.phone.trim(),
        ambassadorId,
        userId: user.id,
        registrationDate: new Date().toISOString()
      };

      // Create profile with complete data in the consolidated profiles table
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          full_name: formData.fullName.trim(),
          phone: formData.phone.trim(),
          region: formData.region,
          country: formData.country,
          ambassador_id: ambassadorId,
          user_referral_id: ambassadorId,
          referral_code: formData.referralCode.trim(),
          status: 'pending',
          payment_status: 'pending',
          registration_data: registrationData,
          registration_date: new Date().toISOString()
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

      // Create referral record to track the referral chain
      const { error: referralError } = await supabase
        .from('referrals')
        .insert({
          referrer_id: referrerProfile.id,
          referred_id: user.id,
          referral_code: formData.referralCode.trim(),
          country: formData.country,
          status: 'pending'
        });

      if (referralError) {
        console.error('Referral creation error:', referralError);
        // Don't fail registration for referral tracking error, just log it
        console.warn('REFERRAL TRACKING FAILED - this will affect dashboard display');
      } else {
        console.log('Referral record created successfully');
      }

      console.log('Registration completed successfully');

      // Store registration data for the payment page
      localStorage.setItem('registrationData', JSON.stringify(registrationData));

      toast({
        title: "Registration Successful!",
        description: `Your Ambassador ID: ${ambassadorId}. Please complete payment to activate your account.`,
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
