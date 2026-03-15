'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { VaLogo } from '@/components/va-logo'
import { Eye, EyeOff } from 'lucide-react'

const BLOCKED_DOMAINS = [
  'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'aol.com',
  'icloud.com', 'mail.com', 'protonmail.com', 'zoho.com', 'yandex.com',
  'live.com', 'msn.com', 'me.com', 'mac.com', 'gmx.com',
]

function validateEmail(email: string): string | null {
  const domain = email.split('@')[1]?.toLowerCase()
  if (!domain) return 'Please enter a valid email'
  if (BLOCKED_DOMAINS.includes(domain)) {
    return 'Please use a corporate email address. Personal email domains (Gmail, Yahoo, etc.) are not accepted.'
  }
  return null
}

export default function SignupPage() {
  const { signup } = useAuth()
  const router = useRouter()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const emailError = validateEmail(email)
    if (emailError) { setError(emailError); return }
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return }

    setError('')
    setIsLoading(true)
    const result = await signup({ name, email, password })
    setIsLoading(false)

    if (result.success) {
      router.push('/signup/classify')
    } else {
      setError(result.error || 'Signup failed. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-[#02030E] flex flex-col">
      <header className="bg-[#02030E]/95 backdrop-blur-md border-b border-white/[0.06] px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-white hover:text-white/90 transition-colors">
          <VaLogo width={62} height={39} />
        </Link>
        <Link href="/login" className="text-sm text-white/60 hover:text-white transition-colors">
          Already have an account? Sign in
        </Link>
      </header>

      <div className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2 tracking-tight">Create your account</h1>
            <p className="text-white/50 text-sm sm:text-base">Join the network with your company email</p>
          </div>

          <div className="glass-card p-6 sm:p-8 rounded-2xl">
            <form onSubmit={handleSubmit} className="space-y-5">
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
                <p className="text-xs text-white/30 mt-1.5">
                  Personal email domains (Gmail, Yahoo, etc.) are not accepted
                </p>
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
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/60 transition-colors"
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
                className="w-full h-11 bg-[#0763d8] hover:bg-[#0655b3] text-white rounded-xl font-medium"
                disabled={isLoading}
              >
                {isLoading ? 'Creating account…' : 'Continue'}
              </Button>

              <p className="text-xs text-white/30 text-center">
                By signing up you agree to our Terms of Service and Privacy Policy
              </p>
            </form>
          </div>

          <p className="text-center text-sm text-white/50 mt-6">
            Already have an account?{' '}
            <Link href="/login" className="text-[#0763d8] hover:text-[#3b8aff] transition-colors font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
