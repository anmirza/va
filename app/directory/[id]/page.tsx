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
  MapPin, Globe, Users, Linkedin, Twitter, Instagram,
  TrendingUp, TrendingDown, Trophy,
  Bookmark, ArrowUpRight, ArrowDownRight, Heart,
  Play, Zap, BarChart2, Activity, ChevronRight, Star,
  Lock, ShieldAlert,
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

  // AdSpend history bars (seeded, 6 years)
  const adspendYears = ['2019','2020','2021','2022','2023','2024']
  const adspendDigital = seededData(company.id + 'adspd', 6, 20, 60)
  const adspendTV      = seededData(company.id + 'adsptv', 6, 10, 40)
  const adspendPrint   = seededData(company.id + 'adsppr', 6, 5, 20)

  // Expertise bars
  const expertiseItems = company.services.slice(0, 5).map((s, i) => ({
    name: s,
    pct: Math.round(60 + seededData(company.id + s + i, 1, 0, 38)[0]),
  }))

  // Access control
  const isVendor = user?.accountType === 'vendor'
  const isClient = user?.accountType === 'client'
  const isOwnCompany = user?.companyIds?.includes(id) || user?.companyId === id
  const isFreeTier = isClient && user?.tier === 'free'
  // Vendors see full data for their own companies; locked tabs for competitors
  // Free-tier clients see overview + contacts only
  const LOCKED_TABS_VENDOR = ['turnover', 'competencies', 'governance', 'people', 'awards', 'add-on']
  const LOCKED_TABS_FREE   = ['turnover', 'competencies', 'governance', 'people', 'awards', 'add-on']
  const isTabLocked = (tabId: string) => {
    if (isVendor && !isOwnCompany) return LOCKED_TABS_VENDOR.includes(tabId)
    if (isFreeTier) return LOCKED_TABS_FREE.includes(tabId)
    return false
  }

  // Client-only favouriting
  const isClientOrMarketer = isClient || user?.role === 'marketer'

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

        {/* ═══════ COMPETITOR BANNER (vendors viewing other companies) ═══════ */}
        {isVendor && !isOwnCompany && (
          <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 sm:px-6 lg:px-8 py-2.5">
            <div className="max-w-7xl mx-auto flex items-center gap-3">
              <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
              <p className="text-xs text-amber-300/80">
                You are viewing a competitor profile — detailed information is restricted to protect confidentiality. Only Overview and Contacts are visible.
              </p>
            </div>
          </div>
        )}

        {/* ═══════ FREE TIER BANNER ═══════ */}
        {isFreeTier && (
          <div className="bg-[#0763d8]/10 border-b border-[#0763d8]/20 px-4 sm:px-6 lg:px-8 py-2.5">
            <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <Lock className="w-4 h-4 text-[#0763d8] shrink-0" />
                <p className="text-xs text-white/60">
                  You are on the Free plan — some sections are restricted.{' '}
                  <Link href="/pricing" className="text-[#0763d8] hover:underline font-medium">Upgrade to Pro</Link>{' '}
                  for full access to financials, governance, people and more.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ═══════ 8-TAB BAR (glass) ═══════ */}
        <div className="sticky top-14 lg:top-16 z-40 glass-panel border-t-0 border-x-0 rounded-none border-b border-white/[0.08] bg-[#02030E]/80 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex gap-0 overflow-x-auto scrollbar-hide">
              {PROFILE_TABS.map(tab => {
                const locked = isTabLocked(tab.id)
                return (
                  <button
                    key={tab.id}
                    onClick={() => !locked && setActiveTab(tab.id)}
                    disabled={locked}
                    className={`tab-pill py-3 px-4 text-sm font-medium border-b-[3px] whitespace-nowrap rounded-t-lg flex items-center gap-1.5 ${
                      locked
                        ? 'border-transparent text-white/20 cursor-not-allowed'
                        : activeTab === tab.id
                          ? 'border-[#0763d8] text-[#0763d8] bg-[#0763d8]/5'
                          : 'border-transparent text-white/40 hover:text-white/70'
                    }`}
                  >
                    {locked && <Lock className="w-3 h-3" />}
                    {tab.label}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* ═══════ TAB CONTENT ═══════ */}
        <div className="px-4 sm:px-6 lg:px-8 py-6">
          <div className="max-w-7xl mx-auto">

            {/* ════ LOCKED STATE — shown when active tab is gated ════ */}
            {isTabLocked(activeTab) && (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="w-16 h-16 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center mb-5">
                  <Lock className="w-7 h-7 text-white/20" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">
                  {isVendor && !isOwnCompany ? 'Competitor Profile Restricted' : 'Upgrade Required'}
                </h3>
                <p className="text-white/40 text-sm max-w-sm mb-6">
                  {isVendor && !isOwnCompany
                    ? 'Detailed information from competitor profiles is not accessible on the platform to protect confidentiality.'
                    : 'This section is available on the Pro plan. Upgrade to access financials, governance data, people profiles, awards, and more.'}
                </p>
                {isFreeTier && (
                  <Link href="/pricing">
                    <Button className="bg-[#0763d8] hover:bg-[#0655b3] text-white rounded-xl px-8">
                      Upgrade to Pro
                    </Button>
                  </Link>
                )}
              </div>
            )}

            {/* ════ OVERVIEW ════ */}
            {!isTabLocked(activeTab) && activeTab === 'overview' && (
              <div className="space-y-5 relative">

                {/* Ambient glow blobs — decorative depth layer */}
                <div className="pointer-events-none absolute -top-24 left-1/4 w-[500px] h-[500px] rounded-full bg-[#0763d8]/[0.04] blur-[130px]" />
                <div className="pointer-events-none absolute top-60 right-1/5 w-96 h-96 rounded-full bg-[#6366f1]/[0.04] blur-[110px]" />
                <div className="pointer-events-none absolute top-[900px] left-1/2 w-80 h-80 rounded-full bg-[#8b5cf6]/[0.03] blur-[100px]" />

                {/* ── Row 1: KPI Strip ── */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 overview-enter">
                  {statCards.map((card, idx) => {
                    const vals = card.data
                    const hasSeries = vals && vals.length > 0
                    const min = hasSeries ? Math.min(...vals) : 0
                    const max = hasSeries ? Math.max(...vals) : 1
                    const range = max - min || 1
                    const sparkPath = hasSeries
                      ? vals.map((v, i) => {
                          const x = (i / (vals.length - 1)) * 100
                          const y = 28 - ((v - min) / range) * 22
                          return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`
                        }).join(' ')
                      : ''
                    const areaPath = hasSeries
                      ? `M 0 32 L ${vals.map((v, i) => `${((i/(vals.length-1))*100).toFixed(1)},${(28-((v-min)/range)*22).toFixed(1)}`).join(' L ')} L 100 32 Z`
                      : ''
                    return (
                      <div key={card.label}
                        className="profile-kpi-card apple-glass p-4 flex flex-col gap-2 cursor-default"
                        style={{ animationDelay: `${idx * 0.07}s` }}
                      >
                        <div className="flex items-start justify-between">
                          <p className="text-[9px] font-bold tracking-[0.2em] text-white/35 uppercase">{card.label}</p>
                          {card.trend && (
                            <span className={`inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[9px] font-bold ${
                              card.trend === 'up' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-red-500/15 text-red-400'
                            }`}>
                              {card.trend === 'up' ? <TrendingUp className="w-2.5 h-2.5"/> : <TrendingDown className="w-2.5 h-2.5"/>}
                            </span>
                          )}
                        </div>
                        <p className="text-[1.6rem] font-extrabold text-white tracking-tight leading-none" style={{ textShadow: `0 0 24px ${card.color}40` }}>{card.value}</p>
                        {hasSeries ? (
                          <svg viewBox="0 0 100 32" preserveAspectRatio="none" className="w-full h-10 mt-auto">
                            <defs>
                              <linearGradient id={`kg${idx}`} x1="0" x2="0" y1="0" y2="1">
                                <stop offset="0%" stopColor={card.color} stopOpacity="0.5"/>
                                <stop offset="100%" stopColor={card.color} stopOpacity="0"/>
                              </linearGradient>
                            </defs>
                            <path d={areaPath} fill={`url(#kg${idx})`}/>
                            <path d={sparkPath} fill="none" stroke={card.color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        ) : (
                          <div className="mt-auto h-10 flex items-end">
                            <div className="w-full h-px rounded-full" style={{ background: `linear-gradient(to right, transparent, ${card.color}60, transparent)` }}/>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>

                {/* ── Row 2: About + Expertise  |  AdSpend chart ── */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 overview-enter overview-enter-delay-1">

                  {/* About + Expertise column */}
                  <div className="lg:col-span-2 flex flex-col gap-4">

                    {/* About card */}
                    <div className="apple-glass p-6 flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="w-1 h-4 rounded-full bg-[#0763d8]" style={{ boxShadow: '0 0 8px #0763d880' }}/>
                        <h2 className="text-[11px] font-bold text-white/70 uppercase tracking-[0.18em]">About</h2>
                      </div>
                      <p className="text-sm text-white/55 leading-relaxed">{company.about}</p>
                      <div className="mt-5 pt-4 border-t border-white/[0.05] grid grid-cols-2 gap-y-4">
                        {[
                          { label: 'Founded', value: String(company.founded) },
                          { label: 'Network',  value: company.network || 'Independent' },
                          { label: 'Employees', value: company.employees.toLocaleString() },
                          { label: 'Clients',   value: String(company.clients.length) },
                        ].map(m => (
                          <div key={m.label}>
                            <p className="text-[9px] font-bold text-white/25 uppercase tracking-[0.18em] mb-1">{m.label}</p>
                            <p className="text-base font-extrabold text-white">{m.value}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Expertise bars */}
                    <div className="apple-glass p-5">
                      <div className="flex items-center gap-2 mb-4">
                        <Zap className="w-3.5 h-3.5 text-[#0763d8]"/>
                        <h2 className="text-[11px] font-bold text-white/70 uppercase tracking-[0.18em]">Expertise</h2>
                      </div>
                      <div className="space-y-3.5">
                        {expertiseItems.map((e, i) => (
                          <div key={e.name}>
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="text-[11px] font-medium text-white/60">{e.name}</span>
                              <span className="text-[11px] font-bold text-white/40">{e.pct}%</span>
                            </div>
                            <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                              <div
                                className="h-full rounded-full skill-bar-fill"
                                style={{
                                  '--skill-w': `${e.pct}%`,
                                  '--delay': `${0.1 + i * 0.12}s`,
                                  background: `linear-gradient(to right, #0763d8, #6366f1)`,
                                  boxShadow: '0 0 8px rgba(7,99,216,0.5)',
                                } as React.CSSProperties}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* AdSpend bar chart */}
                  <div className="lg:col-span-3 apple-glass p-6 flex flex-col">
                    <div className="flex items-center justify-between mb-5">
                      <div className="flex items-center gap-2">
                        <BarChart2 className="w-4 h-4 text-[#0763d8]"/>
                        <h2 className="text-[11px] font-bold text-white/70 uppercase tracking-[0.18em]">AdSpend History (M€)</h2>
                      </div>
                      <div className="flex items-center gap-3 text-[10px] text-white/35">
                        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#0763d8] inline-block" style={{boxShadow:'0 0 5px #0763d880'}}/>Digital</span>
                        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#6366f1] inline-block" style={{boxShadow:'0 0 5px #6366f180'}}/>TV</span>
                        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#8b5cf6] inline-block" style={{boxShadow:'0 0 5px #8b5cf680'}}/>Print</span>
                      </div>
                    </div>
                    <div className="flex-1 w-full min-h-[160px]">
                      {(() => {
                        const allVals = adspendYears.map((_,i) => adspendDigital[i]+adspendTV[i]+adspendPrint[i])
                        const totalMax = Math.max(...allVals)
                        const bw = 13, gap = 3, gw = bw*3+gap*2, groupGap = 20
                        const chartW = adspendYears.length*(gw+groupGap)-groupGap
                        const chartH = 100
                        return (
                          <svg viewBox={`0 0 ${chartW} ${chartH+28}`} className="w-full h-full" preserveAspectRatio="xMidYMax meet">
                            <defs>
                              <linearGradient id="barGradD" x1="0" x2="0" y1="0" y2="1">
                                <stop offset="0%" stopColor="#0763d8" stopOpacity="1"/>
                                <stop offset="100%" stopColor="#0763d8" stopOpacity="0.5"/>
                              </linearGradient>
                              <linearGradient id="barGradT" x1="0" x2="0" y1="0" y2="1">
                                <stop offset="0%" stopColor="#6366f1" stopOpacity="1"/>
                                <stop offset="100%" stopColor="#6366f1" stopOpacity="0.5"/>
                              </linearGradient>
                              <linearGradient id="barGradP" x1="0" x2="0" y1="0" y2="1">
                                <stop offset="0%" stopColor="#8b5cf6" stopOpacity="1"/>
                                <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.5"/>
                              </linearGradient>
                            </defs>
                            {/* grid lines */}
                            {[0.25,0.5,0.75,1].map(t => (
                              <line key={t} x1={0} x2={chartW} y1={chartH*(1-t)} y2={chartH*(1-t)}
                                stroke="rgba(255,255,255,0.04)" strokeWidth="0.8"/>
                            ))}
                            {adspendYears.map((yr,i) => {
                              const x = i*(gw+groupGap)
                              const dH = Math.max(2,(adspendDigital[i]/totalMax)*chartH)
                              const tH = Math.max(2,(adspendTV[i]/totalMax)*chartH)
                              const pH = Math.max(2,(adspendPrint[i]/totalMax)*chartH)
                              return (
                                <g key={yr}>
                                  <rect x={x} y={chartH-dH} width={bw} height={dH} rx="2.5" fill="url(#barGradD)"/>
                                  <rect x={x+bw+gap} y={chartH-tH} width={bw} height={tH} rx="2.5" fill="url(#barGradT)"/>
                                  <rect x={x+2*(bw+gap)} y={chartH-pH} width={bw} height={pH} rx="2.5" fill="url(#barGradP)"/>
                                  <text x={x+gw/2} y={chartH+18} textAnchor="middle" fontSize="7.5" fill="rgba(255,255,255,0.25)">{yr}</text>
                                </g>
                              )
                            })}
                          </svg>
                        )
                      })()}
                    </div>
                  </div>
                </div>

                {/* ── Row 3: Campaigns  |  Awards + News ── */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 overview-enter overview-enter-delay-2">

                  {/* Campaigns */}
                  <div className="lg:col-span-3 apple-glass p-5">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Play className="w-3.5 h-3.5 text-[#0763d8]"/>
                        <h2 className="text-[11px] font-bold text-white/70 uppercase tracking-[0.18em]">Latest Work</h2>
                      </div>
                      <span className="text-[10px] text-white/30 bg-white/[0.04] px-2 py-0.5 rounded-full border border-white/[0.06]">{campaignsList.length} campaigns</span>
                    </div>
                    {campaignsList.length > 0 ? (
                      <div className="grid grid-cols-2 gap-3">
                        {campaignsList.slice(0,4).map(c => (
                          <div key={c.id} className="group relative rounded-xl overflow-hidden bg-black/20 border border-white/[0.05] cursor-pointer"
                            style={{ transition: 'border-color 0.3s, box-shadow 0.3s, transform 0.3s' }}
                            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor='rgba(7,99,216,0.4)'; (e.currentTarget as HTMLElement).style.boxShadow='0 8px 32px rgba(0,0,0,0.4),0 0 0 1px rgba(7,99,216,0.1)'; (e.currentTarget as HTMLElement).style.transform='translateY(-3px)' }}
                            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor='rgba(255,255,255,0.05)'; (e.currentTarget as HTMLElement).style.boxShadow='none'; (e.currentTarget as HTMLElement).style.transform='none' }}
                          >
                            <div className="aspect-video overflow-hidden">
                              <img src={c.thumbnail} alt={c.title}
                                className="w-full h-full object-cover opacity-75 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"/>
                            </div>
                            {/* play button overlay */}
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center"
                                style={{ boxShadow: '0 0 20px rgba(7,99,216,0.4)' }}>
                                <Play className="w-4 h-4 text-white fill-white ml-0.5"/>
                              </div>
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-[#02030E]/95 via-[#02030E]/20 to-transparent"/>
                            <div className="absolute bottom-0 left-0 right-0 p-3">
                              <p className="text-xs font-bold text-white line-clamp-1">{c.title}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-[9px] text-white/40 uppercase tracking-wide">{c.brand}</span>
                                {c.awardWins && c.awardWins > 0 && (
                                  <span className="inline-flex items-center gap-0.5 text-[9px] bg-[#f59e0b]/20 text-[#f59e0b] px-1.5 py-0.5 rounded-full border border-[#f59e0b]/20">
                                    <Trophy className="w-2.5 h-2.5"/>{c.awardWins}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-12 text-white/20">
                        <Play className="w-8 h-8 mb-2"/>
                        <p className="text-xs">No campaigns yet</p>
                      </div>
                    )}
                  </div>

                  {/* Awards + News stacked */}
                  <div className="lg:col-span-2 flex flex-col gap-4">

                    {/* Top awards */}
                    <div className="apple-glass p-5">
                      <div className="flex items-center gap-2 mb-4">
                        <Trophy className="w-3.5 h-3.5 text-[#f59e0b]"/>
                        <h2 className="text-[11px] font-bold text-white/70 uppercase tracking-[0.18em]">Top Awards</h2>
                        <span className="ml-auto text-[10px] font-bold award-shimmer">{company.awards} total</span>
                      </div>
                      {awardsList.length > 0 ? (
                        <div className="space-y-2.5">
                          {awardsList.slice(0,3).map((aw, i) => (
                            <div key={i} className="flex items-start gap-3 p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.05] hover:border-[#f59e0b]/20 hover:bg-[#f59e0b]/[0.02] transition-all duration-200">
                              <div className="w-7 h-7 rounded-lg bg-[#f59e0b]/10 border border-[#f59e0b]/20 flex items-center justify-center flex-shrink-0">
                                <Trophy className="w-3.5 h-3.5 text-[#f59e0b]"/>
                              </div>
                              <div className="min-w-0">
                                <p className="text-xs font-semibold text-white/80 line-clamp-1">{aw.title}</p>
                                <p className="text-[10px] text-white/30">{aw.festival || aw.campaign} · {aw.year}</p>
                              </div>
                              <span className="ml-auto flex-shrink-0 text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-[#f59e0b]/10 text-[#f59e0b] border border-[#f59e0b]/15">{aw.level}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-4">
                          <Trophy className="w-6 h-6 mx-auto mb-1 text-white/10"/>
                          <p className="text-[11px] text-white/25">{company.awards} awards on record</p>
                        </div>
                      )}
                    </div>

                    {/* News feed */}
                    <div className="apple-glass p-5 flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        <Activity className="w-3.5 h-3.5 text-[#0763d8]"/>
                        <h2 className="text-[11px] font-bold text-white/70 uppercase tracking-[0.18em]">Latest News</h2>
                      </div>
                      {agencyNews.length > 0 ? (
                        <div className="space-y-2">
                          {agencyNews.slice(0,3).map(a => (
                            <Link key={a.id} href={`/news/${a.id}`}
                              className="flex gap-3 group p-2 -mx-2 rounded-xl hover:bg-white/[0.04] transition-colors duration-200">
                              <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-white/[0.05]">
                                <img src={a.thumbnail} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"/>
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-[11px] font-semibold text-white/70 line-clamp-2 leading-tight group-hover:text-[#0763d8] transition-colors">{a.title}</p>
                                <p className="text-[9px] text-white/25 mt-0.5">{new Date(a.date).toLocaleDateString('en-GB',{day:'2-digit',month:'short'})}</p>
                              </div>
                            </Link>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-white/25 text-center py-4">No news found</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* ── Row 4: Client marquee ── */}
                {company.clients.length > 0 && (
                  <div className="apple-glass p-5 overflow-hidden overview-enter overview-enter-delay-3">
                    <div className="flex items-center gap-2 mb-4">
                      <Users className="w-3.5 h-3.5 text-[#0763d8]"/>
                      <h2 className="text-[11px] font-bold text-white/70 uppercase tracking-[0.18em]">Client Roster</h2>
                      <span className="ml-2 text-[10px] text-white/25">{company.clients.length} clients · hover to pause</span>
                    </div>
                    <div className="overflow-hidden">
                      <div className="marquee-inner gap-3">
                        {[...company.clients, ...company.clients].map((cl, i) => (
                          <div key={i} className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.06] hover:border-[#0763d8]/30 hover:bg-[#0763d8]/[0.06] transition-all duration-200 flex-shrink-0 cursor-default group">
                            <div className="w-7 h-7 rounded-lg bg-white/[0.08] border border-white/[0.08] flex items-center justify-center text-[10px] font-extrabold text-white/50 group-hover:text-[#0763d8] transition-colors">
                              {cl.split(' ').map((w: string) => w[0]).join('').slice(0,2).toUpperCase()}
                            </div>
                            <span className="text-[11px] font-semibold text-white/55 group-hover:text-white/80 transition-colors whitespace-nowrap">{cl}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* ── Row 5: Services + Sectors  |  Similar agencies ── */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 overview-enter overview-enter-delay-4">

                  {/* Services & Sectors */}
                  <div className="lg:col-span-2 apple-glass p-5 space-y-5">
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Zap className="w-3.5 h-3.5 text-[#0763d8]"/>
                        <h2 className="text-[11px] font-bold text-white/70 uppercase tracking-[0.18em]">Services</h2>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {company.services.map(s => (
                          <span key={s} className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-[#0763d8]/[0.08] text-[#0763d8] border border-[#0763d8]/20 hover:bg-[#0763d8]/[0.18] hover:border-[#0763d8]/40 transition-all duration-200 cursor-default">{s}</span>
                        ))}
                      </div>
                    </div>
                    <div className="pt-4 border-t border-white/[0.05]">
                      <div className="flex items-center gap-2 mb-3">
                        <Star className="w-3.5 h-3.5 text-white/25"/>
                        <h2 className="text-[11px] font-bold text-white/70 uppercase tracking-[0.18em]">Sectors</h2>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {company.sectors.map(s => (
                          <span key={s} className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-white/[0.03] text-white/45 border border-white/[0.07] hover:border-white/20 hover:text-white/70 hover:bg-white/[0.06] transition-all duration-200 cursor-default">{s}</span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Similar agencies */}
                  <div className="lg:col-span-3 apple-glass p-5">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-[11px] font-bold text-white/70 uppercase tracking-[0.18em]">Similar Agencies</h2>
                      <ChevronRight className="w-4 h-4 text-white/20"/>
                    </div>
                    <div className="grid grid-cols-3 gap-2.5">
                      {similarAgencies.slice(0,6).map(a => (
                        <Link key={a.id} href={`/directory/${a.id}`}
                          className="group relative bg-white/[0.03] border border-white/[0.05] rounded-xl p-3 text-center flex flex-col items-center gap-2 overflow-hidden transition-all duration-300"
                          style={{ backdropFilter:'blur(8px)' }}
                          onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor='rgba(7,99,216,0.35)'; el.style.background='rgba(7,99,216,0.05)'; el.style.transform='translateY(-3px)'; el.style.boxShadow='0 8px 24px rgba(0,0,0,0.3)' }}
                          onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor='rgba(255,255,255,0.05)'; el.style.background='rgba(255,255,255,0.03)'; el.style.transform='none'; el.style.boxShadow='none' }}
                        >
                          <div className="w-11 h-11 bg-white rounded-xl overflow-hidden flex items-center justify-center shadow-sm">
                            <img src={a.logo} alt={a.name} className="w-full h-full object-contain p-1.5"/>
                          </div>
                          <p className="text-[10px] font-bold text-white/60 group-hover:text-white/90 uppercase line-clamp-1 transition-colors">{a.name}</p>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* ════ CONTACTS ════ */}
            {!isTabLocked(activeTab) && activeTab === 'contacts' && (
              <div className="space-y-5 relative">
                <div className="pointer-events-none absolute -top-20 left-1/3 w-96 h-96 rounded-full bg-[#0763d8]/[0.04] blur-[120px]"/>
                <div className="flex items-center gap-2 mb-1 overview-enter">
                  <span className="w-1 h-4 rounded-full bg-[#0763d8]" style={{boxShadow:'0 0 8px #0763d880'}}/>
                  <h2 className="text-[11px] font-bold text-white/60 uppercase tracking-[0.18em]">Contacts</h2>
                </div>
                {company.contactsByDept && company.contactsByDept.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overview-enter overview-enter-delay-1">
                    {company.contactsByDept.map(dept => (
                      <div key={dept.department} className="apple-glass p-5">
                        <h3 className="text-[10px] font-extrabold text-[#0763d8] uppercase tracking-[0.2em] mb-4 pb-3 border-b border-white/[0.06]">{dept.department}</h3>
                        <div className="space-y-4">
                          {dept.contacts.map(c => (
                            <div key={c.name} className="flex items-center gap-3 p-2.5 -mx-2.5 rounded-xl hover:bg-white/[0.04] transition-colors duration-200 group">
                              <div className="w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center text-[11px] font-extrabold text-[#0763d8] border border-[#0763d8]/25"
                                style={{background:'rgba(7,99,216,0.08)'}}>
                                {c.name.split(' ').map((n: string) => n[0]).join('')}
                              </div>
                              <div className="min-w-0">
                                <p className="text-sm font-bold text-white/90">{c.name}</p>
                                <p className="text-[11px] text-white/35">{c.role}</p>
                                {c.email && <a href={`mailto:${c.email}`} className="text-[11px] text-[#0763d8] hover:text-[#3b8aff] transition-colors">{c.email}</a>}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : teamMembers.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 overview-enter overview-enter-delay-1">
                    {teamMembers.map(p => (
                      <div key={p.id} className="apple-glass p-5 text-center group"
                        onMouseEnter={e=>{const el=e.currentTarget as HTMLElement;el.style.transform='translateY(-3px)'}}
                        onMouseLeave={e=>{const el=e.currentTarget as HTMLElement;el.style.transform='none'}}>
                        <div className="w-16 h-16 rounded-full mx-auto mb-3 overflow-hidden ring-2 ring-white/[0.08] group-hover:ring-[#0763d8]/30 transition-all">
                          <img src={p.photo} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"/>
                        </div>
                        <h3 className="text-sm font-bold text-white mb-0.5">{p.name}</h3>
                        <p className="text-xs text-[#0763d8]">{p.role}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="apple-glass p-12 text-center overview-enter">
                    <Users className="w-10 h-10 mx-auto mb-3 text-white/10"/>
                    <p className="text-sm text-white/30">No contact information available yet.</p>
                  </div>
                )}
              </div>
            )}

            {/* ════ TURNOVER & CLIENTS ════ */}
            {!isTabLocked(activeTab) && activeTab === 'turnover' && (
              <div className="space-y-5 relative">
                <div className="pointer-events-none absolute -top-20 right-1/4 w-96 h-96 rounded-full bg-[#6366f1]/[0.04] blur-[120px]"/>
                {/* KPI strip */}
                <section className="overview-enter">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-1 h-4 rounded-full bg-[#0763d8]" style={{boxShadow:'0 0 8px #0763d880'}}/>
                    <h2 className="text-[11px] font-bold text-white/60 uppercase tracking-[0.18em]">Financial Snapshot</h2>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                    {statCards.map((card, idx) => {
                      const vals = card.data
                      const hasSeries = vals && vals.length > 0
                      const min = hasSeries ? Math.min(...vals) : 0
                      const max = hasSeries ? Math.max(...vals) : 1
                      const range = max - min || 1
                      const sp = hasSeries ? vals.map((v,i)=>`${i===0?'M':'L'} ${((i/(vals.length-1))*100).toFixed(1)} ${(26-((v-min)/range)*18).toFixed(1)}`).join(' ') : ''
                      const ap = hasSeries ? `M 0 32 L ${vals.map((v,i)=>`${((i/(vals.length-1))*100).toFixed(1)},${(26-((v-min)/range)*18).toFixed(1)}`).join(' L ')} L 100 32 Z` : ''
                      return (
                        <div key={card.label} className="apple-glass p-4 flex flex-col gap-2 cursor-default"
                          style={{transition:'transform 0.3s,box-shadow 0.3s'}}
                          onMouseEnter={e=>{const el=e.currentTarget as HTMLElement;el.style.transform='translateY(-2px)';el.style.boxShadow=`0 8px 32px rgba(0,0,0,0.3),0 0 0 1px ${card.color}20`}}
                          onMouseLeave={e=>{const el=e.currentTarget as HTMLElement;el.style.transform='none';el.style.boxShadow=''}}>
                          <div className="flex items-center justify-between">
                            <p className="text-[9px] font-bold tracking-[0.2em] text-white/35 uppercase">{card.label}</p>
                            {card.trend && (
                              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${card.trend==='up'?'bg-emerald-500/15 text-emerald-400':'bg-red-500/15 text-red-400'}`}>
                                {card.trend==='up'?'↑ YoY':'↓ YoY'}
                              </span>
                            )}
                          </div>
                          <p className="text-2xl font-extrabold text-white" style={{textShadow:`0 0 20px ${card.color}40`}}>{card.value}</p>
                          {hasSeries ? (
                            <svg viewBox="0 0 100 32" preserveAspectRatio="none" className="w-full h-10 mt-auto">
                              <defs>
                                <linearGradient id={`tg${idx}`} x1="0" x2="0" y1="0" y2="1">
                                  <stop offset="0%" stopColor={card.color} stopOpacity="0.5"/>
                                  <stop offset="100%" stopColor={card.color} stopOpacity="0"/>
                                </linearGradient>
                              </defs>
                              <path d={ap} fill={`url(#tg${idx})`}/>
                              <path d={sp} fill="none" stroke={card.color} strokeWidth="1.8" strokeLinecap="round"/>
                            </svg>
                          ) : (
                            <div className="mt-auto h-px rounded-full" style={{background:`linear-gradient(to right,transparent,${card.color}60,transparent)`}}/>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </section>

                {/* Clients grid */}
                <section className="overview-enter overview-enter-delay-1">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-1 h-4 rounded-full bg-[#6366f1]" style={{boxShadow:'0 0 8px #6366f180'}}/>
                    <h2 className="text-[11px] font-bold text-white/60 uppercase tracking-[0.18em]">Clients <span className="text-white/25 font-medium">({company.clients.length})</span></h2>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {company.clients.map((client, i) => {
                      const sector = company.clientIndustries?.[i % (company.clientIndustries?.length || 1)] || null
                      return (
                        <div key={client} className="apple-glass p-4 group"
                          style={{transition:'transform 0.25s,border-color 0.25s,box-shadow 0.25s'}}
                          onMouseEnter={e=>{const el=e.currentTarget as HTMLElement;el.style.transform='translateY(-2px)';el.style.borderColor='rgba(7,99,216,0.35)';el.style.boxShadow='0 8px 24px rgba(0,0,0,0.25)'}}
                          onMouseLeave={e=>{const el=e.currentTarget as HTMLElement;el.style.transform='none';el.style.borderColor='';el.style.boxShadow=''}}>
                          <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-3 text-[11px] font-extrabold text-[#0763d8] border border-[#0763d8]/20 group-hover:border-[#0763d8]/40 transition-colors" style={{background:'rgba(7,99,216,0.08)'}}>
                            {client.split(' ').map((w: string)=>w[0]).join('').substring(0,2).toUpperCase()}
                          </div>
                          <p className="text-sm font-bold text-white/90 mb-1">{client}</p>
                          {sector && <span className="text-[10px] bg-white/[0.05] text-white/35 px-2 py-0.5 rounded-full border border-white/[0.06]">{sector}</span>}
                        </div>
                      )
                    })}
                  </div>
                </section>
              </div>
            )}

            {/* ════ COMPETENCIES ════ */}
            {!isTabLocked(activeTab) && activeTab === 'competencies' && (
              <div className="space-y-5 relative">
                <div className="pointer-events-none absolute -top-20 left-1/4 w-96 h-96 rounded-full bg-[#8b5cf6]/[0.04] blur-[120px]"/>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 overview-enter">
                  {/* Services */}
                  <div className="apple-glass p-6">
                    <div className="flex items-center gap-2 mb-5">
                      <Zap className="w-3.5 h-3.5 text-[#0763d8]"/>
                      <h2 className="text-[11px] font-bold text-white/60 uppercase tracking-[0.18em]">Services</h2>
                    </div>
                    <div className="space-y-3">
                      {expertiseItems.map((e, i) => (
                        <div key={e.name}>
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-sm font-semibold text-white/75">{e.name}</span>
                            <span className="text-xs font-bold text-white/35">{e.pct}%</span>
                          </div>
                          <div className="h-2 rounded-full bg-white/[0.05] overflow-hidden">
                            <div className="h-full rounded-full skill-bar-fill"
                              style={{'--skill-w':`${e.pct}%`,'--delay':`${0.08+i*0.1}s`,background:'linear-gradient(to right,#0763d8,#6366f1)',boxShadow:'0 0 10px rgba(7,99,216,0.4)'} as React.CSSProperties}/>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-5 pt-4 border-t border-white/[0.05]">
                      <div className="flex flex-wrap gap-1.5">
                        {company.services.map(s => (
                          <span key={s} className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-[#0763d8]/[0.08] text-[#0763d8] border border-[#0763d8]/20 hover:bg-[#0763d8]/[0.18] hover:border-[#0763d8]/40 transition-all duration-200 cursor-default">{s}</span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Sectors */}
                  <div className="apple-glass p-6">
                    <div className="flex items-center gap-2 mb-5">
                      <Star className="w-3.5 h-3.5 text-white/30"/>
                      <h2 className="text-[11px] font-bold text-white/60 uppercase tracking-[0.18em]">Sectors</h2>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {company.sectors.map((s, i) => {
                        const pct = Math.round(seededData(company.id + s, 1, 40, 95)[0])
                        return (
                          <div key={s} className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.05] hover:border-[#8b5cf6]/25 hover:bg-[#8b5cf6]/[0.04] transition-all duration-200 group">
                            <div className="flex items-center justify-between mb-2">
                              <p className="text-[11px] font-semibold text-white/70 group-hover:text-white/90 transition-colors">{s}</p>
                              <span className="text-[10px] text-white/30">{pct}%</span>
                            </div>
                            <div className="h-1.5 rounded-full bg-white/[0.05] overflow-hidden">
                              <div className="h-full rounded-full skill-bar-fill"
                                style={{'--skill-w':`${pct}%`,'--delay':`${0.1+i*0.06}s`,background:'linear-gradient(to right,#8b5cf6,#6366f1)'} as React.CSSProperties}/>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>

                {/* Competencies tags — full width */}
                {company.competencies && company.competencies.length > 0 && (
                  <div className="apple-glass p-6 overview-enter overview-enter-delay-1">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="w-1 h-4 rounded-full bg-[#8b5cf6]" style={{boxShadow:'0 0 8px #8b5cf680'}}/>
                      <h2 className="text-[11px] font-bold text-white/60 uppercase tracking-[0.18em]">Competencies</h2>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {company.competencies.map(c => (
                        <span key={c} className="px-3 py-1.5 rounded-full text-[11px] font-medium bg-[#8b5cf6]/[0.08] text-[#8b5cf6] border border-[#8b5cf6]/20 hover:bg-[#8b5cf6]/[0.18] transition-all duration-200 cursor-default">{c}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ════ GOVERNANCE ════ */}
            {!isTabLocked(activeTab) && activeTab === 'governance' && (
              <div className="space-y-5 relative">
                <div className="pointer-events-none absolute -top-20 right-1/3 w-96 h-96 rounded-full bg-[#0763d8]/[0.04] blur-[120px]"/>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 overview-enter">
                  <div className="lg:col-span-2 apple-glass p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="w-1 h-4 rounded-full bg-[#0763d8]" style={{boxShadow:'0 0 8px #0763d880'}}/>
                      <h2 className="text-[11px] font-bold text-white/60 uppercase tracking-[0.18em]">Governance & SOW</h2>
                    </div>
                    <p className="text-sm text-white/55 leading-relaxed">{company.about}</p>
                  </div>
                  <div className="space-y-3">
                    {[
                      { label: 'Network',     value: company.network || 'Independent', color: '#0763d8' },
                      { label: 'Founded',     value: String(company.founded),          color: '#6366f1' },
                      { label: 'Employees',   value: company.employees.toLocaleString(), color: '#8b5cf6' },
                      { label: 'HQ',          value: `${company.city}, ${company.country}`, color: '#f59e0b' },
                    ].map(m => (
                      <div key={m.label} className="apple-glass p-4 flex items-center gap-3"
                        style={{transition:'transform 0.25s'}}
                        onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.transform='translateY(-2px)'}}
                        onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.transform='none'}}>
                        <div className="w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center" style={{background:`${m.color}15`,border:`1px solid ${m.color}25`}}>
                          <span className="w-2 h-2 rounded-full" style={{background:m.color,boxShadow:`0 0 6px ${m.color}80`}}/>
                        </div>
                        <div>
                          <p className="text-[9px] font-bold text-white/30 uppercase tracking-[0.18em]">{m.label}</p>
                          <p className="text-sm font-bold text-white/85">{m.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 overview-enter overview-enter-delay-1">
                  <div className="apple-glass p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="w-1 h-4 rounded-full bg-[#6366f1]" style={{boxShadow:'0 0 8px #6366f180'}}/>
                      <h2 className="text-[11px] font-bold text-white/60 uppercase tracking-[0.18em]">Philosophy</h2>
                    </div>
                    <p className="text-sm text-white/50 leading-relaxed">Information and governance philosophy provided by the agency upon registration and verification.</p>
                  </div>
                  <div className="apple-glass p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="w-1 h-4 rounded-full bg-[#8b5cf6]" style={{boxShadow:'0 0 8px #8b5cf680'}}/>
                      <h2 className="text-[11px] font-bold text-white/60 uppercase tracking-[0.18em]">Scope of Work</h2>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {company.services.slice(0,6).map(s => (
                        <span key={s} className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-[#8b5cf6]/[0.08] text-[#8b5cf6] border border-[#8b5cf6]/20 cursor-default">{s}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ════ PEOPLE & TALENT ════ */}
            {!isTabLocked(activeTab) && activeTab === 'people' && (
              <div className="space-y-5 relative">
                <div className="pointer-events-none absolute -top-20 left-1/4 w-96 h-96 rounded-full bg-[#0763d8]/[0.04] blur-[120px]"/>
                <div className="flex items-center gap-2 overview-enter">
                  <span className="w-1 h-4 rounded-full bg-[#0763d8]" style={{boxShadow:'0 0 8px #0763d880'}}/>
                  <h2 className="text-[11px] font-bold text-white/60 uppercase tracking-[0.18em]">People & Talent</h2>
                  <span className="ml-2 text-[10px] text-white/25 bg-white/[0.04] px-2 py-0.5 rounded-full border border-white/[0.06]">{company.employees} employees</span>
                </div>
                {teamMembers.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 overview-enter overview-enter-delay-1">
                    {teamMembers.map(p => (
                      <div key={p.id} className="apple-glass p-5 text-center group"
                        style={{transition:'transform 0.3s,box-shadow 0.3s'}}
                        onMouseEnter={e=>{const el=e.currentTarget as HTMLElement;el.style.transform='translateY(-4px)';el.style.boxShadow='0 12px 40px rgba(0,0,0,0.35),0 0 0 1px rgba(7,99,216,0.15)'}}
                        onMouseLeave={e=>{const el=e.currentTarget as HTMLElement;el.style.transform='none';el.style.boxShadow=''}}>
                        <div className="w-16 h-16 rounded-full mx-auto mb-3 overflow-hidden ring-2 ring-white/[0.07] group-hover:ring-[#0763d8]/30 transition-all duration-300 relative">
                          <img src={p.photo} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"/>
                        </div>
                        <h3 className="text-sm font-bold text-white mb-0.5">{p.name}</h3>
                        <p className="text-[11px] text-[#0763d8]/80">{p.role}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="apple-glass p-12 text-center overview-enter">
                    <div className="w-16 h-16 rounded-full bg-white/[0.04] border border-white/[0.06] flex items-center justify-center mx-auto mb-4">
                      <Users className="w-7 h-7 text-white/15"/>
                    </div>
                    <p className="text-sm font-semibold text-white/40">People data provided after registration</p>
                    <p className="text-xs text-white/20 mt-1">{company.employees.toLocaleString()} employees on record</p>
                  </div>
                )}
              </div>
            )}

            {/* ════ AWARDS ════ */}
            {!isTabLocked(activeTab) && activeTab === 'awards' && (
              <div className="space-y-5 relative">
                <div className="pointer-events-none absolute -top-20 right-1/3 w-96 h-96 rounded-full bg-[#f59e0b]/[0.04] blur-[130px]"/>
                <div className="flex items-center justify-between overview-enter">
                  <div className="flex items-center gap-2">
                    <Trophy className="w-3.5 h-3.5 text-[#f59e0b]"/>
                    <h2 className="text-[11px] font-bold text-white/60 uppercase tracking-[0.18em]">Awards</h2>
                  </div>
                  <span className="text-sm font-extrabold award-shimmer">{company.awards} total</span>
                </div>
                {awardsList.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overview-enter overview-enter-delay-1">
                    {awardsList.map((award, i) => (
                      <div key={i} className="apple-glass p-4 group"
                        style={{transition:'transform 0.3s,border-color 0.3s,box-shadow 0.3s'}}
                        onMouseEnter={e=>{const el=e.currentTarget as HTMLElement;el.style.transform='translateY(-3px)';el.style.borderColor='rgba(245,158,11,0.3)';el.style.boxShadow='0 8px 32px rgba(0,0,0,0.3),0 0 0 1px rgba(245,158,11,0.08)'}}
                        onMouseLeave={e=>{const el=e.currentTarget as HTMLElement;el.style.transform='none';el.style.borderColor='';el.style.boxShadow=''}}>
                        <div className="flex items-start gap-3">
                          <div className="w-9 h-9 rounded-xl flex-shrink-0 flex items-center justify-center" style={{background:'rgba(245,158,11,0.1)',border:'1px solid rgba(245,158,11,0.2)'}}>
                            <Trophy className="w-4 h-4 text-[#f59e0b]"/>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-white/90 line-clamp-1">{award.title}</p>
                            <p className="text-[11px] text-white/35 mt-0.5">{award.campaign || award.festival} · {award.year}</p>
                            <span className="inline-block mt-2 text-[10px] font-bold px-2 py-0.5 rounded-full border" style={{background:'rgba(245,158,11,0.1)',color:'#f59e0b',borderColor:'rgba(245,158,11,0.2)'}}>{award.level}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="apple-glass p-12 text-center overview-enter">
                    <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{background:'rgba(245,158,11,0.08)',border:'1px solid rgba(245,158,11,0.15)'}}>
                      <Trophy className="w-7 h-7 text-[#f59e0b]/40"/>
                    </div>
                    <p className="text-sm font-semibold text-white/40">Awards data provided after registration</p>
                    <p className="text-xs text-white/20 mt-1">{company.awards} awards on record</p>
                  </div>
                )}
              </div>
            )}

            {/* ════ ADD-ON ════ */}
            {!isTabLocked(activeTab) && activeTab === 'add-on' && (
              <div className="space-y-5 relative">
                <div className="pointer-events-none absolute -top-20 left-1/3 w-96 h-96 rounded-full bg-[#0763d8]/[0.04] blur-[120px]"/>

                {/* Creative Work */}
                <section className="overview-enter">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Play className="w-3.5 h-3.5 text-[#0763d8]"/>
                      <h2 className="text-[11px] font-bold text-white/60 uppercase tracking-[0.18em]">Creative Work</h2>
                    </div>
                    <span className="text-[10px] text-white/25 bg-white/[0.04] px-2 py-0.5 rounded-full border border-white/[0.06]">{campaignsList.length} campaigns</span>
                  </div>
                  {campaignsList.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {campaignsList.slice(0, 6).map(c => (
                        <div key={c.id} className="apple-glass overflow-hidden group"
                          style={{transition:'transform 0.3s,border-color 0.3s,box-shadow 0.3s'}}
                          onMouseEnter={e=>{const el=e.currentTarget as HTMLElement;el.style.transform='translateY(-3px)';el.style.borderColor='rgba(7,99,216,0.35)';el.style.boxShadow='0 12px 40px rgba(0,0,0,0.35)'}}
                          onMouseLeave={e=>{const el=e.currentTarget as HTMLElement;el.style.transform='none';el.style.borderColor='';el.style.boxShadow=''}}>
                          <div className="aspect-video overflow-hidden relative">
                            <img src={c.thumbnail} alt={c.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"/>
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center" style={{boxShadow:'0 0 20px rgba(7,99,216,0.4)'}}>
                                <Play className="w-4 h-4 text-white fill-white ml-0.5"/>
                              </div>
                            </div>
                          </div>
                          <div className="p-4">
                            <p className="text-sm font-bold text-white/90">&lsquo;{c.title}&rsquo;</p>
                            <div className="flex items-center gap-2 mt-1.5">
                              <span className="text-[10px] font-bold text-white/50 uppercase tracking-wide">{c.brand}</span>
                              <span className="text-white/20">·</span>
                              <span className="text-[10px] text-white/30">{c.year}</span>
                              {c.awardWins && c.awardWins > 0 && (
                                <span className="ml-auto inline-flex items-center gap-0.5 text-[10px] px-1.5 py-0.5 rounded-full" style={{background:'rgba(245,158,11,0.12)',color:'#f59e0b',border:'1px solid rgba(245,158,11,0.2)'}}>
                                  <Trophy className="w-2.5 h-2.5"/>{c.awardWins}
                                </span>
                              )}
                            </div>
                            <p className="text-[10px] text-white/25 mt-1">{c.format.join(', ')}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="apple-glass p-10 text-center">
                      <Play className="w-8 h-8 mx-auto mb-2 text-white/10"/>
                      <p className="text-sm text-white/30">No campaigns available yet.</p>
                    </div>
                  )}
                </section>

                {/* News */}
                <section className="overview-enter overview-enter-delay-1">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Activity className="w-3.5 h-3.5 text-[#0763d8]"/>
                      <h2 className="text-[11px] font-bold text-white/60 uppercase tracking-[0.18em]">News</h2>
                    </div>
                    <span className="text-[10px] text-white/25 bg-white/[0.04] px-2 py-0.5 rounded-full border border-white/[0.06]">{agencyNews.length} articles</span>
                  </div>
                  {agencyNews.length > 0 ? (
                    <div className="apple-glass divide-y divide-white/[0.04] overflow-hidden">
                      {agencyNews.slice(0, 5).map(article => (
                        <Link key={article.id} href={`/news/${article.id}`}
                          className="flex gap-4 p-4 hover:bg-white/[0.03] transition-colors group">
                          <div className="w-14 h-14 rounded-xl flex-shrink-0 overflow-hidden bg-white/[0.05]">
                            <img src={article.thumbnail} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"/>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-bold text-white/85 group-hover:text-[#0763d8] transition-colors line-clamp-1">{article.title}</h3>
                            <p className="text-xs text-white/30 mt-1 line-clamp-1">{article.excerpt}</p>
                          </div>
                          <div className="text-[10px] text-white/20 flex-shrink-0 whitespace-nowrap self-center">{new Date(article.date).toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'})}</div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="apple-glass p-10 text-center">
                      <p className="text-sm text-white/30">No news articles found.</p>
                    </div>
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
