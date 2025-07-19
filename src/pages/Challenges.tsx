import { useState } from "react";
import { Trophy, Calendar, Users, Target, ArrowLeft, Plus, Clock, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { useChallenges } from "@/hooks/api/useChallenges";
import { Skeleton } from "@/components/ui/skeleton";

const Challenges = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("active");
  const { data: challenges, isLoading } = useChallenges();

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
                <h1 className="text-lg sm:text-xl font-bold">Челленджи</h1>
              </div>
            </div>
          </div>
        </header>
        <div className="px-3 sm:px-4 py-4 sm:py-6 max-w-screen-lg mx-auto space-y-4 sm:space-y-6">
          <div className="grid grid-cols-3 gap-2 sm:gap-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-20" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const activeChallenges = challenges?.filter(c => c.status === 'active') || [];
  const upcomingChallenges: any[] = []; // Пока нет предстоящих челленджей
  const completedChallenges = challenges?.filter(c => c.status === 'completed') || [];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Легкий": return "text-green-500 border-green-500/20 bg-green-500/10";
      case "Средний": return "text-yellow-500 border-yellow-500/20 bg-yellow-500/10";
      case "Сложный": return "text-red-500 border-red-500/20 bg-red-500/10";
      default: return "text-muted-foreground";
    }
  };

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
              <h1 className="text-lg sm:text-xl font-bold">Челленджи</h1>
            </div>
            <Button variant="premium" size="sm" onClick={() => navigate('/create-challenge')}>
              <Plus className="w-4 h-4 mr-1" />
              Создать
            </Button>
          </div>
        </div>
      </header>

      <div className="px-3 sm:px-4 py-4 sm:py-6 max-w-screen-lg mx-auto space-y-4 sm:space-y-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4">
          <Card className="card-gradient">
            <CardContent className="p-2.5 sm:p-4 text-center">
              <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-primary mx-auto mb-1" />
              <p className="text-xs sm:text-sm text-muted-foreground">Побед</p>
              <p className="text-sm sm:text-lg font-bold">12</p>
            </CardContent>
          </Card>
          <Card className="card-gradient">
            <CardContent className="p-2.5 sm:p-4 text-center">
              <Target className="w-5 h-5 sm:w-6 sm:h-6 text-success mx-auto mb-1" />
              <p className="text-xs sm:text-sm text-muted-foreground">Активных</p>
              <p className="text-sm sm:text-lg font-bold">3</p>
            </CardContent>
          </Card>
          <Card className="card-gradient">
            <CardContent className="p-2.5 sm:p-4 text-center">
              <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-warning mx-auto mb-1" />
              <p className="text-xs sm:text-sm text-muted-foreground">Заработок</p>
              <p className="text-sm sm:text-lg font-bold">+$234</p>
            </CardContent>
          </Card>
        </div>

        {/* Challenges Tabs */}
        <Card className="card-gradient">
          <CardContent className="p-4">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3 text-xs sm:text-sm bg-muted/50 rounded-lg p-1">
                <TabsTrigger value="active" className="data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm">Активные</TabsTrigger>
                <TabsTrigger value="upcoming" className="data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm">Предстоящие</TabsTrigger>
                <TabsTrigger value="completed" className="data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm">Завершенные</TabsTrigger>
              </TabsList>

          {/* Active Challenges */}
          <TabsContent value="active" className="space-y-3 sm:space-y-4 mt-4">
            {activeChallenges.length > 0 ? activeChallenges.map((challenge) => (
              <Card key={challenge.id} className="card-gradient border-primary/20">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <CardTitle className="text-sm sm:text-base mb-1">{challenge.title}</CardTitle>
                      <p className="text-xs sm:text-sm text-muted-foreground mb-2">
                        Челлендж {challenge.type === 'ladder' ? 'лесенка' : 'марафон'}
                      </p>
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="secondary" className="text-[10px] sm:text-xs">
                          {challenge.type === 'ladder' ? 'Лесенка' : 'Марафон'}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-lg sm:text-xl font-bold text-primary">${challenge.current_bank}</div>
                      <div className="text-xs text-muted-foreground">Банк</div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-3">
                  {/* Progress */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs sm:text-sm font-medium">
                        Шаг {challenge.current_step || 1}/{challenge.total_steps || '∞'}
                      </span>
                      <span className="text-xs sm:text-sm text-muted-foreground">
                        Создатель: {challenge.creator_name}
                      </span>
                    </div>
                    {challenge.total_steps && (
                      <Progress 
                        value={((challenge.current_step || 1) / challenge.total_steps) * 100} 
                        className="h-2"
                      />
                    )}
                  </div>

                  {/* Time and Action */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1 text-xs sm:text-sm text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(challenge.created_at).toLocaleDateString('ru-RU')}</span>
                    </div>
                    <Button 
                      size="sm" 
                      variant="premium"
                      className="text-xs"
                      onClick={() => navigate(`/challenge/${challenge.id}`)}
                    >
                      Подробнее
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )) : (
              <div className="text-center py-8">
                <Trophy className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">Нет активных челленджей</p>
              </div>
            )}
          </TabsContent>

          {/* Upcoming Challenges */}
          <TabsContent value="upcoming" className="space-y-3 sm:space-y-4 mt-4">
            <div className="text-center py-8">
              <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">Предстоящие челленджи появятся скоро</p>
            </div>
          </TabsContent>

          {/* Completed Challenges */}
          <TabsContent value="completed" className="space-y-3 sm:space-y-4 mt-4">
            <div className="text-center py-8">
              <Trophy className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">Завершенные челленджи появятся здесь</p>
            </div>
          </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Create Challenge CTA */}
        <Card className="card-gradient border-primary/20 glow-primary">
          <CardContent className="p-4 text-center">
            <Trophy className="w-8 h-8 text-primary mx-auto mb-2" />
            <h3 className="font-semibold mb-1">Создайте свой челлендж</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Создавайте собственные турниры и зарабатывайте на комиссии
            </p>
            <Button variant="premium" onClick={() => navigate('/create-challenge')}>
              Начать создание
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Challenges;