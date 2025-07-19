import { useState } from "react";
import { Trophy, TrendingUp, Target, Award, Star, Filter, ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { useRankings } from "@/hooks/api/useProfiles";
import { useAuth } from "@/hooks/useAuth";

const Rankings = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState("month");

  const { data: rankings, isLoading } = useRankings();

  if (isLoading) {
    return <div className="min-h-screen bg-background telegram-safe-area flex items-center justify-center">
      <div className="text-center">Загрузка рейтингов...</div>
    </div>;
  }

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
                    {rankings?.slice(0, 3).map((analyst, index) => (
                      <div key={analyst.id} className="text-center space-y-2">
                        <div className="relative">
                          <Avatar className={`w-12 h-12 mx-auto ${index === 0 ? 'border-2 border-yellow-400' : ''}`}>
                            <AvatarImage src={analyst.avatar_url || undefined} alt={analyst.first_name} />
                            <AvatarFallback>{analyst.first_name[0]}</AvatarFallback>
                          </Avatar>
                          {index === 0 && (
                            <div className="absolute -top-1 -right-1 text-lg">
                              🏆
                            </div>
                          )}
                          {index === 1 && (
                            <div className="absolute -top-1 -right-1 text-lg">
                              🥈
                            </div>
                          )}
                          {index === 2 && (
                            <div className="absolute -top-1 -right-1 text-lg">
                              🥉
                            </div>
                          )}
                        </div>
                        <div>
                          <p className={`font-bold text-sm ${getRankColor(index + 1)}`}>
                            #{index + 1}
                          </p>
                          <p className="text-xs font-medium truncate">{analyst.first_name} {analyst.last_name}</p>
                          <p className="text-xs text-success">+{analyst.user_stats?.[0]?.roi || 0}%</p>
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
                  {rankings?.map((analyst, index) => (
                    <div key={analyst.id} className="flex items-center space-x-3 p-3 rounded-lg bg-card-hover hover:bg-card-hover/80 transition-colors">
                      <div className={`flex items-center justify-center w-8 h-8 rounded-full bg-muted ${getRankColor(index + 1)}`}>
                        <span className="font-bold text-sm">#{index + 1}</span>
                      </div>
                      
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={analyst.avatar_url || undefined} alt={analyst.first_name} />
                        <AvatarFallback>{analyst.first_name[0]}</AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold truncate">{analyst.first_name} {analyst.last_name}</p>
                        <div className="flex items-center space-x-3 text-xs text-muted-foreground">
                          <span>{analyst.user_stats?.[0]?.total_predictions || 0} ставок</span>
                          <span>{analyst.user_stats?.[0]?.win_rate || 0}% побед</span>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <p className="font-bold text-success">+{analyst.user_stats?.[0]?.roi || 0}%</p>
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
            {user && (
              <div className="flex items-center space-x-3 p-3 rounded-lg bg-primary/5">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground">
                  <span className="font-bold text-sm">#{rankings?.findIndex(r => r.user_id === user.id) + 1 || '?'}</span>
                </div>
                
                <Avatar className="w-10 h-10">
                  <AvatarImage src={user.user_metadata?.avatar_url} />
                  <AvatarFallback>{user.user_metadata?.first_name?.[0] || 'U'}</AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <p className="font-semibold">{user.user_metadata?.first_name} {user.user_metadata?.last_name}</p>
                  <div className="flex items-center space-x-3 text-xs text-muted-foreground">
                    <span>0 ставок</span>
                    <span>0% побед</span>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="font-bold text-success">+0%</p>
                  <p className="text-xs text-muted-foreground">ROI</p>
                </div>
              </div>
            )}
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