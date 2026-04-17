import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Admin from "./pages/Admin";
import AdminLogin from "./pages/AdminLogin";
import AdminSettings from "./pages/AdminSettings";
import AdminLeads from "./pages/AdminLeads";
import BlogPost from "./pages/BlogPost";
import Orcamento from "./pages/Orcamento";
import Obrigado from "./pages/Obrigado";
import PoliticaPrivacidade from "./pages/PoliticaPrivacidade";
import Termos from "./pages/Termos";
import TrackingScripts from "./components/tracking/TrackingScripts";
import CookieBanner from "./components/tracking/CookieBanner";
import PageViewTracker from "./components/tracking/PageViewTracker";
import { useUTMTracking } from "./hooks/useUTMTracking";

const queryClient = new QueryClient();

const AppShell = () => {
  useUTMTracking();
  return (
    <>
      <TrackingScripts />
      <PageViewTracker />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/orcamento" element={<Orcamento />} />
        <Route path="/obrigado" element={<Obrigado />} />
        <Route path="/politica-privacidade" element={<PoliticaPrivacidade />} />
        <Route path="/termos" element={<Termos />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/configuracoes" element={<AdminSettings />} />
        <Route path="/admin/leads" element={<AdminLeads />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <CookieBanner />
    </>
  );
};

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppShell />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
