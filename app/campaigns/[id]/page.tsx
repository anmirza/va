'use client'

import { use } from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { getCampaignById, campaigns, getCompanyById } from '@/lib/mock-data'
import { useFollow } from '@/lib/follow-context'
import { ArrowLeft, Eye, Award, Globe, Bookmark, BookmarkCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function CampaignDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const campaign = getCampaignById(id)
  if (!campaign) notFound()

  const agency = getCompanyById(campaign.agencyId)
  const related = campaigns.filter(c => c.id !== id && (c.agencyId === campaign.agencyId || c.sector === campaign.sector)).slice(0, 3)
  const { isSavedCampaign, toggleCampaign } = useFollow()
  const saved = isSavedCampaign(id)

  return (
    <div className="min-h-screen bg-[#eef0f3] flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <div className="relative h-72 sm:h-96 lg:h-[500px] overflow-hidden bg-[#2e3843]">
          <img src={campaign.thumbnail} alt={campaign.title} className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          <div className="absolute top-4 left-4">
            <Link href="/creative-library" className="flex items-center gap-1.5 text-sm text-white/80 hover:text-white bg-black/30 backdrop-blur px-3 py-1.5 rounded-lg transition-colors">
              <ArrowLeft className="w-4 h-4" /> Creative Library
            </Link>
          </div>
          <div className="absolute bottom-0 left-0 right-0 px-4 sm:px-6 lg:px-8 pb-8 max-w-5xl mx-auto">
            <div className="flex flex-wrap gap-2 mb-3">
              {campaign.format.map(f => (
                <span key={f} className="px-2.5 py-1 bg-white/20 backdrop-blur text-white text-xs rounded-full">{f}</span>
              ))}
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-1">{campaign.title}</h1>
            <p className="text-white/80 text-lg">{campaign.brand} · {campaign.year}</p>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-start justify-between mb-4">
                  <h2 className="text-xl font-bold text-[#1a1a1a]">About This Campaign</h2>
                  <Button
                    onClick={() => toggleCampaign(id)}
                    variant="outline"
                    size="sm"
                    className={`border gap-1.5 ${saved ? 'border-[#4fc487] text-[#4fc487]' : 'border-[#d8dce2] text-[#666]'}`}
                  >
                    {saved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                    {saved ? 'Saved' : 'Save'}
                  </Button>
                </div>
                <p className="text-[#666] leading-relaxed">{campaign.description || 'Award-winning campaign showcasing the best in creative advertising.'}</p>
                <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-[#e5e5e1]">
                  {campaign.views && (
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 text-[#4fc487] mb-1">
                        <Eye className="w-4 h-4" />
                        <span className="font-bold">{(campaign.views / 1000000).toFixed(0)}M</span>
                      </div>
                      <p className="text-xs text-[#666]">Views</p>
                    </div>
                  )}
                  {campaign.awardWins && (
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 text-[#f5d742] mb-1">
                        <Award className="w-4 h-4" />
                        <span className="font-bold">{campaign.awardWins}</span>
                      </div>
                      <p className="text-xs text-[#666]">Awards</p>
                    </div>
                  )}
                  {campaign.year && (
                    <div className="text-center">
                      <div className="font-bold text-[#2e3843] mb-1">{campaign.year}</div>
                      <p className="text-xs text-[#666]">Year</p>
                    </div>
                  )}
                </div>
              </div>

              {related.length > 0 && (
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h3 className="font-bold text-[#1a1a1a] mb-4">Related Work</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {related.map(c => (
                      <Link key={c.id} href={`/campaigns/${c.id}`} className="group block">
                        <img src={c.thumbnail} alt="" className="w-full h-28 object-cover rounded-lg mb-2" />
                        <p className="text-sm font-medium text-[#1a1a1a] group-hover:text-[#4fc487] transition-colors line-clamp-1">{c.title}</p>
                        <p className="text-xs text-[#666]">{c.brand}</p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {agency && (
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h3 className="font-bold text-[#1a1a1a] mb-4">Agency</h3>
                  <Link href={`/directory/${agency.id}`} className="flex items-start gap-3 group">
                    <div className="w-12 h-12 bg-[#eef0f3] rounded-lg flex items-center justify-center shrink-0 font-bold text-[#2e3843]">
                      {agency.name[0]}
                    </div>
                    <div>
                      <p className="font-medium text-[#1a1a1a] group-hover:text-[#4fc487] transition-colors">{agency.name}</p>
                      <p className="text-sm text-[#666]">{agency.city}, {agency.country}</p>
                    </div>
                  </Link>
                </div>
              )}
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="font-bold text-[#1a1a1a] mb-4">Credits</h3>
                <dl className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-[#666]">Brand</dt>
                    <dd className="font-medium text-[#1a1a1a]">{campaign.brand}</dd>
                  </div>
                  {agency && (
                    <div className="flex justify-between">
                      <dt className="text-[#666]">Agency</dt>
                      <dd className="font-medium text-[#1a1a1a]">{agency.name}</dd>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <dt className="text-[#666]">Year</dt>
                    <dd className="font-medium text-[#1a1a1a]">{campaign.year}</dd>
                  </div>
                  {campaign.sector && (
                    <div className="flex justify-between">
                      <dt className="text-[#666]">Sector</dt>
                      <dd className="font-medium text-[#1a1a1a]">{campaign.sector}</dd>
                    </div>
                  )}
                  {campaign.country && (
                    <div className="flex justify-between">
                      <dt className="text-[#666]">Country</dt>
                      <dd className="font-medium text-[#1a1a1a] flex items-center gap-1"><Globe className="w-3 h-3" />{campaign.country}</dd>
                    </div>
                  )}
                </dl>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
