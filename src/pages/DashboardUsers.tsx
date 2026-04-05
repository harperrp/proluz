import { useEffect, useMemo, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users } from 'lucide-react';
import { dbSelect } from '@/lib/supabase';
import { UserRole } from '@/types';

interface ProfileRow {
  id: string;
  full_name: string;
  role: UserRole;
  created_at: string;
  user_city_halls: Array<{ city_hall_id: string; city_halls: { name: string; city: string; state: string } | null }>;
}

const roleLabel: Record<UserRole, string> = {
  ADMIN: 'Admin Master',
  CITY_HALL_ADMIN: 'Admin Prefeitura',
  SECRETARY: 'Secretário',
  TECHNICAL: 'Técnico',
  CITIZEN: 'Cidadão',
};

export default function DashboardUsers() {
  const [users, setUsers] = useState<ProfileRow[]>([]);

  useEffect(() => {
    void (async () => {
      const rows = await dbSelect<ProfileRow>(
        'profiles?select=id,full_name,role,created_at,user_city_halls(city_hall_id,city_halls(name,city,state))&order=created_at.desc',
      );
      setUsers(rows);
    })();
  }, []);

  const groupedByRole = useMemo(() => {
    return {
      ADMIN: users.filter((u) => u.role === 'ADMIN').length,
      CITY_HALL_ADMIN: users.filter((u) => u.role === 'CITY_HALL_ADMIN').length,
      SECRETARY: users.filter((u) => u.role === 'SECRETARY').length,
      TECHNICAL: users.filter((u) => u.role === 'TECHNICAL').length,
    };
  }, [users]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Usuários</h1>
          <p className="text-muted-foreground">Perfis reais com vínculo em user_city_halls</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {Object.entries(groupedByRole).map(([role, count]) => (
            <Card key={role}>
              <CardContent className="pt-4">
                <p className="text-xs text-muted-foreground">{roleLabel[role as UserRole]}</p>
                <p className="text-2xl font-bold">{count}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Users className="h-5 w-5" />{users.length} usuários</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {users.map((u) => (
              <div key={u.id} className="border rounded p-3 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                <div>
                  <p className="font-medium">{u.full_name || u.id}</p>
                  <p className="text-xs text-muted-foreground">ID: {u.id}</p>
                  <p className="text-xs text-muted-foreground">
                    Prefeitura: {u.user_city_halls?.[0]?.city_halls ? `${u.user_city_halls[0].city_halls.name} (${u.user_city_halls[0].city_halls.city}/${u.user_city_halls[0].city_halls.state})` : 'Sem vínculo'}
                  </p>
                </div>
                <Badge>{roleLabel[u.role]}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
