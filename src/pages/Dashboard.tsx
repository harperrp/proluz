import { Lightbulb, AlertTriangle, CheckCircle, Clock, MapPin } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { PoleMap } from '@/components/map/PoleMap';
import { ComplaintsList } from '@/components/dashboard/ComplaintsList';
import { usePoles } from '@/contexts/PolesContext';
import { useCityHall } from '@/contexts/CityHallContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function Dashboard() {
  const { poles } = usePoles();
  const { activeCityHall } = useCityHall();

  const working = poles.filter((p) => p.status === 'FUNCIONANDO').length;
  const broken = poles.filter((p) => p.status === 'QUEIMADO').length;

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Visão geral em tempo real via Supabase</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard title="Total de Postes" value={String(poles.length)} description="Cadastrados" icon={<Lightbulb className="h-6 w-6" />} variant="default" />
          <StatsCard title="Funcionando" value={String(working)} description="Operacionais" icon={<CheckCircle className="h-6 w-6" />} variant="success" />
          <StatsCard title="Queimados" value={String(broken)} description="Exigem manutenção" icon={<AlertTriangle className="h-6 w-6" />} variant="destructive" />
          <StatsCard title="Atualização" value="Tempo real" description="Sem mock" icon={<Clock className="h-6 w-6" />} variant="warning" />
        </div>

        {activeCityHall && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><MapPin className="h-5 w-5" />Mapa de Postes</CardTitle>
              <CardDescription>{activeCityHall.city}/{activeCityHall.state}</CardDescription>
            </CardHeader>
            <CardContent>
              <PoleMap center={[activeCityHall.latitude, activeCityHall.longitude]} poles={poles.filter((p) => p.cityHallId === activeCityHall.id)} />
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Denúncias Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <ComplaintsList />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
