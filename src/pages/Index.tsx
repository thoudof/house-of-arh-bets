import React from 'react';
import { useState } from "react";
import { TrendingUp, Trophy, Target, Users, Star, Activity, Plus, ArrowRight, Flame, Award } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import PredictionCard from "@/components/PredictionCard";
import TopAnalysts from "@/components/TopAnalysts";
import LoadingScreen from '@/components/LoadingScreen';
import TelegramLogin from '@/components/TelegramLogin';
import UserRoleDisplay from '@/components/UserRoleDisplay';
import { usePredictions } from "@/hooks/api/usePredictions";
import { useAuth } from "@/hooks/useAuth";
import { useChallenges } from "@/hooks/api/useChallenges";
import { useUserStats } from "@/hooks/api/useUserStats";

const Index = () => {
  const navigate = useNavigate();
  const { user, isLoading, isAuthenticated } = useAuth();
  const { data: predictions, isLoading: predictionsLoading } = usePredictions();
  const { data: challenges, isLoading: challengesLoading } = useChallenges();
  const { data: userStats, isLoading: statsLoading } = useUserStats();

  // Show loading screen while auth is being checked
  if (isLoading) {
    return <LoadingScreen />;
  }

  // Если пользователь не авторизован
  if (!isAuthenticated || !user) {
    return <TelegramLogin />;
  }

  // Get the first active challenge for "Challenge of the Day"
  const todayChallenge = challenges?.[0];

  // Calculate stats from user profile
  const statsCards = [
    {
      title: "Активные",
      subtitle: "прогнозы",
      value: statsLoading ? "..." : (userStats?.pending_predictions?.toString() || "0"),
      icon: Activity,
      gradient: "from-accent to-accent-foreground",
      color: "text-accent"
    },
    {
      title: "Процент",
      subtitle: "побед", 
      value: statsLoading ? "..." : (userStats?.total_predictions > 0 ? 
        `${Math.round((userStats.successful_predictions / userStats.total_predictions) * 100)}%` : "0%"),
      icon: Target,
      gradient: "from-success to-success-glow",
      color: "text-success"
    },
    {
      title: "Средний",
      subtitle: "коэф.",
      value: statsLoading ? "..." : (userStats?.average_coefficient?.toFixed(2) || "0.00"),
      icon: TrendingUp,
      gradient: "from-primary to-primary-glow",
      color: "text-primary"
    },
    {
      title: "ROI",
      subtitle: "общий",
      value: statsLoading ? "..." : `${userStats?.roi?.toFixed(1) || "0.0"}%`,
      icon: Trophy,
      gradient: "from-destructive to-destructive-glow",
      color: userStats?.roi && userStats.roi > 0 ? "text-success" : "text-destructive"
    }
  ];

  return (
    <div className="min-h-screen bg-background telegram-safe-area">
      {/* Header */}
      <header className="bg-gradient-to-r from-card to-card-hover border-b border-border/30 backdrop-blur-lg sticky top-0 z-50">
        <div className="px-4 py-4 max-w-screen-lg mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-glow rounded-2xl flex items-center justify-center shadow-lg">
                  <Trophy className="w-5 h-5 text-primary-foreground" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-success rounded-full border-2 border-background animate-pulse-glow"></div>
              </div>
              <div>
                <h1 className="text-lg font-bold bg-gradient-to-r from-primary via-primary-glow to-accent bg-clip-text text-transparent">
                  House of Arh
                </h1>
                <p className="text-xs text-muted-foreground font-medium">Твоя победа начинается здесь</p>
              </div>
            </div>
            <div className="flex items-center">
              <UserRoleDisplay userId={user?.id} showTier={true} showRole={false} size="sm" />
            </div>
          </div>
        </div>
      </header>

      {/* Welcome & Quick Stats */}
      <section className="px-4 pt-6 pb-4 max-w-screen-lg mx-auto">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-foreground mb-2">
            Добро пожаловать! 👋
          </h2>
          <p className="text-sm text-muted-foreground">
            Твоя аналитика за сегодня
          </p>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          {statsCards.map((stat, index) => (
            <Card key={index} className="relative overflow-hidden card-gradient card-hover animate-bounce-in border-0" style={{ animationDelay: `${index * 150}ms` }}>
              <CardContent className="p-4">
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-3">
                    <div className={`p-2 rounded-xl bg-gradient-to-br ${stat.gradient} bg-opacity-20`}>
                      <stat.icon className={`w-5 h-5 ${stat.color}`} />
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground font-medium">{stat.title}</p>
                      <p className="text-[10px] text-muted-foreground/70">{stat.subtitle}</p>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-foreground leading-none">
                    {stat.value}
                  </div>
                </div>
                <div className={`absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl ${stat.gradient} opacity-10 rounded-bl-full`}></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Main Content */}
      <div className="px-4 pb-20 max-w-screen-lg mx-auto space-y-6">
        {/* Quick Actions Bar */}
        <Card className="card-gradient border-primary/20 glow-primary">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-foreground mb-1">Готов к новым прогнозам?</h3>
                <p className="text-xs text-muted-foreground">Создай прогноз и заработай репутацию</p>
              </div>
              <Button 
                className="btn-premium shadow-lg" 
                onClick={() => navigate('/add-prediction')}
              >
                <Plus className="w-4 h-4 mr-2" />
                Создать
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Feed */}
          <div className="lg:col-span-2 space-y-6">
            {/* Predictions Section */}
            <Card className="card-gradient border-0">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Flame className="w-5 h-5 text-primary" />
                    <CardTitle className="text-lg font-bold">Горячие прогнозы</CardTitle>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-xs border-primary/30 hover:bg-primary/10"
                    onClick={() => navigate('/predictions')}
                  >
                    Все прогнозы
                    <ArrowRight className="w-3 h-3 ml-1" />
                  </Button>
                </div>
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
                        shares_count: prediction.shares_count || 0,
                        profiles: prediction.profiles
                      }}
                      className="animate-slide-up"
                      style={{ animationDelay: `${index * 150}ms` }}
                      onClick={() => navigate(`/prediction/${prediction.id}`)}
                    />
                  ))
                ) : (
                  <div className="text-center py-12 space-y-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-muted to-muted-foreground/20 rounded-full flex items-center justify-center mx-auto">
                      <Target className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">Пока тишина...</h3>
                      <p className="text-sm text-muted-foreground mb-4">Будь первым, кто поделится горячим прогнозом!</p>
                      <Button 
                        className="btn-premium" 
                        onClick={() => navigate('/add-prediction')}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Создать прогноз
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Challenge of the Day */}
            <Card className="card-gradient border-primary/30 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary/20 to-transparent rounded-bl-full"></div>
              <CardHeader className="pb-4 relative z-10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gradient-to-br from-primary to-primary-glow rounded-xl">
                      <Trophy className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-bold">Челлендж дня</CardTitle>
                      <p className="text-xs text-muted-foreground">Проверь свои навыки</p>
                    </div>
                  </div>
                  {todayChallenge && (
                    <Badge className="bg-success text-success-foreground text-xs animate-pulse-glow">
                      {todayChallenge.status === 'active' ? 'Активен' : 'Завершен'}
                    </Badge>
                  )}
                </div>
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
                  <div className="text-center py-6 space-y-3">
                    <div className="w-14 h-14 bg-gradient-to-br from-muted to-muted-foreground/20 rounded-full flex items-center justify-center mx-auto">
                      <Trophy className="w-7 h-7 text-muted-foreground" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">Челленджи скоро!</h4>
                      <p className="text-xs text-muted-foreground mb-3">Следи за обновлениями</p>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-xs border-primary/30 hover:bg-primary/10" 
                        onClick={() => navigate('/challenges')}
                      >
                        Посмотреть все
                        <ArrowRight className="w-3 h-3 ml-1" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <TopAnalysts />
            
            {/* Navigation Grid */}
            <Card className="card-gradient border-0">
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-2">
                  <Award className="w-5 h-5 text-primary" />
                  <CardTitle className="text-lg font-bold">Твоя активность</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <Button 
                    variant="outline" 
                    className="h-16 flex-col space-y-1 border-accent/30 hover:bg-accent/10 hover:border-accent/50 transition-all duration-300" 
                    onClick={() => navigate('/challenges')}
                  >
                    <Trophy className="w-5 h-5 text-accent" />
                    <span className="text-xs font-medium">Челленджи</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-16 flex-col space-y-1 border-primary/30 hover:bg-primary/10 hover:border-primary/50 transition-all duration-300" 
                    onClick={() => navigate('/analytics')}
                  >
                    <TrendingUp className="w-5 h-5 text-primary" />
                    <span className="text-xs font-medium">Аналитика</span>
                  </Button>
                </div>
                <Button 
                  variant="outline" 
                  className="w-full h-12 border-success/30 hover:bg-success/10 hover:border-success/50 transition-all duration-300" 
                  onClick={() => navigate('/messages')}
                >
                  <Users className="w-4 h-4 mr-2 text-success" />
                  <span className="text-sm font-medium">Сообщения</span>
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