import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
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
import DashboardServiceOrders from "./pages/DashboardServiceOrders";
import DashboardTeams from "./pages/DashboardTeams";
import DashboardSettings from "./pages/DashboardSettings";
import NotFound from "./pages/NotFound";
import { ReactNode } from "react";

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  
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
      <Route path="/dashboard/ordens" element={<ProtectedRoute><DashboardServiceOrders /></ProtectedRoute>} />
      <Route path="/dashboard/equipes" element={<ProtectedRoute><DashboardTeams /></ProtectedRoute>} />
      <Route path="/dashboard/configuracoes" element={<ProtectedRoute><DashboardSettings /></ProtectedRoute>} />
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
