// app/verify-email/page.tsx
"use client";

import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api';
import { Spinner } from '@/components/ui/spinner';

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      router.push('/verification-failed');
      return;
    }

    const verifyToken = async () => {
      try {
        // El backend maneja la lógica y redirige en caso de éxito o fallo.
        // Hacemos la petición y esperamos la redirección implícita del navegador.
        await apiClient.get(`/auth/verify/${token}`);
        
        // Si la petición se completa sin redirección (caso poco probable),
        // asumimos éxito y redirigimos manualmente.
        router.push('/verification-success');

      } catch (error) {
        // Si la API devuelve un error (p. ej. 400), redirigimos a la página de fallo.
        router.push('/verification-failed');
      }
    };

    verifyToken();
  }, [token, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <Spinner size="lg" />
      <p className="mt-4 text-muted-foreground">Verificando tu cuenta...</p>
    </div>
  );
}