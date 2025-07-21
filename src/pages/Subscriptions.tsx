import { useState } from "react";
import { UserPlus, UserMinus, Star, TrendingUp, ArrowLeft, Bell, Settings } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useTopAnalysts } from "@/hooks/api/useProfiles";

const Subscriptions = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState(true);

  const { data: topAnalysts, isLoading } = useTopAnalysts();

  // Моковые подписки - в реальном приложении это будет отдельная таблица
  const mockSubscriptions: any[] = [];

  const handleSubscribe = (analystId: string, analystName: string) => {
    toast({
      title: "Подписка оформлена!",
      description: `Вы подписались на ${analystName}`,
    });
  };

  const handleUnsubscribe = (analystId: string, analystName: string) => {
    toast({
      title: "Отписка выполнена",
      description: `Вы отписались от ${analystName}`,
    });
  };

  const getTierBadge = (tier: string) => {
    if (tier === "premium") {
      return <Badge className="bg-primary text-primary-foreground">Premium</Badge>;
    }
    return <Badge variant="outline">Standard</Badge>;
  };

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
              <h1 className="text-xl font-bold">Подписки</h1>
            </div>
            <Button variant="ghost" size="sm">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Notification Settings */}
        <Card className="card-gradient">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Bell className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium">Уведомления</p>
                  <p className="text-sm text-muted-foreground">Получать уведомления о новых прогнозах</p>
                </div>
              </div>
              <Switch checked={notifications} onCheckedChange={setNotifications} />
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="subscriptions">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="subscriptions">Мои подписки</TabsTrigger>
            <TabsTrigger value="recommendations">Рекомендации</TabsTrigger>
          </TabsList>

          <TabsContent value="subscriptions" className="space-y-4 mt-6">
            {mockSubscriptions.length > 0 ? (
              <div className="space-y-4">
                {mockSubscriptions.map((analyst) => (
                  <Card key={analyst.id} className="card-gradient card-hover">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={analyst.avatar} alt={analyst.name} />
                          <AvatarFallback>{analyst.name[0]}</AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            <p className="font-semibold truncate">{analyst.name}</p>
                            {getTierBadge(analyst.tier)}
                          </div>
                          <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                            <span>{analyst.winRate}% побед</span>
                            <span>+{analyst.roi}% ROI</span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {analyst.recentPredictions} прогнозов за неделю
                          </p>
                        </div>
                        
                        <div className="flex flex-col space-y-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleUnsubscribe(analyst.id, analyst.name)}
                          >
                            <UserMinus className="w-4 h-4 mr-1" />
                            Отписаться
                          </Button>
                          <div className="flex items-center space-x-2">
                            <Bell className="w-3 h-3" />
                            <Switch 
                              checked={analyst.isNotificationsEnabled}
                            />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="card-gradient">
                <CardContent className="p-8 text-center">
                  <UserPlus className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">Нет подписок</h3>
                  <p className="text-muted-foreground mb-4">
                    Подпишитесь на аналитиков, чтобы получать их прогнозы
                  </p>
                  <Button variant="premium" onClick={() => navigate('/rankings')}>
                    Найти аналитиков
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="recommendations" className="space-y-4 mt-6">
            <Card className="card-gradient border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Star className="w-5 h-5 text-primary" />
                  <span>Рекомендуемые аналитики</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isLoading ? (
                  <div>Загрузка аналитиков...</div>
                ) : topAnalysts?.map((analyst) => (
                  <div key={analyst.id} className="flex items-center space-x-3 p-3 rounded-lg bg-card-hover">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={analyst.avatar_url || undefined} alt={analyst.first_name} />
                      <AvatarFallback>{analyst.first_name[0]}</AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <p className="font-semibold truncate">{analyst.first_name} {analyst.last_name}</p>
                        {getTierBadge('standard')}
                      </div>
                      <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                        <span>{analyst.user_stats?.win_rate || 0}% побед</span>
                        <span>+{analyst.user_stats?.roi || 0}% ROI</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {analyst.user_stats?.total_predictions || 0} прогнозов
                      </p>
                    </div>
                    
                    <Button 
                      variant="premium" 
                      size="sm"
                      onClick={() => handleSubscribe(analyst.id, `${analyst.first_name} ${analyst.last_name}`)}
                    >
                      <UserPlus className="w-4 h-4 mr-1" />
                      Подписаться
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Trending Analysts */}
            <Card className="card-gradient">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-success" />
                  <span>Растущие аналитики</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Аналитики, которые показывают рост результатов в последнее время
                </p>
                <div className="space-y-3">
                  {topAnalysts?.slice(0, 2).map((analyst) => (
                    <div key={analyst.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={analyst.avatar_url || undefined} alt={analyst.first_name} />
                          <AvatarFallback>{analyst.first_name[0]}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{analyst.first_name} {analyst.last_name}</span>
                      </div>
                      <Button variant="outline" size="sm">
                        Подписаться
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Subscriptions;