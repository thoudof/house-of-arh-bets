import { useState } from "react";
import { Trophy, Calendar, Users, Target, ArrowLeft, Plus, Clock, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";

const Challenges = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("active");

  const activeChallenges = [
    {
      id: "1",
      title: "Лесенка дня",
      description: "Увеличивай банк поэтапно с коэффициентом от 1.5",
      prize: "$1000",
      participants: 245,
      timeLeft: "6ч 45м",
      currentStep: 3,
      totalSteps: 10,
      currentBank: 250,
      initialBank: 100,
      difficulty: "Средний",
      category: "Футбол",
      isJoined: true
    },
    {
      id: "2", 
      title: "Экспресс марафон",
      description: "5 экспрессов подряд с коэффициентом от 3.0",
      prize: "$500",
      participants: 156,
      timeLeft: "2д 12ч",
      currentStep: 1,
      totalSteps: 5,
      currentBank: 0,
      initialBank: 50,
      difficulty: "Сложный",
      category: "Микс",
      isJoined: false
    }
  ];

  const upcomingChallenges = [
    {
      id: "3",
      title: "Теннисная неделя",
      description: "Специальный турнир по теннисным прогнозам",
      prize: "$2000",
      participants: 0,
      startsIn: "1д 5ч",
      difficulty: "Легкий",
      category: "Теннис",
      entryFee: "$25"
    }
  ];

  const completedChallenges = [
    {
      id: "4",
      title: "Футбольный викенд",
      description: "Прогнозы на матчи выходных",
      prize: "$300",
      yourResult: 2,
      totalParticipants: 89,
      earnings: "+$45",
      category: "Футбол"
    }
  ];

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
            <Button variant="premium" size="sm">
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
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 text-xs sm:text-sm">
            <TabsTrigger value="active">Активные</TabsTrigger>
            <TabsTrigger value="upcoming">Предстоящие</TabsTrigger>
            <TabsTrigger value="completed">Завершенные</TabsTrigger>
          </TabsList>

          {/* Active Challenges */}
          <TabsContent value="active" className="space-y-3 sm:space-y-4 mt-4">
            {activeChallenges.map((challenge) => (
              <Card key={challenge.id} className="card-gradient border-primary/20">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <CardTitle className="text-sm sm:text-base mb-1">{challenge.title}</CardTitle>
                      <p className="text-xs sm:text-sm text-muted-foreground mb-2">
                        {challenge.description}
                      </p>
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="outline" className={`text-[10px] sm:text-xs ${getDifficultyColor(challenge.difficulty)}`}>
                          {challenge.difficulty}
                        </Badge>
                        <Badge variant="secondary" className="text-[10px] sm:text-xs">
                          {challenge.category}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-lg sm:text-xl font-bold text-primary">{challenge.prize}</div>
                      <div className="text-xs text-muted-foreground">{challenge.participants} участников</div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-3">
                  {/* Progress */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs sm:text-sm font-medium">
                        Шаг {challenge.currentStep}/{challenge.totalSteps}
                      </span>
                      <span className="text-xs sm:text-sm text-muted-foreground">
                        Банк: ${challenge.currentBank}
                      </span>
                    </div>
                    <Progress 
                      value={(challenge.currentStep / challenge.totalSteps) * 100} 
                      className="h-2"
                    />
                  </div>

                  {/* Time and Action */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1 text-xs sm:text-sm text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      <span>{challenge.timeLeft}</span>
                    </div>
                    <Button 
                      size="sm" 
                      variant={challenge.isJoined ? "outline" : "premium"}
                      className="text-xs"
                    >
                      {challenge.isJoined ? "Продолжить" : "Присоединиться"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Upcoming Challenges */}
          <TabsContent value="upcoming" className="space-y-3 sm:space-y-4 mt-4">
            {upcomingChallenges.map((challenge) => (
              <Card key={challenge.id} className="card-gradient">
                <CardContent className="p-3 sm:p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-sm sm:text-base mb-1">{challenge.title}</h3>
                      <p className="text-xs sm:text-sm text-muted-foreground mb-2">
                        {challenge.description}
                      </p>
                      <div className="flex items-center gap-2 flex-wrap mb-2">
                        <Badge variant="outline" className={`text-[10px] sm:text-xs ${getDifficultyColor(challenge.difficulty)}`}>
                          {challenge.difficulty}
                        </Badge>
                        <Badge variant="secondary" className="text-[10px] sm:text-xs">
                          {challenge.category}
                        </Badge>
                        <Badge variant="outline" className="text-[10px] sm:text-xs text-warning">
                          Взнос: {challenge.entryFee}
                        </Badge>
                      </div>
                      <div className="text-xs sm:text-sm text-muted-foreground">
                        Начинается через: {challenge.startsIn}
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-lg sm:text-xl font-bold text-primary">{challenge.prize}</div>
                      <Button size="sm" variant="premium" className="text-xs mt-2">
                        Записаться
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Completed Challenges */}
          <TabsContent value="completed" className="space-y-3 sm:space-y-4 mt-4">
            {completedChallenges.map((challenge) => (
              <Card key={challenge.id} className="card-gradient">
                <CardContent className="p-3 sm:p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-sm sm:text-base mb-1">{challenge.title}</h3>
                      <p className="text-xs sm:text-sm text-muted-foreground mb-2">
                        {challenge.description}
                      </p>
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="secondary" className="text-[10px] sm:text-xs">
                          {challenge.category}
                        </Badge>
                        <Badge variant="outline" className="text-[10px] sm:text-xs text-muted-foreground">
                          Место: {challenge.yourResult}/{challenge.totalParticipants}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-sm sm:text-base font-bold text-success">{challenge.earnings}</div>
                      <div className="text-xs text-muted-foreground">Заработок</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>

        {/* Create Challenge CTA */}
        <Card className="card-gradient border-primary/20 glow-primary">
          <CardContent className="p-4 text-center">
            <Trophy className="w-8 h-8 text-primary mx-auto mb-2" />
            <h3 className="font-semibold mb-1">Создайте свой челлендж</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Создавайте собственные турниры и зарабатывайте на комиссии
            </p>
            <Button variant="premium">
              Начать создание
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Challenges;