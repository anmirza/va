'use client'

import { useState, useMemo, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { companies, campaigns, talent, news } from '@/lib/mock-data'
import { Search, Building2, Film, Users, Newspaper } from 'lucide-react'
import { Input } from '@/components/ui/input'

type Tab = 'all' | 'agencies' | 'campaigns' | 'talent' | 'news'

function SearchContent() {
  const searchParams = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [activeTab, setActiveTab] = useState<Tab>('all')

  const q = query.toLowerCase()

  const results = useMemo(() => ({
    agencies: companies.filter(c => c.name.toLowerCase().includes(q) || c.description.toLowerCase().includes(q) || c.city.toLowerCase().includes(q)),
    campaigns: campaigns.filter(c => c.title.toLowerCase().includes(q) || c.brand.toLowerCase().includes(q) || c.agency.toLowerCase().includes(q)),
    talent: talent.filter(t => t.name.toLowerCase().includes(q) || t.role.toLowerCase().includes(q)),
    news: news.filter(n => n.title.toLowerCase().includes(q) || n.excerpt.toLowerCase().includes(q)),
  }), [q])

  const totalCount = results.agencies.length + results.campaigns.length + results.talent.length + results.news.length

  const TABS = [
    { id: 'all' as const, label: 'All', count: totalCount },
    { id: 'agencies' as const, label: 'Agencies', count: results.agencies.length, icon: Building2 },
    { id: 'campaigns' as const, label: 'Campaigns', count: results.campaigns.length, icon: Film },
    { id: 'talent' as const, label: 'Talent', count: results.talent.length, icon: Users },
    { id: 'news' as const, label: 'News', count: results.news.length, icon: Newspaper },
  ]

  return (
    <div className="min-h-screen bg-[#eef0f3] flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Search hero */}
        <div className="bg-[#2e3843] px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold text-white mb-6 text-center">Search REQUISTI</h1>
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#666]" />
                <Input
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Search agencies, campaigns, talent..."
                  className="pl-12 h-13 text-base bg-white border-0 h-12"
                  autoFocus
                />
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {query && (
            <p className="text-sm text-[#666] mb-6">{totalCount} result{totalCount !== 1 ? 's' : ''} for &ldquo;<span className="font-medium text-[#1a1a1a]">{query}</span>&rdquo;</p>
          )}

          {/* Tabs */}
          <div className="flex flex-wrap gap-2 mb-8">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeTab === tab.id ? 'bg-[#2e3843] text-white' : 'bg-white text-[#666] hover:bg-[#d8dce2]'}`}
              >
                {tab.label}
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-[#eef0f3] text-[#666]'}`}>{tab.count}</span>
              </button>
            ))}
          </div>

          {!query && (
            <div className="text-center py-20 text-[#666]">
              <Search className="w-16 h-16 mx-auto mb-4 text-[#d8dce2]" />
              <p className="text-lg font-medium mb-1">Search REQUISTI</p>
              <p className="text-sm">Find agencies, campaigns, talent and industry news</p>
            </div>
          )}

          {query && (
            <div className="space-y-8">
              {/* Agencies */}
              {(activeTab === 'all' || activeTab === 'agencies') && results.agencies.length > 0 && (
                <section>
                  <h2 className="text-lg font-bold text-[#1a1a1a] mb-4 flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-[#4fc487]" /> Agencies ({results.agencies.length})
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {results.agencies.slice(0, activeTab === 'all' ? 3 : 12).map(company => (
                      <Link key={company.id} href={`/directory/${company.id}`} className="group bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#eef0f3] rounded-lg flex items-center justify-center font-bold text-[#2e3843] shrink-0">{company.name[0]}</div>
                        <div className="min-w-0">
                          <p className="font-medium text-[#1a1a1a] group-hover:text-[#4fc487] transition-colors truncate">{company.name}</p>
                          <p className="text-xs text-[#666]">{company.city}, {company.country}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </section>
              )}

              {/* Campaigns */}
              {(activeTab === 'all' || activeTab === 'campaigns') && results.campaigns.length > 0 && (
                <section>
                  <h2 className="text-lg font-bold text-[#1a1a1a] mb-4 flex items-center gap-2">
                    <Film className="w-5 h-5 text-[#4fc487]" /> Campaigns ({results.campaigns.length})
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {results.campaigns.slice(0, activeTab === 'all' ? 4 : 12).map(c => (
                      <Link key={c.id} href={`/campaigns/${c.id}`} className="group bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                        <img src={c.thumbnail} alt="" className="w-full h-28 object-cover group-hover:scale-105 transition-transform duration-300" />
                        <div className="p-3">
                          <p className="text-sm font-medium text-[#1a1a1a] group-hover:text-[#4fc487] transition-colors line-clamp-1">{c.title}</p>
                          <p className="text-xs text-[#666]">{c.brand}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </section>
              )}

              {/* Talent */}
              {(activeTab === 'all' || activeTab === 'talent') && results.talent.length > 0 && (
                <section>
                  <h2 className="text-lg font-bold text-[#1a1a1a] mb-4 flex items-center gap-2">
                    <Users className="w-5 h-5 text-[#4fc487]" /> Talent ({results.talent.length})
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {results.talent.slice(0, activeTab === 'all' ? 4 : 12).map(person => (
                      <Link key={person.id} href={`/talent/${person.id}`} className="group bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow text-center">
                        <img src={person.photo} alt={person.name} className="w-16 h-16 rounded-xl object-cover mx-auto mb-2" />
                        <p className="text-sm font-medium text-[#1a1a1a] group-hover:text-[#4fc487] transition-colors">{person.name}</p>
                        <p className="text-xs text-[#666]">{person.role}</p>
                      </Link>
                    ))}
                  </div>
                </section>
              )}

              {/* News */}
              {(activeTab === 'all' || activeTab === 'news') && results.news.length > 0 && (
                <section>
                  <h2 className="text-lg font-bold text-[#1a1a1a] mb-4 flex items-center gap-2">
                    <Newspaper className="w-5 h-5 text-[#4fc487]" /> News ({results.news.length})
                  </h2>
                  <div className="space-y-3">
                    {results.news.slice(0, activeTab === 'all' ? 3 : 10).map(article => (
                      <Link key={article.id} href={`/news/${article.id}`} className="group flex gap-4 bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                        <img src={article.thumbnail} alt="" className="w-20 h-16 object-cover rounded-lg shrink-0" />
                        <div className="min-w-0">
                          <span className="text-xs text-[#666] font-medium">{article.category}</span>
                          <p className="font-medium text-[#1a1a1a] group-hover:text-[#4fc487] transition-colors line-clamp-1 mt-0.5">{article.title}</p>
                          <p className="text-xs text-[#666] mt-1 line-clamp-1">{article.excerpt}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </section>
              )}

              {totalCount === 0 && (
                <div className="text-center py-20 text-[#666]">
                  <p className="text-lg font-medium mb-1">No results found</p>
                  <p className="text-sm">Try a different search term</p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#eef0f3] flex items-center justify-center"><div className="w-8 h-8 border-4 border-[#4fc487] border-t-transparent rounded-full animate-spin" /></div>}>
      <SearchContent />
    </Suspense>
  )
}
