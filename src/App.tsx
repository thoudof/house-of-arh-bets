
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useTelegram } from "@/hooks/useTelegram";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import Index from "./pages/Index";
import Profile from "./pages/Profile";
import AddPrediction from "./pages/AddPrediction";
import PredictionDetails from "./pages/PredictionDetails";
import Rankings from "./pages/Rankings";
import Subscriptions from "./pages/Subscriptions";
import Filters from "./pages/Filters";
import Challenges from "./pages/Challenges";
import Analytics from "./pages/Analytics";
import Messages from "./pages/Messages";
import Chat from "./pages/Chat";
import NotFound from "./pages/NotFound";
import CreateChallenge from "./pages/CreateChallenge";
import ChallengeDetails from "./pages/ChallengeDetails";
import ChallengeProgress from "./pages/ChallengeProgress";
import Settings from "./pages/Settings";
import ManageSubscriptions from "./pages/ManageSubscriptions";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 30 * 1000,
      gcTime: 2 * 60 * 1000,
    },
  },
});

const AppContent = () => {
  const { isReady, webApp } = useTelegram();
  const { loading } = useAuth();

  useEffect(() => {
    if (webApp?.themeParams) {
      const root = document.documentElement;
      const theme = webApp.themeParams;
      
      if (theme.bg_color) {
        root.style.setProperty('--tg-bg-color', theme.bg_color);
      }
      if (theme.text_color) {
        root.style.setProperty('--tg-text-color', theme.text_color);
      }
      if (theme.button_color) {
        root.style.setProperty('--tg-button-color', theme.button_color);
      }
      if (theme.button_text_color) {
        root.style.setProperty('--tg-button-text-color', theme.button_text_color);
      }
    }
  }, [webApp]);

  if (!isReady || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">
            {!isReady ? 'Инициализация Telegram...' : 'Авторизация...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/add-prediction" element={<AddPrediction />} />
        <Route path="/prediction/:id" element={<PredictionDetails />} />
        <Route path="/rankings" element={<Rankings />} />
        <Route path="/subscriptions" element={<Subscriptions />} />
        <Route path="/filters" element={<Filters />} />
        <Route path="/challenges" element={<Challenges />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/chat/:userId" element={<Chat />} />
        <Route path="/create-challenge" element={<CreateChallenge />} />
        <Route path="/challenge/:id" element={<ChallengeDetails />} />
        <Route path="/challenge-progress/:id" element={<ChallengeProgress />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/manage-subscriptions" element={<ManageSubscriptions />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AppContent />
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
