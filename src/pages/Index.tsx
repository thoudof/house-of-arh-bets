import { useState } from "react";
import { TrendingUp, Trophy, Target, Users, Star, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import PredictionCard from "@/components/PredictionCard";
import TopAnalysts from "@/components/TopAnalysts";

const Index = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("predictions");

  const mockPredictions = [
    {
      id: "1",
      userId: "user1",
      analyst: "ProAnalyst",
      event: "Реал Мадрид vs Барселона",
      type: "single" as const,
      coefficient: 2.45,
      prediction: "П1",
      status: "pending" as const,
      timeLeft: "2ч 30м",
      category: "Футбол",
      startDate: "2024-01-21T15:00:00Z",
      isPublic: true,
      createdAt: "2024-01-19T10:00:00Z",
      updatedAt: "2024-01-19T10:00:00Z"
    },
    {
      id: "2",
      userId: "user2",
      analyst: "BetMaster",
      event: "Лейкерс vs Уорриорз",
      type: "express" as const,
      coefficient: 3.20,
      prediction: "ТБ 220.5 + П2",
      status: "win" as const,
      timeLeft: "Завершено",
      category: "Баскетбол",
      startDate: "2024-01-18T20:00:00Z",
      isPublic: true,
      createdAt: "2024-01-17T14:00:00Z",
      updatedAt: "2024-01-18T22:00:00Z"
    },
    {
      id: "3",
      userId: "user3",
      analyst: "SportGuru",
      event: "Челси vs Арсенал",
      type: "system" as const,
      coefficient: 1.85,
      prediction: "ТБ 2.5",
      status: "loss" as const,
      timeLeft: "Завершено",
      category: "Футбол",
      startDate: "2024-01-16T18:00:00Z",
      isPublic: true,
      createdAt: "2024-01-15T12:00:00Z",
      updatedAt: "2024-01-16T20:00:00Z"
    }
  ];

  const statsCards = [
    {
      title: "Активные прогнозы",
      value: "24",
      change: "+12%",
      icon: Activity,
      trend: "up" as const
    },
    {
      title: "Процент побед",
      value: "67%",
      change: "+5%",
      icon: Target,
      trend: "up" as const
    },
    {
      title: "Средний коэф.",
      value: "2.1",
      change: "-0.2",
      icon: TrendingUp,
      trend: "down" as const
    },
    {
      title: "ROI",
      value: "+23%",
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
                <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                  House of Arh
                </h1>
                <p className="text-[10px] sm:text-xs text-muted-foreground">Спортивные прогнозы</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="border-primary/20 text-primary text-[10px] sm:text-xs px-1.5 sm:px-2">
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
              <CardContent className="p-2.5 sm:p-3">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] sm:text-xs text-muted-foreground truncate">{stat.title}</p>
                    <p className="text-sm sm:text-base lg:text-lg font-bold text-foreground">{stat.value}</p>
                    <p className={`text-[10px] sm:text-xs ${stat.trend === 'up' ? 'text-success' : 'text-destructive'}`}>
                      {stat.change}
                    </p>
                  </div>
                  <div className={`p-1 sm:p-1.5 rounded-lg ${stat.trend === 'up' ? 'bg-success/20' : 'bg-destructive/20'}`}>
                    <stat.icon className={`w-3 h-3 sm:w-4 sm:h-4 ${stat.trend === 'up' ? 'text-success' : 'text-destructive'}`} />
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
                  <Button variant="outline" size="sm" className="text-xs sm:text-sm px-2 sm:px-3">
                    Все прогнозы
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4">
                {mockPredictions.map((prediction, index) => (
                  <PredictionCard 
                    key={prediction.id} 
                    prediction={prediction} 
                    className="animate-slide-up"
                    style={{ animationDelay: `${index * 150}ms` }}
                    onClick={() => window.location.href = `/prediction/${prediction.id}`}
                  />
                ))}
              </CardContent>
            </Card>

            {/* Challenge of the Day */}
            <Card className="card-gradient border-primary/20 glow-primary">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center space-x-2 text-sm sm:text-base">
                  <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                  <span>Челлендж дня</span>
                  <Badge className="bg-primary text-primary-foreground text-[10px] sm:text-xs">Активен</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-sm sm:text-base truncate">Лесенка от ProAnalyst</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground">Шаг 3/10 • Банк: $250</p>
                  </div>
                  <Button variant="premium" size="sm" className="text-xs whitespace-nowrap" onClick={() => navigate('/challenges')}>
                    Присоединиться
                  </Button>
                </div>
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
                <Button variant="premium" className="w-full text-xs sm:text-sm" onClick={() => navigate('/add-prediction')}>
                  <Target className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                  Добавить прогноз
                </Button>
                <Button variant="outline" className="w-full text-xs sm:text-sm" onClick={() => navigate('/challenges')}>
                  <Trophy className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                  Челленджи
                </Button>
                <Button variant="outline" className="w-full text-xs sm:text-sm" onClick={() => navigate('/analytics')}>
                  <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                  Аналитика
                </Button>
                <Button variant="outline" className="w-full text-xs sm:text-sm" onClick={() => navigate('/messages')}>
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
