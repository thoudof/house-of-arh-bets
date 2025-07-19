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

  // ПРОСТАЯ ФУНКЦИЯ ВХОДА БЕЗ ВСЯКОЙ ХУЙНИ
  const signInWithTelegram = useCallback(async () => {
    if (!telegramUser) {
      throw new Error('No Telegram user');
    }

    const email = `tg_${telegramUser.id}@local.app`;
    const password = `pass_${telegramUser.id}`;

    console.log('🔐 Signing in:', email);

    try {
      // ПРОБУЕМ ВОЙТИ
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInData?.user && !signInError) {
        console.log('✅ Sign in OK');
        return signInData;
      }

      // ЕСЛИ НЕ УДАЛОСЬ - СОЗДАЕМ
      console.log('🆕 Creating user...');
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            telegram_id: telegramUser.id.toString(),
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

      console.log('✅ Sign up OK');
      return signUpData;

    } catch (error) {
      console.error('❌ Auth failed:', error);
      throw error;
    }
  }, [telegramUser]);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  // ЗАГРУЗКА ПРОФИЛЯ
  const loadProfile = useCallback(async (userId: string) => {
    try {
      const { data } = await supabase
        .from('profiles')
        .select('*, user_stats(*)')
        .eq('user_id', userId)
        .maybeSingle();

      console.log('📊 Profile loaded:', data);
      return data;
    } catch (error) {
      console.error('❌ Profile load failed:', error);
      return null;
    }
  }, []);

  // ОСНОВНАЯ ЛОГИКА
  useEffect(() => {
    if (!isReady) return;

    let mounted = true;

    const setupAuth = async () => {
      // ПРОВЕРЯЕМ ТЕКУЩУЮ СЕССИЮ
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!mounted) return;

      if (session?.user) {
        console.log('🔍 Found existing session');
        const profile = await loadProfile(session.user.id);
        
        if (!mounted) return;
        
        setAuthState({
          user: session.user,
          session,
          loading: false,
          profile
        });
      } else {
        console.log('🔍 No session, trying auto-login');
        
        if (telegramUser) {
          try {
            await signInWithTelegram();
          } catch (error) {
            console.error('Auto-login failed:', error);
            setAuthState(prev => ({ ...prev, loading: false }));
          }
        } else {
          setAuthState(prev => ({ ...prev, loading: false }));
        }
      }
    };

    // СЛУШАЕМ ИЗМЕНЕНИЯ
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔄 Auth event:', event);
        
        if (!mounted) return;

        if (session?.user) {
          const profile = await loadProfile(session.user.id);
          
          if (!mounted) return;
          
          setAuthState({
            user: session.user,
            session,
            loading: false,
            profile
          });
        } else {
          setAuthState({
            user: null,
            session: null,
            loading: false,
            profile: null
          });
        }
      }
    );

    setupAuth();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [isReady, telegramUser, signInWithTelegram, loadProfile]);

  return {
    ...authState,
    signInWithTelegram,
    signOut,
    isAuthenticated: !!authState.user,
  };
};