'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { getRfiFieldsFS, submitForApprovalFS, getVACategoriesFS } from '@/lib/admin-firestore'
import { DynamicRfiForm } from '@/components/dynamic-rfi-form'
import { VaLogo } from '@/components/va-logo'
import { useAuth } from '@/lib/auth-context'

export default function DynamicRegistrationPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const categoryId = params.categoryId as string
  const [fields, setFields] = useState<any[]>([])
  const [categoryName, setCategoryName] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    async function load() {
      const [rfi, cats] = await Promise.all([getRfiFieldsFS(categoryId), getVACategoriesFS()])
      setFields(rfi)
      const cat = cats.find(c => c.id === categoryId)
      setCategoryName(cat?.name || 'Organization')
    }
    load()
  }, [categoryId])

  const handleSubmit = async (data: Record<string, any>) => {
    setIsSubmitting(true)
    await submitForApprovalFS({
      type: (categoryId.includes('agency') ? 'agency' : categoryId.includes('production') ? 'production' : categoryId) as any,
      companyName: data['rag-1'] || data['rpr-1'] || 'New Organization',
      submittedByUserId: user?.id || 'guest',
      submittedByName: user?.name || 'Guest User',
      submittedByEmail: user?.email || 'guest@example.com',
      profileData: { ...data, categoryId }
    })
    setIsSubmitting(false)
    setSuccess(true)
  }

  if (success) {
    return (
      <div className="min-h-screen bg-[#02030E] flex items-center justify-center p-4">
        <div className="glass-card max-w-md w-full p-10 text-center rounded-3xl border-emerald-500/20">
          <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-emerald-500" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">Registration Submitted!</h2>
          <p className="text-white/40 mb-8">
            Your {categoryName} registration has been sent to the VA Consulting team for review. You will be notified via email once approved.
          </p>
          <button 
            onClick={() => router.push('/dashboard/vendor')}
            className="w-full h-12 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold transition-all"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#02030E] selection:bg-[#0763d8]/30">
      <header className="p-6 flex justify-between items-center max-w-7xl mx-auto">
        <VaLogo className="w-10 h-10" />
        <div className="text-right">
          <p className="text-xs font-bold text-white/20 uppercase tracking-widest">Registration Portal</p>
          <p className="text-sm font-bold text-[#0763d8]">{categoryName}</p>
        </div>
      </header>

      <main className="px-4 py-12">
        <DynamicRfiForm 
          title={`${categoryName} Registration`}
          subtitle={`Fill in the details required for ${categoryName} onboarding.`}
          fields={fields}
          onSubmit={handleSubmit}
          onCancel={() => router.back()}
          isSubmitting={isSubmitting}
        />
      </main>
    </div>
  )
}

function Check({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className={className}><polyline points="20 6 9 17 4 12"/></svg>
  )
}
