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
import {
  COVER_ASPECT_CLASS,
  PROFILE_LOGO_BOX_WIDTH_PERCENT,
  PROFILE_LOGO_BOX_MIN_WIDTH_PX,
  PROFILE_LOGO_BOX_MAX_WIDTH_PX,
} from '@/lib/cover-logo-spec'

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
            <Link href="/directory" className="text-[#0763d8] hover:underline">Back to Directory</Link>
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
    { label: 'REVENUE', value: company.turnover || 'N/A', trend: 'up' as const, color: '#0763d8', data: revenueData },
    { label: 'EBITDA', value: company.turnover ? `${parseInt(company.turnover.replace(/[^0-9]/g, '')) * 0.15 | 0}M` : 'N/A', trend: 'up' as const, color: '#3b82f6', data: seededData(company.id + 'ebitda', 12, 30, 100) },
    { label: 'EMPLOYEES', value: company.employees.toLocaleString(), trend: 'down' as const, color: '#e74c3c', data: employeeData },
    { label: 'FOUNDED', value: String(company.founded), trend: null, color: '#a855f7', data: [] },
    { label: 'AWARDS', value: String(company.awards), trend: 'up' as const, color: '#f59e0b', data: awardsData },
  ]

  const overviewStats = statCards.filter(c => ['REVENUE', 'EMPLOYEES', 'AWARDS'].includes(c.label))

  // Client-only favouriting (Client or Marketer)
  const isClientOrMarketer = user?.role === 'client' || user?.role === 'marketer'

  return (
    <div className="min-h-screen bg-[#02030E] flex flex-col">
      <Header />
      <main className="flex-1">

        {/* ═══════ COVER + LOGO (same dimension, frosted integration) ═══════ */}
        <div className="relative w-full cover-hero">
          <div
            className={`relative w-full ${COVER_ASPECT_CLASS} bg-cover bg-center overflow-hidden`}
            style={{ backgroundImage: `url(${company.coverImage})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-[#02030E]/70" />
            <div
              className="absolute inset-y-0 left-1/2 -translate-x-1/2 flex items-center justify-center px-4"
              style={{
                width: `${PROFILE_LOGO_BOX_WIDTH_PERCENT}%`,
                minWidth: `${PROFILE_LOGO_BOX_MIN_WIDTH_PX}px`,
                maxWidth: `${PROFILE_LOGO_BOX_MAX_WIDTH_PX}px`,
              }}
            >
              <div className="cover-logo-block h-full w-full flex items-center justify-center p-5 sm:p-6">
                <img src={company.logo} alt={company.name} className="max-h-[85%] w-auto max-w-[85%] object-contain" />
              </div>
            </div>
          </div>

          {/* Profile info below cover — glass strip */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-4">
            <div className="glass-panel flex flex-wrap gap-4 items-start justify-between p-5 sm:p-6">
              <div className="flex-1 min-w-0">
                <h1 className="text-xl sm:text-2xl font-bold text-white uppercase tracking-tight">{company.name}</h1>
                {company.services[0] && <p className="text-sm text-white/50 mt-0.5">{company.services[0]}</p>}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-white/40 mt-2">
                  <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-[#0763d8]/80" />{company.city}, {company.country}</span>
                  {company.website && <a href={`https://${company.website}`} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-[#0763d8] hover:text-[#3b8aff] transition-colors"><Globe className="w-3.5 h-3.5" />{company.website}</a>}
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  {(company.typeTags || company.competencies || []).slice(0, 8).map(tag => (
                    <span key={tag} className="text-[10px] px-2.5 py-1.5 rounded-md font-medium uppercase tracking-wide bg-white/[0.06] text-white/60 border border-white/[0.06]">{tag}</span>
                  ))}
                  {(company.typeTags?.length || company.competencies?.length || 0) > 8 && (
                    <span className="text-[10px] px-2.5 py-1.5 rounded-md font-medium text-white/40">+{(company.typeTags?.length || company.competencies?.length || 0) - 8}</span>
                  )}
                  <span className="text-[10px] px-2.5 py-1.5 rounded-md font-semibold uppercase tracking-wide bg-[#0763d8]/15 text-[#0763d8] border border-[#0763d8]/25">Est. {company.founded}</span>
                </div>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <div className="flex items-center gap-2">
                  {company.socialLinks?.twitter && <a href={company.socialLinks.twitter} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-white/[0.06] border border-white/[0.08] text-white/60 flex items-center justify-center hover:bg-white/[0.12] hover:scale-110 hover:border-[#0763d8]/30 transition-all duration-200"><Twitter className="w-4 h-4" /></a>}
                  {company.socialLinks?.linkedin && <a href={company.socialLinks.linkedin} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-white/[0.06] border border-white/[0.08] text-white/60 flex items-center justify-center hover:bg-white/[0.12] hover:scale-110 hover:border-[#0763d8]/30 transition-all duration-200"><Linkedin className="w-4 h-4" /></a>}
                  {company.socialLinks?.instagram && <a href={company.socialLinks.instagram} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-white/[0.06] border border-white/[0.08] text-white/60 flex items-center justify-center hover:bg-white/[0.12] hover:scale-110 hover:border-[#0763d8]/30 transition-all duration-200"><Instagram className="w-4 h-4" /></a>}
                </div>
                {isClientOrMarketer && (
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setIsFavourited(!isFavourited)}
                      className={`gap-1 rounded-full text-xs ${isFavourited ? 'border-[#0763d8] text-[#0763d8] bg-[#0763d8]/10' : 'border-white/20 text-white/60 hover:bg-white/10'}`}>
                      <Heart className={`w-3 h-3 ${isFavourited ? 'fill-[#0763d8]' : ''}`} />{isFavourited ? 'Favourited' : 'Favourite'}
                    </Button>
                    <Button variant="outline" size="sm" className="gap-1 border-white/20 text-white/60 hover:bg-white/10 rounded-full text-xs">
                      <Bookmark className="w-3 h-3" />Add to List
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ═══════ 8-TAB BAR (glass) ═══════ */}
        <div className="sticky top-14 lg:top-16 z-40 glass-panel border-t-0 border-x-0 rounded-none border-b border-white/[0.08] bg-[#02030E]/80 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex gap-0 overflow-x-auto scrollbar-hide">
              {PROFILE_TABS.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`tab-pill py-3 px-4 text-sm font-medium border-b-[3px] whitespace-nowrap rounded-t-lg ${
                    activeTab === tab.id
                      ? 'border-[#0763d8] text-[#0763d8] bg-[#0763d8]/5'
                      : 'border-transparent text-white/40 hover:text-white/70'
                  }`}
                >
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
                <section className="glass-card p-6 overview-enter">
                  <h2 className="text-base font-bold mb-2 text-white">About</h2>
                  <p className="text-sm text-white/50 leading-relaxed">{company.about}</p>
                </section>

                {/* Key metrics snapshot (high-level, visual) */}
                <section className="glass-card p-6 overview-enter overview-enter-delay-1">
                  <h2 className="text-base font-bold mb-4 text-white">Snapshot</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {overviewStats.map((card, index) => {
                      const hasSeries = card.data && card.data.length > 0
                      return (
                        <div
                          key={card.label}
                          className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-4 hover-lift transition-all stat-card-animate"
                          data-index={index}
                        >
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <div>
                              <p className="text-[10px] font-semibold tracking-widest text-white/40 uppercase">
                                {card.label}
                              </p>
                              <p className="text-xl font-bold text-white mt-1">
                                {card.value}
                              </p>
                            </div>
                            {card.trend && (
                              <span
                                className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                                  card.trend === 'up'
                                    ? 'bg-emerald-500/10 text-emerald-400'
                                    : 'bg-red-500/10 text-red-400'
                                }`}
                              >
                                {card.trend === 'up'
                                  ? <ArrowUpRight className="w-3 h-3" />
                                  : <ArrowDownRight className="w-3 h-3" />}
                                YoY
                              </span>
                            )}
                          </div>

                          {hasSeries && (
                            <div className="mt-3 h-16 flex items-end gap-1.5">
                              {(() => {
                                const vals = card.data
                                const min = Math.min(...vals)
                                const max = Math.max(...vals)
                                const range = max - min || 1
                                return vals.slice(-8).map((v, i) => {
                                  const normalized = ((v - min) / range) * 100
                                  return (
                                    // eslint-disable-next-line react/no-array-index-key
                                    <div key={i} className="flex-1 rounded-full bg-white/[0.06] overflow-hidden">
                                      <div
                                        className="w-full rounded-full"
                                        style={{
                                          height: `${10 + (normalized * 0.7)}%`,
                                          backgroundImage: `linear-gradient(to top, ${card.color}, rgba(7,99,216,0.1))`,
                                        }}
                                      />
                                    </div>
                                  )
                                })
                              })()}
                            </div>
                          )}

                          {!hasSeries && (
                            <div className="mt-4 h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                              <div className="h-full w-2/3 bg-white/20" />
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </section>

                {/* Suggestions */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 overview-enter overview-enter-delay-2">
                  <div className="lg:col-span-3 glass-card p-6">
                    <h2 className="text-base font-bold mb-4 text-white">Similar Agencies</h2>
                    <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                      {similarAgencies.map(a => (
                        <Link
                          key={a.id}
                          href={`/directory/${a.id}`}
                          className="min-w-[150px] bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 hover:border-[#0763d8]/30 transition-all text-center flex flex-col items-center hover-lift"
                        >
                          <div className="w-14 h-14 bg-white rounded-lg border border-white/[0.1] flex items-center justify-center mb-2 overflow-hidden">
                            <img src={a.logo} alt={a.name} className="w-full h-full object-contain p-1" />
                          </div>
                          <p className="text-xs font-bold text-white uppercase">{a.name}</p>
                        </Link>
                      ))}
                    </div>
                  </div>
                  <div className="lg:col-span-2 glass-card p-6 overview-enter overview-enter-delay-3">
                    <h2 className="text-base font-bold mb-3 text-white">Services</h2>
                    <div className="flex flex-wrap gap-2 mb-4">{company.services.map(s => <Badge key={s} className="bg-white/[0.06] text-white/60 border-white/[0.08] rounded-full transition-transform hover:scale-105">{s}</Badge>)}</div>
                    <h2 className="text-base font-bold mb-3 text-white">Sectors</h2>
                    <div className="flex flex-wrap gap-2">{company.sectors.map(s => <Badge key={s} variant="outline" className="border-white/[0.08] text-white/40 rounded-full transition-transform hover:scale-105">{s}</Badge>)}</div>
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
                        <h3 className="font-bold text-xs text-[#0763d8] uppercase tracking-wider mb-4 border-b border-white/[0.06] pb-3">{dept.department}</h3>
                        <div className="space-y-4">
                          {dept.contacts.map(c => (
                            <div key={c.name} className="flex items-start gap-3">
                              <div className="w-10 h-10 rounded-full bg-white/[0.06] flex-shrink-0 flex items-center justify-center text-white/40 text-xs font-bold">{c.name.split(' ').map(n => n[0]).join('')}</div>
                              <div className="min-w-0">
                                <p className="text-sm font-bold text-white">{c.name}</p>
                                <p className="text-xs text-white/30">{c.role}</p>
                                {c.email && <a href={`mailto:${c.email}`} className="text-xs text-[#0763d8] hover:underline">{c.email}</a>}
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
                        <p className="text-xs text-[#0763d8]">{p.role}</p>
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
                  <h2 className="text-base font-bold mb-4 text-white">Financial Snapshot</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                    {statCards.map((card, index) => {
                      const hasSeries = card.data && card.data.length > 0
                      return (
                        <div
                          key={card.label}
                          className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 flex flex-col justify-between stat-card-animate"
                          data-index={index}
                        >
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div>
                              <p className="text-xs font-semibold tracking-widest text-white/40 uppercase">{card.label}</p>
                              <p className="text-xl sm:text-2xl font-bold text-white mt-1">{card.value}</p>
                            </div>
                            {card.trend && (
                              <span
                                className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                                  card.trend === 'up'
                                    ? 'bg-emerald-500/10 text-emerald-400'
                                    : 'bg-red-500/10 text-red-400'
                                }`}
                              >
                                {card.trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                                YoY
                              </span>
                            )}
                          </div>
                          {hasSeries && (
                            <svg viewBox="0 0 100 32" className="w-full h-12 mt-1">
                              <defs>
                                <linearGradient id={`spark-${card.label}`} x1="0" x2="0" y1="0" y2="1">
                                  <stop offset="0%" stopColor={card.color} stopOpacity="0.9" />
                                  <stop offset="100%" stopColor={card.color} stopOpacity="0.1" />
                                </linearGradient>
                              </defs>
                              <path
                                d={(() => {
                                  const vals = card.data
                                  const min = Math.min(...vals)
                                  const max = Math.max(...vals)
                                  const range = max - min || 1
                                  return vals
                                    .map((v, i) => {
                                      const x = (i / Math.max(vals.length - 1, 1)) * 100
                                      const y = 26 - ((v - min) / range) * 18
                                      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`
                                    })
                                    .join(' ')
                                })()}
                                fill="none"
                                stroke={`url(#spark-${card.label})`}
                                strokeWidth="1.5"
                                strokeLinecap="round"
                              />
                              <path
                                d={(() => {
                                  const vals = card.data
                                  const min = Math.min(...vals)
                                  const max = Math.max(...vals)
                                  const range = max - min || 1
                                  const points = vals.map((v, i) => {
                                    const x = (i / Math.max(vals.length - 1, 1)) * 100
                                    const y = 26 - ((v - min) / range) * 18
                                    return `${x},${y}`
                                  })
                                  return `M 0 32 L ${points.join(' L ')} L 100 32 Z`
                                })()}
                                fill={`url(#spark-${card.label})`}
                                opacity="0.2"
                              />
                            </svg>
                          )}
                          {!hasSeries && (
                            <div className="mt-3 h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                              <div className="h-full w-1/2 bg-white/20" />
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </section>
                <section className="glass-card p-6">
                  <h2 className="text-base font-bold mb-4 text-white">Clients ({company.clients.length})</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {company.clients.map((client, i) => {
                      const sector = company.clientIndustries?.[i % (company.clientIndustries?.length || 1)] || null
                      return (
                        <div key={client} className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 hover:border-[#0763d8]/20 transition-all">
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
                  <div className="flex flex-wrap gap-2 mb-5">{company.services.map(s => <Badge key={s} className="bg-[#0763d8]/10 text-[#0763d8] border-[#0763d8]/20 rounded-full">{s}</Badge>)}</div>
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
                        <p className="text-xs text-[#0763d8]">{p.role}</p>
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
                        <div key={c.id} className="glass-card overflow-hidden hover:border-[#0763d8]/30 transition-all group">
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
