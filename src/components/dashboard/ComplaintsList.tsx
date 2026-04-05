import { useEffect, useState } from 'react';
import { MapPin, Clock, CheckCircle, XCircle, AlertCircle, Eye } from 'lucide-react';
import { Complaint, ComplaintStatus, REJECTION_REASONS } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { dbPatch, dbSelect } from '@/lib/supabase';

const statusConfig: Record<ComplaintStatus, { label: string; className: string; icon: typeof AlertCircle }> = {
  PENDENTE: { label: 'Pendente', className: 'status-badge-pending', icon: AlertCircle },
  APROVADA: { label: 'Aprovada', className: 'status-badge-approved', icon: CheckCircle },
  REJEITADA: { label: 'Rejeitada', className: 'status-badge-rejected', icon: XCircle },
};

interface ComplaintRow {
  id: string; lighting_point_code: string | null; latitude: number; longitude: number; description: string; status: ComplaintStatus;
  rejection_reason: string | null; secretary_observations: string | null; citizen_cpf: string; citizen_name: string; citizen_phone: string | null; city_hall_id: string; created_at: string; updated_at: string;
}

const mapRow = (r: ComplaintRow): Complaint => ({
  id: r.id, poleId: r.lighting_point_code ?? undefined, latitude: r.latitude, longitude: r.longitude, description: r.description, status: r.status,
  rejectionReason: r.rejection_reason ?? undefined, secretaryObservations: r.secretary_observations ?? undefined, citizenCpf: r.citizen_cpf, citizenName: r.citizen_name, citizenPhone: r.citizen_phone ?? undefined, cityHallId: r.city_hall_id, createdAt: new Date(r.created_at), updatedAt: new Date(r.updated_at),
});

export function ComplaintsList() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [action, setAction] = useState<'view' | 'approve' | 'reject'>('view');
  const [rejectionReason, setRejectionReason] = useState('');
  const [observations, setObservations] = useState('');

  const load = async () => {
    const rows = await dbSelect<ComplaintRow>('complaints?select=*&order=created_at.desc');
    setComplaints(rows.map(mapRow));
  };

  useEffect(() => { void load(); }, []);

  const handleAction = (complaint: Complaint, actionType: 'view' | 'approve' | 'reject') => {
    setSelectedComplaint(complaint);
    setAction(actionType);
    setDialogOpen(true);
    setRejectionReason('');
    setObservations('');
  };

  const handleApprove = async () => {
    if (!selectedComplaint) return;
    await dbPatch(`complaints?id=eq.${selectedComplaint.id}`, { status: 'APROVADA', secretary_observations: observations, updated_at: new Date().toISOString() });
    setDialogOpen(false);
    toast.success('Denúncia aprovada');
    await load();
  };

  const handleReject = async () => {
    if (!selectedComplaint || !rejectionReason) return;
    await dbPatch(`complaints?id=eq.${selectedComplaint.id}`, { status: 'REJEITADA', rejection_reason: rejectionReason, secretary_observations: observations, updated_at: new Date().toISOString() });
    setDialogOpen(false);
    toast.success('Denúncia rejeitada');
    await load();
  };

  const formatDate = (date: Date) => new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(date);

  return (
    <div className="space-y-4">
      {complaints.map((complaint) => {
        const status = statusConfig[complaint.status];
        const StatusIcon = status.icon;
        return (
          <div key={complaint.id} className="rounded-lg border bg-card p-4">
            <div className="flex justify-between gap-4">
              <div className="space-y-2">
                <Badge className={cn('gap-1', status.className)}><StatusIcon className="h-3 w-3" />{status.label}</Badge>
                <p className="text-sm">{complaint.description}</p>
                <div className="text-xs text-muted-foreground flex gap-3"><span className="flex gap-1 items-center"><MapPin className="h-3 w-3" />{complaint.latitude.toFixed(4)}, {complaint.longitude.toFixed(4)}</span><span className="flex gap-1 items-center"><Clock className="h-3 w-3" />{formatDate(complaint.createdAt)}</span></div>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={() => handleAction(complaint, 'view')}><Eye className="h-4 w-4" /></Button>
                {complaint.status === 'PENDENTE' && <><Button variant="success" size="sm" onClick={() => handleAction(complaint, 'approve')}>Aprovar</Button><Button variant="destructive" size="sm" onClick={() => handleAction(complaint, 'reject')}>Rejeitar</Button></>}
              </div>
            </div>
          </div>
        );
      })}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{action === 'view' ? 'Detalhes' : action === 'approve' ? 'Aprovar denúncia' : 'Rejeitar denúncia'}</DialogTitle><DialogDescription>{selectedComplaint?.description}</DialogDescription></DialogHeader>
          {action !== 'view' && (
            <div className="space-y-3">
              {action === 'reject' && <Select value={rejectionReason} onValueChange={setRejectionReason}><SelectTrigger><SelectValue placeholder="Motivo" /></SelectTrigger><SelectContent>{REJECTION_REASONS.map((reason) => <SelectItem key={reason} value={reason}>{reason}</SelectItem>)}</SelectContent></Select>}
              <Textarea placeholder="Observações" value={observations} onChange={(e) => setObservations(e.target.value)} />
            </div>
          )}
          <DialogFooter>{action === 'approve' && <Button onClick={() => void handleApprove()}>Confirmar</Button>}{action === 'reject' && <Button variant="destructive" disabled={!rejectionReason} onClick={() => void handleReject()}>Confirmar</Button>}</DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
