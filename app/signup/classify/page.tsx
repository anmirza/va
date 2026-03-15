'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'
import { VaLogo } from '@/components/va-logo'
import { Building2, Briefcase, ChevronRight, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'

const ACCOUNT_TYPES = [
  {
    id: 'vendor' as const,
    icon: Building2,
    title: 'Vendor',
    subtitle: 'Agency or Production House',
    description: 'Register and manage your agency, production company, or both from a single account. Showcase your work, attract clients, and grow your business.',
    features: [
      'Register one or more companies',
      'Full control of your company profile',
      'Appear in the directory',
      'Manage awards, talent & competencies',
    ],
    nextPath: '/dashboard/vendor',
    accent: '#0763d8',
  },
  {
    id: 'client' as const,
    icon: Briefcase,
    title: 'Client',
    subtitle: 'Brand or Advertiser',
    description: 'Access the creative intelligence platform to discover, evaluate and manage agency and production partners worldwide.',
    features: [
      'Browse the full directory',
      'Save and compare agencies',
      'Access creative intelligence data',
      'Upgrade for deeper insights',
    ],
    nextPath: '/dashboard',
    accent: '#7c3aed',
  },
]

export default function ClassifyPage() {
  const { user, setAccountType } = useAuth()
  const router = useRouter()
  const [selected, setSelected] = useState<'vendor' | 'client' | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // If already classified, redirect immediately (must be in useEffect, not render)
  useEffect(() => {
    if (user?.accountType) {
      router.replace(user.accountType === 'vendor' ? '/dashboard/vendor' : '/dashboard')
    }
  }, [user, router])

  if (user?.accountType) return null

  const handleConfirm = async () => {
    if (!selected) return
    setIsLoading(true)
    setAccountType(selected)
    const next = ACCOUNT_TYPES.find(t => t.id === selected)!.nextPath
    router.push(next)
  }

  return (
    <div className="min-h-screen bg-[#02030E] flex flex-col">
      <header className="bg-[#02030E]/95 backdrop-blur-md border-b border-white/[0.06] px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-white hover:text-white/90 transition-colors">
          <VaLogo width={62} height={39} />
        </Link>
        <span className="text-sm text-white/40">Step 2 of 2</span>
      </header>

      <div className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-2xl">
          <div className="text-center mb-10">
            <p className="text-[#0763d8] text-sm font-medium uppercase tracking-widest mb-3">
              Welcome{user?.name ? `, ${user.name}` : ''}
            </p>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3 tracking-tight">
              How will you use Requisti?
            </h1>
            <p className="text-white/50 text-sm sm:text-base max-w-md mx-auto">
              Choose your account type. You can only select one — this determines what you can see and do on the platform.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
            {ACCOUNT_TYPES.map(type => {
              const Icon = type.icon
              const isSelected = selected === type.id
              return (
                <button
                  key={type.id}
                  onClick={() => setSelected(type.id)}
                  className={`relative text-left rounded-2xl border p-6 transition-all duration-200 outline-none ${
                    isSelected
                      ? 'bg-[#0763d8]/10 border-[#0763d8]/60 shadow-lg shadow-[#0763d8]/10'
                      : 'bg-white/[0.03] border-white/[0.08] hover:border-white/20 hover:bg-white/[0.05]'
                  }`}
                >
                  {isSelected && (
                    <span className="absolute top-4 right-4 w-6 h-6 rounded-full bg-[#0763d8] flex items-center justify-center">
                      <Check className="w-3.5 h-3.5 text-white" />
                    </span>
                  )}

                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 border"
                    style={{
                      background: isSelected ? `${type.accent}22` : 'rgba(255,255,255,0.04)',
                      borderColor: isSelected ? `${type.accent}44` : 'rgba(255,255,255,0.08)',
                    }}
                  >
                    <Icon
                      className="w-6 h-6"
                      style={{ color: isSelected ? type.accent : 'rgba(255,255,255,0.5)' }}
                    />
                  </div>

                  <h2 className="text-lg font-bold text-white mb-0.5">{type.title}</h2>
                  <p className="text-xs text-white/40 font-medium mb-3">{type.subtitle}</p>
                  <p className="text-sm text-white/60 leading-relaxed mb-4">{type.description}</p>

                  <ul className="space-y-2">
                    {type.features.map(f => (
                      <li key={f} className="flex items-start gap-2 text-xs text-white/50">
                        <span
                          className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0"
                          style={{ background: isSelected ? type.accent : 'rgba(255,255,255,0.2)' }}
                        />
                        {f}
                      </li>
                    ))}
                  </ul>
                </button>
              )
            })}
          </div>

          <div className="flex justify-center">
            <Button
              onClick={handleConfirm}
              disabled={!selected || isLoading}
              className="h-12 px-10 bg-[#0763d8] hover:bg-[#0655b3] text-white rounded-xl font-medium flex items-center gap-2 disabled:opacity-40"
            >
              {isLoading ? 'Setting up your account…' : 'Continue'}
              {!isLoading && <ChevronRight className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
