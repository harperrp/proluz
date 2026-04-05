import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';
import { ComplaintsList } from '@/components/dashboard/ComplaintsList';

export default function DashboardComplaints() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold">Denúncias</h1>
          <p className="text-muted-foreground">Fluxo real de análise de denúncias</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><AlertTriangle className="h-5 w-5" />Lista de Denúncias</CardTitle>
          </CardHeader>
          <CardContent>
            <ComplaintsList />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
