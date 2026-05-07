'use client'

import { useRouter } from 'next/navigation'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { VaLogo } from '@/components/va-logo'
import { AgencyRfiForm } from '@/components/agency-rfi-form'

export default function AgencyCreatePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const editId = searchParams.get('edit')

  return (
    <div className="min-h-screen bg-[#02030E]">
      <header className="sticky top-0 z-40 bg-[#02030E]/80 backdrop-blur-xl border-b border-white/[0.06] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/agencies" className="flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Agencies
          </Link>
          <span className="text-white/20">|</span>
          <VaLogo width={44} height={28} />
        </div>
        <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-white/20">
          {editId ? 'Edit Agency' : 'New Agency'}
        </span>
      </header>
      <main className="px-4 py-8">
        <AgencyRfiForm
          mode="admin"
          editId={editId}
          onDone={() => router.push('/admin/agencies')}
        />
      </main>
    </div>
  )
}
