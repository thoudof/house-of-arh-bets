import { useState } from "react";
import { TrendingUp, Target, Calendar, ArrowLeft, BarChart3, PieChart, Activity, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";
import { useAnalytics } from "@/hooks/api/useUserStats";
import { Skeleton } from "@/components/ui/skeleton";

const Analytics = () => {
  const navigate = useNavigate();
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const { data: analytics, isLoading } = useAnalytics();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background telegram-safe-area">
        <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
          <div className="px-3 sm:px-4 py-3 sm:py-4 max-w-screen-lg mx-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
                  <ArrowLeft className="w-4 h-4" />
                </Button>
                <h1 className="text-lg sm:text-xl font-bold">Аналитика</h1>
              </div>
            </div>
          </div>
        </header>
        <div className="px-3 sm:px-4 py-4 sm:py-6 max-w-screen-lg mx-auto space-y-4 sm:space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-20" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const performanceStats = analytics ? {
    totalBets: analytics.totalBets,
    wonBets: analytics.wonBets,
    winRate: analytics.winRate,
    totalProfit: analytics.totalProfit,
    roi: analytics.roi,
    averageOdds: analytics.averageOdds
  } : {
    totalBets: 0,
    wonBets: 0,
    winRate: 0,
    totalProfit: 0,
    roi: 0,
    averageOdds: 0
  };

  const categoryStats = analytics?.categoryStats || [];

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
        <Card className="card-gradient">
          <CardContent className="p-4">
            <Tabs defaultValue="categories">
              <TabsList className="grid w-full grid-cols-3 text-xs sm:text-sm bg-muted/50 rounded-lg p-1">
                <TabsTrigger value="categories" className="data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm">По видам спорта</TabsTrigger>
                <TabsTrigger value="types" className="data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm">Типы ставок</TabsTrigger>
                <TabsTrigger value="following" className="data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm">Подписки</TabsTrigger>
              </TabsList>

          {/* Categories Analysis */}
          <TabsContent value="categories" className="space-y-3 sm:space-y-4 mt-4">
            {categoryStats.length > 0 ? categoryStats.map((stat, index) => (
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
                      <p className="font-bold text-sm">{stat.winRate.toFixed(1)}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">ROI</p>
                      <p className={`font-bold text-sm ${stat.roi >= 0 ? 'text-success' : 'text-destructive'}`}>
                        {stat.roi >= 0 ? '+' : ''}{stat.roi.toFixed(1)}%
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Прибыль</p>
                      <p className={`font-bold text-sm ${stat.profit >= 0 ? 'text-success' : 'text-destructive'}`}>
                        {stat.profit >= 0 ? '+' : ''}${stat.profit.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3">
                    <Progress value={stat.winRate} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            )) : (
              <div className="text-center py-8">
                <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">Нет данных по категориям</p>
              </div>
            )}
          </TabsContent>

          {/* Bet Types Analysis */}
          <TabsContent value="types" className="space-y-3 sm:space-y-4 mt-4">
            <div className="text-center py-8">
              <PieChart className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">Анализ типов ставок скоро будет доступен</p>
            </div>
          </TabsContent>

          {/* Following Analysis */}
          <TabsContent value="following" className="space-y-3 sm:space-y-4 mt-4">
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">Функция подписок скоро будет доступна</p>
            </div>

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
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;