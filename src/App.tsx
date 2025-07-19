import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
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
            <Route path="*" element={<NotFound />} />
          </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
