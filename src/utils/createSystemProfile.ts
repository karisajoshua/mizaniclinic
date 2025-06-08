
import { supabase } from '@/integrations/supabase/client';

export const createSystemProfile = async () => {
  try {
    // Check if system profile already exists
    const { data: existingProfile, error: checkError } = await supabase
      .from('profiles')
      .select('id')
      .eq('ambassador_id', 'MCA25-T0000DSM')
      .single();

    if (!checkError && existingProfile) {
      console.log('System profile already exists');
      return { error: null };
    }

    // Generate a secure random password for the system user
    const systemEmail = 'system@mizaniclinic.com';
    const systemPassword = crypto.randomUUID() + '-' + Date.now();
    
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
      // If user already exists, we need to get their ID securely
      // This is a one-time setup, so we'll handle this case differently
      console.log('System user already exists, skipping profile creation');
      return { error: null };
    }

    // Create the system profile in the consolidated profiles table
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
        activated_at: new Date().toISOString(),
        payment_verified_at: new Date().toISOString(),
      });

    if (profileError) {
      console.error('Error creating system profile:', profileError);
      return { error: profileError };
    }

    // Sign out the system user immediately for security
    await supabase.auth.signOut();

    console.log('System profile created successfully');
    return { error: null };

  } catch (error) {
    console.error('Unexpected error creating system profile:', error);
    return { error: { message: 'Unexpected error occurred' } };
  }
};
