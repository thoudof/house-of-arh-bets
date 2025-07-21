import React, { useState } from 'react';
import { ArrowLeft, Filter, Search, TrendingUp, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import PredictionCard from "@/components/PredictionCard";
import LoadingScreen from '@/components/LoadingScreen';
import TelegramLogin from '@/components/TelegramLogin';
import { usePredictions } from "@/hooks/api/usePredictions";
import { useAuth } from "@/hooks/useAuth";

const Predictions = () => {
  const navigate = useNavigate();
  const { user, isLoading, isAuthenticated } = useAuth();
  const { data: predictions, isLoading: predictionsLoading } = usePredictions();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("public");

  // Show loading screen while auth is being checked
  if (isLoading) {
    return <LoadingScreen />;
  }

  // Если пользователь не авторизован
  if (!isAuthenticated || !user) {
    return <TelegramLogin />;
  }

  // Фильтруем прогнозы
  const publicPredictions = predictions?.filter(p => 
    p.is_public && 
    p.user_id !== user.id &&
    (!searchQuery || 
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.event_name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  ) || [];

  const personalPredictions = predictions?.filter(p => 
    p.user_id === user.id &&
    (!searchQuery || 
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.event_name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  ) || [];

  return (
    <div className="min-h-screen bg-background telegram-safe-area">
      {/* Header */}
      <header className="bg-gradient-to-r from-card to-card-hover border-b border-border/30 backdrop-blur-lg sticky top-0 z-50">
        <div className="px-4 py-4 max-w-screen-lg mx-auto">
          <div className="flex items-center justify-between">
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
                <h1 className="text-lg font-bold text-foreground">
                  Все прогнозы
                </h1>
                <p className="text-xs text-muted-foreground">
                  Найди лучшие предсказания
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="border-primary/30 hover:bg-primary/10"
            >
              <Filter className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Search Bar */}
      <section className="px-4 pt-4 pb-2 max-w-screen-lg mx-auto">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Поиск по названию события или прогнозу..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-card border-border/30"
          />
        </div>
      </section>

      {/* Tabs */}
      <section className="px-4 pb-20 max-w-screen-lg mx-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6 bg-card border border-border/30">
            <TabsTrigger value="public" className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4" />
              <span>Публичные</span>
              <Badge variant="secondary" className="text-xs">
                {publicPredictions.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="personal" className="flex items-center space-x-2">
              <User className="w-4 h-4" />
              <span>Личные</span>
              <Badge variant="secondary" className="text-xs">
                {personalPredictions.length}
              </Badge>
            </TabsTrigger>
          </TabsList>

          {/* Публичные прогнозы */}
          <TabsContent value="public" className="space-y-4">
            <Card className="card-gradient border-0">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-bold flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  <span>Публичные прогнозы</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {predictionsLoading ? (
                  <div className="space-y-3">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="h-32 bg-muted/20 rounded-lg animate-pulse" />
                    ))}
                  </div>
                ) : publicPredictions.length > 0 ? (
                  publicPredictions.map((prediction, index) => (
                    <PredictionCard 
                      key={prediction.id} 
                      prediction={{
                        id: prediction.id,
                        user_id: prediction.user_id,
                        event_name: prediction.event_name || prediction.title,
                        type: prediction.type,
                        coefficient: Number(prediction.coefficient),
                        title: prediction.title,
                        status: prediction.status,
                        event_start_time: prediction.event_start_time,
                        category: prediction.category,
                        is_public: prediction.is_public,
                        created_at: prediction.created_at,
                        updated_at: prediction.updated_at,
                        stake: prediction.stake ? Number(prediction.stake) : undefined,
                        profit: prediction.profit ? Number(prediction.profit) : undefined,
                        description: prediction.description,
                        prediction_deadline: prediction.prediction_deadline,
                        is_featured: prediction.is_featured || false,
                        is_premium: prediction.is_premium || false,
                        views_count: prediction.views_count || 0,
                        likes_count: prediction.likes_count || 0,
                        comments_count: prediction.comments_count || 0,
                        shares_count: prediction.shares_count || 0,
                        profiles: prediction.profiles
                      }}
                      className="animate-fade-in"
                      style={{ animationDelay: `${index * 100}ms` }}
                      onClick={() => navigate(`/prediction/${prediction.id}`)}
                    />
                  ))
                ) : (
                  <div className="text-center py-12 space-y-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-muted to-muted-foreground/20 rounded-full flex items-center justify-center mx-auto">
                      <TrendingUp className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">Публичных прогнозов пока нет</h3>
                      <p className="text-sm text-muted-foreground">
                        {searchQuery ? "Попробуйте изменить поисковый запрос" : "Станьте первым, кто поделится публичным прогнозом!"}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Личные прогнозы */}
          <TabsContent value="personal" className="space-y-4">
            <Card className="card-gradient border-0">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-bold flex items-center space-x-2">
                  <User className="w-5 h-5 text-accent" />
                  <span>Ваши прогнозы</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {predictionsLoading ? (
                  <div className="space-y-3">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="h-32 bg-muted/20 rounded-lg animate-pulse" />
                    ))}
                  </div>
                ) : personalPredictions.length > 0 ? (
                  personalPredictions.map((prediction, index) => (
                    <PredictionCard 
                      key={prediction.id} 
                      prediction={{
                        id: prediction.id,
                        user_id: prediction.user_id,
                        event_name: prediction.event_name || prediction.title,
                        type: prediction.type,
                        coefficient: Number(prediction.coefficient),
                        title: prediction.title,
                        status: prediction.status,
                        event_start_time: prediction.event_start_time,
                        category: prediction.category,
                        is_public: prediction.is_public,
                        created_at: prediction.created_at,
                        updated_at: prediction.updated_at,
                        stake: prediction.stake ? Number(prediction.stake) : undefined,
                        profit: prediction.profit ? Number(prediction.profit) : undefined,
                        description: prediction.description,
                        prediction_deadline: prediction.prediction_deadline,
                        is_featured: prediction.is_featured || false,
                        is_premium: prediction.is_premium || false,
                        views_count: prediction.views_count || 0,
                        likes_count: prediction.likes_count || 0,
                        comments_count: prediction.comments_count || 0,
                        shares_count: prediction.shares_count || 0,
                        profiles: prediction.profiles
                      }}
                      className="animate-fade-in"
                      style={{ animationDelay: `${index * 100}ms` }}
                      onClick={() => navigate(`/prediction/${prediction.id}`)}
                    />
                  ))
                ) : (
                  <div className="text-center py-12 space-y-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-muted to-muted-foreground/20 rounded-full flex items-center justify-center mx-auto">
                      <User className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">У вас пока нет прогнозов</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        {searchQuery ? "Попробуйте изменить поисковый запрос" : "Создайте свой первый прогноз!"}
                      </p>
                      {!searchQuery && (
                        <Button 
                          className="btn-premium" 
                          onClick={() => navigate('/add-prediction')}
                        >
                          Создать прогноз
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </section>

      {/* Bottom Navigation */}
      <Navigation />
    </div>
  );
};

export default Predictions;