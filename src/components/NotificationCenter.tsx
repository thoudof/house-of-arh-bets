import { useState } from "react";
import { Bell, X, Check, Clock, Trophy, TrendingUp, User, Settings } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";

interface Notification {
  id: string;
  type: "prediction" | "result" | "subscription" | "system";
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  analyst?: string;
  avatar?: string;
  predictionId?: string;
}

const NotificationCenter = () => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      type: "prediction",
      title: "Новый прогноз от ProAnalyst",
      message: "Реал Мадрид vs Барселона - П1, коэф. 2.45",
      timestamp: "2024-01-20T15:30:00Z",
      isRead: false,
      analyst: "ProAnalyst",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face",
      predictionId: "1"
    },
    {
      id: "2",
      type: "result",
      title: "Прогноз сыграл!",
      message: "Ваш прогноз на Челси принёс +180₽",
      timestamp: "2024-01-20T14:15:00Z",
      isRead: false,
      predictionId: "2"
    },
    {
      id: "3",
      type: "subscription",
      title: "Новый подписчик",
      message: "На вас подписался пользователь @sportsfan",
      timestamp: "2024-01-20T12:00:00Z",
      isRead: true
    },
    {
      id: "4",
      type: "system",
      title: "Обновление приложения",
      message: "Доступна новая версия с улучшениями",
      timestamp: "2024-01-19T18:00:00Z",
      isRead: true
    },
    {
      id: "5",
      type: "result",
      title: "Прогноз не сыграл",
      message: "Ваш прогноз на Лейкерс не прошёл",
      timestamp: "2024-01-19T16:30:00Z",
      isRead: true,
      predictionId: "3"
    }
  ]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "prediction":
        return <Trophy className="w-4 h-4 text-primary" />;
      case "result":
        return <TrendingUp className="w-4 h-4 text-success" />;
      case "subscription":
        return <User className="w-4 h-4 text-blue-500" />;
      case "system":
        return <Settings className="w-4 h-4 text-muted-foreground" />;
      default:
        return <Bell className="w-4 h-4" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "prediction":
        return "Прогноз";
      case "result":
        return "Результат";
      case "subscription":
        return "Подписка";
      case "system":
        return "Система";
      default:
        return "Уведомление";
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffMs / (1000 * 60));

    if (diffMinutes < 60) {
      return `${diffMinutes}м назад`;
    } else if (diffHours < 24) {
      return `${diffHours}ч назад`;
    } else {
      return date.toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, isRead: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, isRead: true }))
    );
    toast({
      title: "Готово",
      description: "Все уведомления отмечены как прочитанные",
    });
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const unreadNotifications = notifications.filter(n => !n.isRead);
  const allNotifications = notifications;

  const NotificationItem = ({ notification, showType = false }: { notification: Notification, showType?: boolean }) => (
    <Card className={`card-gradient card-hover ${!notification.isRead ? 'border-primary/50' : ''}`}>
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          {notification.avatar ? (
            <Avatar className="w-8 h-8">
              <AvatarImage src={notification.avatar} alt={notification.analyst} />
              <AvatarFallback>{notification.analyst?.[0]}</AvatarFallback>
            </Avatar>
          ) : (
            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
              {getNotificationIcon(notification.type)}
            </div>
          )}
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <h4 className={`text-sm font-medium truncate ${!notification.isRead ? 'text-foreground' : 'text-muted-foreground'}`}>
                {notification.title}
              </h4>
              {!notification.isRead && (
                <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
              )}
            </div>
            <p className="text-sm text-muted-foreground">{notification.message}</p>
            <div className="flex items-center space-x-2 mt-2">
              {showType && (
                <Badge variant="outline" className="text-xs">
                  {getTypeLabel(notification.type)}
                </Badge>
              )}
              <span className="text-xs text-muted-foreground">
                {formatTimestamp(notification.timestamp)}
              </span>
            </div>
          </div>
          
          <div className="flex items-center space-x-1">
            {!notification.isRead && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => markAsRead(notification.id)}
              >
                <Check className="w-3 h-3" />
              </Button>
            )}
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => deleteNotification(notification.id)}
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground text-xs h-5 w-5 rounded-full p-0 flex items-center justify-center">
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bell className="w-5 h-5" />
              <span>Уведомления</span>
            </div>
            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                <Check className="w-4 h-4 mr-1" />
                Прочитать все
              </Button>
            )}
          </SheetTitle>
          <SheetDescription>
            {unreadCount > 0 ? `${unreadCount} непрочитанных уведомлений` : "Все уведомления прочитаны"}
          </SheetDescription>
        </SheetHeader>

        <Tabs defaultValue="unread" className="mt-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="unread" className="relative">
              Новые
              {unreadCount > 0 && (
                <Badge className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs h-4 w-4 rounded-full p-0 flex items-center justify-center">
                  {unreadCount}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="all">Все</TabsTrigger>
          </TabsList>

          <TabsContent value="unread" className="mt-4">
            <ScrollArea className="h-[calc(100vh-200px)]">
              {unreadNotifications.length > 0 ? (
                <div className="space-y-3">
                  {unreadNotifications.map((notification) => (
                    <NotificationItem key={notification.id} notification={notification} />
                  ))}
                </div>
              ) : (
                <Card className="card-gradient">
                  <CardContent className="p-8 text-center">
                    <Check className="w-12 h-12 mx-auto mb-4 text-success" />
                    <h3 className="text-lg font-semibold mb-2">Все прочитано!</h3>
                    <p className="text-muted-foreground">
                      У вас нет новых уведомлений
                    </p>
                  </CardContent>
                </Card>
              )}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="all" className="mt-4">
            <ScrollArea className="h-[calc(100vh-200px)]">
              <div className="space-y-3">
                {allNotifications.map((notification) => (
                  <NotificationItem key={notification.id} notification={notification} showType />
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
};

export default NotificationCenter;