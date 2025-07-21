import React from 'react';
import { ArrowLeft, CheckCircle, Star, TrendingUp, Users, Award } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import LoadingScreen from '@/components/LoadingScreen';
import TelegramLogin from '@/components/TelegramLogin';
import { useAuth } from '@/hooks/useAuth';

const VerificationInfo = () => {
  const navigate = useNavigate();
  const { user, isLoading, isAuthenticated } = useAuth();

  // Show loading screen while auth is being checked
  if (isLoading) {
    return <LoadingScreen />;
  }

  // Если пользователь не авторизован
  if (!isAuthenticated || !user) {
    return <TelegramLogin />;
  }

  const verificationCriteria = [
    {
      icon: Star,
      title: "50+ лайков",
      description: "Получите минимум 50 одобрительных оценок от других пользователей",
      color: "text-yellow-500"
    },
    {
      icon: TrendingUp,
      title: "20+ прогнозов",
      description: "Создайте не менее 20 качественных прогнозов",
      color: "text-primary"
    },
    {
      icon: Award,
      title: "60%+ точность",
      description: "Поддерживайте процент успешных прогнозов выше 60%",
      color: "text-success"
    },
    {
      icon: Users,
      title: "Доверие сообщества",
      description: "Завоюйте уважение и доверие других участников платформы",
      color: "text-accent"
    }
  ];

  const benefits = [
    "Повышенное доверие от аудитории",
    "Приоритетное отображение прогнозов",
    "Доступ к эксклюзивным функциям",
    "Участие в рейтинге топ-аналитиков",
    "Возможность получения подписчиков"
  ];

  return (
    <div className="min-h-screen bg-background telegram-safe-area">
      {/* Header */}
      <header className="bg-gradient-to-r from-card to-card-hover border-b border-border/30 backdrop-blur-lg sticky top-0 z-50">
        <div className="px-4 py-4 max-w-screen-lg mx-auto">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="hover:bg-muted/50"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-lg font-bold text-foreground flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-primary" />
                <span>Верификация профиля</span>
              </h1>
              <p className="text-xs text-muted-foreground">
                Узнайте, как получить статус верифицированного аналитика
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <section className="px-4 pt-6 pb-20 max-w-screen-lg mx-auto space-y-6">
        
        {/* What is Verification */}
        <Card className="card-gradient border-primary/20 glow-primary">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CheckCircle className="w-6 h-6 text-primary" />
              <span>Что такое верификация?</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Верификация — это знак качества и доверия от сообщества House of Arh. 
              Верифицированные аналитики отличаются высокой точностью прогнозов и 
              пользуются заслуженным авторитетом среди участников платформы.
            </p>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                <CheckCircle className="w-2.5 h-2.5 text-primary-foreground stroke-[3]" />
              </div>
              <span className="text-sm font-medium">Значок верификации</span>
            </div>
          </CardContent>
        </Card>

        {/* How to get verified */}
        <Card className="card-gradient border-0">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Award className="w-6 h-6 text-accent" />
              <span>Как получить верификацию?</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground mb-4">
              Существует два способа получения верификации:
            </p>
            
            <div className="space-y-3">
              <Badge variant="outline" className="bg-primary/10 border-primary/30 text-primary">
                Автоматическая верификация
              </Badge>
              <p className="text-sm text-muted-foreground">
                Система автоматически проверяет вашу статистику и присваивает статус 
                при соответствии критериям.
              </p>
            </div>

            <div className="space-y-3">
              <Badge variant="outline" className="bg-accent/10 border-accent/30 text-accent">
                Ручная верификация
              </Badge>
              <p className="text-sm text-muted-foreground">
                Администрация может присвоить статус выдающимся аналитикам, 
                внесшим особый вклад в развитие сообщества.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Criteria */}
        <Card className="card-gradient border-0">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-6 h-6 text-success" />
              <span>Критерии автоматической верификации</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {verificationCriteria.map((criterion, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 rounded-lg bg-muted/20 border border-border/30">
                  <div className={`p-2 rounded-lg bg-gradient-to-br from-muted to-muted-foreground/20`}>
                    <criterion.icon className={`w-5 h-5 ${criterion.color}`} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground">{criterion.title}</h4>
                    <p className="text-sm text-muted-foreground">{criterion.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Benefits */}
        <Card className="card-gradient border-0">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Star className="w-6 h-6 text-yellow-500" />
              <span>Преимущества верификации</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">{benefit}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <Card className="card-gradient border-primary/20 glow-primary">
          <CardContent className="p-6 text-center space-y-4">
            <h3 className="text-lg font-bold text-foreground">
              Готовы стать верифицированным аналитиком?
            </h3>
            <p className="text-sm text-muted-foreground">
              Начните создавать качественные прогнозы и завоевывайте доверие сообщества!
            </p>
            <Button 
              className="btn-premium" 
              onClick={() => navigate('/add-prediction')}
            >
              Создать прогноз
            </Button>
          </CardContent>
        </Card>

      </section>

      {/* Bottom Navigation */}
      <Navigation />
    </div>
  );
};

export default VerificationInfo;