import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useTelegramAuth } from '@/hooks/useTelegramAuth';

export const useUserStats = () => {
  const { user } = useTelegramAuth();

  return useQuery({
    queryKey: ['userStats', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });
};

export const useAnalytics = () => {
  const { user } = useTelegramAuth();

  return useQuery({
    queryKey: ['analytics', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('User not authenticated');

      // Получаем прогнозы пользователя для аналитики
      const { data: predictions, error } = await supabase
        .from('predictions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Вычисляем статистику
      const totalBets = predictions.length;
      const wonBets = predictions.filter(p => p.status === 'win').length;
      const winRate = totalBets > 0 ? (wonBets / totalBets) * 100 : 0;
      const totalProfit = predictions.reduce((sum, p) => sum + (p.profit || 0), 0);
      const totalStake = predictions.reduce((sum, p) => sum + (p.stake || 0), 0);
      const roi = totalStake > 0 ? (totalProfit / totalStake) * 100 : 0;
      const averageOdds = totalBets > 0 ? predictions.reduce((sum, p) => sum + p.coefficient, 0) / totalBets : 0;

      // Группируем по категориям
      const categoryStats = predictions.reduce((acc, pred) => {
        const category = pred.category;
        if (!acc[category]) {
          acc[category] = { bets: 0, won: 0, profit: 0, stake: 0 };
        }
        acc[category].bets++;
        if (pred.status === 'win') acc[category].won++;
        acc[category].profit += pred.profit || 0;
        acc[category].stake += pred.stake || 0;
        return acc;
      }, {} as Record<string, any>);

      const categoryArray = Object.entries(categoryStats).map(([category, stats]) => ({
        category,
        bets: stats.bets,
        winRate: stats.bets > 0 ? (stats.won / stats.bets) * 100 : 0,
        roi: stats.stake > 0 ? (stats.profit / stats.stake) * 100 : 0,
        profit: stats.profit
      }));

      return {
        totalBets,
        wonBets,
        winRate,
        totalProfit,
        roi,
        averageOdds,
        categoryStats: categoryArray,
        predictions
      };
    },
    enabled: !!user?.id,
  });
};