import { useState } from "react";
import { ArrowLeft, Plus, Calendar, Trophy } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useCreatePrediction } from "@/hooks/api/usePredictions";
import { useTelegram } from "@/hooks/useTelegram";

const AddPredictionForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const createPrediction = useCreatePrediction();
  const { hapticFeedback } = useTelegram();
  
  const [formData, setFormData] = useState({
    event: "",
    prediction: "",
    coefficient: "",
    stake: "",
    category: "",
    type: "single" as const,
    description: "",
    startDate: "",
    startTime: "",
    isPublic: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Валидация
      if (!formData.event || !formData.prediction || !formData.coefficient) {
        toast({
          title: "Ошибка",
          description: "Заполните все обязательные поля",
          variant: "destructive"
        });
        return;
      }

      const coef = parseFloat(formData.coefficient);
      if (isNaN(coef) || coef < 1) {
        toast({
          title: "Ошибка",
          description: "Коэффициент должен быть числом больше 1",
          variant: "destructive"
        });
        return;
      }

      // Создание прогноза через API
      await createPrediction.mutateAsync({
        event: formData.event,
        type: formData.type,
        coefficient: coef,
        prediction: formData.prediction,
        stake: formData.stake ? parseFloat(formData.stake) : undefined,
        category: formData.category || "Прочее",
        description: formData.description || undefined,
        start_date: formData.startDate && formData.startTime 
          ? `${formData.startDate}T${formData.startTime}:00Z` 
          : new Date().toISOString(),
        end_date: formData.startDate && formData.startTime 
          ? `${formData.startDate}T${formData.startTime}:00Z` 
          : undefined,
        is_public: formData.isPublic
      });

      hapticFeedback('success');
      navigate('/');
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось добавить прогноз",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background telegram-safe-area">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="text-xl font-bold">Добавить прогноз</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Main Information */}
          <Card className="card-gradient">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Trophy className="w-5 h-5 text-primary" />
                <span>Основная информация</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="event">Событие *</Label>
                <Input
                  id="event"
                  placeholder="Например: Реал Мадрид vs Барселона"
                  value={formData.event}
                  onChange={(e) => handleInputChange('event', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="prediction">Прогноз *</Label>
                <Input
                  id="prediction"
                  placeholder="Например: П1, ТБ 2.5, Х"
                  value={formData.prediction}
                  onChange={(e) => handleInputChange('prediction', e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="coefficient">Коэффициент *</Label>
                  <Input
                    id="coefficient"
                    type="number"
                    step="0.01"
                    min="1"
                    placeholder="2.50"
                    value={formData.coefficient}
                    onChange={(e) => handleInputChange('coefficient', e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="stake">Размер ставки (₽)</Label>
                  <Input
                    id="stake"
                    type="number"
                    min="0"
                    placeholder="1000"
                    value={formData.stake}
                    onChange={(e) => handleInputChange('stake', e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Тип прогноза</Label>
                  <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="single">Ординар</SelectItem>
                      <SelectItem value="express">Экспресс</SelectItem>
                      <SelectItem value="system">Система</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Категория</Label>
                  <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите спорт" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Футбол">Футбол</SelectItem>
                      <SelectItem value="Баскетбол">Баскетбол</SelectItem>
                      <SelectItem value="Теннис">Теннис</SelectItem>
                      <SelectItem value="Хоккей">Хоккей</SelectItem>
                      <SelectItem value="Волейбол">Волейбол</SelectItem>
                      <SelectItem value="Киберспорт">Киберспорт</SelectItem>
                      <SelectItem value="Прочее">Прочее</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Date and Time */}
          <Card className="card-gradient">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-primary" />
                <span>Дата и время события</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Дата</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => handleInputChange('startDate', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="startTime">Время</Label>
                  <Input
                    id="startTime"
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => handleInputChange('startTime', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional Information */}
          <Card className="card-gradient">
            <CardHeader>
              <CardTitle>Дополнительная информация</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="description">Описание и обоснование</Label>
                <Textarea
                  id="description"
                  placeholder="Опишите почему этот прогноз может сыграть..."
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={4}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="isPublic">Публичный прогноз</Label>
                  <p className="text-sm text-muted-foreground">
                    Сделать прогноз видимым для других пользователей
                  </p>
                </div>
                <Switch
                  id="isPublic"
                  checked={formData.isPublic}
                  onCheckedChange={(checked) => handleInputChange('isPublic', checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex space-x-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => navigate(-1)}
            >
              Отмена
            </Button>
            <Button
              type="submit"
              variant="premium"
              className="flex-1"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                "Добавление..."
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Добавить прогноз
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPredictionForm;