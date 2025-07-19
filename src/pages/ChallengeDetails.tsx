import { useState } from "react";
import { ArrowLeft, Trophy, Users, Clock, Target, Star, TrendingUp, Share, Flag } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useChallenge } from "@/hooks/api/useChallenges";

const ChallengeDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  const [isJoined, setIsJoined] = useState(false);

  const { data: challenge, isLoading } = useChallenge(id!);

  if (isLoading) {
    return <div className="min-h-screen bg-background telegram-safe-area flex items-center justify-center">
      <div className="text-center">Загрузка челленджа...</div>
    </div>;
  }

  if (!challenge) {
    return <div className="min-h-screen bg-background telegram-safe-area flex items-center justify-center">
      <div className="text-center">Челлендж не найден</div>
    </div>;
  }

  const getDifficultyColor = (type: string) => {
    return "text-primary border-primary/20 bg-primary/10";
  };

  const handleJoin = () => {
    if (isJoined) {
      navigate(`/challenge-progress/${challenge.id}`);
    } else {
      setIsJoined(true);
      toast({
        title: "Вы присоединились к челленджу!",
        description: "Удачи в прохождении испытания",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background telegram-safe-area pb-20">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="px-3 sm:px-4 py-3 sm:py-4 max-w-screen-lg mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <h1 className="text-lg sm:text-xl font-bold truncate">{challenge.title}</h1>
            </div>
            <div className="flex gap-1">
              <Button variant="ghost" size="sm">
                <Share className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Flag className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="px-3 sm:px-4 py-4 sm:py-6 max-w-screen-lg mx-auto space-y-4 sm:space-y-6">
        {/* Challenge Overview */}
        <Card className="card-gradient border-primary/20">
          <CardContent className="p-4 sm:p-6">
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    <Badge variant="outline" className={`text-xs ${getDifficultyColor(challenge.type)}`}>
                      {challenge.type}
                    </Badge>
                    <Badge variant="outline" className="text-xs text-warning">
                      Взнос: {challenge.start_bank} ₽
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    {challenge.title}
                  </p>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                    <div>
                      <div className="text-lg font-bold text-primary">{challenge.current_bank} ₽</div>
                      <div className="text-xs text-muted-foreground">Банк</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold">{challenge.current_step}/{challenge.total_steps || 10}</div>
                      <div className="text-xs text-muted-foreground">Шаг</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-warning">{challenge.status}</div>
                      <div className="text-xs text-muted-foreground">Статус</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold">{challenge.total_steps || 10}</div>
                      <div className="text-xs text-muted-foreground">Шагов</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Прогресс: {challenge.current_step}/{challenge.total_steps || 10}</span>
                  <span>{Math.round(((challenge.current_step || 1) / (challenge.total_steps || 10)) * 100)}%</span>
                </div>
                <Progress value={((challenge.current_step || 1) / (challenge.total_steps || 10)) * 100} className="h-2" />
              </div>

              {/* Creator Info */}
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src="" />
                    <AvatarFallback>{challenge.creator_name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium text-sm">{challenge.creator_name}</div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Trophy className="w-3 h-3 text-primary" />
                      Создатель
                    </div>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={() => navigate(`/profile/${challenge.creator_id}`)}>
                  Профиль
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Button */}
        <Button 
          onClick={handleJoin}
          variant={isJoined ? "outline" : "premium"} 
          className="w-full"
        >
          {isJoined ? "Продолжить челлендж" : `Присоединиться (${challenge.start_bank} ₽)`}
        </Button>

        {/* Tabs */}
        <Tabs defaultValue="rules">
          <TabsList className="grid w-full grid-cols-3 text-xs sm:text-sm">
            <TabsTrigger value="rules">Правила</TabsTrigger>
            <TabsTrigger value="leaderboard">Лидеры</TabsTrigger>
            <TabsTrigger value="activity">Активность</TabsTrigger>
          </TabsList>

          {/* Rules */}
          <TabsContent value="rules" className="mt-4">
            <Card className="card-gradient">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Target className="w-5 h-5 text-primary" />
                  Правила челленджа
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <span className="text-sm">Стартовый банк: {challenge.start_bank} ₽</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <span className="text-sm">Количество шагов: {challenge.total_steps || 10}</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <span className="text-sm">Тип: {challenge.type}</span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Leaderboard */}
          <TabsContent value="leaderboard" className="mt-4">
            <Card className="card-gradient">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  Таблица лидеров
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-center text-muted-foreground py-4">
                  Таблица лидеров будет доступна после начала челленджа
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Activity */}
          <TabsContent value="activity" className="mt-4">
            <Card className="card-gradient">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Clock className="w-5 h-5 text-primary" />
                  Последняя активность
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-center text-muted-foreground py-4">
                  Активность будет отображаться здесь
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ChallengeDetails;