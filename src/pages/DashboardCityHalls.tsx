import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Building2, Plus, Pencil } from 'lucide-react';
import { useCityHall } from '@/contexts/CityHallContext';

export default function DashboardCityHalls() {
  const { cityHalls, addCityHall, setActiveCityHall, activeCityHall, updateCityHall, toggleCityHallStatus } = useCityHall();
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Prefeituras</h1>
          <p className="text-muted-foreground">Cadastro multi-tenant real</p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Building2 className="h-5 w-5" />{cityHalls.length} prefeituras</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {cityHalls.map((ch) => (
              <div key={ch.id} className={`border rounded p-3 ${activeCityHall?.id === ch.id ? 'bg-primary/5' : ''}`}>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                  <div>
                    <span className="font-medium">{ch.name}</span>
                    <p className="text-sm text-muted-foreground">{ch.city}/{ch.state}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant={ch.status === 'ATIVO' ? 'default' : 'secondary'}>{ch.status}</Badge>
                    <Button size="sm" variant="outline" onClick={() => setActiveCityHall(ch)}>Selecionar</Button>
                    <Button size="sm" variant="outline" onClick={() => setEditingId(editingId === ch.id ? null : ch.id)}>
                      <Pencil className="h-3 w-3 mr-1" />Editar
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => void toggleCityHallStatus(ch.id)}>Ativar/Inativar</Button>
                  </div>
                </div>

                {editingId === ch.id && (
                  <div className="grid md:grid-cols-4 gap-2 mt-3">
                    <Input defaultValue={ch.name} onChange={(e) => setName(e.target.value)} placeholder="Nome" />
                    <Input defaultValue={ch.city} onChange={(e) => setCity(e.target.value)} placeholder="Cidade" />
                    <Input defaultValue={ch.state} onChange={(e) => setState(e.target.value.toUpperCase())} placeholder="UF" maxLength={2} />
                    <Button
                      onClick={() =>
                        void updateCityHall(ch.id, {
                          name: name || ch.name,
                          city: city || ch.city,
                          state: state || ch.state,
                        }).then(() => setEditingId(null))
                      }
                    >
                      Salvar alteração
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Plus className="h-4 w-4" />Nova prefeitura</CardTitle></CardHeader>
          <CardContent className="grid md:grid-cols-4 gap-2">
            <Input placeholder="Nome" value={name} onChange={(e) => setName(e.target.value)} />
            <Input placeholder="Cidade" value={city} onChange={(e) => setCity(e.target.value)} />
            <Input placeholder="UF" value={state} onChange={(e) => setState(e.target.value.toUpperCase())} maxLength={2} />
            <Button
              onClick={() =>
                void addCityHall({
                  id: '',
                  name,
                  city,
                  state,
                  latitude: -15.3983,
                  longitude: -42.3097,
                  status: 'ATIVO',
                  createdAt: new Date(),
                  usersCount: 0,
                  polesCount: 0,
                })
              }
            >
              Salvar
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
