import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../utils/api';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'counselor' | 'teacher';
  picture?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loginWithGoogle: (credential: string) => Promise<void>;
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
    // Check for stored auth token and validate
    const token = localStorage.getItem('access_token');
    const userData = localStorage.getItem('user');

    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        
        // Verify token is still valid
        authAPI.getCurrentUser()
          .then((data) => {
            setUser(data);
            localStorage.setItem('user', JSON.stringify(data));
          })
          .catch(() => {
            // Token invalid, clear storage
            logout();
          });
      } catch (error) {
        logout();
      }
    }

    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    setLoading(true);

    try {
      // For demo purposes - replace with actual backend call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const mockUser: User = {
        id: '1',
        email,
        name: email.split('@')[0].replace(/[._]/g, ' '),
        role: email.includes('admin') ? 'admin' : 'counselor',
      };

      localStorage.setItem('access_token', 'demo_token');
      localStorage.setItem('user', JSON.stringify(mockUser));
      setUser(mockUser);
    } catch (error) {
      throw new Error('Login failed');
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async (credential: string): Promise<void> => {
    setLoading(true);

    try {
      const response = await authAPI.googleLogin(credential);

      // Store tokens and user data
      localStorage.setItem('access_token', response.access_token);
      localStorage.setItem('refresh_token', response.refresh_token);
      localStorage.setItem('user', JSON.stringify(response.user));

      setUser(response.user);
    } catch (error: any) {
      console.error('Google login error:', error);
      throw new Error(error.response?.data?.error || 'Google login failed');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
