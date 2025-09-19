"use client";

import * as React from 'react';

interface AuthContextType {
  token: string | null;
  user: { id: string; name: string; } | null;
  isAuthenticated: boolean;
  login: (token: string, user: { id: string; name: string; }, rememberMe: boolean) => void; // Añadimos rememberMe
  logout: () => void;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = React.useState<string | null>(null);
  const [user, setUser] = React.useState<{ id: string; name: string; } | null>(null);

  
  React.useEffect(() => {
    const storedToken = localStorage.getItem('jwt_token');
    const storedUser = localStorage.getItem('user_data');
    const expiryDate = localStorage.getItem('session_expiry');

    if (storedToken && storedUser && expiryDate && new Date().getTime() < JSON.parse(expiryDate)) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    } else {
      
      localStorage.removeItem('jwt_token');
      localStorage.removeItem('user_data');
      localStorage.removeItem('session_expiry');
    }
  }, []);

  const login = (newToken: string, userData: { id: string; name: string; }, rememberMe: boolean) => {
    const now = new Date();
    
    // Duración en milisegundos
    const duration = rememberMe 
      ? 7 * 24 * 60 * 60 * 1000  
      : 2 * 24 * 60 * 60 * 1000; 

    const expiryDate = now.getTime() + duration;
    
    setToken(newToken);
    setUser(userData);
    localStorage.setItem('jwt_token', newToken);
    localStorage.setItem('user_data', JSON.stringify(userData));
    localStorage.setItem('session_expiry', JSON.stringify(expiryDate)); 
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('user_data');
    localStorage.removeItem('session_expiry'); 
    window.location.href = '/';
  };

  return (
    <AuthContext.Provider value={{ token, user, isAuthenticated: !!token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}