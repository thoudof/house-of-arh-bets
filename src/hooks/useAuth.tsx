
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

      // Проверяем существующую сессию
      const { data: { session: existingSession } } = await supabase.auth.getSession();
      if (existingSession?.user) {
        console.log('✅ Found existing session, using it');
        return { user: existingSession.user, error: null };
      }

      // Пытаемся войти с существующими учетными данными
      console.log('🔄 Attempting sign in with existing credentials');
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (signInData?.user && !signInError) {
        console.log('✅ Successfully signed in with existing credentials');
        return { user: signInData.user, error: null };
      }

      // Если вход не удался, создаем нового пользователя
      console.log('🔄 Sign in failed, creating new user:', signInError?.message);
      
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            telegram_id: telegramUser.id.toString(),
            first_name: telegramUser.first_name,
            last_name: telegramUser.last_name || '',
            username: telegramUser.username || '',
            photo_url: telegramUser.photo_url || ''
          }
        }
      });

      if (signUpError) {
        console.error('❌ Sign up failed:', signUpError.message);
        
        // Если пользователь уже существует, пытаемся войти снова
        if (signUpError.message.includes('already been registered')) {
          console.log('🔄 User already exists, retrying sign in');
          const { data: retrySignIn, error: retryError } = await supabase.auth.signInWithPassword({
            email,
            password
          });
          
          if (retryError) {
            console.error('❌ Retry sign in failed:', retryError.message);
            return { user: null, error: retryError.message };
          }
          
          return { user: retrySignIn.user, error: null };
        }
        
        return { user: null, error: signUpError.message };
      }

      console.log('✅ New user created successfully');
      return { user: signUpData.user, error: null };

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
        .maybeSingle();

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
      try {
        // Настраиваем слушатель изменений авторизации
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            console.log('🔄 Auth state change:', event, {
              hasSession: !!session,
              userId: session?.user?.id,
              userEmail: session?.user?.email
            });
            
            if (!mounted) return;

            if (session?.user) {
              // Пытаемся загрузить профиль
              const profile = await loadProfile(session.user.id);
              
              setAuthState({
                user: session.user,
                session,
                loading: false,
                profile,
                isAuthenticated: true
              });
            } else {
              setAuthState({
                user: null,
                session: null,
                loading: false,
                profile: null,
                isAuthenticated: false
              });
            }
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
            if (telegramUser) {
              const result = await signInWithTelegram();
              if (!result.user) {
                console.log('❌ Auto-signin failed, user must authenticate manually');
                setAuthState(prev => ({ ...prev, loading: false }));
              }
            } else {
              setAuthState(prev => ({ ...prev, loading: false }));
            }
          }
        }

        return () => {
          subscription.unsubscribe();
          mounted = false;
        };
      } catch (error) {
        console.error('❌ Auth initialization error:', error);
        if (mounted) {
          setAuthState(prev => ({ ...prev, loading: false }));
        }
      }
    };

    initAuth();
  }, [isReady, telegramUser]);

  return {
    ...authState,
    signInWithTelegram,
    signOut
  };
};
