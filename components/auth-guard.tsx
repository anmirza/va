'use client'

import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isLoading) return
    if (!user) {
      router.replace('/login')
      return
    }
    // User is logged in but hasn't classified yet
    if (!user.accountType) {
      router.replace('/signup/classify')
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#02030E] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#0763d8] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!user || !user.accountType) return null

  return <>{children}</>
}
