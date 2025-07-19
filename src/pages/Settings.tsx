import { useState } from "react";
import { ArrowLeft, Bell, Shield, Palette, Globe, CreditCard, HelpCircle, LogOut } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";

const Settings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [settings, setSettings] = useState({
    notifications: {
      predictions: true,
      challenges: true,
      messages: false,
      marketing: false
    },
    privacy: {
      profileVisible: true,
      statsVisible: true,
      showOnline: false
    },
    preferences: {
      theme: "system",
      language: "ru",
      currency: "USD",
      timezone: "Europe/Moscow"
    }
  });

  const handleNotificationChange = (key: string, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: value
      }
    }));
  };

  const handlePrivacyChange = (key: string, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      privacy: {
        ...prev.privacy,
        [key]: value
      }
    }));
  };

  const handlePreferenceChange = (key: string, value: string) => {
    setSettings(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [key]: value
      }
    }));
  };

  const handleLogout = () => {
    toast({
      title: "Выход выполнен",
      description: "До свидания!",
    });
    // В реальном приложении здесь была бы логика выхода
  };

  return (
    <div className="min-h-screen bg-background telegram-safe-area pb-20">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="px-3 sm:px-4 py-3 sm:py-4 max-w-screen-lg mx-auto">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="text-lg sm:text-xl font-bold">Настройки</h1>
          </div>
        </div>
      </header>

      <div className="px-3 sm:px-4 py-4 sm:py-6 max-w-screen-lg mx-auto space-y-4 sm:space-y-6">
        {/* Notifications */}
        <Card className="card-gradient">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-primary" />
              Уведомления
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Новые прогнозы</div>
                <div className="text-sm text-muted-foreground">От аналитиков, на которых вы подписаны</div>
              </div>
              <Switch
                checked={settings.notifications.predictions}
                onCheckedChange={(value) => handleNotificationChange('predictions', value)}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Челленджи</div>
                <div className="text-sm text-muted-foreground">Новые челленджи и результаты</div>
              </div>
              <Switch
                checked={settings.notifications.challenges}
                onCheckedChange={(value) => handleNotificationChange('challenges', value)}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Сообщения</div>
                <div className="text-sm text-muted-foreground">Личные сообщения от других пользователей</div>
              </div>
              <Switch
                checked={settings.notifications.messages}
                onCheckedChange={(value) => handleNotificationChange('messages', value)}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Маркетинг</div>
                <div className="text-sm text-muted-foreground">Акции и специальные предложения</div>
              </div>
              <Switch
                checked={settings.notifications.marketing}
                onCheckedChange={(value) => handleNotificationChange('marketing', value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Privacy */}
        <Card className="card-gradient">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              Приватность
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Видимость профиля</div>
                <div className="text-sm text-muted-foreground">Другие могут видеть ваш профиль</div>
              </div>
              <Switch
                checked={settings.privacy.profileVisible}
                onCheckedChange={(value) => handlePrivacyChange('profileVisible', value)}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Показывать статистику</div>
                <div className="text-sm text-muted-foreground">Ваши результаты видны другим</div>
              </div>
              <Switch
                checked={settings.privacy.statsVisible}
                onCheckedChange={(value) => handlePrivacyChange('statsVisible', value)}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Показывать онлайн</div>
                <div className="text-sm text-muted-foreground">Отображать статус "в сети"</div>
              </div>
              <Switch
                checked={settings.privacy.showOnline}
                onCheckedChange={(value) => handlePrivacyChange('showOnline', value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Preferences */}
        <Card className="card-gradient">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="w-5 h-5 text-primary" />
              Предпочтения
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm font-medium">Тема</Label>
              <Select value={settings.preferences.theme} onValueChange={(value) => handlePreferenceChange('theme', value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Светлая</SelectItem>
                  <SelectItem value="dark">Темная</SelectItem>
                  <SelectItem value="system">Системная</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm font-medium">Язык</Label>
              <Select value={settings.preferences.language} onValueChange={(value) => handlePreferenceChange('language', value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ru">Русский</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Español</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm font-medium">Валюта</Label>
              <Select value={settings.preferences.currency} onValueChange={(value) => handlePreferenceChange('currency', value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD ($)</SelectItem>
                  <SelectItem value="EUR">EUR (€)</SelectItem>
                  <SelectItem value="RUB">RUB (₽)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm font-medium">Часовой пояс</Label>
              <Select value={settings.preferences.timezone} onValueChange={(value) => handlePreferenceChange('timezone', value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Europe/Moscow">Москва (GMT+3)</SelectItem>
                  <SelectItem value="Europe/London">Лондон (GMT+0)</SelectItem>
                  <SelectItem value="America/New_York">Нью-Йорк (GMT-5)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Other Options */}
        <div className="space-y-3">
          <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/billing')}>
            <CreditCard className="w-4 h-4 mr-3" />
            Биллинг и подписки
          </Button>

          <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/help')}>
            <HelpCircle className="w-4 h-4 mr-3" />
            Помощь и поддержка
          </Button>

          <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/legal')}>
            <Globe className="w-4 h-4 mr-3" />
            Правовая информация
          </Button>
        </div>

        {/* Logout */}
        <Card className="card-gradient border-red-500/20">
          <CardContent className="p-4">
            <Button variant="destructive" className="w-full" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Выйти из аккаунта
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
