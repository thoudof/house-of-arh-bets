
import { useAuth } from '@/hooks/useAuth';
import { useTelegram } from '@/hooks/useTelegram';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const ProfileErrorHandler = () => {
  const { user, loading, isAuthenticated, signInWithTelegram } = useAuth();
  const { user: telegramUser, isReady } = useTelegram();

  const handleForceSignIn = async () => {
    console.log('🔄 Force sign in triggered by user');
    try {
      const result = await signInWithTelegram();
      if (result.error) {
        console.error('❌ Force sign in failed:', result.error);
      } else {
        console.log('✅ Force sign in successful');
      }
    } catch (error) {
      console.error('❌ Force sign in error:', error);
    }
  };

  if (loading) {
    return (
      <Card className="max-w-md mx-auto mt-8">
        <CardContent className="p-6 text-center">
          <div>Загрузка...</div>
        </CardContent>
      </Card>
    );
  }

  if (!isReady) {
    return (
      <Card className="max-w-md mx-auto mt-8">
        <CardContent className="p-6 text-center">
          <div>Ожидание готовности Telegram...</div>
        </CardContent>
      </Card>
    );
  }

  if (!telegramUser) {
    return (
      <Card className="max-w-md mx-auto mt-8">
        <CardHeader>
          <CardTitle>Ошибка Telegram</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>Не удалось получить данные пользователя из Telegram</p>
          <div className="text-sm text-muted-foreground">
            <p>Telegram ready: {isReady ? 'Yes' : 'No'}</p>
            <p>Current URL: {window.location.href}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!isAuthenticated) {
    return (
      <Card className="max-w-md mx-auto mt-8">
        <CardHeader>
          <CardTitle>Требуется авторизация</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>Пользователь не авторизован</p>
          <div className="text-sm text-muted-foreground space-y-1">
            <p>Telegram ID: {telegramUser.id}</p>
            <p>Имя: {telegramUser.first_name} {telegramUser.last_name}</p>
            <p>Username: {telegramUser.username}</p>
            <p>Auth User ID: {user?.id || 'None'}</p>
          </div>
          <Button onClick={handleForceSignIn} className="w-full">
            Войти через Telegram
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-md mx-auto mt-8">
      <CardHeader>
        <CardTitle>Пользователь авторизован</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm space-y-1">
          <p>Auth User ID: {user?.id}</p>
          <p>Email: {user?.email}</p>
          <p>Telegram ID: {telegramUser.id}</p>
          <p>Имя: {telegramUser.first_name} {telegramUser.last_name}</p>
        </div>
      </CardContent>
    </Card>
  );
};
