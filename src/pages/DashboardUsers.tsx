import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Users, 
  Search, 
  Plus, 
  Mail, 
  MoreHorizontal,
  Shield,
  UserCheck,
  Wrench
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
import { User, UserRole } from '@/types';
import { useAuth } from '@/contexts/AuthContext';

const MOCK_USERS: User[] = [
  { id: '1', email: 'joao.silva@cidade.gov.br', name: 'João Silva', role: 'CITY_HALL_ADMIN', cityHallId: '1', createdAt: new Date('2023-01-15') },
  { id: '2', email: 'maria.santos@cidade.gov.br', name: 'Maria Santos', role: 'SECRETARY', cityHallId: '1', createdAt: new Date('2023-03-20') },
  { id: '3', email: 'carlos.oliveira@cidade.gov.br', name: 'Carlos Oliveira', role: 'TECHNICAL', cityHallId: '1', createdAt: new Date('2023-05-10') },
  { id: '4', email: 'ana.costa@cidade.gov.br', name: 'Ana Costa', role: 'TECHNICAL', cityHallId: '1', createdAt: new Date('2023-07-05') },
  { id: '5', email: 'pedro.lima@cidade.gov.br', name: 'Pedro Lima', role: 'SECRETARY', cityHallId: '1', createdAt: new Date('2023-09-12') },
];

const roleConfig: Record<UserRole, { label: string; icon: typeof Shield; className: string }> = {
  ADMIN: { label: 'Administrador Geral', icon: Shield, className: 'bg-primary text-primary-foreground' },
  CITY_HALL_ADMIN: { label: 'Admin. Municipal', icon: UserCheck, className: 'bg-chart-1 text-white' },
  SECRETARY: { label: 'Secretário', icon: UserCheck, className: 'bg-chart-2 text-white' },
  TECHNICAL: { label: 'Técnico', icon: Wrench, className: 'bg-chart-3 text-foreground' },
  CITIZEN: { label: 'Cidadão', icon: Users, className: 'bg-muted text-muted-foreground' },
};

export default function DashboardUsers() {
  const [searchTerm, setSearchTerm] = useState('');
  const { hasPermission } = useAuth();

  const filteredUsers = MOCK_USERS.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            <h1 className="text-2xl lg:text-3xl font-bold">Usuários</h1>
            <p className="text-muted-foreground">
              Gerencie os usuários do sistema
            </p>
          </div>

          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Novo Usuário
          </Button>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-4">
          {Object.entries(roleConfig).filter(([role]) => role !== 'CITIZEN' && role !== 'ADMIN').map(([role, config]) => {
            const count = MOCK_USERS.filter(u => u.role === role).length;
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
              <Input
                placeholder="Buscar por nome ou e-mail..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-9 max-w-md"
              />
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Lista de Usuários
            </CardTitle>
            <CardDescription>
              {filteredUsers.length} usuários cadastrados
            </CardDescription>
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
                        <TableCell>
                          <Badge className={role.className}>
                            {role.label}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatDate(user.createdAt)}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>Editar</DropdownMenuItem>
                              <DropdownMenuItem>Redefinir Senha</DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive">
                                Desativar
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
    </DashboardLayout>
  );
}
