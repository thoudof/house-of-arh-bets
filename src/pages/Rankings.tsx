import { useState } from "react";
import { Trophy, TrendingUp, Target, Award, Star, Filter, ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";

const Rankings = () => {
  const navigate = useNavigate();
  const [selectedPeriod, setSelectedPeriod] = useState("month");

  const mockAnalysts = [
    {
      id: "1",
      name: "ProAnalyst",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face",
      rank: 1,
      winRate: 72.5,
      roi: 28.4,
      totalPredictions: 156,
      profit: 2450,
      badge: "🏆"
    },
    {
      id: "2", 
      name: "BetMaster",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face",
      rank: 2,
      winRate: 68.8,
      roi: 24.1,
      totalPredictions: 203,
      profit: 1890,
      badge: "🥈"
    },
    {
      id: "3",
      name: "SportGuru", 
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b332c8ad?w=50&h=50&fit=crop&crop=face",
      rank: 3,
      winRate: 65.2,
      roi: 21.7,
      totalPredictions: 178,
      profit: 1620,
      badge: "🥉"
    },
    {
      id: "4",
      name: "FootballKing",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=50&h=50&fit=crop&crop=face",
      rank: 4,
      winRate: 63.5,
      roi: 19.8,
      totalPredictions: 142,
      profit: 1340,
      badge: ""
    }
  ];

  const getRankColor = (rank: number) => {
    if (rank === 1) return "text-yellow-400";
    if (rank === 2) return "text-gray-400";
    if (rank === 3) return "text-orange-400";
    return "text-muted-foreground";
  };

  const categories = [
    { id: "overall", name: "Общий", icon: Trophy },
    { id: "football", name: "Футбол", icon: Target },
    { id: "basketball", name: "Баскетбол", icon: Award },
    { id: "tennis", name: "Теннис", icon: Star }
  ];

  return (
    <div className="min-h-screen bg-background telegram-safe-area">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <h1 className="text-xl font-bold">Рейтинги</h1>
            </div>
            <Button variant="ghost" size="sm">
              <Filter className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Period Filter */}
        <Card className="card-gradient">
          <CardContent className="p-4">
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Выберите период" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">За неделю</SelectItem>
                <SelectItem value="month">За месяц</SelectItem>
                <SelectItem value="quarter">За квартал</SelectItem>
                <SelectItem value="year">За год</SelectItem>
                <SelectItem value="all">Все время</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Category Tabs */}
        <Tabs defaultValue="overall">
          <TabsList className="grid w-full grid-cols-4 text-xs">
            {categories.map((category) => (
              <TabsTrigger key={category.id} value={category.id} className="flex flex-col items-center space-y-1 p-3">
                <category.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{category.name}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {categories.map((category) => (
            <TabsContent key={category.id} value={category.id} className="space-y-4 mt-6">
              {/* Top 3 Podium */}
              <Card className="card-gradient border-primary/20 glow-primary">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Trophy className="w-5 h-5 text-primary" />
                    <span>Топ-3 аналитиков</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-2">
                    {mockAnalysts.slice(0, 3).map((analyst) => (
                      <div key={analyst.id} className="text-center space-y-2">
                        <div className="relative">
                          <Avatar className={`w-12 h-12 mx-auto ${analyst.rank === 1 ? 'border-2 border-yellow-400' : ''}`}>
                            <AvatarImage src={analyst.avatar} alt={analyst.name} />
                            <AvatarFallback>{analyst.name[0]}</AvatarFallback>
                          </Avatar>
                          {analyst.badge && (
                            <div className="absolute -top-1 -right-1 text-lg">
                              {analyst.badge}
                            </div>
                          )}
                        </div>
                        <div>
                          <p className={`font-bold text-sm ${getRankColor(analyst.rank)}`}>
                            #{analyst.rank}
                          </p>
                          <p className="text-xs font-medium truncate">{analyst.name}</p>
                          <p className="text-xs text-success">+{analyst.roi}%</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Full Rankings List */}
              <Card className="card-gradient">
                <CardHeader>
                  <CardTitle>Полный рейтинг</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {mockAnalysts.map((analyst) => (
                    <div key={analyst.id} className="flex items-center space-x-3 p-3 rounded-lg bg-card-hover hover:bg-card-hover/80 transition-colors">
                      <div className={`flex items-center justify-center w-8 h-8 rounded-full bg-muted ${getRankColor(analyst.rank)}`}>
                        <span className="font-bold text-sm">#{analyst.rank}</span>
                      </div>
                      
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={analyst.avatar} alt={analyst.name} />
                        <AvatarFallback>{analyst.name[0]}</AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold truncate">{analyst.name}</p>
                        <div className="flex items-center space-x-3 text-xs text-muted-foreground">
                          <span>{analyst.totalPredictions} ставок</span>
                          <span>{analyst.winRate}% побед</span>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <p className="font-bold text-success">+{analyst.roi}%</p>
                        <p className="text-xs text-muted-foreground">ROI</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>

        {/* Your Position */}
        <Card className="card-gradient border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              <span>Ваша позиция</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-primary/5">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground">
                <span className="font-bold text-sm">#12</span>
              </div>
              
              <Avatar className="w-10 h-10">
                <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face" />
                <AvatarFallback>AP</AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <p className="font-semibold">Алексей Петров</p>
                <div className="flex items-center space-x-3 text-xs text-muted-foreground">
                  <span>45 ставок</span>
                  <span>67% побед</span>
                </div>
              </div>
              
              <div className="text-right">
                <p className="font-bold text-success">+23%</p>
                <p className="text-xs text-muted-foreground">ROI</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Button variant="premium" onClick={() => navigate('/add-prediction')}>
            Добавить прогноз
          </Button>
          <Button variant="outline" onClick={() => navigate('/profile')}>
            Мой профиль
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Rankings;