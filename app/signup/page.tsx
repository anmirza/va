'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Building2, Film, User, Eye, EyeOff, Briefcase } from 'lucide-react'

const roles = [
  {
    id: 'agency_owner' as const,
    icon: Building2,
    title: 'Advertising Agency',
    description: 'Full-service, digital, ATL, BTL or specialist agency — showcase your work and attract new clients',
    nextPath: '/signup/agency',
  },
  {
    id: 'production' as const,
    icon: Film,
    title: 'Production House',
    description: 'Film, animation or content production company — get discovered by agencies and brands worldwide',
    nextPath: '/signup/production',
  },
  {
    id: 'client' as const,
    icon: Briefcase,
    title: 'Client',
    description: 'Get greater visibility into agency data, manage your network, and access the creative intelligence platform',
    nextPath: '/signup/client',
  },
  // Creative Professional hidden per client feedback — can be re-enabled later
  // {
  //   id: 'talent' as const,
  //   icon: User,
  //   title: 'Creative Professional',
  //   description: 'Build your talent profile and get discovered by top agencies',
  //   nextPath: '/signup/talent',
  // },
]

export default function SignupPage() {
  const { signup } = useAuth()
  const router = useRouter()
  const [step, setStep] = useState<'role' | 'details'>('role')
  const [selectedRole, setSelectedRole] = useState<typeof roles[0] | null>(null)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // Corporate email validation — block personal email domains
  const BLOCKED_DOMAINS = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'aol.com', 'icloud.com', 'mail.com', 'protonmail.com', 'zoho.com', 'yandex.com', 'live.com', 'msn.com', 'me.com', 'mac.com', 'gmx.com']

  const handleRoleSelect = (role: typeof roles[0]) => {
    setSelectedRole(role)
    setStep('details')
  }

  const validateEmail = (email: string): string | null => {
    const domain = email.split('@')[1]?.toLowerCase()
    if (!domain) return 'Please enter a valid email'
    if (BLOCKED_DOMAINS.includes(domain)) {
      return 'Please use a corporate email address. Personal email domains are not allowed.'
    }
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedRole) return

    const emailError = validateEmail(email)
    if (emailError) {
      setError(emailError)
      return
    }

    setError('')
    setIsLoading(true)
    const result = await signup({ name, email, password, role: selectedRole.id })
    setIsLoading(false)
    if (result.success) {
      router.push(selectedRole.nextPath)
    } else {
      setError(result.error || 'Signup failed')
    }
  }

  return (
    <div className="min-h-screen bg-[#02030E] flex flex-col">
      <header className="bg-[#02030E]/95 backdrop-blur-md border-b border-white/[0.06] px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-white">VA</Link>
        <Link href="/login" className="text-sm text-white/60 hover:text-white transition-colors">
          Already have an account? Sign in
        </Link>
      </header>

      <div className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-lg">
          {step === 'role' ? (
            <div>
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Join the Network</h1>
                <p className="text-white/40">Register as a Client or as a Vendor</p>
              </div>
              <div className="space-y-4">
                {roles.map(role => {
                  const Icon = role.icon
                  return (
                    <button
                      key={role.id}
                      onClick={() => handleRoleSelect(role)}
                      className="w-full glass-card p-6 flex items-start gap-4 hover:border-[#0763d8]/40 transition-all text-left"
                    >
                      <div className="w-12 h-12 bg-[#0763d8]/10 rounded-xl flex items-center justify-center shrink-0">
                        <Icon className="w-6 h-6 text-[#0763d8]" />
                      </div>
                      <div>
                        <p className="font-bold text-white mb-1">{role.title}</p>
                        <p className="text-sm text-white/40">{role.description}</p>
                      </div>
                    </button>
                  )
                })}
              </div>
              <p className="text-center text-sm text-white/40 mt-6">
                Already have an account?{' '}
                <Link href="/login" className="text-[#0763d8] hover:underline">Sign in</Link>
              </p>
            </div>
          ) : (
            <div className="glass-card p-8">
              <button
                onClick={() => setStep('role')}
                className="text-sm text-white/40 hover:text-white mb-6 flex items-center gap-1"
              >
                ← Back
              </button>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-white mb-1">Create your account</h2>
                <p className="text-sm text-white/40">
                  Signing up as <span className="font-medium text-[#0763d8]">{selectedRole?.title}</span>
                </p>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1.5">Full Name</label>
                  <Input
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Your name"
                    className="h-11 bg-white/[0.06] border-white/[0.12] text-white placeholder:text-white/30 rounded-xl"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1.5">Corporate Email</label>
                  <Input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    className="h-11 bg-white/[0.06] border-white/[0.12] text-white placeholder:text-white/30 rounded-xl"
                    required
                  />
                  <p className="text-xs text-white/30 mt-1">Personal email addresses (Gmail, Yahoo, etc.) are not accepted</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1.5">Password</label>
                  <div className="relative">
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="Min 8 characters"
                      className="h-11 bg-white/[0.06] border-white/[0.12] text-white placeholder:text-white/30 pr-10 rounded-xl"
                      minLength={8}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                {error && (
                  <div className="bg-red-400/10 border border-red-400/20 rounded-xl p-3 text-sm text-red-400">
                    {error}
                  </div>
                )}
                <Button
                  type="submit"
                  className="w-full h-11 bg-[#0763d8] hover:bg-[#0655b3] text-white rounded-xl"
                  disabled={isLoading}
                >
                  {isLoading ? 'Creating account...' : 'Create Account'}
                </Button>
                <p className="text-xs text-white/30 text-center">
                  By signing up you agree to our Terms of Service and Privacy Policy
                </p>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
