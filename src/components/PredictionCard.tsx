import { useState } from "react";
import { Clock, Users, TrendingUp, Settings } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PredictionStatusDialog } from "@/components/PredictionStatusDialog";
import { useAuth } from "@/hooks/useAuth";

import type { Prediction } from "@/types";

interface PredictionCardProps {
  prediction: Prediction;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

const PredictionCard = ({ prediction, className = "", style, onClick }: PredictionCardProps) => {
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const { user, profile } = useAuth();
  
  // Check if user can edit this prediction
  const canEditPrediction = () => {
    if (!user || !profile) return false;
    
    // Debug logging
    console.log('PredictionCard Debug:', {
      userId: user.id,
      profile: profile,
      predictionUserId: prediction.userId
    });
    
    // User is admin or moderator
    if (profile.role === 'admin' || profile.role === 'moderator') return true;
    // User owns this prediction
    if (user.id === prediction.userId) return true;
    return false;
  };
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
      <CardContent className="p-3 sm:p-4">
        <div className="space-y-3 sm:space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center space-x-1.5 sm:space-x-2 flex-wrap">
              <Badge variant="outline" className="text-[10px] sm:text-xs px-1.5 py-0.5">
                {prediction.category}
              </Badge>
              <Badge variant="secondary" className="text-[10px] sm:text-xs px-1.5 py-0.5">
                {prediction.type}
              </Badge>
            </div>
            <Badge className={`text-[10px] sm:text-xs px-1.5 py-0.5 whitespace-nowrap ${getStatusStyles(prediction.status)}`}>
              {getStatusText(prediction.status)}
            </Badge>
          </div>

          {/* Event */}
          <div>
            <h3 className="font-semibold text-foreground mb-1 text-sm sm:text-base leading-tight">
              {prediction.event}
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground">
              от <span className="text-primary font-medium">{prediction.analyst}</span>
            </p>
          </div>

          {/* Prediction Details */}
          <div className="bg-muted/30 rounded-lg p-2.5 sm:p-3">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0 flex-1">
                <p className="text-xs text-muted-foreground">Прогноз</p>
                <p className="font-medium text-foreground text-sm sm:text-base truncate">{prediction.prediction}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-xs text-muted-foreground">Коэффициент</p>
                <p className="font-bold text-base sm:text-lg text-primary">
                  {prediction.coefficient}
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 sm:gap-4 text-[10px] sm:text-xs text-muted-foreground flex-wrap">
              <div className="flex items-center space-x-1">
                <Clock className="w-3 h-3" />
                <span className="whitespace-nowrap">{prediction.timeLeft}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Users className="w-3 h-3" />
                <span>245</span>
              </div>
              <div className="flex items-center space-x-1 hidden sm:flex">
                <TrendingUp className="w-3 h-3" />
                <span>ROI: +15%</span>
              </div>
            </div>
            <div className="flex gap-2">
              {canEditPrediction() && prediction.status === "pending" && (
                <Button 
                  size="sm" 
                  variant="outline"
                  className="text-xs px-2 sm:px-3 whitespace-nowrap"
                  onClick={(e) => {
                    e.stopPropagation();
                    setStatusDialogOpen(true);
                  }}
                >
                  <Settings className="w-3 h-3 mr-1" />
                  Результат
                </Button>
              )}
              <Button 
                size="sm" 
                variant={prediction.status === "pending" ? "premium" : "outline"}
                className="text-xs px-2 sm:px-3 whitespace-nowrap"
              >
                {prediction.status === "pending" ? "Следить" : "Детали"}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
      
      <PredictionStatusDialog
        prediction={prediction}
        open={statusDialogOpen}
        onOpenChange={setStatusDialogOpen}
      />
    </Card>
  );
};

export default PredictionCard;