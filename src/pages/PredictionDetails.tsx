import { useState } from "react";
import { ArrowLeft, Share, Clock, Trophy, TrendingUp, Calendar, User, Target, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { usePrediction } from "@/hooks/api/usePredictions";
import type { Prediction } from "@/types";

const PredictionDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();

  const { data: prediction, isLoading } = usePrediction(id!);

  if (isLoading) {
    return <div className="min-h-screen bg-background telegram-safe-area flex items-center justify-center">
      <div className="text-center">Загрузка прогноза...</div>
    </div>;
  }

  if (!prediction) {
    return <div className="min-h-screen bg-background telegram-safe-area flex items-center justify-center">
      <div className="text-center">Прогноз не найден</div>
    </div>;
  }

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'pending':
        return { 
          label: 'Ожидание', 
          color: 'bg-muted text-muted-foreground',
          icon: Clock 
        };
      case 'win':
        return { 
          label: 'Выигрыш', 
          color: 'bg-success text-success-foreground',
          icon: Trophy 
        };
      case 'loss':
        return { 
          label: 'Проигрыш', 
          color: 'bg-destructive text-destructive-foreground',
          icon: AlertCircle 
        };
      case 'returned':
        return { 
          label: 'Возврат', 
          color: 'bg-muted text-muted-foreground',
          icon: TrendingUp 
        };
      default:
        return { 
          label: 'Неизвестно', 
          color: 'bg-muted text-muted-foreground',
          icon: Clock 
        };
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'single': return 'Ординар';
      case 'express': return 'Экспресс';
      case 'system': return 'Система';
      default: return type;
    }
  };

  const statusInfo = getStatusInfo(prediction.status);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Прогноз: ${prediction.event}`,
        text: `${prediction.prediction} - коэф. ${prediction.coefficient}`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Скопировано!",
        description: "Ссылка скопирована в буфер обмена",
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
              <h1 className="text-xl font-bold">Прогноз</h1>
            </div>
            <Button variant="ghost" size="sm" onClick={handleShare}>
              <Share className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Main Card */}
        <Card className="card-gradient glow-primary">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">{prediction.category}</Badge>
                  <Badge variant="outline">{getTypeLabel(prediction.type)}</Badge>
                  <Badge className={statusInfo.color}>
                    <statusInfo.icon className="w-3 h-3 mr-1" />
                    {statusInfo.label}
                  </Badge>
                </div>
                <h2 className="text-xl font-bold">{prediction.event}</h2>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {/* Prediction Details */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Прогноз:</span>
                <span className="font-semibold">{prediction.prediction}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Коэффициент:</span>
                <span className="font-bold text-lg text-primary">{prediction.coefficient}</span>
              </div>

              {prediction.stake && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Размер ставки:</span>
                  <span className="font-semibold">{prediction.stake} ₽</span>
                </div>
              )}

              {prediction.profit !== undefined && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Результат:</span>
                  <span className={`font-semibold ${prediction.profit > 0 ? 'text-success' : 'text-destructive'}`}>
                    {prediction.profit > 0 ? '+' : ''}{prediction.profit} ₽
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Время до события:</span>
                <span className="font-semibold">{prediction.time_left || 'Не указано'}</span>
              </div>
            </div>

            <Separator />

            {/* Event Time */}
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span>Начало события: {formatDate(prediction.start_date)}</span>
            </div>
          </CardContent>
        </Card>

        {/* Analyst Info */}
        <Card className="card-gradient">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="w-5 h-5" />
              <span>Автор прогноза</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-3">
              <Avatar>
                <AvatarImage src={prediction.profiles?.avatar_url || undefined} />
                <AvatarFallback>{prediction.profiles?.first_name?.[0] || 'A'}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h4 className="font-semibold">{prediction.profiles?.first_name} {prediction.profiles?.last_name}</h4>
                <p className="text-sm text-muted-foreground">Пользователь</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => navigate(`/profile/${prediction.user_id}`)}>
                Профиль
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Description */}
        {prediction.description && (
          <Card className="card-gradient">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="w-5 h-5" />
                <span>Обоснование</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                {prediction.description}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          {prediction.status === 'pending' && (
            <Button variant="premium" className="w-full" size="lg">
              <Trophy className="w-4 h-4 mr-2" />
              Добавить в портфель
            </Button>
          )}
          
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" onClick={() => navigate('/profile')}>
              Другие прогнозы
            </Button>
            <Button variant="outline" onClick={() => navigate('/rankings')}>
              Рейтинги
            </Button>
          </div>
        </div>

        {/* Meta Information */}
        <Card className="card-gradient">
          <CardContent className="p-4">
            <div className="text-xs text-muted-foreground space-y-1">
              <p>Создан: {formatDate(prediction.created_at)}</p>
              <p>ID прогноза: {prediction.id}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PredictionDetails;