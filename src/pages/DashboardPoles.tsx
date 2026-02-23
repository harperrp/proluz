import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Lightbulb, 
  Search, 
  Plus, 
  MapPin, 
  History,
  Filter
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Pole, PoleStatus } from '@/types';

const MOCK_POLES: Pole[] = [
  { id: 'P-001', latitude: -23.5505, longitude: -46.6333, status: 'FUNCIONANDO', neighborhood: 'Centro', address: 'Rua das Flores, 100', cityHallId: '1', createdAt: new Date('2023-01-15'), updatedAt: new Date('2024-01-10') },
  { id: 'P-002', latitude: -23.5520, longitude: -46.6350, status: 'QUEIMADO', neighborhood: 'Centro', address: 'Av. Principal, 200', cityHallId: '1', createdAt: new Date('2023-02-20'), updatedAt: new Date('2024-01-15') },
  { id: 'P-003', latitude: -23.5490, longitude: -46.6310, status: 'FUNCIONANDO', neighborhood: 'Jardim', address: 'Rua das Árvores, 50', cityHallId: '1', createdAt: new Date('2023-03-10'), updatedAt: new Date('2024-01-08') },
  { id: 'P-004', latitude: -23.5535, longitude: -46.6380, status: 'QUEIMADO', neighborhood: 'Vila Nova', address: 'Rua Nova, 75', cityHallId: '1', createdAt: new Date('2023-04-05'), updatedAt: new Date('2024-01-14') },
  { id: 'P-005', latitude: -23.5480, longitude: -46.6340, status: 'FUNCIONANDO', neighborhood: 'Centro', address: 'Praça Central, 1', cityHallId: '1', createdAt: new Date('2023-05-12'), updatedAt: new Date('2024-01-12') },
  { id: 'P-006', latitude: -23.5510, longitude: -46.6290, status: 'FUNCIONANDO', neighborhood: 'Jardim', address: 'Rua Verde, 120', cityHallId: '1', createdAt: new Date('2023-06-18'), updatedAt: new Date('2024-01-09') },
];

export default function DashboardPoles() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<PoleStatus | 'TODOS'>('TODOS');
  const [neighborhoodFilter, setNeighborhoodFilter] = useState('all');

  const neighborhoods = [...new Set(MOCK_POLES.map(p => p.neighborhood))];

  const filteredPoles = MOCK_POLES.filter(pole => {
    const matchesSearch = pole.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pole.address?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'TODOS' || pole.status === statusFilter;
    const matchesNeighborhood = neighborhoodFilter === 'all' || pole.neighborhood === neighborhoodFilter;
    
    return matchesSearch && matchesStatus && matchesNeighborhood;
  });

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(date);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold">Postes</h1>
            <p className="text-muted-foreground">
              Gerencie todos os postes cadastrados no sistema
            </p>
          </div>

          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Novo Poste
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por ID ou endereço..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
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
            <CardDescription>
              {filteredPoles.length} postes encontrados
            </CardDescription>
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
                    <TableHead>Última Atualização</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPoles.map(pole => (
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
                        <Badge className={pole.status === 'FUNCIONANDO' ? 'status-badge-working' : 'status-badge-broken'}>
                          {pole.status === 'FUNCIONANDO' ? 'Funcionando' : 'Queimado'}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(pole.updatedAt)}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          <History className="h-4 w-4 mr-1" />
                          Histórico
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
