'use client'

import Link from 'next/link'
import { VaLogo } from '@/components/va-logo'
import { Clock, CheckCircle2, Mail, ArrowLeft, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function ProductionSubmittedPage() {
  return (
    <div className="min-h-screen bg-[#02030E] flex flex-col">
      {/* Header */}
      <header className="bg-[#02030E]/95 backdrop-blur-md border-b border-white/[0.06] px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-white hover:text-white/90 transition-colors">
          <VaLogo width={62} height={39} />
        </Link>
      </header>

      <div className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-lg text-center">

          {/* Animated icon */}
          <div className="relative w-24 h-24 mx-auto mb-8">
            <div className="absolute inset-0 rounded-full bg-[#7c3aed]/20 animate-ping" style={{ animationDuration: '2s' }} />
            <div className="relative w-24 h-24 rounded-full bg-[#7c3aed]/10 border-2 border-[#7c3aed]/30 flex items-center justify-center">
              <Clock className="w-10 h-10 text-[#7c3aed]" />
            </div>
          </div>

          <div className="glass-card p-8 rounded-2xl">
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3">
              Application Submitted!
            </h1>
            <p className="text-white/60 text-sm sm:text-base leading-relaxed mb-8">
              Your production company registration is now <span className="text-amber-400 font-medium">under review</span>. Our team will carefully evaluate your application and get back to you shortly.
            </p>

            {/* Status steps */}
            <div className="space-y-3 mb-8 text-left">
              {[
                { icon: CheckCircle2, label: 'Application submitted', done: true, color: 'text-emerald-400' },
                { icon: Clock, label: 'Under review by VA team', done: true, color: 'text-[#7c3aed]', current: true },
                { icon: Mail, label: 'You will be notified by email once approved', done: false, color: 'text-white/30' },
                { icon: CheckCircle2, label: 'Profile goes live in the directory', done: false, color: 'text-white/30' },
              ].map((step, i) => {
                const Icon = step.icon
                return (
                  <div
                    key={i}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      step.current
                        ? 'bg-[#7c3aed]/10 border border-[#7c3aed]/20'
                        : step.done
                        ? 'bg-emerald-500/5 border border-emerald-500/10'
                        : 'bg-white/[0.02] border border-white/[0.04]'
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${step.color}`} />
                    <span className={`text-sm ${step.current ? 'text-white font-medium' : step.done ? 'text-emerald-400' : 'text-white/30'}`}>
                      {step.label}
                    </span>
                    {step.current && (
                      <span className="ml-auto text-xs bg-[#7c3aed]/20 text-[#7c3aed] px-2 py-0.5 rounded-full font-medium">
                        Current
                      </span>
                    )}
                  </div>
                )
              })}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/dashboard/vendor" className="flex-1">
                <Button className="w-full h-11 bg-[#7c3aed] hover:bg-[#6d28d9] text-white rounded-xl font-medium gap-2">
                  <Home className="w-4 h-4" />
                  Go to Dashboard
                </Button>
              </Link>
              <Link href="/" className="flex-1">
                <Button variant="outline" className="w-full h-11 border-white/[0.12] text-white/70 hover:text-white rounded-xl font-medium gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Back to Home
                </Button>
              </Link>
            </div>
          </div>

          <p className="text-center text-xs text-white/30 mt-6">
            The review process typically takes 2–5 business days. You can check the status in your dashboard.
          </p>
        </div>
      </div>
    </div>
  )
}
