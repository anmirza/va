'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ChevronRight, ChevronLeft, Check, Film, Plus, Trash2, Upload, Copy, Link as LinkIcon, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { VaLogo } from '@/components/va-logo'
import { useSearchParams } from 'next/navigation'
import { SOCIAL_RESPONSIBILITY_QUESTIONS, CSR_IMPACT_AREAS, ATTACHMENTS_REQUESTED, AI_QUESTIONS } from '@/lib/rfi-data'
import { getTurnoverYears } from '@/lib/turnover-utils'
import { useAuth } from '@/lib/auth-context'
import { createOrg, createInvitation, getOrgById, updateOrg } from '@/lib/admin-store'

// ── Step definitions ──────────────────────────────────────────────────────────

const STEPS = [
  { id: 1, label: 'General Info' },
  { id: 2, label: 'Organisation' },
  { id: 3, label: 'Address' },
  { id: 4, label: 'About' },
  { id: 5, label: 'Contacts' },
  { id: 6, label: 'Social Media' },
  { id: 7, label: 'Turnover & Clients' },
  { id: 8, label: 'Competencies' },
  { id: 9, label: 'Post-Production' },
  { id: 10, label: 'People & Directors' },
  { id: 11, label: 'Awards & CSR' },
  { id: 12, label: 'Governance & AI' },
  { id: 13, label: 'Attachments' },
]

const EMPLOYEE_RANGES = ['1 to 10', '11 to 50', '51 to 100', '101 to 250', '251 to 400', '401 +']
const COMPANY_LEVELS = ['Holding Company', 'Worldwide Headquarter', 'Regional Headquarters', 'National Headquarters', 'Company', 'Subsidiary']
const COUNTRY_COVERAGES = ['Country Level', 'North America', 'Latin America', 'EMEA', 'Europe', 'APAC', 'Global']
const CURRENCIES = ['Euro - EUR', 'US Dollar - USD', 'British Pound - GBP', 'Swiss Franc - CHF', 'Japanese Yen - JPY', 'Australian Dollar - AUD']

const CONTACT_ROLES = ['CEO', 'General Manager', 'Business Director', 'Executive Producer']

const SECTORS = [
  'Automotive & Mobility', 'Beauty & Personal Care', 'Beverage', 'Consumer Goods',
  'Corporate & B2B', 'Electronics & Technology', 'Energy', 'Entertainment & Media',
  'Fashion & Luxury', 'Food & Beverage', 'Healthcare & Pharma', 'Home & Living',
  'Lifestyle', 'Mobility & Transportation', 'Pet Care', 'Sport & Outdoor',
  'Tobacco', 'Travel, Tourism & Hospitality',
]

const AWARD_FESTIVALS = ['AICP', 'Ciclope Festival', 'British Arrows', 'Shots', 'Clio Awards', 'D&AD', 'The One Show', 'Creative Circle', 'APA Show', 'YDA', 'VES', 'LIA', 'Other']

// CSR_QUESTIONS now imported from '@/lib/rfi-data' as SOCIAL_RESPONSIBILITY_QUESTIONS

const PEOPLE_ROLES = [
  'Executive Producer', 'Senior Producer', 'Junior Producer', 'Creative Research Lead',
  'Production Manager', 'Production Coordinator', 'Production Supervisor', 'Coordinator', 'Other',
]

const INVESTMENT_ITEMS = ['IT Equipment', 'Innovation', 'Sustainable Development', 'Media & Advertising', 'Training', 'Other']

// ── Component ─────────────────────────────────────────────────────────────────

export default function ProductionSignupPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const editId = searchParams.get('edit')
  const { user } = useAuth()
  const [isEditMode, setIsEditMode] = useState(false)
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [orgCreated, setOrgCreated] = useState(false)
  const [orgId, setOrgId] = useState('')
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteLink, setInviteLink] = useState('')
  const [copied, setCopied] = useState(false)

  // Step 1 — General Info
  const [businessName, setBusinessName] = useState('')
  const [dunsNumber, setDunsNumber] = useState('')
  const [vatNumber, setVatNumber] = useState('')
  const [legalForm, setLegalForm] = useState('')
  const [companyRegNumber, setCompanyRegNumber] = useState('')
  const [yearEstablished, setYearEstablished] = useState('')

  // Step 2 — Organisation
  const [employees, setEmployees] = useState('')
  const [companyLevel, setCompanyLevel] = useState('')
  const [parentCompany, setParentCompany] = useState('')
  const [category, setCategory] = useState('')
  const [currency, setCurrency] = useState('Euro - EUR')
  const [tradeOrganizations, setTradeOrganizations] = useState('')

  // Step 3 — Address
  const [countryCoverage, setCountryCoverage] = useState('')
  const [address, setAddress] = useState('')
  const [postcode, setPostcode] = useState('')
  const [city, setCity] = useState('')
  const [country, setCountry] = useState('')

  // Step 5 — Contacts
  const [contacts, setContacts] = useState<{ role: string; firstName: string; lastName: string; linkedin: string; telephone: string; mobile: string; email: string }[]>(
    CONTACT_ROLES.map(role => ({ role, firstName: '', lastName: '', linkedin: '', telephone: '', mobile: '', email: '' }))
  )

  // Step 5 — Social Media
  const [website, setWebsite] = useState('')
  const [twitter, setTwitter] = useState('')
  const [facebook, setFacebook] = useState('')
  const [linkedin, setLinkedin] = useState('')
  const [instagram, setInstagram] = useState('')
  const [tiktok, setTiktok] = useState('')
  const [pinterest, setPinterest] = useState('')
  const [tumblr, setTumblr] = useState('')
  const [snapchat, setSnapchat] = useState('')
  const [reddit, setReddit] = useState('')

  // Step 6 — Turnover & Clients
  const turnoverYears = getTurnoverYears()
  const REVENUE_REGIONS = ['Local', 'Global', 'NAM', 'Europe', 'LATAM', 'Africa', 'APAC']
  const [financials, setFinancials] = useState<Record<string, string>>({})
  const [clients, setClients] = useState([{ name: '', industry: '', activities: '', year: '', turnover: '', incidence: '', exclusivity: false }])
  const [workedWithClient, setWorkedWithClient] = useState<boolean | null>(null)
  const [clientPitch, setClientPitch] = useState([{ division: '', activities: '', year: '', turnover: '', incidence: '' }])
  const [clientDuration, setClientDuration] = useState('')

  // Step 7 — Competencies
  const [competencies, setCompetencies] = useState<Record<string, string>>({})

  // Step 8 — Sectors
  const [sectorPercentages, setSectorPercentages] = useState<Record<string, string>>({})

  // Step 9 — Post-Production
  const [hasInHousePost, setHasInHousePost] = useState<boolean | null>(null)
  const [postServices, setPostServices] = useState('')
  const [outsourcedPartners, setOutsourcedPartners] = useState([{ name: '', location: '', audio: false, video: false }])
  const [subcontracts, setSubcontracts] = useState<boolean | null>(null)
  const [outsourcedActivities, setOutsourcedActivities] = useState([{ activity: '', description: '', pct: '' }])

  // Step 10 — People & Directors
  const [people, setPeople] = useState(PEOPLE_ROLES.map(r => ({ role: r, employees: '', freelancers: '', salary: '' })))
  const [permanentEmployees, setPermanentEmployees] = useState('')
  const [freelancers, setFreelancers] = useState('')
  const [directors, setDirectors] = useState([{ name: '', exclusivity: false, priority: false, occasional: false }])
  const [investments, setInvestments] = useState<Record<string, string>>({})

  // Step 11 — Awards & CSR
  const [awards, setAwards] = useState<{ festival: string; distinction: string; category: string; year: string; ad: string; brand: string }[]>(
    AWARD_FESTIVALS.filter(f => f !== 'Other').map(festival => ({
      festival,
      distinction: '',
      category: '',
      year: '',
      ad: '',
      brand: '',
    })),
  )
  const [csr, setCsr] = useState<Record<string, boolean | null>>({})

  // Step 12 — About & AI
  const [about, setAbout] = useState('')
  const [philosophy, setPhilosophy] = useState('')
  const [networkDescription, setNetworkDescription] = useState('')
  const [localRepresentation, setLocalRepresentation] = useState('')
  const [governance, setGovernance] = useState({ quality: '', clientData: '', globalLocal: '', additional: '' })
  const [specificServices, setSpecificServices] = useState('')
  const [aiAnswers, setAiAnswers] = useState<Record<string, string>>({})
  const [strategicOrientation, setStrategicOrientation] = useState('')
  const [activityOutOfCountry, setActivityOutOfCountry] = useState<boolean | null>(null)

  useEffect(() => {
    if (editId) {
      const org = getOrgById(editId)
      if (org && org.profileData) {
        setIsEditMode(true)
        const p: any = org.profileData
        setBusinessName(p.businessName || '')
        setDunsNumber(p.dunsNumber || '')
        setVatNumber(p.vatNumber || '')
        setLegalForm(p.legalForm || '')
        setCompanyRegNumber(p.companyRegNumber || '')
        setYearEstablished(p.yearEstablished || '')
        setEmployees(p.employees || '')
        setCompanyLevel(p.companyLevel || '')
        setParentCompany(p.parentCompany || '')
        setCategory(p.category || '')
        setCurrency(p.currency || 'Euro - EUR')
        setTradeOrganizations(p.tradeOrganizations || '')
        setCountryCoverage(p.countryCoverage || '')
        setAddress(p.address || '')
        setPostcode(p.postcode || '')
        setCity(p.city || '')
        setCountry(p.country || '')
        if (p.contacts) setContacts(p.contacts)
        setWebsite(p.website || '')
        setTwitter(p.twitter || '')
        setFacebook(p.facebook || '')
        setLinkedin(p.linkedin || '')
        setInstagram(p.instagram || '')
        setTiktok(p.tiktok || '')
        if (p.financials) setFinancials(p.financials)
        if (p.clients) setClients(p.clients)
        if (p.workedWithClient !== undefined) setWorkedWithClient(p.workedWithClient)
        if (p.clientPitch) setClientPitch(p.clientPitch)
        setClientDuration(p.clientDuration || '')
        if (p.competencies) setCompetencies(p.competencies)
        if (p.sectorPercentages) setSectorPercentages(p.sectorPercentages)
        if (p.hasInHousePost !== undefined) setHasInHousePost(p.hasInHousePost)
        setPostServices(p.postServices || '')
        if (p.outsourcedPartners) setOutsourcedPartners(p.outsourcedPartners)
        if (p.subcontracts !== undefined) setSubcontracts(p.subcontracts)
        if (p.outsourcedActivities) setOutsourcedActivities(p.outsourcedActivities)
        if (p.people) setPeople(p.people)
        setPermanentEmployees(p.permanentEmployees || '')
        setFreelancers(p.freelancers || '')
        if (p.directors) setDirectors(p.directors)
        if (p.investments) setInvestments(p.investments)
        if (p.awards) setAwards(p.awards)
        if (p.csr) setCsr(p.csr)
        setAbout(p.about || '')
        setPhilosophy(p.philosophy || '')
        setNetworkDescription(p.networkDescription || '')
        setLocalRepresentation(p.localRepresentation || '')
        if (p.governance) setGovernance(p.governance)
        setSpecificServices(p.specificServices || '')
        if (p.aiAnswers) setAiAnswers(p.aiAnswers)
        setStrategicOrientation(p.strategicOrientation || '')
        if (p.activityOutOfCountry !== undefined) setActivityOutOfCountry(p.activityOutOfCountry)
      }
    }
  }, [editId])

  // ── Helpers ─────────────────────────────────────────────────────────────────

  const canProceed = () => {
    if (step === 1) return businessName.trim().length > 0
    if (step === 2) return employees !== '' && companyLevel !== ''
    if (step === 3) return city.trim().length > 0 && country.trim().length > 0
    return true
  }

  const updateContact = (idx: number, field: string, value: string) => {
    setContacts(prev => prev.map((c, i) => i === idx ? { ...c, [field]: value } : c))
  }

  const updateFinancials = (year: string, region: string, field: 'revenue' | 'ebita', value: string) => {
    setFinancials(prev => ({
      ...prev,
      [`${year}_${region}_${field}`]: value,
    }))
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    await new Promise(r => setTimeout(r, 1500))
    const profile = {
      businessName, dunsNumber, vatNumber, legalForm, companyRegNumber, yearEstablished,
      employees, companyLevel, parentCompany, category, currency, tradeOrganizations,
      countryCoverage, address, postcode, city, country,
      contacts,
      website, twitter, facebook, linkedin, instagram, tiktok,
      financials, clients, workedWithClient, clientPitch, clientDuration,
      competencies,
      sectorPercentages,
      hasInHousePost, postServices, outsourcedPartners, subcontracts, outsourcedActivities,
      people, permanentEmployees, freelancers, directors, investments,
      awards, csr,
      about, philosophy, networkDescription, localRepresentation, governance,
      specificServices, aiAnswers,
      strategicOrientation, activityOutOfCountry,
      submittedAt: new Date().toISOString(),
    }
    
    if (isEditMode && editId) {
      updateOrg(editId, {
        name: businessName,
        country: country,
        category: category,
        description: about.substring(0, 200),
        profileData: profile as Record<string, unknown>
      }, user?.id ?? 'admin')
      router.push('/admin/production')
      return;
    }

    const org = createOrg({
      name: businessName,
      country: country,
      category: category,
      description: about.substring(0, 200),
      type: 'production',
      profileData: profile as Record<string, unknown>
    }, user?.id ?? 'admin')
    
    setOrgId(org.id)
    setOrgCreated(true)
    setIsSubmitting(false)
    setStep(14)
  }

  const handleGenerateInvite = () => {
    const inv = createInvitation(orgId, businessName, 'production', user?.id ?? 'admin', inviteEmail || undefined)
    const url = `${window.location.origin}/signup/accept-invite?token=${inv.token}`
    setInviteLink(url)
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(inviteLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const PRODUCTION_COMPETENCIES = [
    {
      label: 'Pre-Production',
      items: ['Director Scouting', 'Location Scouting', 'Booklet Creation', 'Casting Scouting'],
    },
    {
      label: 'Production',
      items: ['Rental of Technical Equipment', 'Crew', 'Logistics for the Client', 'Purchase of HDDs for Footage', 'Delivery to Post-Production', 'Logistics for the Agency'],
    },
    {
      label: 'Post-Production (Coordination)',
      items: ['Coordination of Post-Production', 'Possibility of Delivering to Broadcasters'],
    },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 max-w-5xl w-full mx-auto px-4 pt-4 pb-10">
        
        <Link href="/admin/production" className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Production Companies
        </Link>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-[#7c3aed]/10 border border-[#7c3aed]/20 flex items-center justify-center">
            <Film className="w-5 h-5 text-[#7c3aed]" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">{isEditMode ? 'Edit Production Company' : 'Create Production Company'}</h1>
            <p className="text-white/40 text-sm">{isEditMode ? 'Update existing production house details' : 'Add a new production house to the directory'}</p>
          </div>
        </div>

        {/* Progress bar */}
        {step < 14 && (
          <>
        <div className="mb-10">
          <div className="flex items-center gap-0 overflow-x-auto pb-4 scrollbar-hide">
            {STEPS.map((s, i) => (
              <div key={s.id} className="flex items-center flex-shrink-0">
                <button
                  onClick={() => step > s.id && setStep(s.id)}
                  className={`flex items-center gap-1.5 px-2.5 py-2 rounded-lg text-xs font-medium transition-colors ${s.id === step ? 'bg-[#0763d8] text-white' : s.id < step ? 'text-[#0763d8] cursor-pointer hover:bg-white/[0.06]' : 'text-white/30 cursor-default'}`}
                >
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${s.id < step ? 'bg-[#0763d8] text-white' : s.id === step ? 'bg-white text-[#02030E]' : 'bg-white/[0.08] text-white/30'}`}>
                    {s.id < step ? <Check className="w-3 h-3" /> : s.id}
                  </span>
                  <span className="hidden md:inline">{s.label}</span>
                </button>
                {i < STEPS.length - 1 && <div className="w-4 h-px bg-white/[0.08] flex-shrink-0" />}
              </div>
            ))}
          </div>
          <div className="mt-3 h-1.5 bg-white/[0.06] rounded-full">
            <div className="h-full bg-[#0763d8] rounded-full transition-all duration-500" style={{ width: `${((step - 1) / (STEPS.length - 1)) * 100}%` }} />
          </div>
        </div>

        <div className="glass-card p-8">

          {/* STEP 1 — General Info */}
          {step === 1 && (
            <div>
              <StepHeader icon="🎬" title="General Information" subtitle="Legal identity of your production house" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <FormField label="Registered Business Name" required>
                  <Input value={businessName} onChange={e => setBusinessName(e.target.value)} placeholder="e.g. Acme Productions Ltd." />
                </FormField>
                <FormField label="D-U-N-S® Number">
                  <Input value={dunsNumber} onChange={e => setDunsNumber(e.target.value)} placeholder="9-digit number" />
                </FormField>
                <FormField label="VAT Registration Number">
                  <Input value={vatNumber} onChange={e => setVatNumber(e.target.value)} placeholder="e.g. GB123456789" />
                </FormField>
                <FormField label="Legal Form">
                  <Input value={legalForm} onChange={e => setLegalForm(e.target.value)} placeholder="e.g. Ltd, GmbH, S.A.S." />
                </FormField>
                <FormField label="Company Registration Number">
                  <Input value={companyRegNumber} onChange={e => setCompanyRegNumber(e.target.value)} placeholder="Companies House number" />
                </FormField>
                <FormField label="Year Established">
                  <Input type="number" value={yearEstablished} onChange={e => setYearEstablished(e.target.value)} placeholder="e.g. 2005" min={1800} max={2025} />
                </FormField>
              </div>
            </div>
          )}

          {/* STEP 2 — Organisation */}
          {step === 2 && (
            <div>
              <StepHeader icon="🏗️" title="Organisation & Structure" subtitle="Your company's size and corporate position" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <FormField label="# of Employees" required>
                  <select value={employees} onChange={e => setEmployees(e.target.value)} className={selectCls}>
                    <option value="">Select range</option>
                    {EMPLOYEE_RANGES.map(r => <option key={r}>{r}</option>)}
                  </select>
                </FormField>
                <FormField label="Company Level" required>
                  <select value={companyLevel} onChange={e => setCompanyLevel(e.target.value)} className={selectCls}>
                    <option value="">Select level</option>
                    {COMPANY_LEVELS.map(l => <option key={l}>{l}</option>)}
                  </select>
                </FormField>
                <FormField label="Parent Company Name">
                  <Input value={parentCompany} onChange={e => setParentCompany(e.target.value)} placeholder="If part of a group" />
                </FormField>
                <FormField label="Category">
                  <Input value={category} onChange={e => setCategory(e.target.value)} placeholder="e.g. Production Company" />
                </FormField>
                <FormField label="Agency Currency">
                  <select value={currency} onChange={e => setCurrency(e.target.value)} className={selectCls}>
                    {CURRENCIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </FormField>
                <FormField label="Trade Organizations">
                  <Input value={tradeOrganizations} onChange={e => setTradeOrganizations(e.target.value)} placeholder="e.g. APA, AICP, TPN" />
                </FormField>
              </div>
            </div>
          )}

          {/* STEP 3 — Address */}
          {step === 3 && (
            <div>
              <StepHeader icon="📍" title="Registered Office Address" subtitle="Official address and geographic coverage" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <FormField label="Country Coverage" className="sm:col-span-2">
                  <select value={countryCoverage} onChange={e => setCountryCoverage(e.target.value)} className={selectCls}>
                    <option value="">Select coverage</option>
                    {COUNTRY_COVERAGES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </FormField>
                <FormField label="Street Address" className="sm:col-span-2">
                  <Input value={address} onChange={e => setAddress(e.target.value)} placeholder="Street address" />
                </FormField>
                <FormField label="City" required>
                  <Input value={city} onChange={e => setCity(e.target.value)} placeholder="City" />
                </FormField>
                <FormField label="Postcode">
                  <Input value={postcode} onChange={e => setPostcode(e.target.value)} placeholder="Postcode / ZIP" />
                </FormField>
                <FormField label="Country" required className="sm:col-span-2">
                  <Input value={country} onChange={e => setCountry(e.target.value)} placeholder="Country" />
                </FormField>
              </div>
            </div>
          )}

          {/* STEP 4 — About */}
          {step === 4 && (
            <div>
              <StepHeader icon="✍️" title="About" subtitle="Describe your company and network" />
              <div className="space-y-6">
                <FormField label="About Your Production House">
                  <textarea value={about} onChange={e => setAbout(e.target.value)} rows={4} className={textareaCls} placeholder="A brief overview of your company..." />
                </FormField>
                <FormField label="Philosophy & Competitive Advantages">
                  <textarea value={philosophy} onChange={e => setPhilosophy(e.target.value)} rows={3} className={textareaCls} placeholder="What makes you different?" />
                </FormField>
                <FormField label="Network Description">
                  <textarea value={networkDescription} onChange={e => setNetworkDescription(e.target.value)} rows={2} className={textareaCls} placeholder="Your production network..." />
                </FormField>
                <FormField label="Local Representation">
                  <textarea value={localRepresentation} onChange={e => setLocalRepresentation(e.target.value)} rows={2} className={textareaCls} placeholder="Local offices or representatives..." />
                </FormField>
              </div>
            </div>
          )}

          {/* STEP 5 — Contacts */}
          {step === 5 && (
            <div>
              <StepHeader icon="👤" title="Contact Details" subtitle="Key people at your production house" />
              {/* Key Contacts */}
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs font-bold text-white/60 uppercase tracking-widest">Key Contacts</p>
                <Button type="button" variant="outline" onClick={() => setContacts(p => [...p, { role: 'Additional Contact', firstName: '', lastName: '', email: '', linkedin: '', telephone: '', mobile: '' }])} className="text-xs h-8 px-3">
                  <Plus className="w-3 h-3 mr-1" /> Add Contact
                </Button>
              </div>
              <div className="space-y-8">
                {contacts.map((contact, idx) => (
                  <div key={idx} className="border border-white/[0.1] rounded-xl p-5">
                    <div className="flex items-center justify-between mb-4">
                      {idx >= CONTACT_ROLES.length ? (
                        <Input value={contact.role} onChange={e => setContacts(p => p.map((c, i) => i === idx ? { ...c, role: e.target.value } : c))} placeholder="Role Name" className="max-w-[200px] h-8 text-sm font-bold bg-transparent border-b border-white/20 rounded-none px-0 text-white/70 uppercase tracking-wide focus-visible:ring-0 focus-visible:border-white/50" />
                      ) : (
                        <p className="text-sm font-bold text-white/70 uppercase tracking-wide">{contact.role}</p>
                      )}
                      {idx >= CONTACT_ROLES.length && (
                        <button onClick={() => setContacts(p => p.filter((_, i) => i !== idx))} className="text-red-400 hover:text-red-500 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField label="First Name"><Input value={contact.firstName} onChange={e => setContacts(p => p.map((c, i) => i === idx ? { ...c, firstName: e.target.value } : c))} placeholder="First name" /></FormField>
                      <FormField label="Last Name"><Input value={contact.lastName} onChange={e => setContacts(p => p.map((c, i) => i === idx ? { ...c, lastName: e.target.value } : c))} placeholder="Last name" /></FormField>
                      <FormField label="LinkedIn URL"><Input value={contact.linkedin} onChange={e => setContacts(p => p.map((c, i) => i === idx ? { ...c, linkedin: e.target.value } : c))} placeholder="linkedin.com/in/..." /></FormField>
                      <FormField label="Email"><Input type="email" value={contact.email} onChange={e => setContacts(p => p.map((c, i) => i === idx ? { ...c, email: e.target.value } : c))} placeholder="email@company.com" /></FormField>
                      <FormField label="Telephone"><Input value={contact.telephone} onChange={e => setContacts(p => p.map((c, i) => i === idx ? { ...c, telephone: e.target.value } : c))} placeholder="+44 20 ..." /></FormField>
                      <FormField label="Mobile"><Input value={contact.mobile} onChange={e => setContacts(p => p.map((c, i) => i === idx ? { ...c, mobile: e.target.value } : c))} placeholder="+44 7..." /></FormField>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 6 — Social Media */}
          {step === 6 && (
            <div>
              <StepHeader icon="🔗" title="Social Media & Online Presence" subtitle="Add your official profiles and website" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {[
                  { label: 'Official Website', val: website, set: setWebsite, ph: 'https://production.com' },
                  { label: 'LinkedIn', val: linkedin, set: setLinkedin, ph: 'linkedin.com/company/...' },
                  { label: 'X (Twitter)', val: twitter, set: setTwitter, ph: '@handle' },
                  { label: 'Instagram', val: instagram, set: setInstagram, ph: '@handle' },
                  { label: 'Facebook', val: facebook, set: setFacebook, ph: 'facebook.com/...' },
                  { label: 'TikTok', val: tiktok, set: setTiktok, ph: '@handle' },
                  { label: 'Pinterest', val: pinterest, set: setPinterest, ph: 'pinterest.com/...' },
                  { label: 'Tumblr', val: tumblr, set: setTumblr, ph: 'yourname.tumblr.com' },
                  { label: 'Snapchat', val: snapchat, set: setSnapchat, ph: '@handle' },
                  { label: 'Reddit', val: reddit, set: setReddit, ph: 'reddit.com/user/...' },
                ].map(({ label, val, set, ph }) => (
                  <FormField key={label} label={label}>
                    <Input value={val} onChange={e => set(e.target.value)} placeholder={ph} />
                  </FormField>
                ))}
              </div>
            </div>
          )}

          {/* STEP 7 — Turnover & Clients */}
          {step === 7 && (
            <div>
              <StepHeader icon="💰" title="Turnover & Clients" subtitle="Financial data in EUR — Annual Revenue and EBITDA per region and year" />
              <p className="text-xs text-[#999] mb-6">Please provide revenue in euros using full numeric format (e.g. 12345678)</p>

              <div className="overflow-x-auto mb-10">
                <table className="w-full text-sm border-collapse min-w-[700px]">
                  <thead>
                    <tr className="bg-[#2e3843] text-white">
                      <th className="text-left px-3 py-2.5 text-xs font-medium">Year / Metric</th>
                      {REVENUE_REGIONS.map(r => <th key={r} className="px-3 py-2.5 text-xs font-medium text-center">{r}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {turnoverYears.map((year, yi) => (
                      <React.Fragment key={year}>
                        <tr className={yi % 2 === 0 ? 'bg-white/[0.03]' : 'bg-white/[0.06]'}>
                          <td className="px-3 py-2 font-medium text-white/80 whitespace-nowrap">{year} — Revenue</td>
                          {REVENUE_REGIONS.map(region => (
                            <td key={region} className="px-2 py-1.5">
                              <input
                                type="number"
                                placeholder="0"
                                value={financials[`${year}_${region}_revenue`] || ''}
                                onChange={e => updateFinancials(year, region, 'revenue', e.target.value)}
                                className="w-full text-center text-xs border border-white/[0.12] rounded px-2 py-1.5 bg-white/[0.04] text-white focus:outline-none focus:ring-1 focus:ring-[#0763d8]"
                              />
                            </td>
                          ))}
                        </tr>
                        <tr className={yi % 2 === 0 ? 'bg-white/[0.03]' : 'bg-white/[0.06]'}>
                          <td className="px-3 py-2 text-white/50 pl-8 text-xs whitespace-nowrap">{year} — EBITDA</td>
                          {REVENUE_REGIONS.map(region => (
                            <td key={region} className="px-2 py-1.5">
                              <input
                                type="number"
                                placeholder="0"
                                value={financials[`${year}_${region}_ebita`] || ''}
                                onChange={e => updateFinancials(year, region, 'ebita', e.target.value)}
                                className="w-full text-center text-xs border border-white/[0.12] rounded px-2 py-1.5 bg-white/[0.04] text-white focus:outline-none focus:ring-1 focus:ring-[#0763d8]"
                              />
                            </td>
                          ))}
                        </tr>
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Main Clients */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm font-bold text-white/80">Main Clients</p>
                  <Button type="button" variant="outline" onClick={() => setClients(p => [...p, { name: '', industry: '', activities: '', year: '', turnover: '', incidence: '', exclusivity: false }])} className="text-xs h-8 px-3">
                    <Plus className="w-3 h-3 mr-1" /> Add Client
                  </Button>
                </div>
                <div className="space-y-4">
                  {clients.map((client, i) => (
                    <div key={i} className="border border-white/[0.1] rounded-xl p-5">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-bold text-white/40 uppercase">Client {i + 1}</span>
                        {clients.length > 1 && (
                          <button onClick={() => setClients(p => p.filter((_, idx) => idx !== i))} className="text-red-400 hover:text-red-600">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {[
                          { label: 'Client Name', key: 'name', placeholder: 'Brand name' },
                          { label: 'Industry', key: 'industry', placeholder: 'e.g. Automotive' },
                          { label: 'Principal Activities', key: 'activities', placeholder: 'TV, Digital...' },
                          { label: 'Year', key: 'year', placeholder: '2024' },
                          { label: 'Turnover (EUR)', key: 'turnover', placeholder: '0' },
                          { label: 'Client Incidence %', key: 'incidence', placeholder: '0' },
                        ].map(f => (
                          <FormField key={f.key} label={f.label}>
                            <Input
                              value={(client as any)[f.key] || ''}
                              onChange={e => setClients(p => p.map((c, idx) => idx === i ? { ...c, [f.key]: e.target.value } : c))}
                              placeholder={f.placeholder}
                            />
                          </FormField>
                        ))}
                        <FormField label="Exclusivity">
                          <label className="flex items-center gap-2 mt-2 cursor-pointer">
                            <input type="checkbox" checked={client.exclusivity} onChange={e => setClients(p => p.map((c, idx) => idx === i ? { ...c, exclusivity: e.target.checked } : c))} className="w-4 h-4 accent-[#0763d8]" />
                            <span className="text-sm">Yes</span>
                          </label>
                        </FormField>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pitch client check */}
              <div className="border border-white/[0.1] rounded-xl p-5 bg-yellow-500/[0.06]">
                <p className="text-sm font-bold text-white/80 mb-1">Pitch Process — Client Conflict Check</p>
                <p className="text-xs text-white/50 mb-4 flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-yellow-500/20 text-yellow-500 flex items-center justify-center text-[10px] font-bold">i</span>
                  Note: Please complete the section below only upon receipt of this Request for Information (RFI) during a pitch process.
                </p>
                <p className="text-sm text-white/60 mb-3">Is your company currently working or has previously worked with the client?</p>
                <div className="flex gap-4 mb-5">
                  {[true, false].map(v => (
                    <label key={String(v)} className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" checked={workedWithClient === v} onChange={() => setWorkedWithClient(v)} className="w-4 h-4 accent-[#0763d8]" />
                      <span className="text-sm">{v ? 'Yes' : 'No'}</span>
                    </label>
                  ))}
                </div>
                
                {workedWithClient === true && (
                  <div className="pt-5 border-t border-white/[0.06] space-y-4">
                    <p className="text-xs font-bold text-white/60 uppercase tracking-widest">Client Engagement Details</p>
                    <div className="space-y-3">
                      {clientPitch.map((pitch, idx) => (
                        <div key={idx} className="grid grid-cols-2 sm:grid-cols-5 gap-3 border border-white/[0.06] bg-white/[0.02] p-3 rounded-xl">
                          <FormField label="Division"><Input value={pitch.division} onChange={e => { const p = [...clientPitch]; p[idx].division = e.target.value; setClientPitch(p) }} placeholder="Client Division" className="text-xs" /></FormField>
                          <FormField label="Activities"><Input value={pitch.activities} onChange={e => { const p = [...clientPitch]; p[idx].activities = e.target.value; setClientPitch(p) }} placeholder="Principal Activities" className="text-xs" /></FormField>
                          <FormField label="Year"><Input value={pitch.year} onChange={e => { const p = [...clientPitch]; p[idx].year = e.target.value; setClientPitch(p) }} placeholder="Year" className="text-xs" /></FormField>
                          <FormField label="Turnover"><Input value={pitch.turnover} onChange={e => { const p = [...clientPitch]; p[idx].turnover = e.target.value; setClientPitch(p) }} placeholder="Turnover (EUR)" className="text-xs" /></FormField>
                          <FormField label="Incidence"><Input value={pitch.incidence} onChange={e => { const p = [...clientPitch]; p[idx].incidence = e.target.value; setClientPitch(p) }} placeholder="% incidence" className="text-xs" /></FormField>
                        </div>
                      ))}
                      <button onClick={() => setClientPitch(prev => [...prev, { division: '', activities: '', year: '', turnover: '', incidence: '' }])} className="text-xs text-yellow-500 hover:text-yellow-400 font-medium">+ Add row</button>
                    </div>
                    <FormField label="Duration of Engagement with the Client" className="pt-2">
                      <Input value={clientDuration} onChange={e => setClientDuration(e.target.value)} placeholder="e.g. 3 years" />
                    </FormField>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 8 — Competencies */}
          {step === 8 && (
            <div>
              <StepHeader icon="🎯" title="Knowledge & Competencies" subtitle="Select your communication areas and production capabilities by percentage" />

              {/* Communication Areas */}
              <div className="mb-8">
                <p className="text-xs font-bold text-white/50 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <span className="flex-1 h-px bg-white/[0.08]" />
                  Communication Areas
                  <span className="flex-1 h-px bg-white/[0.08]" />
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {SECTORS.map(area => (
                    <div key={area} className={`flex items-center gap-2 p-2.5 rounded-xl border transition-all text-sm ${sectorPercentages[area] ? 'bg-[#0763d8]/10 border-[#0763d8]/30 text-[#0763d8]' : 'bg-white/[0.03] border-white/[0.1] text-white/70'}`}>
                      <span className="flex-1 truncate" title={area}>{area}</span>
                      <div className="flex items-center gap-2 shrink-0">
                        <input type="number" min={0} max={100} value={sectorPercentages[area] || ''} onChange={e => setSectorPercentages(prev => ({ ...prev, [area]: e.target.value }))} className="w-16 text-sm text-center bg-white/[0.04] border border-white/[0.12] text-white rounded-lg py-1 focus:border-[#0763d8] outline-none" placeholder="0" />
                        <span className="text-sm text-white/40">%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                {PRODUCTION_COMPETENCIES.map(group => (
                  <div key={group.label}>
                    <p className="text-xs font-bold text-white/50 uppercase tracking-widest mb-3 flex items-center gap-2">
                      <span className="flex-1 h-px bg-white/[0.08]" />{group.label}<span className="flex-1 h-px bg-white/[0.08]" />
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                      {group.items.map(skill => (
                        <div key={skill} className={`flex items-center gap-2 p-2.5 rounded-xl border transition-all text-xs ${competencies[skill] ? 'bg-[#0763d8]/10 border-[#0763d8]/30 text-[#0763d8]' : 'bg-white/[0.03] border-white/[0.1]'}`}>
                          <span className="flex-1 truncate" title={skill}>{skill}</span>
                          <div className="flex items-center gap-1 shrink-0">
                            <input type="number" min={0} max={100} value={competencies[skill] || ''} onChange={e => setCompetencies(prev => ({ ...prev, [skill]: e.target.value }))} className="w-14 text-xs text-center bg-white/[0.04] border border-white/[0.08] text-white rounded-lg py-1" placeholder="0" />
                            <span className="text-xs text-white/30">%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 9 — Sectors */}
          {/* STEP 9 — Post Production & Activities */}
          {step === 9 && (
            <div>
              <StepHeader
                icon="🎞️"
                title="Post Production"
                subtitle="Please indicate whether you have an in-house post-production department and, if outsourced, which companies you usually collaborate with."
              />

              <div className="mb-8 border border-white/[0.1] rounded-xl p-6">
                <p className="text-sm font-bold text-white/80 mb-3">
                  Please; indicate whether you have an in-house post-production department. If so,
                  which services does it cover (editing, color grading, VFX, sound design, etc.)?
                </p>
                <div className="flex gap-6 mb-4">
                  {[true, false].map(v => (
                    <label key={String(v)} className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" checked={hasInHousePost === v} onChange={() => setHasInHousePost(v)} className="w-4 h-4 accent-[#0763d8]" />
                      <span className="text-sm">{v ? 'Yes' : 'No'}</span>
                    </label>
                  ))}
                </div>
                {hasInHousePost && (
                  <FormField label="Which services does it cover (editing, color grading, VFX, sound design, etc.)?">
                    <textarea
                      value={postServices}
                      onChange={e => setPostServices(e.target.value)}
                      rows={2}
                      className={textareaCls}
                      placeholder="Editing, color grading, VFX, sound design, etc."
                    />
                  </FormField>
                )}
              </div>

              {hasInHousePost === false && (
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-bold text-white/80">
                      If outsourced, which companies do you usually collaborate with?
                    </p>
                    <Button type="button" variant="outline" onClick={() => setOutsourcedPartners(p => [...p, { name: '', location: '', audio: false, video: false }])} className="text-xs h-8 px-3">
                      <Plus className="w-3 h-3 mr-1" /> Add Partner
                    </Button>
                  </div>
                  <div className="space-y-3">
                    {outsourcedPartners.map((p, i) => (
                      <div key={i} className="grid grid-cols-2 sm:grid-cols-4 gap-3 border border-white/[0.1] rounded-lg p-4">
                        <FormField label="Name"><Input value={p.name} onChange={e => setOutsourcedPartners(prev => prev.map((x, idx) => idx === i ? { ...x, name: e.target.value } : x))} placeholder="Company name" /></FormField>
                        <FormField label="Location"><Input value={p.location} onChange={e => setOutsourcedPartners(prev => prev.map((x, idx) => idx === i ? { ...x, location: e.target.value } : x))} placeholder="City, Country" /></FormField>
                        <FormField label="Audio">
                          <label className="flex items-center gap-2 mt-2 cursor-pointer">
                            <input type="checkbox" checked={p.audio} onChange={e => setOutsourcedPartners(prev => prev.map((x, idx) => idx === i ? { ...x, audio: e.target.checked } : x))} className="w-4 h-4 accent-[#0763d8]" />
                            <span className="text-sm">Yes</span>
                          </label>
                        </FormField>
                        <FormField label="Video">
                          <label className="flex items-center gap-2 mt-2 cursor-pointer">
                            <input type="checkbox" checked={p.video} onChange={e => setOutsourcedPartners(prev => prev.map((x, idx) => idx === i ? { ...x, video: e.target.checked } : x))} className="w-4 h-4 accent-[#0763d8]" />
                            <span className="text-sm">Yes</span>
                          </label>
                        </FormField>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="border border-white/[0.1] rounded-xl p-6">
                <p className="text-sm font-bold text-white/80 mb-3">Does your company subcontract activities or phases of service?</p>
                <div className="flex gap-6 mb-4">
                  {[true, false].map(v => (
                    <label key={String(v)} className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" checked={subcontracts === v} onChange={() => setSubcontracts(v)} className="w-4 h-4 accent-[#0763d8]" />
                      <span className="text-sm">{v ? 'Yes' : 'No'}</span>
                    </label>
                  ))}
                </div>
                {subcontracts && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-white/50">Outsourced Activities</p>
                      <Button type="button" variant="outline" onClick={() => setOutsourcedActivities(p => [...p, { activity: '', description: '', pct: '' }])} className="text-xs h-8 px-3">
                        <Plus className="w-3 h-3 mr-1" /> Add
                      </Button>
                    </div>
                    {outsourcedActivities.map((a, i) => (
                      <div key={i} className="grid grid-cols-3 gap-3 border border-white/[0.1] rounded-lg p-3">
                        <FormField label="Activity"><Input value={a.activity} onChange={e => setOutsourcedActivities(p => p.map((x, idx) => idx === i ? { ...x, activity: e.target.value } : x))} placeholder="Activity name" /></FormField>
                        <FormField label="Description"><Input value={a.description} onChange={e => setOutsourcedActivities(p => p.map((x, idx) => idx === i ? { ...x, description: e.target.value } : x))} placeholder="Detailed description" /></FormField>
                        <FormField label="% Contractual Value"><Input value={a.pct} onChange={e => setOutsourcedActivities(p => p.map((x, idx) => idx === i ? { ...x, pct: e.target.value } : x))} placeholder="0" /></FormField>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 10 — People & Directors */}
          {step === 10 && (
            <div>
              <StepHeader icon="👥" title="People, Directors & Investments" subtitle="Your team structure, key directors and investment allocations" />

              <div className="mb-8">
                <p className="text-sm font-bold text-white/80 mb-4">Team Structure</p>
                <div className="flex gap-5 mb-5">
                  <FormField label="# Permanent Employees (last fiscal year)">
                    <Input type="number" value={permanentEmployees} onChange={e => setPermanentEmployees(e.target.value)} placeholder="0" />
                  </FormField>
                  <FormField label="# Freelancers (last fiscal year)">
                    <Input type="number" value={freelancers} onChange={e => setFreelancers(e.target.value)} placeholder="0" />
                  </FormField>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse min-w-[500px]">
                    <thead>
                      <tr className="bg-white/[0.06]">
                        <th className="text-left px-4 py-2.5 text-xs font-medium text-white/50">Role</th>
                        <th className="px-3 py-2.5 text-xs font-medium text-white/50 text-center"># Employees</th>
                        <th className="px-3 py-2.5 text-xs font-medium text-white/50 text-center"># Freelancers</th>
                        <th className="px-3 py-2.5 text-xs font-medium text-white/50 text-center">Avg. Annual Salary</th>
                      </tr>
                    </thead>
                    <tbody>
                      {people.map((row, i) => (
                        <tr key={row.role} className={i % 2 === 0 ? 'bg-white/[0.03]' : 'bg-white/[0.06]'}>
                          <td className="px-4 py-2 text-sm text-white/70">{row.role}</td>
                          {['employees', 'freelancers', 'salary'].map(field => (
                            <td key={field} className="px-2 py-1.5">
                              <input type="number" placeholder="0" value={(row as Record<string, string>)[field] || ''} onChange={e => setPeople(p => p.map((r, idx) => idx === i ? { ...r, [field]: e.target.value } : r))} className="w-full text-center text-xs border border-white/[0.12] rounded px-2 py-1.5 bg-white/[0.04] text-white focus:outline-none focus:ring-1 focus:ring-[#0763d8]" />
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm font-bold text-white/80">Key Directors</p>
                  <Button type="button" variant="outline" onClick={() => setDirectors(p => [...p, { name: '', exclusivity: false, priority: false, occasional: false }])} className="text-xs h-8 px-3">
                    <Plus className="w-3 h-3 mr-1" /> Add Director
                  </Button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse min-w-[400px]">
                    <thead>
                      <tr className="bg-white/[0.06]">
                        <th className="text-left px-4 py-2.5 text-xs font-medium text-white/50">Director Name</th>
                        <th className="px-3 py-2.5 text-xs font-medium text-white/50 text-center">Exclusivity</th>
                        <th className="px-3 py-2.5 text-xs font-medium text-white/50 text-center">Priority</th>
                        <th className="px-3 py-2.5 text-xs font-medium text-white/50 text-center">Occasional</th>
                        <th className="px-3 py-2.5"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {directors.map((d, i) => (
                        <tr key={i} className={i % 2 === 0 ? 'bg-white/[0.03]' : 'bg-white/[0.06]'}>
                          <td className="px-2 py-1.5">
                            <Input value={d.name} onChange={e => setDirectors(p => p.map((r, idx) => idx === i ? { ...r, name: e.target.value } : r))} placeholder="Full name" />
                          </td>
                          {['exclusivity', 'priority', 'occasional'].map(field => (
                            <td key={field} className="px-3 py-1.5 text-center">
                              <input type="checkbox" checked={(d as any)[field] || false} onChange={e => setDirectors(p => p.map((r, idx) => idx === i ? { ...r, [field]: e.target.checked } : r))} className="w-4 h-4 accent-[#0763d8]" />
                            </td>
                          ))}
                          <td className="px-2">
                            {directors.length > 1 && <button onClick={() => setDirectors(p => p.filter((_, idx) => idx !== i))} className="text-red-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="border-t border-white/[0.08] pt-6">
                <h3 className="text-sm font-semibold text-white/80 mb-4 flex items-center gap-2">
                  <span className="w-1 h-4 bg-[#0763d8] rounded-full" aria-hidden />
                  Investments (% of Turnover)
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
                  {INVESTMENT_ITEMS.map(item => (
                    <div
                      key={item}
                      className="flex items-center gap-3 bg-white/[0.04] rounded-lg px-4 py-2.5"
                    >
                      <span className="text-sm text-white/60 flex-1">{item}</span>
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          min={0}
                          max={100}
                          value={investments[item] || ''}
                          onChange={e =>
                            setInvestments(prev => ({ ...prev, [item]: e.target.value }))
                          }
                          className="w-16 text-sm text-center border border-white/[0.12] rounded-lg py-1 bg-white/[0.04] text-white focus:outline-none focus:ring-2 focus:ring-[#0763d8]"
                          placeholder="0"
                        />
                        <span className="text-sm text-white/40">%</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-white/[0.08] pt-6 space-y-4">
                  <h3 className="text-sm font-semibold text-white/80 mb-2 flex items-center gap-2">
                    <span className="w-1 h-4 bg-[#0763d8] rounded-full" aria-hidden />
                    RIF. / Requests
                  </h3>
                  <FormField label="1.1 Could you please present your strategic development">
                    <textarea
                      value={strategicOrientation}
                      onChange={e => setStrategicOrientation(e.target.value)}
                      rows={3}
                      className={textareaCls}
                      placeholder="Write your answer (NOTE column) for request 1.1 here..."
                    />
                  </FormField>
                  <FormField label="1.2 Do you have any activity out of your Country / City?">
                    <textarea
                      value={activityOutOfCountry === null ? '' : activityOutOfCountry ? 'Yes' : 'No'}
                      onChange={e =>
                        setActivityOutOfCountry(
                          e.target.value.trim().toLowerCase().startsWith('y')
                            ? true
                            : e.target.value.trim().toLowerCase().startsWith('n')
                            ? false
                            : null,
                        )
                      }
                      rows={2}
                      className={textareaCls}
                      placeholder="Write your answer (NOTE column) for request 1.2 here..."
                    />
                  </FormField>
                </div>
              </div>
            </div>
          )}

          {/* STEP 11 — Awards & CSR */}
          {step === 11 && (
            <div>
              <StepHeader icon="🏆" title="Awards & Social Responsibility" subtitle="List your award wins and answer CSR questions" />

              <div className="mb-10">
                <p className="text-sm font-bold text-white/80 mb-4">Award Wins</p>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse min-w-[700px]">
                    <thead>
                      <tr className="bg-white/[0.06]">
                        {['Festival', 'Distinction', 'Category', 'Year', 'Awarded Ad', 'Brand', ''].map(h => (
                          <th key={h || 'action'} className="text-left px-3 py-2.5 text-xs font-medium text-white/50">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {awards.map((award, i) => (
                        <tr key={i} className={i % 2 === 0 ? 'bg-white/[0.03]' : 'bg-white/[0.06]'}>
                          <td className="px-2 py-1.5">
                            <input value={award.festival} onChange={e => setAwards(p => p.map((a, idx) => idx === i ? { ...a, festival: e.target.value } : a))} className="w-full text-xs border border-white/[0.12] rounded px-2 py-1.5 bg-white/[0.04] text-white focus:outline-none focus:ring-1 focus:ring-[#0763d8]" placeholder="Festival" />
                          </td>
                          {['distinction', 'category', 'year', 'ad', 'brand'].map(field => (
                            <td key={field} className="px-2 py-1.5">
                              <input value={(award as Record<string, string>)[field] || ''} onChange={e => setAwards(p => p.map((a, idx) => idx === i ? { ...a, [field]: e.target.value } : a))} className="w-full text-xs border border-white/[0.12] rounded px-2 py-1.5 bg-white/[0.04] text-white focus:outline-none focus:ring-1 focus:ring-[#0763d8]" placeholder="—" />
                            </td>
                          ))}
                          <td className="px-2">
                            <button onClick={() => setAwards(prev => prev.filter((_, idx) => idx !== i))} className="text-red-400 hover:text-red-300 p-1 shrink-0"><Trash2 className="w-4 h-4" /></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <button onClick={() => setAwards(prev => [...prev, { festival: '', distinction: '', category: '', year: '', ad: '', brand: '' }])} className="text-xs text-[#0763d8] hover:bg-[#0763d8]/10 px-3 py-1.5 rounded-lg border border-[#0763d8]/30 transition-colors inline-block mt-3">+ Add Award</button>
              </div>

              <div className="border-t border-white/[0.08] pt-6">
                <h3 className="text-sm font-semibold text-white/80 mb-4 flex items-center gap-2">
                  <span className="w-1 h-4 bg-[#0763d8] rounded-full" aria-hidden />
                  Social Responsibility
                </h3>
                <div className="space-y-3">
                  {SOCIAL_RESPONSIBILITY_QUESTIONS.map(q => (
                    <div key={q.id}>
                      <div className="flex items-start gap-4 p-4 rounded-xl border border-white/[0.1] bg-white/[0.03]">
                        <span className="text-xs font-bold text-white/30 w-8 shrink-0 mt-0.5">{q.id}</span>
                        <p className="text-sm text-white/60 flex-1">{q.text}</p>
                        <div className="flex gap-4 shrink-0">
                          {[true, false].map(v => (
                            <label key={String(v)} className="flex items-center gap-1 cursor-pointer">
                              <input type="radio" checked={csr[q.id] === v} onChange={() => setCsr(p => ({ ...p, [q.id]: v }))} className="w-3.5 h-3.5 accent-[#0763d8]" />
                              <span className="text-xs text-white/50">{v ? 'Yes' : 'No'}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                      {q.id === '1.6' && (
                        <div className="ml-12 mt-2 grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {CSR_IMPACT_AREAS.map(area => (
                            <label key={area} className="flex items-center gap-2 bg-white/[0.04] rounded-lg p-2 cursor-pointer hover:bg-white/[0.08] transition border border-white/[0.1]">
                              <input type="checkbox" checked={!!csr[`impact-${area}`]} onChange={e => setCsr(p => ({ ...p, [`impact-${area}`]: e.target.checked }))} className="w-3.5 h-3.5 accent-[#0763d8]" />
                              <span className="text-xs text-white/50">{area}</span>
                            </label>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 12 — Governance & AI */}
          {step === 12 && (
            <div>
              <StepHeader icon="🏛️" title="Governance & AI" subtitle="Describe your governance model and AI approach" />
              <div className="space-y-6">
                <div>
                  <p className="text-sm font-bold text-white/80 mb-4">Governance & Scope of Work</p>
                  <div className="space-y-4">
                    <FormField label="Kindly detail the control and quality assurance systems established within your designated Creative Network for the purpose of monitoring and managing performance and Service Level Agreements (SLAs).">
                      <textarea value={governance.quality} onChange={e => setGovernance(p => ({ ...p, quality: e.target.value }))} rows={3} className={textareaCls} placeholder="Describe your QA and SLA systems..." />
                    </FormField>
                    <FormField label="Please outline the protocols in place for managing client data within your selected Creative Network, particularly if these differ from those of the Holding Group. Furthermore, please specify if your Creative Network utilises its own Data Management Platform (DMP).">
                      <textarea value={governance.clientData} onChange={e => setGovernance(p => ({ ...p, clientData: e.target.value }))} rows={3} className={textareaCls} placeholder="How you handle client data, DMP usage..." />
                    </FormField>
                    <FormField label="With regard to global brand governance, please clarify the distinction between global and local strategies. Describe the processes, including tools, systems, and the level of autonomy within a structured framework, employed to manage global governance and local adaptation.">
                      <textarea value={governance.globalLocal} onChange={e => setGovernance(p => ({ ...p, globalLocal: e.target.value }))} rows={3} className={textareaCls} placeholder="Describe global vs local governance..." />
                    </FormField>
                    <FormField label="Please include any additional information that you deem pertinent.">
                      <textarea value={governance.additional} onChange={e => setGovernance(p => ({ ...p, additional: e.target.value }))} rows={3} className={textareaCls} placeholder="Any additional relevant information..." />
                    </FormField>
                  </div>
                </div>

                <div className="border-t border-white/[0.06] pt-6">
                  <p className="text-sm font-bold text-white/80 mb-2">Strategic Development</p>
                  <FormField label="Strategic development orientation">
                    <textarea value={strategicOrientation} onChange={e => setStrategicOrientation(e.target.value)} rows={2} className={textareaCls} placeholder="Your strategic direction and plans..." />
                  </FormField>
                  <div className="mt-4">
                    <p className="text-sm font-medium text-white/70 mb-2">Do you have activity outside your Country / City?</p>
                    <div className="flex gap-6">
                      {[true, false].map(v => (
                        <label key={String(v)} className="flex items-center gap-2 cursor-pointer">
                          <input type="radio" checked={activityOutOfCountry === v} onChange={() => setActivityOutOfCountry(v)} className="w-4 h-4 accent-[#0763d8]" />
                          <span className="text-sm">{v ? 'Yes' : 'No'}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                {/* ── Divider ── */}
                <div className="border-t border-white/[0.08] my-8" aria-hidden />

                {/* AI Usage */}
                <div>
                  <h3 className="text-sm font-semibold text-white/80 mb-5 flex items-center gap-2">
                    <span className="w-1 h-4 bg-[#0763d8] rounded-full" aria-hidden />
                    AI Usage
                  </h3>
                  <div className="space-y-4">
                    {AI_QUESTIONS.map((q, i) => (
                      <FormField key={i} label={q}>
                        <textarea
                          value={aiAnswers[`ai-${i}`] || ''}
                          onChange={e => setAiAnswers(prev => ({ ...prev, [`ai-${i}`]: e.target.value }))}
                          rows={2}
                          className={textareaCls}
                        />
                      </FormField>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 13 — Attachments */}
          {step === 13 && (
            <div>
              <StepHeader icon="📎" title="Attachments" subtitle="Upload required documents and presentation" />
              <div className="space-y-6">
                <div>
                  <p className="text-sm font-bold text-white/80 mb-4">Attachments Requested</p>
                  <div className="space-y-3">
                    {ATTACHMENTS_REQUESTED.map(att => (
                      <div key={att.id} className="flex items-center gap-4 bg-white/[0.03] rounded-xl px-4 py-3">
                        <span className="text-xs font-bold text-white/30 w-8">{att.id}</span>
                        <p className="text-sm text-white/60 flex-1">{att.label}</p>
                        <label className="flex items-center gap-2 px-3 py-1.5 bg-white/[0.04] border border-white/[0.08] rounded-lg cursor-pointer hover:bg-white/[0.08] transition">
                          <Upload className="w-3.5 h-3.5 text-white/40" />
                          <span className="text-xs text-white/50">Upload</span>
                        <input type="file" accept=".pdf" className="hidden" />
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-white/[0.06] pt-6">
                  <p className="text-sm font-bold text-white/80 mb-2">Presentation Request</p>
                  <p className="text-xs text-white/40 mb-3">Please provide a presentation (.pdf file) summarizing the following items and questions:</p>
                  <p className="text-xs text-white/30 mb-4">At this stage we would like to see key agency capabilities and credentials before moving to a full pitch. Please use this opportunity to show off your agencies, your expertise and your achievements.</p>
                  <div className="bg-white/[0.03] rounded-xl p-4 mb-4">
                    <p className="text-xs font-semibold text-white/60 mb-2">Your presentation should include the following:</p>
                    <ul className="list-disc list-inside space-y-1.5 text-xs text-white/40">
                      <li>Short agency presentation including key figures, key capabilities and services offered, main technologies and platforms managed, headcounts, organization, main clients.</li>
                      <li>Expertise of your agency</li>
                      <li>Management of International accounts: outline your organisational team structure and explain how you would deliver digital strategies and activities across brands at a country level. Please provide client references.</li>
                      <li>Please provide contact details for 2 current clients who would be happy to talk to us about their experiences of working with you.</li>
                    </ul>
                  </div>
                  <label className="flex items-center gap-3 px-4 py-3 bg-white/[0.04] border border-dashed border-white/[0.12] rounded-xl cursor-pointer hover:bg-white/[0.06] transition">
                    <Upload className="w-5 h-5 text-[#0763d8]" />
                    <span className="text-sm text-white/50">Upload Presentation (.pdf)</span>
                    <input type="file" accept=".pdf" className="hidden" />
                  </label>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Nav buttons */}
        <div className="flex items-center justify-between mt-6">
          <div>
            {step > 1 ? (
              <Button variant="outline" onClick={() => setStep(s => s - 1)} className="border-border text-foreground hover:bg-muted rounded-full">
                <ChevronLeft className="w-4 h-4 mr-1" /> Back
              </Button>
            ) : (
              <div />
            )}
          </div>
          <div className="flex items-center gap-3">
            {step < STEPS.length ? (
              <>
                <Button variant="ghost" className="text-white/40 hover:text-white" onClick={() => setStep(s => s + 1)}>Skip for now</Button>
                <Button onClick={() => setStep(s => s + 1)} disabled={!canProceed()} className="bg-[#7c3aed] hover:bg-[#6d28d9] text-white px-6 rounded-full">
                  Continue <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </>
            ) : step === 13 ? (
              <Button onClick={handleSubmit} disabled={isSubmitting} className="bg-[#7c3aed] hover:bg-[#6d28d9] text-white px-8 rounded-full">
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" /><path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="4" className="opacity-75" /></svg>
                    {isEditMode ? 'Updating...' : 'Creating...'}
                  </span>
                ) : (
                  <><Film className="w-4 h-4 mr-2" /> {isEditMode ? 'Update Profile' : 'Create Production Profile'}</>
                )}
              </Button>
            ) : null}
          </div>
        </div>
        </>
        )}

        {/* STEP 14 — Success & Invite Link */}
        {step === 14 && (
          <div className="max-w-xl mx-auto mt-10">
            <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-5 flex items-center gap-3 mb-6">
              <Check className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <p className="font-medium text-white">{businessName} created successfully!</p>
                <p className="text-sm text-white/50">Now invite the first moderator to manage this production profile.</p>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-6 space-y-4 mb-6">
              <div className="flex items-center gap-2">
                <LinkIcon className="w-4 h-4 text-[#7c3aed]" />
                <h2 className="font-semibold text-white text-sm">Invite First Moderator</h2>
              </div>
              <p className="text-xs text-white/40">Generate an invite link to send to the person who will own and manage this production company profile.</p>
              <div>
                <label className="block text-xs font-medium text-white/60 mb-1.5">Moderator Email (optional)</label>
                <Input value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} type="email" placeholder="email@production.com" className="h-10 bg-white/[0.04] border-white/[0.1] text-white placeholder:text-white/30 rounded-xl" />
              </div>

              {!inviteLink ? (
                <Button onClick={handleGenerateInvite} className="w-full h-10 bg-[#7c3aed] hover:bg-[#6d28d9] text-white rounded-xl">
                  Generate Invite Link
                </Button>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 bg-white/[0.04] border border-white/[0.1] rounded-xl px-3 py-2.5">
                    <p className="flex-1 text-xs text-white/60 truncate font-mono">{inviteLink}</p>
                    <button onClick={handleCopy} className={`shrink-0 transition-colors ${copied ? 'text-emerald-400' : 'text-white/40 hover:text-white'}`}>
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-xs text-white/30">Share this link with the production owner. They must sign up using a corporate email.</p>
                </div>
              )}
            </div>

            <div className="flex justify-center">
              <Link href="/admin/production">
                <Button variant="outline" className="h-10 border-white/[0.1] text-white/60 hover:text-white rounded-xl px-8">
                  Back to Companies List
                </Button>
              </Link>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

// ── Sub-components ────────────────────────────────────────────────────────────

function StepHeader({ icon, title, subtitle }: { icon: string; title: string; subtitle: string }) {
  return (
    <div className="mb-8 pb-6 border-b border-white/[0.06]">
      <div className="flex items-center gap-3 mb-2">
        <span className="text-2xl">{icon}</span>
        <h2 className="text-2xl font-bold text-white">{title}</h2>
      </div>
      <p className="text-white/40 text-sm ml-9">{subtitle}</p>
    </div>
  )
}

function FormField({ label, required, children, className }: { label: string; required?: boolean; children: React.ReactNode; className?: string }) {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-white/70 mb-1.5">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      {children}
    </div>
  )
}

const selectCls = 'w-full border border-white/[0.12] rounded-xl px-3 py-2.5 text-sm bg-white/[0.06] text-white focus:outline-none focus:ring-2 focus:ring-[#0763d8] [&_option]:bg-[#1a1d2e] [&_option]:text-white'
const textareaCls = 'w-full border border-white/[0.12] rounded-2xl px-3 py-2.5 text-sm bg-white/[0.06] text-white focus:outline-none focus:ring-2 focus:ring-[#0763d8] resize-none'
