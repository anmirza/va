'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'
import { AuthGuard } from '@/components/auth-guard'
import { Header } from '@/components/header'
import {
  Film, Edit, Plus, BarChart3, Eye, TrendingUp,
  MapPin, Globe, Phone, Mail, Linkedin, Twitter, Instagram,
  Users, CheckSquare, Save, X, ChevronRight, Award, Camera,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface ProductionProfile {
  businessName: string
  dunsNumber: string
  vatNumber: string
  legalForm: string
  companyRegNumber: string
  yearEstablished: string
  employees: string
  companyLevel: string
  parentCompany: string
  currency: string
  tradeOrganizations: string
  countryCoverage: string
  address: string
  postcode: string
  city: string
  country: string
  contacts: { role: string; firstName: string; lastName: string; linkedin: string; telephone: string; mobile: string; email: string }[]
  website: string
  twitter: string
  facebook: string
  linkedin: string
  instagram: string
  tiktok: string
  financials: Record<string, string>
  clients: { name: string; industry: string; activities: string; year: string; turnover: string; incidence: string; exclusivity: boolean }[]
  competencies: Record<string, boolean>
  capabilityAllocation: Record<string, string>
  selectedSectors: Record<string, boolean>
  hasInHousePost: boolean | null
  postServices: string
  permanentEmployees: string
  freelancers: string
  directors: { name: string; exclusivity: boolean; priority: boolean; occasional: boolean }[]
  awards: { festival: string; distinction: string; category: string; year: string; ad: string; brand: string }[]
  csr: Record<string, boolean | null>
  about: string
  philosophy: string
  specificServices: string
  aiCurrentTools: string
  aiFuture: string
  strategicOrientation: string
  governance: { quality: string; clientData: string; globalLocal: string; additional: string }
  submittedAt: string
}

function InfoRow({ label, value }: { label: string; value?: string }) {
  if (!value) return null
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-1 py-2.5 border-b border-border last:border-0">
      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide sm:w-44 shrink-0">{label}</span>
      <span className="text-sm text-foreground">{value}</span>
    </div>
  )
}

function SectionCard({ title, icon: Icon, children }: { title: string; icon: React.ElementType; children: React.ReactNode }) {
  return (
    <div className="bg-card border border-border rounded-xl border border-border overflow-hidden">
      <div className="flex items-center gap-2.5 px-6 py-4 border-b border-border">
        <Icon className="w-4 h-4 text-[#0763d8]" />
        <h3 className="font-semibold text-foreground text-sm">{title}</h3>
      </div>
      <div className="px-6 py-4">{children}</div>
    </div>
  )
}

function ProductionDashContent() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState<'overview' | 'edit' | 'directors' | 'analytics'>('overview')
  const [profile, setProfile] = useState<ProductionProfile | null>(null)
  const [editDraft, setEditDraft] = useState<Partial<ProductionProfile>>({})
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem('va_production_profile')
      if (raw) {
        const p = JSON.parse(raw) as ProductionProfile
        setProfile(p)
        setEditDraft(p)
      }
    } catch { /* ignore */ }
  }, [])

  const activeCompetencies = profile
    ? Object.entries(profile.competencies || {}).filter(([, v]) => v).map(([k]) => k)
    : []
  const activeSectors = profile
    ? Object.entries(profile.selectedSectors || {}).filter(([, v]) => v).map(([k]) => k)
    : []
  const notableAwards = profile?.awards?.filter(a => a.distinction) ?? []
  const notableClients = profile?.clients?.filter(c => c.name) ?? []
  const notableDirectors = profile?.directors?.filter(d => d.name) ?? []
  const primaryContact = profile?.contacts?.find(c => c.email) ?? profile?.contacts?.[0]

  const handleSave = () => {
    if (!editDraft) return
    const updated = { ...profile, ...editDraft } as ProductionProfile
    setProfile(updated)
    localStorage.setItem('va_production_profile', JSON.stringify(updated))
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
    setActiveTab('overview')
  }

  const TABS = [
    { id: 'overview', label: 'Overview', icon: Film },
    { id: 'edit', label: 'Edit Profile', icon: Edit },
    { id: 'directors', label: 'Directors', icon: Camera },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  ] as const

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Page header */}
        <div className="bg-card border-b border-border px-4 sm:px-6 lg:px-8 py-10">
          <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
            <div>
              <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground mb-2 block">← Dashboard</Link>
              <h1 className="text-2xl font-bold text-foreground">{profile?.businessName || user?.name || 'My Production House'}</h1>
              {(profile?.city || profile?.country) && (
                <p className="text-[#98F5CC] text-sm flex items-center gap-1.5 mt-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {[profile?.city, profile?.country].filter(Boolean).join(', ')}
                </p>
              )}
            </div>
            {profile && (
              <div className="hidden sm:flex items-center gap-1.5 bg-[#0763d8]/20 text-[#0763d8] text-xs font-medium px-3 py-1.5 rounded-full">
                <CheckSquare className="w-3.5 h-3.5" /> Profile complete
              </div>
            )}
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Tabs */}
          <div className="flex gap-1 bg-card border border-border rounded-xl p-1 shadow-sm mb-8 overflow-x-auto">
            {TABS.map(tab => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors flex-1 justify-center ${activeTab === tab.id ? 'bg-secondary text-foreground shadow-sm' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}
                >
                  <Icon className="w-4 h-4" />{tab.label}
                </button>
              )
            })}
          </div>

          {/* ── Overview ── */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {!profile && (
                <div className="bg-card border border-border rounded-xl p-10 shadow-sm text-center">
                  <Film className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h2 className="text-lg font-semibold text-foreground mb-2">No profile yet</h2>
                  <p className="text-sm text-muted-foreground mb-6">Complete the production house registration form to build your VA profile.</p>
                  <Link href="/signup/production">
                    <Button className="bg-[#0763d8] hover:bg-[#0655b3] text-foreground">Register Your Production House</Button>
                  </Link>
                </div>
              )}

              {profile && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left */}
                  <div className="lg:col-span-2 space-y-6">
                    {profile.about && (
                      <SectionCard title="About" icon={Film}>
                        <p className="text-sm text-muted-foreground leading-relaxed">{profile.about}</p>
                        {profile.philosophy && (
                          <div className="mt-4 pt-4 border-t border-border">
                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Philosophy</p>
                            <p className="text-sm text-muted-foreground leading-relaxed">{profile.philosophy}</p>
                          </div>
                        )}
                      </SectionCard>
                    )}

                    <SectionCard title="General Information" icon={Eye}>
                      <InfoRow label="Company Name" value={profile.businessName} />
                      <InfoRow label="Year Established" value={profile.yearEstablished} />
                      <InfoRow label="Legal Form" value={profile.legalForm} />
                      <InfoRow label="Company Level" value={profile.companyLevel} />
                      <InfoRow label="Parent Company" value={profile.parentCompany} />
                      <InfoRow label="Employees" value={profile.employees} />
                      <InfoRow label="Permanent Employees" value={profile.permanentEmployees} />
                      <InfoRow label="Freelancers" value={profile.freelancers} />
                      <InfoRow label="Coverage" value={profile.countryCoverage} />
                      <InfoRow label="Currency" value={profile.currency} />
                      {profile.hasInHousePost !== null && (
                        <InfoRow label="In-House Post" value={profile.hasInHousePost ? 'Yes' : 'No'} />
                      )}
                    </SectionCard>

                    {activeCompetencies.length > 0 && (
                      <SectionCard title="Production Competencies" icon={CheckSquare}>
                        <div className="flex flex-wrap gap-2">
                          {activeCompetencies.map(c => (
                            <span key={c} className="bg-muted border border-border text-muted-foreground text-xs px-2.5 py-1 rounded-full">{c}</span>
                          ))}
                        </div>
                      </SectionCard>
                    )}

                    {activeSectors.length > 0 && (
                      <SectionCard title="Sectors Served" icon={BarChart3}>
                        <div className="flex flex-wrap gap-2">
                          {activeSectors.map(s => (
                            <span key={s} className="border border-border text-muted-foreground text-xs px-2.5 py-1 rounded-full">{s}</span>
                          ))}
                        </div>
                      </SectionCard>
                    )}

                    {notableClients.length > 0 && (
                      <SectionCard title="Key Clients" icon={Users}>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {notableClients.map((c, i) => (
                            <div key={i} className="border border-border rounded-lg p-3">
                              <p className="text-sm font-medium text-foreground">{c.name}</p>
                              {c.industry && <p className="text-xs text-muted-foreground mt-0.5">{c.industry}</p>}
                              {c.activities && <p className="text-xs text-muted-foreground mt-1">{c.activities}</p>}
                            </div>
                          ))}
                        </div>
                        <button onClick={() => setActiveTab('directors')} className="mt-4 text-xs text-[#0763d8] font-medium hover:underline flex items-center gap-1">
                          See all directors <ChevronRight className="w-3 h-3" />
                        </button>
                      </SectionCard>
                    )}

                    {notableAwards.length > 0 && (
                      <SectionCard title="Awards" icon={Award}>
                        <div className="space-y-2">
                          {notableAwards.slice(0, 5).map((a, i) => (
                            <div key={i} className="flex items-center gap-3 py-1.5 border-b border-border last:border-0">
                              <div className="w-1.5 h-1.5 rounded-full bg-[#0763d8] shrink-0" />
                              <div>
                                <p className="text-sm text-foreground"><span className="font-medium">{a.festival}</span> — {a.distinction}</p>
                                {(a.ad || a.brand) && <p className="text-xs text-muted-foreground">{[a.ad, a.brand, a.year].filter(Boolean).join(' · ')}</p>}
                              </div>
                            </div>
                          ))}
                        </div>
                      </SectionCard>
                    )}
                  </div>

                  {/* Right */}
                  <div className="space-y-4">
                    <SectionCard title="Contact" icon={Mail}>
                      <div className="space-y-2.5">
                        {profile.address && (
                          <div className="flex items-start gap-2">
                            <MapPin className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                            <p className="text-sm text-muted-foreground">{profile.address}, {profile.postcode}<br />{profile.city}, {profile.country}</p>
                          </div>
                        )}
                        {profile.website && (
                          <a href={profile.website.startsWith('http') ? profile.website : `https://${profile.website}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-[#0763d8] hover:underline">
                            <Globe className="w-4 h-4 shrink-0" />{profile.website.replace(/^https?:\/\//, '')}
                          </a>
                        )}
                        {primaryContact?.email && (
                          <a href={`mailto:${primaryContact.email}`} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-[#0763d8]">
                            <Mail className="w-4 h-4 shrink-0" />{primaryContact.email}
                          </a>
                        )}
                        {primaryContact?.telephone && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Phone className="w-4 h-4 shrink-0" />{primaryContact.telephone}
                          </div>
                        )}
                      </div>
                      {(profile.linkedin || profile.twitter || profile.instagram) && (
                        <div className="flex items-center gap-3 mt-4 pt-4 border-t border-border">
                          {profile.linkedin && (
                            <a href={`https://linkedin.com/company/${profile.linkedin}`} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-[#0763d8]">
                              <Linkedin className="w-4 h-4" />
                            </a>
                          )}
                          {profile.twitter && (
                            <a href={`https://twitter.com/${profile.twitter}`} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-[#0763d8]">
                              <Twitter className="w-4 h-4" />
                            </a>
                          )}
                          {profile.instagram && (
                            <a href={`https://instagram.com/${profile.instagram}`} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-[#0763d8]">
                              <Instagram className="w-4 h-4" />
                            </a>
                          )}
                        </div>
                      )}
                    </SectionCard>

                    {profile.contacts?.some(c => c.firstName) && (
                      <SectionCard title="Key Contacts" icon={Users}>
                        <div className="space-y-3">
                          {profile.contacts.filter(c => c.firstName).map((c, i) => (
                            <div key={i}>
                              <p className="text-sm font-medium text-foreground">{c.firstName} {c.lastName}</p>
                              <p className="text-xs text-muted-foreground">{c.role}</p>
                              {c.email && <a href={`mailto:${c.email}`} className="text-xs text-[#0763d8] hover:underline">{c.email}</a>}
                            </div>
                          ))}
                        </div>
                      </SectionCard>
                    )}

                    <SectionCard title="Quick Stats" icon={TrendingUp}>
                      <div className="space-y-2.5">
                        {profile.employees && (
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Staff Size</span>
                            <span className="font-semibold text-foreground">{profile.employees}</span>
                          </div>
                        )}
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Competencies</span>
                          <span className="font-semibold text-foreground">{activeCompetencies.length}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Sectors</span>
                          <span className="font-semibold text-foreground">{activeSectors.length}</span>
                        </div>
                        {notableDirectors.length > 0 && (
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Directors</span>
                            <span className="font-semibold text-foreground">{notableDirectors.length}</span>
                          </div>
                        )}
                        {notableAwards.length > 0 && (
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Award Wins</span>
                            <span className="font-semibold text-foreground">{notableAwards.length}</span>
                          </div>
                        )}
                        {profile.yearEstablished && (
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Founded</span>
                            <span className="font-semibold text-foreground">{profile.yearEstablished}</span>
                          </div>
                        )}
                      </div>
                    </SectionCard>

                    {profile.aiCurrentTools && (
                      <SectionCard title="AI Readiness" icon={Award}>
                        <p className="text-xs text-muted-foreground mb-1 font-medium">Current tools</p>
                        <p className="text-sm text-muted-foreground">{profile.aiCurrentTools}</p>
                      </SectionCard>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── Edit Profile ── */}
          {activeTab === 'edit' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-6">
                <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                  <h2 className="font-bold text-foreground mb-5">Core Details</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-muted-foreground mb-1.5">Company Name *</label>
                      <Input value={editDraft.businessName || ''} onChange={e => setEditDraft(p => ({ ...p, businessName: e.target.value }))} className="h-10" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-muted-foreground mb-1.5">Year Established</label>
                      <Input value={editDraft.yearEstablished || ''} onChange={e => setEditDraft(p => ({ ...p, yearEstablished: e.target.value }))} className="h-10" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-muted-foreground mb-1.5">Staff Size</label>
                      <Input value={editDraft.employees || ''} onChange={e => setEditDraft(p => ({ ...p, employees: e.target.value }))} className="h-10" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-muted-foreground mb-1.5">About</label>
                      <textarea value={editDraft.about || ''} onChange={e => setEditDraft(p => ({ ...p, about: e.target.value }))} rows={4} className="w-full border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#0763d8] resize-none" placeholder="Describe your production house…" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-muted-foreground mb-1.5">Philosophy</label>
                      <textarea value={editDraft.philosophy || ''} onChange={e => setEditDraft(p => ({ ...p, philosophy: e.target.value }))} rows={3} className="w-full border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#0763d8] resize-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-muted-foreground mb-1.5">Strategic Orientation</label>
                      <textarea value={editDraft.strategicOrientation || ''} onChange={e => setEditDraft(p => ({ ...p, strategicOrientation: e.target.value }))} rows={3} className="w-full border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#0763d8] resize-none" placeholder="Your strategic goals and focus areas…" />
                    </div>
                  </div>
                </div>

                <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                  <h2 className="font-bold text-foreground mb-5">Location</h2>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-muted-foreground mb-1.5">City *</label>
                        <Input value={editDraft.city || ''} onChange={e => setEditDraft(p => ({ ...p, city: e.target.value }))} className="h-10" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-muted-foreground mb-1.5">Country *</label>
                        <Input value={editDraft.country || ''} onChange={e => setEditDraft(p => ({ ...p, country: e.target.value }))} className="h-10" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-muted-foreground mb-1.5">Street Address</label>
                      <Input value={editDraft.address || ''} onChange={e => setEditDraft(p => ({ ...p, address: e.target.value }))} className="h-10" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-muted-foreground mb-1.5">Postcode</label>
                      <Input value={editDraft.postcode || ''} onChange={e => setEditDraft(p => ({ ...p, postcode: e.target.value }))} className="h-10" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                  <h2 className="font-bold text-foreground mb-5">Online Presence</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-muted-foreground mb-1.5">Website</label>
                      <Input value={editDraft.website || ''} onChange={e => setEditDraft(p => ({ ...p, website: e.target.value }))} className="h-10" placeholder="https://" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-muted-foreground mb-1.5">LinkedIn</label>
                      <Input value={editDraft.linkedin || ''} onChange={e => setEditDraft(p => ({ ...p, linkedin: e.target.value }))} className="h-10" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-muted-foreground mb-1.5">Instagram</label>
                      <Input value={editDraft.instagram || ''} onChange={e => setEditDraft(p => ({ ...p, instagram: e.target.value }))} className="h-10" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-muted-foreground mb-1.5">Twitter / X</label>
                      <Input value={editDraft.twitter || ''} onChange={e => setEditDraft(p => ({ ...p, twitter: e.target.value }))} className="h-10" />
                    </div>
                  </div>
                </div>

                <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                  <h2 className="font-bold text-foreground mb-5">Post-Production</h2>
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1.5">In-House Post Services</label>
                    <textarea value={editDraft.postServices || ''} onChange={e => setEditDraft(p => ({ ...p, postServices: e.target.value }))} rows={4} className="w-full border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#0763d8] resize-none" placeholder="Describe post-production capabilities…" />
                  </div>
                </div>

                <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                  <h2 className="font-bold text-foreground mb-5">AI & Innovation</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-muted-foreground mb-1.5">Current AI Tools</label>
                      <textarea value={editDraft.aiCurrentTools || ''} onChange={e => setEditDraft(p => ({ ...p, aiCurrentTools: e.target.value }))} rows={3} className="w-full border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#0763d8] resize-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-muted-foreground mb-1.5">Future AI Plans</label>
                      <textarea value={editDraft.aiFuture || ''} onChange={e => setEditDraft(p => ({ ...p, aiFuture: e.target.value }))} rows={3} className="w-full border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#0763d8] resize-none" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-2 flex items-center justify-end gap-3 sticky bottom-6">
                <div className="bg-card border border-border rounded-xl border border-border flex items-center gap-3 px-5 py-3">
                  <button onClick={() => setActiveTab('overview')} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
                    <X className="w-4 h-4" /> Cancel
                  </button>
                  <Button onClick={handleSave} className="bg-[#0763d8] hover:bg-[#0655b3] text-foreground gap-2 text-sm">
                    <Save className="w-4 h-4" />{saved ? 'Saved!' : 'Save Changes'}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* ── Directors Tab ── */}
          {activeTab === 'directors' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-foreground">Directors Roster</h2>
                <Button className="bg-[#0763d8] hover:bg-[#0655b3] text-foreground gap-2 text-sm">
                  <Plus className="w-4 h-4" /> Add Director
                </Button>
              </div>
              {notableDirectors.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {notableDirectors.map((d, i) => (
                    <div key={i} className="bg-card border border-border rounded-xl p-5 shadow-sm">
                      <div className="w-10 h-10 bg-muted border border-border rounded-full flex items-center justify-center mb-3">
                        <Camera className="w-5 h-5 text-[#0763d8]" />
                      </div>
                      <h3 className="font-semibold text-foreground mb-2">{d.name}</h3>
                      <div className="flex flex-wrap gap-1.5">
                        {d.exclusivity && <span className="text-xs bg-[#0763d8]/15 text-[#2d7a50] px-2 py-0.5 rounded-full">Exclusive</span>}
                        {d.priority && <span className="text-xs bg-muted border border-border text-muted-foreground px-2 py-0.5 rounded-full">Priority</span>}
                        {d.occasional && <span className="text-xs bg-muted border border-border text-muted-foreground px-2 py-0.5 rounded-full">Occasional</span>}
                      </div>
                    </div>
                  ))}
                  <div className="border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center p-8 text-muted-foreground hover:border-[#0763d8] hover:text-[#0763d8] transition-colors cursor-pointer min-h-[150px]">
                    <Plus className="w-8 h-8 mb-2" />
                    <p className="text-sm font-medium">Add Director</p>
                  </div>
                </div>
              ) : (
                <div className="bg-card border border-border rounded-xl p-10 shadow-sm text-center">
                  <Camera className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-medium text-foreground mb-2">No directors added yet</h3>
                  <p className="text-sm text-muted-foreground">Add directors to showcase your production talent roster.</p>
                </div>
              )}
            </div>
          )}

          {/* ── Analytics ── */}
          {activeTab === 'analytics' && (
            <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-6">
                <TrendingUp className="w-5 h-5 text-[#0763d8]" />
                <h2 className="font-bold text-foreground">Profile Analytics</h2>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                {[
                  { label: 'Profile Views', value: '842', change: '+9%' },
                  { label: 'Showreel Plays', value: '1,205', change: '+15%' },
                  { label: 'Followers', value: '31', change: '+4' },
                  { label: 'Contact Clicks', value: '17', change: '+2' },
                ].map(stat => (
                  <div key={stat.label} className="bg-muted border border-border rounded-xl p-4 text-center">
                    <p className="text-2xl font-bold text-foreground mb-1">{stat.value}</p>
                    <p className="text-xs text-muted-foreground mb-1">{stat.label}</p>
                    <p className="text-xs text-[#0763d8] font-medium">{stat.change} this month</p>
                  </div>
                ))}
              </div>
              <div className="border border-[#f5d742] bg-[#f5d742]/10 rounded-xl p-4 text-center">
                <p className="text-sm font-medium text-[#a87e00] mb-1">Unlock Full Analytics</p>
                <p className="text-xs text-muted-foreground mb-3">Upgrade to Pro to see detailed traffic sources, engagement metrics, and more.</p>
                <Link href="/pricing"><Button className="bg-[#f5d742] hover:bg-[#e6c93c] text-foreground text-sm">View Plans</Button></Link>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default function ProductionDashboardPage() {
  return (
    <AuthGuard>
      <ProductionDashContent />
    </AuthGuard>
  )
}
