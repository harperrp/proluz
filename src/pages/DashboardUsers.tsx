import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Users, Search, Plus, Mail, MoreHorizontal, Shield, UserCheck, Wrench } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User, UserRole } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { MOCK_USERS_LIST } from '@/data/mockData';
import { toast } from 'sonner';

const roleConfig: Record<UserRole, { label: string; icon: typeof Shield; className: string }> = {
  ADMIN: { label: 'Administrador Geral', icon: Shield, className: 'bg-primary text-primary-foreground' },
  CITY_HALL_ADMIN: { label: 'Admin. Municipal', icon: UserCheck, className: 'bg-chart-1 text-white' },
  SECRETARY: { label: 'Secretário', icon: UserCheck, className: 'bg-chart-2 text-white' },
  TECHNICAL: { label: 'Técnico', icon: Wrench, className: 'bg-chart-3 text-foreground' },
  CITIZEN: { label: 'Cidadão', icon: Users, className: 'bg-muted text-muted-foreground' },
};

const formatDate = (date: Date) => new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(date);

export default function DashboardUsers() {
  const [users, setUsers] = useState<User[]>(MOCK_USERS_LIST);
  const [searchTerm, setSearchTerm] = useState('');
  const { hasPermission } = useAuth();

  // Create modal
  const [createOpen, setCreateOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState<UserRole>('TECHNICAL');

  // Edit modal
  const [editOpen, setEditOpen] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editRole, setEditRole] = useState<UserRole>('TECHNICAL');

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreate = () => {
    if (!newName || !newEmail) { toast.error('Preencha todos os campos.'); return; }
    const id = String(users.length + 1);
    setUsers(prev => [...prev, { id, name: newName, email: newEmail, role: newRole, cityHallId: '1', createdAt: new Date() }]);
    toast.success('Usuário criado!', { description: newName });
    setCreateOpen(false);
    setNewName(''); setNewEmail(''); setNewRole('TECHNICAL');
  };

  const openEdit = (user: User) => {
    setEditUser(user);
    setEditName(user.name);
    setEditEmail(user.email);
    setEditRole(user.role);
    setEditOpen(true);
  };

  const handleEdit = () => {
    if (!editUser || !editName || !editEmail) return;
    setUsers(prev => prev.map(u => u.id === editUser.id ? { ...u, name: editName, email: editEmail, role: editRole } : u));
    toast.success('Usuário atualizado!');
    setEditOpen(false);
  };

  const handleDeactivate = (user: User) => {
    setUsers(prev => prev.filter(u => u.id !== user.id));
    toast.success('Usuário desativado.', { description: user.name });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold">Usuários</h1>
            <p className="text-muted-foreground">Gerencie os usuários do sistema</p>
          </div>
          <Button onClick={() => setCreateOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Usuário
          </Button>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-4">
          {Object.entries(roleConfig).filter(([role]) => role !== 'CITIZEN' && role !== 'ADMIN').map(([role, config]) => {
            const count = users.filter(u => u.role === role).length;
            const Icon = config.icon;
            return (
              <Card key={role}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{config.label}</p>
                      <p className="text-2xl font-bold">{count}</p>
                    </div>
                    <Icon className="h-8 w-8 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Search */}
        <Card>
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Buscar por nome ou e-mail..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-9 max-w-md" />
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Users className="h-5 w-5" />Lista de Usuários</CardTitle>
            <CardDescription>{filteredUsers.length} usuários cadastrados</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>E-mail</TableHead>
                    <TableHead>Perfil</TableHead>
                    <TableHead>Cadastrado em</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map(user => {
                    const role = roleConfig[user.role];
                    return (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            {user.email}
                          </div>
                        </TableCell>
                        <TableCell><Badge className={role.className}>{role.label}</Badge></TableCell>
                        <TableCell>{formatDate(user.createdAt)}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => openEdit(user)}>Editar</DropdownMenuItem>
                              <DropdownMenuItem onClick={() => toast.success('E-mail de redefinição enviado!', { description: user.email })}>Redefinir Senha</DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive" onClick={() => handleDeactivate(user)}>Desativar</DropdownMenuItem>
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

      {/* Create User Modal */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Novo Usuário</DialogTitle>
            <DialogDescription>Cadastre um novo usuário no sistema</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Nome Completo *</Label>
              <Input placeholder="Nome do usuário" value={newName} onChange={e => setNewName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>E-mail *</Label>
              <Input type="email" placeholder="email@cidade.gov.br" value={newEmail} onChange={e => setNewEmail(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Perfil *</Label>
              <Select value={newRole} onValueChange={(v) => setNewRole(v as UserRole)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="CITY_HALL_ADMIN">Admin. Municipal</SelectItem>
                  <SelectItem value="SECRETARY">Secretário</SelectItem>
                  <SelectItem value="TECHNICAL">Técnico</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancelar</Button>
            <Button onClick={handleCreate}>Criar Usuário</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Modal */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Usuário</DialogTitle>
            <DialogDescription>Atualize os dados do usuário</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Nome Completo *</Label>
              <Input value={editName} onChange={e => setEditName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>E-mail *</Label>
              <Input type="email" value={editEmail} onChange={e => setEditEmail(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Perfil *</Label>
              <Select value={editRole} onValueChange={(v) => setEditRole(v as UserRole)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="CITY_HALL_ADMIN">Admin. Municipal</SelectItem>
                  <SelectItem value="SECRETARY">Secretário</SelectItem>
                  <SelectItem value="TECHNICAL">Técnico</SelectItem>
                </SelectContent>
              </Select>
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
