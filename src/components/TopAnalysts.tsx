import { Star, TrendingUp, Award } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const TopAnalysts = () => {
  const analysts = [
    {
      id: 1,
      name: "ProAnalyst",
      rank: "Эксперт",
      roi: "+45%",
      winRate: "73%",
      predictions: 156,
      badge: "🥇",
      verified: true
    },
    {
      id: 2,
      name: "BetMaster",
      rank: "Профессионал",
      roi: "+32%",
      winRate: "68%",
      predictions: 89,
      badge: "🥈",
      verified: true
    },
    {
      id: 3,
      name: "SportGuru",
      rank: "Опытный",
      roi: "+28%",
      winRate: "65%",
      predictions: 124,
      badge: "🥉",
      verified: false
    }
  ];

  return (
    <Card className="card-gradient">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center space-x-2 text-base">
          <Award className="w-5 h-5 text-primary" />
          <span>Топ аналитики</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {analysts.map((analyst, index) => (
          <div 
            key={analyst.id} 
            className="p-3 rounded-lg bg-muted/20 hover:bg-muted/30 transition-all duration-200 animate-fade-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <span className="text-lg">{analyst.badge}</span>
                <div>
                  <div className="flex items-center space-x-1">
                    <h4 className="font-medium text-sm text-foreground">
                      {analyst.name}
                    </h4>
                    {analyst.verified && (
                      <Star className="w-3 h-3 text-primary fill-current" />
                    )}
                  </div>
                  <Badge variant="outline" className="text-xs h-4">
                    {analyst.rank}
                  </Badge>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                Следить
              </Button>
            </div>
            
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="text-center">
                <p className="text-success font-medium">{analyst.roi}</p>
                <p className="text-muted-foreground">ROI</p>
              </div>
              <div className="text-center">
                <p className="text-foreground font-medium">{analyst.winRate}</p>
                <p className="text-muted-foreground">Побед</p>
              </div>
              <div className="text-center">
                <p className="text-foreground font-medium">{analyst.predictions}</p>
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