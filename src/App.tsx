import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import AgentMonitor from "./pages/AgentMonitor";
import CredibilityScoring from "./pages/CredibilityScoring";
import CrisisAlerts from "./pages/CrisisAlerts";
import MediaForensics from "./pages/MediaForensics";
import CategoryNews from "./pages/CategoryNews";
import { ChatBot } from "./components/ChatBot";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* App Routes - Currently public, can be protected later */}
            <Route path="/agent-monitor" element={<AgentMonitor />} />
            <Route path="/credibility" element={<CredibilityScoring />} />
            <Route path="/crisis-alerts" element={<CrisisAlerts />} />
            <Route path="/media-forensics" element={<MediaForensics />} />
            <Route path="/category/:category" element={<CategoryNews />} />

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <ChatBot />
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
// Deployment trigger - Wed Nov 26 01:21:40 IST 2025
