import { useState } from "react";
import { ArrowLeft, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import PredictionCard from "@/components/PredictionCard";
import FilterPanel from "@/components/FilterPanel";
import { usePredictions } from "@/hooks/api/usePredictions";
import type { Prediction } from "@/types";

const Filters = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({});

  const { data: predictions, isLoading } = usePredictions();

  const filteredPredictions = (predictions || []).filter(prediction => {
    // Apply search filter
    if (searchQuery && !prediction.event.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !prediction.profile?.first_name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Apply other filters
    // This is where you would implement the actual filtering logic based on the filters object
    return true;
  });

  return (
    <div className="min-h-screen bg-background telegram-safe-area">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="text-xl font-bold">Поиск прогнозов</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Search and Filter */}
        <div className="flex space-x-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Поиск по событию или аналитику..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <FilterPanel onFiltersChange={setFilters} activeFilters={filters} />
        </div>

        {/* Results */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">
              Найдено прогнозов: {filteredPredictions.length}
            </h2>
          </div>

          {isLoading ? (
            <div className="text-center py-12">Загрузка прогнозов...</div>
          ) : filteredPredictions.length > 0 ? (
            <div className="space-y-4">
              {filteredPredictions.map((prediction) => (
                <PredictionCard
                  key={prediction.id}
                  prediction={prediction}
                  onClick={() => navigate(`/prediction/${prediction.id}`)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Search className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">Ничего не найдено</h3>
              <p className="text-muted-foreground">
                Попробуйте изменить параметры поиска или фильтры
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Filters;