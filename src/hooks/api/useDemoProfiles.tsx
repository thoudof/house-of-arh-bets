import { useQuery } from '@tanstack/react-query';
import { isDemoMode } from '@/lib/utils';
import { DEMO_PROFILE, DEMO_USER_STATS, DEMO_TOP_ANALYSTS } from '@/lib/demo-data';

// Demo версия хука профилей
export const useDemoProfile = (userId?: string) => {
  return useQuery({
    queryKey: ['demo-profile', userId],
    queryFn: async () => {
      if (!isDemoMode()) return null;
      
      return {
        ...DEMO_PROFILE,
        user_stats: DEMO_USER_STATS
      };
    },
    enabled: isDemoMode(),
    staleTime: Infinity, // Статичные demo данные
  });
};

export const useDemoTopAnalysts = () => {
  return useQuery({
    queryKey: ['demo-top-analysts'],
    queryFn: async () => {
      if (!isDemoMode()) return [];
      
      return DEMO_TOP_ANALYSTS;
    },
    enabled: isDemoMode(),
    staleTime: Infinity,
  });
};

export const useDemoUserStats = () => {
  return useQuery({
    queryKey: ['demo-user-stats'],
    queryFn: async () => {
      if (!isDemoMode()) return null;
      
      return DEMO_USER_STATS;
    },
    enabled: isDemoMode(),
    staleTime: Infinity,
  });
};