import { useState, useEffect } from "react";
import { ArrowLeft, Trophy, Target, TrendingUp, Activity, Calendar, Star, Award, Settings, Share2, Users, Flame } from "lucide-react";
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
import VerificationBadge from "@/components/VerificationBadge";

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
          <div className="animate-pulse">Загрузка данных профиля...</div>
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

  const stats = Array.isArray(profile.user_stats) ? profile.user_stats[0] : profile.user_stats;

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('ru-RU', { 
      month: 'long', 
      year: 'numeric' 
    });
  };

  const getWinRate = () => {
    if (!stats?.total_predictions || stats.total_predictions === 0) return 0;
    return Math.round((stats.successful_predictions / stats.total_predictions) * 100);
  };

  const getTierProgress = () => {
    if (!stats) return { nextLevel: "Bronze", progress: 0 };
    
    const currentTier = profile.tier || 'free';
    const winRate = getWinRate();
    const totalPredictions = stats.total_predictions || 0;
    const rating = stats.rating || 1000;
    
    // Определяем прогресс к следующему тиру на основе статистики
    switch (currentTier) {
      case 'free':
        // До Bronze: 10 прогнозов и 50% винрейт
        const predictionsProgress = Math.min((totalPredictions / 10) * 50, 50);
        const winRateProgress = Math.min((winRate / 50) * 50, 50);
        return { 
          nextLevel: "Bronze", 
          progress: Math.round(predictionsProgress + winRateProgress)
        };
      
      case 'telegram_premium':
        // До Bronze: 8 прогнозов и 45% винрейт (льгота за Telegram Premium)
        const tgPredictionsProgress = Math.min((totalPredictions / 8) * 50, 50);
        const tgWinRateProgress = Math.min((winRate / 45) * 50, 50);
        return { 
          nextLevel: "Bronze", 
          progress: Math.round(tgPredictionsProgress + tgWinRateProgress)
        };
      
      case 'premium':
        // До Platinum: 50 прогнозов и 60% винрейт
        const premiumPredictionsProgress = Math.min((totalPredictions / 50) * 50, 50);
        const premiumWinRateProgress = Math.min((winRate / 60) * 50, 50);
        return { 
          nextLevel: "Platinum", 
          progress: Math.round(premiumPredictionsProgress + premiumWinRateProgress)
        };
      
      case 'platinum':
        return { nextLevel: "Максимум", progress: 100 };
      
      default:
        return { nextLevel: "Bronze", progress: 0 };
    }
  };

  const tierProgress = getTierProgress();

  return (
    <div className="min-h-screen bg-background telegram-safe-area">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="px-3 sm:px-4 py-3 sm:py-4 max-w-screen-lg mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="p-2">
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <h1 className="text-lg sm:text-xl font-bold">Профиль</h1>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" className="p-2">
                <Share2 className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => navigate('/settings')} className="p-2">
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="px-3 sm:px-4 py-4 sm:py-6 max-w-screen-lg mx-auto space-y-4 sm:space-y-6">
        {/* Profile Header - Mobile Optimized */}
        <Card className="card-gradient glow-primary animate-fade-in">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
              {/* Avatar and Basic Info */}
              <div className="flex flex-col items-center sm:items-start space-y-3">
                <Avatar className="w-20 h-20 sm:w-24 sm:h-24 border-2 border-primary/20">
                  <AvatarImage src={profile.avatar_url || undefined} alt={profile.first_name} />
                  <AvatarFallback className="text-lg font-semibold bg-gradient-to-br from-primary to-primary-glow text-primary-foreground">
                    {profile.first_name[0]}{'last_name' in profile ? profile.last_name?.[0] : ''}
                  </AvatarFallback>
                </Avatar>
                
                <div className="text-center sm:text-left">
                  <div className="flex items-center justify-center sm:justify-start space-x-2 mb-1">
                    <h2 className="text-xl sm:text-2xl font-bold">
                      {profile.display_name || profile.first_name}
                    </h2>
                    <VerificationBadge isVerified={profile.is_verified} size="sm" />
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {'telegram_username' in profile && profile.telegram_username ? `@${profile.telegram_username}` : ''}
                  </p>
                  
                   {/* Role and Tier Display */}
                  <div className="flex justify-center sm:justify-start gap-2 mb-2">
                    <UserRoleDisplay userId={profile.user_id} showTier={true} showRole={true} size="sm" />
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="flex-1 w-full">
                <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-4">
                  <div className="text-center">
                    <p className="text-lg sm:text-xl font-bold text-primary">
                      {stats?.total_predictions || 0}
                    </p>
                    <p className="text-xs text-muted-foreground">Прогнозов</p>
                  </div>
                  <div className="text-center border-x border-border/50 px-2">
                    <p className="text-lg sm:text-xl font-bold text-success">
                      {getWinRate()}%
                    </p>
                    <p className="text-xs text-muted-foreground">Побед</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg sm:text-xl font-bold text-primary-glow">
                      {stats?.current_win_streak || 0}
                    </p>
                    <p className="text-xs text-muted-foreground">Серия</p>
                  </div>
                </div>

                {/* Progress to Next Tier */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-muted-foreground">До {tierProgress.nextLevel}</span>
                    <span className="font-medium">{tierProgress.progress}%</span>
                  </div>
                  <Progress value={tierProgress.progress} className="h-2" />
                </div>

                {/* Member Since */}
                <div className="flex items-center justify-center sm:justify-start mt-3 text-xs text-muted-foreground">
                  <Calendar className="w-3 h-3 mr-1" />
                  <span>Участник с {formatDate(profile.created_at)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats - Mobile First */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
          <Card className="card-gradient card-hover animate-fade-in" style={{ animationDelay: '100ms' }}>
            <CardContent className="p-3 text-center">
              <div className="w-8 h-8 mx-auto mb-2 bg-success/20 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-success" />
              </div>
              <p className="text-sm sm:text-base font-bold">+{stats?.roi?.toFixed(1) || 0}%</p>
              <p className="text-xs text-muted-foreground">ROI</p>
            </CardContent>
          </Card>
          
          <Card className="card-gradient card-hover animate-fade-in" style={{ animationDelay: '200ms' }}>
            <CardContent className="p-3 text-center">
              <div className="w-8 h-8 mx-auto mb-2 bg-primary/20 rounded-lg flex items-center justify-center">
                <Target className="w-4 h-4 text-primary" />
              </div>
              <p className="text-sm sm:text-base font-bold">{stats?.average_coefficient?.toFixed(2) || '0.00'}</p>
              <p className="text-xs text-muted-foreground">Ср. коэф.</p>
            </CardContent>
          </Card>
          
          <Card className="card-gradient card-hover animate-fade-in" style={{ animationDelay: '300ms' }}>
            <CardContent className="p-3 text-center">
              <div className="w-8 h-8 mx-auto mb-2 bg-destructive/20 rounded-lg flex items-center justify-center">
                <Flame className="w-4 h-4 text-destructive" />
              </div>
              <p className="text-sm sm:text-base font-bold">{stats?.best_win_streak || 0}</p>
              <p className="text-xs text-muted-foreground">Лучшая серия</p>
            </CardContent>
          </Card>
          
          <Card className="card-gradient card-hover animate-fade-in" style={{ animationDelay: '400ms' }}>
            <CardContent className="p-3 text-center">
              <div className="w-8 h-8 mx-auto mb-2 bg-primary-glow/20 rounded-lg flex items-center justify-center">
                <Trophy className="w-4 h-4 text-primary-glow" />
              </div>
              <p className="text-sm sm:text-base font-bold">{stats?.rating || 1000}</p>
              <p className="text-xs text-muted-foreground">Рейтинг</p>
            </CardContent>
          </Card>
        </div>

        {/* Content Tabs - Mobile Optimized */}
        <Card className="card-gradient animate-fade-in" style={{ animationDelay: '500ms' }}>
          <CardContent className="p-3 sm:p-4">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-muted/30 rounded-lg p-1 mb-4">
                <TabsTrigger value="overview" className="text-xs sm:text-sm">
                  Обзор
                </TabsTrigger>
                <TabsTrigger value="predictions" className="text-xs sm:text-sm">
                  Ставки
                </TabsTrigger>
                <TabsTrigger value="achievements" className="text-xs sm:text-sm">
                  Награды
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4 mt-4">
                {/* Financial Stats */}
                <Card className="card-gradient border-success/20">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm sm:text-base flex items-center">
                      <TrendingUp className="w-4 h-4 mr-2 text-success" />
                      Финансы
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="text-center p-2 bg-success/10 rounded-lg">
                        <p className="text-xs text-muted-foreground">Прибыль</p>
                        <p className="text-lg font-bold text-success">
                          +{stats?.total_profit?.toFixed(0) || 0} ₽
                        </p>
                      </div>
                      <div className="text-center p-2 bg-muted/30 rounded-lg">
                        <p className="text-xs text-muted-foreground">Поставлено</p>
                        <p className="text-lg font-bold">
                          {stats?.total_stake?.toFixed(0) || 0} ₽
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Activity Stats */}
                <Card className="card-gradient border-primary/20">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm sm:text-base flex items-center">
                      <Activity className="w-4 h-4 mr-2 text-primary" />
                      Активность
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-3 text-center">
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Выиграно</p>
                        <p className="text-base font-semibold text-success">
                          {stats?.successful_predictions || 0}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Проиграно</p>
                        <p className="text-base font-semibold text-destructive">
                          {stats?.failed_predictions || 0}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="predictions" className="space-y-4 mt-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm sm:text-base font-semibold">Мои прогнозы</h3>
                  <Button 
                    variant="premium" 
                    size="sm" 
                    onClick={() => navigate('/add-prediction')}
                    className="text-xs"
                  >
                    Добавить
                  </Button>
                </div>
                
                <div className="space-y-3">
                  {predictionsLoading ? (
                    <div className="space-y-3">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="h-24 bg-muted/20 rounded-lg animate-pulse" />
                      ))}
                    </div>
                  ) : predictions?.length ? (
                    predictions.slice(0, 5).map((prediction, index) => (
                      <PredictionCard 
                        key={prediction.id} 
                        prediction={prediction}
                        onClick={() => navigate(`/prediction/${prediction.id}`)}
                        className="animate-slide-up"
                        style={{ animationDelay: `${index * 100}ms` }}
                      />
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <Target className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                      <p className="text-muted-foreground text-sm">Прогнозов пока нет</p>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="mt-3 text-xs"
                        onClick={() => navigate('/add-prediction')}
                      >
                        Создать первый прогноз
                      </Button>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="achievements" className="space-y-4 mt-4">
                <h3 className="text-sm sm:text-base font-semibold flex items-center">
                  <Award className="w-4 h-4 mr-2 text-primary" />
                  Достижения
                </h3>
                
                <div className="space-y-3">
                  {achievementsLoading ? (
                    <div className="space-y-3">
                      {[1, 2].map((i) => (
                        <div key={i} className="h-16 bg-muted/20 rounded-lg animate-pulse" />
                      ))}
                    </div>
                  ) : userAchievements?.length ? (
                    userAchievements.map((userAchievement, index) => (
                      <Card 
                        key={userAchievement.id} 
                        className="card-gradient border-primary/30 animate-slide-up"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <CardContent className="p-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center text-lg">
                              {userAchievement.achievement.icon_emoji}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-sm truncate">
                                {userAchievement.achievement.title}
                              </h4>
                              <p className="text-xs text-muted-foreground line-clamp-2">
                                {userAchievement.achievement.description}
                              </p>
                              <p className="text-xs text-primary mt-1">
                                {userAchievement.completed_at && 
                                  new Date(userAchievement.completed_at).toLocaleDateString('ru-RU')
                                }
                              </p>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              +{userAchievement.achievement.experience_points} XP
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <Award className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                      <p className="text-muted-foreground text-sm">Достижений пока нет</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Делайте прогнозы, чтобы получить первые награды!
                      </p>
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