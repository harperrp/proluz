import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { User, UserRole } from '@/types';
import { dbSelect, getValidSession, signInWithPassword, signOut } from '@/lib/supabase';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  hasPermission: (roles: UserRole[]) => boolean;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface ProfileRow {
  id: string;
  full_name: string;
  role: UserRole;
  created_at: string;
  user_city_halls?: Array<{ city_hall_id: string }>;
}

const mapProfileToUser = (profile: ProfileRow, email: string): User => ({
  id: profile.id,
  email,
  name: profile.full_name,
  role: profile.role,
  cityHallId: profile.user_city_halls?.[0]?.city_hall_id,
  createdAt: new Date(profile.created_at),
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const refreshUser = useCallback(async () => {
    const session = await getValidSession();
    if (!session?.user?.id) {
      setUser(null);
      return;
    }

    try {
      const rows = await dbSelect<ProfileRow>(
        `profiles?select=id,full_name,role,created_at,user_city_halls(city_hall_id)&id=eq.${session.user.id}&limit=1`,
      );
      if (!rows[0]) {
        setUser(null);
        return;
      }
      setUser(mapProfileToUser(rows[0], session.user.email ?? ''));
    } catch {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    void refreshUser();
  }, [refreshUser]);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    try {
      await signInWithPassword(email, password);
      await refreshUser();
      return true;
    } catch {
      return false;
    }
  }, [refreshUser]);

  const logout = useCallback(async () => {
    await signOut();
    setUser(null);
  }, []);

  const hasPermission = useCallback((roles: UserRole[]): boolean => {
    return user ? roles.includes(user.role) : false;
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        hasPermission,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
