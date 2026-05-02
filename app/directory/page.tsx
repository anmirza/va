'use client'

import { useState, useMemo, Suspense, useEffect } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { CompanyCard } from '@/components/company-card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { companies } from '@/lib/mock-data'
import { Search, Grid3x3, List, ChevronLeft, ChevronRight, X, Lock } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { getClientCompanyByUserIdFS } from '@/lib/admin-firestore'

const SERVICES = ['Advertising', 'Digital', 'Strategy', 'Design', 'Content', 'Media', 'Production', 'Technology']
const SECTORS = ['Technology', 'Sports', 'Luxury', 'Automotive', 'Finance', 'Entertainment', 'Retail', 'Lifestyle']
const CITIES = [...new Set(companies.map(c => c.city))].sort()

function DirectoryContent() {
  const params = useSearchParams()
  const [searchQuery, setSearchQuery] = useState(params.get('q') || '')
  const [selectedServices, setSelectedServices] = useState<string[]>([])
  const [selectedSectors, setSelectedSectors] = useState<string[]>([])
  const [selectedCities, setSelectedCities] = useState<string[]>(
    params.get('city') ? [params.get('city')!] : []
  )
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState('name')
  const [currentPage, setCurrentPage] = useState(1)

  const { user } = useAuth()
  const isClient = user?.accountType === 'client'
  const [clientTokens, setClientTokens] = useState<number | null>(null)

  useEffect(() => {
    if (isClient && user?.id) {
      getClientCompanyByUserIdFS(user.id).then(comp => {
        if (comp) setClientTokens((comp.tokens ?? 0) - (comp.tokensUsed ?? 0))
      })
    }
  }, [isClient, user?.id])

  const isLockedOut = isClient && user?.tier !== 'free' && clientTokens === 0

  // Sync active filter pill from URL competency param
  const competencyParam = params.get('competency')
  const activeFilterLabel = competencyParam
    ? competencyParam.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
    : null

  const itemsPerPage = 30

  const filteredCompanies = useMemo(() => {
    let results = companies

    if (searchQuery) {
      results = results.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (selectedServices.length > 0) {
      results = results.filter(c =>
        selectedServices.some(s => c.services.includes(s))
      )
    }

    if (selectedSectors.length > 0) {
      results = results.filter(c =>
        selectedSectors.some(s => c.sectors.includes(s))
      )
    }

    if (selectedCities.length > 0) {
      results = results.filter(c => selectedCities.includes(c.city))
    }

    if (sortBy === 'name') {
      results = [...results].sort((a, b) => a.name.localeCompare(b.name))
    } else if (sortBy === 'founded') {
      results = [...results].sort((a, b) => a.founded - b.founded)
    } else if (sortBy === 'awards') {
      results = [...results].sort((a, b) => b.awards - a.awards)
    }

    return results
  }, [searchQuery, selectedServices, selectedSectors, selectedCities, sortBy])

  const totalPages = Math.ceil(filteredCompanies.length / itemsPerPage)
  const startIdx = (currentPage - 1) * itemsPerPage
  const paginatedCompanies = filteredCompanies.slice(startIdx, startIdx + itemsPerPage)

  const toggleFilter = (filter: string, setter: (items: string[]) => void, items: string[]) => {
    setter(items.includes(filter) ? items.filter(f => f !== filter) : [...items, filter])
    setCurrentPage(1)
  }

  const activeFilters = selectedServices.length + selectedSectors.length + selectedCities.length

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="px-4 sm:px-6 lg:px-8 py-12 border-b border-border bg-card/50">
          <div className="max-w-7xl mx-auto w-full">
            <div className="flex items-center gap-2 mb-4 text-sm">
              <Link href="/" className="text-muted-foreground hover:text-foreground">Home</Link>
              <span className="text-muted-foreground">/</span>
              <span className="text-foreground font-medium">Directory</span>
            </div>
            <h1 className="text-4xl font-serif font-bold mb-2">Find Your Agencies</h1>
            <p className="text-muted-foreground">Browse {filteredCompanies.length} agencies from around the world</p>

            {/* Active filter pills from URL */}
            {(activeFilterLabel || selectedCities.length > 0) && (
              <div className="flex flex-wrap gap-2 mt-4">
                {activeFilterLabel && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#f5d742] text-[#1a1a1a] text-xs font-semibold rounded-full">
                    {activeFilterLabel}
                  </span>
                )}
                {selectedCities.map(city => (
                  <button
                    key={city}
                    onClick={() => setSelectedCities(selectedCities.filter(c => c !== city))}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#2e3843] text-white text-xs font-semibold rounded-full hover:bg-[#1a1a1a] transition-colors"
                  >
                    {city} <X className="w-3 h-3" />
                  </button>
                ))}
              </div>
            )}
            
            {clientTokens !== null && (
              <div className={`mt-6 px-4 py-3 rounded-xl border flex items-center justify-between ${
                isLockedOut ? 'bg-red-500/10 border-red-500/20' : 'bg-emerald-500/10 border-emerald-500/20'
              }`}>
                <div className="flex items-center gap-3">
                  <Lock className={`w-5 h-5 ${isLockedOut ? 'text-red-500' : 'text-emerald-500'}`} />
                  <div>
                     <p className={`font-semibold ${isLockedOut ? 'text-red-500' : 'text-emerald-400'}`}>
                        {isLockedOut ? 'Credits Exhausted' : `${clientTokens} Credits Remaining`}
                     </p>
                     <p className="text-xs text-white/50">
                        {isLockedOut ? 'You must purchase more credits to view full agency profiles and continue searching.' : 'Unlock full agency profiles, data insights, and reach out directly.'}
                     </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

            {/* Horizontal Filters — below search */}
            <div className="mt-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="relative flex-1 max-w-xl">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search agencies..."
                    value={searchQuery}
                    onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1) }}
                    className="pl-9"
                  />
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2 bg-card border border-border rounded-lg px-3 py-2">
                  <span className="text-xs text-muted-foreground font-medium">City:</span>
                  <select
                    value={selectedCities[0] || ''}
                    onChange={(e) => { setSelectedCities(e.target.value ? [e.target.value] : []); setCurrentPage(1) }}
                    className="text-sm bg-transparent focus:outline-none"
                  >
                    <option value="">All Cities</option>
                    {CITIES.map(city => <option key={city}>{city}</option>)}
                  </select>
                </div>
                <div className="flex items-center gap-2 bg-card border border-border rounded-lg px-3 py-2">
                  <span className="text-xs text-muted-foreground font-medium">Service:</span>
                  <select
                    value={selectedServices[0] || ''}
                    onChange={(e) => { setSelectedServices(e.target.value ? [e.target.value] : []); setCurrentPage(1) }}
                    className="text-sm bg-transparent focus:outline-none"
                  >
                    <option value="">All Services</option>
                    {SERVICES.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div className="flex items-center gap-2 bg-card border border-border rounded-lg px-3 py-2">
                  <span className="text-xs text-muted-foreground font-medium">Sector:</span>
                  <select
                    value={selectedSectors[0] || ''}
                    onChange={(e) => { setSelectedSectors(e.target.value ? [e.target.value] : []); setCurrentPage(1) }}
                    className="text-sm bg-transparent focus:outline-none"
                  >
                    <option value="">All Sectors</option>
                    {SECTORS.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                {activeFilters > 0 && (
                  <button
                    onClick={() => { setSelectedServices([]); setSelectedSectors([]); setSelectedCities([]); setCurrentPage(1) }}
                    className="flex items-center gap-1 text-xs font-medium text-accent hover:underline px-3 py-2"
                  >
                    <X className="w-3 h-3" /> Clear filters ({activeFilters})
                  </button>
                )}
              </div>
            </div>

        <div className="px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-7xl mx-auto w-full">
              <div className="flex items-center justify-between mb-6">
                <div className="text-sm text-muted-foreground">
                  Showing {Math.min(startIdx + 1, filteredCompanies.length)} – {Math.min(startIdx + itemsPerPage, filteredCompanies.length)} of {filteredCompanies.length}
                </div>
                <div className="flex items-center gap-4">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="text-sm border border-border rounded-lg px-3 py-2 bg-background"
                  >
                    <option value="name">Sort by Name</option>
                    <option value="founded">Sort by Founded</option>
                    <option value="awards">Sort by Awards</option>
                  </select>
                  <div className="flex gap-2 border border-border rounded-lg p-1">
                    <button onClick={() => setViewMode('grid')} className={`p-2 rounded transition-colors ${viewMode === 'grid' ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:text-foreground'}`}>
                      <Grid3x3 className="w-4 h-4" />
                    </button>
                    <button onClick={() => setViewMode('list')} className={`p-2 rounded transition-colors ${viewMode === 'list' ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:text-foreground'}`}>
                      <List className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {isLockedOut ? (
                <div className="flex flex-col items-center justify-center py-24 text-center bg-card/20 rounded-2xl border border-border mt-12">
                   <Lock className="w-12 h-12 text-red-500/50 mb-4" />
                   <h3 className="text-xl font-bold text-white mb-2">Agency Directory Locked</h3>
                   <p className="text-muted-foreground max-w-md bg-transparent">
                     Your company has exhausted its Agency Search & Selection credits. To continue discovering and reaching out to agencies, please contact your account manager to replenish your tokens.
                   </p>
                </div>
              ) : paginatedCompanies.length > 0 ? (
                <>
                  {viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                      {paginatedCompanies.map((company) => (
                        <CompanyCard key={company.id} company={company} />
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4 mb-12">
                      {paginatedCompanies.map((company) => (
                        <Link key={company.id} href={`/directory/${company.id}`}>
                          <div className="border border-border rounded-lg p-4 hover:bg-card/80 transition-colors group cursor-pointer">
                            <div className="flex gap-4">
                              <div className="w-16 h-16 rounded bg-muted flex-shrink-0">
                                <img src={company.logo} alt={company.name} className="w-full h-full object-contain p-2" />
                              </div>
                              <div className="flex-1">
                                <h3 className="font-serif font-bold text-lg group-hover:text-accent transition-colors mb-1">{company.name}</h3>
                                <p className="text-sm text-muted-foreground mb-2 line-clamp-1">{company.description}</p>
                                <div className="flex gap-2 text-xs">
                                  <Badge variant="outline">{company.city}</Badge>
                                  <Badge variant="outline">{company.employees} employees</Badge>
                                  <Badge variant="outline">{company.awards} awards</Badge>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}

                  {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2">
                      <button onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="p-2 hover:bg-muted disabled:opacity-50 rounded-lg transition-colors">
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <div className="flex gap-1">
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                          const page = currentPage <= 3 ? i + 1 : currentPage + i - 2
                          return page <= totalPages ? (
                            <button key={page} onClick={() => setCurrentPage(page)} className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${page === currentPage ? 'bg-accent text-accent-foreground' : 'hover:bg-muted'}`}>
                              {page}
                            </button>
                          ) : null
                        })}
                      </div>
                      <button onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="p-2 hover:bg-muted disabled:opacity-50 rounded-lg transition-colors">
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground mb-4">No agencies found matching your filters.</p>
                  <Button variant="outline" onClick={() => { setSearchQuery(''); setSelectedServices([]); setSelectedSectors([]); setSelectedCities([]); setCurrentPage(1) }}>
                    Clear filters
                  </Button>
                </div>
              )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default function DirectoryPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <DirectoryContent />
    </Suspense>
  )
}
