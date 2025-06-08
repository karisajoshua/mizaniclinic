
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

    // Input validation
    if (!ambassadorId.trim() || !password.trim()) {
      return {
        error: {
          message: 'Ambassador ID and password are required'
        }
      };
    }

    try {
      // Use the secure function to lookup user by ambassador ID
      const { data: userLookup, error: lookupError } = await supabase
        .rpc('get_user_by_ambassador_id', { p_ambassador_id: ambassadorId });

      if (lookupError) {
        console.error('User lookup error:', lookupError);
        return { 
          error: { 
            message: 'Database error occurred. Please try again.' 
          } 
        };
      }

      if (!userLookup || userLookup.length === 0) {
        console.log('No profile found for Ambassador ID:', ambassadorId);
        return { 
          error: { 
            message: `Ambassador ID "${ambassadorId}" not found. Please check your ID and try again.` 
          } 
        };
      }

      const userInfo = userLookup[0];
      console.log('Found user profile:', userInfo.user_id);

      // Sign in with the found email and provided password
      console.log('Signing in with email:', userInfo.email);
      const { error } = await supabase.auth.signInWithPassword({
        email: userInfo.email,
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
    
    // Input validation
    if (!email.trim() || !password.trim() || !fullName.trim()) {
      return {
        error: {
          message: 'All fields are required'
        }
      };
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return {
        error: {
          message: 'Please enter a valid email address'
        }
      };
    }

    // Password strength validation
    if (password.length < 6) {
      return {
        error: {
          message: 'Password must be at least 6 characters long'
        }
      };
    }
    
    // Sign up without email confirmation
    const { data, error } = await supabase.auth.signUp({
      email: email.trim().toLowerCase(),
      password,
      options: {
        data: {
          full_name: fullName.trim(),
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
        email: email.trim().toLowerCase(),
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
    localStorage.removeItem('userAccount');
    localStorage.removeItem('registrationData');
    
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
