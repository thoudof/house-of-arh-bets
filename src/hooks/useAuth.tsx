// Простой хук без аутентификации - возвращает тестового пользователя
import { useState, useEffect } from 'react';

interface SimpleUser {
  id: string;
  telegram_id: string;
  first_name: string;
  last_name?: string;
  username?: string;
}

export const useAuth = () => {
  const [user] = useState<SimpleUser>({
    id: '12345', // Фиксированный ID тестового пользователя
    telegram_id: '286386622',
    first_name: 'Тестовый пользователь',
    username: 'test_user'
  });

  const [isAuthenticated] = useState(true);
  const [isLoading] = useState(false);

  return {
    user,
    isAuthenticated,
    isLoading,
    error: null,
  };
};

// Для совместимости с существующим кодом
export const useTelegramAuth = useAuth;