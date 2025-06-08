
import { supabase } from '@/integrations/supabase/client';

export const createSystemProfile = async () => {
  try {
    // First, create a system user account
    const systemEmail = 'system@mizaniclinic.com';
    const systemPassword = 'SystemUser123!';
    
    // Try to sign up the system user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: systemEmail,
      password: systemPassword,
      options: {
        data: {
          full_name: 'Mizani Clinic System',
        },
      },
    });

    if (authError && !authError.message.includes('already registered')) {
      console.error('Error creating system user:', authError);
      return { error: authError };
    }

    // Get the user ID (either from signup or existing user)
    let systemUserId = authData?.user?.id;
    
    if (!systemUserId) {
      // Try to sign in to get the user ID
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: systemEmail,
        password: systemPassword,
      });
      
      if (signInError) {
        console.error('Error signing in system user:', signInError);
        return { error: signInError };
      }
      
      systemUserId = signInData.user?.id;
    }

    if (!systemUserId) {
      return { error: { message: 'Failed to get system user ID' } };
    }

    // Create the system profile
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert({
        id: systemUserId,
        full_name: 'Mizani Clinic System',
        ambassador_id: 'MCA25-T0000DSM',
        user_referral_id: 'MCA25-T0000DSM',
        region: 'Dar es Salaam',
        country: 'Tanzania',
        status: 'active',
        payment_status: 'completed',
        referral_code: 'SYSTEM',
      });

    if (profileError) {
      console.error('Error creating system profile:', profileError);
      return { error: profileError };
    }

    // Create the ambassador registration
    const { error: ambassadorError } = await supabase
      .from('ambassador_registrations')
      .upsert({
        user_id: systemUserId,
        ambassador_id: 'MCA25-T0000DSM',
        region: 'Dar es Salaam',
        country: 'Tanzania',
        status: 'active',
      });

    if (ambassadorError) {
      console.error('Error creating system ambassador registration:', ambassadorError);
      return { error: ambassadorError };
    }

    // Sign out the system user
    await supabase.auth.signOut();

    console.log('System profile created successfully');
    return { error: null };

  } catch (error) {
    console.error('Unexpected error creating system profile:', error);
    return { error: { message: 'Unexpected error occurred' } };
  }
};
