import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTelegramAuth } from '@/hooks/useTelegramAuth';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const TelegramDebugInfo = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [lastAuthLog, setLastAuthLog] = useState<string>('');
  const [authLogs, setAuthLogs] = useState<string[]>([]);
  const { user, isAuthenticated, isLoading, error, authenticate, signOut } = useTelegramAuth();
  const queryClient = useQueryClient();

  // Захват console.log для отображения в интерфейсе
  useEffect(() => {
    const originalLog = console.log;
    const originalError = console.error;
    
    console.log = (...args) => {
      const message = args.join(' ');
      if (message.includes('🔐') || message.includes('✅') || message.includes('❌') || message.includes('🔍') || message.includes('📋') || message.includes('🔄')) {
        setLastAuthLog(message);
        setAuthLogs(prev => [...prev.slice(-4), message]); // Храним последние 5 логов
      }
      originalLog(...args);
    };
    
    console.error = (...args) => {
      const message = args.join(' ');
      if (message.includes('❌') || message.includes('Authentication') || message.includes('Sign')) {
        setLastAuthLog(`ERROR: ${message}`);
        setAuthLogs(prev => [...prev.slice(-4), `ERROR: ${message}`]);
      }
      originalError(...args);
    };
    
    return () => {
      console.log = originalLog;
      console.error = originalError;
    };
  }, []);

  const clearAllData = async () => {
    try {
      console.log('🗑️ Clearing all data...');
      queryClient.clear();
      await signOut();
      sessionStorage.clear();
      localStorage.clear();
      window.location.reload();
    } catch (error) {
      console.error('Error clearing data:', error);
    }
  };

  const forceSignIn = async () => {
    try {
      console.log('🔄 Force sign in triggered...');
      await authenticate();
    } catch (error) {
      console.error('❌ Force sign in error:', error);
    }
  };

  const refreshProfile = async () => {
    try {
      console.log('🔄 Refreshing profile...');
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      if (user?.id) {
        window.location.reload();
      }
    } catch (error) {
      console.error('Profile refresh failed:', error);
    }
  };

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
    <div className="fixed top-4 right-4 z-50 w-96 max-h-96 overflow-y-auto">
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
              <Badge variant={user ? "default" : "destructive"}>
                {user ? "Ready" : "Not Ready"}
              </Badge>
              <div>Platform: Telegram Mini App</div>
              <div>WebApp: Available</div>
              <div>User ID: {user?.telegram_id || "None"}</div>
              <div>Username: {user?.username || "None"}</div>
              <div>Name: {user?.first_name} {user?.last_name || ''}</div>
              <div>Premium: {user?.is_premium ? "Yes" : "No"}</div>
            </div>
          </div>

          <div>
            <div className="font-medium mb-1">Auth Status</div>
            <div className="space-y-1">
              <Badge variant={isAuthenticated ? "default" : "destructive"}>
                {isAuthenticated ? "Authenticated" : "Not Authenticated"}
              </Badge>
              <div>Loading: {isLoading ? "Yes" : "No"}</div>
              <div>Auth User ID: {user?.id || "None"}</div>
              <div>Error: {error || "None"}</div>
              <div>Profile Name: {user?.first_name} {user?.last_name || ''}</div>
            </div>
          </div>

          <div>
            <div className="font-medium mb-1">URL Data</div>
            <div className="space-y-1">
              <div>Has tgWebAppData: {window.location.href.includes('tgWebAppData') ? "Yes" : "No"}</div>
              <div>URL Length: {window.location.href.length}</div>
              <div className="text-[10px] break-all">
                {window.location.href.substring(0, 100)}...
              </div>
            </div>
          </div>

          {authLogs.length > 0 && (
            <div>
              <div className="font-medium mb-1">Auth Logs</div>
              <div className="text-[10px] bg-muted/50 p-2 rounded max-h-20 overflow-y-auto space-y-1">
                {authLogs.map((log, index) => (
                  <div key={index} className="break-all">{log}</div>
                ))}
              </div>
            </div>
          )}

          <div className="pt-2 border-t space-y-2">
            {!isAuthenticated && (
              <Button
                size="sm"
                variant="default"
                onClick={forceSignIn}
                className="w-full text-xs"
              >
                🔐 Принудительный вход
              </Button>
            )}
            
            {isAuthenticated && (
              <Button
                size="sm"
                variant="outline"
                onClick={refreshProfile}
                className="w-full text-xs"
              >
                🔄 Обновить профиль
              </Button>
            )}
            
            <Button
              size="sm"
              variant="destructive"
              onClick={clearAllData}
              className="w-full text-xs"
            >
              🗑️ Очистить все данные
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};