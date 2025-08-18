import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Функция для определения, находимся ли мы в demo режиме
export const isDemoMode = (): boolean => {
  // Проверяем, запущено ли приложение в Lovable (не в Telegram)
  return !window.Telegram?.WebApp?.initData;
};

// Функция для определения среды выполнения
export const isTelegramEnvironment = (): boolean => {
  return !!window.Telegram?.WebApp?.initData;
};
