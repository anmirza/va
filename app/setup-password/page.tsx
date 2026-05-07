'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { VaLogo } from '@/components/va-logo'
import { ShieldCheck, Lock, User, Phone, MapPin, Globe, Check, AlertCircle } from 'lucide-react'

const PASSWORD_RULES = [
  { label: 'At least 8 characters',    test: (p: string) => p.length >= 8 },
  { label: 'Contains uppercase letter', test: (p: string) => /[A-Z]/.test(p) },
  { label: 'Contains lowercase letter', test: (p: string) => /[a-z]/.test(p) },
  { label: 'Contains a number',         test: (p: string) => /\d/.test(p) },
]

export default function SetupPasswordPage() {
  const { user, logout, completeSetup } = useAuth()
  const router = useRouter()

  const [password, setPassword]               = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [name, setName]                       = useState('')
  const [mobile, setMobile]                   = useState('')
  const [region, setRegion]                   = useState('')
  const [country, setCountry]                 = useState('')
  const [isLoading, setIsLoading]             = useState(false)
  const [error, setError]                     = useState('')
  const [step, setStep]                       = useState(1)

  useEffect(() => {
    if (!user) {
      router.replace('/login')
    } else if (!user.mustChangePassword) {
      router.replace('/dashboard')
    } else {
      setName(user.name || '')
    }
  }, [user, router])

  const allRulesMet = PASSWORD_RULES.every(r => r.test(password))

  const handleStep1 = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!allRulesMet) { setError('Password does not meet all requirements.'); return }
    if (password !== confirmPassword) { setError('Passwords do not match.'); return }
    setStep(2)
  }

  const handleFinish = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!name.trim())   { setError('Full name is required.'); return }
    if (!mobile.trim()) { setError('Mobile number is required.'); return }

    setIsLoading(true)
    const result = await completeSetup({ name, mobile, region, country, newPassword: password })
    setIsLoading(false)

    if (!result.success) {
      setError(result.error || 'Setup failed. Please try again.')
      return
    }
    router.push('/dashboard')
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-[#02030E] flex flex-col items-center justify-center p-4">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[#0763d8]/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[#0763d8]/5 blur-[120px]" />
      </div>

      <div className="w-full max-w-xl relative z-10">
        <div className="flex justify-center mb-8">
          <VaLogo width={80} height={50} />
        </div>

        <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-8 sm:p-10">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-[#0763d8]/20 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-[#0763d8]" />
              </div>
              <h1 className="text-2xl font-bold text-white">Account Setup</h1>
            </div>
            <p className="text-white/40 text-sm">
              {step === 1
                ? 'Set a secure password for your account.'
                : 'Complete your profile to activate your account.'}
            </p>
          </div>

          {/* Progress */}
          <div className="flex items-center gap-2 mb-8">
            {[1, 2].map(s => (
              <div key={s} className="flex-1 h-1.5 rounded-full overflow-hidden bg-white/5">
                <div className="h-full bg-[#0763d8] transition-all duration-500" style={{ width: step >= s ? '100%' : '0%' }} />
              </div>
            ))}
          </div>

          {/* Step 1 — Password */}
          {step === 1 && (
            <form onSubmit={handleStep1}>
              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/60">New Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                    <Input
                      type="password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="Create a strong password"
                      className="pl-10 h-12 bg-white/[0.03] border-white/[0.08] text-white rounded-xl focus:border-[#0763d8]/50"
                      required
                    />
                  </div>
                  {password.length > 0 && (
                    <div className="grid grid-cols-2 gap-1.5 mt-3">
                      {PASSWORD_RULES.map(rule => (
                        <div key={rule.label} className={`flex items-center gap-1.5 text-xs ${rule.test(password) ? 'text-emerald-400' : 'text-white/30'}`}>
                          <Check className="w-3 h-3 shrink-0" />
                          {rule.label}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/60">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                    <Input
                      type="password"
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      placeholder="Repeat your password"
                      className="pl-10 h-12 bg-white/[0.03] border-white/[0.08] text-white rounded-xl focus:border-[#0763d8]/50"
                      required
                    />
                  </div>
                  {confirmPassword.length > 0 && password !== confirmPassword && (
                    <p className="text-xs text-red-400 flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3 h-3" /> Passwords do not match
                    </p>
                  )}
                </div>

                {error && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-sm text-red-400 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" /> {error}
                  </div>
                )}

                <Button
                  className="w-full h-12 bg-[#0763d8] hover:bg-[#0655b3] text-white rounded-xl font-bold mt-2"
                  disabled={!allRulesMet || password !== confirmPassword}
                >
                  Continue to Profile
                </Button>
              </div>
            </form>
          )}

          {/* Step 2 — Profile */}
          {step === 2 && (
            <form onSubmit={handleFinish}>
              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/60">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                    <Input
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="Your full name"
                      className="pl-10 h-12 bg-white/[0.03] border-white/[0.08] text-white rounded-xl focus:border-[#0763d8]/50"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/60">Mobile Number <span className="text-red-400">*</span></label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                    <Input
                      type="tel"
                      value={mobile}
                      onChange={e => setMobile(e.target.value)}
                      placeholder="+44 7700 900000"
                      className="pl-10 h-12 bg-white/[0.03] border-white/[0.08] text-white rounded-xl focus:border-[#0763d8]/50"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/60">Region</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                      <Input
                        value={region}
                        onChange={e => setRegion(e.target.value)}
                        placeholder="e.g. EMEA"
                        className="pl-10 h-12 bg-white/[0.03] border-white/[0.08] text-white rounded-xl focus:border-[#0763d8]/50"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/60">Country</label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                      <Input
                        value={country}
                        onChange={e => setCountry(e.target.value)}
                        placeholder="e.g. Italy"
                        className="pl-10 h-12 bg-white/[0.03] border-white/[0.08] text-white rounded-xl focus:border-[#0763d8]/50"
                      />
                    </div>
                  </div>
                </div>

                <p className="text-xs text-white/30">
                  Your company has been pre-populated by VA Consulting. Region and Country define your access scope.
                </p>

                {error && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-sm text-red-400 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" /> {error}
                  </div>
                )}

                <div className="flex gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(1)}
                    className="flex-1 h-12 border-white/10 text-white hover:bg-white/5 rounded-xl"
                  >
                    Back
                  </Button>
                  <Button
                    className="flex-[2] h-12 bg-[#0763d8] hover:bg-[#0655b3] text-white rounded-xl font-bold"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Saving...' : 'Complete Setup'}
                  </Button>
                </div>
              </div>
            </form>
          )}
        </div>

        <button
          onClick={() => { logout(); router.replace('/login') }}
          className="mt-6 block mx-auto text-white/30 hover:text-white transition-colors text-sm"
        >
          Cancel and sign out
        </button>
      </div>
    </div>
  )
}
