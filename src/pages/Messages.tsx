import { useState } from "react";
import { Search, MessageCircle, ArrowLeft, MoreVertical } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

const Messages = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const conversations = [
    {
      id: "1",
      user: {
        id: "user1",
        name: "ProAnalyst",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face",
        status: "online"
      },
      lastMessage: {
        text: "Кстати, у меня есть новый прогноз на завтра. Хочешь обсудить?",
        timestamp: "14:40",
        isRead: false,
        senderId: "user1"
      },
      unreadCount: 2
    },
    {
      id: "2",
      user: {
        id: "user2", 
        name: "BetMaster",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face",
        status: "offline"
      },
      lastMessage: {
        text: "Спасибо за совет по ставке!",
        timestamp: "вчера",
        isRead: true,
        senderId: "current"
      },
      unreadCount: 0
    },
    {
      id: "3",
      user: {
        id: "user3",
        name: "SportGuru",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b332c8ad?w=50&h=50&fit=crop&crop=face",
        status: "online"
      },
      lastMessage: {
        text: "Увидел твой анализ матча, очень интересно",
        timestamp: "13:25",
        isRead: true,
        senderId: "user3"
      },
      unreadCount: 0
    },
    {
      id: "4",
      user: {
        id: "user4",
        name: "FootballKing",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=50&h=50&fit=crop&crop=face",
        status: "offline"
      },
      lastMessage: {
        text: "Можем создать общий экспресс?",
        timestamp: "2 дня назад",
        isRead: false,
        senderId: "user4"
      },
      unreadCount: 1
    }
  ];

  const filteredConversations = conversations.filter(conv =>
    conv.user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatTime = (timestamp: string) => {
    return timestamp;
  };

  return (
    <div className="min-h-screen bg-background telegram-safe-area">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <h1 className="text-lg sm:text-xl font-bold">Сообщения</h1>
            </div>
            <Button variant="ghost" size="sm">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </div>
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Поиск собеседников..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </header>

      <div className="px-3 sm:px-4 py-4 space-y-1">
        {/* Conversations List */}
        {filteredConversations.length > 0 ? (
          filteredConversations.map((conversation) => (
            <Card 
              key={conversation.id} 
              className="card-gradient card-hover cursor-pointer"
              onClick={() => navigate(`/chat/${conversation.user.id}`)}
            >
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-center space-x-3">
                  {/* Avatar with status */}
                  <div className="relative">
                    <Avatar className="w-12 h-12 sm:w-14 sm:h-14">
                      <AvatarImage src={conversation.user.avatar} alt={conversation.user.name} />
                      <AvatarFallback>{conversation.user.name[0]}</AvatarFallback>
                    </Avatar>
                    {conversation.user.status === 'online' && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 sm:w-4 sm:h-4 bg-success rounded-full border-2 border-background"></div>
                    )}
                  </div>

                  {/* Message Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-sm sm:text-base truncate">
                        {conversation.user.name}
                      </h3>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {formatTime(conversation.lastMessage.timestamp)}
                        </span>
                        {conversation.unreadCount > 0 && (
                          <Badge className="bg-primary text-primary-foreground min-w-[20px] h-5 text-xs flex items-center justify-center">
                            {conversation.unreadCount}
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <p className={`text-xs sm:text-sm truncate flex-1 ${
                        conversation.unreadCount > 0 ? 'font-medium text-foreground' : 'text-muted-foreground'
                      }`}>
                        {conversation.lastMessage.senderId === 'current' && (
                          <span className="text-primary mr-1">Вы: </span>
                        )}
                        {conversation.lastMessage.text}
                      </p>
                      {conversation.lastMessage.senderId === 'current' && (
                        <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                          conversation.lastMessage.isRead ? 'bg-primary' : 'bg-muted-foreground'
                        }`}></div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          /* Empty State */
          <div className="text-center py-12">
            <MessageCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              {searchQuery ? 'Ничего не найдено' : 'Нет сообщений'}
            </h3>
            <p className="text-sm text-muted-foreground mb-6">
              {searchQuery 
                ? 'Попробуйте изменить поисковый запрос'
                : 'Начните общение с другими участниками'
              }
            </p>
            {!searchQuery && (
              <Button variant="premium" onClick={() => navigate('/rankings')}>
                Найти аналитиков
              </Button>
            )}
          </div>
        )}

        {/* Quick Actions */}
        {filteredConversations.length > 0 && !searchQuery && (
          <Card className="card-gradient border-primary/20 mt-6">
            <CardContent className="p-4 text-center">
              <MessageCircle className="w-8 h-8 text-primary mx-auto mb-2" />
              <h3 className="font-semibold mb-1">Найти новых собеседников</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Общайтесь с другими аналитиками и делитесь опытом
              </p>
              <Button variant="premium" onClick={() => navigate('/rankings')}>
                Посмотреть рейтинги
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Messages;