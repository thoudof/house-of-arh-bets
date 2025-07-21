import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

// Функция для трансформации данных из snake_case в camelCase
const transformPrediction = (prediction: any) => ({
  ...prediction,
  userId: prediction.user_id,
  eventStartTime: prediction.event_start_time,
  eventName: prediction.event_name,
  predictionDeadline: prediction.prediction_deadline,
  isPublic: prediction.is_public,
  isPremium: prediction.is_premium,
  isFeatured: prediction.is_featured,
  resultTime: prediction.result_time,
  resultNote: prediction.result_note,
  createdAt: prediction.created_at,
  updatedAt: prediction.updated_at,
  viewsCount: prediction.views_count,
  likesCount: prediction.likes_count,
  commentsCount: prediction.comments_count,
  sharesCount: prediction.shares_count,
  competitionName: prediction.competition_name,
  leagueName: prediction.league_name,
  analyst: prediction.profiles?.first_name && prediction.profiles?.last_name 
    ? `${prediction.profiles.first_name} ${prediction.profiles.last_name}`
    : 'Аналитик'
});

// Интерфейс для создания прогноза
export interface PredictionData {
  title: string;
  event_name: string;
  type: 'single' | 'express' | 'system' | 'accumulator';
  coefficient: number;
  description: string;
  stake?: number;
  category: 'football' | 'basketball' | 'tennis' | 'hockey' | 'esports' | 'other';
  event_start_time: string;
  prediction_deadline?: string;
  is_public: boolean;
}

export const usePredictions = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['predictions'],
    queryFn: async () => {
      // @ts-ignore - Temporary fix until types regenerate
      const { data, error } = await supabase
        .from('predictions')
        .select(`
          *,
          profiles!predictions_user_id_fkey (
            first_name,
            last_name,
            display_name,
            telegram_username,
            avatar_url,
            role,
            tier
          )
        `)
        .eq('is_public', true)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      
      return (data || []).map(prediction => transformPrediction(prediction));
    },
    enabled: !!user,
    staleTime: 30000,
  });
};

// Хук для получения горячих прогнозов
export const useHotPredictions = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['hot-predictions'],
    queryFn: async () => {
      // @ts-ignore - Temporary fix until types regenerate
      const { data, error } = await supabase
        .from('predictions')
        .select(`
          *,
          profiles!predictions_user_id_fkey (
            first_name,
            last_name,
            display_name,
            telegram_username,
            avatar_url,
            role,
            tier
          )
        `)
        .eq('is_public', true)
        .gte('event_start_time', new Date().toISOString()) // Только будущие события
        .order('likes_count', { ascending: false })
        .order('views_count', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      
      // Сортируем по "горячести" - лайки + комментарии + просмотры
      const hotPredictions = (data || []).sort((a, b) => {
        const scoreA = (a.likes_count || 0) * 3 + (a.comments_count || 0) * 2 + (a.views_count || 0) * 0.1;
        const scoreB = (b.likes_count || 0) * 3 + (b.comments_count || 0) * 2 + (b.views_count || 0) * 0.1;
        
        if (scoreA !== scoreB) return scoreB - scoreA;
        
        // Если score одинаковый, сортируем по времени создания
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });
      
      return hotPredictions.map(prediction => transformPrediction(prediction));
    },
    enabled: !!user,
    staleTime: 30000,
  });
};

export const useUserPredictions = (userId?: string) => {
  const { user } = useAuth();
  const targetUserId = userId || user?.id;

  return useQuery({
    queryKey: ['user-predictions', targetUserId],
    queryFn: async () => {
      if (!targetUserId) throw new Error('User ID required');

      // @ts-ignore - Temporary fix until types regenerate
      const { data, error } = await supabase
        .from('predictions')
        .select('*')
        .eq('user_id', targetUserId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data?.map(transformPrediction);
    },
    enabled: !!targetUserId,
  });
};

export const usePrediction = (id: string) => {
  return useQuery({
    queryKey: ['prediction', id],
    queryFn: async () => {
      // @ts-ignore - Temporary fix until types regenerate
      const { data, error } = await supabase
        .from('predictions')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      if (!data) throw new Error('Prediction not found');
      
      // @ts-ignore - Temporary fix until types regenerate
      const { data: profile } = await supabase
        .from('profiles')
        .select(`
          first_name,
          last_name,
          display_name,
          avatar_url,
          role,
          tier,
          user_stats!user_stats_user_id_fkey(*)
        `)
        .eq('user_id', data.user_id)
        .maybeSingle();

      return transformPrediction({
        ...data,
        profiles: profile
      });
    },
    enabled: !!id,
  });
};

export const useCreatePrediction = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (predictionData: PredictionData) => {
      if (!user) {
        throw new Error('Пользователь не авторизован');
      }

      // Проверяем права пользователя для публичных прогнозов
      if (predictionData.is_public) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('user_id', user.id)
          .maybeSingle();

        if (!profile || (profile.role !== 'analyst' && profile.role !== 'admin')) {
          throw new Error('Только аналитики и администраторы могут создавать публичные прогнозы');
        }
      }

      console.log('Создание прогноза:', predictionData);
      console.log('Пользователь:', user);
      console.log('User ID для вставки:', user.id);

      const insertData = {
        user_id: user.id,
        title: predictionData.title,
        event_name: predictionData.event_name,
        type: predictionData.type,
        coefficient: predictionData.coefficient,
        description: predictionData.description,
        stake: predictionData.stake,
        category: predictionData.category,
        event_start_time: predictionData.event_start_time,
        prediction_deadline: predictionData.prediction_deadline,
        is_public: predictionData.is_public
      };

      console.log('Данные для вставки:', insertData);

      const { data, error } = await supabase
        .from('predictions')
        .insert([insertData])
        .select()
        .single();

      if (error) {
        console.error('Ошибка создания прогноза:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['predictions'] });
      queryClient.invalidateQueries({ queryKey: ['userPredictions'] });
      toast({
        title: "Успешно",
        description: "Прогноз добавлен",
      });
    },
    onError: (error: any) => {
      console.error('Ошибка при создании прогноза:', error);
      toast({
        title: "Ошибка",
        description: error.message || "Не удалось добавить прогноз",
        variant: "destructive"
      });
    }
  });
};

export const useUpdatePrediction = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<PredictionData> }) => {
      // @ts-ignore - Temporary fix until types regenerate
      const { data: prediction, error } = await supabase
        .from('predictions')
        .update(data as any)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return prediction;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['predictions'] });
      queryClient.invalidateQueries({ queryKey: ['user-predictions'] });
      toast({
        title: 'Успешно!',
        description: 'Прогноз обновлен',
      });
    },
    onError: (error) => {
      toast({
        title: 'Ошибка',
        description: 'Не удалось обновить прогноз',
        variant: 'destructive',
      });
      console.error('Error updating prediction:', error);
    },
  });
};

export const useDeletePrediction = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      // @ts-ignore - Temporary fix until types regenerate
      const { error } = await supabase
        .from('predictions')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['predictions'] });
      queryClient.invalidateQueries({ queryKey: ['user-predictions'] });
      toast({
        title: 'Успешно!',
        description: 'Прогноз удален',
      });
    },
    onError: (error) => {
      toast({
        title: 'Ошибка',
        description: 'Не удалось удалить прогноз',
        variant: 'destructive',
      });
      console.error('Error deleting prediction:', error);
    },
  });
};