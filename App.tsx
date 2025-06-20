import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import Landing from "@/pages/landing";
import Home from "@/pages/home";
import Onboarding from "@/pages/onboarding";
import Routines from "@/pages/routines";
import AICoach from "@/pages/ai-coach";
import Progress from "@/pages/progress";
import Profile from "@/pages/profile";
import NotFound from "@/pages/not-found";
import BottomNavigation from "@/components/bottom-navigation";

function Router() {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <div className="mobile-container flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Switch>
        <Route path="/" component={Landing} />
        <Route component={NotFound} />
      </Switch>
    );
  }

  // Check if user needs to complete onboarding
  if (user && !user.onboardingCompleted) {
    return (
      <Switch>
        <Route path="/onboarding" component={Onboarding} />
        <Route path="*">
          {() => {
            window.location.href = "/onboarding";
            return null;
          }}
        </Route>
      </Switch>
    );
  }

  return (
    <div className="mobile-container">
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/routines" component={Routines} />
        <Route path="/ai-coach" component={AICoach} />
        <Route path="/progress" component={Progress} />
        <Route path="/profile" component={Profile} />
        <Route component={NotFound} />
      </Switch>
      <BottomNavigation />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
