import { useState, useMemo, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Send, Loader2, CheckCircle, AlertTriangle, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { dbInsert, dbSelect } from '@/lib/supabase';
import type { Pole } from '@/types';
import 'leaflet/dist/leaflet.css';

const complaintSchema = z.object({
  name: z.string().min(3),
  cpf: z.string().regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/),
  phone: z.string().optional(),
  observations: z.string().max(500).optional(),
});

type ComplaintFormData = z.infer<typeof complaintSchema>;

interface CityHallRow { id: string; name: string; city: string; state: string; status: 'ATIVO' | 'INATIVO' }
interface PoleRow { code: string; latitude: number; longitude: number; status: Pole['status']; city_hall_id: string; address: string | null }

const icon = (color: string) => new L.Icon({ iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`, shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png', iconSize: [25, 41], iconAnchor: [12, 41] });

export function ComplaintForm() {
  const [selectedCityHallId, setSelectedCityHallId] = useState('');
  const [selectedPole, setSelectedPole] = useState<Pole | null>(null);
  const [cityHalls, setCityHalls] = useState<CityHallRow[]>([]);
  const [poles, setPoles] = useState<Pole[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { register, handleSubmit, setValue, formState: { errors }, reset } = useForm<ComplaintFormData>({ resolver: zodResolver(complaintSchema) });

  useEffect(() => { void (async () => {
    const rows = await dbSelect<CityHallRow>('city_halls?select=id,name,city,state,status&status=eq.ATIVO&order=city.asc,name.asc');
    setCityHalls(rows);
  })(); }, []);

  useEffect(() => {
    if (!selectedCityHallId) {
      setPoles([]);
      return;
    }
    void (async () => {
    const rows = await dbSelect<PoleRow>(`lighting_points?select=code,latitude,longitude,status,city_hall_id,address&city_hall_id=eq.${selectedCityHallId}`);
    setPoles(rows.map((r) => ({ id: r.code, latitude: r.latitude, longitude: r.longitude, status: r.status, cityHallId: r.city_hall_id, address: r.address ?? undefined, createdAt: new Date(), updatedAt: new Date() })));
    })();
  }, [selectedCityHallId]);

  const cityOptions = useMemo(() => {
    const duplicatedCityState = cityHalls.reduce<Record<string, number>>((acc, cityHall) => {
      const key = `${cityHall.city}-${cityHall.state}`;
      acc[key] = (acc[key] ?? 0) + 1;
      return acc;
    }, {});

    return cityHalls
      .map((cityHall) => {
        const key = `${cityHall.city}-${cityHall.state}`;
        const showCityHallName = (duplicatedCityState[key] ?? 0) > 1;
        const baseLabel = `${cityHall.city} - ${cityHall.state}`;
        return {
          id: cityHall.id,
          label: showCityHallName ? `${baseLabel} · ${cityHall.name}` : baseLabel,
        };
      })
      .sort((a, b) => a.label.localeCompare(b.label, 'pt-BR'));
  }, [cityHalls]);

  const mapCenter = useMemo(() => {
    if (poles.length === 0) return { lat: -15.3989, lng: -42.3091 };
    return { lat: poles[0].latitude, lng: poles[0].longitude };
  }, [poles]);

  const onSubmit = async (data: ComplaintFormData) => {
    if (!selectedPole || !selectedCityHallId) return toast.error('Selecione um poste.');
    if (selectedPole.status === 'QUEIMADO') return toast.info('Este poste já está queimado e em tratamento.');

    setIsSubmitting(true);
    try {
      await dbInsert('complaints', {
        lighting_point_code: selectedPole.id,
        city_hall_id: selectedCityHallId,
        latitude: selectedPole.latitude,
        longitude: selectedPole.longitude,
        description: data.observations ?? 'Poste apagado',
        status: 'PENDENTE',
        citizen_cpf: data.cpf,
        citizen_name: data.name,
        citizen_phone: data.phone ?? null,
      });
      setIsSubmitted(true);
      toast.success('Denúncia registrada com sucesso.');
    } catch {
      toast.error('Falha ao registrar denúncia.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatCPF = (value: string) => value.replace(/\D/g, '').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})/, '$1-$2').replace(/(-\d{2})\d+?$/, '$1');

  if (isSubmitted) {
    return <div className="text-center py-10"><CheckCircle className="h-10 w-10 text-success mx-auto mb-3" /><p>Denúncia enviada com sucesso.</p><Button className="mt-4" onClick={() => { setIsSubmitted(false); setSelectedPole(null); setSelectedCityHallId(''); reset(); }}>Nova denúncia</Button></div>;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label>Cidade *</Label>
        <Select value={selectedCityHallId} onValueChange={(value) => { setSelectedCityHallId(value); setSelectedPole(null); }}>
          <SelectTrigger><SelectValue placeholder="Selecione a cidade" /></SelectTrigger>
          <SelectContent>
            {cityOptions.length > 0 ? cityOptions.map((cityOption) => (
              <SelectItem key={cityOption.id} value={cityOption.id}>{cityOption.label}</SelectItem>
            )) : (
              <div className="px-2 py-3 text-sm text-muted-foreground">
                Nenhuma prefeitura ativa disponível no momento.
              </div>
            )}
          </SelectContent>
        </Select>
      </div>

      {selectedCityHallId && (
        <div className="space-y-2">
          <Label>Poste *</Label>
          <div className="rounded-lg border overflow-hidden" style={{ height: 320 }}>
            <MapContainer key={selectedCityHallId} center={[mapCenter.lat, mapCenter.lng]} zoom={15} style={{ height: '100%', width: '100%' }}>
              <TileLayer attribution='&copy; OpenStreetMap' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              {poles.map((pole) => (
                <Marker key={pole.id} position={[pole.latitude, pole.longitude]} icon={selectedPole?.id === pole.id ? icon('blue') : icon(pole.status === 'QUEIMADO' ? 'red' : 'green')} eventHandlers={{ click: () => setSelectedPole(pole) }}>
                  <Popup>{pole.id} - {pole.status}</Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
          {poles.length === 0 && (
            <p className="text-xs text-muted-foreground">Não há postes cadastrados para a prefeitura selecionada.</p>
          )}
          {selectedPole && <p className="text-xs text-muted-foreground flex items-center gap-1"><MapPin className="h-3 w-3" />{selectedPole.id} {selectedPole.address}</p>}
          {selectedPole?.status === 'QUEIMADO' && <p className="text-warning text-xs flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Já está queimado.</p>}
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-2"><Label>Nome *</Label><Input {...register('name')} />{errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}</div>
        <div className="space-y-2"><Label>CPF *</Label><Input {...register('cpf')} maxLength={14} onChange={(e) => setValue('cpf', formatCPF(e.target.value))} />{errors.cpf && <p className="text-xs text-destructive">CPF inválido</p>}</div>
      </div>
      <div className="space-y-2"><Label>Telefone</Label><Input {...register('phone')} /></div>
      <div className="space-y-2"><Label>Observações</Label><Textarea {...register('observations')} rows={4} /></div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>{isSubmitting ? <><Loader2 className="h-4 w-4 animate-spin mr-2" />Enviando...</> : <><Send className="h-4 w-4 mr-2" />Enviar denúncia</>}</Button>
    </form>
  );
}
