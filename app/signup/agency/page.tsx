'use client'

import { useRouter } from 'next/navigation'
import { VaLogo } from '@/components/va-logo'
import { AgencyRfiForm } from '@/components/agency-rfi-form'

export default function AgencySignupPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-[#02030E]">
      <header className="p-6 max-w-7xl mx-auto flex items-center justify-between">
        <VaLogo width={60} height={38} />
        <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-white/20">Agency Onboarding</span>
      </header>
      <main className="px-4 py-8">
        <AgencyRfiForm
          mode="signup"
          onDone={() => router.push('/dashboard/vendor')}
        />
      </main>
    </div>
  )
}
