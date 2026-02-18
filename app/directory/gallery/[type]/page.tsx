'use client'

import { use } from 'react'
import Link from 'next/link'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { companies } from '@/lib/mock-data'
import { CompanyCard } from '@/components/company-card'
import { ArrowLeft } from 'lucide-react'

const GALLERY_META: Record<string, { title: string; description: string }> = {
  'full-service': { title: 'Full Service Agencies', description: 'End-to-end agency partners handling strategy, creative, and execution' },
  'digital': { title: 'Digital Agencies', description: 'Specialists in digital, social, and performance marketing' },
  'luxury': { title: 'Luxury Agencies', description: 'Agencies with proven expertise in luxury and premium brands' },
  'boutique': { title: 'Boutique Agencies', description: 'Smaller, specialist agencies offering focused creative expertise' },
  'pr': { title: 'PR Agencies', description: 'Public relations and communications specialists' },
  'social-media': { title: 'Social Media Agencies', description: 'Agencies specialising in social media strategy and content' },
  'experiential': { title: 'Experiential Agencies', description: 'Experts in brand experiences, events, and activations' },
  'media': { title: 'Media Agencies', description: 'Media planning, buying, and optimisation specialists' },
}

export default function GalleryPage({ params }: { params: Promise<{ type: string }> }) {
  const { type } = use(params)
  const meta = GALLERY_META[type] || { title: `${type.replace(/-/g, ' ')} Agencies`, description: 'Discover specialist agencies' }

  const filtered = companies.filter(c =>
    c.services.some(s => s.toLowerCase().includes(type.replace(/-/g, ' '))) ||
    (c.competencies || []).some(comp => comp.toLowerCase().includes(type.replace(/-/g, ' ')))
  )

  const fallback = filtered.length < 3 ? companies.slice(0, 9) : filtered

  return (
    <div className="min-h-screen bg-[#eef0f3] flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="bg-[#2e3843] px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-7xl mx-auto">
            <Link href="/directory" className="flex items-center gap-1.5 text-sm text-white/60 hover:text-white mb-6 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Agency Directory
            </Link>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">{meta.title}</h1>
            <p className="text-white/70">{meta.description}</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {/* Other galleries */}
          <div className="flex flex-wrap gap-2 mb-8">
            {Object.entries(GALLERY_META).map(([key, val]) => (
              <Link key={key} href={`/directory/gallery/${key}`} className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${key === type ? 'bg-[#2e3843] text-white' : 'bg-white text-[#666] hover:bg-[#d8dce2]'}`}>
                {val.title.replace(' Agencies', '')}
              </Link>
            ))}
          </div>

          <p className="text-sm text-[#666] mb-6">{fallback.length} agencies found</p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {fallback.map(company => (
              <CompanyCard key={company.id} company={company} />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
