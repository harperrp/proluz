const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const SUPABASE_ANON_KEY = (
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ??
  import.meta.env.VITE_SUPABASE_ANON_KEY
) as string | undefined;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn('Supabase env vars missing: VITE_SUPABASE_URL / VITE_SUPABASE_PUBLISHABLE_KEY (or VITE_SUPABASE_ANON_KEY)');
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

const SESSION_REFRESH_SKEW_SECONDS = 30;

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

function isSessionExpired(session: AuthSession | null) {
  if (!session?.expires_at) return false;
  const nowInSeconds = Math.floor(Date.now() / 1000);
  return session.expires_at <= nowInSeconds + SESSION_REFRESH_SKEW_SECONDS;
}

export async function refreshSession(): Promise<AuthSession | null> {
  const session = getSession();
  if (!session?.refresh_token) return null;

  const response = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=refresh_token`, {
    method: 'POST',
    headers: {
      apikey: SUPABASE_ANON_KEY ?? '',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ refresh_token: session.refresh_token }),
  });

  if (!response.ok) {
    saveSession(null);
    return null;
  }

  const payload = await response.json();
  const refreshedSession: AuthSession = {
    access_token: payload.access_token,
    refresh_token: payload.refresh_token,
    expires_at: payload.expires_at,
    user: payload.user,
  };

  saveSession(refreshedSession);
  return refreshedSession;
}

export async function getValidSession() {
  const session = getSession();
  if (!session) return null;
  if (!isSessionExpired(session)) return session;
  return refreshSession();
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

function clearSupabaseLocalStorage() {
  const keysToRemove: string[] = [];
  for (let index = 0; index < localStorage.length; index += 1) {
    const key = localStorage.key(index);
    if (!key) continue;
    if (key === AUTH_STORAGE_KEY || key.startsWith('sb-')) {
      keysToRemove.push(key);
    }
  }
  keysToRemove.forEach((key) => localStorage.removeItem(key));
}

export async function signOut() {
  const session = getSession();
  if (session?.access_token) {
    try {
      await fetch(`${SUPABASE_URL}/auth/v1/logout`, {
        method: 'POST',
        headers: {
          apikey: SUPABASE_ANON_KEY ?? '',
          Authorization: `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
      });
    } catch {
      // no-op
    }
  }
  clearSupabaseLocalStorage();
  saveSession(null);
}

async function withAuth(token?: string) {
  const session = await getValidSession();
  return {
    apikey: SUPABASE_ANON_KEY ?? '',
    Authorization: `Bearer ${token ?? session?.access_token ?? SUPABASE_ANON_KEY ?? ''}`,
    'Content-Type': 'application/json',
    Prefer: 'return=representation',
  };
}

async function fetchWithSessionRefresh(input: RequestInfo | URL, init: RequestInit = {}) {
  const firstResponse = await fetch(input, {
    ...init,
    headers: await withAuth(),
  });

  if (firstResponse.status !== 401) return firstResponse;

  const refreshed = await refreshSession();
  if (!refreshed?.access_token) return firstResponse;

  return fetch(input, {
    ...init,
    headers: await withAuth(refreshed.access_token),
  });
}

export async function dbSelect<T>(path: string): Promise<T[]> {
  const response = await fetchWithSessionRefresh(`${SUPABASE_URL}/rest/v1/${path}`);
  if (!response.ok) throw new Error(await response.text());
  return response.json();
}

export async function dbInsert<T>(table: string, row: Record<string, unknown> | Record<string, unknown>[]): Promise<T[]> {
  const response = await fetchWithSessionRefresh(`${SUPABASE_URL}/rest/v1/${table}`, {
    method: 'POST',
    body: JSON.stringify(row),
  });
  if (!response.ok) throw new Error(await response.text());
  return response.json();
}

export async function dbPatch<T>(path: string, row: Record<string, unknown>): Promise<T[]> {
  const response = await fetchWithSessionRefresh(`${SUPABASE_URL}/rest/v1/${path}`, {
    method: 'PATCH',
    body: JSON.stringify(row),
  });
  if (!response.ok) throw new Error(await response.text());
  return response.json();
}

export async function dbDelete(path: string): Promise<void> {
  const response = await fetchWithSessionRefresh(`${SUPABASE_URL}/rest/v1/${path}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error(await response.text());
}
