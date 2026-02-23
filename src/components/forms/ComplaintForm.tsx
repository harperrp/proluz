import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { MapPin, Camera, Send, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
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
import { BRAZILIAN_STATES } from '@/types';

const complaintSchema = z.object({
  name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres').max(100),
  cpf: z.string().regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, 'CPF inválido (formato: 000.000.000-00)'),
  phone: z.string().optional(),
  city: z.string().min(2, 'Selecione uma cidade'),
  state: z.string().min(2, 'Selecione um estado'),
  description: z.string().min(10, 'Descreva o problema com pelo menos 10 caracteres').max(500),
});

type ComplaintFormData = z.infer<typeof complaintSchema>;

export function ComplaintForm() {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
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

  const getLocation = () => {
    setLocationLoading(true);
    setLocationError(null);

    if (!navigator.geolocation) {
      setLocationError('Geolocalização não suportada pelo navegador');
      setLocationLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      position => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setLocationLoading(false);
      },
      error => {
        setLocationError('Não foi possível obter sua localização. Verifique as permissões.');
        setLocationLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  useEffect(() => {
    getLocation();
  }, []);

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    return numbers
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1');
  };

  const onSubmit = async (data: ComplaintFormData) => {
    if (!location) {
      toast.error('Localização necessária', {
        description: 'Por favor, permita o acesso à sua localização.',
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    console.log('Denúncia enviada:', { ...data, location });
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    
    toast.success('Denúncia registrada com sucesso!', {
      description: 'Você receberá atualizações sobre o status.',
    });
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
          Sua denúncia foi registrada com sucesso. Nossa equipe irá analisar e tomar as providências necessárias.
        </p>
        <Button onClick={() => { setIsSubmitted(false); reset(); }} variant="outline">
          Fazer Nova Denúncia
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Location Status */}
      <div className="rounded-lg border bg-muted/50 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
              location ? 'bg-success/10 text-success' : locationError ? 'bg-destructive/10 text-destructive' : 'bg-muted'
            }`}>
              <MapPin className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-medium">
                {locationLoading ? 'Obtendo localização...' : 
                 location ? 'Localização obtida' : 
                 locationError ? 'Erro de localização' : 'Localização'}
              </p>
              {location && (
                <p className="text-xs text-muted-foreground">
                  {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
                </p>
              )}
              {locationError && (
                <p className="text-xs text-destructive">{locationError}</p>
              )}
            </div>
          </div>
          {!locationLoading && (
            <Button type="button" variant="outline" size="sm" onClick={getLocation}>
              {location ? 'Atualizar' : 'Tentar novamente'}
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {/* Name */}
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

        {/* CPF */}
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

        {/* Phone */}
        <div className="space-y-2">
          <Label htmlFor="phone">Telefone (opcional)</Label>
          <Input
            id="phone"
            placeholder="(00) 00000-0000"
            {...register('phone')}
          />
        </div>

        {/* State */}
        <div className="space-y-2">
          <Label htmlFor="state">Estado *</Label>
          <Select onValueChange={value => setValue('state', value)}>
            <SelectTrigger className={errors.state ? 'border-destructive' : ''}>
              <SelectValue placeholder="Selecione o estado" />
            </SelectTrigger>
            <SelectContent>
              {BRAZILIAN_STATES.map(state => (
                <SelectItem key={state.value} value={state.value}>
                  {state.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.state && (
            <p className="text-xs text-destructive">{errors.state.message}</p>
          )}
        </div>

        {/* City */}
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="city">Cidade *</Label>
          <Input
            id="city"
            placeholder="Nome da cidade"
            {...register('city')}
            className={errors.city ? 'border-destructive' : ''}
          />
          {errors.city && (
            <p className="text-xs text-destructive">{errors.city.message}</p>
          )}
        </div>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Descrição do Problema *</Label>
        <Textarea
          id="description"
          placeholder="Descreva o problema com o poste (ex: lâmpada apagada há 3 dias, poste piscando, etc.)"
          rows={4}
          {...register('description')}
          className={errors.description ? 'border-destructive' : ''}
        />
        {errors.description && (
          <p className="text-xs text-destructive">{errors.description.message}</p>
        )}
      </div>

      {/* Photo upload placeholder */}
      <div className="space-y-2">
        <Label>Foto do Poste (opcional)</Label>
        <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer bg-muted/30">
          <Camera className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground">
            Clique para tirar ou selecionar uma foto
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Funcionalidade disponível após integração com backend
          </p>
        </div>
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
        disabled={isSubmitting || !location}
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
