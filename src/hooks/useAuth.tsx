// Переносим настоящую Telegram авторизацию сюда
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { 
  initTelegramSDK, 
  isTelegramEnvironment, 
  getTelegramUser, 
  getTelegramInitData,
  setupTelegramTheme 
} from '@/lib/telegram';

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

export const useAuth = () => {
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Проверяем текущую сессию при загрузке
  useEffect(() => {
    initializeTelegramAuth();
  }, []);

  const initializeTelegramAuth = async () => {
    try {
      // Инициализируем Telegram SDK
      initTelegramSDK();
      setupTelegramTheme();
      
      // Проверяем, находимся ли мы в Telegram
      if (!isTelegramEnvironment()) {
        setError('Приложение должно быть запущено из Telegram Mini App');
        setIsLoading(false);
        return;
      }

      // Пробуем получить пользователя из Telegram
      const telegramUser = getTelegramUser();
      if (telegramUser) {
        console.log('Найден пользователь Telegram:', telegramUser);
        
        // Проверяем, есть ли уже сессия в Supabase
        const { data: session } = await supabase.auth.getSession();
        
        if (session?.session) {
          // Загружаем профиль из базы данных
          await loadUserProfile(session.session.user.id);
        } else {
          // Автоматически авторизуемся через Telegram
          await authenticateWithTelegram();
        }
      } else {
        setError('Не удалось получить данные пользователя из Telegram');
        setIsLoading(false);
      }
    } catch (err) {
      console.error('Ошибка инициализации:', err);
      setError('Ошибка инициализации приложения');
      setIsLoading(false);
    }
  };

  const loadUserProfile = async (userId: string) => {
    try {
      // @ts-ignore - Temporary fix until types regenerate
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
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
    } catch (err) {
      console.error('Ошибка загрузки профиля:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const authenticateWithTelegram = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Получаем init data от Telegram
      const initData = getTelegramInitData();
      
      if (!initData) {
        throw new Error('Не удалось получить данные авторизации от Telegram');
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
    initializeTelegramAuth
  };
};

// Для обратной совместимости
export const useTelegramAuth = useAuth;