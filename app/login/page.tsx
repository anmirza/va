'use client'

import { Suspense, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { VaLogo } from '@/components/va-logo'
import { Eye, EyeOff, Mail, Lock, Shield } from 'lucide-react'

function LoginContent() {
  const { login } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)
    const result = await login(email, password)
    setIsLoading(false)
    if (result.success) {
      if (result.mustChangePassword) {
        router.push('/setup-password')
        return
      }
      const redirect = searchParams.get('redirect')
      if (redirect) {
        router.push(redirect)
        return
      }
      // Role-based redirect — result.role is returned from auth context
      const role = result.role
      if (role === 'super_admin' || role === 'admin') {
        router.push('/admin')
      } else {
        router.push('/dashboard')
      }
    } else {
      setError(result.error || 'Login failed. Please check your credentials.')
    }
  }

  return (
    <div className="min-h-screen bg-[#02030E] flex flex-col">
      {/* Header */}
      <header className="px-6 py-4 border-b border-white/[0.06] flex items-center justify-between">
        <Link href="/" className="hover:opacity-80 transition-opacity"><VaLogo width={62} height={39} /></Link>
        <Link href="/signup" className="text-sm text-white/50 hover:text-white transition-colors">
          Need access? Contact us
        </Link>
      </header>

      <div className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="glass-card rounded-2xl p-8">
            <div className="mb-8 text-center">
              <div className="w-14 h-14 bg-[#0763d8]/10 border border-[#0763d8]/20 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <Shield className="w-6 h-6 text-[#0763d8]" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-1">Welcome back</h1>
              <p className="text-white/40 text-sm">Sign in to your Aura account</p>
            </div>

            {/* Demo credentials — only shown in development / when env flag is set */}
            {process.env.NEXT_PUBLIC_SHOW_DEMO_CREDENTIALS === 'true' && (
              <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-4 mb-6 text-sm">
                <p className="font-semibold text-white/70 mb-2 text-xs uppercase tracking-wider">Demo Credentials</p>
                <div className="space-y-1 text-xs text-white/40">
                  <p>Vendor: <span className="font-mono text-white/60">demo@requisti.com</span> / <span className="font-mono text-white/60">password</span></p>
                  <p>Client: <span className="font-mono text-white/60">client@requisti.com</span> / <span className="font-mono text-white/60">password</span></p>
                  <p className="text-[#0763d8]/80">Admin: <span className="font-mono text-white/60">admin@va-consulting.com</span> / <span className="font-mono text-white/60">password</span></p>
                  <p className="text-amber-400/80">Super Admin: <span className="font-mono text-white/60">superadmin@va-consulting.com</span> / <span className="font-mono text-white/60">password</span></p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-1.5">Email address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                  <Input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    className="pl-10 h-11 bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/20 focus:border-[#0763d8]/60 focus:ring-0"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-1.5">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="pl-10 pr-10 h-11 bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/20 focus:border-[#0763d8]/60 focus:ring-0"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-sm text-red-400">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                className="w-full h-11 bg-[#0763d8] hover:bg-[#0655b3] text-white font-semibold mt-2"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Signing in...
                  </span>
                ) : 'Sign In'}
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-white/[0.06] text-center text-sm text-white/30">
              Access is by invitation only.{' '}
              <Link href="/" className="text-[#0763d8]/80 hover:text-[#0763d8] transition-colors font-medium">
                Learn more
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#02030E]" />}>
      <LoginContent />
    </Suspense>
  )
}
