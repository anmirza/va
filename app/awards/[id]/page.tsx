'use client'

import { use } from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { getAwardOrganizationById, awards, companies } from '@/lib/mock-data'
import { Globe, Calendar, Trophy, ArrowLeft } from 'lucide-react'

export default function AwardShowPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const org = getAwardOrganizationById(id)
  if (!org) notFound()

  const orgAwards = awards.filter(a => a.festivalId === id)

  const levelColor = { grand_prix: '#f5d742', gold: '#d4a574', silver: '#c0c0c0', bronze: '#cd7f32' }

  return (
    <div className="min-h-screen bg-[#eef0f3] flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <div className="bg-[#2e3843] px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-5xl mx-auto">
            <Link href="/awards" className="flex items-center gap-1.5 text-sm text-white/60 hover:text-white mb-6 transition-colors">
              <ArrowLeft className="w-4 h-4" /> All Award Shows
            </Link>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">{org.name}</h1>
            <p className="text-[#98F5CC] text-lg mb-4">{org.country} · Founded {org.founded}</p>
            <p className="text-white/70 max-w-2xl">{org.description}</p>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold text-[#1a1a1a] mb-6">Winners</h2>
              {orgAwards.length > 0 ? (
                <div className="space-y-4">
                  {orgAwards.map(award => {
                    const company = companies.find(c => c.id === award.companyId)
                    const color = levelColor[award.level]
                    return (
                      <div key={award.id} className="bg-white rounded-xl p-5 shadow-sm flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: `${color}20`, border: `2px solid ${color}` }}>
                          <Trophy className="w-5 h-5" style={{ color }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-[#1a1a1a]">{award.title}</p>
                          {award.campaign && <p className="text-sm text-[#666]">{award.campaign}</p>}
                          <p className="text-xs text-[#666] mt-0.5">{award.year}</p>
                        </div>
                        {company && (
                          <Link href={`/directory/${company.id}`} className="shrink-0 text-right hover:text-[#4fc487] transition-colors">
                            <p className="text-sm font-medium text-[#1a1a1a]">{company.name}</p>
                            <p className="text-xs text-[#666]">{company.city}</p>
                          </Link>
                        )}
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="bg-white rounded-xl p-10 text-center text-[#666] shadow-sm">
                  <Trophy className="w-12 h-12 mx-auto mb-3 text-[#d8dce2]" />
                  <p>Winner data for this festival coming soon.</p>
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="font-bold text-[#1a1a1a] mb-4">About</h3>
                <dl className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-[#666]">Country</dt>
                    <dd className="font-medium text-[#1a1a1a]">{org.country}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-[#666]">Founded</dt>
                    <dd className="font-medium text-[#1a1a1a]">{org.founded}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-[#666]">Frequency</dt>
                    <dd className="font-medium text-[#1a1a1a] capitalize">{org.frequency}</dd>
                  </div>
                </dl>
                <a href={`https://${org.website}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-[#4fc487] hover:underline text-sm mt-4">
                  <Globe className="w-4 h-4" /> {org.website}
                </a>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="font-bold text-[#1a1a1a] mb-4">Categories</h3>
                <div className="flex flex-wrap gap-2">
                  {org.categories.map(c => (
                    <span key={c} className="px-3 py-1.5 bg-[#eef0f3] text-sm text-[#666] rounded-full">{c}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
