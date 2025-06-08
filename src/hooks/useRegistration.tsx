
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
        
        // Clean up the created user if ambassador ID generation fails
        await supabase.auth.admin.deleteUser(user.id);
        
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

      // Create profile with complete data
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          full_name: formData.fullName,
          phone: formData.phone,
          region: formData.region,
          country: formData.country,
          ambassador_id: ambassadorId,
          user_referral_id: ambassadorId,
          referral_code: formData.referralCode,
          status: 'pending',
          payment_status: 'pending',
          registration_data: registrationData
        });

      if (profileError) {
        console.error('Profile creation error:', profileError);
        
        // Clean up the created user if profile creation fails
        await supabase.auth.admin.deleteUser(user.id);
        
        toast({
          title: "Registration Failed",
          description: "Failed to create user profile. Please try again.",
          variant: "destructive"
        });
        return;
      }

      // Create ambassador registration record
      const { error: ambassadorError } = await supabase
        .from('ambassador_registrations')
        .insert({
          user_id: user.id,
          ambassador_id: ambassadorId,
          region: formData.region,
          country: formData.country,
          referral_code: formData.referralCode,
          status: 'pending'
        });

      if (ambassadorError) {
        console.error('Ambassador registration error:', ambassadorError);
        
        // Clean up created profile and user if ambassador registration fails
        await supabase.from('profiles').delete().eq('id', user.id);
        await supabase.auth.admin.deleteUser(user.id);
        
        toast({
          title: "Registration Failed",
          description: "Failed to complete ambassador registration. Please try again.",
          variant: "destructive"
        });
        return;
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
