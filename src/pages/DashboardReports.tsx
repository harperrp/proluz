import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  FileText,
  Download,
  Calendar,
  BarChart3,
  PieChart,
  TrendingUp,
  FileSpreadsheet,
  AlertTriangle,
  Route,
  Lightbulb,
  MapPin,
  Clock,
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

interface ReportType {
  id: string;
  name: string;
  description: string;
  icon: typeof FileText;
}

interface FailureRecord {
  poleId: string;
  address: string;
  neighborhood: string;
  failuresTotal: number;
  failuresLast30Days: number;
  avgRepairHours: number;
}

const reportTypes: ReportType[] = [
  { id: 'poles-status', name: 'Status dos Postes por Bairro', description: 'Visão geográfica do parque de iluminação por status e criticidade.', icon: BarChart3 },
  { id: 'complaints-flow', name: 'Fluxo de Denúncias', description: 'Entrada, aprovação, rejeição e SLA por etapa.', icon: FileText },
  { id: 'maintenance-productivity', name: 'Produtividade de Manutenção', description: 'Atendimentos por equipe/técnico, tempo médio e backlog.', icon: TrendingUp },
  { id: 'recurrence-alerts', name: 'Recorrência de Queima', description: 'Postes que queimam frequentemente com alertas automáticos.', icon: AlertTriangle },
  { id: 'route-efficiency', name: 'Eficiência de Rota', description: 'Distância total, tempo de deslocamento e otimização por turno.', icon: Route },
  { id: 'asset-health', name: 'Saúde dos Ativos', description: 'Postes com maior incidência histórica e sugestão de troca preventiva.', icon: Lightbulb },
  { id: 'transparency-panel', name: 'Painel de Transparência', description: 'Indicadores para prestação de contas pública para prefeitura.', icon: PieChart },
  { id: 'geo-hotspots', name: 'Hotspots no Mapa', description: 'Mapa de calor por bairros com maior volume de falhas.', icon: MapPin },
];

const failureRecords: FailureRecord[] = [
  { poleId: 'P-001', address: 'Av. Principal, 200', neighborhood: 'Centro', failuresTotal: 5, failuresLast30Days: 2, avgRepairHours: 11 },
  { poleId: 'P-004', address: 'Rua Nova, 75', neighborhood: 'Vila Nova', failuresTotal: 3, failuresLast30Days: 1, avgRepairHours: 18 },
  { poleId: 'P-007', address: 'Rua das Árvores, 120', neighborhood: 'Jardim', failuresTotal: 6, failuresLast30Days: 3, avgRepairHours: 14 },
  { poleId: 'P-011', address: 'Rua das Flores, 330', neighborhood: 'Centro', failuresTotal: 2, failuresLast30Days: 2, avgRepairHours: 20 },
  { poleId: 'P-023', address: 'Av. Brasil, 850', neighborhood: 'Industrial', failuresTotal: 1, failuresLast30Days: 0, avgRepairHours: 16 },
];

export default function DashboardReports() {
  const [period, setPeriod] = useState('month');

  const criticalRecurrence = useMemo(
    () => failureRecords.filter((record) => record.failuresTotal >= 5 || record.failuresLast30Days >= 2),
    [],
  );

  const hotNeighborhoods = useMemo(() => {
    const summary = failureRecords.reduce<Record<string, number>>((acc, curr) => {
      acc[curr.neighborhood] = (acc[curr.neighborhood] || 0) + curr.failuresLast30Days;
      return acc;
    }, {});

    return Object.entries(summary)
      .map(([neighborhood, occurrences]) => ({ neighborhood, occurrences }))
      .sort((a, b) => b.occurrences - a.occurrences);
  }, []);

  const handleExport = (reportId: string, format: 'pdf' | 'excel') => {
    toast.success('Relatório exportado!', {
      description: `Relatório "${reportId}" gerado em ${format.toUpperCase()}.`,
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold">Relatórios</h1>
            <p className="text-muted-foreground">Máxima transparência para prefeitura com indicadores operacionais e estratégicos.</p>
          </div>

          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Última semana</SelectItem>
                <SelectItem value="month">Último mês</SelectItem>
                <SelectItem value="quarter">Último trimestre</SelectItem>
                <SelectItem value="year">Último ano</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {reportTypes.map((report) => {
            const Icon = report.icon;
            return (
              <Card key={report.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{report.name}</CardTitle>
                        <CardDescription>{report.description}</CardDescription>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1" onClick={() => handleExport(report.id, 'pdf')}>
                      <Download className="h-4 w-4 mr-2" />
                      PDF
                    </Button>
                    <Button variant="outline" className="flex-1" onClick={() => handleExport(report.id, 'excel')}>
                      <FileSpreadsheet className="h-4 w-4 mr-2" />
                      Excel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card className="border-warning/40 bg-warning/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-warning">
              <AlertTriangle className="h-5 w-5" />
              Alertas de recorrência (queima frequente)
            </CardTitle>
            <CardDescription>
              Critérios: alerta quando poste queimar 2 vezes em 30 dias ou acumular 5+ falhas totais.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {criticalRecurrence.map((record) => (
              <div key={record.poleId} className="rounded-lg border bg-background p-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold">{record.poleId} • {record.address}</p>
                    <p className="text-sm text-muted-foreground">Bairro: {record.neighborhood}</p>
                    <p className="text-xs text-muted-foreground mt-1">Média de reparo: {record.avgRepairHours}h</p>
                  </div>
                  <div className="flex gap-2">
                    {record.failuresTotal >= 5 && <Badge variant="destructive">{record.failuresTotal} falhas totais</Badge>}
                    {record.failuresLast30Days >= 2 && <Badge className="bg-warning text-warning-foreground">{record.failuresLast30Days} em 30 dias</Badge>}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>



        <Card>
          <CardHeader>
            <CardTitle>Histórico de queima por poste</CardTitle>
            <CardDescription>
              Transparência por ativo: quantas vezes cada poste queimou e frequência no período recente.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {failureRecords.map((record) => {
                const isAlert = record.failuresTotal >= 5 || record.failuresLast30Days >= 2;
                return (
                  <div key={`history-${record.poleId}`} className="rounded-lg border p-3">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div>
                        <p className="font-semibold">{record.poleId} • {record.address}</p>
                        <p className="text-sm text-muted-foreground">{record.neighborhood}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{record.failuresTotal} queimas totais</Badge>
                        <Badge variant="outline">{record.failuresLast30Days} em 30 dias</Badge>
                        {isAlert && <Badge className="bg-warning text-warning-foreground">Frequência fora do normal</Badge>}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Prévia gerencial do período</CardTitle>
            <CardDescription>Indicadores para acompanhamento de eficiência e transparência municipal.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-4">
              <div className="p-4 rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground">Denúncias Recebidas</p>
                <p className="text-2xl font-bold">127</p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground">Manutenções Realizadas</p>
                <p className="text-2xl font-bold">98</p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground">Taxa de Resolução</p>
                <p className="text-2xl font-bold text-success">77%</p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground">Tempo Médio</p>
                <p className="text-2xl font-bold">18h</p>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="font-semibold mb-3">Bairros com maior recorrência (30 dias)</h3>
              <div className="grid md:grid-cols-3 gap-3">
                {hotNeighborhoods.map((item) => (
                  <div key={item.neighborhood} className="border rounded-lg p-3 bg-card">
                    <p className="font-medium">{item.neighborhood}</p>
                    <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                      <Clock className="h-4 w-4" />
                      {item.occurrences} ocorrências no período
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
