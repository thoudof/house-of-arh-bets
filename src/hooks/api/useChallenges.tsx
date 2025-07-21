import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export interface ChallengeData {
  type: 'ladder' | 'marathon';
  title: string;
  start_bank: number;
  total_steps?: number;
  end_date?: string;
}

export const useChallenges = () => {
  return useQuery({
    queryKey: ['challenges'],
    queryFn: async () => {
      // Challenges not implemented in new schema
      return [];
    },
    staleTime: 60000, // Cache for 1 minute
  });
};

export const useChallenge = (id: string) => {
  return useQuery({
    queryKey: ['challenge', id],
    queryFn: async () => {
      // Challenge details not implemented in new schema
      return null;
    },
    enabled: !!id,
  });
};

export const useCreateChallenge = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: ChallengeData) => {
      if (!user) throw new Error('User not authenticated');

      // Challenge creation not implemented in new schema
      throw new Error('Challenges not yet implemented');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['challenges'] });
      toast({
        title: 'Успешно!',
        description: 'Челлендж создан',
      });
    },
    onError: (error) => {
      toast({
        title: 'Ошибка',
        description: 'Не удалось создать челлендж',
        variant: 'destructive',
      });
      console.error('Error creating challenge:', error);
    },
  });
};