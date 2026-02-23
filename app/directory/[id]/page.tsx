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
  Share2, Bookmark, Star, ArrowUpRight, ArrowDownRight,
} from 'lucide-react'
import { useParams } from 'next/navigation'

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

/* ──────────── SVG multi-line chart for New-Business ──────────── */
function TrendChart({ data, categories, colors, width = 520, height = 180 }: {
  data: { year: string; values: Record<string, number> }[]
  categories: string[]
  colors: Record<string, string>
  width?: number
  height?: number
}) {
  if (data.length < 2) return null
  const allVals = data.flatMap(d => Object.values(d.values))
  const maxV = Math.max(...allVals, 1)
  const pad = { t: 10, r: 10, b: 24, l: 32 }
  const cw = width - pad.l - pad.r
  const ch = height - pad.t - pad.b
  const xStep = cw / (data.length - 1)
  const gridLines = [0, 0.25, 0.5, 0.75, 1]

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full" preserveAspectRatio="xMidYMid meet">
      {gridLines.map((f, i) => {
        const y = pad.t + ch * (1 - f)
        return <g key={i}><line x1={pad.l} x2={width - pad.r} y1={y} y2={y} stroke="#eee" strokeWidth="1" /><text x={pad.l - 4} y={y + 3} textAnchor="end" fill="#999" fontSize="9">{Math.round(maxV * f)}</text></g>
      })}
      {data.map((d, i) => {
        const x = pad.l + i * xStep
        return i % Math.ceil(data.length / 8) === 0 || i === data.length - 1
          ? <text key={i} x={x} y={height - 4} textAnchor="middle" fill="#999" fontSize="9">{d.year}</text>
          : null
      })}
      {categories.map(cat => {
        const pts = data.map((d, i) => {
          const x = pad.l + i * xStep
          const y = pad.t + ch * (1 - (d.values[cat] || 0) / maxV)
          return `${x},${y}`
        }).join(' ')
        return <polyline key={cat} fill="none" stroke={colors[cat] || '#999'} strokeWidth="2" strokeLinejoin="round" points={pts} />
      })}
    </svg>
  )
}

/* ──────────── stacked bar chart for AdSpend ──────────── */
function StackedBarChart({ data, width = 280, height = 200 }: {
  data: { year: string; values: Record<string, number> }[]
  width?: number
  height?: number
}) {
  const categories = [...new Set(data.flatMap(d => Object.keys(d.values)))]
  const catColors: Record<string, string> = {
    Digital: '#6366f1', TV: '#a78bfa', Print: '#c4b5fd', Radio: '#e9d5ff', OOH: '#d8b4fe', Cinema: '#f0abfc'
  }
  const maxTotal = Math.max(...data.map(d => Object.values(d.values).reduce((a, b) => a + b, 0)), 1)
  const pad = { t: 10, r: 10, b: 22, l: 32 }
  const cw = width - pad.l - pad.r
  const ch = height - pad.t - pad.b
  const barW = Math.min(24, cw / data.length - 4)

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full" preserveAspectRatio="xMidYMid meet">
      {[0, 0.5, 1].map((f, i) => {
        const y = pad.t + ch * (1 - f)
        return <g key={i}><line x1={pad.l} x2={width - pad.r} y1={y} y2={y} stroke="#eee" strokeWidth="1" /><text x={pad.l - 4} y={y + 3} textAnchor="end" fill="#999" fontSize="8">{(maxTotal * f).toFixed(0)}</text></g>
      })}
      {data.map((d, i) => {
        const x = pad.l + (i / (data.length - 1)) * cw - barW / 2
        let cumY = 0
        const total = Object.values(d.values).reduce((a, b) => a + b, 0)
        return (
          <g key={i}>
            {categories.map(cat => {
              const val = d.values[cat] || 0
              const barH = (val / maxTotal) * ch
              const y = pad.t + ch - cumY - barH
              cumY += barH
              return <rect key={cat} x={x} y={y} width={barW} height={barH} fill={catColors[cat] || '#cbd5e1'} rx="1" />
            })}
            <text x={x + barW / 2} y={height - 4} textAnchor="middle" fill="#999" fontSize="8">{d.year}</text>
          </g>
        )
      })}
    </svg>
  )
}

/* ──────────── mock sparkline/chart data generators (deterministic) ──────────── */
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

export default function CompanyProfilePage() {
  const params = useParams()
  const id = params.id as string
  const company = getCompanyById(id)

  const [activeTab, setActiveTab] = useState('overview')
  const [contactView, setContactView] = useState<'department' | 'list'>('department')
  const [clientFilter, setClientFilter] = useState('All')
  const [businessStatusFilter, setBusinessStatusFilter] = useState('All')
  const [formatFilter, setFormatFilter] = useState('All')
  const [newsSearch, setNewsSearch] = useState('')

  if (!company) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-serif font-bold mb-2">Agency not found</h1>
            <Link href="/directory" className="text-accent hover:underline">Back to Directory</Link>
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
  const allFormats = [...new Set(campaignsList.flatMap(c => c.format))]
  const clientSectors = company.clientIndustries && company.clientIndustries.length > 0 ? ['All', ...company.clientIndustries] : ['All']

  const tabs = [
    { id: 'overview',     label: 'Overview',     count: null },
    { id: 'contacts',     label: 'Contacts',     count: allContacts.length || teamMembers.length },
    { id: 'clients',      label: 'Clients',      count: company.clients.length },
    { id: 'new-business', label: 'New Business',  count: company.newBusinessWins?.length || 0 },
    { id: 'work',         label: 'Work',          count: campaignsList.length },
    { id: 'news',         label: 'News',          count: agencyNews.length },
  ]

  const filteredBusiness = company.newBusinessWins?.filter(w => businessStatusFilter === 'All' ? true : w.status === businessStatusFilter) || []
  const filteredCampaigns = formatFilter === 'All' ? campaignsList : campaignsList.filter(c => c.format.includes(formatFilter))
  const filteredClients = clientFilter === 'All' ? company.clients : company.clients.filter((_c, i) => {
    if (!company.clientIndustries || company.clientIndustries.length === 0) return true
    return company.clientIndustries[i % company.clientIndustries.length] === clientFilter
  })
  const filteredNews = newsSearch ? agencyNews.filter(a => a.title.toLowerCase().includes(newsSearch.toLowerCase()) || a.excerpt.toLowerCase().includes(newsSearch.toLowerCase())) : agencyNews

  // Sparkline data (deterministic from company id)
  const revenueData = seededData(company.id + 'rev', 12, 200, 500)
  const employeeData = seededData(company.id + 'emp', 12, 100, company.employees)
  const awardsData = seededData(company.id + 'awd', 12, 5, company.awards)

  // New Business trend chart data
  const bizTypeColors: Record<string, string> = {
    Creative: '#4fc487', Digital: '#4a90d9', 'Social Media': '#e67e22', 'Media Planning': '#9b59b6', PR: '#e74c3c',
    Events: '#f39c12', 'Website / E-commerce': '#1abc9c', 'Influencer Marketing': '#e91e63', 'Brand Identity': '#00bcd4',
  }
  const bizTypes = [...new Set(company.newBusinessWins?.map(w => w.type) || [])]
  const trendYears = ['2019','2020','2021','2022','2023','2024','2025']
  const trendData = trendYears.map((yr, yi) => {
    const values: Record<string, number> = {}
    bizTypes.forEach((t, ti) => {
      const d = seededData(company.id + t + yr, 1, 0, 80 + yi * 10)
      values[t] = Math.round(d[0])
    })
    return { year: yr, values }
  })

  // AdSpend bar chart data
  const adSpendYears = ['2019','2020','2021','2022','2023','2024']
  const adSpendData = adSpendYears.map(yr => ({
    year: yr,
    values: {
      Digital: Math.round(seededData(company.id + 'dig' + yr, 1, 200, 800)[0]),
      TV: Math.round(seededData(company.id + 'tv' + yr, 1, 100, 500)[0]),
      Print: Math.round(seededData(company.id + 'pr' + yr, 1, 50, 200)[0]),
    }
  }))

  const statCards = [
    { label: 'REVENUE', value: company.turnover || 'N/A',  trend: 'up' as const,   color: '#4fc487', data: revenueData },
    { label: 'EBITDA',  value: company.turnover ? `${parseInt(company.turnover.replace(/[^0-9]/g, '')) * 0.15 | 0}M` : 'N/A', trend: 'up' as const, color: '#4a90d9', data: seededData(company.id + 'ebitda', 12, 30, 100) },
    { label: 'EMPLOYEES', value: company.employees.toLocaleString(), trend: 'down' as const, color: '#e74c3c', data: employeeData },
    { label: 'FOUNDED',   value: String(company.founded), trend: null, color: '#9b59b6', data: [] },
    { label: 'AWARDS',    value: String(company.awards),  trend: 'up' as const,   color: '#e67e22', data: awardsData },
  ]

  return (
    <div className="min-h-screen bg-[#f5f6fa] flex flex-col">
      <Header />
      <main className="flex-1">
        {/* ═══════ COMPACT HEADER ═══════ */}
        <div className="bg-white border-b-2 border-[#e8e8f0]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
            <div className="flex gap-5 items-start">
              {/* Logo */}
              <div className="w-20 h-20 bg-white rounded border border-[#e0e0e8] flex-shrink-0 flex items-center justify-center overflow-hidden">
                <img src={company.logo} alt={company.name} className="w-full h-full object-contain p-2" />
              </div>
              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <h1 className="text-lg font-bold text-[#1a1a2e] uppercase tracking-wide">{company.name}</h1>
                  <Star className="w-4 h-4 text-[#bbb]" />
                </div>
                <p className="text-sm text-[#666] mb-0.5">{company.services[0]} <span className="text-[#bbb] mx-1">🔍</span></p>
                <p className="text-sm text-[#666] mb-0.5">{company.address || company.city}, {company.postcode} {company.city} ({company.country})</p>
                <div className="flex flex-wrap items-center gap-x-3 text-sm text-[#666] mb-1">
                  {company.vatNumber && <span>P.IVA: {company.vatNumber}</span>}
                  {company.phone && <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" />{company.phone}</span>}
                  {company.website && <a href={`https://${company.website}`} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-accent hover:underline"><Globe className="w-3.5 h-3.5" />https://{company.website}</a>}
                </div>
                {/* Badge pills */}
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {(company.typeTags || company.competencies || []).map(tag => {
                    const cm: Record<string,string> = { 'Full Service':'bg-[#e8f5e9] text-[#2e7d32]','Digital':'bg-[#e3f2fd] text-[#1565c0]','Independent':'bg-[#f3e5f5] text-[#7b1fa2]','Creative':'bg-[#fce4ec] text-[#c62828]','Content':'bg-[#e0f2f1] text-[#00695c]','PR':'bg-[#fff3e0] text-[#e65100]','Luxury':'bg-[#fff8e1] text-[#f57f17]','Brand Strategy':'bg-[#e8eaf6] text-[#283593]','Brand Consulting':'bg-[#e8eaf6] text-[#283593]','Integrated':'bg-[#ede7f6] text-[#4527a0]' }
                    return <span key={tag} className={`text-[10px] px-2.5 py-1 rounded font-semibold uppercase tracking-wider ${cm[tag] || 'bg-gray-100 text-gray-600'}`}>{tag}</span>
                  })}
                  <span className="text-[10px] px-2.5 py-1 rounded font-semibold uppercase tracking-wider bg-[#e3f2fd] text-[#1565c0]">Est. {company.founded}</span>
                  {company.network && <span className="text-[10px] px-2.5 py-1 rounded font-semibold uppercase tracking-wider bg-[#f3e5f5] text-[#7b1fa2]">{company.network}</span>}
                </div>
              </div>
              {/* Right: Social + Actions */}
              <div className="flex flex-col items-end gap-3 flex-shrink-0">
                <div className="flex items-center gap-2">
                  {company.socialLinks?.twitter && <a href={company.socialLinks.twitter} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-[#1a1a2e] text-white flex items-center justify-center hover:opacity-80"><Twitter className="w-4 h-4" /></a>}
                  {company.socialLinks?.linkedin && <a href={company.socialLinks.linkedin} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-[#0077b5] text-white flex items-center justify-center hover:opacity-80"><Linkedin className="w-4 h-4" /></a>}
                  {company.socialLinks?.instagram && <a href={company.socialLinks.instagram} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#f09433] via-[#e6683c] to-[#bc1888] text-white flex items-center justify-center hover:opacity-80"><Instagram className="w-4 h-4" /></a>}
                  {company.website && <a href={`https://${company.website}`} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-[#4fc487] text-white flex items-center justify-center hover:opacity-80"><Globe className="w-4 h-4" /></a>}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="gap-1 border-[#d0d0d8] text-[#666] text-xs"><Bookmark className="w-3 h-3" />Favourite</Button>
                  <Button size="sm" className="bg-[#4fc487] hover:bg-[#3da872] text-white text-xs gap-1"><Share2 className="w-3 h-3" />Add to List</Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ═══════ TAB BAR ═══════ */}
        <div className="sticky top-16 bg-white border-b border-[#e8e8f0] z-40 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex gap-0 overflow-x-auto scrollbar-hide">
              {tabs.map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                  className={`py-3 px-5 text-sm font-medium border-b-[3px] transition-colors whitespace-nowrap ${
                    activeTab === tab.id ? 'border-[#6c63ff] text-[#1a1a2e]' : 'border-transparent text-[#888] hover:text-[#1a1a2e]'
                  }`}>
                  {tab.label}
                  {tab.count !== null && tab.count > 0 && <span className="ml-1 text-[#888]">{tab.count}</span>}
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
                <section className="bg-white border border-[#e8e8f0] rounded-lg p-6">
                  <h2 className="text-base font-bold mb-2 text-[#1a1a2e]">About</h2>
                  <p className="text-sm text-[#555] leading-relaxed">{company.about}</p>
                </section>

                {/* Financial Data Cards with sparklines */}
                <section className="bg-white border border-[#e8e8f0] rounded-lg p-6">
                  <h2 className="text-base font-bold mb-4 text-[#1a1a2e]">Financial Data</h2>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {statCards.map(card => (
                      <div key={card.label} className="border border-[#eee] rounded-lg p-4 relative">
                        <div className="flex items-start justify-between mb-1">
                          <p className="text-2xl font-bold text-[#1a1a2e]">{card.value}</p>
                          {card.trend === 'up' && <ArrowUpRight className="w-5 h-5 text-[#4fc487]" />}
                          {card.trend === 'down' && <ArrowDownRight className="w-5 h-5 text-[#e74c3c]" />}
                        </div>
                        <p className="text-[10px] uppercase tracking-wider text-[#999] font-semibold mb-1">{card.label}</p>
                        {card.data.length > 0 && <Sparkline data={card.data} color={card.color} width={120} height={28} />}
                      </div>
                    ))}
                  </div>
                </section>

                {/* Suggestions + AdSpend side by side */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                  {/* Suggestions (3/5) */}
                  <div className="lg:col-span-3 bg-white border border-[#e8e8f0] rounded-lg p-6">
                    <h2 className="text-base font-bold mb-4 text-[#1a1a2e]">Suggestions</h2>
                    <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                      {similarAgencies.map(a => (
                        <Link key={a.id} href={`/directory/${a.id}`} className="min-w-[150px] border border-[#eee] rounded-lg p-4 hover:shadow-md transition-shadow text-center flex flex-col items-center">
                          <Star className="w-4 h-4 text-[#ccc] self-end mb-1" />
                          <div className="w-14 h-14 bg-gray-50 rounded border border-[#eee] flex items-center justify-center mb-2 overflow-hidden">
                            <img src={a.logo} alt={a.name} className="w-full h-full object-contain p-1" />
                          </div>
                          <p className="text-xs font-bold text-[#1a1a2e] uppercase">{a.name}</p>
                        </Link>
                      ))}
                    </div>
                  </div>
                  {/* AdSpend Chart (2/5) */}
                  <div className="lg:col-span-2 bg-white border border-[#e8e8f0] rounded-lg p-6">
                    <h2 className="text-base font-bold mb-1 text-[#1a1a2e]">AdSpend History (M€)</h2>
                    <div className="flex flex-wrap gap-x-3 gap-y-1 mb-3">
                      {['Digital','TV','Print'].map(cat => (
                        <span key={cat} className="flex items-center gap-1 text-[10px] text-[#666]">
                          <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: { Digital: '#6366f1', TV: '#a78bfa', Print: '#c4b5fd' }[cat] }} />
                          {cat}
                        </span>
                      ))}
                    </div>
                    <StackedBarChart data={adSpendData} />
                  </div>
                </div>

                {/* Services & Sectors */}
                <section className="bg-white border border-[#e8e8f0] rounded-lg p-6">
                  <h2 className="text-base font-bold mb-3 text-[#1a1a2e]">Services</h2>
                  <div className="flex flex-wrap gap-2 mb-5">{company.services.map(s => <Badge key={s}>{s}</Badge>)}</div>
                  <h2 className="text-base font-bold mb-3 text-[#1a1a2e]">Sectors</h2>
                  <div className="flex flex-wrap gap-2">{company.sectors.map(s => <Badge key={s} variant="outline">{s}</Badge>)}</div>
                </section>
              </div>
            )}

            {/* ════ CONTACTS ════ */}
            {activeTab === 'contacts' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-base font-bold text-[#1a1a2e]">Contacts {allContacts.length > 0 ? `(${allContacts.length})` : teamMembers.length > 0 ? `(${teamMembers.length})` : ''}</h2>
                  {company.contactsByDept && company.contactsByDept.length > 0 && (
                    <div className="flex rounded border border-[#e8e8f0] overflow-hidden">
                      <button onClick={() => setContactView('department')} className={`px-3 py-1.5 text-xs flex items-center gap-1 ${contactView === 'department' ? 'bg-[#6c63ff] text-white' : 'bg-white text-[#666]'}`}><LayoutGrid className="w-3 h-3" />Departments</button>
                      <button onClick={() => setContactView('list')} className={`px-3 py-1.5 text-xs flex items-center gap-1 ${contactView === 'list' ? 'bg-[#6c63ff] text-white' : 'bg-white text-[#666]'}`}><List className="w-3 h-3" />List</button>
                    </div>
                  )}
                </div>
                {company.contactsByDept && company.contactsByDept.length > 0 ? (
                  contactView === 'department' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {company.contactsByDept.map(dept => (
                        <div key={dept.department} className="bg-white border border-[#e8e8f0] rounded-lg p-5">
                          <h3 className="font-bold text-xs text-[#6c63ff] uppercase tracking-wider mb-4 border-b border-[#eee] pb-3">{dept.department}</h3>
                          <div className="space-y-4">
                            {dept.contacts.map(c => (
                              <div key={c.name} className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#e8e8f0] to-[#d0d0d8] flex-shrink-0 flex items-center justify-center text-[#666] text-xs font-bold">{c.name.split(' ').map(n => n[0]).join('')}</div>
                                <div className="min-w-0">
                                  <p className="text-sm font-bold text-[#1a1a2e]">{c.name}</p>
                                  <p className="text-xs text-[#999]">{c.role}</p>
                                  {c.email && <a href={`mailto:${c.email}`} className="text-xs text-[#6c63ff] hover:underline">{c.email}</a>}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-white border border-[#e8e8f0] rounded-lg overflow-hidden">
                      <table className="w-full">
                        <thead><tr className="border-b border-[#e8e8f0] bg-[#fafafa]">
                          <th className="text-left px-4 py-3 text-[10px] text-[#999] uppercase tracking-wider font-semibold">Name</th>
                          <th className="text-left px-4 py-3 text-[10px] text-[#999] uppercase tracking-wider font-semibold">Role</th>
                          <th className="text-left px-4 py-3 text-[10px] text-[#999] uppercase tracking-wider font-semibold">Department</th>
                          <th className="text-left px-4 py-3 text-[10px] text-[#999] uppercase tracking-wider font-semibold">Email</th>
                        </tr></thead>
                        <tbody>
                          {company.contactsByDept.flatMap(dept => dept.contacts.map(c => (
                            <tr key={c.name} className="border-b border-[#f0f0f0] last:border-0 hover:bg-[#fafafa]">
                              <td className="px-4 py-3 text-sm font-medium text-[#1a1a2e]">{c.name}</td>
                              <td className="px-4 py-3 text-sm text-[#666]">{c.role}</td>
                              <td className="px-4 py-3 text-sm text-[#666]">{dept.department}</td>
                              <td className="px-4 py-3 text-sm">{c.email ? <a href={`mailto:${c.email}`} className="text-[#6c63ff] hover:underline">{c.email}</a> : <span className="text-[#ccc]">—</span>}</td>
                            </tr>
                          )))}
                        </tbody>
                      </table>
                    </div>
                  )
                ) : teamMembers.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {teamMembers.map(p => (
                      <div key={p.id} className="bg-white border border-[#e8e8f0] rounded-lg p-4 text-center">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 mx-auto mb-3 overflow-hidden"><img src={p.photo} alt={p.name} className="w-full h-full object-cover" /></div>
                        <h3 className="text-sm font-bold text-[#1a1a2e] mb-0.5">{p.name}</h3>
                        <p className="text-xs text-[#6c63ff]">{p.role}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-[#999]"><Users className="w-12 h-12 mx-auto mb-3 text-[#ddd]" /><p className="text-sm">No contact information available yet.</p></div>
                )}
              </div>
            )}

            {/* ════ CLIENTS ════ */}
            {activeTab === 'clients' && (
              <div>
                <h2 className="text-base font-bold text-[#1a1a2e] mb-4">Clients ({company.clients.length})</h2>
                {clientSectors.length > 1 && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {clientSectors.map(s => (
                      <button key={s} onClick={() => setClientFilter(s)} className={`px-3 py-1.5 text-xs rounded font-medium transition-colors ${clientFilter === s ? 'bg-[#6c63ff] text-white' : 'bg-white border border-[#e8e8f0] text-[#666] hover:bg-[#f5f6fa]'}`}>{s}</button>
                    ))}
                  </div>
                )}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {filteredClients.map((client, i) => {
                    const sector = company.clientIndustries?.[i % (company.clientIndustries?.length || 1)] || null
                    return (
                      <div key={client} className="bg-white border border-[#e8e8f0] rounded-lg p-5 hover:shadow-md transition-shadow">
                        <div className="w-10 h-10 bg-[#f5f6fa] rounded flex items-center justify-center mb-3 text-xs font-bold text-[#999]">{client.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase()}</div>
                        <p className="text-sm font-bold text-[#1a1a2e] mb-1">{client}</p>
                        {sector && <span className="text-[10px] bg-[#f5f6fa] text-[#666] px-2 py-0.5 rounded">{sector}</span>}
                      </div>
                    )
                  })}
                </div>
                {filteredClients.length === 0 && <div className="text-center py-12 text-[#999]"><p className="text-sm">No clients match the selected filter.</p></div>}
              </div>
            )}

            {/* ════ NEW BUSINESS ════ */}
            {activeTab === 'new-business' && (
              <div>
                {company.newBusinessWins && company.newBusinessWins.length > 0 ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left: filters + table */}
                    <div>
                      {/* Search + filter row */}
                      <div className="flex items-center gap-3 mb-4">
                        <div className="relative flex-1 max-w-[200px]"><input placeholder="Search..." className="w-full border border-[#e8e8f0] rounded px-3 py-2 text-sm bg-white focus:outline-none focus:border-[#6c63ff]" /></div>
                        <div className="flex rounded border border-[#e8e8f0] overflow-hidden">
                          {['All','Won','In Progress'].map(s => (
                            <button key={s} onClick={() => setBusinessStatusFilter(s)} className={`px-3 py-2 text-xs font-semibold uppercase ${businessStatusFilter === s ? 'bg-[#6c63ff] text-white' : 'bg-white text-[#666] hover:bg-[#f5f6fa]'}`}>{s === 'All' ? 'ALL' : s === 'Won' ? 'WON' : 'IN PROGRESS'}</button>
                          ))}
                        </div>
                      </div>
                      {/* Table */}
                      <div className="bg-white border border-[#e8e8f0] rounded-lg overflow-hidden">
                        <table className="w-full">
                          <thead><tr className="border-b border-[#e8e8f0] bg-[#fafafa]">
                            <th className="text-left px-3 py-2.5 text-[10px] text-[#999] uppercase tracking-wider font-semibold">Brand · Sector</th>
                            <th className="text-left px-3 py-2.5 text-[10px] text-[#999] uppercase tracking-wider font-semibold">Date</th>
                            <th className="text-left px-3 py-2.5 text-[10px] text-[#999] uppercase tracking-wider font-semibold">Type · Reach</th>
                            <th className="text-left px-3 py-2.5 text-[10px] text-[#999] uppercase tracking-wider font-semibold">Status</th>
                          </tr></thead>
                          <tbody>
                            {filteredBusiness.map((w, i) => (
                              <tr key={i} className="border-b border-[#f0f0f0] last:border-0 hover:bg-[#fafafa]">
                                <td className="px-3 py-3">
                                  <p className="text-sm font-bold text-[#1a1a2e]">{w.brand}</p>
                                  <p className="text-xs text-[#999]">{w.sector}</p>
                                </td>
                                <td className="px-3 py-3 text-xs text-[#666]">{w.date}</td>
                                <td className="px-3 py-3">
                                  <p className="text-xs text-[#666]">{w.type}</p>
                                  <p className="text-[10px] text-[#999]">{w.reach}</p>
                                </td>
                                <td className="px-3 py-3"><span className={`text-[10px] px-2 py-1 rounded font-semibold ${w.status === 'Won' ? 'bg-[#e8f5e9] text-[#2e7d32]' : 'bg-[#fff3e0] text-[#e65100]'}`}>{w.status === 'Won' ? 'Won' : 'In progress'}</span></td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                    {/* Right: trend chart */}
                    <div className="bg-white border border-[#e8e8f0] rounded-lg p-6">
                      <h3 className="text-sm font-bold text-[#1a1a2e] mb-3">Business Trends</h3>
                      <TrendChart data={trendData} categories={bizTypes} colors={bizTypeColors} />
                      {/* Legend */}
                      <div className="flex flex-wrap gap-x-3 gap-y-1 mt-3">
                        {bizTypes.map(t => (
                          <span key={t} className="flex items-center gap-1 text-[10px] text-[#666]">
                            <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: bizTypeColors[t] || '#999' }} />
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 text-[#999]"><TrendingUp className="w-12 h-12 mx-auto mb-3 text-[#ddd]" /><p className="text-sm">No new business data available.</p></div>
                )}
              </div>
            )}

            {/* ════ WORK ════ */}
            {activeTab === 'work' && (
              <div>
                {allFormats.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    <button onClick={() => setFormatFilter('All')} className={`px-3 py-1.5 text-xs rounded font-medium ${formatFilter === 'All' ? 'bg-[#6c63ff] text-white' : 'bg-white border border-[#e8e8f0] text-[#666]'}`}>All</button>
                    {allFormats.map(f => <button key={f} onClick={() => setFormatFilter(f)} className={`px-3 py-1.5 text-xs rounded font-medium ${formatFilter === f ? 'bg-[#6c63ff] text-white' : 'bg-white border border-[#e8e8f0] text-[#666]'}`}>{f}</button>)}
                  </div>
                )}
                {filteredCampaigns.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCampaigns.map(c => (
                      <div key={c.id} className="bg-white border border-[#e8e8f0] rounded-lg overflow-hidden hover:shadow-lg transition-shadow group">
                        <div className="aspect-video bg-[#1a1a2e] overflow-hidden">
                          <img src={c.thumbnail} alt={c.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        </div>
                        <div className="p-4 space-y-1">
                          <p className="text-sm font-bold text-[#1a1a2e]">&lsquo;{c.title}&rsquo;</p>
                          <p className="text-xs text-[#999]">{c.year} · {c.format.join(', ')}</p>
                          <p className="text-xs font-bold text-[#1a1a2e] uppercase">{c.brand}</p>
                          <p className="text-xs text-[#6c63ff] uppercase">{company.name}</p>
                          {c.awardWins && c.awardWins > 0 && (
                            <span className="inline-flex items-center gap-1 text-[10px] bg-amber-50 text-amber-700 px-2 py-0.5 rounded"><Trophy className="w-3 h-3" />{c.awardWins} awards</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : <div className="text-center py-12 text-[#999]"><p className="text-sm">No campaigns match the selected filter.</p></div>}
              </div>
            )}

            {/* ════ NEWS ════ */}
            {activeTab === 'news' && (
              <div>
                <div className="mb-4">
                  <div className="relative max-w-xs">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#ccc]" />
                    <input value={newsSearch} onChange={e => setNewsSearch(e.target.value)} placeholder="Search..." className="w-full border border-[#e8e8f0] rounded pl-9 pr-3 py-2 text-sm bg-white focus:outline-none focus:border-[#6c63ff]" />
                  </div>
                </div>
                {filteredNews.length > 0 ? (
                  <div className="bg-white border border-[#e8e8f0] rounded-lg overflow-hidden divide-y divide-[#f0f0f0]">
                    {filteredNews.map(article => (
                      <Link key={article.id} href={`/news/${article.id}`} className="flex gap-4 p-5 hover:bg-[#fafafa] transition-colors">
                        <div className="w-14 h-14 bg-[#f5f6fa] rounded flex-shrink-0 overflow-hidden flex items-center justify-center">
                          <img src={article.thumbnail} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-bold text-[#1a1a2e] mb-1">{article.title}</h3>
                          <p className="text-xs text-[#666] leading-relaxed mb-1">{article.excerpt}</p>
                          <p className="text-[10px] text-[#6c63ff]">{article.author}</p>
                        </div>
                        <div className="text-xs text-[#999] flex-shrink-0 whitespace-nowrap">{new Date(article.date).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}</div>
                      </Link>
                    ))}
                  </div>
                ) : <div className="text-center py-12 text-[#999]"><p className="text-sm">No news articles found.</p></div>}
              </div>
            )}

          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
