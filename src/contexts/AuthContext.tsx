import React, { createContext, useContext, useEffect, useState } from 'react';

interface User {
  id: string;
  email: string;
  full_name?: string;
  subscription_tier: 'free' | 'pro' | 'enterprise';
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, fullName: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('signalcraft_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // TODO: Implement actual authentication with Supabase
    // For now, simulate login
    const mockUser: User = {
      id: '1',
      email,
      full_name: 'Demo User',
      subscription_tier: 'free'
    };
    
    setUser(mockUser);
    localStorage.setItem('signalcraft_user', JSON.stringify(mockUser));
  };

  const register = async (email: string, password: string, fullName: string) => {
    // TODO: Implement actual registration with Supabase
    // For now, simulate registration
    const mockUser: User = {
      id: '1',
      email,
      full_name: fullName,
      subscription_tier: 'free'
    };
    
    setUser(mockUser);
    localStorage.setItem('signalcraft_user', JSON.stringify(mockUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('signalcraft_user');
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}