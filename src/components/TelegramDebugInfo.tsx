import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTelegram } from '@/hooks/useTelegram';
import { useAuth } from '@/hooks/useAuth';

export const TelegramDebugInfo = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { user: telegramUser, isReady, platform, webApp } = useTelegram();
  const { user: authUser, loading: authLoading, profile, isAuthenticated } = useAuth();

  if (!isExpanded) {
    return (
      <div className="fixed top-4 right-4 z-50">
        <Button
          size="sm"
          variant="outline"
          onClick={() => setIsExpanded(true)}
          className="text-xs"
        >
          Debug
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed top-4 right-4 z-50 w-80 max-h-96 overflow-y-auto">
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm">Debug Info</CardTitle>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsExpanded(false)}
              className="text-xs p-1 h-6 w-6"
            >
              ×
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3 text-xs">
          <div>
            <div className="font-medium mb-1">Telegram Status</div>
            <div className="space-y-1">
              <Badge variant={isReady ? "default" : "destructive"}>
                {isReady ? "Ready" : "Not Ready"}
              </Badge>
              <div>Platform: {platform}</div>
              <div>WebApp: {webApp ? "Available" : "Not Available"}</div>
              <div>User ID: {telegramUser?.id || "None"}</div>
              <div>Username: {telegramUser?.username || "None"}</div>
              <div>Name: {telegramUser?.first_name} {telegramUser?.last_name}</div>
            </div>
          </div>

          <div>
            <div className="font-medium mb-1">Auth Status</div>
            <div className="space-y-1">
              <Badge variant={isAuthenticated ? "default" : "destructive"}>
                {isAuthenticated ? "Authenticated" : "Not Authenticated"}
              </Badge>
              <div>Loading: {authLoading ? "Yes" : "No"}</div>
              <div>Auth User ID: {authUser?.id || "None"}</div>
              <div>Profile Role: {profile?.role || "None"}</div>
              <div>Profile Name: {profile?.first_name} {profile?.last_name}</div>
            </div>
          </div>

          <div>
            <div className="font-medium mb-1">Environment</div>
            <div className="space-y-1">
              <div>User Agent: {navigator.userAgent.slice(0, 50)}...</div>
              <div>URL: {window.location.href}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};