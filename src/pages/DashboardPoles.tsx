import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ImportPolesModal } from '@/components/poles/ImportPolesModal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Lightbulb, Search, Plus, Trash2, Upload } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pole, PoleStatus } from '@/types';
import { CreatePoleModal } from '@/components/poles/CreatePoleModal';
import { usePoles } from '@/contexts/PolesContext';
import { useAuth } from '@/contexts/AuthContext';

export default function DashboardPoles() {
  const { poles, addPole, addPoles, removePole, updatePoleStatus } = usePoles();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [createOpen, setCreateOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);

  const filtered = poles.filter((p) => p.id.toLowerCase().includes(searchTerm.toLowerCase()) || p.address?.toLowerCase().includes(searchTerm.toLowerCase()));
  const nextPoleId = `P-${String(poles.length + 1).padStart(3, '0')}`;

  const handleCreatePole = async (data: { id: string; address: string; latitude: number; longitude: number; status: PoleStatus }) => {
    if (!user?.cityHallId) return;
    const newPole: Pole = { ...data, cityHallId: user.cityHallId, createdAt: new Date(), updatedAt: new Date() };
    await addPole(newPole);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div><h1 className="text-2xl font-bold">Postes</h1><p className="text-muted-foreground">Cadastro real no Supabase</p></div>
          <div className="flex gap-2"><Button variant="outline" onClick={() => setImportOpen(true)}><Upload className="h-4 w-4 mr-2" />Importar</Button><Button onClick={() => setCreateOpen(true)}><Plus className="h-4 w-4 mr-2" />Novo Poste</Button></div>
        </div>

        <Card><CardContent className="pt-6"><div className="relative max-w-md"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input className="pl-9" placeholder="Buscar por código/endereço" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /></div></CardContent></Card>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Lightbulb className="h-5 w-5" />{filtered.length} postes</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader><TableRow><TableHead>Código</TableHead><TableHead>Endereço</TableHead><TableHead>Status</TableHead><TableHead>Ações</TableHead></TableRow></TableHeader>
              <TableBody>
                {filtered.map((pole) => (
                  <TableRow key={pole.id}>
                    <TableCell>{pole.id}</TableCell>
                    <TableCell>{pole.address}</TableCell>
                    <TableCell><Badge className={pole.status === 'FUNCIONANDO' ? 'status-badge-working' : 'status-badge-broken'}>{pole.status}</Badge></TableCell>
                    <TableCell className="space-x-2">
                      <Button size="sm" variant="outline" onClick={() => void updatePoleStatus(pole.id, pole.status === 'FUNCIONANDO' ? 'QUEIMADO' : 'FUNCIONANDO')}>Alternar</Button>
                      <Button size="sm" variant="ghost" className="text-destructive" onClick={() => void removePole(pole.id)}><Trash2 className="h-4 w-4" /></Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <CreatePoleModal open={createOpen} onOpenChange={setCreateOpen} onCreated={(pole) => void handleCreatePole(pole)} nextId={nextPoleId} existingPoles={poles} />
      <ImportPolesModal open={importOpen} onOpenChange={setImportOpen} onImport={(batch) => void addPoles(batch.map((p) => ({ ...p, cityHallId: user?.cityHallId ?? p.cityHallId })))} existingPoleIds={poles.map((p) => p.id)} />
    </DashboardLayout>
  );
}
