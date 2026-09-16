
import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [roleLoading, setRoleLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const userId = user?.id;

  // Resolve admin role server-side (user_roles table + has_role function)
  useEffect(() => {
    let cancelled = false;

    if (!userId) {
      setIsAdmin(false);
      setRoleLoading(false);
      return;
    }

    setIsAdmin(false);
    setRoleLoading(true);
    supabase
      .rpc('has_role', { _user_id: userId, _role: 'admin' })
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error) console.error('Role check error:', error);
        setIsAdmin(data === true);
        setRoleLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [userId]);



const signIn = async (emailOrReferralCode: string, password: string) => {

  // Check if input looks like a referral code (format: MAP-XXXXXX)
  const isReferralCode = /^MAP(26)?-[A-Z0-9]+$/.test(emailOrReferralCode.toUpperCase());

  if (isReferralCode) {

    // Use RPC function to get email by referral code
    const { data: email, error: rpcError } = await supabase
      .rpc('get_email_by_referral_code', {
        input_referral_code: emailOrReferralCode.toUpperCase()
      });

    if (rpcError || !email) {
      console.error('RPC lookup error:', rpcError);
      return {
        error: {
          message: `No user found with referral code: ${emailOrReferralCode.toUpperCase()}. Please check your code and try again.`
        }
      };
    }

    // Now sign in with the found email and provided password
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password,
    });

    if (error) {
      console.error('Sign in error:', error);
      const isCredentials = /invalid login credentials/i.test(error.message);
      return {
        error: {
          message: isCredentials
            ? 'Incorrect password for this Ambassador ID. Please try again.'
            : error.message,
        },
      };
    }


    return { error: null };
  } else {
    // Regular email login
    const { error } = await supabase.auth.signInWithPassword({
      email: emailOrReferralCode,
      password,
    });

    if (error) {
      console.error('Email sign in error:', error);
    }

    return { error };
  }
};

  const signUp = async (email: string, password: string, fullName: string) => {

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


    // If user is created but not confirmed, we need to sign them in manually
    if (data.user && !data.session) {
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
    isAdmin,
    roleLoading,
    signIn,
    signUp,
    signOut,
  };
};
