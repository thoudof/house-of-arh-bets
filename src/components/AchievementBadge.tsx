import { Trophy, Star, Target, TrendingUp, Users, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  tier: "bronze" | "silver" | "gold" | "platinum";
  progress: number;
  maxProgress: number;
  isUnlocked: boolean;
  unlockedAt?: string;
  reward?: string;
}

interface AchievementBadgeProps {
  achievement: Achievement;
  size?: "sm" | "md" | "lg";
  showProgress?: boolean;
}

const AchievementBadge = ({ achievement, size = "md", showProgress = true }: AchievementBadgeProps) => {
  const getTierStyles = (tier: string) => {
    switch (tier) {
      case "bronze":
        return "bg-amber-100 border-amber-300 text-amber-800";
      case "silver":
        return "bg-gray-100 border-gray-300 text-gray-800";
      case "gold":
        return "bg-yellow-100 border-yellow-300 text-yellow-800";
      case "platinum":
        return "bg-purple-100 border-purple-300 text-purple-800";
      default:
        return "bg-muted border-muted-foreground/20 text-muted-foreground";
    }
  };

  const getIconColor = (tier: string) => {
    switch (tier) {
      case "bronze":
        return "text-amber-600";
      case "silver":
        return "text-gray-600";
      case "gold":
        return "text-yellow-600";
      case "platinum":
        return "text-purple-600";
      default:
        return "text-muted-foreground";
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return {
          container: "p-2",
          icon: "w-4 h-4",
          title: "text-xs",
          description: "text-[10px]",
          progress: "h-1"
        };
      case "lg":
        return {
          container: "p-4",
          icon: "w-8 h-8",
          title: "text-base",
          description: "text-sm",
          progress: "h-3"
        };
      default:
        return {
          container: "p-3",
          icon: "w-6 h-6",
          title: "text-sm",
          description: "text-xs",
          progress: "h-2"
        };
    }
  };

  const sizeClasses = getSizeClasses();
  const progressPercent = (achievement.progress / achievement.maxProgress) * 100;

  if (size === "sm") {
    return (
      <div className={`flex items-center space-x-2 p-2 rounded-lg border ${
        achievement.isUnlocked 
          ? getTierStyles(achievement.tier) 
          : "bg-muted/50 border-muted text-muted-foreground"
      }`}>
        <achievement.icon className={`w-4 h-4 ${
          achievement.isUnlocked ? getIconColor(achievement.tier) : "text-muted-foreground"
        }`} />
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium truncate">{achievement.title}</p>
          {showProgress && !achievement.isUnlocked && (
            <div className="flex items-center space-x-1 mt-1">
              <Progress value={progressPercent} className="h-1 flex-1" />
              <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                {achievement.progress}/{achievement.maxProgress}
              </span>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <Card className={`card-gradient ${achievement.isUnlocked ? 'border-primary/20 glow-primary' : ''}`}>
      <CardContent className={sizeClasses.container}>
        <div className="flex items-start space-x-3">
          <div className={`p-2 rounded-lg ${
            achievement.isUnlocked 
              ? getTierStyles(achievement.tier) 
              : "bg-muted text-muted-foreground"
          }`}>
            <achievement.icon className={`${sizeClasses.icon} ${
              achievement.isUnlocked ? getIconColor(achievement.tier) : "text-muted-foreground"
            }`} />
          </div>
          
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between mb-1">
              <h3 className={`font-semibold ${sizeClasses.title} ${
                achievement.isUnlocked ? 'text-foreground' : 'text-muted-foreground'
              }`}>
                {achievement.title}
              </h3>
              <Badge variant="outline" className={`text-[10px] ${
                achievement.isUnlocked ? getTierStyles(achievement.tier) : 'text-muted-foreground'
              }`}>
                {achievement.tier}
              </Badge>
            </div>
            
            <p className={`${sizeClasses.description} text-muted-foreground mb-2`}>
              {achievement.description}
            </p>

            {achievement.isUnlocked ? (
              <div className="flex items-center space-x-2">
                <Badge className="bg-success text-success-foreground text-[10px]">
                  Получено
                </Badge>
                {achievement.unlockedAt && (
                  <span className="text-[10px] text-muted-foreground">
                    {achievement.unlockedAt}
                  </span>
                )}
              </div>
            ) : (
              showProgress && (
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-muted-foreground">Прогресс</span>
                    <span className="text-[10px] text-muted-foreground">
                      {achievement.progress}/{achievement.maxProgress}
                    </span>
                  </div>
                  <Progress value={progressPercent} className={sizeClasses.progress} />
                </div>
              )
            )}

            {achievement.reward && (
              <div className="mt-2 p-2 bg-primary/10 rounded border border-primary/20">
                <p className="text-[10px] text-primary font-medium">
                  Награда: {achievement.reward}
                </p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AchievementBadge;