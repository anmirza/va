'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { getRfiFieldsFS, submitForApprovalFS } from '@/lib/admin-firestore'
import { DynamicRfiForm } from '@/components/dynamic-rfi-form'
import { VaLogo } from '@/components/va-logo'
import { useAuth } from '@/lib/auth-context'

export default function ProductionSignupPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [fields, setFields] = useState<any[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    getRfiFieldsFS('cat-production').then(setFields)
  }, [])

  const handleSubmit = async (data: Record<string, any>) => {
    setIsSubmitting(true)
    await new Promise(r => setTimeout(r, 1500))
    
    await submitForApprovalFS({
      type: 'production',
      companyName: data['rpr-1'] || 'New Production House',
      submittedByUserId: user?.id || 'guest',
      submittedByName: user?.name || 'Guest User',
      submittedByEmail: user?.email || 'guest@example.com',
      profileData: { ...data, categoryId: 'cat-production' }
    })
    
    setIsSubmitting(false)
    setSuccess(true)
  }

  if (success) {
    return (
      <div className="min-h-screen bg-[#02030E] flex items-center justify-center p-4 text-center">
        <div className="glass-card max-w-md p-10 rounded-3xl border-purple-500/20">
          <div className="w-16 h-16 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-purple-500/20">
            <svg className="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Application Submitted</h2>
          <p className="text-white/40 mb-8 text-sm leading-relaxed">
            Your production house profile has been sent for review. We will contact you shortly once the process is complete.
          </p>
          <button onClick={() => router.push('/dashboard/vendor')} className="w-full h-12 bg-purple-500 text-white rounded-xl font-bold hover:bg-purple-600 transition-all">
            Return to Dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#02030E]">
      <header className="p-6 max-w-7xl mx-auto flex items-center justify-between">
        <VaLogo width={60} height={38} />
        <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-white/20">Production Onboarding</span>
      </header>
      <main className="px-4 py-8">
        <DynamicRfiForm 
          title="Production Registration"
          subtitle="Showcase your production capabilities and talent."
          fields={fields}
          onSubmit={handleSubmit}
          onCancel={() => router.back()}
          isSubmitting={isSubmitting}
        />
      </main>
    </div>
  )
}
