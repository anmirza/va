'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { getDisclaimerContentFS } from '@/lib/admin-firestore'
import { VaLogo } from '@/components/va-logo'
import { Button } from '@/components/ui/button'
import { AlertTriangle, CheckSquare, Square, Film, ChevronRight, FileText } from 'lucide-react'

export default function ProductionDisclaimerPage() {
  const router = useRouter()
  const [agreed, setAgreed] = useState(false)
  const [disclaimerText, setDisclaimerText] = useState('')

  useEffect(() => {
    getDisclaimerContentFS().then(content => setDisclaimerText(content.production))
  }, [])

  const handleContinue = () => {
    if (!agreed) return
    router.push('/signup/production')
  }

  return (
    <div className="min-h-screen bg-[#02030E] flex flex-col">
      {/* Header */}
      <header className="bg-[#02030E]/95 backdrop-blur-md border-b border-white/[0.06] px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <Link href="/" className="text-white hover:text-white/90 transition-colors">
          <VaLogo width={62} height={39} />
        </Link>
        <Link href="/dashboard/vendor" className="text-sm text-white/50 hover:text-white transition-colors">
          ← Back to Dashboard
        </Link>
      </header>

      <div className="flex-1 flex items-start justify-center px-4 py-12">
        <div className="w-full max-w-2xl">

          {/* Icon + Title */}
          <div className="text-center mb-10">
            <div className="w-16 h-16 rounded-2xl bg-[#7c3aed]/10 border border-[#7c3aed]/20 flex items-center justify-center mx-auto mb-5">
              <Film className="w-8 h-8 text-[#7c3aed]" />
            </div>
            <p className="text-[#7c3aed] text-sm font-medium uppercase tracking-widest mb-3">Production Company Registration</p>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3 tracking-tight">
              Before You Begin
            </h1>
            <p className="text-white/50 text-sm sm:text-base max-w-md mx-auto">
              Please read the following information and legal disclaimer carefully before proceeding with your production company registration.
            </p>
          </div>

          {/* Disclaimer card */}
          <div className="glass-card rounded-2xl overflow-hidden mb-6">
            <div className="flex items-center gap-3 px-6 py-4 border-b border-white/[0.06] bg-white/[0.02]">
              <FileText className="w-4 h-4 text-[#7c3aed]" />
              <span className="text-sm font-semibold text-white/80">Legal Disclaimer & Terms</span>
              <div className="ml-auto flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20">
                <AlertTriangle className="w-3 h-3 text-amber-400" />
                <span className="text-xs text-amber-400 font-medium">Important</span>
              </div>
            </div>

            <div className="px-6 py-5 max-h-80 overflow-y-auto">
              {disclaimerText.split('\n\n').map((para, i) => (
                <p
                  key={i}
                  className={`text-sm text-white/70 leading-relaxed ${i > 0 ? 'mt-4' : ''} ${i === 0 ? 'font-semibold text-white/90' : ''}`}
                >
                  {para}
                </p>
              ))}
            </div>
          </div>

          {/* Agreement checkbox */}
          <button
            onClick={() => setAgreed(!agreed)}
            className={`w-full flex items-start gap-4 p-5 rounded-2xl border transition-all duration-200 text-left mb-6 ${
              agreed
                ? 'bg-[#7c3aed]/10 border-[#7c3aed]/40 shadow-lg shadow-[#7c3aed]/10'
                : 'bg-white/[0.03] border-white/[0.08] hover:border-white/20'
            }`}
          >
            <div className="mt-0.5 shrink-0">
              {agreed
                ? <CheckSquare className="w-5 h-5 text-[#7c3aed]" />
                : <Square className="w-5 h-5 text-white/30" />
              }
            </div>
            <div>
              <p className="text-sm font-medium text-white mb-1">
                I have read and understood the disclaimer
              </p>
              <p className="text-xs text-white/40 leading-relaxed">
                By checking this box, I confirm that I have read, understood, and agree to the terms and conditions stated above. I confirm that all information I will provide in the registration form is accurate and truthful.
              </p>
            </div>
          </button>

          {/* CTA */}
          <Button
            onClick={handleContinue}
            disabled={!agreed}
            className="w-full h-12 bg-[#7c3aed] hover:bg-[#6d28d9] text-white rounded-xl font-medium flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            Continue to Registration
            <ChevronRight className="w-4 h-4" />
          </Button>

          <p className="text-center text-xs text-white/30 mt-4">
            This registration is subject to review and approval by the VA Consulting team.
          </p>
        </div>
      </div>
    </div>
  )
}
