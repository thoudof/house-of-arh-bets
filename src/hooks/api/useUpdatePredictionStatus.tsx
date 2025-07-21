import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface UpdateStatusData {
  id: string;
  status: 'win' | 'loss' | 'cancelled';
  profit?: number;
}

export const useUpdatePredictionStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateStatusData) => {
      const { error } = await supabase
        .from('predictions')
        .update({
          status: data.status,
          profit: data.profit,
          updated_at: new Date().toISOString()
        })
        .eq('id', data.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['predictions'] });
      queryClient.invalidateQueries({ queryKey: ['user-predictions'] });
      queryClient.invalidateQueries({ queryKey: ['user-stats'] });
      toast.success('Результат прогноза обновлен');
    },
    onError: (error) => {
      console.error('Error updating prediction status:', error);
      toast.error('Ошибка при обновлении результата');
    },
  });
};