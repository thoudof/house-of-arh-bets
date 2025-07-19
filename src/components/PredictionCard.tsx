import { Clock, Users, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import type { Prediction } from "@/types";

interface PredictionCardProps {
  prediction: Prediction;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

const PredictionCard = ({ prediction, className = "", style, onClick }: PredictionCardProps) => {
  const getStatusStyles = (status: string) => {
    switch (status) {
      case "win":
        return "status-win";
      case "loss":
        return "status-loss";
      default:
        return "status-pending";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "win":
        return "Выигрыш";
      case "loss":
        return "Проигрыш";
      default:
        return "Ожидание";
    }
  };

  return (
    <Card 
      className={`card-gradient card-hover ${onClick ? 'cursor-pointer' : ''} ${className}`} 
      style={style}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-xs">
                {prediction.category}
              </Badge>
              <Badge variant="secondary" className="text-xs">
                {prediction.type}
              </Badge>
            </div>
            <Badge className={`text-xs ${getStatusStyles(prediction.status)}`}>
              {getStatusText(prediction.status)}
            </Badge>
          </div>

          {/* Event */}
          <div>
            <h3 className="font-semibold text-foreground mb-1">
              {prediction.event}
            </h3>
            <p className="text-sm text-muted-foreground">
              от <span className="text-primary font-medium">{prediction.analyst}</span>
            </p>
          </div>

          {/* Prediction Details */}
          <div className="bg-muted/30 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Прогноз</p>
                <p className="font-medium text-foreground">{prediction.prediction}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Коэффициент</p>
                <p className="font-bold text-lg text-primary">
                  {prediction.coefficient}
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 text-xs text-muted-foreground">
              <div className="flex items-center space-x-1">
                <Clock className="w-3 h-3" />
                <span>{prediction.timeLeft}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Users className="w-3 h-3" />
                <span>245</span>
              </div>
              <div className="flex items-center space-x-1">
                <TrendingUp className="w-3 h-3" />
                <span>ROI: +15%</span>
              </div>
            </div>
            <Button 
              size="sm" 
              variant={prediction.status === "pending" ? "premium" : "outline"}
            >
              {prediction.status === "pending" ? "Следить" : "Детали"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PredictionCard;