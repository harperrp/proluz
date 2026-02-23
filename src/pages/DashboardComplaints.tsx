import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ComplaintsList } from '@/components/dashboard/ComplaintsList';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useState } from 'react';

export default function DashboardComplaints() {
  const [statusFilter, setStatusFilter] = useState('all');

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold">Denúncias</h1>
            <p className="text-muted-foreground">
              Gerencie as denúncias recebidas dos cidadãos
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="pending">Pendentes</SelectItem>
                <SelectItem value="approved">Aprovadas</SelectItem>
                <SelectItem value="rejected">Rejeitadas</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Lista de Denúncias
            </CardTitle>
            <CardDescription>
              Aprove ou rejeite denúncias de postes com problemas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ComplaintsList />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
