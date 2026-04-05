import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Building2, Plus } from 'lucide-react';
import { useCityHall } from '@/contexts/CityHallContext';

export default function DashboardCityHalls() {
  const { cityHalls, addCityHall, setActiveCityHall, activeCityHall } = useCityHall();
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div><h1 className="text-2xl font-bold">Prefeituras</h1><p className="text-muted-foreground">Cadastro multi-tenant real</p></div>
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Building2 className="h-5 w-5" />{cityHalls.length} prefeituras</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {cityHalls.map((ch) => (
              <div key={ch.id} className={`border rounded p-3 flex justify-between ${activeCityHall?.id === ch.id ? 'bg-primary/5' : ''}`}>
                <span>{ch.name} — {ch.city}/{ch.state}</span>
                <Button size="sm" variant="outline" onClick={() => setActiveCityHall(ch)}>Selecionar</Button>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Plus className="h-4 w-4" />Nova prefeitura</CardTitle></CardHeader>
          <CardContent className="grid md:grid-cols-4 gap-2">
            <Input placeholder="Nome" value={name} onChange={(e) => setName(e.target.value)} />
            <Input placeholder="Cidade" value={city} onChange={(e) => setCity(e.target.value)} />
            <Input placeholder="UF" value={state} onChange={(e) => setState(e.target.value)} maxLength={2} />
            <Button onClick={() => void addCityHall({ id: '', name, city, state, latitude: 0, longitude: 0, status: 'ATIVO', createdAt: new Date(), usersCount: 0, polesCount: 0 })}>Salvar</Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
