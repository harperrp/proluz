import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Lightbulb, Search, Plus, MapPin, History, AlertTriangle, CheckCircle } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Pole, PoleStatus } from '@/types';
import { MOCK_POLES, getPoleStats, getRecurrenceLevel, formatDateBR } from '@/data/mockData';
import { PoleHistoryModal } from '@/components/poles/PoleHistoryModal';
import { CreatePoleModal } from '@/components/poles/CreatePoleModal';
import { toast } from 'sonner';

export default function DashboardPoles() {
  const [poles, setPoles] = useState<Pole[]>(MOCK_POLES);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<PoleStatus | 'TODOS'>('TODOS');
  const [neighborhoodFilter, setNeighborhoodFilter] = useState('all');

  // Modals
  const [historyPole, setHistoryPole] = useState<Pole | null>(null);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);

  const neighborhoods = [...new Set(poles.map(p => p.neighborhood))];

  const filteredPoles = poles.filter(pole => {
    const matchesSearch = pole.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pole.address?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'TODOS' || pole.status === statusFilter;
    const matchesNeighborhood = neighborhoodFilter === 'all' || pole.neighborhood === neighborhoodFilter;
    return matchesSearch && matchesStatus && matchesNeighborhood;
  });

  const workingCount = poles.filter(p => p.status === 'FUNCIONANDO').length;
  const brokenCount = poles.filter(p => p.status === 'QUEIMADO').length;

  const nextPoleId = `P-${String(poles.length + 1).padStart(3, '0')}`;

  const handleCreatePole = (data: { id: string; address: string; neighborhood: string; latitude: number; longitude: number; status: PoleStatus }) => {
    const newPole: Pole = {
      ...data,
      cityHallId: '1',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setPoles(prev => [...prev, newPole]);
  };

  const toggleStatus = (pole: Pole) => {
    const newStatus: PoleStatus = pole.status === 'FUNCIONANDO' ? 'QUEIMADO' : 'FUNCIONANDO';
    setPoles(prev => prev.map(p => p.id === pole.id ? { ...p, status: newStatus, updatedAt: new Date() } : p));
    toast.success(`Status atualizado: ${pole.id}`, {
      description: `Agora está ${newStatus === 'FUNCIONANDO' ? 'consertado' : 'queimado'}.`,
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold">Postes</h1>
            <p className="text-muted-foreground">Gerencie todos os postes cadastrados no sistema</p>
          </div>
          <Button onClick={() => setCreateOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Poste
          </Button>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-3">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total</p>
                  <p className="text-2xl font-bold">{poles.length}</p>
                </div>
                <Lightbulb className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Funcionando</p>
                  <p className="text-2xl font-bold text-success">{workingCount}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-success" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Queimados</p>
                  <p className="text-2xl font-bold text-destructive">{brokenCount}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-destructive" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Buscar por ID ou endereço..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-9" />
              </div>
              <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as PoleStatus | 'TODOS')}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TODOS">Todos os Status</SelectItem>
                  <SelectItem value="FUNCIONANDO">Funcionando</SelectItem>
                  <SelectItem value="QUEIMADO">Queimado</SelectItem>
                </SelectContent>
              </Select>
              <Select value={neighborhoodFilter} onValueChange={setNeighborhoodFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Bairro" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Bairros</SelectItem>
                  {neighborhoods.map(n => (
                    <SelectItem key={n} value={n!}>{n}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Poles Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5" />
              Lista de Postes
            </CardTitle>
            <CardDescription>{filteredPoles.length} postes encontrados</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Endereço</TableHead>
                    <TableHead>Bairro</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ocorrências</TableHead>
                    <TableHead>Última Atualização</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPoles.map(pole => {
                    const stats = getPoleStats(pole.id);
                    const recurrence = getRecurrenceLevel(pole.id);
                    return (
                      <TableRow key={pole.id}>
                        <TableCell className="font-medium">{pole.id}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            {pole.address}
                          </div>
                        </TableCell>
                        <TableCell>{pole.neighborhood}</TableCell>
                        <TableCell>
                          <Badge
                            className={`${pole.status === 'FUNCIONANDO' ? 'status-badge-working' : 'status-badge-broken'} cursor-pointer`}
                            onClick={() => toggleStatus(pole)}
                          >
                            {pole.status === 'FUNCIONANDO' ? 'Funcionando' : 'Queimado'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="text-sm">{stats.total}x</span>
                            {recurrence && (
                              <Badge variant="outline" className={
                                recurrence.level === 'CRITICO' ? 'border-destructive text-destructive' :
                                recurrence.level === 'MEDIO' ? 'border-warning text-warning' :
                                'border-muted-foreground'
                              }>
                                {recurrence.level}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{formatDateBR(pole.updatedAt)}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => { setHistoryPole(pole); setHistoryOpen(true); }}
                          >
                            <History className="h-4 w-4 mr-1" />
                            Histórico
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      <PoleHistoryModal pole={historyPole} open={historyOpen} onOpenChange={setHistoryOpen} />
      <CreatePoleModal open={createOpen} onOpenChange={setCreateOpen} onCreated={handleCreatePole} nextId={nextPoleId} />
    </DashboardLayout>
  );
}
