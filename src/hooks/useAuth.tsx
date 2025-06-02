
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

    // Check for manually stored user (for ambassador ID login)
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser && !session) {
      const userData = JSON.parse(storedUser);
      // Create a mock user object for compatibility
      setUser({
        id: userData.id,
        email: `${userData.ambassadorId}@mizaniclinic.com`,
        user_metadata: {
          ambassador_id: userData.ambassadorId,
          full_name: userData.name
        }
      } as User);
    }

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          full_name: fullName,
        },
      },
    });
    return { error };
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
