import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { PolesProvider } from "@/contexts/PolesContext";
import { CityHallProvider } from "@/contexts/CityHallContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Complaint from "./pages/Complaint";
import Dashboard from "./pages/Dashboard";
import DashboardMap from "./pages/DashboardMap";
import DashboardComplaints from "./pages/DashboardComplaints";
import DashboardMaintenance from "./pages/DashboardMaintenance";
import DashboardPoles from "./pages/DashboardPoles";
import DashboardUsers from "./pages/DashboardUsers";
import DashboardCityHalls from "./pages/DashboardCityHalls";
import DashboardReports from "./pages/DashboardReports";
import NotFound from "./pages/NotFound";
import { ReactNode } from "react";
import { Loader2 } from "lucide-react";

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<Login />} />
      <Route path="/denuncia" element={<Complaint />} />
      
      {/* Protected Dashboard Routes */}
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/dashboard/mapa" element={<ProtectedRoute><DashboardMap /></ProtectedRoute>} />
      <Route path="/dashboard/denuncias" element={<ProtectedRoute><DashboardComplaints /></ProtectedRoute>} />
      <Route path="/dashboard/manutencao" element={<ProtectedRoute><DashboardMaintenance /></ProtectedRoute>} />
      <Route path="/dashboard/postes" element={<ProtectedRoute><DashboardPoles /></ProtectedRoute>} />
      <Route path="/dashboard/usuarios" element={<ProtectedRoute><DashboardUsers /></ProtectedRoute>} />
      <Route path="/dashboard/prefeituras" element={<ProtectedRoute><DashboardCityHalls /></ProtectedRoute>} />
      <Route path="/dashboard/relatorios" element={<ProtectedRoute><DashboardReports /></ProtectedRoute>} />
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <CityHallProvider>
        <PolesProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <AppRoutes />
            </BrowserRouter>
          </TooltipProvider>
        </PolesProvider>
      </CityHallProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
