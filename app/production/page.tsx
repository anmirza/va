'use client'

import { useState, useMemo, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { productionCompanies } from '@/lib/mock-data'
import {
  getRegionForCountry,
  getAvailableRegionsFromCompanies,
} from '@/lib/geo-data'
import { Search, MapPin, Users, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { MultiSelectFilter } from '@/components/multi-select-filter'

const SPECIALTIES = ['Live Action', 'Animation', 'VFX', 'Music Videos', 'Commercials', 'Film', 'Post Production']

// Derived at module level from mock data
const ALL_PROD_COUNTRIES = productionCompanies.map((p) => p.country).filter(Boolean) as string[]
const ALL_PROD_REGIONS = getAvailableRegionsFromCompanies(ALL_PROD_COUNTRIES)

function ProductionContent() {
  const params = useSearchParams()
  const [query, setQuery] = useState(params.get('q') || '')
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>(
    params.get('specialty')
      ? SPECIALTIES.filter(s => s.toLowerCase().replace(/\s+/g, '-') === params.get('specialty'))
      : []
  )
  const [selectedRegion, setSelectedRegion] = useState(params.get('region') || '')
  const [selectedCountry, setSelectedCountry] = useState(params.get('country') || '')
  const [selectedCities, setSelectedCities] = useState<string[]>(
    params.get('city') ? [params.get('city') as string] : []
  )

  // Countries filtered by region
  const availableCountries = useMemo(() => {
    const base = selectedRegion
      ? productionCompanies
          .filter((p) => p.country && getRegionForCountry(p.country) === selectedRegion)
          .map((p) => p.country as string)
      : ALL_PROD_COUNTRIES
    return [...new Set(base)].sort()
  }, [selectedRegion])

  // Cities filtered by country or region
  const availableCities = useMemo(() => {
    if (selectedCountry) {
      return [...new Set(productionCompanies.filter((p) => p.country === selectedCountry).map((p) => p.city))].sort()
    }
    if (selectedRegion) {
      return [...new Set(
        productionCompanies
          .filter((p) => p.country && getRegionForCountry(p.country) === selectedRegion)
          .map((p) => p.city)
      )].sort()
    }
    return [...new Set(productionCompanies.map((p) => p.city))].sort()
  }, [selectedRegion, selectedCountry])

  const filtered = useMemo(() => productionCompanies.filter(p => {
    const matchQ = !query || p.name.toLowerCase().includes(query.toLowerCase()) || p.city.toLowerCase().includes(query.toLowerCase())
    const matchS = selectedSpecialties.length === 0 || selectedSpecialties.some((s) => p.specialties.includes(s))
    const matchCity = selectedCities.length === 0 || selectedCities.includes(p.city)
    const matchCountry = !selectedCountry || p.country === selectedCountry
    const matchRegion = !selectedRegion || (p.country ? getRegionForCountry(p.country) === selectedRegion : false)
    // City takes priority, then country, then region
    const locationMatch = selectedCities.length > 0 ? matchCity : (selectedCountry ? matchCountry : (selectedRegion ? matchRegion : true))
    return matchQ && matchS && locationMatch
  }), [query, selectedSpecialties, selectedRegion, selectedCountry, selectedCities])

  const activeFilters =
    (selectedRegion ? 1 : 0) +
    (selectedCountry ? 1 : 0) +
    selectedCities.length +
    selectedSpecialties.length

  const clearAllFilters = () => {
    setSelectedRegion('')
    setSelectedCountry('')
    setSelectedCities([])
    setSelectedSpecialties([])
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Header section — mirrors Find Your Agency page */}
        <section className="px-4 sm:px-6 lg:px-8 py-12 border-b border-border bg-card/50">
          <div className="max-w-7xl mx-auto w-full">
            <div className="flex items-center gap-2 mb-4 text-sm">
              <Link href="/" className="text-muted-foreground hover:text-foreground">Home</Link>
              <span className="text-muted-foreground">/</span>
              <span className="text-foreground font-medium">Find Your Production Company</span>
            </div>
            <div className="flex flex-col justify-center items-center gap-2">
              <h1 className="text-4xl font-serif font-bold mb-2">Find Your Production Company</h1>
              <p className="text-muted-foreground">Discover world-class production companies for your next project</p>

              {/* Active filter pills — mirrors agency page */}
              {(selectedRegion || selectedCountry || selectedCities.length > 0 || selectedSpecialties.length > 0) && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {selectedRegion && (
                    <button onClick={() => { setSelectedRegion(''); setSelectedCountry(''); setSelectedCities([]) }}
                      className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#2e3843] text-white text-xs font-semibold rounded-full hover:bg-[#1a1a1a] transition-colors">
                      {selectedRegion} <X className="w-3 h-3" />
                    </button>
                  )}
                  {selectedCountry && (
                    <button onClick={() => { setSelectedCountry(''); setSelectedCities([]) }}
                      className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#2e3843] text-white text-xs font-semibold rounded-full hover:bg-[#1a1a1a] transition-colors">
                      {selectedCountry} <X className="w-3 h-3" />
                    </button>
                  )}
                  {selectedCities.map((city) => (
                    <button key={city} onClick={() => setSelectedCities((prev) => prev.filter((c) => c !== city))}
                      className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#2e3843] text-white text-xs font-semibold rounded-full hover:bg-[#1a1a1a] transition-colors">
                      <MapPin className="w-3 h-3" /> {city} <X className="w-3 h-3" />
                    </button>
                  ))}
                  {selectedSpecialties.map((s) => (
                    <button key={s} onClick={() => setSelectedSpecialties((prev) => prev.filter((x) => x !== s))}
                      className="inline-flex items-center gap-1.5 px-3 py-1 bg-card border border-[#0763d8]/30 text-foreground text-xs font-semibold rounded-full hover:bg-muted transition-colors">
                      {s} <X className="w-3 h-3" />
                    </button>
                  ))}
                </div>
              )}

              {/* Search + cascading location filters */}
              <div className="mt-8 w-full max-w-5xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="relative flex-1 max-w-xl">
                    <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input value={query} onChange={e => setQuery(e.target.value)}
                      placeholder="Search production companies..." className="pl-9" />
                  </div>
                </div>
                <div className="flex flex-wrap gap-3">
                  {/* Region — level 1, always visible */}
                  <div className="flex items-center gap-2 bg-card border border-border rounded-lg px-3 py-2">
                    <span className="text-xs text-muted-foreground font-medium">Region:</span>
                    <select value={selectedRegion}
                      onChange={(e) => { setSelectedRegion(e.target.value); setSelectedCountry(''); setSelectedCities([]) }}
                      className="text-sm bg-transparent focus:outline-none">
                      <option value="">All Regions</option>
                      {ALL_PROD_REGIONS.map((r) => <option key={r}>{r}</option>)}
                    </select>
                  </div>

                  {/* Country — level 2, only shown once a Region is picked */}
                  {selectedRegion && (
                    <div className="flex items-center gap-2 bg-card border border-border rounded-lg px-3 py-2">
                      <span className="text-xs text-muted-foreground font-medium">Country:</span>
                      <select value={selectedCountry}
                        onChange={(e) => { setSelectedCountry(e.target.value); setSelectedCities([]) }}
                        className="text-sm bg-transparent focus:outline-none">
                        <option value="">All Countries</option>
                        {availableCountries.map((c) => <option key={c}>{c}</option>)}
                      </select>
                    </div>
                  )}

                  {/* City — level 3, only shown once a Country is picked (prevents endless city list) */}
                  {selectedCountry && (
                    <MultiSelectFilter
                      label="City"
                      options={availableCities}
                      selected={selectedCities}
                      onChange={(v) => setSelectedCities(v)}
                      placeholder="All Cities"
                    />
                  )}

                  {/* Specialty — always visible, multi-select, mirrors Service/Industry in agency page */}
                  <MultiSelectFilter
                    label="Specialty"
                    options={SPECIALTIES}
                    selected={selectedSpecialties}
                    onChange={(v) => setSelectedSpecialties(v)}
                    placeholder="All Specialties"
                  />

                  {activeFilters > 0 && (
                    <button onClick={clearAllFilters}
                      className="flex items-center gap-1 text-xs font-medium text-accent hover:underline px-3 py-2">
                      <X className="w-3 h-3" /> Clear filters ({activeFilters})
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Results */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <p className="text-sm text-muted-foreground mb-6">{filtered.length} companies found</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(company => (
              <Link key={company.id} href={`/production/${company.id}`} className="group bg-card rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                <div className="h-36 overflow-hidden relative">
                  <img src={company.coverImage} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-3 left-3 bg-card/90 backdrop-blur px-2 py-1 rounded text-xs font-bold text-foreground">
                    {company.name}
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-foreground mb-3 group-hover:text-[#0763d8] transition-colors">{company.name}</h3>
                  <div className="space-y-1.5 text-sm text-muted-foreground mb-3">
                    <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-[#0763d8]" />{company.city}, {company.country}</div>
                    <div className="flex items-center gap-2"><Users className="w-4 h-4 text-[#0763d8]" />{company.employees} team members</div>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {company.specialties.slice(0, 3).map(s => (
                      <span key={s} className="px-2 py-1 bg-background text-xs text-muted-foreground rounded-full">{s}</span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20 text-muted-foreground">
              <p className="text-lg font-medium mb-2">No production companies found.</p>
              <button onClick={clearAllFilters} className="text-sm text-[#0763d8] hover:underline">Clear filters</button>
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
