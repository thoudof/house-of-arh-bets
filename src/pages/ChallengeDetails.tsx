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

const ChallengeDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  const [isJoined, setIsJoined] = useState(false);

  // Mock data - в реальном приложении загружалось бы по ID
  const challenge = {
    id: id || "1",
    title: "Лесенка дня",
    description: "Увеличивай банк поэтапно с коэффициентом от 1.5. Цель - дойти до 10 шагов за отведенное время.",
    prize: "$1000",
    participants: 245,
    maxParticipants: 500,
    timeLeft: "6ч 45м",
    currentStep: 3,
    totalSteps: 10,
    currentBank: 250,
    initialBank: 100,
    difficulty: "Средний",
    category: "Футбол",
    minCoeff: 1.5,
    entryFee: "$25",
    creator: {
      name: "ProAnalyst",
      avatar: "",
      rating: 4.8,
      wins: 156
    },
    rules: [
      "Минимальный коэффициент: 1.5",
      "Каждый шаг увеличивает банк на 25%",
      "При проигрыше - выбываете из челленджа",
      "Можно делать не более 1 ставки в час",
      "Только одиночные ставки"
    ],
    leaderboard: [
      { rank: 1, name: "BetMaster", step: 8, bank: 640, avatar: "" },
      { rank: 2, name: "LuckyStreak", step: 7, bank: 512, avatar: "" },
      { rank: 3, name: "ProPlayer", step: 6, bank: 400, avatar: "" },
      { rank: 4, name: "Analyzer", step: 5, bank: 320, avatar: "" },
      { rank: 5, name: "SportsFan", step: 4, bank: 256, avatar: "" }
    ],
    recentActivity: [
      { user: "BetMaster", action: "прошел", step: 8, time: "5 мин назад" },
      { user: "NewPlayer", action: "присоединился", step: 0, time: "12 мин назад" },
      { user: "LuckyStreak", action: "прошел", step: 7, time: "18 мин назад" },
      { user: "Unlucky", action: "выбыл на", step: 3, time: "25 мин назад" }
    ]
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Легкий": return "text-green-500 border-green-500/20 bg-green-500/10";
      case "Средний": return "text-yellow-500 border-yellow-500/20 bg-yellow-500/10";
      case "Сложный": return "text-red-500 border-red-500/20 bg-red-500/10";
      default: return "text-muted-foreground";
    }
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
                    <Badge variant="outline" className={`text-xs ${getDifficultyColor(challenge.difficulty)}`}>
                      {challenge.difficulty}
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      {challenge.category}
                    </Badge>
                    <Badge variant="outline" className="text-xs text-warning">
                      Взнос: {challenge.entryFee}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    {challenge.description}
                  </p>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                    <div>
                      <div className="text-lg font-bold text-primary">{challenge.prize}</div>
                      <div className="text-xs text-muted-foreground">Приз</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold">{challenge.participants}</div>
                      <div className="text-xs text-muted-foreground">Участников</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-warning">{challenge.timeLeft}</div>
                      <div className="text-xs text-muted-foreground">Осталось</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold">{challenge.totalSteps}</div>
                      <div className="text-xs text-muted-foreground">Шагов</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Участников: {challenge.participants}/{challenge.maxParticipants}</span>
                  <span>{Math.round((challenge.participants / challenge.maxParticipants) * 100)}%</span>
                </div>
                <Progress value={(challenge.participants / challenge.maxParticipants) * 100} className="h-2" />
              </div>

              {/* Creator Info */}
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={challenge.creator.avatar} />
                    <AvatarFallback>{challenge.creator.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium text-sm">{challenge.creator.name}</div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Star className="w-3 h-3 text-yellow-500" />
                      {challenge.creator.rating}
                      <span>•</span>
                      <Trophy className="w-3 h-3 text-primary" />
                      {challenge.creator.wins} побед
                    </div>
                  </div>
                </div>
                <Button variant="outline" size="sm">
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
          {isJoined ? "Продолжить челлендж" : `Присоединиться за ${challenge.entryFee}`}
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
                {challenge.rules.map((rule, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                    <span className="text-sm">{rule}</span>
                  </div>
                ))}
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
                {challenge.leaderboard.map((player) => (
                  <div key={player.rank} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        player.rank === 1 ? "bg-yellow-500 text-white" :
                        player.rank === 2 ? "bg-gray-400 text-white" :
                        player.rank === 3 ? "bg-amber-600 text-white" :
                        "bg-muted text-muted-foreground"
                      }`}>
                        {player.rank}
                      </div>
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={player.avatar} />
                        <AvatarFallback>{player.name[0]}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-sm">{player.name}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">Шаг {player.step}</div>
                      <div className="text-xs text-muted-foreground">${player.bank}</div>
                    </div>
                  </div>
                ))}
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
                {challenge.recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="min-w-0 flex-1">
                      <div className="text-sm">
                        <span className="font-medium">{activity.user}</span>
                        {" "}
                        <span className={
                          activity.action === "присоединился" ? "text-green-500" :
                          activity.action === "выбыл на" ? "text-red-500" :
                          "text-primary"
                        }>
                          {activity.action}
                        </span>
                        {activity.step > 0 && (
                          <span> шаг {activity.step}</span>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground">{activity.time}</div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ChallengeDetails;