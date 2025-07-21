import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Lazy load pages for better performance
const Index = lazy(() => import("./pages/Index"));
const Profile = lazy(() => import("./pages/Profile"));
const AddPrediction = lazy(() => import("./pages/AddPrediction"));
const PredictionDetails = lazy(() => import("./pages/PredictionDetails"));
const Predictions = lazy(() => import("./pages/Predictions"));
const VerificationInfo = lazy(() => import("./pages/VerificationInfo"));
const AdminVerification = lazy(() => import("./pages/AdminVerification"));
const Rankings = lazy(() => import("./pages/Rankings"));
const Subscriptions = lazy(() => import("./pages/Subscriptions"));
const Filters = lazy(() => import("./pages/Filters"));
const Challenges = lazy(() => import("./pages/Challenges"));
const Analytics = lazy(() => import("./pages/Analytics"));
const Messages = lazy(() => import("./pages/Messages"));
const Chat = lazy(() => import("./pages/Chat"));
const NotFound = lazy(() => import("./pages/NotFound"));
const CreateChallenge = lazy(() => import("./pages/CreateChallenge"));
const ChallengeDetails = lazy(() => import("./pages/ChallengeDetails"));
const ChallengeProgress = lazy(() => import("./pages/ChallengeProgress"));
const Settings = lazy(() => import("./pages/Settings"));
const ManageSubscriptions = lazy(() => import("./pages/ManageSubscriptions"));

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

// Loading component
const LoadingSpinner = () => (
  <div className="min-h-screen bg-background telegram-safe-area flex items-center justify-center">
    <div className="text-center space-y-4">
      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
      <p className="text-muted-foreground">Загрузка...</p>
    </div>
  </div>
);

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/add-prediction" element={<AddPrediction />} />
          <Route path="/prediction/:id" element={<PredictionDetails />} />
          <Route path="/predictions" element={<Predictions />} />
          <Route path="/verification-info" element={<VerificationInfo />} />
          <Route path="/admin-verification" element={<AdminVerification />} />
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
      </Suspense>
    </BrowserRouter>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AppRoutes />
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;