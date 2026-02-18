'use client'

import { useState, useMemo, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { searchConsultants } from '@/lib/mock-data'
import { MapPin, Search, X } from 'lucide-react'
import { Input } from '@/components/ui/input'

const EXPERTISE_LIST = ['All', 'Pitch Strategy', 'Agency Selection', 'Contract Negotiation', 'Brand Consultancy', 'Procurement Advisory']
const REGIONS = ['All', 'Europe', 'North America', 'Asia Pacific', 'Middle East & Africa']

function ConsultantsContent() {
  const params = useSearchParams()
  const [query, setQuery] = useState(params.get('q') || '')
  const [expertise, setExpertise] = useState(
    params.get('expertise')
      ? EXPERTISE_LIST.find(e => e.toLowerCase().replace(/\s+/g, '-') === params.get('expertise')) || 'All'
      : 'All'
  )
  const [region, setRegion] = useState('All')

  const filtered = useMemo(() => searchConsultants.filter(c => {
    const matchQ = !query || c.name.toLowerCase().includes(query.toLowerCase()) || c.firm.toLowerCase().includes(query.toLowerCase()) || c.city.toLowerCase().includes(query.toLowerCase())
    const matchE = expertise === 'All' || c.expertise.some(e => e.toLowerCase().includes(expertise.toLowerCase()))
    return matchQ && matchE
  }), [query, expertise])

  const expertiseParam = params.get('expertise')
  const regionParam = params.get('region')

  return (
    <div className="min-h-screen bg-[#eef0f3] flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="bg-[#2e3843] px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-2 mb-4 text-sm">
              <Link href="/" className="text-white/60 hover:text-white">Home</Link>
              <span className="text-white/40">/</span>
              <span className="text-white font-medium">Pitch Consultants</span>
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">Search Consultants</h1>
            <p className="text-white/70 mb-8">Expert advisors to help you find the perfect agency partner</p>
            <div className="flex-1 max-w-xl relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#666]" />
              <Input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search consultants..." className="pl-12 h-11 bg-white border-0" />
            </div>

            {/* Active filter pills */}
            {(expertiseParam || regionParam) && (
              <div className="flex flex-wrap gap-2 mt-4">
                {expertiseParam && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#f5d742] text-[#1a1a1a] text-xs font-semibold rounded-full">
                    {expertiseParam.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </span>
                )}
                {regionParam && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 text-white text-xs font-semibold rounded-full">
                    {regionParam.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {/* Expertise tabs */}
          <div className="flex flex-wrap gap-2 mb-8">
            {EXPERTISE_LIST.map(e => (
              <button
                key={e}
                onClick={() => setExpertise(e)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${expertise === e ? 'bg-[#2e3843] text-white' : 'bg-white text-[#666] hover:bg-[#d8dce2]'}`}
              >
                {e}
              </button>
            ))}
          </div>

          <p className="text-sm text-[#666] mb-6">{filtered.length} consultants found</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {filtered.map(consultant => (
              <Link key={consultant.id} href={`/consultants/${consultant.id}`} className="group bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow flex gap-5">
                <img src={consultant.photo} alt={consultant.name} className="w-20 h-20 rounded-xl object-cover shrink-0" />
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-[#1a1a1a] group-hover:text-[#4fc487] transition-colors">{consultant.name}</h3>
                  <p className="text-sm text-[#4fc487] mb-1">{consultant.firm}</p>
                  <div className="flex items-center gap-1 text-sm text-[#666] mb-3">
                    <MapPin className="w-3.5 h-3.5" />{consultant.city}, {consultant.country}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {consultant.expertise.slice(0, 2).map(ex => (
                      <span key={ex} className="px-2 py-0.5 bg-[#eef0f3] text-xs text-[#666] rounded-full">{ex}</span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20 text-[#666]">
              <p className="text-lg font-medium mb-2">No consultants found.</p>
              <button onClick={() => { setQuery(''); setExpertise('All') }} className="text-sm text-[#4fc487] hover:underline">Clear filters</button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default function ConsultantsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <ConsultantsContent />
    </Suspense>
  )
}
