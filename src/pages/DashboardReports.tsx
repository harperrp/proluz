import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Lightbulb, AlertTriangle, Wrench, TrendingUp } from 'lucide-react';
import { dbSelect } from '@/lib/supabase';
import { usePoles } from '@/contexts/PolesContext';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';

interface ComplaintRow { id: string; status: string; created_at: string }
interface MaintenanceRow { id: string; status: string; priority: string }

export default function DashboardReports() {
  const { poles } = usePoles();
  const [complaints, setComplaints] = useState<ComplaintRow[]>([]);
  const [maintenance, setMaintenance] = useState<MaintenanceRow[]>([]);

  useEffect(() => {
    void (async () => {
      try {
        const [c, m] = await Promise.all([
          dbSelect<ComplaintRow>('complaints?select=id,status,created_at'),
          dbSelect<MaintenanceRow>('maintenance_orders?select=id,status,priority'),
        ]);
        setComplaints(c);
        setMaintenance(m);
      } catch {}
    })();
  }, []);

  const working = poles.filter((p) => p.status === 'FUNCIONANDO').length;
  const broken = poles.filter((p) => p.status === 'QUEIMADO').length;
  const openMaintenance = maintenance.filter((m) => m.status !== 'CONCLUIDA').length;
  const completedMaintenance = maintenance.filter((m) => m.status === 'CONCLUIDA').length;

  const priorityData = [
    { name: 'Alta', value: maintenance.filter((m) => m.priority === 'ALTA').length, color: '#ef4444' },
    { name: 'Média', value: maintenance.filter((m) => m.priority === 'MEDIA').length, color: '#f59e0b' },
    { name: 'Baixa', value: maintenance.filter((m) => m.priority === 'BAIXA').length, color: '#22c55e' },
  ].filter((d) => d.value > 0);

  const stats = [
    { label: 'Total de Postes', value: poles.length, icon: Lightbulb, color: 'text-primary' },
    { label: 'Postes Funcionando', value: working, icon: Lightbulb, color: 'text-success' },
    { label: 'Postes Queimados', value: broken, icon: AlertTriangle, color: 'text-destructive' },
    { label: 'Denúncias Total', value: complaints.length, icon: FileText, color: 'text-warning' },
    { label: 'OS Abertas', value: openMaintenance, icon: Wrench, color: 'text-primary' },
    { label: 'OS Concluídas', value: completedMaintenance, icon: TrendingUp, color: 'text-success' },
  ];

  const operationalRate = poles.length > 0 ? Math.round((working / poles.length) * 100) : 0;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Relatórios</h1>
          <p className="text-muted-foreground">Indicadores e métricas operacionais</p>
        </div>

        {/* KPIs */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {stats.map((s) => (
            <Card key={s.label}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{s.label}</p>
                    <p className="text-3xl font-bold mt-1">{s.value}</p>
                  </div>
                  <s.icon className={`h-8 w-8 ${s.color} opacity-60`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Operational rate */}
        <Card>
          <CardHeader>
            <CardTitle>Taxa Operacional</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="flex-1 h-4 rounded-full bg-muted overflow-hidden">
                <div className="h-full bg-success rounded-full transition-all duration-700" style={{ width: `${operationalRate}%` }} />
              </div>
              <span className="text-2xl font-bold text-success">{operationalRate}%</span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">{working} de {poles.length} postes operacionais</p>
          </CardContent>
        </Card>

        {/* Priority chart */}
        {priorityData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Ordens de Manutenção por Prioridade</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={priorityData} cx="50%" cy="50%" innerRadius={50} outerRadius={85} paddingAngle={4} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                    {priorityData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, color: 'hsl(var(--foreground))' }} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
