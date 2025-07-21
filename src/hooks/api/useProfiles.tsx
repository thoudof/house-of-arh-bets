import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export const useProfile = (userId?: string) => {
  const { user } = useAuth();
  const targetUserId = userId || user?.id;

  return useQuery({
    queryKey: ['profile', targetUserId],
    queryFn: async () => {
      if (!targetUserId) {
        console.error('useProfile: User ID required but not provided');
        throw new Error('User ID required');
      }

      console.log('useProfile: Fetching profile for user ID:', targetUserId);

      // @ts-ignore - Temporary fix until types regenerate
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', targetUserId)
        .maybeSingle(); // Use maybeSingle instead of single to avoid error when no data

      if (error) {
        console.error('useProfile: Error fetching profile:', error);
        throw error;
      }

      if (!profile) {
        console.warn('useProfile: No profile found for user ID:', targetUserId);
        return null;
      }

      // Fetch user stats separately
      // @ts-ignore - Temporary fix until types regenerate
      const { data: userStats, error: statsError } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', targetUserId)
        .maybeSingle();

      if (statsError) {
        console.error('useProfile: Error fetching user stats:', statsError);
      }

      const result = {
        ...profile,
        user_stats: userStats ? [userStats] : []
      };

      console.log('useProfile: Successfully fetched profile:', result);
      return result;
    },
    enabled: !!targetUserId,
    retry: (failureCount, error) => {
      // Retry up to 3 times, but not for "not found" errors
      if (error?.message?.includes('not found') || (error as any)?.code === 'PGRST116') {
        return false;
      }
      return failureCount < 3;
    },
  });
};

export const useTopAnalysts = () => {
  return useQuery({
    queryKey: ['top-analysts'],
    queryFn: async () => {
      // Fetch all profiles for now since we removed role column
      // @ts-ignore - Temporary fix until types regenerate
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select(`
          *,
          user_stats!inner(*)
        `)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;

      // Fetch user stats for each analyst
      const analystsWithStats = await Promise.all(
        (profiles || []).map(async (profile) => {
          // @ts-ignore - Temporary fix until types regenerate
          const { data: userStats } = await supabase
            .from('user_stats')
            .select('*')
            .eq('user_id', profile.user_id)
            .single();

          return {
            ...profile,
            user_stats: userStats
          };
        })
      );

      return analystsWithStats;
    },
  });
};

export const useRankings = () => {
  return useQuery({
    queryKey: ['rankings'],
    queryFn: async () => {
      // @ts-ignore - Temporary fix until types regenerate
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('*')
        .limit(50);

      if (error) throw error;

      // Fetch user stats for each profile and sort by profit
      const profilesWithStats = await Promise.all(
        (profiles || []).map(async (profile) => {
          // @ts-ignore - Temporary fix until types regenerate
          const { data: userStats } = await supabase
            .from('user_stats')
            .select('*')
            .eq('user_id', profile.user_id)
            .single();

          return {
            ...profile,
            user_stats: userStats ? [userStats] : []
          };
        })
      );

      // Sort by profit
      profilesWithStats.sort((a, b) => {
        const aProfit = a.user_stats[0]?.profit || 0;
        const bProfit = b.user_stats[0]?.profit || 0;
        return bProfit - aProfit;
      });

      return profilesWithStats;
    },
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: {
      first_name?: string;
      last_name?: string;
      username?: string;
      avatar_url?: string;
    }) => {
      if (!user) throw new Error('User not authenticated');

      // @ts-ignore - Temporary fix until types regenerate
      const { data: profile, error } = await supabase
        .from('profiles')
        .update(data)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      return profile;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast({
        title: 'Успешно!',
        description: 'Профиль обновлен',
      });
    },
    onError: (error) => {
      toast({
        title: 'Ошибка',
        description: 'Не удалось обновить профиль',
        variant: 'destructive',
      });
      console.error('Error updating profile:', error);
    },
  });
};