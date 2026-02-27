import { ReactNode, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Lightbulb,
  LayoutDashboard,
  MapPin,
  AlertTriangle,
  Users,
  Building2,
  Settings,
  LogOut,
  Menu,
  X,
  Wrench,
  FileText,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { UserRole } from '@/types';

interface NavItem {
  label: string;
  href: string;
  icon: ReactNode;
  roles: UserRole[];
}

const navItems: NavItem[] = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: <LayoutDashboard className="h-5 w-5" />,
    roles: ['ADMIN', 'CITY_HALL_ADMIN', 'SECRETARY', 'TECHNICAL'],
  },
  {
    label: 'Mapa de Postes',
    href: '/dashboard/mapa',
    icon: <MapPin className="h-5 w-5" />,
    roles: ['ADMIN', 'CITY_HALL_ADMIN', 'SECRETARY', 'TECHNICAL'],
  },
  {
    label: 'Denúncias',
    href: '/dashboard/denuncias',
    icon: <AlertTriangle className="h-5 w-5" />,
    roles: ['ADMIN', 'CITY_HALL_ADMIN', 'SECRETARY'],
  },
  {
    label: 'Manutenção',
    href: '/dashboard/manutencao',
    icon: <Wrench className="h-5 w-5" />,
    roles: ['ADMIN', 'CITY_HALL_ADMIN', 'TECHNICAL'],
  },
  {
    label: 'Postes',
    href: '/dashboard/postes',
    icon: <Lightbulb className="h-5 w-5" />,
    roles: ['ADMIN', 'CITY_HALL_ADMIN', 'SECRETARY', 'TECHNICAL'],
  },
  {
    label: 'Usuários',
    href: '/dashboard/usuarios',
    icon: <Users className="h-5 w-5" />,
    roles: ['ADMIN', 'CITY_HALL_ADMIN'],
  },
  {
    label: 'Prefeituras',
    href: '/dashboard/prefeituras',
    icon: <Building2 className="h-5 w-5" />,
    roles: ['ADMIN'],
  },
  {
    label: 'Relatórios',
    href: '/dashboard/relatorios',
    icon: <FileText className="h-5 w-5" />,
    roles: ['ADMIN', 'CITY_HALL_ADMIN'],
  },
];

const CURRENT_MUNICIPALITY = 'Vargem Grande do Rio Pardo - MG';

const roleLabels: Record<UserRole, string> = {
  ADMIN: 'Administrador Geral',
  CITY_HALL_ADMIN: 'Administrador Municipal',
  SECRETARY: 'Secretário',
  TECHNICAL: 'Técnico',
  CITIZEN: 'Cidadão',
};

export function DashboardLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout, hasPermission } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const filteredNavItems = navItems.filter(item => hasPermission(item.roles));

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile header */}
      <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b bg-card px-4 lg:hidden">
        <Link to="/dashboard" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Lightbulb className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-semibold">IluminaCity</span>
        </Link>
        <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)}>
          {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={cn(
            'fixed inset-y-0 left-0 z-40 w-64 transform border-r bg-sidebar transition-transform duration-200 ease-in-out lg:static lg:translate-x-0',
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          )}
        >
          <div className="flex h-full flex-col">
            {/* Logo */}
            <div className="hidden lg:flex h-16 items-center gap-2 border-b border-sidebar-border px-6">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sidebar-primary">
                <Lightbulb className="h-5 w-5 text-sidebar-primary-foreground" />
              </div>
              <div>
                <span className="font-semibold text-sidebar-foreground">IluminaCity</span>
              </div>
            </div>

            {/* User info */}
            <div className="border-b border-sidebar-border p-4 mt-16 lg:mt-0">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sidebar-accent">
                  <span className="text-sm font-medium text-sidebar-foreground">
                    {user?.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-sidebar-foreground truncate">
                    {user?.name}
                  </p>
                  <p className="text-xs text-sidebar-foreground/60 truncate">
                    {roleLabels[user?.role || 'CITIZEN']}
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto p-4">
              <ul className="space-y-1">
                {filteredNavItems.map(item => (
                  <li key={item.href}>
                    <Link
                      to={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={cn(
                        'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                        location.pathname === item.href
                          ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                          : 'text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground'
                      )}
                    >
                      {item.icon}
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Bottom actions */}
            <div className="border-t border-sidebar-border p-4 space-y-1">
              <Link
                to="/"
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors"
              >
                <Lightbulb className="h-5 w-5" />
                Página Inicial
              </Link>
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
              >
                <LogOut className="h-5 w-5" />
                Sair
              </button>
            </div>
          </div>
        </aside>

        {/* Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-background/80 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main content */}
        <main className="flex-1 overflow-y-auto min-h-screen">
          <div className="container py-6 lg:py-8 space-y-4">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
