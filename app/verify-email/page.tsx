"use client";

// 1. Importa Suspense y saca el Spinner del return
import { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api';
import { Spinner } from '@/components/ui/spinner';
import * as React from 'react'; // Asegúrate de que React esté importado

// 2. Mueve toda la lógica a un nuevo componente "use client"
function VerifyEmailClient() {
  const searchParams = useSearchParams();
  const router = useRouter();

  React.useEffect(() => {
    const token = searchParams.get('token');

    if (!token) {
      router.push('/verification-failed');
      return;
    }

    const verifyToken = async () => {
      try {
        await apiClient.get(`/auth/verify/${token}`);
        router.push('/verification-success');
      } catch (error) {
        router.push('/verification-failed');
      }
    };

    verifyToken();
  }, [searchParams, router]); // 'token' ya está cubierto por searchParams

  // 3. Este componente cliente renderiza el Spinner
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <Spinner size="lg" />
      <p className="mt-4 text-muted-foreground">Verificando tu cuenta...</p>
    </div>
  );
}

// 4. La página principal (Server Component) envuelve al cliente en Suspense
export default function VerifyEmailPage() {
  const fallbackUI = (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <Spinner size="lg" />
      <p className="mt-4 text-muted-foreground">Verificando tu cuenta...</p>
    </div>
  );

  return (
    <Suspense fallback={fallbackUI}>
      <VerifyEmailClient />
    </Suspense>
  );
}