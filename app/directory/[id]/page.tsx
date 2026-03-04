'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  companies,
  getCampaignsByAgency,
  getAwardsByCompany,
  getTalentByCompany,
  getCompanyById,
  getNewsByAgency,
} from '@/lib/mock-data'
import {
  MapPin, Globe, Users, Phone, Mail, Linkedin, Twitter, Instagram,
  Building2, TrendingUp, TrendingDown, Trophy, Search, LayoutGrid, List,
  Bookmark, Star, ArrowUpRight, ArrowDownRight, Heart,
} from 'lucide-react'
import { useParams } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'

/* ──────────── tiny SVG sparkline ──────────── */
function Sparkline({ data, color, width = 120, height = 32 }: { data: number[]; color: string; width?: number; height?: number }) {
  if (data.length < 2) return null
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width
    const y = height - ((v - min) / range) * (height - 4) - 2
    return `${x},${y}`
  }).join(' ')
  return (
    <svg width={width} height={height} className="mt-1">
      <polyline fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" points={points} />
      <polyline fill={`${color}15`} stroke="none" points={`0,${height} ${points} ${width},${height}`} />
    </svg>
  )
}

/* ──────────── mock data generators ──────────── */
function seededData(seed: string, len: number, min: number, max: number): number[] {
  let h = 0
  for (let i = 0; i < seed.length; i++) h = ((h << 5) - h + seed.charCodeAt(i)) | 0
  const out: number[] = []
  for (let i = 0; i < len; i++) {
    h = ((h * 16807) % 2147483647 + 2147483647) % 2147483647
    out.push(min + (h / 2147483647) * (max - min))
  }
  return out
}

/* ──────────── 8 Profile Tabs (matching registration steps) ──────────── */
const PROFILE_TABS = [
  { id: 'overview',     label: 'Overview' },
  { id: 'contacts',     label: 'Contacts' },
  { id: 'turnover',     label: 'Turnover & Clients' },
  { id: 'competencies', label: 'Competencies' },
  { id: 'governance',   label: 'Governance' },
  { id: 'people',       label: 'People & Talent' },
  { id: 'awards',       label: 'Awards' },
  { id: 'add-on',       label: 'Add-On' },
]

export default function CompanyProfilePage() {
  const params = useParams()
  const id = params.id as string
  const company = getCompanyById(id)
  const { user } = useAuth()

  const [activeTab, setActiveTab] = useState('overview')
  const [isFavourited, setIsFavourited] = useState(false)

  if (!company) {
    return (
      <div className="min-h-screen bg-[#02030E] flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-serif font-bold mb-2 text-white">Agency not found</h1>
            <Link href="/directory" className="text-[#4fc487] hover:underline">Back to Directory</Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const campaignsList = getCampaignsByAgency(company.id)
  const awardsList = getAwardsByCompany(company.id)
  const teamMembers = getTalentByCompany(company.id)
  const agencyNews = getNewsByAgency(company.name)
  const allContacts = company.contactsByDept ? company.contactsByDept.flatMap(d => d.contacts) : []
  const similarAgencies = companies.filter(c => c.id !== company.id && c.services.some(s => company.services.includes(s))).slice(0, 6)

  // Sparkline data
  const revenueData = seededData(company.id + 'rev', 12, 200, 500)
  const employeeData = seededData(company.id + 'emp', 12, 100, company.employees)
  const awardsData = seededData(company.id + 'awd', 12, 5, company.awards)

  const statCards = [
    { label: 'REVENUE', value: company.turnover || 'N/A', trend: 'up' as const, color: '#4fc487', data: revenueData },
    { label: 'EBITDA', value: company.turnover ? `${parseInt(company.turnover.replace(/[^0-9]/g, '')) * 0.15 | 0}M` : 'N/A', trend: 'up' as const, color: '#3b82f6', data: seededData(company.id + 'ebitda', 12, 30, 100) },
    { label: 'EMPLOYEES', value: company.employees.toLocaleString(), trend: 'down' as const, color: '#e74c3c', data: employeeData },
    { label: 'FOUNDED', value: String(company.founded), trend: null, color: '#a855f7', data: [] },
    { label: 'AWARDS', value: String(company.awards), trend: 'up' as const, color: '#f59e0b', data: awardsData },
  ]

  // Client-only favourite
  const isClient = user?.role === ('client' as string)

  return (
    <div className="min-h-screen bg-[#02030E] flex flex-col">
      <Header />
      <main className="flex-1">

        {/* ═══════ COVER IMAGE + PROFILE HEADER ═══════ */}
        <div className="relative">
          {/* Cover image */}
          <div className="h-48 md:h-56 bg-gradient-to-r from-[#0a0c18] via-[#111328] to-[#0a0c18] relative overflow-hidden">
            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: `url(https://images.unsplash.com/photo-1497366216548-37526070297c?w=1400&q=80)`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
            <div className="absolute inset-0 bg-gradient-to-t from-[#02030E] via-transparent to-transparent" />
          </div>

          {/* Profile info overlay */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10">
            <div className="flex gap-5 items-end">
              {/* Logo — larger per client feedback */}
              <div className="w-28 h-28 bg-white rounded-2xl border-4 border-[#02030E] flex-shrink-0 flex items-center justify-center overflow-hidden shadow-xl">
                <img src={company.logo} alt={company.name} className="w-full h-full object-contain p-3" />
              </div>
              {/* Info */}
              <div className="flex-1 min-w-0 pb-2">
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-xl font-bold text-white uppercase tracking-wide">{company.name}</h1>
                </div>
                <p className="text-sm text-white/40 mb-1">{company.services[0]}</p>
                <div className="flex flex-wrap items-center gap-x-4 text-sm text-white/30">
                  <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{company.city}, {company.country}</span>
                  {company.website && <a href={`https://${company.website}`} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-[#4fc487] hover:underline"><Globe className="w-3.5 h-3.5" />{company.website}</a>}
                </div>
                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {(company.typeTags || company.competencies || []).map(tag => (
                    <span key={tag} className="text-[10px] px-2.5 py-1 rounded-full font-semibold uppercase tracking-wider bg-white/[0.06] text-white/50 border border-white/[0.08]">{tag}</span>
                  ))}
                  <span className="text-[10px] px-2.5 py-1 rounded-full font-semibold uppercase tracking-wider bg-[#4fc487]/10 text-[#4fc487] border border-[#4fc487]/20">Est. {company.founded}</span>
                </div>
              </div>
              {/* Right: Actions */}
              <div className="flex flex-col items-end gap-3 flex-shrink-0 pb-2">
                <div className="flex items-center gap-2">
                  {company.socialLinks?.twitter && <a href={company.socialLinks.twitter} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-white/[0.06] border border-white/[0.08] text-white/60 flex items-center justify-center hover:bg-white/[0.12]"><Twitter className="w-4 h-4" /></a>}
                  {company.socialLinks?.linkedin && <a href={company.socialLinks.linkedin} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-white/[0.06] border border-white/[0.08] text-white/60 flex items-center justify-center hover:bg-white/[0.12]"><Linkedin className="w-4 h-4" /></a>}
                  {company.socialLinks?.instagram && <a href={company.socialLinks.instagram} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-white/[0.06] border border-white/[0.08] text-white/60 flex items-center justify-center hover:bg-white/[0.12]"><Instagram className="w-4 h-4" /></a>}
                </div>
                <div className="flex gap-2">
                  {/* Favourite — only show if logged in as Client */}
                  {isClient && (
                    <Button variant="outline" size="sm" onClick={() => setIsFavourited(!isFavourited)}
                      className={`gap-1 rounded-full text-xs ${isFavourited ? 'border-[#4fc487] text-[#4fc487] bg-[#4fc487]/10' : 'border-white/20 text-white/60 hover:bg-white/10'}`}>
                      <Heart className={`w-3 h-3 ${isFavourited ? 'fill-[#4fc487]' : ''}`} />{isFavourited ? 'Favourited' : 'Favourite'}
                    </Button>
                  )}
                  {user && (
                    <Button variant="outline" size="sm" className="gap-1 border-white/20 text-white/60 hover:bg-white/10 rounded-full text-xs">
                      <Bookmark className="w-3 h-3" />Add to List
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ═══════ 8-TAB BAR ═══════ */}
        <div className="sticky top-14 lg:top-16 bg-[#02030E]/95 backdrop-blur-md border-b border-white/[0.06] z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex gap-0 overflow-x-auto scrollbar-hide">
              {PROFILE_TABS.map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                  className={`py-3 px-4 text-sm font-medium border-b-[3px] transition-colors whitespace-nowrap ${
                    activeTab === tab.id ? 'border-[#4fc487] text-[#4fc487]' : 'border-transparent text-white/40 hover:text-white/70'
                  }`}>
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ═══════ TAB CONTENT ═══════ */}
        <div className="px-4 sm:px-6 lg:px-8 py-6">
          <div className="max-w-7xl mx-auto">

            {/* ════ OVERVIEW ════ */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* About */}
                <section className="glass-card p-6">
                  <h2 className="text-base font-bold mb-2 text-white">About</h2>
                  <p className="text-sm text-white/50 leading-relaxed">{company.about}</p>
                </section>



                {/* Suggestions */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                  <div className="lg:col-span-3 glass-card p-6">
                    <h2 className="text-base font-bold mb-4 text-white">Similar Agencies</h2>
                    <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                      {similarAgencies.map(a => (
                        <Link key={a.id} href={`/directory/${a.id}`} className="min-w-[150px] bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 hover:border-[#4fc487]/30 transition-all text-center flex flex-col items-center">
                          <div className="w-14 h-14 bg-white rounded-lg border border-white/[0.1] flex items-center justify-center mb-2 overflow-hidden">
                            <img src={a.logo} alt={a.name} className="w-full h-full object-contain p-1" />
                          </div>
                          <p className="text-xs font-bold text-white uppercase">{a.name}</p>
                        </Link>
                      ))}
                    </div>
                  </div>
                  <div className="lg:col-span-2 glass-card p-6">
                    <h2 className="text-base font-bold mb-3 text-white">Services</h2>
                    <div className="flex flex-wrap gap-2 mb-4">{company.services.map(s => <Badge key={s} className="bg-white/[0.06] text-white/60 border-white/[0.08] rounded-full">{s}</Badge>)}</div>
                    <h2 className="text-base font-bold mb-3 text-white">Sectors</h2>
                    <div className="flex flex-wrap gap-2">{company.sectors.map(s => <Badge key={s} variant="outline" className="border-white/[0.08] text-white/40 rounded-full">{s}</Badge>)}</div>
                  </div>
                </div>
              </div>
            )}

            {/* ════ CONTACTS ════ */}
            {activeTab === 'contacts' && (
              <div>
                <h2 className="text-base font-bold text-white mb-6">Contacts</h2>
                {company.contactsByDept && company.contactsByDept.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {company.contactsByDept.map(dept => (
                      <div key={dept.department} className="glass-card p-5">
                        <h3 className="font-bold text-xs text-[#4fc487] uppercase tracking-wider mb-4 border-b border-white/[0.06] pb-3">{dept.department}</h3>
                        <div className="space-y-4">
                          {dept.contacts.map(c => (
                            <div key={c.name} className="flex items-start gap-3">
                              <div className="w-10 h-10 rounded-full bg-white/[0.06] flex-shrink-0 flex items-center justify-center text-white/40 text-xs font-bold">{c.name.split(' ').map(n => n[0]).join('')}</div>
                              <div className="min-w-0">
                                <p className="text-sm font-bold text-white">{c.name}</p>
                                <p className="text-xs text-white/30">{c.role}</p>
                                {c.email && <a href={`mailto:${c.email}`} className="text-xs text-[#4fc487] hover:underline">{c.email}</a>}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : teamMembers.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {teamMembers.map(p => (
                      <div key={p.id} className="glass-card p-4 text-center">
                        <div className="w-16 h-16 rounded-full bg-white/[0.06] mx-auto mb-3 overflow-hidden"><img src={p.photo} alt={p.name} className="w-full h-full object-cover" /></div>
                        <h3 className="text-sm font-bold text-white mb-0.5">{p.name}</h3>
                        <p className="text-xs text-[#4fc487]">{p.role}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-white/30"><Users className="w-12 h-12 mx-auto mb-3 text-white/10" /><p className="text-sm">No contact information available yet.</p></div>
                )}
              </div>
            )}

            {/* ════ TURNOVER & CLIENTS ════ */}
            {activeTab === 'turnover' && (
              <div className="space-y-6">
                <section className="glass-card p-6">
                  <h2 className="text-base font-bold mb-4 text-white">Financial Data</h2>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {statCards.filter(c => ['REVENUE', 'EBITDA'].includes(c.label)).map(card => (
                      <div key={card.label} className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4">
                        <p className="text-2xl font-bold text-white">{card.value}</p>
                        <p className="text-[10px] uppercase tracking-wider text-white/30 font-semibold mb-1">{card.label}</p>
                        {card.data.length > 0 && <Sparkline data={card.data} color={card.color} width={120} height={28} />}
                      </div>
                    ))}
                  </div>
                </section>
                <section className="glass-card p-6">
                  <h2 className="text-base font-bold mb-4 text-white">Clients ({company.clients.length})</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {company.clients.map((client, i) => {
                      const sector = company.clientIndustries?.[i % (company.clientIndustries?.length || 1)] || null
                      return (
                        <div key={client} className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 hover:border-[#4fc487]/20 transition-all">
                          <div className="w-10 h-10 bg-white/[0.06] rounded-lg flex items-center justify-center mb-3 text-xs font-bold text-white/30">{client.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase()}</div>
                          <p className="text-sm font-bold text-white mb-1">{client}</p>
                          {sector && <span className="text-[10px] bg-white/[0.06] text-white/30 px-2 py-0.5 rounded-full">{sector}</span>}
                        </div>
                      )
                    })}
                  </div>
                </section>
              </div>
            )}

            {/* ════ COMPETENCIES ════ */}
            {activeTab === 'competencies' && (
              <div className="space-y-6">
                <section className="glass-card p-6">
                  <h2 className="text-base font-bold mb-3 text-white">Services</h2>
                  <div className="flex flex-wrap gap-2 mb-5">{company.services.map(s => <Badge key={s} className="bg-[#4fc487]/10 text-[#4fc487] border-[#4fc487]/20 rounded-full">{s}</Badge>)}</div>
                </section>
                <section className="glass-card p-6">
                  <h2 className="text-base font-bold mb-3 text-white">Sectors</h2>
                  <div className="flex flex-wrap gap-2">{company.sectors.map(s => <Badge key={s} variant="outline" className="border-white/[0.08] text-white/40 rounded-full">{s}</Badge>)}</div>
                </section>
              </div>
            )}

            {/* ════ GOVERNANCE ════ */}
            {activeTab === 'governance' && (
              <div className="glass-card p-6">
                <h2 className="text-base font-bold mb-4 text-white">Governance & SOW</h2>
                <p className="text-sm text-white/50 leading-relaxed">{company.about}</p>
                <div className="mt-6 space-y-4">
                  <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4">
                    <p className="text-xs text-white/30 uppercase tracking-widest mb-1">Philosophy</p>
                    <p className="text-sm text-white/50">Information provided by the agency upon registration.</p>
                  </div>
                  <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4">
                    <p className="text-xs text-white/30 uppercase tracking-widest mb-1">Network</p>
                    <p className="text-sm text-white/50">{company.network || 'Independent'}</p>
                  </div>
                </div>
              </div>
            )}

            {/* ════ PEOPLE & TALENT ════ */}
            {activeTab === 'people' && (
              <div>
                <h2 className="text-base font-bold text-white mb-6">People & Talent</h2>
                {teamMembers.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {teamMembers.map(p => (
                      <div key={p.id} className="glass-card p-4 text-center">
                        <div className="w-16 h-16 rounded-full bg-white/[0.06] mx-auto mb-3 overflow-hidden"><img src={p.photo} alt={p.name} className="w-full h-full object-cover" /></div>
                        <h3 className="text-sm font-bold text-white mb-0.5">{p.name}</h3>
                        <p className="text-xs text-[#4fc487]">{p.role}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="glass-card p-8 text-center">
                    <Users className="w-12 h-12 mx-auto mb-3 text-white/10" />
                    <p className="text-sm text-white/30">People data provided after registration.</p>
                    <div className="mt-4 flex items-center justify-center gap-4 text-white/20 text-sm">
                      <span className="flex items-center gap-1"><Users className="w-4 h-4" />{company.employees} employees</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ════ AWARDS ════ */}
            {activeTab === 'awards' && (
              <div>
                <h2 className="text-base font-bold text-white mb-6">Awards ({awardsList.length})</h2>
                {awardsList.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {awardsList.map((award, i) => (
                      <div key={i} className="glass-card p-4">
                        <div className="flex items-start gap-3">
                          <Trophy className="w-5 h-5 text-[#f59e0b] flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm font-bold text-white">{award.title}</p>
                            <p className="text-xs text-white/30">{award.campaign || award.festival} · {award.year}</p>
                            <Badge className="mt-1 bg-[#f59e0b]/10 text-[#f59e0b] border-[#f59e0b]/20 rounded-full text-[10px]">{award.level}</Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="glass-card p-8 text-center">
                    <Trophy className="w-12 h-12 mx-auto mb-3 text-white/10" />
                    <p className="text-sm text-white/30">Awards data provided after registration.</p>
                  </div>
                )}
              </div>
            )}

            {/* ════ ADD-ON ════ */}
            {activeTab === 'add-on' && (
              <div>
                <h2 className="text-base font-bold text-white mb-6">Additional Information</h2>
                {/* Work / Campaigns */}
                <section className="mb-6">
                  <h3 className="text-sm font-bold text-white/60 uppercase tracking-widest mb-4">Creative Work ({campaignsList.length})</h3>
                  {campaignsList.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {campaignsList.slice(0, 6).map(c => (
                        <div key={c.id} className="glass-card overflow-hidden hover:border-[#4fc487]/30 transition-all group">
                          <div className="aspect-video bg-[#0a0c18] overflow-hidden">
                            <img src={c.thumbnail} alt={c.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90" />
                          </div>
                          <div className="p-4 space-y-1">
                            <p className="text-sm font-bold text-white">&lsquo;{c.title}&rsquo;</p>
                            <p className="text-xs text-white/30">{c.year} · {c.format.join(', ')}</p>
                            <p className="text-xs font-bold text-white/60 uppercase">{c.brand}</p>
                            {c.awardWins && c.awardWins > 0 && (
                              <span className="inline-flex items-center gap-1 text-[10px] bg-[#f59e0b]/10 text-[#f59e0b] px-2 py-0.5 rounded-full"><Trophy className="w-3 h-3" />{c.awardWins} awards</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="glass-card p-8 text-center"><p className="text-sm text-white/30">No campaigns available yet.</p></div>
                  )}
                </section>
                {/* News */}
                <section>
                  <h3 className="text-sm font-bold text-white/60 uppercase tracking-widest mb-4">News ({agencyNews.length})</h3>
                  {agencyNews.length > 0 ? (
                    <div className="glass-card overflow-hidden divide-y divide-white/[0.04]">
                      {agencyNews.slice(0, 5).map(article => (
                        <Link key={article.id} href={`/news/${article.id}`} className="flex gap-4 p-5 hover:bg-white/[0.03] transition-colors">
                          <div className="w-14 h-14 bg-white/[0.06] rounded-lg flex-shrink-0 overflow-hidden">
                            <img src={article.thumbnail} alt="" className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-bold text-white mb-1">{article.title}</h3>
                            <p className="text-xs text-white/30">{article.excerpt}</p>
                          </div>
                          <div className="text-xs text-white/20 flex-shrink-0 whitespace-nowrap">{new Date(article.date).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}</div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="glass-card p-8 text-center"><p className="text-sm text-white/30">No news articles found.</p></div>
                  )}
                </section>
              </div>
            )}

          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
