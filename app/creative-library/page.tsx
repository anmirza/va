'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { campaigns } from '@/lib/mock-data'
import { useFollow } from '@/lib/follow-context'
import { Search, Filter, Bookmark, BookmarkCheck, Award, Eye } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const MEDIA_TYPES = ['All', 'TV / Digital', 'Print / OOH', 'Digital / Video', 'Mobile / Digital', 'TV', 'OOH / PR']
const SECTORS = ['All', 'Sports', 'Beverages', 'FMCG', 'Technology', 'Retail', 'Automotive', 'Finance', 'Food', 'Entertainment', 'Travel & Tourism', 'Public Service', 'Healthcare']
const COUNTRIES = ['All', 'USA', 'UK', 'France', 'Germany', 'Sweden', 'Spain', 'Australia', 'Brazil']

export default function CreativeLibraryPage() {
  const [query, setQuery] = useState('')
  const [mediaType, setMediaType] = useState('All')
  const [sector, setSector] = useState('All')
  const [country, setCountry] = useState('All')
  const [awardOnly, setAwardOnly] = useState(false)
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

  return (
    <div className="min-h-screen bg-[#eef0f3] flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <div className="bg-[#2e3843] px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-5xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-3">Creative Library</h1>
            <p className="text-white/70 text-lg mb-8">240,000+ ad campaigns & case studies from around the world</p>
            <div className="flex gap-3 max-w-2xl mx-auto">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#666]" />
                <Input
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Search campaigns, brands, agencies..."
                  className="pl-12 h-12 bg-white border-0 text-[#1a1a1a]"
                />
              </div>
              <Button className="h-12 px-6 bg-[#4fc487] hover:bg-[#45b078] text-white shrink-0">
                Search
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {/* Ad of the Day */}
          {adOfTheDay && (
            <div className="mb-10">
              <h2 className="text-xl font-bold text-[#1a1a1a] mb-4">
                <span className="relative inline-block">
                  Ad of the Day
                  <span className="absolute bottom-0 left-0 right-0 h-2 -z-10 bg-[#98F5CC] opacity-60" />
                </span>
              </h2>
              <Link href={`/campaigns/${adOfTheDay.id}`} className="group relative flex flex-col sm:flex-row gap-0 overflow-hidden rounded-xl shadow-sm bg-white">
                <div className="sm:w-1/2 h-56 sm:h-72 overflow-hidden">
                  <img src={adOfTheDay.thumbnail} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="sm:w-1/2 p-6 sm:p-8 flex flex-col justify-center">
                  <span className="inline-block px-3 py-1 bg-[#f5d742]/20 text-[#a87e00] text-xs font-medium rounded-full mb-3 w-fit">Ad of the Day</span>
                  <h3 className="text-2xl font-bold text-[#1a1a1a] mb-2 group-hover:text-[#4fc487] transition-colors">{adOfTheDay.title}</h3>
                  <p className="text-[#666] mb-4">Brand: <span className="font-medium text-[#1a1a1a]">{adOfTheDay.brand}</span> · Agency: <span className="font-medium text-[#1a1a1a]">{adOfTheDay.agency}</span></p>
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

          {/* Filters */}
          <div className="flex flex-wrap gap-3 mb-6">
            <div className="flex items-center gap-2 bg-white rounded-lg px-3 py-2 shadow-sm">
              <Filter className="w-4 h-4 text-[#666]" />
              <select value={mediaType} onChange={e => setMediaType(e.target.value)} className="text-sm bg-transparent focus:outline-none text-[#1a1a1a]">
                {MEDIA_TYPES.map(m => <option key={m}>{m}</option>)}
              </select>
            </div>
            <div className="flex items-center gap-2 bg-white rounded-lg px-3 py-2 shadow-sm">
              <select value={sector} onChange={e => setSector(e.target.value)} className="text-sm bg-transparent focus:outline-none text-[#1a1a1a]">
                {SECTORS.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="flex items-center gap-2 bg-white rounded-lg px-3 py-2 shadow-sm">
              <select value={country} onChange={e => setCountry(e.target.value)} className="text-sm bg-transparent focus:outline-none text-[#1a1a1a]">
                {COUNTRIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <button
              onClick={() => setAwardOnly(!awardOnly)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium shadow-sm border transition-colors ${awardOnly ? 'bg-[#f5d742]/20 border-[#f5d742] text-[#a87e00]' : 'bg-white border-transparent text-[#666] hover:border-[#d8dce2]'}`}
            >
              <Award className="w-4 h-4" /> Award Winners Only
            </button>
            <span className="ml-auto text-sm text-[#666] self-center">{filtered.length} campaigns</span>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map(campaign => {
              const saved = isSavedCampaign(campaign.id)
              return (
                <div key={campaign.id} className="group bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                  <Link href={`/campaigns/${campaign.id}`} className="block relative overflow-hidden aspect-video">
                    <img src={campaign.thumbnail} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    {campaign.awardWins && (
                      <div className="absolute top-2 right-2 bg-[#f5d742]/90 backdrop-blur px-2 py-1 rounded text-xs font-bold text-[#a87e00] flex items-center gap-1">
                        <Award className="w-3 h-3" />{campaign.awardWins}
                      </div>
                    )}
                  </Link>
                  <div className="p-4">
                    <div className="flex flex-wrap gap-1 mb-2">
                      {campaign.format.slice(0, 2).map(f => (
                        <span key={f} className="text-xs px-2 py-0.5 bg-[#eef0f3] text-[#666] rounded-full">{f}</span>
                      ))}
                    </div>
                    <Link href={`/campaigns/${campaign.id}`}>
                      <h3 className="font-bold text-[#1a1a1a] text-sm mb-1 line-clamp-1 group-hover:text-[#4fc487] transition-colors">{campaign.title}</h3>
                    </Link>
                    <p className="text-xs text-[#666] mb-3">{campaign.brand} · {campaign.agency}</p>
                    <div className="flex items-center justify-between">
                      {campaign.views && (
                        <span className="text-xs text-[#666] flex items-center gap-1">
                          <Eye className="w-3 h-3" />{(campaign.views / 1000000).toFixed(0)}M
                        </span>
                      )}
                      <button
                        onClick={() => toggleCampaign(campaign.id)}
                        className={`ml-auto p-1.5 rounded-lg transition-colors ${saved ? 'text-[#4fc487]' : 'text-[#d8dce2] hover:text-[#4fc487]'}`}
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
            <div className="text-center py-20 text-[#666]">
              <p className="text-lg font-medium mb-2">No campaigns found</p>
              <p className="text-sm">Try adjusting your filters</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
