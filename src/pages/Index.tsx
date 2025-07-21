import { useState } from "react";
import { TrendingUp, Trophy, Target, Users, Star, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import PredictionCard from "@/components/PredictionCard";
import TopAnalysts from "@/components/TopAnalysts";
import { usePredictions } from "@/hooks/api/usePredictions";
import { useAuth } from "@/hooks/useAuth";
import { useChallenges } from "@/hooks/api/useChallenges";

const Index = () => {
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();
  const { data: predictions, isLoading: predictionsLoading } = usePredictions();
  const { data: challenges, isLoading: challengesLoading } = useChallenges();

  // Show loading screen while auth is being checked
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background telegram-safe-area flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-muted-foreground">Инициализация...</p>
        </div>
      </div>
    );
  }

  // Get the first active challenge for "Challenge of the Day"
  const todayChallenge = challenges?.[0];

  // Calculate stats from user profile
  const statsCards = [
    {
      title: "Активные прогнозы",
      value: "0",
      change: "+12%",
      icon: Activity,
      trend: "up" as const
    },
    {
      title: "Процент побед",
      value: "0%",
      change: "+5%",
      icon: Target,
      trend: "up" as const
    },
    {
      title: "Средний коэф.",
      value: "0",
      change: "-0.2",
      icon: TrendingUp,
      trend: "down" as const
    },
    {
      title: "ROI",
      value: "0%",
      change: "+8%",
      icon: Trophy,
      trend: "up" as const
    }
  ];

  return (
    <div className="min-h-screen bg-background telegram-safe-area">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="px-3 sm:px-4 py-3 sm:py-4 max-w-screen-lg mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-primary to-primary-glow rounded-xl flex items-center justify-center">
                <Trophy className="w-4 h-4 sm:w-6 sm:h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-base sm:text-lg font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                  House of Arh
                </h1>
                <p className="text-[9px] sm:text-[10px] text-muted-foreground">Спортивные прогнозы</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="border-primary/20 text-primary text-[9px] sm:text-[10px] px-1.5 sm:px-2">
                <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-0.5 sm:mr-1" />
                Новичок
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Stats Overview */}
      <section className="px-3 sm:px-4 py-4 sm:py-6 max-w-screen-lg mx-auto">
        <div className="grid grid-cols-2 gap-2 sm:gap-4">
          {statsCards.map((stat, index) => (
            <Card key={index} className="card-gradient card-hover animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1 space-y-1">
                    <p className="text-[9px] sm:text-[10px] text-muted-foreground truncate uppercase tracking-wide">{stat.title}</p>
                    <p className="text-base sm:text-lg font-bold text-foreground leading-tight">{stat.value}</p>
                    <p className={`text-[9px] sm:text-[10px] font-medium ${stat.trend === 'up' ? 'text-success' : 'text-destructive'}`}>
                      {stat.change}
                    </p>
                  </div>
                  <div className={`p-1.5 sm:p-2 rounded-lg flex-shrink-0 ${stat.trend === 'up' ? 'bg-success/20' : 'bg-destructive/20'}`}>
                    <stat.icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${stat.trend === 'up' ? 'text-success' : 'text-destructive'}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Main Content */}
      <div className="px-3 sm:px-4 pb-20 max-w-screen-lg mx-auto">
        <div className="grid lg:grid-cols-3 gap-4 lg:gap-6">
          {/* Main Feed */}
          <div className="lg:col-span-2 space-y-4 lg:space-y-6">
            {/* Predictions Section */}
            <Card className="card-gradient">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between text-sm sm:text-base">
                  <span>Актуальные прогнозы</span>
                  <Button variant="outline" size="sm" className="text-[10px] sm:text-xs px-2 sm:px-3">
                    Все прогнозы
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4">
                {predictionsLoading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-32 bg-muted/20 rounded-lg animate-pulse" />
                    ))}
                  </div>
                ) : predictions && predictions.length > 0 ? (
                  predictions.slice(0, 3).map((prediction, index) => (
                    <PredictionCard 
                      key={prediction.id} 
                      prediction={{
                        id: prediction.id,
                        user_id: prediction.user_id,
                        event_name: prediction.event_name || prediction.title,
                        type: prediction.type,
                        coefficient: Number(prediction.coefficient),
                        title: prediction.title,
                        status: prediction.status,
                        event_start_time: prediction.event_start_time,
                        category: prediction.category,
                        is_public: prediction.is_public,
                        created_at: prediction.created_at,
                        updated_at: prediction.updated_at,
                        stake: prediction.stake ? Number(prediction.stake) : undefined,
                        profit: prediction.profit ? Number(prediction.profit) : undefined,
                        description: prediction.description,
                        prediction_deadline: prediction.prediction_deadline,
                        is_featured: prediction.is_featured || false,
                        is_premium: prediction.is_premium || false,
                        views_count: prediction.views_count || 0,
                        likes_count: prediction.likes_count || 0,
                        comments_count: prediction.comments_count || 0,
                        shares_count: prediction.shares_count || 0
                      }} 
                      className="animate-slide-up"
                      style={{ animationDelay: `${index * 150}ms` }}
                      onClick={() => navigate(`/prediction/${prediction.id}`)}
                    />
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Target className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Пока нет активных прогнозов</p>
                    <Button 
                      variant="outline" 
                      className="mt-4" 
                      onClick={() => navigate('/add-prediction')}
                    >
                      Создать первый прогноз
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Challenge of the Day */}
            <Card className="card-gradient border-primary/20 glow-primary">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center space-x-2 text-sm sm:text-base">
                  <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                  <span>Челлендж дня</span>
                  {todayChallenge && (
                    <Badge className="bg-primary text-primary-foreground text-[9px] sm:text-[10px]">
                      {todayChallenge.status === 'active' ? 'Активен' : 'Завершен'}
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {challengesLoading ? (
                  <div className="h-16 bg-muted/20 rounded-lg animate-pulse" />
                ) : todayChallenge ? (
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-sm truncate">{todayChallenge.title}</h3>
                      <p className="text-[10px] sm:text-xs text-muted-foreground">
                        {todayChallenge.type === 'ladder' ? 'Лесенка' : 'Марафон'} • 
                        {todayChallenge.current_step && todayChallenge.total_steps ? ` Шаг ${todayChallenge.current_step}/${todayChallenge.total_steps} • ` : ' '}
                        Банк: ${Number(todayChallenge.current_bank || 0).toFixed(0)}
                      </p>
                      <p className="text-[9px] text-muted-foreground mt-1">
                        Создатель: {todayChallenge.creator_name}
                      </p>
                    </div>
                    <Button 
                      variant="premium" 
                      size="sm" 
                      className="text-[10px] sm:text-xs whitespace-nowrap" 
                      onClick={() => navigate(`/challenge/${todayChallenge.id}`)}
                    >
                      Подробнее
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <Trophy className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-xs text-muted-foreground mb-3">Пока нет активных челленджей</p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-[10px] sm:text-xs" 
                      onClick={() => navigate('/challenges')}
                    >
                      Все челленджи
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-4 lg:space-y-6">
            <TopAnalysts />
            
            {/* Quick Actions */}
            <Card className="card-gradient">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm sm:text-base">Быстрые действия</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 sm:space-y-3">
                <Button variant="premium" className="w-full text-[10px] sm:text-xs" onClick={() => navigate('/add-prediction')}>
                  <Target className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                  Добавить прогноз
                </Button>
                <Button variant="outline" className="w-full text-[10px] sm:text-xs" onClick={() => navigate('/challenges')}>
                  <Trophy className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                  Челленджи
                </Button>
                <Button variant="outline" className="w-full text-[10px] sm:text-xs" onClick={() => navigate('/analytics')}>
                  <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                  Аналитика
                </Button>
                <Button variant="outline" className="w-full text-[10px] sm:text-xs" onClick={() => navigate('/messages')}>
                  <Users className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                  Сообщения
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <Navigation />
    </div>
  );
};

export default Index;