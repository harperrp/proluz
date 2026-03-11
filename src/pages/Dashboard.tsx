import { 
  Lightbulb, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  MapPin,
  TrendingUp,
  Wrench,
  DollarSign,
  Activity,
  Zap,
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PremiumStatsCard } from '@/components/dashboard/PremiumStatsCard';
import { PoleMap } from '@/components/map/PoleMap';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  LineChart,
  Line,
} from 'recharts';

const statusData = [
  { name: 'Funcionando', value: 142, color: 'hsl(142, 72%, 45%)' },
  { name: 'Com Falha', value: 34, color: 'hsl(0, 72%, 51%)' },
];

const monthlyData = [
  { month: 'Jan', denuncias: 45, resolvidas: 42 },
  { month: 'Fev', denuncias: 52, resolvidas: 48 },
  { month: 'Mar', denuncias: 38, resolvidas: 35 },
  { month: 'Abr', denuncias: 65, resolvidas: 58 },
  { month: 'Mai', denuncias: 48, resolvidas: 45 },
  { month: 'Jun', denuncias: 55, resolvidas: 52 },
];

const economyData = [
  { month: 'Jan', economia: 12500 },
  { month: 'Fev', economia: 14200 },
  { month: 'Mar', economia: 11800 },
  { month: 'Abr', economia: 16500 },
  { month: 'Mai', economia: 15300 },
  { month: 'Jun', economia: 18000 },
];

const activityData = [
  { day: 'Seg', atividades: 12 },
  { day: 'Ter', atividades: 18 },
  { day: 'Qua', atividades: 15 },
  { day: 'Qui', atividades: 22 },
  { day: 'Sex', atividades: 20 },
  { day: 'Sáb', atividades: 8 },
  { day: 'Dom', atividades: 4 },
];

const tooltipStyle = {
  backgroundColor: 'hsl(220, 35%, 10%)',
  border: '1px solid hsl(220, 20%, 18%)',
  borderRadius: '8px',
  color: 'hsl(210, 40%, 98%)',
  fontSize: '12px',
};

export default function Dashboard() {
  const { hasPermission } = useAuth();
  
  const canViewFullStats = hasPermission(['ADMIN', 'CITY_HALL_ADMIN']);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Centro de controle — Iluminação pública
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground">
            <Activity className="h-3.5 w-3.5 text-success animate-pulse" />
            <span>Sistema operacional</span>
            <span className="text-border">•</span>
            <span>Última atualização: agora</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          <PremiumStatsCard
            title="Total de Postes"
            value={176}
            icon={<Lightbulb className="h-5 w-5" />}
            variant="default"
            delay={0}
          />
          <PremiumStatsCard
            title="Funcionando"
            value={142}
            description="80.7% do total"
            icon={<CheckCircle className="h-5 w-5" />}
            variant="success"
            trend={{ value: 5, isPositive: true }}
            delay={100}
          />
          <PremiumStatsCard
            title="Com Falha"
            value={34}
            icon={<AlertTriangle className="h-5 w-5" />}
            variant="destructive"
            trend={{ value: 12, isPositive: false }}
            delay={200}
          />
          <PremiumStatsCard
            title="Denúncias Abertas"
            value={12}
            icon={<AlertTriangle className="h-5 w-5" />}
            variant="warning"
            delay={300}
          />
          <PremiumStatsCard
            title="Tempo Médio"
            value={18}
            suffix="h"
            icon={<Clock className="h-5 w-5" />}
            variant="default"
            trend={{ value: 8, isPositive: true }}
            delay={400}
          />
          <PremiumStatsCard
            title="Manutenções/Mês"
            value={47}
            icon={<Wrench className="h-5 w-5" />}
            variant="default"
            trend={{ value: 15, isPositive: true }}
            delay={500}
          />
        </div>

        {/* Economy highlight card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="premium-card p-6 glow-gold relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-accent/20 to-accent/5 border border-accent/20">
                <DollarSign className="h-7 w-7 text-accent" />
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Economia estimada com manutenção preventiva
                </p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-sm text-muted-foreground">R$</span>
                  <span className="text-4xl font-bold tracking-tight text-accent font-mono">18.000</span>
                  <span className="text-sm text-muted-foreground">este mês</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs font-medium text-success bg-success/10 rounded-full px-3 py-1.5">
              <TrendingUp className="h-3.5 w-3.5" />
              +23% vs mês anterior
            </div>
          </div>
        </motion.div>

        {/* Charts Row */}
        {canViewFullStats && (
          <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
            {/* Status Pie */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <Card className="premium-card border-border/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Status dos Postes</CardTitle>
                  <CardDescription className="text-xs">Distribuição atual</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[220px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={statusData}
                          cx="50%"
                          cy="50%"
                          innerRadius={55}
                          outerRadius={85}
                          paddingAngle={4}
                          dataKey="value"
                          stroke="none"
                        >
                          {statusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={tooltipStyle} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex justify-center gap-6 mt-2">
                    {statusData.map((item) => (
                      <div key={item.name} className="flex items-center gap-2 text-xs">
                        <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-muted-foreground">{item.name}</span>
                        <span className="font-semibold">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Monthly Bar Chart */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
              <Card className="premium-card border-border/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Denúncias por Mês</CardTitle>
                  <CardDescription className="text-xs">Recebidas vs resolvidas</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[260px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={monthlyData} barGap={2}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 20%, 15%)" />
                        <XAxis dataKey="month" tick={{ fill: 'hsl(215, 15%, 55%)', fontSize: 11 }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fill: 'hsl(215, 15%, 55%)', fontSize: 11 }} axisLine={false} tickLine={false} />
                        <Tooltip contentStyle={tooltipStyle} />
                        <Bar dataKey="denuncias" name="Denúncias" fill="hsl(38, 92%, 50%)" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="resolvidas" name="Resolvidas" fill="hsl(142, 72%, 45%)" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Economy Area Chart */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
              <Card className="premium-card border-border/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Economia Acumulada</CardTitle>
                  <CardDescription className="text-xs">Manutenção preventiva (R$)</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[260px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={economyData}>
                        <defs>
                          <linearGradient id="economyGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(45, 93%, 53%)" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="hsl(45, 93%, 53%)" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 20%, 15%)" />
                        <XAxis dataKey="month" tick={{ fill: 'hsl(215, 15%, 55%)', fontSize: 11 }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fill: 'hsl(215, 15%, 55%)', fontSize: 11 }} axisLine={false} tickLine={false} />
                        <Tooltip contentStyle={tooltipStyle} formatter={(value: number) => [`R$ ${value.toLocaleString('pt-BR')}`, 'Economia']} />
                        <Area type="monotone" dataKey="economia" stroke="hsl(45, 93%, 53%)" fill="url(#economyGradient)" strokeWidth={2} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        )}

        {/* Map Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
          <Card className="premium-card border-border/50">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2 text-sm font-medium">
                    <MapPin className="h-4 w-4 text-primary" />
                    Mapa Inteligente
                  </CardTitle>
                  <CardDescription className="text-xs">Postes por status em tempo real</CardDescription>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <div className="flex items-center gap-1.5">
                    <div className="h-2 w-2 rounded-full bg-success" />
                    <span className="text-muted-foreground">Funcionando</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="h-2 w-2 rounded-full bg-destructive" />
                    <span className="text-muted-foreground">Com falha</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="h-2 w-2 rounded-full bg-warning" />
                    <span className="text-muted-foreground">Em manutenção</span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <PoleMap />
            </CardContent>
          </Card>
        </motion.div>

        {/* Activity chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
          <Card className="premium-card border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Atividade Semanal</CardTitle>
              <CardDescription className="text-xs">Manutenções e inspeções realizadas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={activityData}>
                    <defs>
                      <linearGradient id="activityGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 20%, 15%)" />
                    <XAxis dataKey="day" tick={{ fill: 'hsl(215, 15%, 55%)', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: 'hsl(215, 15%, 55%)', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Area type="monotone" dataKey="atividades" stroke="hsl(217, 91%, 60%)" fill="url(#activityGradient)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
