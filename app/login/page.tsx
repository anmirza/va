'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { VaLogo } from '@/components/va-logo'
import { Eye, EyeOff, Mail, Lock } from 'lucide-react'

export default function LoginPage() {
  const { login } = useAuth()
  const router = useRouter()
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
      router.push('/dashboard')
    } else {
      setError(result.error || 'Login failed')
    }
  }

  return (
    <div className="min-h-screen bg-[#eef0f3] flex flex-col">
      {/* Minimal header */}
      <header className="bg-[#2e3843] px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-white hover:text-white/90 transition-colors"><VaLogo width={62} height={39} /></Link>
        <Link href="/signup" className="text-sm text-white/80 hover:text-white">
          No account? Sign up
        </Link>
      </header>

      <div className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="mb-8 text-center">
              <div className="w-12 h-12 bg-[#2e3843] rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-[#0763d8] font-bold text-lg">R</span>
              </div>
              <h1 className="text-2xl font-bold text-[#1a1a1a] mb-1">Welcome back</h1>
              <p className="text-[#666] text-sm">Sign in to your VA account</p>
            </div>

            {/* Demo credentials hint */}
            <div className="bg-[#eef0f3] rounded-lg p-3 mb-6 text-sm text-[#666]">
              <p className="font-medium text-[#1a1a1a] mb-1">Demo credentials</p>
              <p>Email: <span className="font-mono text-[#2e3843]">demo@requisti.com</span></p>
              <p>Password: <span className="font-mono text-[#2e3843]">password</span></p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#1a1a1a] mb-1.5">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#666]" />
                  <Input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="pl-10 h-11 border-[#d8dce2] focus:border-[#0763d8]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1a1a1a] mb-1.5">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#666]" />
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="pl-10 pr-10 h-11 border-[#d8dce2] focus:border-[#0763d8]"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#666] hover:text-[#1a1a1a]"
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
                className="w-full h-11 bg-[#0763d8] hover:bg-[#0655b3] text-white font-medium"
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

            <div className="mt-6 pt-6 border-t border-[#e5e5e1] text-center text-sm text-[#666]">
              Don&apos;t have an account?{' '}
              <Link href="/signup" className="text-[#0763d8] hover:underline font-medium">
                Sign up for free
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
