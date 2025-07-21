
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
      console.error('❌ No Telegram user data available for sign in');
      return { user: null, error: 'No Telegram user data' };
    }

    try {
      const email = `tg_${telegramUser.id}@local.app`;
      const password = `pass_${telegramUser.id}`;

      console.log('🔐 Starting Telegram sign in process:', {
        telegramId: telegramUser.id,
        email,
        telegramUsername: telegramUser.username,
        telegramName: `${telegramUser.first_name} ${telegramUser.last_name || ''}`.trim()
      });

      // Пробуем войти
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (signInError) {
        if (signInError.message.includes('Invalid login credentials')) {
          console.log('🔄 User not found, creating new account');
          
          // Создаем нового пользователя с правильными данными
          const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                telegram_id: telegramUser.id.toString(),
                id: telegramUser.id.toString(),
                first_name: telegramUser.first_name,
                last_name: telegramUser.last_name || '',
                username: telegramUser.username || '',
                photo_url: telegramUser.photo_url || ''
              }
            }
          });

          if (signUpError) {
            console.error('❌ Sign up failed:', signUpError.message);
            console.error('❌ Full error:', signUpError);
            return { user: null, error: signUpError.message };
          }

          console.log('✅ New user created successfully:', signUpData.user?.id);
          
          // Ждем немного для завершения триггера
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          return { user: signUpData.user, error: null };
        } else {
          console.error('❌ Sign in failed:', signInError.message);
          return { user: null, error: signInError.message };
        }
      }

      console.log('✅ User signed in successfully:', signInData.user?.id);
      return { user: signInData.user, error: null };
    } catch (error) {
      console.error('❌ Authentication error:', error);
      return { user: null, error: 'Authentication failed' };
    }
  };

  const signOut = async () => {
    try {
      console.log('🚪 Signing out user');
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('❌ Sign out error:', error);
      } else {
        console.log('✅ User signed out successfully');
      }
    } catch (error) {
      console.error('❌ Sign out error:', error);
    }
  };

  const loadProfile = async (userId: string) => {
    try {
      console.log('📋 Loading profile for user:', userId);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('❌ Failed to load profile:', error);
        return null;
      }

      console.log('✅ Profile loaded:', data);
      return data;
    } catch (error) {
      console.error('❌ Profile load error:', error);
      return null;
    }
  };

  useEffect(() => {
    if (!isReady) {
      console.log('⏳ Waiting for Telegram to be ready...');
      return;
    }

    console.log('🚀 Initializing auth with Telegram user:', telegramUser);

    let mounted = true;

    const initAuth = async () => {
      // Настраиваем слушатель изменений авторизации
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          console.log('🔄 Auth state change:', event, {
            hasSession: !!session,
            userId: session?.user?.id,
            userEmail: session?.user?.email
          });
          
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
          console.log('✅ Found existing session for user:', session.user.id);
          const profile = await loadProfile(session.user.id);
          setAuthState({
            user: session.user,
            session,
            loading: false,
            profile,
            isAuthenticated: true
          });
        } else {
          console.log('🔐 No active session, attempting Telegram auth');
          const result = await signInWithTelegram();
          if (!result.user) {
            console.log('❌ Auto-signin failed, user must authenticate manually');
            setAuthState(prev => ({ ...prev, loading: false }));
          }
        }
      }

      return () => {
        subscription.unsubscribe();
        mounted = false;
      };
    };

    initAuth();
  }, [isReady, telegramUser]);

  return {
    ...authState,
    signInWithTelegram,
    signOut
  };
};
