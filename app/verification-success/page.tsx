// app/verification-success/page.tsx
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';

export default function VerificationSuccessPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-center p-4">
      <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
      <h1 className="text-3xl font-bold mb-2">¡Cuenta Activada!</h1>
      <p className="text-muted-foreground mb-6 max-w-sm">
        Tu correo electrónico ha sido verificado correctamente. Ya puedes iniciar sesión y empezar a colaborar.
      </p>
      <Button asChild>
        <Link href="/">Ir a Iniciar Sesión</Link>
      </Button>
    </div>
  );
}