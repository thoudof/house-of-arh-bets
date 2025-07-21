import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

// Функция для трансформации данных из snake_case в camelCase
const transformPrediction = (prediction: any) => ({
  ...prediction,
  userId: prediction.user_id,
  startDate: prediction.start_date,
  isPublic: prediction.is_public,
  timeLeft: prediction.time_left,
  createdAt: prediction.created_at,
  updatedAt: prediction.updated_at,
  analyst: prediction.profile?.first_name && prediction.profile?.last_name 
    ? `${prediction.profile.first_name} ${prediction.profile.last_name}`
    : 'Аналитик'
});

export interface PredictionData {
  event: string;
  type: 'single' | 'express' | 'system';
  coefficient: number;
  prediction: string;
  stake?: number;
  category: string;
  description?: string;
  start_date: string;
  end_date?: string;
  is_public?: boolean;
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
            telegram_username,
            avatar_url
          )
        `)
        .eq('is_public', true)
        .order('created_at', { ascending: false })
        .limit(10); // Limit initial load

      if (error) throw error;
      
      return (data || []).map(prediction => transformPrediction(prediction));
    },
    enabled: !!user,
    staleTime: 30000, // Cache for 30 seconds
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
          *,
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
    mutationFn: async (data: PredictionData) => {
      if (!user) throw new Error('User not authenticated');

      // @ts-ignore - Temporary fix until types regenerate
      const { data: prediction, error } = await supabase
        .from('predictions')
        .insert({
          user_id: user.id,
          event_name: data.event,
          type: data.type as any,
          coefficient: data.coefficient,
          title: data.prediction,
          stake: data.stake,
          category: data.category as any,
          description: data.description,
          event_start_time: data.start_date,
          prediction_deadline: data.end_date,
          is_public: data.is_public
        })
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
        description: 'Прогноз создан',
      });
    },
    onError: (error) => {
      toast({
        title: 'Ошибка',
        description: 'Не удалось создать прогноз',
        variant: 'destructive',
      });
      console.error('Error creating prediction:', error);
    },
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