import { useEffect, useState, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useTelegram } from './useTelegram';

interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  profile: any | null;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
    profile: null
  });
  
  const { user: telegramUser, isReady } = useTelegram();

  const signInWithTelegram = useCallback(async () => {
    console.log('signInWithTelegram called with user:', telegramUser);
    
    if (!telegramUser) {
      console.error('Telegram user data not available');
      throw new Error('Telegram user data not available');
    }

    // Create a unique email based on Telegram ID
    const email = `telegram_${telegramUser.id}@telegram.local`;
    const password = `telegram_${telegramUser.id}_${Date.now()}`;

    try {
      // Try to sign in first
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError && signInError.message.includes('Invalid login credentials')) {
        // User doesn't exist, create new account
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              telegram_id: telegramUser.id.toString(),
              id: telegramUser.id.toString(),
              username: telegramUser.username,
              first_name: telegramUser.first_name,
              last_name: telegramUser.last_name,
              photo_url: telegramUser.photo_url,
            }
          }
        });

        if (signUpError) {
          throw signUpError;
        }

        return signUpData;
      } else if (signInError) {
        throw signInError;
      }

      return signInData;
    } catch (error) {
      console.error('Telegram auth error:', error);
      throw error;
    }
  }, [telegramUser]);

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  }, []);

  const fetchProfile = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          *,
          user_stats(*)
        `)
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
  }, []);

  // Initialize auth state
  useEffect(() => {
    if (!isReady) return;

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setAuthState(prev => ({
          ...prev,
          session,
          user: session?.user ?? null,
          loading: false
        }));

        // Fetch profile data when user signs in
        if (session?.user && event === 'SIGNED_IN') {
          setTimeout(async () => {
            const profile = await fetchProfile(session.user.id);
            setAuthState(prev => ({
              ...prev,
              profile
            }));
          }, 0);
        } else if (event === 'SIGNED_OUT') {
          setAuthState(prev => ({
            ...prev,
            profile: null
          }));
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setAuthState(prev => ({
        ...prev,
        session,
        user: session?.user ?? null,
        loading: false
      }));

      if (session?.user) {
        const profile = await fetchProfile(session.user.id);
        setAuthState(prev => ({
          ...prev,
          profile
        }));
      }
    });

    return () => subscription.unsubscribe();
  }, [isReady, fetchProfile]);

  // Auto-signin with Telegram if user is not authenticated
  useEffect(() => {
    console.log('Auto-signin check:', {
      authLoading: authState.loading,
      hasUser: !!authState.user,
      hasTelegramUser: !!telegramUser,
      isReady: isReady
    });
    
    if (!authState.loading && !authState.user && telegramUser && isReady) {
      console.log('Attempting auto-signin with Telegram...');
      signInWithTelegram().catch((error) => {
        console.error('Auto-signin failed:', error);
      });
    }
  }, [authState.loading, authState.user, telegramUser, isReady, signInWithTelegram]);

  return {
    ...authState,
    signInWithTelegram,
    signOut,
    isAuthenticated: !!authState.user,
    refreshProfile: () => authState.user ? fetchProfile(authState.user.id) : null
  };
};