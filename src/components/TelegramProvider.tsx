import { retrieveLaunchParams } from '@telegram-apps/sdk-react';
import { type PropsWithChildren, useEffect } from 'react';

function AppInitializer({ children }: PropsWithChildren) {
  useEffect(() => {
    // Initialize Telegram WebApp
    if (typeof window !== 'undefined') {
      // Wait for Telegram WebApp to be available
      const initTelegram = () => {
        if (window.Telegram?.WebApp) {
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
            initDataLength: window.Telegram.WebApp.initData?.length,
            urlHash: window.location.hash,
            urlParams: Object.fromEntries(new URLSearchParams(window.location.hash.substring(1)))
          });
        } else {
          console.log('🔍 Telegram WebApp not available, retrying...');
          setTimeout(initTelegram, 100);
        }
      };
      
      initTelegram();
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