import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { isDemoMode } from '@/lib/utils';
import { useDemoProfile, useDemoTopAnalysts } from './useDemoProfiles';

export const useProfile = (userId?: string) => {
  const { user } = useAuth();
  const targetUserId = userId || user?.id;
  const demoProfile = useDemoProfile(targetUserId);

  // Если в demo режиме, возвращаем demo данные
  if (isDemoMode()) {
    return demoProfile;
  }

  return useQuery({
    queryKey: ['profile', targetUserId],
    queryFn: async () => {
      if (!targetUserId) {
        console.error('useProfile: User ID required but not provided');
        throw new Error('User ID required');
      }

      console.log('useProfile: Fetching profile for user ID:', targetUserId);

      // Если это текущий пользователь, получаем полный профиль
      if (user && targetUserId === user.id) {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', targetUserId)
          .maybeSingle();

        if (error) {
          console.error('useProfile: Error fetching profile:', error);
          throw error;
        }

        if (!profile) {
          console.warn('useProfile: No profile found for user ID:', targetUserId);
          return null;
        }

        // Fetch user stats separately
        const { data: userStats, error: statsError } = await supabase
          .from('user_stats')
          .select('*')
          .eq('user_id', targetUserId)
          .maybeSingle();

        if (statsError) {
          console.error('useProfile: Error fetching user stats:', statsError);
        }

        return {
          ...profile,
          user_stats: userStats ? [userStats] : []
        };
      } else {
        // Для других пользователей используем безопасный public_profiles view
        const { data: publicProfile, error } = await supabase
          .from('public_profiles')
          .select('*')
          .eq('user_id', targetUserId)
          .maybeSingle();

        if (error) {
          console.error('useProfile: Error fetching public profile:', error);
          throw error;
        }

        if (!publicProfile) {
          console.warn('useProfile: No public profile found for user ID:', targetUserId);
          return null;
        }

        // Fetch user stats separately
        const { data: userStats, error: statsError } = await supabase
          .from('user_stats')
          .select('*')
          .eq('user_id', targetUserId)
          .maybeSingle();

        if (statsError) {
          console.error('useProfile: Error fetching user stats:', statsError);
        }

        const result = {
          ...publicProfile,
          user_stats: userStats ? [userStats] : []
        };

        console.log('useProfile: Successfully fetched public profile:', result);
        return result;
      }
    },
    enabled: !!targetUserId && !isDemoMode(),
    retry: (failureCount, error) => {
      if (error?.message?.includes('not found') || (error as any)?.code === 'PGRST116') {
        return false;
      }
      return failureCount < 3;
    },
  });
};

export const useTopAnalysts = () => {
  const demoTopAnalysts = useDemoTopAnalysts();

  // Если в demo режиме, возвращаем demo данные
  if (isDemoMode()) {
    return demoTopAnalysts;
  }

  return useQuery({
    queryKey: ['top-analysts'],
    queryFn: async () => {
      // Используем безопасный view top_analysts
      const { data: analysts, error } = await supabase
        .from('top_analysts')
        .select('*');

      if (error) throw error;

      // Преобразуем данные в нужный формат
      return (analysts || []).map(analyst => ({
        user_id: analyst.user_id,
        display_name: analyst.display_name,
        avatar_url: analyst.avatar_url,
        tier: analyst.tier,
        is_verified: analyst.is_verified,
        user_stats: {
          total_predictions: analyst.total_predictions,
          successful_predictions: analyst.successful_predictions,
          roi: analyst.roi,
          rating: analyst.rating,
          total_subscribers: analyst.total_subscribers
        }
      }));
    },
    enabled: !isDemoMode(),
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

      // Sort by total profit
      profilesWithStats.sort((a, b) => {
        const aProfit = a.user_stats[0]?.total_profit || 0;
        const bProfit = b.user_stats[0]?.total_profit || 0;
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