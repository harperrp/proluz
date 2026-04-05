import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
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
import { UserRole } from "@/types";

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <>{children}</>;
}
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
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
import { UserRole } from "@/types";

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <>{children}</>;
}

function RoleProtectedRoute({ children, roles }: { children: ReactNode; roles: UserRole[] }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!roles.includes(user.role)) {
    return <Navigate to={user.role === "CITIZEN" ? "/denuncia" : "/dashboard"} replace />;
  }

  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<Login />} />
      <Route path="/denuncia" element={<Complaint />} />

      <Route path="/dashboard" element={<ProtectedRoute><RoleProtectedRoute roles={['ADMIN', 'CITY_HALL_ADMIN', 'SECRETARY', 'TECHNICAL']}><Dashboard /></RoleProtectedRoute></ProtectedRoute>} />
      <Route path="/dashboard/mapa" element={<ProtectedRoute><RoleProtectedRoute roles={['ADMIN', 'CITY_HALL_ADMIN', 'SECRETARY', 'TECHNICAL']}><DashboardMap /></RoleProtectedRoute></ProtectedRoute>} />
      <Route path="/dashboard/denuncias" element={<ProtectedRoute><RoleProtectedRoute roles={['ADMIN', 'CITY_HALL_ADMIN', 'SECRETARY']}><DashboardComplaints /></RoleProtectedRoute></ProtectedRoute>} />
      <Route path="/dashboard/manutencao" element={<ProtectedRoute><RoleProtectedRoute roles={['ADMIN', 'CITY_HALL_ADMIN', 'TECHNICAL']}><DashboardMaintenance /></RoleProtectedRoute></ProtectedRoute>} />
      <Route path="/dashboard/postes" element={<ProtectedRoute><RoleProtectedRoute roles={['ADMIN', 'CITY_HALL_ADMIN', 'SECRETARY', 'TECHNICAL']}><DashboardPoles /></RoleProtectedRoute></ProtectedRoute>} />
      <Route path="/dashboard/usuarios" element={<ProtectedRoute><RoleProtectedRoute roles={['ADMIN', 'CITY_HALL_ADMIN']}><DashboardUsers /></RoleProtectedRoute></ProtectedRoute>} />
      <Route path="/dashboard/prefeituras" element={<ProtectedRoute><RoleProtectedRoute roles={['ADMIN']}><DashboardCityHalls /></RoleProtectedRoute></ProtectedRoute>} />
      <Route path="/dashboard/relatorios" element={<ProtectedRoute><RoleProtectedRoute roles={['ADMIN', 'CITY_HALL_ADMIN']}><DashboardReports /></RoleProtectedRoute></ProtectedRoute>} />

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
function RoleProtectedRoute({ children, roles }: { children: ReactNode; roles: UserRole[] }) {
  const { user } = useAuth();

  if (!user || !roles.includes(user.role)) {
 codex/finalize-public-report-and-access-separation-v9qc6r
    return <Navigate to={user?.role === 'CITIZEN' ? '/denuncia' : '/'} replace />;

    return <Navigate to="/dashboard" replace />;
 main
  }

  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<Login />} />
      <Route path="/denuncia" element={<Complaint />} />

      <Route path="/dashboard" element={<ProtectedRoute><RoleProtectedRoute roles={['ADMIN', 'CITY_HALL_ADMIN', 'SECRETARY', 'TECHNICAL']}><Dashboard /></RoleProtectedRoute></ProtectedRoute>} />
      <Route path="/dashboard/mapa" element={<ProtectedRoute><RoleProtectedRoute roles={['ADMIN', 'CITY_HALL_ADMIN', 'SECRETARY', 'TECHNICAL']}><DashboardMap /></RoleProtectedRoute></ProtectedRoute>} />
      <Route path="/dashboard/denuncias" element={<ProtectedRoute><RoleProtectedRoute roles={['ADMIN', 'CITY_HALL_ADMIN', 'SECRETARY']}><DashboardComplaints /></RoleProtectedRoute></ProtectedRoute>} />
      <Route path="/dashboard/manutencao" element={<ProtectedRoute><RoleProtectedRoute roles={['ADMIN', 'CITY_HALL_ADMIN', 'TECHNICAL']}><DashboardMaintenance /></RoleProtectedRoute></ProtectedRoute>} />
      <Route path="/dashboard/postes" element={<ProtectedRoute><RoleProtectedRoute roles={['ADMIN', 'CITY_HALL_ADMIN', 'SECRETARY', 'TECHNICAL']}><DashboardPoles /></RoleProtectedRoute></ProtectedRoute>} />
      <Route path="/dashboard/usuarios" element={<ProtectedRoute><RoleProtectedRoute roles={['ADMIN', 'CITY_HALL_ADMIN']}><DashboardUsers /></RoleProtectedRoute></ProtectedRoute>} />
      <Route path="/dashboard/prefeituras" element={<ProtectedRoute><RoleProtectedRoute roles={['ADMIN']}><DashboardCityHalls /></RoleProtectedRoute></ProtectedRoute>} />
      <Route path="/dashboard/relatorios" element={<ProtectedRoute><RoleProtectedRoute roles={['ADMIN', 'CITY_HALL_ADMIN']}><DashboardReports /></RoleProtectedRoute></ProtectedRoute>} />

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
