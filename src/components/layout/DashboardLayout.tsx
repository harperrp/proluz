import { ReactNode, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Lightbulb,
  LayoutDashboard,
  MapPin,
  AlertTriangle,
  Users,
  Building2,
  LogOut,
  Menu,
  X,
  Wrench,
  FileText,
  ChevronRight,
  Cloud,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { UserRole } from '@/types';
import radgovLogo from '@/assets/radgov-logo.png';

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
      <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b border-border/50 bg-card/95 backdrop-blur-xl px-4 lg:hidden">
        <Link to="/dashboard" className="flex items-center gap-2.5">
          <img src={radgovLogo} alt="RAD GOV" className="h-12 w-auto object-contain" />
          <span className="font-bold text-foreground text-sm">IluminaCity</span>
        </Link>
        <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)}>
          {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={cn(
            'fixed inset-y-0 left-0 z-40 w-[272px] transform border-r border-border/30 bg-sidebar transition-transform duration-300 ease-in-out lg:static lg:translate-x-0',
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          )}
        >
          <div className="flex h-full flex-col">
            {/* RAD Branding + Product */}
            <div className="hidden lg:flex items-center justify-center px-5 pt-5 pb-4">
              <img src={radgovLogo} alt="RAD GOV - Plataforma GovTech" className="h-10 w-auto object-contain" />
            </div>

            {/* User info */}
            <div className="border-y border-sidebar-border/50 px-5 py-4 mt-16 lg:mt-0">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/15 ring-2 ring-primary/20">
                  <span className="text-sm font-semibold text-primary">
                    {user?.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-sidebar-foreground truncate">
                    {user?.name}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {roleLabels[user?.role || 'CITIZEN']}
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto px-4 py-5">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-3 px-3">Menu Principal</p>
              <ul className="space-y-1">
                {filteredNavItems.map(item => {
                  const isActive = location.pathname === item.href;
                  return (
                    <li key={item.href}>
                      <Link
                        to={item.href}
                        onClick={() => setSidebarOpen(false)}
                        className={cn(
                          'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                          isActive
                            ? 'bg-primary/15 text-primary shadow-sm'
                            : 'text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground'
                        )}
                      >
                        <span className={cn(
                          'transition-colors',
                          isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-sidebar-foreground'
                        )}>
                          {item.icon}
                        </span>
                        {item.label}
                        {isActive && (
                          <ChevronRight className="ml-auto h-4 w-4 text-primary/60" />
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            {/* Bottom actions */}
            <div className="border-t border-sidebar-border/50 p-4 space-y-1">
              <Link
                to="/"
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground transition-all duration-200"
              >
                <Lightbulb className="h-5 w-5" />
                Página Inicial
              </Link>
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-destructive hover:bg-destructive/10 transition-all duration-200"
              >
                <LogOut className="h-5 w-5" />
                Sair
              </button>
            </div>

            {/* Footer branding */}
            <div className="px-5 py-4 border-t border-sidebar-border/30">
              <div className="flex items-center gap-2 text-[10px] text-muted-foreground/60">
                <Cloud className="h-3 w-3" />
                <span>Infraestrutura em nuvem AWS</span>
              </div>
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
        <main className="flex-1 overflow-y-auto min-h-screen flex flex-col">
          <div className="container py-6 lg:py-8 space-y-4 flex-1 animate-fade-in">
            {children}
          </div>

          {/* Institutional footer */}
          <footer className="border-t border-border/30 px-6 py-4">
            <div className="container flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground/60">
              <p>IluminaCity © {new Date().getFullYear()} · Sistema integrante da Plataforma RAD Tecnologia</p>
              <div className="flex items-center gap-1.5">
                <Cloud className="h-3 w-3" />
                <span>Infraestrutura em nuvem AWS</span>
              </div>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}
