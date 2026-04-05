import { useEffect, useState } from 'react';
import { Lightbulb, AlertTriangle, CheckCircle, Clock, MapPin, Wrench, FileText } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { PoleMap } from '@/components/map/PoleMap';
import { usePoles } from '@/contexts/PolesContext';
import { useCityHall } from '@/contexts/CityHallContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { dbSelect } from '@/lib/supabase';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface ComplaintRow {
  id: string;
  status: string;
  created_at: string;
}

interface MaintenanceRow {
  id: string;
  status: string;
}

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
          dbSelect<MaintenanceRow>('maintenance_orders?select=id,status'),
        ]);
        setComplaints(c);
        setMaintenance(m);
      } catch {
        // silently fail if RLS blocks
      }
    })();
  }, []);

  const working = poles.filter((p) => p.status === 'FUNCIONANDO').length;
  const broken = poles.filter((p) => p.status === 'QUEIMADO').length;
  const pendingComplaints = complaints.filter((c) => c.status === 'PENDENTE').length;
  const openMaintenance = maintenance.filter((m) => m.status !== 'CONCLUIDA').length;

  // Pie chart data for complaint status
  const complaintPieData = [
    { name: 'Pendentes', value: complaints.filter((c) => c.status === 'PENDENTE').length, color: '#f59e0b' },
    { name: 'Aprovadas', value: complaints.filter((c) => c.status === 'APROVADA').length, color: '#22c55e' },
    { name: 'Rejeitadas', value: complaints.filter((c) => c.status === 'REJEITADA').length, color: '#ef4444' },
  ].filter((d) => d.value > 0);

  // Bar chart - poles by status
  const poleBarData = [
    { name: 'Funcionando', value: working, fill: 'hsl(142 72% 40%)' },
    { name: 'Queimados', value: broken, fill: 'hsl(0 72% 51%)' },
  ];

  const cityPoles = activeCityHall ? poles.filter((p) => p.cityHallId === activeCityHall.id) : poles;

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Visão geral em tempo real</p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard title="Total de Postes" value={poles.length} description="Cadastrados no sistema" icon={<Lightbulb className="h-6 w-6" />} variant="default" />
          <StatsCard title="Funcionando" value={working} description="Operacionais" icon={<CheckCircle className="h-6 w-6" />} variant="success" />
          <StatsCard title="Queimados" value={broken} description="Exigem manutenção" icon={<AlertTriangle className="h-6 w-6" />} variant="destructive" />
          <StatsCard title="Denúncias Pendentes" value={pendingComplaints} description={`${openMaintenance} OS abertas`} icon={<Clock className="h-6 w-6" />} variant="warning" />
        </div>

        {/* Charts */}
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

        {/* Map */}
        {activeCityHall && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><MapPin className="h-5 w-5" />Mapa de Postes</CardTitle>
              <CardDescription>{activeCityHall.city}/{activeCityHall.state}</CardDescription>
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
