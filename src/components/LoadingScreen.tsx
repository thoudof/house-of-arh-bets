import React from 'react';

// Optimized Loading component with better UX
export const LoadingScreen = ({ message = "Загрузка..." }: { message?: string }) => {
  return (
    <div className="min-h-screen bg-background telegram-safe-area flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto"></div>
          <div className="absolute inset-0 w-8 h-8 border-2 border-primary-glow/30 border-t-primary-glow rounded-full animate-spin animate-reverse mx-auto mt-2 ml-2"></div>
        </div>
        <div className="space-y-2">
          <p className="text-foreground font-medium">{message}</p>
          <p className="text-xs text-muted-foreground">Подготавливаем интерфейс...</p>
        </div>
      </div>
    </div>
  );
};

// Skeleton component for cards
export const CardSkeleton = () => (
  <div className="animate-pulse">
    <div className="bg-muted/20 rounded-lg p-4 space-y-3">
      <div className="flex items-center space-x-2">
        <div className="h-4 bg-muted/40 rounded w-16"></div>
        <div className="h-4 bg-muted/40 rounded w-20"></div>
      </div>
      <div className="h-6 bg-muted/40 rounded w-3/4"></div>
      <div className="space-y-2">
        <div className="h-4 bg-muted/40 rounded w-full"></div>
        <div className="h-4 bg-muted/40 rounded w-2/3"></div>
      </div>
      <div className="flex justify-between items-center">
        <div className="h-4 bg-muted/40 rounded w-24"></div>
        <div className="h-8 bg-muted/40 rounded w-16"></div>
      </div>
    </div>
  </div>
);

export default LoadingScreen;