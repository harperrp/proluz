import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PoleMap } from '@/components/map/PoleMap';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin } from 'lucide-react';
import { usePoles } from '@/contexts/PolesContext';
import { useCityHall } from '@/contexts/CityHallContext';

export default function DashboardMap() {
  const { poles, updatePoleStatus } = usePoles();
  const { activeCityHall } = useCityHall();

  const cityPoles = activeCityHall ? poles.filter((p) => p.cityHallId === activeCityHall.id) : poles;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold">Mapa de Postes</h1>
          <p className="text-muted-foreground">Visualização geográfica em dados reais</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><MapPin className="h-5 w-5" />Mapa Interativo</CardTitle>
            <CardDescription>Clique no poste para alterar status</CardDescription>
          </CardHeader>
          <CardContent>
            <PoleMap showFilters editableStatus poles={cityPoles} onStatusChange={(id, status) => void updatePoleStatus(id, status)} center={activeCityHall ? [activeCityHall.latitude, activeCityHall.longitude] : undefined} />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
