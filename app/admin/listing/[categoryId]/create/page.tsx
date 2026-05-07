'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useSearchParams } from 'next/navigation'
import { getRfiFieldsFS, createOrgFS, getVACategoriesFS } from '@/lib/admin-firestore'
import { DynamicRfiForm } from '@/components/dynamic-rfi-form'
import { AgencyRfiForm } from '@/components/agency-rfi-form'
import { ProductionRfiForm } from '@/components/production-rfi-form'
import { VaLogo } from '@/components/va-logo'
import { useAuth } from '@/lib/auth-context'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function CreateOrgPage() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user } = useAuth()
  const categoryId = params.categoryId as string
  const editId = searchParams.get('edit')
  const [fields, setFields] = useState<any[]>([])
  const [categoryName, setCategoryName] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const isBuiltInAgency = categoryId === 'cat-agency'
  const isBuiltInProduction = categoryId === 'cat-production'
  const isBuiltIn = isBuiltInAgency || isBuiltInProduction

  useEffect(() => {
    async function load() {
      const cats = await getVACategoriesFS()
      const cat = cats.find(c => c.id === categoryId)
      setCategoryName(cat?.name || 'Organization')
      if (!isBuiltIn) {
        const rfi = await getRfiFieldsFS(categoryId)
        setFields(rfi)
      }
    }
    load()
  }, [categoryId, isBuiltIn])

  const handleSubmit = async (data: Record<string, any>) => {
    setIsSubmitting(true)
    await createOrgFS({
      name: data['rag-1'] || data['rpr-1'] || data['businessName'] || 'New ' + categoryName,
      country: data['country'] || '',
      category: categoryName,
      type: (isBuiltInAgency ? 'agency' : isBuiltInProduction ? 'production' : categoryId) as any,
      profileData: { ...data, categoryId }
    }, user?.id || 'admin')
    setIsSubmitting(false)
    router.push(`/admin/listing/${categoryId}`)
  }

  // Built-in agency → full 8-step AgencyRfiForm
  if (isBuiltInAgency) {
    return (
      <div className="min-h-screen bg-[#02030E]">
        <div className="sticky top-0 z-40 bg-[#02030E]/80 backdrop-blur-xl border-b border-white/[0.06] px-6 py-4 flex items-center gap-4">
          <Link
            href={`/admin/listing/${categoryId}`}
            className="flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Agencies
          </Link>
          <span className="text-white/20">|</span>
          <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-white/20">
            {editId ? 'Edit Agency' : 'New Agency'}
          </span>
        </div>
        <main className="px-4 py-8">
          <AgencyRfiForm
            mode="admin"
            editId={editId}
            onDone={() => router.push(`/admin/listing/${categoryId}`)}
          />
        </main>
      </div>
    )
  }

  // Built-in production → full 13-step ProductionRfiForm
  if (isBuiltInProduction) {
    return (
      <div className="min-h-screen bg-[#02030E]">
        <div className="sticky top-0 z-40 bg-[#02030E]/80 backdrop-blur-xl border-b border-white/[0.06] px-6 py-4 flex items-center gap-4">
          <Link
            href={`/admin/listing/${categoryId}`}
            className="flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Production
          </Link>
          <span className="text-white/20">|</span>
          <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-white/20">
            {editId ? 'Edit Production' : 'New Production'}
          </span>
        </div>
        <main className="px-4 py-8">
          <ProductionRfiForm
            mode="admin"
            editId={editId}
            onDone={() => router.push(`/admin/listing/${categoryId}`)}
          />
        </main>
      </div>
    )
  }

  // Custom categories → DynamicRfiForm
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
