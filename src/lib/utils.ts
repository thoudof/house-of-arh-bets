import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Функция для определения, находимся ли мы в demo режиме
export const isDemoMode = (): boolean => {
  if (typeof window === 'undefined') return true;
  
  // Проверяем наличие Telegram WebApp и initData
  const hasTelegramWebApp = window.Telegram?.WebApp;
  const hasInitData = window.Telegram?.WebApp?.initData;
  
  // Demo режим если нет Telegram окружения или нет initData
  return !hasTelegramWebApp || !hasInitData;
};

// Функция для определения среды выполнения
export const isTelegramEnvironment = (): boolean => {
  if (typeof window === 'undefined') return false;
  return !!(window.Telegram?.WebApp?.initData);
};
