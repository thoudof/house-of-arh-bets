import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { retrieveRawInitData } from '@telegram-apps/sdk';

interface TelegramUser {
  id: string;
  telegram_id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  avatar_url?: string;
}

interface TelegramAuthResponse {
  success: boolean;
  user?: TelegramUser;
  session_token?: string;
  error?: string;
}

export const useTelegramAuth = () => {
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Проверяем текущую сессию при загрузке
  useEffect(() => {
    checkCurrentSession();
  }, []);

  const checkCurrentSession = async () => {
    try {
      const { data: session } = await supabase.auth.getSession();
      
      if (session?.session) {
        // @ts-ignore - Temporary fix until types regenerate
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', session.session.user.id)
          .maybeSingle();

        if (profile) {
          setUser({
            id: profile.user_id,
            telegram_id: profile.telegram_id,
            first_name: profile.first_name,
            last_name: profile.last_name,
            username: profile.telegram_username,
            avatar_url: profile.avatar_url
          });
          setIsAuthenticated(true);
        }
      }
    } catch (err) {
      console.error('Ошибка проверки сессии:', err);
      setError('Ошибка проверки сессии');
    } finally {
      setIsLoading(false);
    }
  };

  const authenticateWithTelegram = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Получаем init data от Telegram
      const initData = retrieveRawInitData();
      
      if (!initData) {
        throw new Error('Telegram init data не найдены. Убедитесь, что приложение запущено в Telegram.');
      }

      console.log('Отправляем Telegram данные для авторизации...');

      // Отправляем данные на сервер для валидации
      const { data, error } = await supabase.functions.invoke('telegram-auth', {
        body: { initData }
      });

      if (error) {
        throw new Error(error.message || 'Ошибка авторизации');
      }

      const response = data as TelegramAuthResponse;

      if (response.success && response.user) {
        setUser(response.user);
        setIsAuthenticated(true);
        
        // Если есть session token, устанавливаем сессию
        if (response.session_token) {
          const { error: sessionError } = await supabase.auth.setSession({
            access_token: response.session_token,
            refresh_token: response.session_token
          });
          
          if (sessionError) {
            console.warn('Предупреждение при установке сессии:', sessionError);
          }
        }
        
        console.log('Telegram авторизация успешна!');
      } else {
        throw new Error(response.error || 'Неизвестная ошибка авторизации');
      }

    } catch (err: any) {
      console.error('Ошибка Telegram авторизации:', err);
      setError(err.message || 'Ошибка авторизации через Telegram');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setIsAuthenticated(false);
      setError(null);
    } catch (err) {
      console.error('Ошибка выхода:', err);
    }
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    authenticateWithTelegram,
    logout,
    checkCurrentSession
  };
};

// Для обратной совместимости
export const useAuth = useTelegramAuth;