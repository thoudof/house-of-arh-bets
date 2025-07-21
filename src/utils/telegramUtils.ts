// Utility function to extract and parse Telegram initData
export const extractTelegramInitData = () => {
  // Method 1: From URL hash
  const urlParams = new URLSearchParams(window.location.hash.substring(1));
  const tgWebAppData = urlParams.get('tgWebAppData');
  
  if (tgWebAppData) {
    try {
      const decoded = decodeURIComponent(tgWebAppData);
      console.log('🔍 Extracted initData from URL:', decoded.substring(0, 100) + '...');
      return decoded;
    } catch (error) {
      console.error('❌ Failed to decode tgWebAppData:', error);
    }
  }
  
  // Method 2: From window.Telegram.WebApp
  if (window.Telegram?.WebApp?.initData) {
    console.log('🔍 Using initData from WebApp:', window.Telegram.WebApp.initData.substring(0, 100) + '...');
    return window.Telegram.WebApp.initData;
  }
  
  // Method 3: From URL search params
  const searchParams = new URLSearchParams(window.location.search);
  const initDataFromSearch = searchParams.get('initData');
  if (initDataFromSearch) {
    console.log('🔍 Using initData from search params');
    return initDataFromSearch;
  }
  
  return null;
};

// Parse Telegram user data from initData
export const parseTelegramUser = (initData: string) => {
  try {
    const params = new URLSearchParams(initData);
    const userJson = params.get('user');
    
    if (userJson) {
      const user = JSON.parse(userJson);
      console.log('🔍 Parsed Telegram user:', user);
      return {
        id: user.id?.toString(),
        telegram_id: user.id?.toString(),
        first_name: user.first_name,
        last_name: user.last_name,
        username: user.username,
        language_code: user.language_code,
        is_premium: user.is_premium || false,
        photo_url: user.photo_url
      };
    }
  } catch (error) {
    console.error('❌ Failed to parse Telegram user:', error);
  }
  
  return null;
};