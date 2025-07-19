import { useState } from "react";
import { TrendingUp, Trophy, Target, Users, Star, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/Navigation";
import PredictionCard from "@/components/PredictionCard";
import TopAnalysts from "@/components/TopAnalysts";

const Index = () => {
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
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-glow rounded-xl flex items-center justify-center">
                <Trophy className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                  House of Arh
                </h1>
                <p className="text-xs text-muted-foreground">Спортивные прогнозы</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="border-primary/20 text-primary">
                <Star className="w-3 h-3 mr-1" />
                Новичок
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Stats Overview */}
      <section className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statsCards.map((stat, index) => (
            <Card key={index} className="card-gradient card-hover animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">{stat.title}</p>
                    <p className="text-lg font-bold text-foreground">{stat.value}</p>
                    <p className={`text-xs ${stat.trend === 'up' ? 'text-success' : 'text-destructive'}`}>
                      {stat.change}
                    </p>
                  </div>
                  <div className={`p-2 rounded-lg ${stat.trend === 'up' ? 'bg-success/20' : 'bg-destructive/20'}`}>
                    <stat.icon className={`w-4 h-4 ${stat.trend === 'up' ? 'text-success' : 'text-destructive'}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 pb-20">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Feed */}
          <div className="lg:col-span-2 space-y-6">
            {/* Predictions Section */}
            <Card className="card-gradient">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Актуальные прогнозы</span>
                  <Button variant="outline" size="sm">
                    Все прогнозы
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
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
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Trophy className="w-5 h-5 text-primary" />
                  <span>Челлендж дня</span>
                  <Badge className="bg-primary text-primary-foreground">Активен</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">Лесенка от ProAnalyst</h3>
                    <p className="text-sm text-muted-foreground">Шаг 3/10 • Банк: $250</p>
                  </div>
                  <Button variant="premium">
                    Присоединиться
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <TopAnalysts />
            
            {/* Quick Actions */}
            <Card className="card-gradient">
              <CardHeader>
                <CardTitle className="text-base">Быстрые действия</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="premium" className="w-full">
                  <Target className="w-4 h-4 mr-2" />
                  Добавить прогноз
                </Button>
                <Button variant="outline" className="w-full">
                  <Users className="w-4 h-4 mr-2" />
                  Подписки
                </Button>
                <Button variant="outline" className="w-full">
                  <Trophy className="w-4 h-4 mr-2" />
                  Рейтинги
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
