"use client"

import * as React from "react";
import { UserProfile } from "@/types";
import { apiClient } from "@/lib/api";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  isLoading: boolean;
  login: (data: any) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  revalidateUser: () => Promise<void>; // <-- NUEVA FUNCIÓN AÑADIDA
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<UserProfile | null>(null);
  const [token, setToken] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const router = useRouter();

  const fetchUser = React.useCallback(async () => {
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
      setToken(storedToken);
      try {
        const userData = await apiClient.get<UserProfile>('/user/me');
        setUser(userData);
      } catch {
        // Token inválido, limpiamos
        localStorage.removeItem('authToken');
        setToken(null);
        setUser(null);
      }
    }
    setIsLoading(false);
  }, []);

  React.useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const handleAuthSuccess = (data: { token: string; user: UserProfile }) => {
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem('authToken', data.token);
    router.push('/dashboard');
    toast.success(`Welcome, ${data.user.name}!`);
  };

  const login = async (data: any) => {
    try {
      const response = await apiClient.login(data);
      handleAuthSuccess(response);
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  const register = async (data: any) => {
    try {
      const response = await apiClient.register(data);
      handleAuthSuccess(response);
    } catch (error) {
      toast.error((error as Error).message);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('authToken');
    router.push('/');
    toast.info("You have been logged out.");
  };

  // NUEVA FUNCIÓN PARA REVALIDAR DATOS DEL USUARIO
  const revalidateUser = async () => {
    await fetchUser();
  };

  const value = { user, token, isLoading, login, register, logout, revalidateUser };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

