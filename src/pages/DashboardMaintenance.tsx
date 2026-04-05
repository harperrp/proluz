import { useEffect, useMemo, useState } from 'react';
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
import { useAuth } from '@/contexts/AuthContext';

interface MaintenanceOrderRow {
  id: string;
  lighting_point_code: string;
  status: 'ABERTA' | 'EM_EXECUCAO' | 'CONCLUIDA';
  priority: 'ALTA' | 'MEDIA' | 'BAIXA';
  description: string | null;
  created_at: string;
}

const priorityClass: Record<MaintenanceOrderRow['priority'], string> = {
  ALTA: 'bg-destructive/10 text-destructive border-destructive/20',
  MEDIA: 'bg-warning/10 text-warning border-warning/20',
  BAIXA: 'bg-success/10 text-success border-success/20',
};

export default function DashboardMaintenance() {
  const { user } = useAuth();
  const { poles, updatePoleStatus } = usePoles();
  const [orders, setOrders] = useState<MaintenanceOrderRow[]>([]);
  const canExecuteMaintenance = user?.role === 'ADMIN' || user?.role === 'TECHNICAL';

  const load = async () => {
    const rows = await dbSelect<MaintenanceOrderRow>(
      'maintenance_orders?select=id,lighting_point_code,status,priority,description,created_at&order=created_at.asc',
    );
    setOrders(rows);
  };

  useEffect(() => {
    void load();
  }, []);

  const completeOrder = async (order: MaintenanceOrderRow) => {
    await dbPatch(`maintenance_orders?id=eq.${order.id}`, {
      status: 'CONCLUIDA',
      completed_at: new Date().toISOString(),
    });
    await updatePoleStatus(order.lighting_point_code, 'FUNCIONANDO');
    toast.success(`OS ${order.id.slice(0, 8)} concluída`);
    await load();
  };

  const startOrder = async (order: MaintenanceOrderRow) => {
    await dbPatch(`maintenance_orders?id=eq.${order.id}`, { status: 'EM_EXECUCAO' });
    toast.success(`OS ${order.id.slice(0, 8)} em execução`);
    await load();
  };

  const burnedPoles: Pole[] = poles.filter((p) => p.status === 'QUEIMADO');
  const pendingOrders = useMemo(() => orders.filter((o) => o.status !== 'CONCLUIDA'), [orders]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Manutenção</h1>
          <p className="text-muted-foreground">Ordens de serviço reais no Supabase</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Mapa de postes queimados ({burnedPoles.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <PoleMap poles={burnedPoles} editableStatus onStatusChange={(id, st) => void updatePoleStatus(id, st)} defaultFilter="QUEIMADO" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wrench className="h-5 w-5" />
              Ordens abertas/em execução ({pendingOrders.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {pendingOrders.length === 0 && (
              <div className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
                Nenhuma ordem pendente. Aprove denúncias para gerar novas ordens automaticamente.
              </div>
            )}
            {pendingOrders.map((order) => (
              <div key={order.id} className="border rounded-lg p-3 flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
                <div>
                  <p className="font-medium">OS {order.id.slice(0, 8)} · Poste {order.lighting_point_code}</p>
                  <p className="text-sm text-muted-foreground">{order.description ?? 'Sem descrição'}</p>
                  <div className="flex gap-2 mt-1">
                    <Badge variant="outline" className={priorityClass[order.priority]}>{order.priority}</Badge>
                    <Badge variant="outline">{order.status}</Badge>
                  </div>
                </div>
                <div className="flex gap-2">
                  {order.status === 'ABERTA' && canExecuteMaintenance && (
                    <Button variant="outline" onClick={() => void startOrder(order)}>Iniciar</Button>
                  )}
                  {canExecuteMaintenance && (
                    <Button onClick={() => void completeOrder(order)}>
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      Concluir
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
