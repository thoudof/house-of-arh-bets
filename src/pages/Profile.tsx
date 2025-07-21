import { useState, useEffect } from "react";
import { User, ArrowLeft, Trophy, Target, TrendingUp, Activity, Calendar, Star, Award } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { useNavigate, useParams } from "react-router-dom";
import PredictionCard from "@/components/PredictionCard";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/api/useProfiles";
import { useUserPredictions } from "@/hooks/api/usePredictions";
import { useUserAchievements } from "@/hooks/api/useAchievements";
import UserRoleDisplay from "@/components/UserRoleDisplay";

const Profile = () => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { data: profile, isLoading: profileLoading, error: profileError } = useProfile();
  const { data: predictions, isLoading: predictionsLoading } = useUserPredictions();
  const { data: userAchievements, isLoading: achievementsLoading } = useUserAchievements();

  const [activeTab, setActiveTab] = useState("overview");
  
  useEffect(() => {
    if (!authLoading && !isAuthenticated && !profileLoading) {
      navigate('/');
    }
  }, [isAuthenticated, profileLoading, authLoading, navigate]);

  if (profileError) {
    return (
      <div className="min-h-screen bg-background telegram-safe-area flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Ошибка загрузки профиля</p>
        </div>
      </div>
    );
  }

  if (profileLoading) {
    return (
      <div className="min-h-screen bg-background telegram-safe-area flex items-center justify-center">
        <div className="text-center">
          <div>Загрузка данных профиля...</div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background telegram-safe-area flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg mb-2">Профиль не найден</div>
          <Button onClick={() => navigate('/')} className="mt-4">
            На главную
          </Button>
        </div>
      </div>
    );
  }

  const getRankInfo = (rank: string) => {
    const ranks = {
      newbie: { name: "Новичок", color: "text-muted-foreground", progress: 20 },
      bronze: { name: "Бронза", color: "text-orange-600", progress: 40 },
      silver: { name: "Серебро", color: "text-gray-400", progress: 60 },
      gold: { name: "Золото", color: "text-yellow-500", progress: 80 },
      platinum: { name: "Платина", color: "text-blue-400", progress: 90 },
      diamond: { name: "Алмаз", color: "text-purple-400", progress: 100 }
    };
    return ranks[rank as keyof typeof ranks] || ranks.newbie;
  };

  const rankInfo = getRankInfo('newbie');
  const stats = Array.isArray(profile.user_stats) ? profile.user_stats[0] : profile.user_stats;

  return (
    <div className="min-h-screen bg-background telegram-safe-area">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="text-xl font-bold">Профиль</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Profile Header */}
        <Card className="card-gradient">
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <Avatar className="w-20 h-20">
                <AvatarImage src={profile.avatar_url || undefined} alt={profile.first_name} />
                <AvatarFallback>{profile.first_name[0]}{profile.last_name?.[0]}</AvatarFallback>
              </Avatar>
              
              <div className="flex-1 space-y-2">
                <div className="flex items-center space-x-2">
                  <h2 className="text-2xl font-bold">{profile.first_name} {profile.last_name}</h2>
                  <Badge variant="outline" className={rankInfo.color}>
                    {rankInfo.name}
                  </Badge>
                </div>
                
                <p className="text-muted-foreground">@{profile.telegram_username || 'Пользователь'}</p>
                
                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>С {new Date(profile.created_at).toLocaleDateString('ru-RU')}</span>
                  </div>
                  <UserRoleDisplay userId={profile.user_id} showTier={true} size="sm" />
                </div>

                {/* Rank Progress */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>Прогресс ранга</span>
                    <span>{rankInfo.progress}%</span>
                  </div>
                  <Progress value={rankInfo.progress} className="h-2" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <Card className="card-gradient">
            <CardContent className="p-3 text-center">
              <Activity className="w-5 h-5 mx-auto mb-1 text-primary" />
              <p className="text-lg font-bold">{stats?.total_predictions || 0}</p>
              <p className="text-xs text-muted-foreground">Всего ставок</p>
            </CardContent>
          </Card>
          
          <Card className="card-gradient">
            <CardContent className="p-3 text-center">
              <Target className="w-5 h-5 mx-auto mb-1 text-success" />
              <p className="text-lg font-bold">
                {stats?.total_predictions > 0 ? 
                  Math.round((stats.successful_predictions / stats.total_predictions) * 100) : 0}%
              </p>
              <p className="text-xs text-muted-foreground">Процент побед</p>
            </CardContent>
          </Card>
          
          <Card className="card-gradient">
            <CardContent className="p-3 text-center">
              <TrendingUp className="w-5 h-5 mx-auto mb-1 text-primary" />
              <p className="text-lg font-bold">+{stats?.roi || 0}%</p>
              <p className="text-xs text-muted-foreground">ROI</p>
            </CardContent>
          </Card>
          
          <Card className="card-gradient">
            <CardContent className="p-3 text-center">
              <Trophy className="w-5 h-5 mx-auto mb-1 text-primary-glow" />
              <p className="text-lg font-bold">{stats?.current_win_streak || 0}</p>
              <p className="text-xs text-muted-foreground">Текущая серия</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Card className="card-gradient">
          <CardContent className="p-4">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3 text-sm bg-muted/50 rounded-lg p-1">
                <TabsTrigger value="overview" className="text-xs data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm">Обзор</TabsTrigger>
                <TabsTrigger value="predictions" className="text-xs data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm">Ставки</TabsTrigger>
                <TabsTrigger value="achievements" className="text-xs data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm">Награды</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <Card className="card-gradient">
                  <CardHeader>
                    <CardTitle className="text-base">Детальная статистика</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Прибыль</p>
                        <p className="text-lg font-semibold text-success">+{stats?.total_profit || 0} ₽</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Средний коэф.</p>
                        <p className="text-lg font-semibold">{stats?.average_coefficient || 0}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Лучшая серия</p>
                        <p className="text-lg font-semibold">{stats?.best_win_streak || 0}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Всего поставлено</p>
                        <p className="text-lg font-semibold">{stats?.total_stake || 0} ₽</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="predictions" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Мои ставки</h3>
                  <Button variant="default" size="sm" onClick={() => navigate('/add-prediction')}>
                    Добавить ставку
                  </Button>
                </div>
                
                <div className="space-y-4">
                  {predictionsLoading ? (
                    <div>Загрузка прогнозов...</div>
                  ) : predictions?.length ? (
                    predictions.map((prediction) => (
                      <PredictionCard 
                        key={prediction.id} 
                        prediction={prediction}
                        onClick={() => navigate(`/prediction/${prediction.id}`)}
                      />
                    ))
                  ) : (
                    <div className="text-center text-muted-foreground py-8">
                      Прогнозов пока нет
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="achievements" className="space-y-4">
                <h3 className="text-lg font-semibold">Достижения</h3>
                <div className="grid grid-cols-1 gap-3">
                  {achievementsLoading ? (
                    <div>Загрузка достижений...</div>
                  ) : userAchievements?.length ? (
                    userAchievements.map((userAchievement) => (
                      <Card 
                        key={userAchievement.id} 
                        className="card-gradient border-primary/50"
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-3">
                            <div className="text-2xl">{userAchievement.achievement.icon_emoji}</div>
                            <div className="flex-1">
                              <h4 className="font-semibold">{userAchievement.achievement.title}</h4>
                              <p className="text-sm text-muted-foreground">{userAchievement.achievement.description}</p>
                              <p className="text-xs text-primary">
                                Получено: {new Date(userAchievement.completed_at).toLocaleDateString('ru-RU')}
                              </p>
                            </div>
                            <Award className="w-5 h-5 text-primary" />
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <div className="text-center text-muted-foreground py-8">
                      Достижений пока нет
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;