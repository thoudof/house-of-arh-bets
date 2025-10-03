import { Star, TrendingUp, Award } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import VerificationBadge from '@/components/VerificationBadge';
import { Button } from "@/components/ui/button";
import { useTopAnalysts } from "@/hooks/api/useProfiles";

const TopAnalysts = () => {
  const { data: analysts, isLoading } = useTopAnalysts();

  const getBadge = (index: number) => {
    switch (index) {
      case 0: return "🥇";
      case 1: return "🥈";
      case 2: return "🥉";
      default: return "⭐";
    }
  };

  if (isLoading) {
    return (
      <Card className="card-gradient">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2 text-base">
            <Award className="w-5 h-5 text-primary" />
            <span>Топ аналитики</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-muted/20 rounded-lg animate-pulse" />
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="card-gradient">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center space-x-2 text-base">
          <Award className="w-5 h-5 text-primary" />
          <span>Топ аналитики</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {(analysts || []).slice(0, 3).map((analyst, index) => (
          <div 
            key={analyst.user_id || index}
            className="p-3 rounded-lg bg-muted/20 hover:bg-muted/30 transition-all duration-200 animate-fade-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <span className="text-lg">{getBadge(index)}</span>
                <div>
                   <div className="flex items-center space-x-1">
                     <h4 className="font-medium text-sm text-foreground">
                       {analyst.display_name}
                     </h4>
                     <VerificationBadge isVerified={analyst.is_verified} size="sm" />
                   </div>
                   <Badge variant="outline" className="text-xs h-4">
                     Новичок
                   </Badge>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                Следить
              </Button>
            </div>
            
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="text-center">
                <p className="text-success font-medium">
                  {analyst.user_stats?.roi > 0 ? '+' : ''}{Math.round(analyst.user_stats?.roi || 0)}%
                </p>
                <p className="text-muted-foreground">ROI</p>
              </div>
              <div className="text-center">
                <p className="text-foreground font-medium">
                  {analyst.user_stats?.total_predictions > 0 ? 
                    Math.round((analyst.user_stats.successful_predictions / analyst.user_stats.total_predictions) * 100) : 0}%
                </p>
                <p className="text-muted-foreground">Побед</p>
              </div>
              <div className="text-center">
                <p className="text-foreground font-medium">
                  {analyst.user_stats?.total_predictions || 0}
                </p>
                <p className="text-muted-foreground">Ставок</p>
              </div>
            </div>
          </div>
        ))}
        
        <Button variant="outline" className="w-full text-sm">
          <TrendingUp className="w-4 h-4 mr-2" />
          Все рейтинги
        </Button>
      </CardContent>
    </Card>
  );
};

export default TopAnalysts;