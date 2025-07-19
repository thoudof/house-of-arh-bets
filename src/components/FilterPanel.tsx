import { useState } from "react";
import { Filter, X, Calendar, Target, TrendingUp, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

interface FilterPanelProps {
  onFiltersChange: (filters: any) => void;
  activeFilters: any;
}

const FilterPanel = ({ onFiltersChange, activeFilters }: FilterPanelProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState({
    category: activeFilters.category || "",
    type: activeFilters.type || "",
    status: activeFilters.status || "",
    minCoefficient: activeFilters.minCoefficient || [1.5],
    maxCoefficient: activeFilters.maxCoefficient || [5.0],
    minROI: activeFilters.minROI || [0],
    analyst: activeFilters.analyst || "",
    timeRange: activeFilters.timeRange || "all",
    ...activeFilters
  });

  const categories = [
    { value: "football", label: "Футбол" },
    { value: "basketball", label: "Баскетбол" },
    { value: "tennis", label: "Теннис" },
    { value: "hockey", label: "Хоккей" },
    { value: "esports", label: "Киберспорт" }
  ];

  const types = [
    { value: "single", label: "Ординар" },
    { value: "express", label: "Экспресс" },
    { value: "system", label: "Система" }
  ];

  const statuses = [
    { value: "pending", label: "Ожидание" },
    { value: "win", label: "Выигрыш" },
    { value: "loss", label: "Проигрыш" },
    { value: "returned", label: "Возврат" }
  ];

  const analysts = [
    { value: "ProAnalyst", label: "ProAnalyst" },
    { value: "BetMaster", label: "BetMaster" },
    { value: "SportGuru", label: "SportGuru" },
    { value: "FootballKing", label: "FootballKing" }
  ];

  const timeRanges = [
    { value: "today", label: "Сегодня" },
    { value: "week", label: "Неделя" },
    { value: "month", label: "Месяц" },
    { value: "quarter", label: "Квартал" },
    { value: "all", label: "Все время" }
  ];

  const updateFilter = (key: string, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
  };

  const applyFilters = () => {
    onFiltersChange(filters);
    setIsOpen(false);
  };

  const clearFilters = () => {
    const emptyFilters = {
      category: "",
      type: "",
      status: "",
      minCoefficient: [1.5],
      maxCoefficient: [5.0],
      minROI: [0],
      analyst: "",
      timeRange: "all"
    };
    setFilters(emptyFilters);
    onFiltersChange(emptyFilters);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.category) count++;
    if (filters.type) count++;
    if (filters.status) count++;
    if (filters.analyst) count++;
    if (filters.timeRange !== "all") count++;
    if (filters.minCoefficient[0] !== 1.5 || filters.maxCoefficient[0] !== 5.0) count++;
    if (filters.minROI[0] !== 0) count++;
    return count;
  };

  const activeFiltersCount = getActiveFiltersCount();

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="relative">
          <Filter className="w-4 h-4 mr-2" />
          Фильтры
          {activeFiltersCount > 0 && (
            <Badge className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs h-5 w-5 rounded-full p-0 flex items-center justify-center">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center space-x-2">
            <Filter className="w-5 h-5" />
            <span>Фильтры прогнозов</span>
          </SheetTitle>
          <SheetDescription>
            Настройте фильтры для поиска подходящих прогнозов
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 mt-6">
          {/* Category Filter */}
          <div className="space-y-3">
            <h4 className="font-medium flex items-center space-x-2">
              <Target className="w-4 h-4" />
              <span>Категория</span>
            </h4>
            <Select value={filters.category} onValueChange={(value) => updateFilter("category", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Выберите категорию" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Все категории</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Separator />

          {/* Type Filter */}
          <div className="space-y-3">
            <h4 className="font-medium">Тип ставки</h4>
            <Select value={filters.type} onValueChange={(value) => updateFilter("type", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Выберите тип" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Все типы</SelectItem>
                {types.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Separator />

          {/* Status Filter */}
          <div className="space-y-3">
            <h4 className="font-medium">Статус</h4>
            <Select value={filters.status} onValueChange={(value) => updateFilter("status", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Выберите статус" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Все статусы</SelectItem>
                {statuses.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Separator />

          {/* Coefficient Range */}
          <div className="space-y-3">
            <h4 className="font-medium flex items-center space-x-2">
              <TrendingUp className="w-4 h-4" />
              <span>Диапазон коэффициентов</span>
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>От {filters.minCoefficient[0]}</span>
                <span>До {filters.maxCoefficient[0]}</span>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-muted-foreground">Минимум</label>
                  <Slider
                    value={filters.minCoefficient}
                    onValueChange={(value) => updateFilter("minCoefficient", value)}
                    min={1.0}
                    max={3.0}
                    step={0.1}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Максимум</label>
                  <Slider
                    value={filters.maxCoefficient}
                    onValueChange={(value) => updateFilter("maxCoefficient", value)}
                    min={2.0}
                    max={10.0}
                    step={0.1}
                    className="mt-1"
                  />
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Analyst Filter */}
          <div className="space-y-3">
            <h4 className="font-medium flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span>Аналитик</span>
            </h4>
            <Select value={filters.analyst} onValueChange={(value) => updateFilter("analyst", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Выберите аналитика" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Все аналитики</SelectItem>
                {analysts.map((analyst) => (
                  <SelectItem key={analyst.value} value={analyst.value}>
                    {analyst.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Separator />

          {/* Time Range */}
          <div className="space-y-3">
            <h4 className="font-medium flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span>Период</span>
            </h4>
            <Select value={filters.timeRange} onValueChange={(value) => updateFilter("timeRange", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Выберите период" />
              </SelectTrigger>
              <SelectContent>
                {timeRanges.map((range) => (
                  <SelectItem key={range.value} value={range.value}>
                    {range.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Separator />

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button onClick={applyFilters} className="w-full">
              Применить фильтры
            </Button>
            <Button variant="outline" onClick={clearFilters} className="w-full">
              <X className="w-4 h-4 mr-2" />
              Сбросить
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default FilterPanel;