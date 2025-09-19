 "use client"

    import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
    import { api } from '@/lib/api/client'; // <-- 1. Importamos nuestro cliente de API
    import { User } from '@/lib/api/types'; // <-- Importamos nuestro tipo User

    export interface AuthContextType { // <-- Exportamos la interfaz para usarla en el cliente
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
        const storedToken = localStorage.getItem('jello_token');
        const storedUser = localStorage.getItem('jello_user');

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        }
        setIsLoading(false);

        // --- 2. Escuchamos el evento de error de autenticación ---
        const handleAuthError = () => {
          console.log("Authentication error detected, logging out.");
          logout();
        };
        window.addEventListener('auth-error', handleAuthError);
        return () => {
          window.removeEventListener('auth-error', handleAuthError);
        };
      }, []);

      const login = async (email: string, password: string, rememberMe: boolean) => {
        // --- 3. Usamos el cliente de API ---
        const data = await api.post('/auth/login', { email, password, rememberMe });
        setToken(data.token);
        setUser(data.user);
        localStorage.setItem('jello_token', data.token);
        localStorage.setItem('jello_user', JSON.stringify(data.user));
      };
      
      const register = async (name: string, email: string, password: string) => {
        // --- 3. Usamos el cliente de API ---
        await api.post('/auth/register', { name, email, password });
      };

      const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('jello_token');
        localStorage.removeItem('jello_user');
        // Redirigir al inicio para evitar que el usuario se quede en una página protegida
        window.location.href = '/';
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