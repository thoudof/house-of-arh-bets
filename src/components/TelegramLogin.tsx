import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, MessageCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const TelegramLogin = () => {
  const { authenticateWithTelegram, isLoading, error } = useAuth();
  const [hasAttempted, setHasAttempted] = useState(false);

  const handleTelegramAuth = async () => {
    setHasAttempted(true);
    try {
      await authenticateWithTelegram();
    } catch (err) {
      console.error('Ошибка авторизации:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-4">
      <Card className="w-full max-w-md card-gradient border-primary/20">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <MessageCircle className="w-8 h-8 text-primary" />
          </div>
          <div className="space-y-2">
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              Добро пожаловать
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Войдите через Telegram для доступа к платформе прогнозов
            </CardDescription>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive" className="border-destructive/50 bg-destructive/5">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {hasAttempted && !error && (
            <Alert className="border-blue-200 bg-blue-50 text-blue-900">
              <AlertDescription>
                Проверьте консоль браузера для отладочной информации. 
                Убедитесь, что приложение запущено внутри Telegram.
              </AlertDescription>
            </Alert>
          )}
          
          <Button
            onClick={handleTelegramAuth}
            disabled={isLoading}
            className="w-full bg-[#0088cc] hover:bg-[#006aa3] text-white h-12 text-base font-medium"
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Авторизация...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <MessageCircle className="w-5 h-5" />
                <span>Войти через Telegram</span>
              </div>
            )}
          </Button>
          
          <div className="text-center text-sm text-muted-foreground">
            <p>Для работы приложения необходимо</p>
            <p>запустить его из Telegram Mini App</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TelegramLogin;