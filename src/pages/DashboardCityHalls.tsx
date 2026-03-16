import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Building2, Search, Plus, MapPin, Users, Lightbulb, MoreHorizontal, LogIn, CheckCircle2 } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BRAZILIAN_STATES } from '@/types';
import { useCityHall } from '@/contexts/CityHallContext';
import { toast } from 'sonner';

const formatDate = (date: Date) => new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(date);

export default function DashboardCityHalls() {
  const { cityHalls, activeCityHall, setActiveCityHall, addCityHall, updateCityHall, toggleCityHallStatus } = useCityHall();
  const [searchTerm, setSearchTerm] = useState('');

  // Create modal
  const [createOpen, setCreateOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newState, setNewState] = useState('');
  const [newCnpj, setNewCnpj] = useState('');

  // Edit modal
  const [editOpen, setEditOpen] = useState(false);
  const [editId, setEditId] = useState('');
  const [editName, setEditName] = useState('');
  const [editCity, setEditCity] = useState('');
  const [editState, setEditState] = useState('');
  const [editCnpj, setEditCnpj] = useState('');
  const [editOrigCity, setEditOrigCity] = useState('');
  const [editOrigState, setEditOrigState] = useState('');

  const filteredCityHalls = cityHalls.filter(ch =>
    ch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ch.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalUsers = cityHalls.reduce((acc, ch) => acc + ch.usersCount, 0);
  const totalPoles = cityHalls.reduce((acc, ch) => acc + ch.polesCount, 0);

  const formatCnpj = (value: string) => {
    const nums = value.replace(/\D/g, '');
    return nums.replace(/(\d{2})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1/$2').replace(/(\d{4})(\d)/, '$1-$2').replace(/(-\d{2})\d+?$/, '$1');
  };

  const handleCreate = async () => {
    if (!newName || !newCity || !newState) { toast.error('Preencha todos os campos obrigatórios.'); return; }
    
    let latitude = 0, longitude = 0;
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(newCity + ', ' + newState + ', Brazil')}&format=json&limit=1`);
      const data = await res.json();
      if (data.length > 0) {
        latitude = parseFloat(data[0].lat);
        longitude = parseFloat(data[0].lon);
      } else {
        toast.error('Não foi possível encontrar as coordenadas da cidade. Verifique o nome.');
        return;
      }
    } catch {
      toast.error('Erro ao buscar localização da cidade.');
      return;
    }

    const id = String(Date.now());
    addCityHall({ id, name: newName, city: newCity, state: newState, latitude, longitude, cnpj: newCnpj, status: 'ATIVO', createdAt: new Date(), usersCount: 0, polesCount: 0 });
    toast.success('Prefeitura cadastrada!', { description: `${newCity}/${newState}` });
    setCreateOpen(false);
    setNewName(''); setNewCity(''); setNewState(''); setNewCnpj('');
  };

  const openEdit = (ch: typeof cityHalls[0]) => {
    setEditId(ch.id); setEditName(ch.name); setEditCity(ch.city); setEditState(ch.state); setEditCnpj(ch.cnpj || '');
    setEditOrigCity(ch.city); setEditOrigState(ch.state);
    setEditOpen(true);
  };

  const handleEdit = async () => {
    if (!editId) return;
    let updates: Record<string, any> = { name: editName, city: editCity, state: editState, cnpj: editCnpj };

    if (editCity !== editOrigCity || editState !== editOrigState) {
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(editCity + ', ' + editState + ', Brazil')}&format=json&limit=1`);
        const data = await res.json();
        if (data.length > 0) {
          updates.latitude = parseFloat(data[0].lat);
          updates.longitude = parseFloat(data[0].lon);
        }
      } catch { /* keep original coords */ }
    }

    updateCityHall(editId, updates);
    toast.success('Prefeitura atualizada!');
    setEditOpen(false);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold">Prefeituras</h1>
            <p className="text-muted-foreground">Gerencie os municípios cadastrados no sistema</p>
          </div>
          <Button onClick={() => setCreateOpen(true)}>
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
                  <p className="text-2xl font-bold">{cityHalls.length}</p>
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
              <Input placeholder="Buscar por nome ou cidade..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-9 max-w-md" />
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Building2 className="h-5 w-5" />Lista de Prefeituras</CardTitle>
            <CardDescription>{filteredCityHalls.length} prefeituras cadastradas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Cidade/Estado</TableHead>
                    <TableHead>CNPJ</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Usuários</TableHead>
                    <TableHead>Postes</TableHead>
                    <TableHead>Cadastrado em</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCityHalls.map(ch => {
                    const isActive = activeCityHall.id === ch.id;
                    return (
                      <TableRow key={ch.id} className={isActive ? 'bg-primary/5' : ''}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            {ch.name}
                            {isActive && (
                              <Badge variant="outline" className="border-primary text-primary text-[10px]">
                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                Ativa
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            {ch.city}/{ch.state}
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm">{ch.cnpj || '—'}</TableCell>
                        <TableCell>
                          <Badge className={ch.status === 'ATIVO' ? 'status-badge-working' : 'bg-muted text-muted-foreground'}>
                            {ch.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2"><Users className="h-4 w-4 text-muted-foreground" />{ch.usersCount}</div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2"><Lightbulb className="h-4 w-4 text-muted-foreground" />{ch.polesCount}</div>
                        </TableCell>
                        <TableCell>{formatDate(ch.createdAt)}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => setActiveCityHall(ch)}
                                disabled={isActive}
                              >
                                <LogIn className="h-4 w-4 mr-2" />
                                {isActive ? 'Prefeitura Ativa' : 'Acessar Prefeitura'}
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => openEdit(ch)}>Editar</DropdownMenuItem>
                              <DropdownMenuItem className={ch.status === 'ATIVO' ? 'text-destructive' : 'text-success'} onClick={() => toggleCityHallStatus(ch.id)}>
                                {ch.status === 'ATIVO' ? 'Desativar' : 'Ativar'}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
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

      {/* Create Modal */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Nova Prefeitura</DialogTitle>
            <DialogDescription>Cadastre um novo município no sistema</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2"><Label>Nome da Prefeitura *</Label><Input placeholder="Prefeitura de..." value={newName} onChange={e => setNewName(e.target.value)} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2"><Label>Cidade *</Label><Input placeholder="Nome da cidade" value={newCity} onChange={e => setNewCity(e.target.value)} /></div>
              <div className="space-y-2">
                <Label>Estado *</Label>
                <Select value={newState} onValueChange={setNewState}>
                  <SelectTrigger><SelectValue placeholder="UF" /></SelectTrigger>
                  <SelectContent>{BRAZILIAN_STATES.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>CNPJ</Label>
              <Input placeholder="00.000.000/0001-00" value={newCnpj} maxLength={18} onChange={e => setNewCnpj(formatCnpj(e.target.value))} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancelar</Button>
            <Button onClick={handleCreate}>Cadastrar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Prefeitura</DialogTitle>
            <DialogDescription>Atualize os dados da prefeitura</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2"><Label>Nome *</Label><Input value={editName} onChange={e => setEditName(e.target.value)} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2"><Label>Cidade *</Label><Input value={editCity} onChange={e => setEditCity(e.target.value)} /></div>
              <div className="space-y-2">
                <Label>Estado *</Label>
                <Select value={editState} onValueChange={setEditState}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{BRAZILIAN_STATES.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>CNPJ</Label>
              <Input value={editCnpj} maxLength={18} onChange={e => setEditCnpj(formatCnpj(e.target.value))} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>Cancelar</Button>
            <Button onClick={handleEdit}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
