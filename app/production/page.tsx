'use client'

import { useState, useMemo, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { productionCompanies } from '@/lib/mock-data'
import { Search, MapPin, Users, X } from 'lucide-react'
import { Input } from '@/components/ui/input'

const SPECIALTIES = ['All', 'Live Action', 'Animation', 'VFX', 'Music Videos', 'Commercials', 'Film', 'Post Production']

function ProductionContent() {
  const params = useSearchParams()
  const [query, setQuery] = useState(params.get('q') || '')
  const [specialty, setSpecialty] = useState(
    params.get('specialty')
      ? SPECIALTIES.find(s => s.toLowerCase().replace(/\s+/g, '-') === params.get('specialty')) || 'All'
      : 'All'
  )
  const [cityFilter, setCityFilter] = useState(params.get('city') || '')

  const filtered = useMemo(() => productionCompanies.filter(p => {
    const matchQ = !query || p.name.toLowerCase().includes(query.toLowerCase()) || p.city.toLowerCase().includes(query.toLowerCase())
    const matchS = specialty === 'All' || p.specialties.includes(specialty)
    const matchC = !cityFilter || p.city.toLowerCase().includes(cityFilter.toLowerCase())
    return matchQ && matchS && matchC
  }), [query, specialty, cityFilter])

  const activeCityParam = params.get('city')

  return (
    <div className="min-h-screen bg-[#eef0f3] flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="bg-[#2e3843] px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-2 mb-4 text-sm">
              <Link href="/" className="text-white/60 hover:text-white">Home</Link>
              <span className="text-white/40">/</span>
              <span className="text-white font-medium">Production Companies</span>
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">Production Companies</h1>
            <p className="text-white/70 mb-8">Discover world-class production companies for your next project</p>
            <div className="flex gap-3 max-w-xl">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#666]" />
                <Input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search production companies..." className="pl-12 h-11 bg-white border-0" />
              </div>
            </div>

            {/* Active filter pills */}
            {(activeCityParam || specialty !== 'All') && (
              <div className="flex flex-wrap gap-2 mt-4">
                {activeCityParam && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#f5d742] text-[#1a1a1a] text-xs font-semibold rounded-full">
                    <MapPin className="w-3 h-3" /> {activeCityParam}
                  </span>
                )}
                {specialty !== 'All' && (
                  <button
                    onClick={() => setSpecialty('All')}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 text-white text-xs font-semibold rounded-full hover:bg-white/30 transition-colors"
                  >
                    {specialty} <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-wrap gap-2 mb-8">
            {SPECIALTIES.map(s => (
              <button
                key={s}
                onClick={() => setSpecialty(s)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${specialty === s ? 'bg-[#2e3843] text-white' : 'bg-white text-[#666] hover:bg-[#d8dce2]'}`}
              >
                {s}
              </button>
            ))}
          </div>

          <p className="text-sm text-[#666] mb-6">{filtered.length} companies found</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(company => (
              <Link key={company.id} href={`/production/${company.id}`} className="group bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                <div className="h-36 overflow-hidden relative">
                  <img src={company.coverImage} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur px-2 py-1 rounded text-xs font-bold text-[#1a1a1a]">
                    {company.name}
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-[#1a1a1a] mb-3 group-hover:text-[#4fc487] transition-colors">{company.name}</h3>
                  <div className="space-y-1.5 text-sm text-[#666] mb-3">
                    <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-[#4fc487]" />{company.city}, {company.country}</div>
                    <div className="flex items-center gap-2"><Users className="w-4 h-4 text-[#4fc487]" />{company.employees} team members</div>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {company.specialties.slice(0, 3).map(s => (
                      <span key={s} className="px-2 py-1 bg-[#eef0f3] text-xs text-[#666] rounded-full">{s}</span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20 text-[#666]">
              <p className="text-lg font-medium mb-2">No production companies found.</p>
              <button onClick={() => { setQuery(''); setSpecialty('All') }} className="text-sm text-[#4fc487] hover:underline">Clear filters</button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default function ProductionPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <ProductionContent />
    </Suspense>
  )
}
