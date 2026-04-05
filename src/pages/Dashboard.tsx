import { useEffect, useMemo, useState } from 'react';
import { Lightbulb, AlertTriangle, CheckCircle, Clock, MapPin, FileText, Activity } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { PoleMap } from '@/components/map/PoleMap';
import { usePoles } from '@/contexts/PolesContext';
import { useCityHall } from '@/contexts/CityHallContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { dbSelect } from '@/lib/supabase';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
} from 'recharts';

interface ComplaintRow {
  id: string;
  status: 'PENDENTE' | 'APROVADA' | 'REJEITADA';
  created_at: string;
}

interface MaintenanceRow {
  id: string;
  status: 'ABERTA' | 'EM_EXECUCAO' | 'CONCLUIDA';
  opened_at: string;
  completed_at: string | null;
}

const monthFmt = new Intl.DateTimeFormat('pt-BR', { month: 'short' });

export default function Dashboard() {
  const { poles } = usePoles();
  const { activeCityHall } = useCityHall();
  const [complaints, setComplaints] = useState<ComplaintRow[]>([]);
  const [maintenance, setMaintenance] = useState<MaintenanceRow[]>([]);

  useEffect(() => {
    void (async () => {
      try {
        const [c, m] = await Promise.all([
          dbSelect<ComplaintRow>('complaints?select=id,status,created_at'),
          dbSelect<MaintenanceRow>('maintenance_orders?select=id,status,opened_at,completed_at'),
        ]);
        setComplaints(c);
        setMaintenance(m);
      } catch {
        setComplaints([]);
        setMaintenance([]);
      }
    })();
  }, []);

  const cityPoles = activeCityHall ? poles.filter((p) => p.cityHallId === activeCityHall.id) : poles;
  const working = cityPoles.filter((p) => p.status === 'FUNCIONANDO').length;
  const broken = cityPoles.filter((p) => p.status === 'QUEIMADO').length;
  const pendingComplaints = complaints.filter((c) => c.status === 'PENDENTE').length;
  const openMaintenance = maintenance.filter((m) => m.status !== 'CONCLUIDA').length;

  const avgResolutionHours = useMemo(() => {
    const withResolution = maintenance.filter((m) => m.completed_at);
    if (withResolution.length === 0) return 0;
    const total = withResolution.reduce((acc, item) => {
      const opened = new Date(item.opened_at).getTime();
      const completed = new Date(item.completed_at as string).getTime();
      return acc + Math.max(1, Math.round((completed - opened) / (1000 * 60 * 60)));
    }, 0);
    return Math.round(total / withResolution.length);
  }, [maintenance]);

  const complaintPieData = [
    { name: 'Pendentes', value: complaints.filter((c) => c.status === 'PENDENTE').length, color: '#f59e0b' },
    { name: 'Aprovadas', value: complaints.filter((c) => c.status === 'APROVADA').length, color: '#22c55e' },
    { name: 'Rejeitadas', value: complaints.filter((c) => c.status === 'REJEITADA').length, color: '#ef4444' },
  ].filter((d) => d.value > 0);

  const poleBarData = [
    { name: 'Funcionando', value: working, fill: 'hsl(142 72% 40%)' },
    { name: 'Queimados', value: broken, fill: 'hsl(0 72% 51%)' },
  ];

  const monthlyComplaints = useMemo(() => {
    const now = new Date();
    const points = Array.from({ length: 6 }).map((_, index) => {
      const date = new Date(now.getFullYear(), now.getMonth() - (5 - index), 1);
      const month = date.getMonth();
      const year = date.getFullYear();
      const monthRows = complaints.filter((c) => {
        const d = new Date(c.created_at);
        return d.getMonth() === month && d.getFullYear() === year;
      });

      return {
        month: monthFmt.format(date),
        recebidas: monthRows.length,
        resolvidas: monthRows.filter((c) => c.status !== 'PENDENTE').length,
      };
    });
    return points;
  }, [complaints]);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Visão geral em tempo real do ambiente operacional</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard title="Total de Postes" value={cityPoles.length} description="Cadastrados no sistema" icon={<Lightbulb className="h-6 w-6" />} variant="default" />
          <StatsCard title="Funcionando" value={working} description="Operacionais" icon={<CheckCircle className="h-6 w-6" />} variant="success" />
          <StatsCard title="Queimados" value={broken} description="Exigem manutenção" icon={<AlertTriangle className="h-6 w-6" />} variant="destructive" />
          <StatsCard
            title="Tempo médio de solução"
            value={`${avgResolutionHours || 0}h`}
            description={`${openMaintenance} OS abertas · ${pendingComplaints} denúncias pendentes`}
            icon={<Clock className="h-6 w-6" />}
            variant="warning"
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Lightbulb className="h-5 w-5" />Status dos Postes</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={poleBarData}>
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, color: 'hsl(var(--foreground))' }} />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                    {poleBarData.map((entry, index) => (
                      <Cell key={index} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><FileText className="h-5 w-5" />Denúncias por Status</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center">
              {complaintPieData.length > 0 ? (
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={complaintPieData} cx="50%" cy="50%" innerRadius={50} outerRadius={85} paddingAngle={4} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                      {complaintPieData.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, color: 'hsl(var(--foreground))' }} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-muted-foreground text-sm py-10">Nenhuma denúncia registrada</p>
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Activity className="h-5 w-5" />Evolução dos últimos 6 meses</CardTitle>
            <CardDescription>Comparativo entre denúncias recebidas e resolvidas</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={monthlyComplaints}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" allowDecimals={false} />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, color: 'hsl(var(--foreground))' }} />
                <Line type="monotone" dataKey="recebidas" stroke="hsl(var(--warning))" strokeWidth={3} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="resolvidas" stroke="hsl(var(--success))" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {activeCityHall && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><MapPin className="h-5 w-5" />Mapa de Postes</CardTitle>
              <CardDescription>{activeCityHall.name} · {activeCityHall.city}/{activeCityHall.state}</CardDescription>
            </CardHeader>
            <CardContent>
              <PoleMap center={[activeCityHall.latitude, activeCityHall.longitude]} poles={cityPoles} showFilters />
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
