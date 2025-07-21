// Упрощенная версия Telegram интеграции с использованием стабильного API

// Глобальная переменная для отслеживания состояния инициализации
let isInitialized = false;

// Инициализация Telegram SDK
export const initTelegramSDK = () => {
  if (isInitialized) return;
  
  try {
    // Простая проверка, что WebApp готово
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      window.Telegram.WebApp.ready();
      window.Telegram.WebApp.expand();
      isInitialized = true;
      console.log('Telegram WebApp инициализирован успешно');
    }
  } catch (error) {
    console.error('Ошибка инициализации Telegram WebApp:', error);
  }
};

// Проверка, запущено ли приложение в Telegram
export const isTelegramEnvironment = (): boolean => {
  try {
    // Проверяем наличие Telegram WebApp
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      return true;
    }
    
    // Проверяем URL параметры
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('tgWebAppData') || urlParams.has('tgWebAppVersion')) {
      return true;
    }
    
    // Проверяем user agent
    const userAgent = navigator.userAgent || '';
    if (userAgent.includes('Telegram')) {
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Ошибка проверки Telegram окружения:', error);
    return false;
  }
};

// Получение данных пользователя из Telegram
export const getTelegramUser = () => {
  try {
    // Используем стабильный window.Telegram API
    if (typeof window !== 'undefined' && window.Telegram?.WebApp?.initDataUnsafe?.user) {
      const user = window.Telegram.WebApp.initDataUnsafe.user;
      return {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        username: user.username,
        language_code: user.language_code,
        photo_url: user.photo_url,
        is_premium: user.is_premium,
        allows_write_to_pm: user.allows_write_to_pm,
      };
    }
    
    return null;
  } catch (error) {
    console.error('Ошибка получения данных пользователя Telegram:', error);
    return null;
  }
};

// Получение raw init data для отправки на сервер
export const getTelegramInitData = (): string | null => {
  try {
    // Используем стабильный window.Telegram API
    if (typeof window !== 'undefined' && window.Telegram?.WebApp?.initData) {
      return window.Telegram.WebApp.initData;
    }
    
    // Проверяем URL параметры
    const urlParams = new URLSearchParams(window.location.search);
    const tgWebAppData = urlParams.get('tgWebAppData');
    if (tgWebAppData) {
      return decodeURIComponent(tgWebAppData);
    }
    
    return null;
  } catch (error) {
    console.error('Ошибка получения init data:', error);
    return null;
  }
};

// Настройка темы приложения под Telegram
export const setupTelegramTheme = () => {
  try {
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      const webapp = window.Telegram.WebApp;
      
      // Применяем цвета из темы Telegram
      if (webapp.themeParams) {
        document.documentElement.style.setProperty('--tg-bg-color', webapp.themeParams.bg_color || '#ffffff');
        document.documentElement.style.setProperty('--tg-text-color', webapp.themeParams.text_color || '#000000');
        document.documentElement.style.setProperty('--tg-hint-color', webapp.themeParams.hint_color || '#999999');
        document.documentElement.style.setProperty('--tg-button-color', webapp.themeParams.button_color || '#40a7e3');
        document.documentElement.style.setProperty('--tg-button-text-color', webapp.themeParams.button_text_color || '#ffffff');
      }
      
      console.log('Тема Telegram применена');
    }
  } catch (error) {
    console.error('Ошибка настройки темы Telegram:', error);
  }
};
