import { useState } from "react";
import { ArrowLeft, Trophy, Calendar, DollarSign, Users, Target, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const CreateChallenge = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "",
    category: "",
    prize: "",
    entryFee: "",
    maxParticipants: "",
    duration: "",
    difficulty: "",
    minCoeff: "",
    stepsCount: "",
    isPrivate: false,
    rules: ""
  });

  const challengeTypes = [
    { value: "ladder", label: "Лесенка", desc: "Поэтапное увеличение банка" },
    { value: "express", label: "Экспресс марафон", desc: "Серия экспрессов подряд" },
    { value: "weekly", label: "Недельный турнир", desc: "Соревнование на неделю" },
    { value: "custom", label: "Кастомный", desc: "Собственные правила" }
  ];

  const categories = [
    "Футбол", "Теннис", "Баскетбол", "Хоккей", "Киберспорт", "Микс"
  ];

  const difficulties = [
    { value: "easy", label: "Легкий", color: "text-green-500" },
    { value: "medium", label: "Средний", color: "text-yellow-500" },
    { value: "hard", label: "Сложный", color: "text-red-500" }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.type || !formData.prize) {
      toast({
        title: "Ошибка",
        description: "Заполните обязательные поля",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Челлендж создан!",
      description: "Ваш челлендж успешно создан и отправлен на модерацию",
    });
    
    navigate("/challenges");
  };

  return (
    <div className="min-h-screen bg-background telegram-safe-area pb-20">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="px-3 sm:px-4 py-3 sm:py-4 max-w-screen-lg mx-auto">
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="text-lg sm:text-xl font-bold">Создать челлендж</h1>
          </div>
        </div>
      </header>

      <div className="px-3 sm:px-4 py-4 sm:py-6 max-w-screen-lg mx-auto space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <Card className="card-gradient">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="w-5 h-5 text-primary" />
                Основная информация
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Название челленджа *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="Например: Футбольная лесенка"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="description">Описание</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Краткое описание челленджа"
                  className="mt-1"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label>Тип челленджа *</Label>
                  <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value})}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Выберите тип" />
                    </SelectTrigger>
                    <SelectContent>
                      {challengeTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          <div>
                            <div className="font-medium">{type.label}</div>
                            <div className="text-xs text-muted-foreground">{type.desc}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Категория</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Выберите категорию" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Prize & Settings */}
          <Card className="card-gradient">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-primary" />
                Призы и настройки
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="prize">Призовой фонд *</Label>
                  <div className="relative mt-1">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="prize"
                      type="number"
                      value={formData.prize}
                      onChange={(e) => setFormData({...formData, prize: e.target.value})}
                      placeholder="1000"
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="entryFee">Взнос за участие</Label>
                  <div className="relative mt-1">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="entryFee"
                      type="number"
                      value={formData.entryFee}
                      onChange={(e) => setFormData({...formData, entryFee: e.target.value})}
                      placeholder="25"
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="maxParticipants">Макс. участников</Label>
                  <div className="relative mt-1">
                    <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="maxParticipants"
                      type="number"
                      value={formData.maxParticipants}
                      onChange={(e) => setFormData({...formData, maxParticipants: e.target.value})}
                      placeholder="100"
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="duration">Длительность (часы)</Label>
                  <div className="relative mt-1">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="duration"
                      type="number"
                      value={formData.duration}
                      onChange={(e) => setFormData({...formData, duration: e.target.value})}
                      placeholder="24"
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>

              <div>
                <Label>Сложность</Label>
                <Select value={formData.difficulty} onValueChange={(value) => setFormData({...formData, difficulty: value})}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Выберите сложность" />
                  </SelectTrigger>
                  <SelectContent>
                    {difficulties.map((diff) => (
                      <SelectItem key={diff.value} value={diff.value}>
                        <Badge variant="outline" className={`${diff.color} border-current`}>
                          {diff.label}
                        </Badge>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Challenge Rules */}
          {formData.type && (
            <Card className="card-gradient">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-primary" />
                  Правила челленджа
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {(formData.type === "ladder" || formData.type === "express") && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="minCoeff">Мин. коэффициент</Label>
                      <Input
                        id="minCoeff"
                        type="number"
                        step="0.1"
                        value={formData.minCoeff}
                        onChange={(e) => setFormData({...formData, minCoeff: e.target.value})}
                        placeholder="1.5"
                        className="mt-1"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="stepsCount">Количество шагов</Label>
                      <Input
                        id="stepsCount"
                        type="number"
                        value={formData.stepsCount}
                        onChange={(e) => setFormData({...formData, stepsCount: e.target.value})}
                        placeholder="10"
                        className="mt-1"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <Label htmlFor="rules">Дополнительные правила</Label>
                  <Textarea
                    id="rules"
                    value={formData.rules}
                    onChange={(e) => setFormData({...formData, rules: e.target.value})}
                    placeholder="Опишите особые правила и условия челленджа"
                    className="mt-1"
                    rows={4}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="isPrivate">Приватный челлендж</Label>
                    <p className="text-sm text-muted-foreground">Участие только по приглашениям</p>
                  </div>
                  <Switch
                    id="isPrivate"
                    checked={formData.isPrivate}
                    onCheckedChange={(checked) => setFormData({...formData, isPrivate: checked})}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Submit */}
          <div className="flex gap-3">
            <Button type="button" variant="outline" className="flex-1" onClick={() => navigate(-1)}>
              Отмена
            </Button>
            <Button type="submit" variant="premium" className="flex-1">
              Создать челлендж
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateChallenge;