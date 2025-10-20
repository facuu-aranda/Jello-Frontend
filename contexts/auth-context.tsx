// contexts/auth-context.tsx
"use client";

import * as React from "react";
import { UserProfile, ApiError } from "@/types";
import { apiClient } from "@/lib/api";
import { useRouter } from "next/navigation";
import { toast } from "sonner";


interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  isLoading: boolean;
  login: (data: any, rememberMe: boolean) => Promise<void>;
  register: (data: any) => Promise<{ success: boolean }>;
  logout: () => void;
  revalidateUser: () => Promise<void>;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<UserProfile | null>(null);
  const [token, setToken] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const router = useRouter();

  const fetchUser = React.useCallback(async () => {
    // Primero intenta con sessionStorage, luego con localStorage
    const sessionToken = sessionStorage.getItem('authToken');
    const localToken = localStorage.getItem('authToken');
    const storedToken = sessionToken || localToken;

    if (storedToken) {
      setToken(storedToken);
      try {
        const userData = await apiClient.get<UserProfile>('/user/me');
        setUser(userData);
      } catch {
        // Token inválido, limpiamos todo
        localStorage.removeItem('authToken');
        sessionStorage.removeItem('authToken');
        setToken(null);
        setUser(null);
      }
    }
    setIsLoading(false);
  }, []);

  React.useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const handleAuthSuccess = (data: { token: string; user: UserProfile }, rememberMe: boolean) => {
    setToken(data.token);
    setUser(data.user);
    
    // Guardar el token en el almacenamiento correcto
    if (rememberMe) {
      localStorage.setItem('authToken', data.token);
      sessionStorage.removeItem('authToken');
    } else {
      sessionStorage.setItem('authToken', data.token);
      localStorage.removeItem('authToken');
    }
    
    router.push('/dashboard');
    toast.success(`Welcome, ${data.user.name}!`);
  };

  const login = async (data: any, rememberMe: boolean) => {
    try {
      const response = await apiClient.login({ ...data, rememberMe });
      handleAuthSuccess(response, rememberMe);
    } catch (error) {
      // 3. Manejo de error mejorado
      const apiError = error as ApiError;
      const errorMessage = apiError.response?.data?.error || (error as Error).message || 'Ocurrió un error inesperado.';
      
      // Manejo específico del error 403
      if (apiError.response?.status === 403) {
        toast.error(errorMessage);
      } else {
        toast.error(errorMessage);
      }
    }
  };

  const register = async (data: any): Promise<{ success: boolean }> => {
    try {
      // El registro ya no devuelve un token, solo un mensaje de éxito.
      await apiClient.register(data);
      toast.success("Registro exitoso. Por favor, revisa tu correo para activar tu cuenta.");
      return { success: true };
    } catch (error) {
      // 4. Manejo de error mejorado
      const apiError = error as ApiError;
      const errorMessage = apiError.response?.data?.error || (error as Error).message || 'Ocurrió un error inesperado.';
      toast.error(errorMessage);
      return { success: false };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    // Limpiar ambos almacenamientos al cerrar sesión
    localStorage.removeItem('authToken');
    sessionStorage.removeItem('authToken');
    router.push('/');
    toast.info("You have been logged out.");
  };

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