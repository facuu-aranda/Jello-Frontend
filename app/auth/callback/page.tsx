// app/auth/callback/page.tsx
"use client";

import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { Spinner } from '@/components/ui/spinner';
import { apiClient } from '@/lib/api';
import { UserProfile } from '@/types';

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, revalidateUser } = useAuth(); // Usaremos revalidateUser

  useEffect(() => {
    const token = searchParams.get('token');

    if (!token) {
      // Si no hay token, algo salió mal
      router.push('/'); // Redirige a login
      return;
    }

    // 1. Guardar el token inmediatamente.
    // Asumimos "rememberMe" = true para login social
    localStorage.setItem('authToken', token);
    sessionStorage.removeItem('authToken');

    // 2. Usar el token para obtener los datos del usuario y actualizar el contexto
    const fetchUserAndRedirect = async () => {
      try {
        // Llama a revalidateUser, que usa el token recién guardado
        await revalidateUser(); 
        router.push('/dashboard');
      } catch (error) {
        console.error("Error al validar token de social auth:", error);
        router.push('/'); // Falló, volver a login
      }
    };

    fetchUserAndRedirect();
    
  }, [searchParams, router, revalidateUser]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <Spinner size="lg" />
      <p className="mt-4 text-muted-foreground">Autenticando...</p>
    </div>
  );
}