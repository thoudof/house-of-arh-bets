import { useState } from "react";
import { Trophy, TrendingUp, Target, Award, Star, Filter, ArrowLeft, Calendar, Users } from "lucide-react";
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
        <Card className="card-gradient overflow-hidden">
          <CardContent className="p-0">
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-full border-0 h-16 text-base font-medium bg-transparent focus:ring-0">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-primary" />
                  </div>
                  <div className="text-left">
                    <SelectValue placeholder="Выберите период" />
                    <p className="text-xs text-muted-foreground">Период для анализа</p>
                  </div>
                </div>
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

        {/* Category Filter */}
        <div className="grid grid-cols-4 gap-3">
          {categories.map((category, index) => (
            <Card key={category.id} className="card-gradient card-hover cursor-pointer transition-all duration-200 hover:scale-105">
              <CardContent className="p-4 text-center space-y-2 flex flex-col items-center justify-center min-h-[80px]">
                <div className="w-10 h-10 bg-primary/10 rounded-xl mx-auto flex items-center justify-center">
                  <category.icon className="w-5 h-5 text-primary" />
                </div>
                <p className="text-xs font-medium text-foreground text-center">{category.name}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Top 3 Podium */}
        <Card className="card-gradient border-primary/20 glow-primary overflow-hidden">
          <div className="bg-gradient-to-r from-primary/5 to-primary-glow/5 p-1">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center space-x-2 text-lg">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary-glow rounded-lg flex items-center justify-center">
                  <Trophy className="w-4 h-4 text-primary-foreground" />
                </div>
                <span>Топ-3 аналитиков</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-8 pb-6">
              <div className="flex justify-center items-end space-x-4 mt-4">
                {rankings?.slice(0, 3).map((analyst, index) => (
                  <div key={analyst.id} className={`text-center space-y-3 ${index === 0 ? 'order-2' : index === 1 ? 'order-1' : 'order-3'}`}>
                    {/* Avatar positioned above podium */}
                    <div className="mb-2">
                      <Avatar className={`${index === 0 ? 'w-16 h-16 border-4 border-yellow-400' : 'w-14 h-14 border-2 border-gray-400'} ${index === 2 ? 'border-orange-400' : ''} mx-auto`}>
                        <AvatarImage src={analyst.avatar_url || undefined} alt={analyst.first_name} />
                        <AvatarFallback className="text-lg font-bold">{analyst.first_name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="absolute ml-12 -mt-6 text-2xl">
                        {index === 0 ? '🏆' : index === 1 ? '🥈' : '🥉'}
                      </div>
                    </div>
                    {/* Podium */}
                    <div className={`relative ${index === 0 ? 'h-20' : index === 1 ? 'h-16' : 'h-12'} w-16 mx-auto`}>
                      <div className={`w-full rounded-t-lg ${
                        index === 0 ? 'bg-gradient-to-t from-yellow-400 to-yellow-300 h-full' :
                        index === 1 ? 'bg-gradient-to-t from-gray-400 to-gray-300 h-full' :
                        'bg-gradient-to-t from-orange-400 to-orange-300 h-full'
                      } flex items-center justify-center`}>
                        <p className="text-white font-bold text-lg">#{index + 1}</p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <p className="font-bold text-sm">{analyst.first_name} {analyst.last_name}</p>
                      <p className="text-success font-semibold">+{analyst.user_stats?.[0]?.roi || 0}%</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </div>
        </Card>

        {/* Full Rankings List */}
        <Card className="card-gradient">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-muted rounded-md flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
              <span>Полный рейтинг</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {rankings?.map((analyst, index) => (
              <div key={analyst.id} className="flex items-center space-x-4 p-4 rounded-xl bg-gradient-to-r from-card-hover/50 to-transparent hover:from-card-hover hover:to-card-hover/50 transition-all duration-200 border border-border/50 hover:border-primary/20">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold text-sm ${
                  index < 3 ? 'bg-gradient-to-br from-primary to-primary-glow text-primary-foreground' : 'bg-muted text-muted-foreground'
                }`}>
                  #{index + 1}
                </div>
                
                <Avatar className="w-12 h-12 border-2 border-border">
                  <AvatarImage src={analyst.avatar_url || undefined} alt={analyst.first_name} />
                  <AvatarFallback className="font-semibold">{analyst.first_name[0]}</AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-base truncate">{analyst.first_name} {analyst.last_name}</p>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <span className="flex items-center space-x-1">
                      <Target className="w-3 h-3" />
                      <span>{analyst.user_stats?.[0]?.total_predictions || 0} ставок</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Trophy className="w-3 h-3" />
                      <span>{analyst.user_stats?.[0]?.win_rate || 0}% побед</span>
                    </span>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="font-bold text-lg text-success">+{analyst.user_stats?.[0]?.roi || 0}%</p>
                  <p className="text-xs text-muted-foreground">ROI</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Your Position */}
        {user && (
          <Card className="card-gradient border-primary/20 glow-primary">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary-glow rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-primary-foreground" />
                </div>
                <span>Ваша позиция</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4 p-4 rounded-xl bg-gradient-to-r from-primary/5 to-primary-glow/5 border border-primary/20">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary-glow text-primary-foreground font-bold">
                  #{rankings?.findIndex(r => r.user_id === user.id) + 1 || '?'}
                </div>
                
                <Avatar className="w-12 h-12 border-2 border-primary/30">
                  <AvatarImage src={user.user_metadata?.avatar_url} />
                  <AvatarFallback className="font-semibold bg-primary/10">{user.user_metadata?.first_name?.[0] || 'U'}</AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <p className="font-semibold text-base">{user.user_metadata?.first_name} {user.user_metadata?.last_name}</p>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <span>0 ставок</span>
                    <span>0% побед</span>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="font-bold text-lg text-success">+0%</p>
                  <p className="text-xs text-muted-foreground">ROI</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Button variant="premium" size="lg" onClick={() => navigate('/add-prediction')} className="h-14">
            <Target className="w-5 h-5 mr-2" />
            Добавить прогноз
          </Button>
          <Button variant="outline" size="lg" onClick={() => navigate('/profile')} className="h-14">
            <Users className="w-5 h-5 mr-2" />
            Мой профиль
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Rankings;