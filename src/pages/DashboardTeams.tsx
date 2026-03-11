import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { 
  Users, 
  Clock, 
  CheckCircle, 
  MapPin, 
  Phone, 
  Mail,
  Wrench,
  TrendingUp,
  Activity,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  avatar: string;
  status: 'disponivel' | 'em_campo' | 'indisponivel';
  ordersAssigned: number;
  ordersCompleted: number;
  avgResolutionTime: number;
  monthlyPerformance: { week: string; resolvidos: number }[];
}

const TEAM_MEMBERS: TeamMember[] = [
  {
    id: '1',
    name: 'Carlos Oliveira',
    role: 'Técnico Sênior',
    email: 'carlos@cidade.gov.br',
    phone: '(11) 99999-1234',
    avatar: 'CO',
    status: 'em_campo',
    ordersAssigned: 5,
    ordersCompleted: 42,
    avgResolutionTime: 2.3,
    monthlyPerformance: [
      { week: 'S1', resolvidos: 8 },
      { week: 'S2', resolvidos: 12 },
      { week: 'S3', resolvidos: 10 },
      { week: 'S4', resolvidos: 12 },
    ],
  },
  {
    id: '2',
    name: 'Ana Costa',
    role: 'Técnica Plena',
    email: 'ana@cidade.gov.br',
    phone: '(11) 99999-5678',
    avatar: 'AC',
    status: 'disponivel',
    ordersAssigned: 3,
    ordersCompleted: 35,
    avgResolutionTime: 3.1,
    monthlyPerformance: [
      { week: 'S1', resolvidos: 6 },
      { week: 'S2', resolvidos: 9 },
      { week: 'S3', resolvidos: 11 },
      { week: 'S4', resolvidos: 9 },
    ],
  },
  {
    id: '3',
    name: 'Pedro Lima',
    role: 'Técnico Júnior',
    email: 'pedro@cidade.gov.br',
    phone: '(11) 99999-9012',
    avatar: 'PL',
    status: 'indisponivel',
    ordersAssigned: 0,
    ordersCompleted: 18,
    avgResolutionTime: 4.5,
    monthlyPerformance: [
      { week: 'S1', resolvidos: 4 },
      { week: 'S2', resolvidos: 5 },
      { week: 'S3', resolvidos: 3 },
      { week: 'S4', resolvidos: 6 },
    ],
  },
];

const statusConfig = {
  disponivel: { label: 'Disponível', className: 'bg-success/20 text-success border-success/30' },
  em_campo: { label: 'Em Campo', className: 'bg-primary/20 text-primary border-primary/30' },
  indisponivel: { label: 'Indisponível', className: 'bg-muted text-muted-foreground border-border' },
};

const tooltipStyle = {
  backgroundColor: 'hsl(220, 35%, 10%)',
  border: '1px solid hsl(220, 20%, 18%)',
  borderRadius: '8px',
  color: 'hsl(210, 40%, 98%)',
  fontSize: '12px',
};

export default function DashboardTeams() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Equipes</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Painel de desempenho da equipe técnica
            </p>
          </div>
          <Button className="gap-2">
            <Users className="h-4 w-4" />
            Adicionar Membro
          </Button>
        </div>

        {/* Summary Stats */}
        <div className="grid gap-4 sm:grid-cols-4">
          {[
            { label: 'Total de Técnicos', value: '3', icon: <Users className="h-5 w-5" /> },
            { label: 'Em Campo Agora', value: '1', icon: <MapPin className="h-5 w-5" /> },
            { label: 'Ordens Ativas', value: '8', icon: <Wrench className="h-5 w-5" /> },
            { label: 'Resolução Média', value: '3.3h', icon: <Clock className="h-5 w-5" /> },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="premium-card p-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                  <p className="text-2xl font-bold mt-1 font-mono">{stat.value}</p>
                </div>
                <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-primary/10 text-primary">
                  {stat.icon}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Team Members */}
        <div className="grid gap-4 lg:grid-cols-3">
          {TEAM_MEMBERS.map((member, idx) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + idx * 0.1 }}
            >
              <Card className="premium-card border-border/50 hover:border-primary/30 transition-all">
                <CardContent className="p-5">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20">
                      <span className="text-sm font-bold text-primary">{member.avatar}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-sm truncate">{member.name}</h3>
                        <Badge variant="outline" className={`text-[10px] ${statusConfig[member.status].className}`}>
                          {statusConfig[member.status].label}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{member.role}</p>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="text-center p-2 rounded-lg bg-muted/30">
                      <p className="text-lg font-bold font-mono">{member.ordersAssigned}</p>
                      <p className="text-[10px] text-muted-foreground">Ativas</p>
                    </div>
                    <div className="text-center p-2 rounded-lg bg-muted/30">
                      <p className="text-lg font-bold font-mono">{member.ordersCompleted}</p>
                      <p className="text-[10px] text-muted-foreground">Concluídas</p>
                    </div>
                    <div className="text-center p-2 rounded-lg bg-muted/30">
                      <p className="text-lg font-bold font-mono">{member.avgResolutionTime}h</p>
                      <p className="text-[10px] text-muted-foreground">Média</p>
                    </div>
                  </div>

                  {/* Mini chart */}
                  <div className="h-[80px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={member.monthlyPerformance} barSize={20}>
                        <XAxis dataKey="week" tick={{ fill: 'hsl(215, 15%, 55%)', fontSize: 10 }} axisLine={false} tickLine={false} />
                        <Tooltip contentStyle={tooltipStyle} />
                        <Bar dataKey="resolvidos" fill="hsl(217, 91%, 60%)" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Contact */}
                  <div className="flex gap-2 mt-3">
                    <Button variant="outline" size="sm" className="flex-1 text-xs gap-1.5 h-8">
                      <Mail className="h-3 w-3" />
                      E-mail
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1 text-xs gap-1.5 h-8">
                      <Phone className="h-3 w-3" />
                      Ligar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
