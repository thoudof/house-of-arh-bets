import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

// Пока что возвращаем пустой массив, так как таблицы сообщений пока нет
export const useMessages = () => {
  return useQuery({
    queryKey: ['messages'],
    queryFn: async () => {
      // В будущем здесь будет запрос к таблице сообщений
      return [];
    },
  });
};

export const useConversation = (userId: string) => {
  return useQuery({
    queryKey: ['conversation', userId],
    queryFn: async () => {
      // В будущем здесь будет запрос к таблице сообщений для конкретного пользователя
      return [];
    },
    enabled: !!userId,
  });
};