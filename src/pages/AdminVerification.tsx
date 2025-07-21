import React, { useState } from 'react';
import { ArrowLeft, CheckCircle, UserCheck, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import Navigation from '@/components/Navigation';
import LoadingScreen from '@/components/LoadingScreen';
import TelegramLogin from '@/components/TelegramLogin';
import { useAuth } from '@/hooks/useAuth';

const AdminVerification = () => {
  const navigate = useNavigate();
  const { user, isLoading, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Show loading screen while auth is being checked
  if (isLoading) {
    return <LoadingScreen />;
  }

  // Если пользователь не авторизован
  if (!isAuthenticated || !user) {
    return <TelegramLogin />;
  }

  const searchProfiles = async () => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          *,
          user_stats!user_stats_user_id_fkey(*)
        `)
        .ilike('first_name', `%${searchQuery}%`)
        .limit(10);

      if (error) throw error;
      setProfiles(data || []);
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось найти профили',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleVerification = async (profileId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          is_verified: !currentStatus,
          verification_date: !currentStatus ? new Date().toISOString() : null,
          verification_type: !currentStatus ? 'manual' : null
        })
        .eq('id', profileId);

      if (error) throw error;

      // Обновляем локальное состояние
      setProfiles(prev => prev.map(p => 
        p.id === profileId 
          ? { ...p, is_verified: !currentStatus }
          : p
      ));

      toast({
        title: 'Успешно!',
        description: `Верификация ${!currentStatus ? 'добавлена' : 'удалена'}`,
      });
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось изменить статус верификации',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen bg-background telegram-safe-area">
      {/* Header */}
      <header className="bg-gradient-to-r from-card to-card-hover border-b border-border/30 backdrop-blur-lg sticky top-0 z-50">
        <div className="px-4 py-4 max-w-screen-lg mx-auto">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="hover:bg-muted/50"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-lg font-bold text-foreground flex items-center space-x-2">
                <UserCheck className="w-5 h-5 text-primary" />
                <span>Управление верификацией</span>
              </h1>
              <p className="text-xs text-muted-foreground">
                Администрирование верифицированных профилей
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <section className="px-4 pt-6 pb-20 max-w-screen-lg mx-auto space-y-6">
        
        {/* Search */}
        <Card className="card-gradient border-0">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Search className="w-5 h-5 text-primary" />
              <span>Поиск профилей</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex space-x-2">
              <Input
                placeholder="Введите имя пользователя..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && searchProfiles()}
              />
              <Button onClick={searchProfiles} disabled={loading}>
                Найти
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {profiles.length > 0 && (
          <Card className="card-gradient border-0">
            <CardHeader>
              <CardTitle>Результаты поиска</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {profiles.map((profile) => (
                <div
                  key={profile.id}
                  className="flex items-center justify-between p-3 bg-muted/20 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-glow rounded-full flex items-center justify-center">
                      <span className="text-primary-foreground font-medium">
                        {profile.first_name?.[0] || 'U'}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-foreground">
                          {profile.first_name} {profile.last_name}
                        </span>
                        {profile.is_verified && (
                          <CheckCircle className="w-4 h-4 text-primary" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        @{profile.telegram_username || 'без_username'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <div className="text-right text-xs">
                      <p className="text-foreground">
                        {profile.user_stats?.[0]?.total_predictions || 0} прогнозов
                      </p>
                      <p className="text-muted-foreground">
                        {profile.user_stats?.[0]?.successful_predictions || 0} побед
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant={profile.is_verified ? "destructive" : "default"}
                      onClick={() => toggleVerification(profile.id, profile.is_verified)}
                    >
                      {profile.is_verified ? 'Убрать' : 'Верифицировать'}
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

      </section>

      {/* Bottom Navigation */}
      <Navigation />
    </div>
  );
};

export default AdminVerification;