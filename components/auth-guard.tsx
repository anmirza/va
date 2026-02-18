'use client'

import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace('/login')
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#eef0f3] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#4fc487] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!user) return null

  return <>{children}</>
}
