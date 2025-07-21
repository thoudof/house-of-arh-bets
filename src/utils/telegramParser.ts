
export interface TelegramUserData {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  is_premium?: boolean;
  allows_write_to_pm?: boolean;
  photo_url?: string;
}

export interface TelegramInitData {
  user?: TelegramUserData;
  chat_instance?: string;
  chat_type?: string;
  auth_date?: number;
  signature?: string;
  hash?: string;
}

export const parseTelegramInitData = (url: string): TelegramInitData | null => {
  try {
    const urlParams = new URLSearchParams(url.split('?')[1] || '');
    const tgWebAppData = urlParams.get('tgWebAppData');
    
    if (!tgWebAppData) {
      console.log('No tgWebAppData found in URL');
      return null;
    }

    const decodedData = decodeURIComponent(tgWebAppData);
    const params = new URLSearchParams(decodedData);
    
    console.log('Parsing Telegram data:', {
      raw: tgWebAppData,
      decoded: decodedData,
      params: Object.fromEntries(params)
    });

    const result: TelegramInitData = {};
    
    // Парсим пользователя
    const userParam = params.get('user');
    if (userParam) {
      try {
        const userData = JSON.parse(decodeURIComponent(userParam));
        result.user = userData;
        console.log('Parsed user data:', userData);
      } catch (e) {
        console.error('Failed to parse user data:', e);
      }
    }

    // Парсим остальные параметры
    const chatInstance = params.get('chat_instance');
    if (chatInstance) result.chat_instance = chatInstance;
    
    const chatType = params.get('chat_type');
    if (chatType) result.chat_type = chatType;
    
    const authDate = params.get('auth_date');
    if (authDate) result.auth_date = parseInt(authDate);
    
    const signature = params.get('signature');
    if (signature) result.signature = signature;
    
    const hash = params.get('hash');
    if (hash) result.hash = hash;

    return result;
  } catch (error) {
    console.error('Error parsing Telegram init data:', error);
    return null;
  }
};

export const getTelegramThemeParams = (url: string) => {
  try {
    const urlParams = new URLSearchParams(url.split('?')[1] || '');
    const themeParams = urlParams.get('tgWebAppThemeParams');
    
    if (!themeParams) {
      return null;
    }

    return JSON.parse(decodeURIComponent(themeParams));
  } catch (error) {
    console.error('Error parsing theme params:', error);
    return null;
  }
};
