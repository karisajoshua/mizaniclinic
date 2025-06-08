
import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session:', session?.user?.id);
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (ambassadorId: string, password: string) => {
    console.log('Attempting to sign in with Ambassador ID:', ambassadorId);
    
    // Validate ambassador ID format
    if (!/^MCA25-[A-Z0-9]+$/.test(ambassadorId)) {
      return { 
        error: { 
          message: 'Invalid Ambassador ID format. Must be MCA25-XXXXX' 
        } 
      };
    }

    try {
      // Find user by ambassador_id or user_referral_id
      const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .or(`ambassador_id.eq.${ambassadorId},user_referral_id.eq.${ambassadorId}`);

      if (profileError) {
        console.error('Profile lookup error:', profileError);
        return { 
          error: { 
            message: 'Database error occurred. Please try again.' 
          } 
        };
      }

      if (!profiles || profiles.length === 0) {
        console.log('No profile found for Ambassador ID:', ambassadorId);
        return { 
          error: { 
            message: `Ambassador ID "${ambassadorId}" not found. Please check your ID and try again.` 
          } 
        };
      }

      const profile = profiles[0];
      console.log('Found profile:', profile.id);

      // Get the user's email from auth.users
      const { data: { user: authUser }, error: authError } = await supabase.auth.admin.getUserById(profile.id);
      
      if (authError || !authUser?.email) {
        console.error('Auth user lookup error:', authError);
        return { 
          error: { 
            message: 'Unable to verify user credentials. Please contact support.' 
          } 
        };
      }

      // Sign in with the found email and provided password
      console.log('Signing in with email:', authUser.email);
      const { error } = await supabase.auth.signInWithPassword({
        email: authUser.email,
        password,
      });

      if (error) {
        console.error('Sign in error:', error);
        if (error.message.includes('Invalid login credentials')) {
          return { 
            error: { 
              message: 'Invalid password. Please check your credentials and try again.' 
            } 
          };
        }
        return { error };
      }

      return { error: null };
    } catch (error) {
      console.error('Unexpected sign in error:', error);
      return { 
        error: { 
          message: 'An unexpected error occurred. Please try again.' 
        } 
      };
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    console.log('Starting signup process...');
    
    // Sign up without email confirmation
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
        // Skip email confirmation
        emailRedirectTo: undefined,
      },
    });

    if (error) {
      console.error('Signup error:', error);
      return { error };
    }

    console.log('Signup successful:', data.user?.id);

    // If user is created but not confirmed, we need to sign them in manually
    if (data.user && !data.session) {
      console.log('User created but not confirmed, signing in manually...');
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (signInError) {
        console.error('Auto sign-in error:', signInError);
        return { error: signInError };
      }
    }

    return { error: null };
  };

  const signOut = async () => {
    // Clear stored user data
    localStorage.removeItem('currentUser');
    localStorage.removeItem('testUser');
    
    const { error } = await supabase.auth.signOut();
    
    // Reset state
    setUser(null);
    setSession(null);
    
    return { error };
  };

  return {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
  };
};
