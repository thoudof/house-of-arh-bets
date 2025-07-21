import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export interface ChallengeData {
  title: string;
  description?: string;
  type: 'ladder' | 'express' | 'weekly' | 'custom';
  category?: string;
  prize_pool?: number;
  entry_fee?: number;
  max_participants?: number;
  duration_hours?: number;
  difficulty?: 'easy' | 'medium' | 'hard';
  min_coefficient?: number;
  steps_count?: number;
  is_private?: boolean;
  rules?: string;
}

// Transform function for backward compatibility
const transformChallenge = (challenge: any) => ({
  ...challenge,
  total_steps: challenge.steps_count || 10,
  current_step: 0, // Default for display
  current_bank: 0, // Default for display
  creator_name: challenge.profiles 
    ? `${challenge.profiles.first_name} ${challenge.profiles.last_name || ''}`.trim()
    : 'Создатель'
});

export const useChallenges = () => {
  return useQuery({
    queryKey: ['challenges'],
    queryFn: async () => {
      // @ts-ignore - Temporary fix until types regenerate
      const { data, error } = await supabase
        .from('challenges')
        .select(`
          *,
          profiles!challenges_user_id_fkey (
            first_name,
            last_name,
            telegram_username,
            avatar_url
          )
        `)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []).map(transformChallenge);
    },
    staleTime: 60000, // Cache for 1 minute
  });
};

export const useChallenge = (id: string) => {
  return useQuery({
    queryKey: ['challenge', id],
    queryFn: async () => {
      // @ts-ignore - Temporary fix until types regenerate
      const { data, error } = await supabase
        .from('challenges')
        .select(`
          *,
          profiles!challenges_user_id_fkey (
            first_name,
            last_name,
            telegram_username,
            avatar_url
          ),
          challenge_participants (
            id,
            user_id,
            joined_at,
            current_step,
            current_bank,
            is_eliminated,
            profiles!challenge_participants_user_id_fkey (
              first_name,
              last_name,
              avatar_url
            )
          )
        `)
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      return data ? transformChallenge(data) : null;
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

      // @ts-ignore - Temporary fix until types regenerate
      const { data: challenge, error } = await supabase
        .from('challenges')
        .insert({
          user_id: user.id,
          title: data.title,
          description: data.description,
          type: data.type,
          category: data.category,
          prize_pool: data.prize_pool || 0,
          entry_fee: data.entry_fee || 0,
          max_participants: data.max_participants,
          duration_hours: data.duration_hours,
          difficulty: data.difficulty,
          min_coefficient: data.min_coefficient,
          steps_count: data.steps_count,
          is_private: data.is_private || false,
          rules: data.rules,
          end_date: data.duration_hours 
            ? new Date(Date.now() + data.duration_hours * 60 * 60 * 1000).toISOString()
            : null
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

export const useJoinChallenge = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (challengeId: string) => {
      if (!user) throw new Error('User not authenticated');

      // @ts-ignore - Temporary fix until types regenerate
      const { data, error } = await supabase
        .from('challenge_participants')
        .insert({
          challenge_id: challengeId,
          user_id: user.id
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['challenges'] });
      toast({
        title: 'Успешно!',
        description: 'Вы присоединились к челленджу',
      });
    },
    onError: (error) => {
      toast({
        title: 'Ошибка',
        description: 'Не удалось присоединиться к челленджу',
        variant: 'destructive',
      });
      console.error('Error joining challenge:', error);
    },
  });
};