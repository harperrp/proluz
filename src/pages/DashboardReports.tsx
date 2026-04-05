import { useEffect, useMemo, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Lightbulb, AlertTriangle, Wrench, TrendingUp, Activity } from 'lucide-react';
import { dbSelect } from '@/lib/supabase';
import { usePoles } from '@/contexts/PolesContext';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, CartesianGrid, LineChart, Line } from 'recharts';

interface ComplaintRow { id: string; status: 'PENDENTE' | 'APROVADA' | 'REJEITADA'; created_at: string }
interface MaintenanceRow { id: string; status: 'ABERTA' | 'EM_EXECUCAO' | 'CONCLUIDA'; priority: 'ALTA' | 'MEDIA' | 'BAIXA'; opened_at: string; completed_at: string | null }

export default function DashboardReports() {
  const { poles } = usePoles();
  const [complaints, setComplaints] = useState<ComplaintRow[]>([]);
  const [maintenance, setMaintenance] = useState<MaintenanceRow[]>([]);

  useEffect(() => {
    void (async () => {
      try {
        const [c, m] = await Promise.all([
          dbSelect<ComplaintRow>('complaints?select=id,status,created_at'),
          dbSelect<MaintenanceRow>('maintenance_orders?select=id,status,priority,opened_at,completed_at'),
        ]);
        setComplaints(c);
        setMaintenance(m);
      } catch {
        setComplaints([]);
        setMaintenance([]);
      }
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

  const complaintStatusBars = [
    { name: 'Pendentes', value: complaints.filter((m) => m.status === 'PENDENTE').length, color: '#f59e0b' },
    { name: 'Aprovadas', value: complaints.filter((m) => m.status === 'APROVADA').length, color: '#22c55e' },
    { name: 'Rejeitadas', value: complaints.filter((m) => m.status === 'REJEITADA').length, color: '#ef4444' },
  ];

  const resolutionByMonth = useMemo(() => {
    const now = new Date();
    return Array.from({ length: 6 }).map((_, idx) => {
      const date = new Date(now.getFullYear(), now.getMonth() - (5 - idx), 1);
      const month = date.getMonth();
      const year = date.getFullYear();

      const opened = maintenance.filter((m) => {
        const d = new Date(m.opened_at);
        return d.getMonth() === month && d.getFullYear() === year;
      }).length;

      const concluded = maintenance.filter((m) => {
        if (!m.completed_at) return false;
        const d = new Date(m.completed_at);
        return d.getMonth() === month && d.getFullYear() === year;
      }).length;

      return { month: date.toLocaleDateString('pt-BR', { month: 'short' }), abertas: opened, concluidas: concluded };
    });
  }, [maintenance]);

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
          <p className="text-muted-foreground">Indicadores, KPI e agregações reais do banco</p>
        </div>

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

        <Card>
          <CardHeader><CardTitle>Taxa Operacional</CardTitle></CardHeader>
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

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><FileText className="h-5 w-5" />Denúncias por status</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={complaintStatusBars}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                    {complaintStatusBars.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {priorityData.length > 0 && (
            <Card>
              <CardHeader><CardTitle>Ordens por Prioridade</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={240}>
                  <PieChart>
                    <Pie data={priorityData} cx="50%" cy="50%" innerRadius={50} outerRadius={85} paddingAngle={4} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                      {priorityData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}
        </div>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Activity className="h-5 w-5" />Evolução da manutenção (6 meses)</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={resolutionByMonth}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Line type="monotone" dataKey="abertas" stroke="#3b82f6" strokeWidth={3} />
                <Line type="monotone" dataKey="concluidas" stroke="#22c55e" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
