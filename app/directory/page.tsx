'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { CompanyCard } from '@/components/company-card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { companies } from '@/lib/mock-data'
import { Search, Grid3x3, List, ChevronLeft, ChevronRight, X } from 'lucide-react'

const SERVICES = ['Advertising', 'Digital', 'Strategy', 'Design', 'Content', 'Media', 'Production', 'Technology']
const SECTORS = ['Technology', 'Sports', 'Luxury', 'Automotive', 'Finance', 'Entertainment', 'Retail', 'Lifestyle']
const CITIES = [...new Set(companies.map(c => c.city))].sort()
const COMPANY_TYPES = ['Large (500+)', 'Medium (100-500)', 'Small (10-100)', 'Solo']

export default function DirectoryPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedServices, setSelectedServices] = useState<string[]>([])
  const [selectedSectors, setSelectedSectors] = useState<string[]>([])
  const [selectedCities, setSelectedCities] = useState<string[]>([])
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState('name')
  const [currentPage, setCurrentPage] = useState(1)

  const itemsPerPage = 30

  // Filter companies
  const filteredCompanies = useMemo(() => {
    let results = companies

    // Search
    if (searchQuery) {
      results = results.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Services filter
    if (selectedServices.length > 0) {
      results = results.filter(c =>
        selectedServices.some(s => c.services.includes(s))
      )
    }

    // Sectors filter
    if (selectedSectors.length > 0) {
      results = results.filter(c =>
        selectedSectors.some(s => c.sectors.includes(s))
      )
    }

    // Cities filter
    if (selectedCities.length > 0) {
      results = results.filter(c =>
        selectedCities.includes(c.city)
      )
    }

    // Sort
    if (sortBy === 'name') {
      results.sort((a, b) => a.name.localeCompare(b.name))
    } else if (sortBy === 'founded') {
      results.sort((a, b) => a.founded - b.founded)
    } else if (sortBy === 'awards') {
      results.sort((a, b) => b.awards - a.awards)
    }

    return results
  }, [searchQuery, selectedServices, selectedSectors, selectedCities, sortBy])

  // Pagination
  const totalPages = Math.ceil(filteredCompanies.length / itemsPerPage)
  const startIdx = (currentPage - 1) * itemsPerPage
  const paginatedCompanies = filteredCompanies.slice(startIdx, startIdx + itemsPerPage)

  const toggleFilter = (filter: string, setter: (items: string[]) => void, items: string[]) => {
    if (items.includes(filter)) {
      setter(items.filter(f => f !== filter))
    } else {
      setter([...items, filter])
    }
  }

  const activeFilters = selectedServices.length + selectedSectors.length + selectedCities.length

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Page Header */}
        <section className="px-4 sm:px-6 lg:px-8 py-12 border-b border-border bg-card/50">
          <div className="max-w-7xl mx-auto w-full">
            <div className="flex items-center gap-2 mb-4 text-sm">
              <Link href="/" className="text-muted-foreground hover:text-foreground">Home</Link>
              <span className="text-muted-foreground">/</span>
              <span className="text-foreground font-medium">Directory</span>
            </div>
            <h1 className="text-4xl font-serif font-bold mb-2">Agency Directory</h1>
            <p className="text-muted-foreground">Browse {filteredCompanies.length} agencies from around the world</p>
          </div>
        </section>

        <div className="px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-7xl mx-auto w-full flex gap-8">
            {/* Sidebar Filters */}
            <aside className="w-64 flex-shrink-0">
              {/* Search */}
              <div className="mb-8">
                <h3 className="font-serif font-bold mb-3 text-sm uppercase tracking-wide">Search</h3>
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search agencies..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value)
                      setCurrentPage(1)
                    }}
                    className="pl-9"
                  />
                </div>
              </div>

              {/* Active Filters */}
              {activeFilters > 0 && (
                <div className="mb-8">
                  <button
                    onClick={() => {
                      setSelectedServices([])
                      setSelectedSectors([])
                      setSelectedCities([])
                      setCurrentPage(1)
                    }}
                    className="text-xs font-medium text-accent hover:underline"
                  >
                    Clear all filters ({activeFilters})
                  </button>
                </div>
              )}

              {/* Cities Filter */}
              <div className="mb-8">
                <h3 className="font-serif font-bold mb-3 text-sm uppercase tracking-wide">Cities</h3>
                <div className="space-y-2">
                  {CITIES.map((city) => (
                    <label key={city} className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={selectedCities.includes(city)}
                        onChange={() => {
                          toggleFilter(city, setSelectedCities, selectedCities)
                          setCurrentPage(1)
                        }}
                        className="w-4 h-4 rounded border-border"
                      />
                      <span className="text-sm text-muted-foreground group-hover:text-foreground">{city}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Services Filter */}
              <div className="mb-8">
                <h3 className="font-serif font-bold mb-3 text-sm uppercase tracking-wide">Services</h3>
                <div className="space-y-2">
                  {SERVICES.map((service) => (
                    <label key={service} className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={selectedServices.includes(service)}
                        onChange={() => {
                          toggleFilter(service, setSelectedServices, selectedServices)
                          setCurrentPage(1)
                        }}
                        className="w-4 h-4 rounded border-border"
                      />
                      <span className="text-sm text-muted-foreground group-hover:text-foreground">{service}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Sectors Filter */}
              <div className="mb-8">
                <h3 className="font-serif font-bold mb-3 text-sm uppercase tracking-wide">Sectors</h3>
                <div className="space-y-2">
                  {SECTORS.map((sector) => (
                    <label key={sector} className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={selectedSectors.includes(sector)}
                        onChange={() => {
                          toggleFilter(sector, setSelectedSectors, selectedSectors)
                          setCurrentPage(1)
                        }}
                        className="w-4 h-4 rounded border-border"
                      />
                      <span className="text-sm text-muted-foreground group-hover:text-foreground">{sector}</span>
                    </label>
                  ))}
                </div>
              </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 min-w-0">
              {/* Controls */}
              <div className="flex items-center justify-between mb-6">
                <div className="text-sm text-muted-foreground">
                  Showing {startIdx + 1} – {Math.min(startIdx + itemsPerPage, filteredCompanies.length)} of {filteredCompanies.length}
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
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded transition-colors ${
                        viewMode === 'grid'
                          ? 'bg-accent text-accent-foreground'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <Grid3x3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded transition-colors ${
                        viewMode === 'list'
                          ? 'bg-accent text-accent-foreground'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Results */}
              {paginatedCompanies.length > 0 ? (
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

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="p-2 hover:bg-muted disabled:opacity-50 rounded-lg transition-colors"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <div className="flex gap-1">
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                          const page = currentPage <= 3 ? i + 1 : currentPage + i - 2
                          return page <= totalPages ? (
                            <button
                              key={page}
                              onClick={() => setCurrentPage(page)}
                              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                page === currentPage
                                  ? 'bg-accent text-accent-foreground'
                                  : 'hover:bg-muted'
                              }`}
                            >
                              {page}
                            </button>
                          ) : null
                        })}
                      </div>
                      <button
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className="p-2 hover:bg-muted disabled:opacity-50 rounded-lg transition-colors"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground mb-4">No agencies found matching your filters.</p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchQuery('')
                      setSelectedServices([])
                      setSelectedSectors([])
                      setSelectedCities([])
                      setCurrentPage(1)
                    }}
                  >
                    Clear filters
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
