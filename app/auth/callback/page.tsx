// 1. Importa Suspense y saca el Spinner del return
import { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { Spinner } from '@/components/ui/spinner';
import { apiClient } from '@/lib/api';
import { UserProfile } from '@/types';
import * as React from 'react'; // Asegúrate de que React esté importado

// 2. Mueve toda la lógica a un nuevo componente "use client"
"use client";
function CallbackClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { revalidateUser } = useAuth();

  React.useEffect(() => {
    const token = searchParams.get('token');

    if (!token) {
      router.push('/');
      return;
    }

    localStorage.setItem('authToken', token);
    sessionStorage.removeItem('authToken');

    const fetchUserAndRedirect = async () => {
      try {
        await revalidateUser();
        router.push('/dashboard');
      } catch (error) {
        console.error("Error al validar token de social auth:", error);
        router.push('/');
      }
    };

    fetchUserAndRedirect();
    
  }, [searchParams, router, revalidateUser]);

  // 3. Este componente cliente renderiza el Spinner
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <Spinner size="lg" />
      <p className="mt-4 text-muted-foreground">Autenticando...</p>
    </div>
  );
}

// 4. La página principal (Server Component por defecto) envuelve al cliente en Suspense
export default function AuthCallbackPage() {
  const fallbackUI = (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <Spinner size="lg" />
      <p className="mt-4 text-muted-foreground">Autenticando...</p>
    </div>
  );

  return (
    <Suspense fallback={fallbackUI}>
      <CallbackClient />
    </Suspense>
  );
}