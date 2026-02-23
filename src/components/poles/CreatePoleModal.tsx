import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PoleStatus } from '@/types';
import { toast } from 'sonner';

interface CreatePoleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated: (pole: { id: string; address: string; neighborhood: string; latitude: number; longitude: number; status: PoleStatus }) => void;
  nextId: string;
}

const NEIGHBORHOODS = ['Centro', 'Nova Esperança', 'Vila Nova', 'Jardim das Acácias', 'Bela Vista', 'Alto da Serra', 'Industrial'];

export function CreatePoleModal({ open, onOpenChange, onCreated, nextId }: CreatePoleModalProps) {
  const [address, setAddress] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [status, setStatus] = useState<PoleStatus>('FUNCIONANDO');

  const handleSubmit = () => {
    if (!address || !neighborhood || !latitude || !longitude) {
      toast.error('Preencha todos os campos obrigatórios.');
      return;
    }

    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);
    if (isNaN(lat) || isNaN(lng)) {
      toast.error('Coordenadas inválidas.');
      return;
    }

    onCreated({ id: nextId, address, neighborhood, latitude: lat, longitude: lng, status });
    toast.success('Poste cadastrado!', { description: `${nextId} — ${address}` });
    resetForm();
    onOpenChange(false);
  };

  const resetForm = () => {
    setAddress('');
    setNeighborhood('');
    setLatitude('');
    setLongitude('');
    setStatus('FUNCIONANDO');
  };

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => {
          setLatitude(pos.coords.latitude.toFixed(6));
          setLongitude(pos.coords.longitude.toFixed(6));
          toast.success('Localização capturada!');
        },
        () => toast.error('Não foi possível obter a localização.')
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) resetForm(); onOpenChange(v); }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Cadastrar Novo Poste</DialogTitle>
          <DialogDescription>ID do poste: {nextId}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Endereço *</Label>
            <Input placeholder="Ex: Rua das Flores, 100" value={address} onChange={e => setAddress(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label>Bairro *</Label>
            <Select value={neighborhood} onValueChange={setNeighborhood}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o bairro" />
              </SelectTrigger>
              <SelectContent>
                {NEIGHBORHOODS.map(n => (
                  <SelectItem key={n} value={n}>{n}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Latitude *</Label>
              <Input placeholder="-15.3989" value={latitude} onChange={e => setLatitude(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Longitude *</Label>
              <Input placeholder="-42.3091" value={longitude} onChange={e => setLongitude(e.target.value)} />
            </div>
          </div>

          <Button variant="outline" size="sm" onClick={handleGetLocation} type="button" className="w-full">
            Usar minha localização atual
          </Button>

          <div className="space-y-2">
            <Label>Status Inicial</Label>
            <Select value={status} onValueChange={(v) => setStatus(v as PoleStatus)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="FUNCIONANDO">Funcionando</SelectItem>
                <SelectItem value="QUEIMADO">Queimado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={handleSubmit}>Cadastrar Poste</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
