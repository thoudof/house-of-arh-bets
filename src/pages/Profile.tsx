import { useState } from "react";
import { User, ArrowLeft, Trophy, Target, TrendingUp, Activity, Calendar, Star, Award } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";
import PredictionCard from "@/components/PredictionCard";
import type { User as UserType, Prediction, Achievement } from "@/types";

const Profile = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");

  // Mock user data
  const mockUser: UserType = {
    id: "1",
    telegramId: "123456789",
    username: "prosports_user",
    firstName: "Алексей",
    lastName: "Петров",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    role: "analyst",
    rank: "professional",
    stats: {
      totalPredictions: 145,
      winRate: 68.5,
      roi: 23.4,
      averageCoefficient: 2.15,
      profit: 1250,
      currentStreak: 5,
      bestStreak: 12,
      totalStake: 5340
    },
    createdAt: "2024-01-15"
  };

  const mockPredictions: Prediction[] = [
    {
      id: "1",
      userId: "1",
      analyst: "ProAnalyst",
      event: "Реал Мадрид vs Барселона",
      type: "single",
      coefficient: 2.45,
      prediction: "П1",
      status: "win",
      stake: 100,
      profit: 145,
      timeLeft: "Завершено",
      category: "Футбол",
      startDate: "2024-01-20T15:00:00Z",
      isPublic: true,
      createdAt: "2024-01-19T10:00:00Z",
      updatedAt: "2024-01-20T17:00:00Z"
    },
    {
      id: "2",
      userId: "1",
      analyst: "ProAnalyst",
      event: "Челси vs Арсенал",
      type: "single",
      coefficient: 1.85,
      prediction: "ТБ 2.5",
      status: "loss",
      stake: 200,
      profit: -200,
      timeLeft: "Завершено",
      category: "Футбол",
      startDate: "2024-01-18T20:00:00Z",
      isPublic: true,
      createdAt: "2024-01-17T14:00:00Z",
      updatedAt: "2024-01-18T22:00:00Z"
    }
  ];

  const mockAchievements: Achievement[] = [
    {
      id: "1",
      title: "Первая победа",
      description: "Выиграл первую ставку",
      icon: "🏆",
      condition: "win_first_bet",
      unlockedAt: "2024-01-15T12:00:00Z",
      isUnlocked: true
    },
    {
      id: "2",
      title: "Серия из 10",
      description: "10 выигрышных ставок подряд",
      icon: "🔥",
      condition: "win_streak_10",
      unlockedAt: "2024-01-18T16:00:00Z",
      isUnlocked: true
    },
    {
      id: "3",
      title: "ROI Мастер",
      description: "ROI выше 20% за месяц",
      icon: "💎",
      condition: "roi_above_20_monthly",
      isUnlocked: false
    }
  ];

  const getRankInfo = (rank: string) => {
    const ranks = {
      newbie: { name: "Новичок", color: "text-muted-foreground", progress: 20 },
      experienced: { name: "Опытный", color: "text-blue-400", progress: 40 },
      professional: { name: "Профессионал", color: "text-purple-400", progress: 60 },
      expert: { name: "Эксперт", color: "text-orange-400", progress: 80 },
      legend: { name: "Легенда", color: "text-primary", progress: 100 }
    };
    return ranks[rank as keyof typeof ranks] || ranks.newbie;
  };

  const rankInfo = getRankInfo(mockUser.rank);

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
                <AvatarImage src={mockUser.avatar} alt={mockUser.firstName} />
                <AvatarFallback>{mockUser.firstName[0]}{mockUser.lastName?.[0]}</AvatarFallback>
              </Avatar>
              
              <div className="flex-1 space-y-2">
                <div className="flex items-center space-x-2">
                  <h2 className="text-2xl font-bold">{mockUser.firstName} {mockUser.lastName}</h2>
                  <Badge variant="outline" className={rankInfo.color}>
                    {rankInfo.name}
                  </Badge>
                </div>
                
                <p className="text-muted-foreground">@{mockUser.username}</p>
                
                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>С {new Date(mockUser.createdAt).toLocaleDateString('ru-RU')}</span>
                  </div>
                  <Badge className="bg-primary text-primary-foreground">
                    {mockUser.role === 'analyst' ? 'Аналитик' : 'Пользователь'}
                  </Badge>
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
              <p className="text-lg font-bold">{mockUser.stats.totalPredictions}</p>
              <p className="text-xs text-muted-foreground">Всего ставок</p>
            </CardContent>
          </Card>
          
          <Card className="card-gradient">
            <CardContent className="p-3 text-center">
              <Target className="w-5 h-5 mx-auto mb-1 text-success" />
              <p className="text-lg font-bold">{mockUser.stats.winRate}%</p>
              <p className="text-xs text-muted-foreground">Процент побед</p>
            </CardContent>
          </Card>
          
          <Card className="card-gradient">
            <CardContent className="p-3 text-center">
              <TrendingUp className="w-5 h-5 mx-auto mb-1 text-primary" />
              <p className="text-lg font-bold">+{mockUser.stats.roi}%</p>
              <p className="text-xs text-muted-foreground">ROI</p>
            </CardContent>
          </Card>
          
          <Card className="card-gradient">
            <CardContent className="p-3 text-center">
              <Trophy className="w-5 h-5 mx-auto mb-1 text-primary-glow" />
              <p className="text-lg font-bold">{mockUser.stats.currentStreak}</p>
              <p className="text-xs text-muted-foreground">Текущая серия</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 text-sm">
            <TabsTrigger value="overview" className="text-xs">Обзор</TabsTrigger>
            <TabsTrigger value="predictions" className="text-xs">Ставки</TabsTrigger>
            <TabsTrigger value="achievements" className="text-xs">Награды</TabsTrigger>
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
                    <p className="text-lg font-semibold text-success">+{mockUser.stats.profit} ₽</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Средний коэф.</p>
                    <p className="text-lg font-semibold">{mockUser.stats.averageCoefficient}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Лучшая серия</p>
                    <p className="text-lg font-semibold">{mockUser.stats.bestStreak}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Всего поставлено</p>
                    <p className="text-lg font-semibold">{mockUser.stats.totalStake} ₽</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="predictions" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Мои ставки</h3>
              <Button variant="premium" size="sm" onClick={() => navigate('/add-prediction')}>
                Добавить ставку
              </Button>
            </div>
            
            <div className="space-y-4">
              {mockPredictions.map((prediction) => (
                <PredictionCard 
                  key={prediction.id} 
                  prediction={prediction}
                  onClick={() => navigate(`/prediction/${prediction.id}`)}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-4">
            <h3 className="text-lg font-semibold">Достижения</h3>
            <div className="grid grid-cols-1 gap-3">
              {mockAchievements.map((achievement) => (
                <Card 
                  key={achievement.id} 
                  className={`card-gradient ${achievement.isUnlocked ? 'border-primary/50' : 'opacity-50'}`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">{achievement.icon}</div>
                      <div className="flex-1">
                        <h4 className="font-semibold">{achievement.title}</h4>
                        <p className="text-sm text-muted-foreground">{achievement.description}</p>
                        {achievement.isUnlocked && achievement.unlockedAt && (
                          <p className="text-xs text-primary">
                            Получено: {new Date(achievement.unlockedAt).toLocaleDateString('ru-RU')}
                          </p>
                        )}
                      </div>
                      {achievement.isUnlocked && (
                        <Award className="w-5 h-5 text-primary" />
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;