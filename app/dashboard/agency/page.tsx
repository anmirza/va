'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'
import { AuthGuard } from '@/components/auth-guard'
import { Header } from '@/components/header'
import { campaigns } from '@/lib/mock-data'
import {
  Building2, Edit, Plus, Film, Eye, Award,
  MapPin, Globe, Phone, Mail, Linkedin, Twitter, Instagram,
  Users, Briefcase, CheckSquare, Save, X, ChevronRight, TrendingUp,
  BarChart3, Handshake,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { AgencyDirectoryListingEditor } from '@/components/agency-directory-listing-editor'

interface AgencyProfile {
  businessName: string
  dunsNumber: string
  vatNumber: string
  legalForm: string
  companyRegNumber: string
  yearEstablished: string
  employees: string
  companyLevel: string
  parentCompany: string
  category: string
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
  pinterest: string
  reddit: string
  competencies: Record<string, boolean>
  capabilityAllocation: Record<string, string>
  marketPositioning: string
  selectedSectors: Record<string, boolean>
  about: string
  philosophy: string
  aiCurrentTools: string
  aiFuture: string
  specificServices: string
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
    <div className="bg-card rounded-lg border border-border overflow-hidden">
      <div className="flex items-center gap-2.5 px-6 py-4 border-b border-border">
        <Icon className="w-4 h-4 text-[#0763d8]" />
        <h3 className="font-semibold text-foreground text-sm">{title}</h3>
      </div>
      <div className="px-6 py-4">{children}</div>
    </div>
  )
}

function AgencyDashContent() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState<'overview' | 'edit' | 'work' | 'listing'>('overview')
  const [profile, setProfile] = useState<AgencyProfile | null>(null)
  const [editDraft, setEditDraft] = useState<Partial<AgencyProfile>>({})
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem('va_agency_profile')
      if (raw) {
        const p = JSON.parse(raw) as AgencyProfile
        setProfile(p)
        setEditDraft(p)
      }
    } catch { /* ignore */ }
  }, [])

  const agencyCampaigns = campaigns.slice(0, 4)

  const activeCompetencies = profile
    ? Object.entries(profile.competencies || {}).filter(([, v]) => v).map(([k]) => k)
    : []
  const activeSectors = profile
    ? Object.entries(profile.selectedSectors || {}).filter(([, v]) => v).map(([k]) => k)
    : []

  const primaryContact = profile?.contacts?.find(c => c.email) ?? profile?.contacts?.[0]

  const handleSave = () => {
    if (!editDraft) return
    const updated = { ...profile, ...editDraft } as AgencyProfile
    setProfile(updated)
    localStorage.setItem('va_agency_profile', JSON.stringify(updated))
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
    setActiveTab('overview')
  }

  const directoryCompanyId = user?.companyId ?? user?.companyIds?.[0]

  const TABS = [
    { id: 'overview', label: 'Overview', icon: Building2 },
    { id: 'edit', label: 'Edit Profile', icon: Edit },
    { id: 'listing', label: 'Directory listing', icon: Handshake },
    { id: 'work', label: 'Work', icon: Film },
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
              <h1 className="text-2xl font-bold text-foreground">{profile?.businessName || user?.name || 'My Agency'}</h1>
              {(profile?.city || profile?.country) && (
                <p className="text-[#98F5CC] text-sm flex items-center gap-1.5 mt-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {[profile.city, profile.country].filter(Boolean).join(', ')}
                </p>
              )}
            </div>
            <div className="flex items-center gap-3">
              {profile && (
                <div className="hidden sm:flex items-center gap-1.5 bg-[#0763d8]/20 text-[#0763d8] text-xs font-medium px-3 py-1.5 rounded-full">
                  <CheckSquare className="w-3.5 h-3.5" /> Profile complete
                </div>
              )}
            </div>
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

          {/* ── Overview Tab ── */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {!profile && (
                <div className="bg-card border border-border rounded-xl p-10 shadow-sm text-center">
                  <Building2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h2 className="text-lg font-semibold text-foreground mb-2">No profile yet</h2>
                  <p className="text-sm text-muted-foreground mb-6">Complete the agency registration form to build your VA profile.</p>
                  <Link href="/signup/agency">
                    <Button className="bg-[#0763d8] hover:bg-[#0655b3] text-foreground">Register Your Agency</Button>
                  </Link>
                </div>
              )}

              {profile && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left column */}
                  <div className="lg:col-span-2 space-y-6">
                    {/* About */}
                    {profile.about && (
                      <SectionCard title="About" icon={Building2}>
                        <p className="text-sm text-muted-foreground leading-relaxed">{profile.about}</p>
                        {profile.philosophy && (
                          <div className="mt-4 pt-4 border-t border-border">
                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Philosophy</p>
                            <p className="text-sm text-muted-foreground leading-relaxed">{profile.philosophy}</p>
                          </div>
                        )}
                      </SectionCard>
                    )}

                    {/* General Info */}
                    <SectionCard title="General Information" icon={Briefcase}>
                      <InfoRow label="Registered Name" value={profile.businessName} />
                      <InfoRow label="Year Established" value={profile.yearEstablished} />
                      <InfoRow label="Legal Form" value={profile.legalForm} />
                      <InfoRow label="Company Level" value={profile.companyLevel} />
                      <InfoRow label="Parent Company" value={profile.parentCompany} />
                      <InfoRow label="Agency Category" value={profile.category} />
                      <InfoRow label="Employees" value={profile.employees} />
                      <InfoRow label="Coverage" value={profile.countryCoverage} />
                      <InfoRow label="Currency" value={profile.currency} />
                      {profile.dunsNumber && <InfoRow label="D-U-N-S® Number" value={profile.dunsNumber} />}
                      {profile.vatNumber && <InfoRow label="VAT Number" value={profile.vatNumber} />}
                      {profile.tradeOrganizations && <InfoRow label="Trade Orgs." value={profile.tradeOrganizations} />}
                    </SectionCard>

                    {/* Competencies */}
                    {activeCompetencies.length > 0 && (
                      <SectionCard title="Competencies" icon={CheckSquare}>
                        <div className="flex flex-wrap gap-2">
                          {activeCompetencies.map(c => (
                            <span key={c} className="bg-muted border border-border text-muted-foreground text-xs px-2.5 py-1 rounded-full">{c}</span>
                          ))}
                        </div>
                      </SectionCard>
                    )}

                    {/* Sectors */}
                    {activeSectors.length > 0 && (
                      <SectionCard title="Sectors Served" icon={BarChart3}>
                        <div className="flex flex-wrap gap-2">
                          {activeSectors.map(s => (
                            <span key={s} className="border border-border text-muted-foreground text-xs px-2.5 py-1 rounded-full">{s}</span>
                          ))}
                        </div>
                      </SectionCard>
                    )}

                    {/* Recent Work */}
                    <SectionCard title="Work Portfolio" icon={Film}>
                      <div className="grid grid-cols-2 gap-3">
                        {agencyCampaigns.map(c => (
                          <Link key={c.id} href={`/creative-library/${c.id}`} className="group">
                            <img src={c.thumbnail} alt="" className="w-full h-28 object-cover rounded-lg mb-1.5" />
                            <p className="text-xs font-medium text-foreground group-hover:text-[#0763d8] transition-colors truncate">{c.title}</p>
                            <p className="text-xs text-muted-foreground">{c.brand} · {c.year}</p>
                          </Link>
                        ))}
                      </div>
                      <button
                        onClick={() => setActiveTab('work')}
                        className="mt-4 w-full text-center text-xs text-[#0763d8] font-medium hover:underline flex items-center justify-center gap-1"
                      >
                        Manage all work <ChevronRight className="w-3 h-3" />
                      </button>
                    </SectionCard>
                  </div>

                  {/* Right column */}
                  <div className="space-y-4">
                    {/* Contact */}
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
                      {/* Social */}
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

                    {/* Key Contacts */}
                    {profile.contacts?.some(c => c.firstName) && (
                      <SectionCard title="Key Contacts" icon={Users}>
                        <div className="space-y-3">
                          {profile.contacts.filter(c => c.firstName).map((c, i) => (
                            <div key={i} className="flex flex-col">
                              <p className="text-sm font-medium text-foreground">{c.firstName} {c.lastName}</p>
                              <p className="text-xs text-muted-foreground">{c.role}</p>
                              {c.email && <a href={`mailto:${c.email}`} className="text-xs text-[#0763d8] hover:underline mt-0.5">{c.email}</a>}
                            </div>
                          ))}
                        </div>
                      </SectionCard>
                    )}

                    {/* Quick Stats */}
                    <SectionCard title="Quick Stats" icon={TrendingUp}>
                      <div className="space-y-2.5">
                        {profile.employees && (
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Employees</span>
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
                        {profile.yearEstablished && (
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Founded</span>
                            <span className="font-semibold text-foreground">{profile.yearEstablished}</span>
                          </div>
                        )}
                      </div>
                    </SectionCard>

                    {/* AI Readiness */}
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

          {/* ── Edit Profile Tab ── */}
          {activeTab === 'edit' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-6">
                <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                  <h2 className="font-bold text-foreground mb-5">Core Details</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-muted-foreground mb-1.5">Agency Name *</label>
                      <Input value={editDraft.businessName || ''} onChange={e => setEditDraft(p => ({ ...p, businessName: e.target.value }))} className="h-10" placeholder="Registered company name" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-muted-foreground mb-1.5">Year Established</label>
                      <Input value={editDraft.yearEstablished || ''} onChange={e => setEditDraft(p => ({ ...p, yearEstablished: e.target.value }))} className="h-10" placeholder="e.g. 2005" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-muted-foreground mb-1.5">Agency Category</label>
                      <Input value={editDraft.category || ''} onChange={e => setEditDraft(p => ({ ...p, category: e.target.value }))} className="h-10" placeholder="e.g. Full Service, Digital, ATL" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-muted-foreground mb-1.5">Number of Employees</label>
                      <Input value={editDraft.employees || ''} onChange={e => setEditDraft(p => ({ ...p, employees: e.target.value }))} className="h-10" placeholder="e.g. 51 to 100" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-muted-foreground mb-1.5">About</label>
                      <textarea
                        value={editDraft.about || ''}
                        onChange={e => setEditDraft(p => ({ ...p, about: e.target.value }))}
                        rows={4}
                        className="w-full border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#0763d8] resize-none"
                        placeholder="Describe your agency…"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-muted-foreground mb-1.5">Philosophy</label>
                      <textarea
                        value={editDraft.philosophy || ''}
                        onChange={e => setEditDraft(p => ({ ...p, philosophy: e.target.value }))}
                        rows={3}
                        className="w-full border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#0763d8] resize-none"
                        placeholder="Your agency's philosophy…"
                      />
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
                      <Input value={editDraft.website || ''} onChange={e => setEditDraft(p => ({ ...p, website: e.target.value }))} className="h-10" placeholder="https://youragency.com" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-muted-foreground mb-1.5">LinkedIn</label>
                      <Input value={editDraft.linkedin || ''} onChange={e => setEditDraft(p => ({ ...p, linkedin: e.target.value }))} className="h-10" placeholder="company handle" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-muted-foreground mb-1.5">Twitter / X</label>
                      <Input value={editDraft.twitter || ''} onChange={e => setEditDraft(p => ({ ...p, twitter: e.target.value }))} className="h-10" placeholder="@handle" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-muted-foreground mb-1.5">Instagram</label>
                      <Input value={editDraft.instagram || ''} onChange={e => setEditDraft(p => ({ ...p, instagram: e.target.value }))} className="h-10" placeholder="@handle" />
                    </div>
                  </div>
                </div>

                <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                  <h2 className="font-bold text-foreground mb-5">Market Positioning</h2>
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1.5">Specific Services</label>
                    <textarea
                      value={editDraft.specificServices || ''}
                      onChange={e => setEditDraft(p => ({ ...p, specificServices: e.target.value }))}
                      rows={4}
                      className="w-full border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#0763d8] resize-none"
                      placeholder="Describe any unique or specialized services…"
                    />
                  </div>
                </div>

                <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                  <h2 className="font-bold text-foreground mb-5">AI & Innovation</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-muted-foreground mb-1.5">Current AI Tools</label>
                      <textarea
                        value={editDraft.aiCurrentTools || ''}
                        onChange={e => setEditDraft(p => ({ ...p, aiCurrentTools: e.target.value }))}
                        rows={3}
                        className="w-full border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#0763d8] resize-none"
                        placeholder="What AI tools does your agency currently use?"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-muted-foreground mb-1.5">Future AI Plans</label>
                      <textarea
                        value={editDraft.aiFuture || ''}
                        onChange={e => setEditDraft(p => ({ ...p, aiFuture: e.target.value }))}
                        rows={3}
                        className="w-full border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#0763d8] resize-none"
                        placeholder="How do you plan to leverage AI in the future?"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Save bar */}
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

          {/* ── Directory listing (clients & sectors on public profile) ── */}
          {activeTab === 'listing' && (
            <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-6">
                <Handshake className="w-5 h-5 text-[#0763d8]" />
                <div>
                  <h2 className="font-bold text-foreground text-lg">Clients &amp; sectors</h2>
                  <p className="text-sm text-muted-foreground">
                    Manage brands and sector tags shown on your agency&apos;s directory page.
                  </p>
                </div>
              </div>
              {directoryCompanyId ? (
                <AgencyDirectoryListingEditor companyId={directoryCompanyId} />
              ) : (
                <p className="text-sm text-muted-foreground">
                  Link a company to your vendor account to edit the directory listing. Complete agency registration or
                  contact support to associate a profile.
                </p>
              )}
            </div>
          )}

          {/* ── Work Tab ── */}
          {activeTab === 'work' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-foreground">Work Portfolio ({agencyCampaigns.length})</h2>
                <Button className="bg-[#0763d8] hover:bg-[#0655b3] text-foreground gap-2 text-sm">
                  <Plus className="w-4 h-4" /> Add Work
                </Button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {agencyCampaigns.map(c => (
                  <div key={c.id} className="bg-card border border-border rounded-xl border border-border overflow-hidden">
                    <img src={c.thumbnail} alt="" className="w-full h-40 object-cover" />
                    <div className="p-4">
                      <h3 className="font-medium text-foreground mb-1">{c.title}</h3>
                      <p className="text-sm text-muted-foreground">{c.brand} · {c.year}</p>
                      <div className="flex gap-2 mt-3">
                        <Link href={`/creative-library/${c.id}`}><Button variant="outline" size="sm" className="text-xs border-border">View</Button></Link>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center p-8 text-muted-foreground hover:border-[#0763d8] hover:text-[#0763d8] transition-colors cursor-pointer min-h-[200px]">
                  <Plus className="w-8 h-8 mb-2" />
                  <p className="text-sm font-medium">Add New Work</p>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  )
}

export default function AgencyDashboardPage() {
  return (
    <AuthGuard>
      <AgencyDashContent />
    </AuthGuard>
  )
}
