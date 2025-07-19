import { useState, useRef, useEffect } from "react";
import { Send, ArrowLeft, MoreVertical, Phone, Video, Paperclip } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useNavigate, useParams } from "react-router-dom";

const Chat = () => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentUser = {
    id: "current",
    name: "Вы",
    avatar: ""
  };

  const chatUser = {
    id: "user1",
    name: "ProAnalyst",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face",
    status: "online",
    lastSeen: "сейчас в сети"
  };

  const [messages, setMessages] = useState([
    {
      id: "1",
      senderId: "user1",
      text: "Привет! Видел твой прогноз на матч Реал - Барса. Интересное решение!",
      timestamp: "14:30",
      isRead: true
    },
    {
      id: "2", 
      senderId: "current",
      text: "Спасибо! Я считаю, что коэффициент на победу Реала завышен",
      timestamp: "14:32",
      isRead: true
    },
    {
      id: "3",
      senderId: "user1", 
      text: "Согласен, но стоит учесть травмы ключевых игроков. У меня есть инсайдерская информация о составе",
      timestamp: "14:35",
      isRead: true
    },
    {
      id: "4",
      senderId: "current",
      text: "Это было бы очень полезно! Можешь поделиться?",
      timestamp: "14:36",
      isRead: true
    },
    {
      id: "5",
      senderId: "user1",
      text: "Конечно! Бензема точно не сыграет, а Модрич под вопросом. Это существенно влияет на атаку команды",
      timestamp: "14:38",
      isRead: false
    },
    {
      id: "6",
      senderId: "user1",
      text: "Кстати, у меня есть новый прогноз на завтра. Хочешь обсудить?",
      timestamp: "14:40",
      isRead: false
    }
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const newMessage = {
      id: Date.now().toString(),
      senderId: currentUser.id,
      text: message.trim(),
      timestamp: new Date().toLocaleTimeString('ru-RU', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      isRead: false
    };

    setMessages(prev => [...prev, newMessage]);
    setMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col telegram-safe-area">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <Avatar className="w-8 h-8 sm:w-10 sm:h-10">
                <AvatarImage src={chatUser.avatar} alt={chatUser.name} />
                <AvatarFallback>{chatUser.name[0]}</AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <h1 className="text-sm sm:text-base font-semibold truncate">{chatUser.name}</h1>
                <div className="flex items-center space-x-1">
                  {chatUser.status === 'online' && (
                    <div className="w-2 h-2 bg-success rounded-full"></div>
                  )}
                  <p className="text-xs text-muted-foreground">{chatUser.lastSeen}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <Button variant="ghost" size="sm">
                <Phone className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Video className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.senderId === currentUser.id ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[80%] sm:max-w-[70%] ${
              msg.senderId === currentUser.id ? 'order-2' : 'order-1'
            }`}>
              <div
                className={`rounded-2xl px-3 py-2 ${
                  msg.senderId === currentUser.id
                    ? 'bg-primary text-primary-foreground ml-auto'
                    : 'bg-muted'
                }`}
              >
                <p className="text-sm">{msg.text}</p>
              </div>
              <div className={`flex items-center mt-1 space-x-1 ${
                msg.senderId === currentUser.id ? 'justify-end' : 'justify-start'
              }`}>
                <span className="text-xs text-muted-foreground">{msg.timestamp}</span>
                {msg.senderId === currentUser.id && (
                  <div className={`w-1.5 h-1.5 rounded-full ${
                    msg.isRead ? 'bg-primary' : 'bg-muted-foreground'
                  }`}></div>
                )}
              </div>
            </div>
            {msg.senderId !== currentUser.id && (
              <Avatar className="w-6 h-6 sm:w-8 sm:h-8 ml-2 order-1">
                <AvatarImage src={chatUser.avatar} alt={chatUser.name} />
                <AvatarFallback className="text-xs">{chatUser.name[0]}</AvatarFallback>
              </Avatar>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="border-t border-border bg-card/50 backdrop-blur-sm p-3 sm:p-4">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm">
            <Paperclip className="w-4 h-4" />
          </Button>
          <div className="flex-1 relative">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Напишите сообщение..."
              className="pr-12"
            />
            <Button
              size="sm"
              variant={message.trim() ? "premium" : "ghost"}
              className="absolute right-1 top-1/2 transform -translate-y-1/2 w-8 h-8 p-0"
              onClick={handleSendMessage}
              disabled={!message.trim()}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Typing Indicator (Optional) */}
      {false && (
        <div className="px-4 py-2 bg-muted/50">
          <div className="flex items-center space-x-2">
            <Avatar className="w-6 h-6">
              <AvatarImage src={chatUser.avatar} alt={chatUser.name} />
              <AvatarFallback className="text-xs">{chatUser.name[0]}</AvatarFallback>
            </Avatar>
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
            </div>
            <span className="text-xs text-muted-foreground">печатает...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;