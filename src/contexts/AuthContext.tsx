import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'mentor' | 'teacher';
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loginWithGoogle: () => Promise<void>;
  loginWithApple: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored auth token
    const token = localStorage.getItem('auth_token');
    const userData = localStorage.getItem('user_data');
    
    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_data');
      }
    }
    
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock user data based on email
    const mockUser: User = {
      id: '1',
      email,
      name: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      role: email.includes('admin') ? 'admin' : email.includes('mentor') ? 'mentor' : 'teacher',
    };
    
    localStorage.setItem('auth_token', 'mock_jwt_token');
    localStorage.setItem('user_data', JSON.stringify(mockUser));
    setUser(mockUser);
    setLoading(false);
  };

  const loginWithGoogle = async (): Promise<void> => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const mockUser: User = {
      id: '2',
      email: 'user@gmail.com',
      name: 'Google User',
      role: 'mentor',
    };
    
    localStorage.setItem('auth_token', 'mock_jwt_token');
    localStorage.setItem('user_data', JSON.stringify(mockUser));
    setUser(mockUser);
    setLoading(false);
  };

  const loginWithApple = async (): Promise<void> => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const mockUser: User = {
      id: '3',
      email: 'user@icloud.com',
      name: 'Apple User',
      role: 'teacher',
    };
    
    localStorage.setItem('auth_token', 'mock_jwt_token');
    localStorage.setItem('user_data', JSON.stringify(mockUser));
    setUser(mockUser);
    setLoading(false);
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        loginWithGoogle,
        loginWithApple,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}