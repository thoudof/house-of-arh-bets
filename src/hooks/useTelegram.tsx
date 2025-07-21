
import { useEffect, useState, useCallback } from 'react';
import type { TelegramWebApp } from '@/types/telegram';
import { parseTelegramInitData, getTelegramThemeParams, type TelegramUserData } from '@/utils/telegramParser';

export const useTelegram = () => {
  const [webApp, setWebApp] = useState<TelegramWebApp | null>(null);
  const [user, setUser] = useState<TelegramUserData | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    
    console.log('🔍 Telegram WebApp initialization:', {
      hasTelegram: !!window.Telegram,
      hasWebApp: !!tg,
      platform: tg?.platform,
      version: tg?.version,
      currentUrl: window.location.href
    });

    // Сначала пытаемся получить данные из URL
    const urlInitData = parseTelegramInitData(window.location.href);
    console.log('📋 URL init data:', urlInitData);

    let telegramUser: TelegramUserData | null = null;

    if (urlInitData?.user) {
      // Данные из URL имеют приоритет
      telegramUser = urlInitData.user;
      console.log('✅ Using user data from URL:', telegramUser);
    } else if (tg?.initDataUnsafe?.user) {
      // Fallback на данные из WebApp
      telegramUser = tg.initDataUnsafe.user;
      console.log('✅ Using user data from WebApp:', telegramUser);
    }

    if (tg) {
      tg.ready();
      setWebApp(tg);
      
      // Применяем тему из URL если доступна
      const themeParams = getTelegramThemeParams(window.location.href);
      if (themeParams) {
        console.log('🎨 Applying theme from URL:', themeParams);
        const root = document.documentElement;
        Object.entries(themeParams).forEach(([key, value]) => {
          if (typeof value === 'string') {
            root.style.setProperty(`--tg-${key.replace(/_/g, '-')}`, value);
          }
        });
      }
      
      // Применяем тему из WebApp как fallback
      if (tg.colorScheme === 'dark') {
        document.documentElement.classList.add('dark');
      }
      
      // Расширяем приложение на весь экран
      tg.expand();
    }

    if (telegramUser) {
      setUser(telegramUser);
      console.log('🔐 Telegram user set:', telegramUser);
    } else {
      // Если не в Telegram и нет данных в URL, используем mock данные
      console.warn('⚠️ No Telegram user data found. Using mock data for development.');
      const uniqueId = Math.floor(Math.random() * 1000000) + 100000;
      const mockUser: TelegramUserData = {
        id: uniqueId,
        first_name: 'Dev',
        last_name: 'User',
        username: 'devuser',
        language_code: 'ru',
        is_premium: false
      };
      setUser(mockUser);
      console.log('🔧 Mock user set:', mockUser);
    }

    setIsReady(true);
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
