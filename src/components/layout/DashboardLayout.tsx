import { ReactNode, useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  MapPin,
  AlertTriangle,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  Wrench,
  FileText,
  ChevronLeft,
  Zap,
  Bell,
  Search,
  UserCircle,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { UserRole } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';

interface NavItem {
  label: string;
  href: string;
  icon: ReactNode;
  roles: UserRole[];
  badge?: string;
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
    badge: '12',
  },
  {
    label: 'Ordens de Serviço',
    href: '/dashboard/ordens',
    icon: <Wrench className="h-5 w-5" />,
    roles: ['ADMIN', 'CITY_HALL_ADMIN', 'TECHNICAL'],
  },
  {
    label: 'Equipes',
    href: '/dashboard/equipes',
    icon: <Users className="h-5 w-5" />,
    roles: ['ADMIN', 'CITY_HALL_ADMIN'],
  },
  {
    label: 'Relatórios',
    href: '/dashboard/relatorios',
    icon: <FileText className="h-5 w-5" />,
    roles: ['ADMIN', 'CITY_HALL_ADMIN'],
  },
  {
    label: 'Configurações',
    href: '/dashboard/configuracoes',
    icon: <Settings className="h-5 w-5" />,
    roles: ['ADMIN', 'CITY_HALL_ADMIN'],
  },
];

const roleLabels: Record<UserRole, string> = {
  ADMIN: 'Administrador',
  CITY_HALL_ADMIN: 'Admin. Municipal',
  SECRETARY: 'Secretário',
  TECHNICAL: 'Técnico',
  CITIZEN: 'Cidadão',
};

export function DashboardLayout({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout, hasPermission } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const filteredNavItems = navItems.filter(item => hasPermission(item.roles));

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          'hidden lg:flex flex-col fixed inset-y-0 left-0 z-40 border-r border-border/50 bg-sidebar transition-all duration-300',
          collapsed ? 'w-[72px]' : 'w-[260px]'
        )}
      >
        {/* Logo */}
        <div className="h-16 flex items-center px-4 border-b border-sidebar-border gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary glow-blue">
            <Zap className="h-5 w-5 text-primary-foreground" />
          </div>
          {!collapsed && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="overflow-hidden">
              <span className="font-bold text-sidebar-foreground text-sm">IluminaCity</span>
              <p className="text-[10px] text-muted-foreground leading-tight">by RAD Tecnologia</p>
            </motion.div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={cn(
              'ml-auto p-1.5 rounded-md hover:bg-sidebar-accent text-muted-foreground transition-colors',
              collapsed && 'ml-0'
            )}
          >
            <ChevronLeft className={cn('h-4 w-4 transition-transform', collapsed && 'rotate-180')} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          <ul className="space-y-1">
            {filteredNavItems.map(item => {
              const isActive = location.pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    to={item.href}
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 group relative',
                      isActive
                        ? 'bg-primary/10 text-primary'
                        : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground'
                    )}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeNav"
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 rounded-r-full bg-primary"
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      />
                    )}
                    <span className="shrink-0">{item.icon}</span>
                    {!collapsed && (
                      <span className="truncate">{item.label}</span>
                    )}
                    {!collapsed && item.badge && (
                      <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-primary/20 text-primary text-[10px] font-semibold px-1.5">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User footer */}
        <div className="border-t border-sidebar-border p-3">
          <div className={cn('flex items-center gap-3 rounded-lg px-2 py-2', collapsed && 'justify-center')}>
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20">
              <span className="text-xs font-semibold text-primary">
                {user?.name?.charAt(0).toUpperCase()}
              </span>
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-sidebar-foreground truncate">{user?.name}</p>
                <p className="text-[11px] text-muted-foreground truncate">{roleLabels[user?.role || 'CITIZEN']}</p>
              </div>
            )}
            {!collapsed && (
              <button
                onClick={handleLogout}
                className="p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                title="Sair"
              >
                <LogOut className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Mobile header */}
      <header className="fixed top-0 left-0 right-0 z-50 flex h-14 items-center justify-between border-b border-border/50 bg-background/80 backdrop-blur-xl px-4 lg:hidden">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Zap className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-bold text-sm">IluminaCity</span>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setMobileOpen(!mobileOpen)} className="h-9 w-9">
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </header>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed inset-y-0 left-0 z-50 w-[280px] border-r border-border/50 bg-sidebar lg:hidden"
            >
              <div className="flex h-14 items-center gap-2 px-4 border-b border-sidebar-border">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                  <Zap className="h-4 w-4 text-primary-foreground" />
                </div>
                <div>
                  <span className="font-bold text-sidebar-foreground text-sm">IluminaCity</span>
                  <p className="text-[10px] text-muted-foreground">by RAD Tecnologia</p>
                </div>
              </div>

              <nav className="flex-1 overflow-y-auto py-4 px-3">
                <ul className="space-y-1">
                  {filteredNavItems.map(item => {
                    const isActive = location.pathname === item.href;
                    return (
                      <li key={item.href}>
                        <Link
                          to={item.href}
                          onClick={() => setMobileOpen(false)}
                          className={cn(
                            'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                            isActive
                              ? 'bg-primary/10 text-primary'
                              : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground'
                          )}
                        >
                          {item.icon}
                          {item.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </nav>

              <div className="border-t border-sidebar-border p-3">
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
                >
                  <LogOut className="h-5 w-5" />
                  Sair
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <main
        className={cn(
          'flex-1 min-h-screen transition-all duration-300',
          collapsed ? 'lg:ml-[72px]' : 'lg:ml-[260px]'
        )}
      >
        {/* Top bar */}
        <div className="sticky top-0 z-30 hidden lg:flex h-14 items-center justify-between border-b border-border/50 bg-background/80 backdrop-blur-xl px-6">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar postes, denúncias..."
                className="h-9 w-[280px] rounded-lg bg-muted/50 border-0 pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="relative p-2 rounded-lg hover:bg-muted/50 text-muted-foreground transition-colors">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary animate-glow-pulse" />
            </button>
            <div className="h-6 w-px bg-border mx-1" />
            <div className="flex items-center gap-2 px-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20">
                <span className="text-xs font-semibold text-primary">
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="hidden xl:block">
                <p className="text-sm font-medium leading-tight">{user?.name}</p>
                <p className="text-[11px] text-muted-foreground">{roleLabels[user?.role || 'CITIZEN']}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 lg:p-6 pt-16 lg:pt-6">
          {children}
        </div>
      </main>
    </div>
  );
}
