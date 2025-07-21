import { retrieveLaunchParams } from '@telegram-apps/sdk-react';
import { type PropsWithChildren, useEffect } from 'react';

function AppInitializer({ children }: PropsWithChildren) {
  useEffect(() => {
    // Initialize Telegram WebApp
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      window.Telegram.WebApp.ready();
      window.Telegram.WebApp.expand();
      
      // Set header color to match our theme
      if (window.Telegram.WebApp.headerColor !== '#1f2937') {
        window.Telegram.WebApp.headerColor = '#1f2937';
      }
      
      console.log('🔍 Telegram WebApp initialized:', {
        platform: window.Telegram.WebApp.platform,
        version: window.Telegram.WebApp.version,
        user: window.Telegram.WebApp.initDataUnsafe?.user,
        initData: window.Telegram.WebApp.initData,
      });
    }
  }, []);

  return <>{children}</>;
}

export function TelegramProvider({ children }: PropsWithChildren) {
  return (
    <AppInitializer>
      {children}
    </AppInitializer>
  );
}