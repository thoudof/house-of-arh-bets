import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export const useAchievements = () => {
  return useQuery({
    queryKey: ['achievements'],
    queryFn: async () => {
      // @ts-ignore - Temporary fix until types regenerate
      const { data, error } = await supabase
        .from('achievements')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data;
    },
  });
};

export const useUserAchievements = (userId?: string) => {
  const { user } = useAuth();
  const targetUserId = userId || user?.id;

  return useQuery({
    queryKey: ['user-achievements', targetUserId],
    queryFn: async () => {
      if (!targetUserId) throw new Error('User ID required');

      // @ts-ignore - Temporary fix until types regenerate
      const { data, error } = await supabase
        .from('user_achievements')
        .select(`
          *,
          achievement:achievements(*)
        `)
        .eq('user_id', targetUserId);

      if (error) throw error;
      return data;
    },
    enabled: !!targetUserId,
  });
};