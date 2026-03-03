import { useState, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Send, Loader2, CheckCircle, AlertCircle, AlertTriangle, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { MOCK_POLES, MOCK_CITY_HALLS_LIST } from '@/data/mockData';
import type { Pole } from '@/types';

// Fix leaflet icons
import 'leaflet/dist/leaflet.css';

const greenIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const redIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const blueIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const complaintSchema = z.object({
  name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres').max(100),
  cpf: z.string().regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, 'CPF inválido (formato: 000.000.000-00)'),
  phone: z.string().optional(),
  observations: z.string().max(500).optional(),
});

type ComplaintFormData = z.infer<typeof complaintSchema>;

export function ComplaintForm() {
  const [selectedCityHallId, setSelectedCityHallId] = useState<string>('');
  const [selectedPole, setSelectedPole] = useState<Pole | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<ComplaintFormData>({
    resolver: zodResolver(complaintSchema),
  });

  const cityHalls = MOCK_CITY_HALLS_LIST.filter(ch => ch.status === 'ATIVO');

  const cityPoles = useMemo(() => {
    if (!selectedCityHallId) return [];
    return MOCK_POLES.filter(p => p.cityHallId === selectedCityHallId);
  }, [selectedCityHallId]);

  const mapCenter = useMemo(() => {
    if (cityPoles.length === 0) return { lat: -15.3989, lng: -42.3091 };
    const avgLat = cityPoles.reduce((s, p) => s + p.latitude, 0) / cityPoles.length;
    const avgLng = cityPoles.reduce((s, p) => s + p.longitude, 0) / cityPoles.length;
    return { lat: avgLat, lng: avgLng };
  }, [cityPoles]);

  const isPoleAlreadyBurned = selectedPole?.status === 'QUEIMADO';

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    return numbers
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1');
  };

  const onSubmit = async (data: ComplaintFormData) => {
    if (!selectedPole) {
      toast.error('Selecione um poste', {
        description: 'Clique em um poste no mapa para selecioná-lo.',
      });
      return;
    }

    if (isPoleAlreadyBurned) {
      toast.info('Este poste já está com reparo solicitado.');
      return;
    }

    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));

    console.log('Denúncia enviada:', {
      ...data,
      poleId: selectedPole.id,
      latitude: selectedPole.latitude,
      longitude: selectedPole.longitude,
      cityHallId: selectedCityHallId,
    });

    setIsSubmitting(false);
    setIsSubmitted(true);

    toast.success('Denúncia registrada com sucesso!', {
      description: 'Você receberá atualizações sobre o status.',
    });
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setSelectedPole(null);
    setSelectedCityHallId('');
    reset();
  };

  if (isSubmitted) {
    return (
      <div className="text-center py-12 space-y-4 animate-fade-in">
        <div className="flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
            <CheckCircle className="h-8 w-8 text-success" />
          </div>
        </div>
        <h3 className="text-xl font-semibold">Denúncia Enviada!</h3>
        <p className="text-muted-foreground max-w-md mx-auto">
          Sua denúncia para o poste <strong>{selectedPole?.id}</strong> foi registrada com sucesso.
          Nossa equipe irá analisar e tomar as providências necessárias.
        </p>
        <Button onClick={handleReset} variant="outline">
          Fazer Nova Denúncia
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* City Selection */}
      <div className="space-y-2">
        <Label>Cidade *</Label>
        <Select
          value={selectedCityHallId}
          onValueChange={value => {
            setSelectedCityHallId(value);
            setSelectedPole(null);
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione a cidade" />
          </SelectTrigger>
          <SelectContent>
            {cityHalls.map(ch => (
              <SelectItem key={ch.id} value={ch.id}>
                {ch.city} — {ch.state}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Map with poles */}
      {selectedCityHallId && (
        <div className="space-y-2">
          <Label>Selecione o Poste no Mapa *</Label>
          <p className="text-xs text-muted-foreground mb-2">
            <span className="inline-flex items-center gap-1"><span className="inline-block w-2 h-2 rounded-full bg-green-500" /> Funcionando</span>
            {' · '}
            <span className="inline-flex items-center gap-1"><span className="inline-block w-2 h-2 rounded-full bg-red-500" /> Queimado</span>
            {' · '}
            <span className="inline-flex items-center gap-1"><span className="inline-block w-2 h-2 rounded-full bg-blue-500" /> Selecionado</span>
          </p>
          <div className="rounded-lg border overflow-hidden" style={{ height: 350 }}>
            <MapContainer
              key={selectedCityHallId}
              center={[mapCenter.lat, mapCenter.lng]}
              zoom={15}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {cityPoles.map(pole => (
                <Marker
                  key={pole.id}
                  position={[pole.latitude, pole.longitude]}
                  icon={
                    selectedPole?.id === pole.id
                      ? blueIcon
                      : pole.status === 'QUEIMADO'
                        ? redIcon
                        : greenIcon
                  }
                  eventHandlers={{
                    click: () => setSelectedPole(pole),
                  }}
                >
                  <Popup>
                    <div className="text-xs space-y-1">
                      <p className="font-bold">{pole.id}</p>
                      {pole.address && <p>{pole.address}</p>}
                      <p>Status: {pole.status === 'FUNCIONANDO' ? '✅ Funcionando' : '🔴 Queimado'}</p>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>

          {/* Selected pole info */}
          {selectedPole && (
            <div className={`rounded-lg border p-3 ${
              isPoleAlreadyBurned 
                ? 'bg-warning/10 border-warning/30' 
                : 'bg-primary/5 border-primary/20'
            }`}>
              <div className="flex items-start gap-3">
                {isPoleAlreadyBurned ? (
                  <AlertTriangle className="h-5 w-5 text-warning shrink-0 mt-0.5" />
                ) : (
                  <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                )}
                <div className="text-sm">
                  <p className="font-medium">
                    Poste {selectedPole.id}
                    {selectedPole.address && ` — ${selectedPole.address}`}
                  </p>
                  {isPoleAlreadyBurned ? (
                    <p className="text-warning font-medium mt-1">
                      ⚠️ Este poste já está com status "Queimado". O conserto já foi solicitado.
                    </p>
                  ) : (
                    <p className="text-muted-foreground">
                      Status: Funcionando · Clique em "Enviar" para reportar problema.
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {cityPoles.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              Nenhum poste cadastrado para esta cidade.
            </p>
          )}
        </div>
      )}

      {/* Personal data */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Nome Completo *</Label>
          <Input
            id="name"
            placeholder="Seu nome completo"
            {...register('name')}
            className={errors.name ? 'border-destructive' : ''}
          />
          {errors.name && (
            <p className="text-xs text-destructive">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="cpf">CPF *</Label>
          <Input
            id="cpf"
            placeholder="000.000.000-00"
            maxLength={14}
            {...register('cpf')}
            onChange={e => {
              const formatted = formatCPF(e.target.value);
              e.target.value = formatted;
              setValue('cpf', formatted);
            }}
            className={errors.cpf ? 'border-destructive' : ''}
          />
          {errors.cpf && (
            <p className="text-xs text-destructive">{errors.cpf.message}</p>
          )}
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="phone">Telefone (opcional)</Label>
          <Input
            id="phone"
            placeholder="(00) 00000-0000"
            {...register('phone')}
          />
        </div>
      </div>

      {/* Observations */}
      <div className="space-y-2">
        <Label htmlFor="observations">Observações (opcional)</Label>
        <Textarea
          id="observations"
          placeholder="Descreva detalhes adicionais sobre o problema, se desejar..."
          rows={3}
          {...register('observations')}
        />
      </div>

      {/* Warning */}
      <div className="flex items-start gap-3 rounded-lg border bg-warning/10 p-4">
        <AlertCircle className="h-5 w-5 text-warning shrink-0 mt-0.5" />
        <div className="text-sm">
          <p className="font-medium text-warning">Atenção</p>
          <p className="text-muted-foreground">
            Denúncias falsas ou duplicadas podem resultar em bloqueio do CPF.
            Limite de 3 denúncias por dia.
          </p>
        </div>
      </div>

      <Button
        type="submit"
        size="lg"
        className="w-full"
        disabled={isSubmitting || !selectedPole || isPoleAlreadyBurned}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            Enviando...
          </>
        ) : (
          <>
            <Send className="h-4 w-4 mr-2" />
            Enviar Denúncia
          </>
        )}
      </Button>
    </form>
  );
}
