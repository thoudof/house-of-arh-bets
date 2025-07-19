import { useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useTelegram } from './useTelegram';

interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  profile: any | null;
  isAuthenticated: boolean;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
    profile: null,
    isAuthenticated: false
  });

  const { user: telegramUser, isReady } = useTelegram();

  const signInWithTelegram = async () => {
    if (!telegramUser) {
      console.error('No Telegram user data');
      return { user: null, error: 'No Telegram user data' };
    }

    try {
      const email = `tg_${telegramUser.id}@local.app`;
      const password = `pass_${telegramUser.id}`;

      console.log('Trying to sign in user:', email);

      // Сначала пробуем войти
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (signInError) {
        if (signInError.message.includes('Invalid login credentials')) {
          console.log('User not found, creating new account');
          
          // Создаем нового пользователя
          const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                telegram_id: telegramUser.id.toString(),
                first_name: telegramUser.first_name,
                last_name: telegramUser.last_name,
                username: telegramUser.username,
                photo_url: telegramUser.photo_url
              }
            }
          });

          if (signUpError) {
            console.error('Sign up failed:', signUpError);
            return { user: null, error: signUpError.message };
          }

          console.log('New user created successfully');
          return { user: signUpData.user, error: null };
        } else {
          console.error('Sign in failed:', signInError);
          return { user: null, error: signInError.message };
        }
      }

      console.log('User signed in successfully');
      return { user: signInData.user, error: null };
    } catch (error) {
      console.error('Authentication error:', error);
      return { user: null, error: 'Authentication failed' };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Sign out error:', error);
      }
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const loadProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('Failed to load profile:', error);
        return null;
      }

      console.log('Profile loaded:', data);
      return data;
    } catch (error) {
      console.error('Profile load error:', error);
      return null;
    }
  };

  useEffect(() => {
    let mounted = true;

    const initAuth = async () => {
      // Слушаем изменения авторизации
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          console.log('Auth state change:', event, session?.user?.email);
          
          if (!mounted) return;

          let profile = null;
          if (session?.user) {
            profile = await loadProfile(session.user.id);
          }

          setAuthState({
            user: session?.user || null,
            session,
            loading: false,
            profile,
            isAuthenticated: !!session?.user
          });
        }
      );

      // Проверяем текущую сессию
      const { data: { session } } = await supabase.auth.getSession();
      
      if (mounted) {
        if (session?.user) {
          const profile = await loadProfile(session.user.id);
          setAuthState({
            user: session.user,
            session,
            loading: false,
            profile,
            isAuthenticated: true
          });
        } else if (isReady && telegramUser) {
          // Автоматический вход через Telegram
          console.log('No active session, trying Telegram auth');
          await signInWithTelegram();
        } else {
          setAuthState(prev => ({ ...prev, loading: false }));
        }
      }

      return () => subscription.unsubscribe();
    };

    if (isReady) {
      initAuth();
    }

    return () => {
      mounted = false;
    };
  }, [isReady, telegramUser]);

  return {
    ...authState,
    signInWithTelegram,
    signOut
  };
};