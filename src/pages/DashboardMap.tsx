import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PoleMap } from '@/components/map/PoleMap';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin } from 'lucide-react';
import { usePoles } from '@/contexts/PolesContext';
import { MOCK_CITY_HALLS_LIST } from '@/data/mockData';

export default function DashboardMap() {
  const { poles, updatePoleStatus } = usePoles();

  // TODO: Replace with active city hall from context when multi-tenancy is live
  const activeCityHall = MOCK_CITY_HALLS_LIST[0];
  const mapCenter: [number, number] = [activeCityHall.latitude, activeCityHall.longitude];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold">Mapa de Postes</h1>
          <p className="text-muted-foreground">
            Visualize a localização e status dos postes de {activeCityHall.city}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Mapa Interativo — {activeCityHall.city}
            </CardTitle>
            <CardDescription>
              Clique em um poste no mapa para localizar com precisão e atualizar o status para arrumado/queimado
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PoleMap
              showFilters={true}
              editableStatus={true}
              poles={poles}
              onStatusChange={updatePoleStatus}
              center={mapCenter}
            />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
