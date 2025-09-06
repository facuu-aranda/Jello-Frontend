import { PublicLayout } from "@/components/layout/public-layout"
import { LoginForm } from "@/components/login-form"

export default function LoginPage() {
  return (
    <PublicLayout>
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)] px-4">
        <LoginForm />
      </div>
    </PublicLayout>
  )
}
