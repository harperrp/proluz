import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users } from 'lucide-react';
import { dbSelect } from '@/lib/supabase';
import { User, UserRole } from '@/types';

interface ProfileRow { id: string; full_name: string; role: UserRole; created_at: string }

const roleLabel: Record<UserRole, string> = {
  ADMIN: 'Admin Master',
  CITY_HALL_ADMIN: 'Admin Prefeitura',
  SECRETARY: 'Secretário',
  TECHNICAL: 'Técnico',
  CITIZEN: 'Cidadão',
};

export default function DashboardUsers() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    void (async () => {
      const rows = await dbSelect<ProfileRow>('profiles?select=id,full_name,role,created_at&order=created_at.desc');
      setUsers(rows.map((r) => ({ id: r.id, name: r.full_name, role: r.role, createdAt: new Date(r.created_at), email: '', cityHallId: undefined })));
    })();
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div><h1 className="text-2xl font-bold">Usuários</h1><p className="text-muted-foreground">Lista de perfis do Supabase Auth</p></div>
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Users className="h-5 w-5" />{users.length} usuários</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {users.map((u) => <div key={u.id} className="border rounded p-3 flex items-center justify-between"><span>{u.name || u.id}</span><Badge>{roleLabel[u.role]}</Badge></div>)}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
