import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export type UserRole = 'user' | 'analyst' | 'premium' | 'vip' | 'admin';
export type UserTier = 'free' | 'telegram_premium' | 'premium' | 'platinum';

export const useUserRole = (userId?: string) => {
  const { user } = useAuth();
  const targetUserId = userId || user?.id;

  return useQuery({
    queryKey: ['user-role', targetUserId],
    queryFn: async () => {
      if (!targetUserId) throw new Error('User ID required');

      // @ts-ignore - Temporary fix until types regenerate
      const { data, error } = await supabase
        .from('profiles')
        .select('role, tier')
        .eq('user_id', targetUserId)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!targetUserId,
  });
};

export const useUpdateUserRole = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ userId, role, tier }: { 
      userId: string; 
      role?: UserRole; 
      tier?: UserTier;
    }) => {
      const updateData: any = {};
      if (role !== undefined) updateData.role = role;
      if (tier !== undefined) updateData.tier = tier;

      // @ts-ignore - Temporary fix until types regenerate
      const { data, error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['user-role', variables.userId] });
      queryClient.invalidateQueries({ queryKey: ['profile', variables.userId] });
      toast({
        title: 'Успешно!',
        description: 'Роль пользователя обновлена',
      });
    },
    onError: (error) => {
      toast({
        title: 'Ошибка',
        description: 'Не удалось обновить роль пользователя',
        variant: 'destructive',
      });
      console.error('Error updating user role:', error);
    },
  });
};

export const useIsAdmin = () => {
  const { data: roleData } = useUserRole();
  return roleData?.role === 'admin';
};

export const useIsAnalyst = () => {
  const { data: roleData } = useUserRole();
  return roleData?.role === 'analyst' || roleData?.role === 'admin';
};

export const useIsPremium = () => {
  const { data: roleData } = useUserRole();
  return ['premium', 'vip', 'admin'].includes(roleData?.role || '');
};

export const getUserRoleDisplay = (role: UserRole): { name: string; color: string } => {
  const roleMap = {
    user: { name: 'Пользователь', color: 'text-muted-foreground' },
    analyst: { name: 'Аналитик', color: 'text-blue-500' },
    premium: { name: 'Премиум', color: 'text-purple-500' },
    vip: { name: 'VIP', color: 'text-yellow-500' },
    admin: { name: 'Администратор', color: 'text-red-500' }
  };
  return roleMap[role] || roleMap.user;
};

export const getUserTierDisplay = (tier: UserTier): { name: string; color: string } => {
  const tierMap = {
    free: { name: 'Новичок', color: 'text-muted-foreground' },
    telegram_premium: { name: 'Telegram Premium', color: 'text-blue-500' },
    premium: { name: 'Premium', color: 'text-purple-500' },
    platinum: { name: 'Platinum', color: 'text-yellow-500' }
  };
  return tierMap[tier] || tierMap.free;
};