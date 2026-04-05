import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PoleMap } from '@/components/map/PoleMap';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Wrench } from 'lucide-react';
import { dbPatch, dbSelect } from '@/lib/supabase';
import { Pole } from '@/types';
import { usePoles } from '@/contexts/PolesContext';
import { toast } from 'sonner';

interface MaintenanceOrderRow { id: string; lighting_point_code: string; status: 'ABERTA' | 'EM_EXECUCAO' | 'CONCLUIDA'; priority: 'ALTA' | 'MEDIA' | 'BAIXA'; description: string | null; created_at: string }

export default function DashboardMaintenance() {
  const { poles, updatePoleStatus } = usePoles();
  const [orders, setOrders] = useState<MaintenanceOrderRow[]>([]);

  const load = async () => {
    const rows = await dbSelect<MaintenanceOrderRow>('maintenance_orders?select=*&status=in.(ABERTA,EM_EXECUCAO)&order=created_at.asc');
    setOrders(rows);
  };

  useEffect(() => { void load(); }, []);

  const completeOrder = async (order: MaintenanceOrderRow) => {
    await dbPatch(`maintenance_orders?id=eq.${order.id}`, { status: 'CONCLUIDA', completed_at: new Date().toISOString() });
    await updatePoleStatus(order.lighting_point_code, 'FUNCIONANDO');
    toast.success(`OS ${order.id} concluída`);
    await load();
  };

  const burnedPoles: Pole[] = poles.filter((p) => p.status === 'QUEIMADO');

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div><h1 className="text-2xl font-bold">Manutenção</h1><p className="text-muted-foreground">Ordens de serviço reais no Supabase</p></div>

        <Card>
          <CardHeader><CardTitle>Mapa de postes queimados</CardTitle></CardHeader>
          <CardContent><PoleMap poles={burnedPoles} editableStatus onStatusChange={(id, st) => void updatePoleStatus(id, st)} defaultFilter="QUEIMADO" /></CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Wrench className="h-5 w-5" />Ordens pendentes ({orders.length})</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {orders.map((order) => (
              <div key={order.id} className="border rounded-lg p-3 flex items-center justify-between">
                <div>
                  <p className="font-medium">OS {order.id} · Poste {order.lighting_point_code}</p>
                  <p className="text-sm text-muted-foreground">{order.description ?? 'Sem descrição'}</p>
                  <Badge variant="outline" className="mt-1">{order.priority}</Badge>
                </div>
                <Button onClick={() => void completeOrder(order)}><AlertTriangle className="h-4 w-4 mr-2" />Concluir</Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
