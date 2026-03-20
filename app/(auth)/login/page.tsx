import { AuthForm } from '@/features/auth/components/AuthForm'
import { Suspense } from 'react'

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50/50">
      <Suspense fallback={<div className="text-gray-500">Loading form...</div>}>
        <AuthForm />
      </Suspense>
    </div>
  )
}
