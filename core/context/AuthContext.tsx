import React, { createContext, useContext, useState } from 'react';
import type { User, UserLevel } from '../types/User';

interface AuthContextType {
  user: User | null;
  signIn: (level?: UserLevel) => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const signIn = (level: UserLevel = 'basic') => {
    // Mock user for now
    setUser({
      id: '1',
      email: 'user@example.com',
      level,
    });
  };

  const signOut = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
} 