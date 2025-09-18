"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  login: (email: string, password: string, rememberMe: boolean) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('jello_token');
      const storedUser = localStorage.getItem('jello_user');

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
        console.error("Failed to parse auth data from localStorage", error);
        localStorage.removeItem('jello_token');
        localStorage.removeItem('jello_user');
    }
    setIsLoading(false);
  }, []);


const login = async (email: string, password: string, rememberMe: boolean) => {
    const response = await fetch('https://jello-backend.onrender.com/api/auth/login', { 
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, rememberMe }), 
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Login failed');
    }

    const data = await response.json(); 
    setToken(data.token);
    setUser(data.user);

    localStorage.setItem('jello_token', data.token);
    localStorage.setItem('jello_user', JSON.stringify(data.user));
  };

  const register = async (name: string, email: string, password: string) => {
    const response = await fetch('https://jello-backend.onrender.com/api/auth/register', { // [cite: 4, 6]
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }), // [cite: 14]
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Registration failed');
    }
  };

   const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('jello_token');
    localStorage.removeItem('jello_user');
  };

  const value = {
    isAuthenticated: !!token,
    user,
    token,
    login,
    register,
    logout,
    isLoading,
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