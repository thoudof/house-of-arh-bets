import { useState } from "react";
import { ArrowLeft, Users, Crown, Star, TrendingUp, Eye, EyeOff } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const ManageSubscriptions = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [subscriptions, setSubscriptions] = useState([
    {
      id: "1",
      name: "ProAnalyst",
      avatar: "",
      tier: "premium",
      winRate: 78,
      roi: 24.5,
      monthlyPrice: 49,
      subscribers: 1250,
      isSubscribed: true,
      notifications: true,
      since: "3 месяца назад"
    },
    {
      id: "2", 
      name: "SportsMaster",
      avatar: "",
      tier: "vip",
      winRate: 82,
      roi: 31.2,
      monthlyPrice: 99,
      subscribers: 890,
      isSubscribed: true,
      notifications: false,
      since: "1 месяц назад"
    },
    {
      id: "3",
      name: "BetKing",
      avatar: "",
      tier: "standard",
      winRate: 71,
      roi: 18.7,
      monthlyPrice: 29,
      subscribers: 2100,
      isSubscribed: true,
      notifications: true,
      since: "2 недели назад"
    }
  ]);

  const suggestedAnalysts = [
    {
      id: "4",
      name: "FootballGuru",
      avatar: "",
      tier: "premium",
      winRate: 85,
      roi: 28.9,
      monthlyPrice: 59,
      subscribers: 756,
      specialty: "Футбол"
    },
    {
      id: "5",
      name: "TennisAce",
      avatar: "",
      tier: "vip", 
      winRate: 79,
      roi: 33.1,
      monthlyPrice: 79,
      subscribers: 445,
      specialty: "Теннис"
    }
  ];

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case "vip": return <Crown className="w-4 h-4 text-yellow-500" />;
      case "premium": return <Star className="w-4 h-4 text-purple-500" />;
      default: return <Users className="w-4 h-4 text-blue-500" />;
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "vip": return "text-yellow-500 border-yellow-500/20 bg-yellow-500/10";
      case "premium": return "text-purple-500 border-purple-500/20 bg-purple-500/10";
      default: return "text-blue-500 border-blue-500/20 bg-blue-500/10";
    }
  };

  const handleUnsubscribe = (analystId: string, analystName: string) => {
    setSubscriptions(prev => prev.filter(sub => sub.id !== analystId));
    toast({
      title: "Отписка выполнена",
      description: `Вы отписались от ${analystName}`,
    });
  };

  const handleToggleNotifications = (analystId: string) => {
    setSubscriptions(prev => 
      prev.map(sub => 
        sub.id === analystId 
          ? { ...sub, notifications: !sub.notifications }
          : sub
      )
    );
  };

  const handleSubscribe = (analyst: any) => {
    toast({
      title: "Подписка оформлена!",
      description: `Вы подписались на ${analyst.name}`,
    });
  };

  return (
    <div className="min-h-screen bg-background telegram-safe-area pb-20">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="px-3 sm:px-4 py-3 sm:py-4 max-w-screen-lg mx-auto">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="text-lg sm:text-xl font-bold">Мои подписки</h1>
          </div>
        </div>
      </header>

      <div className="px-3 sm:px-4 py-4 sm:py-6 max-w-screen-lg mx-auto space-y-4 sm:space-y-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4">
          <Card className="card-gradient">
            <CardContent className="p-2.5 sm:p-4 text-center">
              <Users className="w-5 h-5 sm:w-6 sm:h-6 text-primary mx-auto mb-1" />
              <p className="text-xs sm:text-sm text-muted-foreground">Подписок</p>
              <p className="text-sm sm:text-lg font-bold">{subscriptions.length}</p>
            </CardContent>
          </Card>
          <Card className="card-gradient">
            <CardContent className="p-2.5 sm:p-4 text-center">
              <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-success mx-auto mb-1" />
              <p className="text-xs sm:text-sm text-muted-foreground">Ср. ROI</p>
              <p className="text-sm sm:text-lg font-bold">
                {Math.round(subscriptions.reduce((acc, sub) => acc + sub.roi, 0) / subscriptions.length)}%
              </p>
            </CardContent>
          </Card>
          <Card className="card-gradient">
            <CardContent className="p-2.5 sm:p-4 text-center">
              <Star className="w-5 h-5 sm:w-6 sm:h-6 text-warning mx-auto mb-1" />
              <p className="text-xs sm:text-sm text-muted-foreground">Тратите</p>
              <p className="text-sm sm:text-lg font-bold">
                ${subscriptions.reduce((acc, sub) => acc + sub.monthlyPrice, 0)}/мес
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="active">
          <TabsList className="grid w-full grid-cols-2 text-xs sm:text-sm">
            <TabsTrigger value="active">Активные</TabsTrigger>
            <TabsTrigger value="suggested">Рекомендуемые</TabsTrigger>
          </TabsList>

          {/* Active Subscriptions */}
          <TabsContent value="active" className="space-y-3 sm:space-y-4 mt-4">
            {subscriptions.map((analyst) => (
              <Card key={analyst.id} className="card-gradient">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={analyst.avatar} />
                      <AvatarFallback>{analyst.name[0]}</AvatarFallback>
                    </Avatar>
                    
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-sm sm:text-base">{analyst.name}</h3>
                            <Badge variant="outline" className={`text-xs ${getTierColor(analyst.tier)}`}>
                              {getTierIcon(analyst.tier)}
                              <span className="ml-1 capitalize">{analyst.tier}</span>
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">Подписан {analyst.since}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-primary">${analyst.monthlyPrice}/мес</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4 mb-3 text-center">
                        <div>
                          <div className="text-sm font-medium text-success">{analyst.winRate}%</div>
                          <div className="text-xs text-muted-foreground">Проходимость</div>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-primary">+{analyst.roi}%</div>
                          <div className="text-xs text-muted-foreground">ROI</div>
                        </div>
                        <div>
                          <div className="text-sm font-medium">{analyst.subscribers}</div>
                          <div className="text-xs text-muted-foreground">Подписчиков</div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => handleToggleNotifications(analyst.id)}
                        >
                          {analyst.notifications ? (
                            <>
                              <EyeOff className="w-4 h-4 mr-1" />
                              Откл. уведомления
                            </>
                          ) : (
                            <>
                              <Eye className="w-4 h-4 mr-1" />
                              Вкл. уведомления
                            </>
                          )}
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleUnsubscribe(analyst.id, analyst.name)}
                        >
                          Отписаться
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Suggested Analysts */}
          <TabsContent value="suggested" className="space-y-3 sm:space-y-4 mt-4">
            {suggestedAnalysts.map((analyst) => (
              <Card key={analyst.id} className="card-gradient border-primary/20">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={analyst.avatar} />
                      <AvatarFallback>{analyst.name[0]}</AvatarFallback>
                    </Avatar>
                    
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-sm sm:text-base">{analyst.name}</h3>
                            <Badge variant="outline" className={`text-xs ${getTierColor(analyst.tier)}`}>
                              {getTierIcon(analyst.tier)}
                              <span className="ml-1 capitalize">{analyst.tier}</span>
                            </Badge>
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            {analyst.specialty}
                          </Badge>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-primary">${analyst.monthlyPrice}/мес</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4 mb-3 text-center">
                        <div>
                          <div className="text-sm font-medium text-success">{analyst.winRate}%</div>
                          <div className="text-xs text-muted-foreground">Проходимость</div>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-primary">+{analyst.roi}%</div>
                          <div className="text-xs text-muted-foreground">ROI</div>
                        </div>
                        <div>
                          <div className="text-sm font-medium">{analyst.subscribers}</div>
                          <div className="text-xs text-muted-foreground">Подписчиков</div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => navigate(`/analyst/${analyst.id}`)}
                        >
                          Подробнее
                        </Button>
                        <Button
                          variant="premium"
                          size="sm"
                          onClick={() => handleSubscribe(analyst)}
                        >
                          Подписаться
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            <Card className="card-gradient border-primary/20 glow-primary">
              <CardContent className="p-4 text-center">
                <TrendingUp className="w-8 h-8 text-primary mx-auto mb-2" />
                <h3 className="font-semibold mb-1">Найти больше аналитиков</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Откройте для себя новых успешных аналитиков
                </p>
                <Button variant="premium" onClick={() => navigate('/rankings')}>
                  Смотреть рейтинг
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ManageSubscriptions;