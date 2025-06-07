import React, { createContext, useContext, useState } from 'react';
import type { User, UserLevel } from '../types/User';
import { getUserByEmail, type UserInfo } from '../services/api';

interface AuthContextType {
  user: User | null;
  userInfo: UserInfo | null;
  signIn: (email: string, level?: UserLevel) => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  const signIn = async (email: string, level: UserLevel = 'basic') => {
    try {
      // Fetch user info from RestrictedChat API
      const info = await getUserByEmail(email);
      setUserInfo(info);

      // Set user in auth context
      setUser({
        id: info.user_id.toString(),
        email: info.email,
        level,
        displayName: info.display_name
      });
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  };

  const signOut = () => {
    setUser(null);
    setUserInfo(null);
  };

  return (
    <AuthContext.Provider value={{ user, userInfo, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
} 