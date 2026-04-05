import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { Pole, PoleStatus } from '@/types';
import { dbDelete, dbInsert, dbPatch, dbSelect } from '@/lib/supabase';

interface PolesContextValue {
  poles: Pole[];
  addPole: (pole: Pole) => Promise<void>;
  addPoles: (poles: Pole[]) => Promise<void>;
  removePole: (poleId: string) => Promise<void>;
  updatePoleStatus: (poleId: string, newStatus: PoleStatus) => Promise<void>;
  refresh: () => Promise<void>;
}

const PolesContext = createContext<PolesContextValue | null>(null);

interface PoleRow {
  id: string;
  code: string;
  latitude: number;
  longitude: number;
  status: PoleStatus;
  observations: string | null;
  city_hall_id: string;
  neighborhood: string | null;
  address: string | null;
  created_at: string;
  updated_at: string;
}

const mapRow = (row: PoleRow): Pole => ({
  id: row.code,
  latitude: row.latitude,
  longitude: row.longitude,
  status: row.status,
  observations: row.observations ?? undefined,
  cityHallId: row.city_hall_id,
  neighborhood: row.neighborhood ?? undefined,
  address: row.address ?? undefined,
  createdAt: new Date(row.created_at),
  updatedAt: new Date(row.updated_at),
});

export function PolesProvider({ children }: { children: ReactNode }) {
  const [poles, setPoles] = useState<Pole[]>([]);

  const refresh = useCallback(async () => {
    const rows = await dbSelect<PoleRow>('lighting_points?select=*&order=created_at.desc');
    setPoles(rows.map(mapRow));
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const addPole = useCallback(async (pole: Pole) => {
    await dbInsert('lighting_points', {
      code: pole.id,
      latitude: pole.latitude,
      longitude: pole.longitude,
      status: pole.status,
      observations: pole.observations ?? null,
      city_hall_id: pole.cityHallId,
      neighborhood: pole.neighborhood ?? null,
      address: pole.address ?? null,
    });
    await refresh();
  }, [refresh]);

  const addPoles = useCallback(async (newPoles: Pole[]) => {
    await dbInsert('lighting_points', newPoles.map((pole) => ({
      code: pole.id,
      latitude: pole.latitude,
      longitude: pole.longitude,
      status: pole.status,
      observations: pole.observations ?? null,
      city_hall_id: pole.cityHallId,
      neighborhood: pole.neighborhood ?? null,
      address: pole.address ?? null,
    })));
    await refresh();
  }, [refresh]);

  const removePole = useCallback(async (poleId: string) => {
    await dbDelete(`lighting_points?code=eq.${encodeURIComponent(poleId)}`);
    await refresh();
  }, [refresh]);

  const updatePoleStatus = useCallback(async (poleId: string, newStatus: PoleStatus) => {
    await dbPatch(`lighting_points?code=eq.${encodeURIComponent(poleId)}`, { status: newStatus, updated_at: new Date().toISOString() });
    await refresh();
  }, [refresh]);

  return (
    <PolesContext.Provider value={{ poles, addPole, addPoles, removePole, updatePoleStatus, refresh }}>
      {children}
    </PolesContext.Provider>
  );
}

export function usePoles() {
  const ctx = useContext(PolesContext);
  if (!ctx) throw new Error('usePoles must be used within PolesProvider');
  return ctx;
}
