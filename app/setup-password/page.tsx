'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { VaLogo } from '@/components/va-logo'
import { ShieldCheck, Lock, User, Phone, Check } from 'lucide-react'

export default function SetupPasswordPage() {
  const { user, logout, completeSetup } = useAuth()
  const router = useRouter()
  
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [name, setName] = useState(user?.name || '')
  const [mobile, setMobile] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [step, setStep] = useState(1)

  useEffect(() => {
    if (!user) {
      router.replace('/login')
    } else if (!user.mustChangePassword) {
      router.replace('/dashboard')
    }
  }, [user, router])

  const handleFinish = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    
    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }

    setIsLoading(true)
    
    // Call the actual setup completion logic in context
    setTimeout(() => {
      completeSetup({ name, mobile })
      setIsLoading(false)
      router.push('/dashboard')
    }, 1500)
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-[#02030E] flex flex-col items-center justify-center p-4">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[#0763d8]/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[#0763d8]/5 blur-[120px]" />
      </div>

      <div className="w-full max-w-xl relative z-10">
        <div className="flex justify-center mb-8">
          <VaLogo width={80} height={50} />
        </div>

        <div className="apple-glass p-8 sm:p-10">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-[#0763d8]/20 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-[#0763d8]" />
              </div>
              <h1 className="text-2xl font-bold text-white">Account Security</h1>
            </div>
            <p className="text-white/40">Since this is your first time logging in, please set up your password and complete your profile.</p>
          </div>

          <div className="flex items-center gap-2 mb-8">
            {[1, 2].map((s) => (
              <div key={s} className="flex-1 h-1.5 rounded-full overflow-hidden bg-white/5">
                <div 
                  className={`h-full transition-all duration-500 ${step >= s ? 'bg-[#0763d8]' : 'w-0'}`} 
                  style={{ width: step >= s ? '100%' : '0%' }}
                />
              </div>
            ))}
          </div>

          <form onSubmit={step === 1 ? (e) => { e.preventDefault(); setStep(2) } : handleFinish}>
            {step === 1 ? (
              <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/60">New Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                    <Input 
                      type="password" 
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="At least 8 characters"
                      className="pl-10 h-12 bg-white/[0.03] border-white/[0.08] text-white rounded-xl focus:border-[#0763d8]/50"
                      required
                    />
                  </div>
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
                </div>

                <Button className="w-full h-12 bg-[#0763d8] hover:bg-[#0655b3] text-white rounded-xl font-bold mt-4">
                  Continue to Profile
                </Button>
              </div>
            ) : (
              <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/60">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                    <Input 
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="e.g. John Doe"
                      className="pl-10 h-12 bg-white/[0.03] border-white/[0.08] text-white rounded-xl focus:border-[#0763d8]/50"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/60">Mobile Number (Mandatory)</label>
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

                {error && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-sm text-red-400">
                    {error}
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
            )}
          </form>
        </div>

        <button 
          onClick={logout}
          className="mt-6 text-white/30 hover:text-white transition-colors text-sm font-medium"
        >
          Cancel and Sign out
        </button>
      </div>
    </div>
  )
}
