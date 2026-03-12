'use client'

import { useState, useMemo, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { campaigns } from '@/lib/mock-data'
import { useFollow } from '@/lib/follow-context'
import { Search, Filter, Bookmark, BookmarkCheck, Award, Eye, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const MEDIA_TYPES = ['All', 'TV / Digital', 'Print / OOH', 'Digital / Video', 'Mobile / Digital', 'TV', 'OOH / PR']
const SECTORS = ['All', 'Sports', 'Beverages', 'FMCG', 'Technology', 'Retail', 'Automotive', 'Finance', 'Food', 'Entertainment', 'Travel & Tourism', 'Public Service', 'Healthcare']
const COUNTRIES = ['All', 'USA', 'UK', 'France', 'Germany', 'Sweden', 'Spain', 'Australia', 'Brazil']

function CreativeLibraryContent() {
  const params = useSearchParams()
  const [query, setQuery] = useState(params.get('q') || '')
  const [mediaType, setMediaType] = useState(() => {
    const fmt = params.get('format')
    if (!fmt) return 'All'
    if (fmt === 'tv') return 'TV'
    if (fmt === 'online-video') return 'Digital / Video'
    if (fmt === 'print') return 'Print / OOH'
    if (fmt === 'social') return 'Mobile / Digital'
    return 'All'
  })
  const [sector, setSector] = useState(() => {
    const s = params.get('sector')
    if (!s) return 'All'
    return SECTORS.find(sec => sec.toLowerCase().replace(/[\s&/]+/g, '-') === s) || 'All'
  })
  const [country, setCountry] = useState('All')
  const [awardOnly, setAwardOnly] = useState(params.get('sort') === 'awarded')
  const { isSavedCampaign, toggleCampaign } = useFollow()

  const adOfTheDay = campaigns.find(c => c.awardWins && c.awardWins > 20)

  const filtered = useMemo(() => {
    return campaigns.filter(c => {
      const matchQ = !query || c.title.toLowerCase().includes(query.toLowerCase()) || c.brand.toLowerCase().includes(query.toLowerCase()) || c.agency.toLowerCase().includes(query.toLowerCase())
      const matchMedia = mediaType === 'All' || c.mediaType === mediaType
      const matchSector = sector === 'All' || c.sector === sector
      const matchCountry = country === 'All' || c.country === country
      const matchAward = !awardOnly || (c.awardWins && c.awardWins > 0)
      return matchQ && matchMedia && matchSector && matchCountry && matchAward
    })
  }, [query, mediaType, sector, country, awardOnly])

  const formatParam = params.get('format')
  const sectorParam = params.get('sector')

  return (
    <div className="min-h-screen bg-[#02030E] flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="bg-[#02030E] px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-5xl mx-auto text-center">
            <div className="flex items-center gap-2 mb-4 text-sm justify-start">
              <Link href="/" className="text-white/60 hover:text-white">Home</Link>
              <span className="text-white/40">/</span>
              <span className="text-white font-medium">Creative Library</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-3">Creative Library</h1>
            <p className="text-white/70 text-lg mb-8">Ad campaigns &amp; case studies from around the world</p>
            <div className="flex gap-3 max-w-2xl mx-auto">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <Input
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Search campaigns, brands, agencies..."
                  className="pl-12 h-12 bg-white/[0.08] border border-white/[0.12] text-white placeholder:text-white/40 focus:border-[#0763d8]"
                />
              </div>
              <Button className="h-12 px-6 bg-[#0763d8] hover:bg-[#0655b3] text-white shrink-0">
                Search
              </Button>
            </div>

            {/* Active filter pills */}
            {(formatParam || sectorParam || awardOnly) && (
              <div className="flex flex-wrap gap-2 mt-4 justify-center">
                {formatParam && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#f5d742] text-[#1a1a1a] text-xs font-semibold rounded-full">
                    {formatParam.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </span>
                )}
                {sectorParam && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 text-white text-xs font-semibold rounded-full">
                    {sectorParam.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </span>
                )}
                {awardOnly && (
                  <button
                    onClick={() => setAwardOnly(false)}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#f5d742]/30 text-[#f5d742] text-xs font-semibold rounded-full hover:bg-[#f5d742]/50 transition-colors"
                  >
                    Award Winners <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {adOfTheDay && (
            <div className="mb-10">
              <h2 className="text-xl font-bold text-white mb-4">
                <span className="relative inline-block">
                  Ad of the Day
                  <span className="absolute bottom-0 left-0 right-0 h-2 -z-10 bg-[#98F5CC] opacity-60" />
                </span>
              </h2>
              <Link href={`/campaigns/${adOfTheDay.id}`} className="group relative flex flex-col sm:flex-row gap-0 overflow-hidden rounded-xl border border-white/[0.08] bg-white/[0.04] hover:border-[#0763d8]/30 transition-colors">
                <div className="sm:w-1/2 h-56 sm:h-72 overflow-hidden">
                  <img src={adOfTheDay.thumbnail} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="sm:w-1/2 p-6 sm:p-8 flex flex-col justify-center">
                  <span className="inline-block px-3 py-1 bg-[#f5d742]/20 text-[#f5d742] text-xs font-medium rounded-full mb-3 w-fit">Ad of the Day</span>
                  <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-[#0763d8] transition-colors">{adOfTheDay.title}</h3>
                  <p className="text-white/60 mb-4">Brand: <span className="font-medium text-white/90">{adOfTheDay.brand}</span> · Agency: <span className="font-medium text-white/90">{adOfTheDay.agency}</span></p>
                  {adOfTheDay.awardWins && (
                    <div className="flex items-center gap-1.5 text-[#f5d742]">
                      <Award className="w-4 h-4" />
                      <span className="text-sm font-medium">{adOfTheDay.awardWins} Awards</span>
                    </div>
                  )}
                </div>
              </Link>
            </div>
          )}

          <div className="flex flex-wrap gap-3 mb-6">
            <div className="flex items-center gap-2 bg-white/[0.06] border border-white/[0.08] rounded-lg px-3 py-2">
              <Filter className="w-4 h-4 text-white/50" />
              <select value={mediaType} onChange={e => setMediaType(e.target.value)} className="text-sm bg-transparent focus:outline-none text-white">
                {MEDIA_TYPES.map(m => <option key={m} className="bg-[#0c0e1a] text-white">{m}</option>)}
              </select>
            </div>
            <div className="flex items-center gap-2 bg-white/[0.06] border border-white/[0.08] rounded-lg px-3 py-2">
              <select value={sector} onChange={e => setSector(e.target.value)} className="text-sm bg-transparent focus:outline-none text-white">
                {SECTORS.map(s => <option key={s} className="bg-[#0c0e1a] text-white">{s}</option>)}
              </select>
            </div>
            <div className="flex items-center gap-2 bg-white/[0.06] border border-white/[0.08] rounded-lg px-3 py-2">
              <select value={country} onChange={e => setCountry(e.target.value)} className="text-sm bg-transparent focus:outline-none text-white">
                {COUNTRIES.map(c => <option key={c} className="bg-[#0c0e1a] text-white">{c}</option>)}
              </select>
            </div>
            <button
              onClick={() => setAwardOnly(!awardOnly)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${awardOnly ? 'bg-[#f5d742]/20 border-[#f5d742]/50 text-[#f5d742]' : 'bg-white/[0.06] border-white/[0.08] text-white/70 hover:border-white/20'}`}
            >
              <Award className="w-4 h-4" /> Award Winners Only
            </button>
            <span className="ml-auto text-sm text-white/50 self-center">{filtered.length} campaigns</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map(campaign => {
              const saved = isSavedCampaign(campaign.id)
              return (
                <div key={campaign.id} className="group bg-white/[0.04] border border-white/[0.06] rounded-xl overflow-hidden hover:border-[#0763d8]/30 hover:shadow-lg hover:shadow-[#0763d8]/5 transition-all">
                  <Link href={`/campaigns/${campaign.id}`} className="block relative overflow-hidden aspect-video">
                    <img src={campaign.thumbnail} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    {campaign.awardWins && (
                      <div className="absolute top-2 right-2 bg-[#f5d742]/90 backdrop-blur px-2 py-1 rounded text-xs font-bold text-[#1a1a1a] flex items-center gap-1">
                        <Award className="w-3 h-3" />{campaign.awardWins}
                      </div>
                    )}
                  </Link>
                  <div className="p-4">
                    <div className="flex flex-wrap gap-1 mb-2">
                      {campaign.format.slice(0, 2).map(f => (
                        <span key={f} className="text-xs px-2 py-0.5 bg-white/[0.08] text-white/60 rounded-full">{f}</span>
                      ))}
                    </div>
                    <Link href={`/campaigns/${campaign.id}`}>
                      <h3 className="font-bold text-white text-sm mb-1 line-clamp-1 group-hover:text-[#0763d8] transition-colors">{campaign.title}</h3>
                    </Link>
                    <p className="text-xs text-white/50 mb-3">{campaign.brand} · {campaign.agency}</p>
                    <div className="flex items-center justify-between">
                      {campaign.views && (
                        <span className="text-xs text-white/40 flex items-center gap-1">
                          <Eye className="w-3 h-3" />{(campaign.views / 1000000).toFixed(0)}M
                        </span>
                      )}
                      <button
                        onClick={() => toggleCampaign(campaign.id)}
                        className={`ml-auto p-1.5 rounded-lg transition-colors ${saved ? 'text-[#0763d8]' : 'text-white/40 hover:text-[#0763d8]'}`}
                      >
                        {saved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20 text-white/50">
              <p className="text-lg font-medium mb-2 text-white/80">No campaigns found</p>
              <p className="text-sm">Try adjusting your filters</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default function CreativeLibraryPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <CreativeLibraryContent />
    </Suspense>
  )
}
