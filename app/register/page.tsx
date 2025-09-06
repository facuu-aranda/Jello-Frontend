import { PublicLayout } from "@/components/layout/public-layout"
import { RegisterForm } from "@/components/register-form"

export default function RegisterPage() {
  return (
    <PublicLayout>
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)] px-4">
        <RegisterForm />
      </div>
    </PublicLayout>
  )
}
