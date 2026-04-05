import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText } from 'lucide-react';
import { dbSelect } from '@/lib/supabase';

interface Counts {
  poles: number;
  complaints: number;
  maintenanceOpen: number;
}

export default function DashboardReports() {
  const [counts, setCounts] = useState<Counts>({ poles: 0, complaints: 0, maintenanceOpen: 0 });

  useEffect(() => {
    void (async () => {
      const [poles, complaints, maintenance] = await Promise.all([
        dbSelect<{ id: string }>('lighting_points?select=id'),
        dbSelect<{ id: string }>('complaints?select=id'),
        dbSelect<{ id: string }>('maintenance_orders?select=id&status=in.(ABERTA,EM_EXECUCAO)'),
      ]);
      setCounts({ poles: poles.length, complaints: complaints.length, maintenanceOpen: maintenance.length });
    })();
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div><h1 className="text-2xl font-bold">Relatórios</h1><p className="text-muted-foreground">Indicadores alimentados por dados reais</p></div>
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><FileText className="h-5 w-5" />Resumo</CardTitle></CardHeader>
          <CardContent className="grid sm:grid-cols-3 gap-3">
            <div className="border rounded p-4"><p className="text-sm text-muted-foreground">Postes</p><p className="text-2xl font-bold">{counts.poles}</p></div>
            <div className="border rounded p-4"><p className="text-sm text-muted-foreground">Denúncias</p><p className="text-2xl font-bold">{counts.complaints}</p></div>
            <div className="border rounded p-4"><p className="text-sm text-muted-foreground">OS abertas</p><p className="text-2xl font-bold">{counts.maintenanceOpen}</p></div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
