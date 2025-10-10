import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

export interface User {
  id: number;
  email: string;
  name: string;
  role: 'Admin' | 'Owner' | 'Analyst' | 'Viewer';
  status: 'active' | 'inactive' | 'suspended';
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Load token from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('auth_token');
    if (storedToken) {
      setToken(storedToken);
      fetchUser(storedToken);
    } else {
      setLoading(false);
    }
  }, []);

  // Fetch current user
  const fetchUser = async (authToken: string) => {
    try {
      const response = await axios.get('/api/auth/me', {
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });
      setUser(response.data.user);
    } catch (error) {
      console.error('Failed to fetch user:', error);
      // Clear invalid token
      localStorage.removeItem('auth_token');
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Login
  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post('/api/auth/login', {
        email,
        password
      });

      const { user: userData, token: authToken } = response.data;

      // Store token
      localStorage.setItem('auth_token', authToken);
      setToken(authToken);
      setUser(userData);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  // Logout
  const logout = async () => {
    if (token) {
      try {
        await axios.post('/api/auth/logout', {}, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      } catch (error) {
        console.error('Logout failed:', error);
      }
    }

    // Clear local state
    localStorage.removeItem('auth_token');
    setToken(null);
    setUser(null);
  };

  // Refresh user data
  const refreshUser = async () => {
    if (token) {
      await fetchUser(token);
    }
  };

  const value: AuthContextType = {
    user,
    token,
    loading,
    login,
    logout,
    refreshUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}


