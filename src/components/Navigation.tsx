import { Home, TrendingUp, Trophy, User, Target, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;
  
  const navItems = [
    { icon: Home, label: "Главная", path: "/" },
    { icon: Target, label: "Прогнозы", path: "/predictions" },
    { icon: Plus, label: "Добавить", path: "/add-prediction", isPremium: true },
    { icon: TrendingUp, label: "Рейтинг", path: "/rankings" },
    { icon: User, label: "Профиль", path: "/profile" }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card/90 backdrop-blur-md border-t border-border telegram-safe-area z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-around py-3">
          {navItems.map((item, index) => (
            <Button
              key={index}
              variant={item.isPremium ? "premium" : (isActive(item.path) ? "default" : "ghost")}
              size="sm"
              className={`flex flex-col items-center space-y-1 h-auto py-2 px-3 ${
                item.isPremium ? "rounded-full" : ""
              } ${
                isActive(item.path) && !item.isPremium
                  ? "text-primary glow-primary" 
                  : !item.isPremium ? "text-muted-foreground hover:text-foreground" : ""
              }`}
              onClick={() => navigate(item.path)}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-xs">{item.label}</span>
            </Button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;