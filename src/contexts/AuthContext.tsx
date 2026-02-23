import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { User, UserRole } from '@/types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  hasPermission: (roles: UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demonstration
const MOCK_USERS: (User & { password: string })[] = [
  {
    id: '1',
    email: 'admin@sistema.gov.br',
    password: 'admin123',
    name: 'Administrador Geral',
    role: 'ADMIN',
    createdAt: new Date(),
  },
  {
    id: '2',
    email: 'prefeitura@cidade.gov.br',
    password: 'prefeitura123',
    name: 'João Silva',
    role: 'CITY_HALL_ADMIN',
    cityHallId: '1',
    createdAt: new Date(),
  },
  {
    id: '3',
    email: 'secretario@cidade.gov.br',
    password: 'secretario123',
    name: 'Maria Santos',
    role: 'SECRETARY',
    cityHallId: '1',
    createdAt: new Date(),
  },
  {
    id: '4',
    email: 'tecnico@cidade.gov.br',
    password: 'tecnico123',
    name: 'Carlos Oliveira',
    role: 'TECHNICAL',
    cityHallId: '1',
    createdAt: new Date(),
  },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('auth_user');
    return stored ? JSON.parse(stored) : null;
  });

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const foundUser = MOCK_USERS.find(
      u => u.email === email && u.password === password
    );

    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem('auth_user', JSON.stringify(userWithoutPassword));
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('auth_user');
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
