import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useTelegramAuth } from '@/hooks/useTelegramAuth';
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
      const { data, error } = await supabase
        .from('challenges')
        .select(`
          *,
          profiles:creator_id (
            first_name,
            last_name,
            username,
            avatar_url
          )
        `)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(5); // Limit initial load

      if (error) throw error;
      return data;
    },
    staleTime: 60000, // Cache for 1 minute
  });
};

export const useChallenge = (id: string) => {
  return useQuery({
    queryKey: ['challenge', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('challenges')
        .select(`
          *,
          profiles!challenges_creator_id_fkey(
            first_name,
            last_name,
            username,
            avatar_url
          ),
          challenge_predictions(
            *,
            predictions(
              *,
              profiles!predictions_user_id_fkey(
                first_name,
                last_name,
                username
              )
            )
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

export const useCreateChallenge = () => {
  const queryClient = useQueryClient();
  const { user } = useTelegramAuth();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: ChallengeData) => {
      if (!user) throw new Error('User not authenticated');

      const { data: challenge, error } = await supabase
        .from('challenges')
        .insert({
          ...data,
          creator_id: user.id,
          creator_name: user.first_name || 'Unknown',
          current_bank: data.start_bank,
        })
        .select()
        .single();

      if (error) throw error;
      return challenge;
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