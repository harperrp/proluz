import { useEffect, useRef, useState, useCallback } from 'react';
import { MapContainer, Marker, Popup, TileLayer, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { AlertTriangle, CheckCircle2, Lightbulb, Maximize2, Minimize2 } from 'lucide-react';
import { Pole, PoleStatus } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import 'leaflet/dist/leaflet.css';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const createCustomIcon = (status: PoleStatus) => {
  const color = status === 'FUNCIONANDO' ? '#22c55e' : '#ef4444';
  return L.divIcon({
    html: `<div style="width:16px;height:16px;border-radius:9999px;background:${color};border:2px solid white;box-shadow:0 0 0 1px rgba(0,0,0,0.25)"></div>`,
    className: 'custom-marker',
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });
};

export interface RoutePoint { latitude: number; longitude: number; label: string }

interface PoleMapProps {
  showFilters?: boolean;
  onPoleSelect?: (pole: Pole) => void;
  selectedPoleId?: string;
  editableStatus?: boolean;
  poles?: Pole[];
  onStatusChange?: (poleId: string, newStatus: PoleStatus) => void;
  defaultFilter?: PoleStatus | 'TODOS';
  route?: RoutePoint[];
  onCancelRoute?: () => void;
  center?: [number, number];
  zoom?: number;
}

function FitRoute({ route }: { route: RoutePoint[] }) {
  const map = useMap();
  useEffect(() => {
    if (route.length > 0) {
      const bounds = L.latLngBounds(route.map((r) => [r.latitude, r.longitude]));
      map.fitBounds(bounds, { padding: [40, 40] });
    }
  }, [route, map]);
  return null;
}

export function PoleMap({
  showFilters = true,
  onPoleSelect,
  selectedPoleId,
  editableStatus = false,
  poles = [],
  onStatusChange,
  defaultFilter = 'TODOS',
  route,
  onCancelRoute,
  center = [-15.3983, -42.3097],
  zoom = 15,
}: PoleMapProps) {
  const [filter, setFilter] = useState<PoleStatus | 'TODOS'>(defaultFilter);
  const [selectedPole, setSelectedPole] = useState<Pole | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const mapRef = useRef<L.Map | null>(null);

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen((prev) => !prev);
    setTimeout(() => mapRef.current?.invalidateSize(), 300);
  }, []);

  const filteredPoles = poles.filter((pole) => filter === 'TODOS' || pole.status === filter);
  const workingCount = poles.filter((pole) => pole.status === 'FUNCIONANDO').length;
  const brokenCount = poles.filter((pole) => pole.status === 'QUEIMADO').length;

  const handlePoleClick = (pole: Pole) => {
    setSelectedPole(pole);
    onPoleSelect?.(pole);
  };

  const updatePoleStatus = (poleId: string, newStatus: PoleStatus) => {
    onStatusChange?.(poleId, newStatus);
    toast.success(`Poste ${poleId} atualizado para ${newStatus}.`);
  };

  return (
    <div className="space-y-4">
      {showFilters && (
        <div className="flex gap-2 flex-wrap">
          <Button variant={filter === 'TODOS' ? 'default' : 'outline'} size="sm" onClick={() => setFilter('TODOS')}>Todos ({poles.length})</Button>
          <Button variant={filter === 'FUNCIONANDO' ? 'default' : 'outline'} size="sm" onClick={() => setFilter('FUNCIONANDO')}>Funcionando ({workingCount})</Button>
          <Button variant={filter === 'QUEIMADO' ? 'destructive' : 'outline'} size="sm" onClick={() => setFilter('QUEIMADO')}>Queimados ({brokenCount})</Button>
        </div>
      )}

      <div className={cn('relative rounded-xl border overflow-hidden', isFullscreen ? 'map-fullscreen' : '')} style={isFullscreen ? undefined : { height: 500 }}>
        <MapContainer center={center} zoom={zoom} style={{ height: '100%', width: '100%' }} ref={mapRef}>
          <TileLayer attribution='&copy; OpenStreetMap contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          {filteredPoles.map((pole) => (
            <Marker key={pole.id} position={[pole.latitude, pole.longitude]} icon={createCustomIcon(pole.status)} eventHandlers={{ click: () => handlePoleClick(pole) }}>
              <Popup>
                <div className="space-y-2">
                  <p className="font-semibold">{pole.id}</p>
                  <p className="text-xs">{pole.address ?? 'Sem endereço'}</p>
                  <Badge className={pole.status === 'FUNCIONANDO' ? 'status-badge-working' : 'status-badge-broken'}>{pole.status}</Badge>
                  {editableStatus && (
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => updatePoleStatus(pole.id, 'FUNCIONANDO')}><CheckCircle2 className="h-3 w-3 mr-1" />Consertado</Button>
                      <Button size="sm" variant="destructive" onClick={() => updatePoleStatus(pole.id, 'QUEIMADO')}><AlertTriangle className="h-3 w-3 mr-1" />Queimado</Button>
                    </div>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}

          {route && route.length > 0 && (
            <>
              <Polyline positions={route.map((r) => [r.latitude, r.longitude] as [number, number])} pathOptions={{ color: '#3b82f6', weight: 4 }} />
              <FitRoute route={route} />
            </>
          )}
        </MapContainer>

        <button onClick={toggleFullscreen} className="absolute top-3 right-3 z-10 h-9 w-9 bg-card rounded border flex items-center justify-center">
          {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
        </button>
        {route && route.length > 0 && onCancelRoute && (
          <button onClick={onCancelRoute} className="absolute top-3 left-3 z-10 rounded bg-destructive text-destructive-foreground px-3 py-1 text-sm">Cancelar rota</button>
        )}
      </div>

      {selectedPole && (
        <div className="rounded-lg border p-4">
          <h3 className="font-semibold">{selectedPole.id}{selectedPoleId === selectedPole.id ? ' (selecionado)' : ''}</h3>
          <p className="text-sm text-muted-foreground">{selectedPole.address ?? 'Sem endereço'}</p>
          <div className="flex items-center gap-2 mt-2"><Lightbulb className="h-4 w-4" />{selectedPole.status}</div>
        </div>
      )}
    </div>
  );
}
