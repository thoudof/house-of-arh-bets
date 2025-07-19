import { useState } from "react";
import { TrendingUp, Target, Calendar, ArrowLeft, BarChart3, PieChart, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";

const Analytics = () => {
  const navigate = useNavigate();
  const [selectedPeriod, setSelectedPeriod] = useState("month");

  const performanceStats = {
    totalBets: 156,
    wonBets: 89,
    winRate: 57.1,
    totalProfit: 1234.56,
    roi: 23.4,
    averageOdds: 2.14,
    longestWinStreak: 7,
    longestLoseStreak: 3
  };

  const categoryStats = [
    { category: "Футбол", bets: 68, winRate: 62.5, roi: 28.3, profit: 567.8 },
    { category: "Баскетбол", bets: 34, winRate: 55.9, roi: 19.1, profit: 234.5 },
    { category: "Теннис", bets: 28, winRate: 50.0, roi: 12.5, profit: 156.2 },
    { category: "Хоккей", bets: 26, winRate: 53.8, roi: 15.7, profit: 276.0 }
  ];

  const monthlyData = [
    { month: "Янв", bets: 23, profit: 145.3, winRate: 52.2 },
    { month: "Фев", bets: 28, profit: 234.7, winRate: 57.1 },
    { month: "Мар", bets: 31, profit: 189.4, winRate: 54.8 },
    { month: "Апр", bets: 26, profit: 301.2, winRate: 61.5 },
    { month: "Май", bets: 29, profit: 278.9, winRate: 58.6 },
    { month: "Июн", bets: 19, profit: 85.1, winRate: 47.4 }
  ];

  const betTypes = [
    { type: "Одиночные", count: 89, winRate: 61.8, share: 57.1 },
    { type: "Экспресс", count: 45, winRate: 48.9, share: 28.8 },
    { type: "Система", count: 22, winRate: 54.5, share: 14.1 }
  ];

  const topPredictors = [
    { name: "ProAnalyst", followed: 12, winRate: 75.0, profit: 234.5 },
    { name: "BetMaster", followed: 8, winRate: 62.5, profit: 156.2 },
    { name: "SportGuru", followed: 6, winRate: 66.7, profit: 198.7 }
  ];

  return (
    <div className="min-h-screen bg-background telegram-safe-area">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="px-3 sm:px-4 py-3 sm:py-4 max-w-screen-lg mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <h1 className="text-lg sm:text-xl font-bold">Аналитика</h1>
            </div>
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-32 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Неделя</SelectItem>
                <SelectItem value="month">Месяц</SelectItem>
                <SelectItem value="quarter">Квартал</SelectItem>
                <SelectItem value="year">Год</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </header>

      <div className="px-3 sm:px-4 py-4 sm:py-6 max-w-screen-lg mx-auto space-y-4 sm:space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
          <Card className="card-gradient">
            <CardContent className="p-2.5 sm:p-4 text-center">
              <Target className="w-5 h-5 sm:w-6 sm:h-6 text-primary mx-auto mb-1" />
              <p className="text-xs sm:text-sm text-muted-foreground">Процент побед</p>
              <p className="text-sm sm:text-lg font-bold">{performanceStats.winRate}%</p>
            </CardContent>
          </Card>
          <Card className="card-gradient">
            <CardContent className="p-2.5 sm:p-4 text-center">
              <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-success mx-auto mb-1" />
              <p className="text-xs sm:text-sm text-muted-foreground">ROI</p>
              <p className="text-sm sm:text-lg font-bold text-success">+{performanceStats.roi}%</p>
            </CardContent>
          </Card>
          <Card className="card-gradient">
            <CardContent className="p-2.5 sm:p-4 text-center">
              <Activity className="w-5 h-5 sm:w-6 sm:h-6 text-warning mx-auto mb-1" />
              <p className="text-xs sm:text-sm text-muted-foreground">Всего ставок</p>
              <p className="text-sm sm:text-lg font-bold">{performanceStats.totalBets}</p>
            </CardContent>
          </Card>
          <Card className="card-gradient">
            <CardContent className="p-2.5 sm:p-4 text-center">
              <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 text-primary mx-auto mb-1" />
              <p className="text-xs sm:text-sm text-muted-foreground">Прибыль</p>
              <p className="text-sm sm:text-lg font-bold text-success">+${performanceStats.totalProfit}</p>
            </CardContent>
          </Card>
        </div>

        {/* Performance Chart Placeholder */}
        <Card className="card-gradient">
          <CardHeader>
            <CardTitle className="text-sm sm:text-base">Динамика результатов</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-32 sm:h-48 bg-muted/20 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">График прибыли по месяцам</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Analytics Tabs */}
        <Tabs defaultValue="categories">
          <TabsList className="grid w-full grid-cols-3 text-xs sm:text-sm">
            <TabsTrigger value="categories">По видам спорта</TabsTrigger>
            <TabsTrigger value="types">Типы ставок</TabsTrigger>
            <TabsTrigger value="following">Подписки</TabsTrigger>
          </TabsList>

          {/* Categories Analysis */}
          <TabsContent value="categories" className="space-y-3 sm:space-y-4 mt-4">
            {categoryStats.map((stat, index) => (
              <Card key={index} className="card-gradient">
                <CardContent className="p-3 sm:p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-sm sm:text-base">{stat.category}</h3>
                    <Badge variant="outline" className="text-xs">
                      {stat.bets} ставок
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-xs text-muted-foreground">Процент побед</p>
                      <p className="font-bold text-sm">{stat.winRate}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">ROI</p>
                      <p className="font-bold text-sm text-success">+{stat.roi}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Прибыль</p>
                      <p className="font-bold text-sm text-success">+${stat.profit}</p>
                    </div>
                  </div>

                  <div className="mt-3">
                    <Progress value={stat.winRate} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Bet Types Analysis */}
          <TabsContent value="types" className="space-y-3 sm:space-y-4 mt-4">
            {betTypes.map((type, index) => (
              <Card key={index} className="card-gradient">
                <CardContent className="p-3 sm:p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-sm sm:text-base">{type.type}</h3>
                    <div className="text-right">
                      <Badge variant="outline" className="text-xs">
                        {type.count} ставок
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-1">{type.share}% от общих</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">Процент побед</p>
                      <p className="font-bold text-sm">{type.winRate}%</p>
                    </div>
                    <Progress value={type.winRate} className="h-2 w-20" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Following Analysis */}
          <TabsContent value="following" className="space-y-3 sm:space-y-4 mt-4">
            <Card className="card-gradient border-primary/20">
              <CardHeader>
                <CardTitle className="text-sm sm:text-base">Топ аналитиков, на которых подписаны</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {topPredictors.map((predictor, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-sm">{predictor.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {predictor.followed} прогнозов • {predictor.winRate}% побед
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-sm text-success">+${predictor.profit}</p>
                      <p className="text-xs text-muted-foreground">прибыль</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Recommendations */}
            <Card className="card-gradient">
              <CardHeader>
                <CardTitle className="text-sm sm:text-base">Рекомендации</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="p-3 bg-success/10 border border-success/20 rounded-lg">
                  <p className="text-sm font-medium text-success">✓ Отлично</p>
                  <p className="text-xs text-muted-foreground">
                    Ваш ROI по футболу выше среднего на 15%
                  </p>
                </div>
                <div className="p-3 bg-warning/10 border border-warning/20 rounded-lg">
                  <p className="text-sm font-medium text-warning">⚠ Внимание</p>
                  <p className="text-xs text-muted-foreground">
                    Низкий процент побед в экспрессах - рассмотрите одиночные ставки
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Analytics;