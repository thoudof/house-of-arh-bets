
import { useEffect, useState, useCallback } from 'react';
import type { TelegramWebApp } from '@/types/telegram';

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  is_premium?: boolean;
  photo_url?: string;
}

export const useTelegram = () => {
  const [webApp, setWebApp] = useState<TelegramWebApp | null>(null);
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    
    // Debug logging for mobile issues
    console.log('Telegram WebApp Debug:', {
      hasTelegram: !!window.Telegram,
      hasWebApp: !!tg,
      platform: tg?.platform,
      version: tg?.version,
      initDataUnsafe: tg?.initDataUnsafe,
      user: tg?.initDataUnsafe?.user
    });
    
    if (tg) {
      tg.ready();
      setWebApp(tg);
      const telegramUser = tg.initDataUnsafe?.user;
      
      // Если Telegram WebApp есть, но пользователь undefined - используем mock
      if (!telegramUser) {
        console.warn('Telegram WebApp found but no user data. Using mock data.');
        // Генерируем уникальный ID для каждого сеанса
        const uniqueId = Math.floor(Math.random() * 1000000) + 100000;
        const mockUser = {
          id: uniqueId,
          first_name: 'Admin',
          last_name: 'User',
          username: 'admin',
          language_code: 'ru',
          is_premium: false
        };
        setUser(mockUser);
      } else {
        setUser(telegramUser);
        console.log('Telegram User Set:', telegramUser);
      }
      
      setIsReady(true);
      
      // Применяем тему Telegram
      if (tg.colorScheme === 'dark') {
        document.documentElement.classList.add('dark');
      }
      
      // Расширяем приложение на весь экран
      tg.expand();
    } else {
      // Если не в Telegram, используем mock данные для разработки
      console.warn('Telegram WebApp not found. Using mock data for development.');
      // Генерируем уникальный ID для каждого сеанса
      const uniqueId = Math.floor(Math.random() * 1000000) + 100000;
      const mockUser = {
        id: uniqueId,
        first_name: 'Admin',
        last_name: 'User',
        username: 'admin',
        language_code: 'ru',
        is_premium: false
      };
      setUser(mockUser);
      setIsReady(true);
      console.log('Mock User Set:', mockUser);
    }
  }, []);

  const showMainButton = useCallback((text: string, onClick: () => void) => {
    if (webApp?.MainButton) {
      webApp.MainButton.setText(text);
      webApp.MainButton.onClick(onClick);
      webApp.MainButton.show();
    }
  }, [webApp]);

  const hideMainButton = useCallback(() => {
    if (webApp?.MainButton) {
      webApp.MainButton.hide();
    }
  }, [webApp]);

  const showBackButton = useCallback((onClick: () => void) => {
    if (webApp?.BackButton) {
      webApp.BackButton.onClick(onClick);
      webApp.BackButton.show();
    }
  }, [webApp]);

  const hideBackButton = useCallback(() => {
    if (webApp?.BackButton) {
      webApp.BackButton.hide();
    }
  }, [webApp]);

  const hapticFeedback = useCallback((type: 'light' | 'medium' | 'heavy' | 'success' | 'error' | 'warning' | 'selection') => {
    if (webApp?.HapticFeedback) {
      if (type === 'success' || type === 'error' || type === 'warning') {
        webApp.HapticFeedback.notificationOccurred(type);
      } else if (type === 'selection') {
        webApp.HapticFeedback.selectionChanged();
      } else {
        webApp.HapticFeedback.impactOccurred(type);
      }
    }
  }, [webApp]);

  const showAlert = useCallback((message: string) => {
    if (webApp?.showAlert) {
      webApp.showAlert(message);
    } else {
      alert(message);
    }
  }, [webApp]);

  const showConfirm = useCallback((message: string): Promise<boolean> => {
    return new Promise((resolve) => {
      if (webApp?.showConfirm) {
        webApp.showConfirm(message, resolve);
      } else {
        resolve(confirm(message));
      }
    });
  }, [webApp]);

  const close = useCallback(() => {
    if (webApp?.close) {
      webApp.close();
    }
  }, [webApp]);

  return {
    webApp,
    user,
    isReady,
    showMainButton,
    hideMainButton,
    showBackButton,
    hideBackButton,
    hapticFeedback,
    showAlert,
    showConfirm,
    close,
    colorScheme: webApp?.colorScheme || 'light',
    platform: webApp?.platform || 'unknown'
  };
};
