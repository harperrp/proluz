import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { toast } from 'sonner';
import { dbInsert, dbPatch, dbSelect } from '@/lib/supabase';

export interface CityHallWithStats {
  id: string;
  name: string;
  city: string;
  state: string;
  latitude: number;
  longitude: number;
  cnpj?: string;
  status: 'ATIVO' | 'INATIVO';
  createdAt: Date;
  usersCount: number;
  polesCount: number;
}

interface CityHallContextValue {
  cityHalls: CityHallWithStats[];
  activeCityHall: CityHallWithStats | null;
  setActiveCityHall: (cityHall: CityHallWithStats) => void;
  addCityHall: (cityHall: CityHallWithStats) => Promise<void>;
  updateCityHall: (id: string, data: Partial<CityHallWithStats>) => Promise<void>;
  toggleCityHallStatus: (id: string) => Promise<void>;
  refresh: () => Promise<void>;
}

const CityHallContext = createContext<CityHallContextValue | null>(null);

interface CityHallRow {
  id: string;
  name: string;
  city: string;
  state: string;
  latitude: number;
  longitude: number;
  cnpj: string | null;
  status: 'ATIVO' | 'INATIVO';
  created_at: string;
}

const mapRow = (row: CityHallRow): CityHallWithStats => ({
  id: row.id,
  name: row.name,
  city: row.city,
  state: row.state,
  latitude: row.latitude,
  longitude: row.longitude,
  cnpj: row.cnpj ?? undefined,
  status: row.status,
  createdAt: new Date(row.created_at),
  usersCount: 0,
  polesCount: 0,
});

export function CityHallProvider({ children }: { children: ReactNode }) {
  const [cityHalls, setCityHalls] = useState<CityHallWithStats[]>([]);
  const [activeCityHall, setActiveCityHallState] = useState<CityHallWithStats | null>(null);

  const refresh = useCallback(async () => {
    const rows = await dbSelect<CityHallRow>('city_halls?select=*&order=created_at.desc');
    const mapped = rows.map(mapRow);
    setCityHalls(mapped);
    if (!activeCityHall && mapped.length > 0) setActiveCityHallState(mapped[0]);
  }, [activeCityHall]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const setActiveCityHall = useCallback((cityHall: CityHallWithStats) => {
    setActiveCityHallState(cityHall);
    toast.success(`Acessando ${cityHall.name}`);
  }, []);

  const addCityHall = useCallback(async (cityHall: CityHallWithStats) => {
    await dbInsert('city_halls', {
      name: cityHall.name,
      city: cityHall.city,
      state: cityHall.state,
      latitude: cityHall.latitude,
      longitude: cityHall.longitude,
      cnpj: cityHall.cnpj ?? null,
      status: cityHall.status,
    });
    await refresh();
  }, [refresh]);

  const updateCityHall = useCallback(async (id: string, data: Partial<CityHallWithStats>) => {
    await dbPatch(`city_halls?id=eq.${id}`, {
      name: data.name,
      city: data.city,
      state: data.state,
      latitude: data.latitude,
      longitude: data.longitude,
      cnpj: data.cnpj,
      status: data.status,
    });
    await refresh();
  }, [refresh]);

  const toggleCityHallStatus = useCallback(async (id: string) => {
    const target = cityHalls.find((c) => c.id === id);
    if (!target) return;
    const nextStatus = target.status === 'ATIVO' ? 'INATIVO' : 'ATIVO';
    await dbPatch(`city_halls?id=eq.${id}`, { status: nextStatus });
    await refresh();
  }, [cityHalls, refresh]);

  return (
    <CityHallContext.Provider value={{ cityHalls, activeCityHall, setActiveCityHall, addCityHall, updateCityHall, toggleCityHallStatus, refresh }}>
      {children}
    </CityHallContext.Provider>
  );
}

export function useCityHall() {
  const ctx = useContext(CityHallContext);
  if (!ctx) throw new Error('useCityHall must be used within CityHallProvider');
  return ctx;
}
