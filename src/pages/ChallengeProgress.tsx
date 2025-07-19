import { useState } from "react";
import { ArrowLeft, Trophy, Clock, Target, TrendingUp, Plus, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const ChallengeProgress = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  const [betAmount, setBetAmount] = useState("");
  const [betCoeff, setBetCoeff] = useState("");

  // Mock data
  const challenge = {
    id: id || "1",
    title: "Лесенка дня",
    currentStep: 3,
    totalSteps: 10,
    currentBank: 250,
    initialBank: 100,
    minCoeff: 1.5,
    timeLeft: "5ч 32м",
    nextTarget: 312.5,
    progressPercent: 30
  };

  const stepHistory = [
    { step: 1, bet: "Реал Мадрид П1", coeff: 1.65, amount: 100, result: "win", profit: 65 },
    { step: 2, bet: "Тотал больше 2.5", coeff: 1.8, amount: 165, result: "win", profit: 132 },
    { step: 3, bet: "Манчестер П1", coeff: 1.55, amount: 297, result: "pending", profit: 0 }
  ];

  const handlePlaceBet = () => {
    const amount = parseFloat(betAmount);
    const coeff = parseFloat(betCoeff);

    if (!amount || !coeff) {
      toast({
        title: "Ошибка",
        description: "Заполните все поля",
        variant: "destructive",
      });
      return;
    }

    if (coeff < challenge.minCoeff) {
      toast({
        title: "Ошибка",
        description: `Минимальный коэффициент: ${challenge.minCoeff}`,
        variant: "destructive",
      });
      return;
    }

    if (amount > challenge.currentBank) {
      toast({
        title: "Ошибка", 
        description: "Сумма превышает текущий банк",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Ставка размещена!",
      description: "Ожидайте результат матча",
    });

    setBetAmount("");
    setBetCoeff("");
  };

  const getResultColor = (result: string) => {
    switch (result) {
      case "win": return "text-green-500";
      case "loss": return "text-red-500";
      case "pending": return "text-yellow-500";
      default: return "text-muted-foreground";
    }
  };

  const getResultText = (result: string) => {
    switch (result) {
      case "win": return "Выиграл";
      case "loss": return "Проиграл";
      case "pending": return "В ожидании";
      default: return "Неизвестно";
    }
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
            <h1 className="text-lg sm:text-xl font-bold truncate">{challenge.title}</h1>
          </div>
        </div>
      </header>

      <div className="px-3 sm:px-4 py-4 sm:py-6 max-w-screen-lg mx-auto space-y-4 sm:space-y-6">
        {/* Current Progress */}
        <Card className="card-gradient border-primary/20 glow-primary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-primary" />
              Ваш прогресс
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div>
                <div className="text-lg font-bold text-primary">${challenge.currentBank}</div>
                <div className="text-xs text-muted-foreground">Текущий банк</div>
              </div>
              <div>
                <div className="text-lg font-bold">{challenge.currentStep}/{challenge.totalSteps}</div>
                <div className="text-xs text-muted-foreground">Шаг</div>
              </div>
              <div>
                <div className="text-lg font-bold text-success">${challenge.nextTarget}</div>
                <div className="text-xs text-muted-foreground">Цель</div>
              </div>
              <div>
                <div className="text-lg font-bold text-warning">{challenge.timeLeft}</div>
                <div className="text-xs text-muted-foreground">Осталось</div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Прогресс челленджа</span>
                <span>{challenge.progressPercent}%</span>
              </div>
              <Progress value={challenge.progressPercent} className="h-3" />
            </div>
          </CardContent>
        </Card>

        {/* Place Bet */}
        <Card className="card-gradient">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              Сделать ставку
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 bg-muted/50 rounded-lg flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-warning mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <div className="font-medium">Требования:</div>
                <div className="text-muted-foreground">
                  Минимальный коэффициент: {challenge.minCoeff} | Максимальная сумма: ${challenge.currentBank}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="betAmount">Сумма ставки</Label>
                <Input
                  id="betAmount"
                  type="number"
                  value={betAmount}
                  onChange={(e) => setBetAmount(e.target.value)}
                  placeholder="100"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="betCoeff">Коэффициент</Label>
                <Input
                  id="betCoeff"
                  type="number"
                  step="0.01"
                  value={betCoeff}
                  onChange={(e) => setBetCoeff(e.target.value)}
                  placeholder="1.85"
                  className="mt-1"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => setBetAmount(challenge.currentBank.toString())}
                className="flex-1"
              >
                Весь банк
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setBetAmount((challenge.currentBank / 2).toString())}
                className="flex-1"
              >
                50%
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setBetAmount((challenge.currentBank / 4).toString())}
                className="flex-1"
              >
                25%
              </Button>
            </div>

            <Button onClick={handlePlaceBet} variant="premium" className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Сделать ставку
            </Button>
          </CardContent>
        </Card>

        {/* Step History */}
        <Card className="card-gradient">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              История шагов
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {stepHistory.map((step) => (
              <div key={step.step} className="p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      Шаг {step.step}
                    </Badge>
                    <Badge variant="outline" className={`text-xs ${getResultColor(step.result)}`}>
                      {getResultText(step.result)}
                    </Badge>
                  </div>
                  <div className="text-sm font-medium">
                    К{step.coeff} • ${step.amount}
                  </div>
                </div>
                <div className="text-sm">{step.bet}</div>
                {step.profit > 0 && (
                  <div className="text-xs text-success mt-1">
                    Прибыль: +${step.profit}
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Quit Challenge */}
        <Card className="card-gradient border-red-500/20">
          <CardContent className="p-4 text-center">
            <h3 className="font-semibold mb-2 text-red-500">Выйти из челленджа</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Вы можете выйти сейчас и забрать текущий банк (комиссия 10%)
            </p>
            <Button variant="destructive" className="w-full">
              Выйти и забрать ${Math.round(challenge.currentBank * 0.9)}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ChallengeProgress;