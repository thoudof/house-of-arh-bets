import { Home, TrendingUp, Trophy, User, Target } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navigation = () => {
  const navItems = [
    { icon: Home, label: "Главная", active: true },
    { icon: Target, label: "Прогнозы" },
    { icon: TrendingUp, label: "Рейтинг" },
    { icon: Trophy, label: "Турниры" },
    { icon: User, label: "Профиль" }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card/90 backdrop-blur-md border-t border-border telegram-safe-area z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-around py-3">
          {navItems.map((item, index) => (
            <Button
              key={index}
              variant="ghost"
              size="sm"
              className={`flex flex-col items-center space-y-1 h-auto py-2 px-3 ${
                item.active 
                  ? "text-primary glow-primary" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
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