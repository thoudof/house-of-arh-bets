import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

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
      const { data, error } = await supabase
        .from('predictions')
        .select('*')
        .eq('is_public', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Fetch profiles separately for each prediction
      const predictionsWithProfiles = await Promise.all(
        (data || []).map(async (prediction) => {
          const { data: profile } = await supabase
            .from('profiles')
            .select('first_name, last_name, username, avatar_url')
            .eq('user_id', prediction.user_id)
            .single();
          
          return {
            ...prediction,
            profile
          };
        })
      );

      return predictionsWithProfiles;
    },
    enabled: !!user,
  });
};

export const useUserPredictions = (userId?: string) => {
  const { user } = useAuth();
  const targetUserId = userId || user?.id;

  return useQuery({
    queryKey: ['user-predictions', targetUserId],
    queryFn: async () => {
      if (!targetUserId) throw new Error('User ID required');

      const { data, error } = await supabase
        .from('predictions')
        .select('*')
        .eq('user_id', targetUserId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!targetUserId,
  });
};

export const usePrediction = (id: string) => {
  return useQuery({
    queryKey: ['prediction', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('predictions')
        .select(`
          *,
          profiles!predictions_user_id_fkey(
            first_name,
            last_name,
            username,
            avatar_url,
            role
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
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

      const { data: prediction, error } = await supabase
        .from('predictions')
        .insert({
          ...data,
          user_id: user.id,
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
      const { data: prediction, error } = await supabase
        .from('predictions')
        .update(data)
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