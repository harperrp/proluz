const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  // eslint-disable-next-line no-console
  console.warn('Supabase env vars missing: VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY');
}

const AUTH_STORAGE_KEY = 'sb_session';

export interface AuthSession {
  access_token: string;
  refresh_token: string;
  expires_at?: number;
  user: {
    id: string;
    email?: string;
  };
}

export function getSession(): AuthSession | null {
  const raw = localStorage.getItem(AUTH_STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthSession;
  } catch {
    return null;
  }
}

export function saveSession(session: AuthSession | null) {
  if (!session) {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    return;
  }
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
}

export async function signInWithPassword(email: string, password: string): Promise<AuthSession> {
  const response = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
    method: 'POST',
    headers: {
      apikey: SUPABASE_ANON_KEY ?? '',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(err || 'Falha no login');
  }

  const payload = await response.json();
  const session: AuthSession = {
    access_token: payload.access_token,
    refresh_token: payload.refresh_token,
    expires_at: payload.expires_at,
    user: payload.user,
  };

  saveSession(session);
  return session;
}

export function signOut() {
  saveSession(null);
}

function withAuth(token?: string) {
  const session = getSession();
  return {
    apikey: SUPABASE_ANON_KEY ?? '',
    Authorization: `Bearer ${token ?? session?.access_token ?? SUPABASE_ANON_KEY ?? ''}`,
    'Content-Type': 'application/json',
    Prefer: 'return=representation',
  };
}

export async function dbSelect<T>(path: string): Promise<T[]> {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    headers: withAuth(),
  });
  if (!response.ok) throw new Error(await response.text());
  return response.json();
}

export async function dbInsert<T>(table: string, row: Record<string, unknown> | Record<string, unknown>[]): Promise<T[]> {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
    method: 'POST',
    headers: withAuth(),
    body: JSON.stringify(row),
  });
  if (!response.ok) throw new Error(await response.text());
  return response.json();
}

export async function dbPatch<T>(path: string, row: Record<string, unknown>): Promise<T[]> {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    method: 'PATCH',
    headers: withAuth(),
    body: JSON.stringify(row),
  });
  if (!response.ok) throw new Error(await response.text());
  return response.json();
}

export async function dbDelete(path: string): Promise<void> {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    method: 'DELETE',
    headers: withAuth(),
  });
  if (!response.ok) throw new Error(await response.text());
}
