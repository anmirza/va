'use client'

import { useState, useMemo, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { academicInstitutions } from '@/lib/mock-data'
import { Search, MapPin, BookOpen, X } from 'lucide-react'
import { Input } from '@/components/ui/input'

const TYPES = ['All', 'Ad School', 'University', 'Online Course', 'Workshop']
const COUNTRIES = ['All', ...new Set(academicInstitutions.map(a => a.country))].sort()

function AcademicContent() {
  const params = useSearchParams()
  const typeParam = params.get('type') || ''
  const countryParam = params.get('country') || ''
  const [query, setQuery] = useState(params.get('q') || '')
  const [selectedType, setSelectedType] = useState(
    typeParam ? (TYPES.includes(typeParam) ? typeParam : 'All') : 'All'
  )
  const [selectedCountry, setSelectedCountry] = useState(countryParam || 'All')

  const filtered = useMemo(() => academicInstitutions.filter(a => {
    const matchQ = !query || a.name.toLowerCase().includes(query.toLowerCase()) || a.city.toLowerCase().includes(query.toLowerCase()) || a.description.toLowerCase().includes(query.toLowerCase())
    const matchT = selectedType === 'All' || a.type === selectedType
    const matchC = selectedCountry === 'All' || a.country.toLowerCase() === selectedCountry.toLowerCase()
    return matchQ && matchT && matchC
  }), [query, selectedType, selectedCountry])

  return (
    <div className="min-h-screen bg-[#eef0f3] flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="bg-[#2e3843] px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-2 mb-4 text-sm">
              <Link href="/" className="text-white/60 hover:text-white">Home</Link>
              <span className="text-white/40">/</span>
              <span className="text-white font-medium">Academic</span>
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">Academic &amp; Education</h1>
            <p className="text-white/70 mb-8">Schools, universities, courses and workshops for creative professionals</p>
            <div className="flex-1 max-w-xl relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#666]" />
              <Input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search schools and programmes..." className="pl-12 h-11 bg-white border-0" />
            </div>

            {/* Active filter pills */}
            {(typeParam || (countryParam && countryParam !== 'All')) && (
              <div className="flex flex-wrap gap-2 mt-4">
                {typeParam && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#f5d742] text-[#1a1a1a] text-xs font-semibold rounded-full">
                    <BookOpen className="w-3 h-3" /> {typeParam}
                  </span>
                )}
                {countryParam && countryParam !== 'All' && (
                  <button
                    onClick={() => setSelectedCountry('All')}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 text-white text-xs font-semibold rounded-full hover:bg-white/30 transition-colors"
                  >
                    <MapPin className="w-3 h-3" /> {countryParam} <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {/* Type filter */}
          <div className="flex flex-wrap gap-2 mb-6">
            {TYPES.map(type => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedType === type ? 'bg-[#2e3843] text-white' : 'bg-white text-[#666] hover:bg-[#d8dce2]'}`}
              >
                {type}
              </button>
            ))}
          </div>

          {/* Country filter */}
          <div className="flex items-center gap-3 mb-8">
            <label className="text-sm font-medium text-[#666]">Country:</label>
            <select
              value={selectedCountry}
              onChange={e => setSelectedCountry(e.target.value)}
              className="text-sm border border-[#d8dce2] rounded-lg px-3 py-2 bg-white text-[#1a1a1a] focus:outline-none focus:ring-2 focus:ring-[#4fc487]"
            >
              {COUNTRIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>

          <p className="text-sm text-[#666] mb-6">{filtered.length} institutions found</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(institution => (
              <Link
                key={institution.id}
                href={`/academic/${institution.id}`}
                className="group bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="h-40 overflow-hidden relative">
                  <img
                    src={institution.coverImage}
                    alt=""
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <span className="absolute top-3 left-3 px-2 py-1 bg-[#f5d742] text-[#1a1a1a] text-xs font-bold rounded-full">
                    {institution.type}
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-[#1a1a1a] mb-2 group-hover:text-[#4fc487] transition-colors">{institution.name}</h3>
                  <div className="flex items-center gap-1.5 text-sm text-[#666] mb-3">
                    <MapPin className="w-4 h-4 text-[#4fc487] shrink-0" />
                    {institution.city}, {institution.country}
                  </div>
                  <p className="text-sm text-[#666] line-clamp-2 mb-3">{institution.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {institution.programs.slice(0, 3).map(p => (
                      <span key={p} className="px-2 py-0.5 bg-[#eef0f3] text-xs text-[#666] rounded-full">{p}</span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20 text-[#666]">
              <BookOpen className="w-12 h-12 text-[#d8dce2] mx-auto mb-4" />
              <p className="text-lg font-medium mb-2">No institutions found.</p>
              <button onClick={() => { setQuery(''); setSelectedType('All'); setSelectedCountry('All') }} className="text-sm text-[#4fc487] hover:underline">Clear filters</button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default function AcademicPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <AcademicContent />
    </Suspense>
  )
}
