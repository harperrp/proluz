import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { motion, Reorder } from 'framer-motion';
import { 
  GripVertical, 
  Plus, 
  Clock, 
  MapPin, 
  User, 
  AlertTriangle,
  CheckCircle,
  Wrench,
  MoreHorizontal,
} from 'lucide-react';

interface ServiceOrder {
  id: string;
  poleId: string;
  address: string;
  description: string;
  priority: 'alta' | 'media' | 'baixa';
  assignedTo: string;
  createdAt: string;
  status: 'aberto' | 'em_manutencao' | 'resolvido';
}

const INITIAL_ORDERS: ServiceOrder[] = [
  { id: 'OS-001', poleId: 'P-001', address: 'Av. Principal, 200', description: 'Poste completamente apagado', priority: 'alta', assignedTo: 'Carlos Oliveira', createdAt: '2024-01-15', status: 'aberto' },
  { id: 'OS-002', poleId: 'P-004', address: 'Rua Nova, 75', description: 'Lâmpada piscando', priority: 'media', assignedTo: 'Ana Costa', createdAt: '2024-01-14', status: 'aberto' },
  { id: 'OS-003', poleId: 'P-007', address: 'Rua Bela Vista, 300', description: 'Luminosidade reduzida', priority: 'baixa', assignedTo: 'Carlos Oliveira', createdAt: '2024-01-16', status: 'em_manutencao' },
  { id: 'OS-004', poleId: 'P-002', address: 'Rua Principal, 210', description: 'Poste com fiação exposta', priority: 'alta', assignedTo: 'Ana Costa', createdAt: '2024-01-12', status: 'em_manutencao' },
  { id: 'OS-005', poleId: 'P-003', address: 'Rua das Palmeiras, 55', description: 'Lâmpada queimada substituída', priority: 'media', assignedTo: 'Carlos Oliveira', createdAt: '2024-01-10', status: 'resolvido' },
  { id: 'OS-006', poleId: 'P-005', address: 'Rua das Flores, 12', description: 'Reparo na base do poste', priority: 'baixa', assignedTo: 'Ana Costa', createdAt: '2024-01-08', status: 'resolvido' },
];

const priorityConfig = {
  alta: { label: 'Alta', color: 'bg-destructive/20 text-destructive border-destructive/30' },
  media: { label: 'Média', color: 'bg-warning/20 text-warning border-warning/30' },
  baixa: { label: 'Baixa', color: 'bg-muted text-muted-foreground border-border' },
};

const columns = [
  { key: 'aberto' as const, label: 'Aberto', icon: <AlertTriangle className="h-4 w-4" />, color: 'text-warning' },
  { key: 'em_manutencao' as const, label: 'Em Manutenção', icon: <Wrench className="h-4 w-4" />, color: 'text-primary' },
  { key: 'resolvido' as const, label: 'Resolvido', icon: <CheckCircle className="h-4 w-4" />, color: 'text-success' },
];

function KanbanCard({ order }: { order: ServiceOrder }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="premium-card p-4 cursor-grab active:cursor-grabbing hover:border-primary/30 transition-all group"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-semibold text-primary">{order.id}</span>
          <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${priorityConfig[order.priority].color}`}>
            {priorityConfig[order.priority].label}
          </Badge>
        </div>
        <button className="opacity-0 group-hover:opacity-100 p-1 hover:bg-muted rounded transition-all">
          <MoreHorizontal className="h-3.5 w-3.5 text-muted-foreground" />
        </button>
      </div>

      <p className="text-sm font-medium mb-2 leading-snug">{order.description}</p>

      <div className="space-y-1.5 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <MapPin className="h-3 w-3" />
          <span>{order.address}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <User className="h-3 w-3" />
          <span>{order.assignedTo}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Clock className="h-3 w-3" />
          <span>{order.createdAt}</span>
        </div>
      </div>
    </motion.div>
  );
}

export default function DashboardServiceOrders() {
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [draggedOrder, setDraggedOrder] = useState<ServiceOrder | null>(null);

  const moveOrder = (orderId: string, newStatus: ServiceOrder['status']) => {
    setOrders(prev =>
      prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o)
    );
  };

  const handleDragStart = (e: React.DragEvent, order: ServiceOrder) => {
    setDraggedOrder(order);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, status: ServiceOrder['status']) => {
    e.preventDefault();
    if (draggedOrder) {
      moveOrder(draggedOrder.id, status);
      setDraggedOrder(null);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Ordens de Serviço</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Gerencie as ordens de manutenção por status
            </p>
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Nova Ordem
          </Button>
        </div>

        {/* Kanban Board */}
        <div className="grid lg:grid-cols-3 gap-4">
          {columns.map(col => {
            const colOrders = orders.filter(o => o.status === col.key);
            return (
              <div
                key={col.key}
                className="space-y-3"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, col.key)}
              >
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-2">
                    <span className={col.color}>{col.icon}</span>
                    <span className="text-sm font-medium">{col.label}</span>
                    <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-muted text-[10px] font-semibold px-1.5">
                      {colOrders.length}
                    </span>
                  </div>
                </div>

                <div className="space-y-3 min-h-[200px] p-2 rounded-xl bg-muted/20 border border-dashed border-border/50">
                  {colOrders.map(order => (
                    <div
                      key={order.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, order)}
                    >
                      <KanbanCard order={order} />
                    </div>
                  ))}
                  {colOrders.length === 0 && (
                    <div className="flex items-center justify-center h-[100px] text-xs text-muted-foreground">
                      Arraste ordens aqui
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}
