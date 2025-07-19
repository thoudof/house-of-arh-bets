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
    console.log('🔐 signInWithTelegram called with user:', telegramUser);
    
    if (!telegramUser) {
      const error = 'Telegram user data not available';
      console.error('❌', error);
      throw new Error(error);
    }

    // Create a unique email based on Telegram ID
    const email = `telegram_${telegramUser.id}@telegram.local`;
    // Use the original password format that was working before
    const password = `telegram_${telegramUser.id}`;
    
    console.log('🔑 Using credentials:', { email, passwordLength: password.length });

    try {
      console.log('🔄 Attempting sign in...');
      // Try to sign in first
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      console.log('📊 Sign in result:', { 
        hasData: !!signInData, 
        hasError: !!signInError, 
        errorMessage: signInError?.message 
      });

      if (signInError && signInError.message.includes('Invalid login credentials')) {
        console.log('🆕 User not found, creating new account...');
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

        console.log('📊 Sign up result:', { 
          hasData: !!signUpData, 
          hasError: !!signUpError, 
          errorMessage: signUpError?.message 
        });

        if (signUpError) {
          console.error('❌ Sign up error:', signUpError);
          throw signUpError;
        }

        console.log('✅ Sign up successful:', signUpData);
        return signUpData;
      } else if (signInError) {
        console.error('❌ Sign in error:', signInError);
        throw signInError;
      }

      console.log('✅ Sign in successful:', signInData);
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
    console.log('🔍 Auto-signin check:', {
      authLoading: authState.loading,
      hasUser: !!authState.user,
      hasTelegramUser: !!telegramUser,
      telegramUserId: telegramUser?.id,
      isReady: isReady,
      shouldAttemptSignin: !authState.loading && !authState.user && telegramUser && isReady
    });
    
    if (!authState.loading && !authState.user && telegramUser && isReady) {
      console.log('🚀 Attempting auto-signin with Telegram user:', telegramUser);
      signInWithTelegram()
        .then((result) => {
          console.log('✅ Auto-signin successful:', result);
        })
        .catch((error) => {
          console.error('❌ Auto-signin failed:', error);
          // Показать ошибку пользователю через debug панель
          console.error('Auth error details:', {
            message: error.message,
            code: error.code,
            status: error.status
          });
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