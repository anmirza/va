'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { getRfiFieldsFS, createOrgFS, getVACategoriesFS } from '@/lib/admin-firestore'
import { DynamicRfiForm } from '@/components/dynamic-rfi-form'
import { VaLogo } from '@/components/va-logo'
import { useAuth } from '@/lib/auth-context'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function CreateOrgPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const categoryId = params.categoryId as string
  const [fields, setFields] = useState<any[]>([])
  const [categoryName, setCategoryName] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

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
    await createOrgFS({
      name: data['rag-1'] || data['rpr-1'] || data['businessName'] || 'New ' + categoryName,
      country: data['country'] || '',
      category: categoryName,
      type: (categoryId.includes('agency') ? 'agency' : categoryId.includes('production') ? 'production' : categoryId) as any,
      profileData: { ...data, categoryId }
    }, user?.id || 'admin')
    
    setIsSubmitting(false)
    router.push(`/admin/listing/${categoryId}`)
  }

  return (
    <div className="max-w-5xl mx-auto pb-20">
      <Link 
        href={`/admin/listing/${categoryId}`} 
        className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to {categoryName} Listing
      </Link>

      <div className="flex items-center gap-3 mb-10">
        <div className="w-12 h-12 rounded-2xl bg-[#0763d8]/10 border border-[#0763d8]/20 flex items-center justify-center">
          <VaLogo width={24} height={15} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Add {categoryName}</h1>
          <p className="text-white/40 text-sm">Manually create a new {categoryName.toLowerCase()} record.</p>
        </div>
      </div>

      <DynamicRfiForm 
        title={`${categoryName} Details`}
        subtitle="Complete the RFI profile for this organization."
        fields={fields}
        onSubmit={handleSubmit}
        onCancel={() => router.back()}
        isSubmitting={isSubmitting}
      />
    </div>
  )
}
