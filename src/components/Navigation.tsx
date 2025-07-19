
import { Home, TrendingUp, Trophy, User, Target, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { useTelegram } from "@/hooks/useTelegram";

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { hapticFeedback } = useTelegram();

  const isActive = (path: string) => location.pathname === path;
  
  const navItems = [
    { icon: Home, label: "Главная", path: "/" },
    { icon: TrendingUp, label: "Рейтинг", path: "/rankings" },
    { icon: Plus, label: "Добавить", path: "/add-prediction", isPremium: true },
    { icon: Target, label: "Подписки", path: "/subscriptions" },
    { icon: User, label: "Профиль", path: "/profile" }
  ];

  const handleNavigation = (path: string) => {
    hapticFeedback('selection');
    navigate(path);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card/90 backdrop-blur-md border-t border-border telegram-safe-area z-50">
      <div className="max-w-screen-sm mx-auto px-2 sm:px-4">
        <div className="flex items-center justify-between py-2 sm:py-3 gap-1">
          {navItems.map((item, index) => (
            <Button
              key={index}
              variant={item.isPremium ? "premium" : (isActive(item.path) ? "default" : "ghost")}
              size="sm"
              className={`flex flex-col items-center justify-center min-w-0 flex-1 max-w-[72px] h-auto py-1.5 px-1 ${
                item.isPremium ? "rounded-full mx-1" : ""
              } ${
                isActive(item.path) && !item.isPremium
                  ? "text-primary glow-primary" 
                  : !item.isPremium ? "text-muted-foreground hover:text-foreground" : ""
              }`}
              onClick={() => handleNavigation(item.path)}
            >
              <item.icon className="w-4 h-4 sm:w-5 sm:h-5 mb-0.5" />
              <span className="text-[10px] sm:text-xs leading-tight truncate">{item.label}</span>
            </Button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
