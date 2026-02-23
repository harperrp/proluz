import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Building2, 
  Search, 
  Plus, 
  MapPin,
  Users,
  Lightbulb,
  MoreHorizontal
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { CityHall } from '@/types';

interface CityHallWithStats extends CityHall {
  usersCount: number;
  polesCount: number;
}

const MOCK_CITY_HALLS: CityHallWithStats[] = [
  { id: '1', name: 'Prefeitura de São Paulo', city: 'São Paulo', state: 'SP', createdAt: new Date('2023-01-10'), usersCount: 15, polesCount: 1250 },
  { id: '2', name: 'Prefeitura de Campinas', city: 'Campinas', state: 'SP', createdAt: new Date('2023-03-15'), usersCount: 8, polesCount: 450 },
  { id: '3', name: 'Prefeitura de Santos', city: 'Santos', state: 'SP', createdAt: new Date('2023-05-20'), usersCount: 6, polesCount: 320 },
  { id: '4', name: 'Prefeitura de Sorocaba', city: 'Sorocaba', state: 'SP', createdAt: new Date('2023-07-12'), usersCount: 5, polesCount: 280 },
];

export default function DashboardCityHalls() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCityHalls = MOCK_CITY_HALLS.filter(ch => 
    ch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ch.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(date);
  };

  const totalUsers = MOCK_CITY_HALLS.reduce((acc, ch) => acc + ch.usersCount, 0);
  const totalPoles = MOCK_CITY_HALLS.reduce((acc, ch) => acc + ch.polesCount, 0);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold">Prefeituras</h1>
            <p className="text-muted-foreground">
              Gerencie os municípios cadastrados no sistema
            </p>
          </div>

          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nova Prefeitura
          </Button>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-3">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Prefeituras</p>
                  <p className="text-2xl font-bold">{MOCK_CITY_HALLS.length}</p>
                </div>
                <Building2 className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total de Usuários</p>
                  <p className="text-2xl font-bold">{totalUsers}</p>
                </div>
                <Users className="h-8 w-8 text-chart-1" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total de Postes</p>
                  <p className="text-2xl font-bold">{totalPoles.toLocaleString()}</p>
                </div>
                <Lightbulb className="h-8 w-8 text-chart-2" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome ou cidade..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-9 max-w-md"
              />
            </div>
          </CardContent>
        </Card>

        {/* City Halls Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Lista de Prefeituras
            </CardTitle>
            <CardDescription>
              {filteredCityHalls.length} prefeituras cadastradas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Cidade/Estado</TableHead>
                    <TableHead>Usuários</TableHead>
                    <TableHead>Postes</TableHead>
                    <TableHead>Cadastrado em</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCityHalls.map(ch => (
                    <TableRow key={ch.id}>
                      <TableCell className="font-medium">{ch.name}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          {ch.city}/{ch.state}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          {ch.usersCount}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Lightbulb className="h-4 w-4 text-muted-foreground" />
                          {ch.polesCount}
                        </div>
                      </TableCell>
                      <TableCell>{formatDate(ch.createdAt)}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>Editar</DropdownMenuItem>
                            <DropdownMenuItem>Ver Usuários</DropdownMenuItem>
                            <DropdownMenuItem>Ver Postes</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">
                              Desativar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
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
