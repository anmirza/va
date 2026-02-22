'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Building2, Film, User, Eye, EyeOff } from 'lucide-react'

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
    id: 'talent' as const,
    icon: User,
    title: 'Creative Professional',
    description: 'Build your talent profile and get discovered by top agencies',
    nextPath: '/signup/talent',
  },
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

  const handleRoleSelect = (role: typeof roles[0]) => {
    setSelectedRole(role)
    setStep('details')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedRole) return
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
    <div className="min-h-screen bg-[#eef0f3] flex flex-col">
      <header className="bg-[#2e3843] px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-white">VA</Link>
        <Link href="/login" className="text-sm text-white/80 hover:text-white">
          Already have an account? Sign in
        </Link>
      </header>

      <div className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-lg">
          {step === 'role' ? (
            <div>
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-[#1a1a1a] mb-2">Join VA</h1>
                <p className="text-[#666]">Select the option that best describes you</p>
              </div>
              <div className="space-y-4">
                {roles.map(role => {
                  const Icon = role.icon
                  return (
                    <button
                      key={role.id}
                      onClick={() => handleRoleSelect(role)}
                      className="w-full bg-white rounded-xl shadow-sm p-6 flex items-start gap-4 hover:shadow-md hover:border-[#4fc487] border-2 border-transparent transition-all text-left"
                    >
                      <div className="w-12 h-12 bg-[#eef0f3] rounded-lg flex items-center justify-center shrink-0">
                        <Icon className="w-6 h-6 text-[#4fc487]" />
                      </div>
                      <div>
                        <p className="font-bold text-[#1a1a1a] mb-1">{role.title}</p>
                        <p className="text-sm text-[#666]">{role.description}</p>
                      </div>
                    </button>
                  )
                })}
              </div>
              <p className="text-center text-sm text-[#666] mt-6">
                Already have an account?{' '}
                <Link href="/login" className="text-[#4fc487] hover:underline">Sign in</Link>
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <button
                onClick={() => setStep('role')}
                className="text-sm text-[#666] hover:text-[#1a1a1a] mb-6 flex items-center gap-1"
              >
                ← Back
              </button>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-[#1a1a1a] mb-1">Create your account</h2>
                <p className="text-sm text-[#666]">
                  Signing up as <span className="font-medium text-[#1a1a1a]">{selectedRole?.title}</span>
                </p>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#1a1a1a] mb-1.5">Full Name</label>
                  <Input
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Your name"
                    className="h-11 border-[#d8dce2]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1a1a1a] mb-1.5">Email</label>
                  <Input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="h-11 border-[#d8dce2]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1a1a1a] mb-1.5">Password</label>
                  <div className="relative">
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="Min 8 characters"
                      className="h-11 border-[#d8dce2] pr-10"
                      minLength={8}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#666]"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
                    {error}
                  </div>
                )}
                <Button
                  type="submit"
                  className="w-full h-11 bg-[#4fc487] hover:bg-[#45b078] text-white"
                  disabled={isLoading}
                >
                  {isLoading ? 'Creating account...' : 'Create Account'}
                </Button>
                <p className="text-xs text-[#666] text-center">
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
