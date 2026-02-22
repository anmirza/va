'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ChevronRight, ChevronLeft, Check, Film, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

// ── Step definitions ──────────────────────────────────────────────────────────

const STEPS = [
  { id: 1, label: 'General Info' },
  { id: 2, label: 'Organisation' },
  { id: 3, label: 'Address' },
  { id: 4, label: 'Contacts' },
  { id: 5, label: 'Social Media' },
  { id: 6, label: 'Turnover & Clients' },
  { id: 7, label: 'Competencies' },
  { id: 8, label: 'Sectors' },
  { id: 9, label: 'Post-Production' },
  { id: 10, label: 'People & Directors' },
  { id: 11, label: 'Awards & CSR' },
  { id: 12, label: 'About & AI' },
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

const CAPABILITY_AREAS = [
  'Strategic & Consulting', 'Creative & Content', 'Audio / Visual Production',
  'PR & Events', 'Above the Line', 'Below the Line', 'Digital Marketing',
  'Social Media & Influencer Marketing', 'Technology & Digital', 'Analytics & Reporting',
  'Email & Content Marketing', 'Trade Marketing', 'Retail', 'Media',
]

const CSR_QUESTIONS = [
  { id: '1.1', q: 'Does your company have gender equality policies in place?' },
  { id: '1.2', q: 'Does your company adopt policies and control systems against discrimination?' },
  { id: '1.3', q: 'Does your company provide human rights education and training programmes?' },
  { id: '1.4', q: 'Does your company run projects in the social and environmental sectors?' },
  { id: '1.5', q: 'Has your company established partnerships with non-profits or social enterprises?' },
  { id: '1.7', q: 'Has your company appointed a CSR Manager or established a dedicated CSR unit?' },
  { id: '1.8', q: 'Does your company conduct periodic social reporting (e.g. sustainability reports)?' },
  { id: '1.9', q: 'Does your company apply ethical and environmental criteria when selecting suppliers?' },
  { id: '1.10', q: 'Does your company require its suppliers to hold social/environmental certifications?' },
  { id: '1.11', q: 'Does your company carry out awareness-raising initiatives on CSR for suppliers?' },
]

const PEOPLE_ROLES = [
  'Executive Producer', 'Senior Producer', 'Junior Producer', 'Creative Research Lead',
  'Production Manager', 'Production Coordinator', 'Production Supervisor', 'Coordinator', 'Other',
]

const INVESTMENT_ITEMS = ['IT Equipment', 'Innovation', 'Sustainable Development', 'Media & Advertising', 'Training', 'Other']

// ── Component ─────────────────────────────────────────────────────────────────

export default function ProductionSignupPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)

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
  const [currency, setCurrency] = useState('Euro - EUR')
  const [tradeOrganizations, setTradeOrganizations] = useState('')

  // Step 3 — Address
  const [countryCoverage, setCountryCoverage] = useState('')
  const [address, setAddress] = useState('')
  const [postcode, setPostcode] = useState('')
  const [city, setCity] = useState('')
  const [country, setCountry] = useState('')

  // Step 4 — Contacts
  const [contacts, setContacts] = useState(
    CONTACT_ROLES.map(role => ({ role, firstName: '', lastName: '', linkedin: '', telephone: '', mobile: '', email: '' }))
  )

  // Step 5 — Social Media
  const [website, setWebsite] = useState('')
  const [twitter, setTwitter] = useState('')
  const [facebook, setFacebook] = useState('')
  const [linkedin, setLinkedin] = useState('')
  const [instagram, setInstagram] = useState('')
  const [tiktok, setTiktok] = useState('')

  // Step 6 — Turnover & Clients
  const YEARS = ['2024', '2023', '2022', '2021', '2020']
  const REVENUE_REGIONS = ['Local', 'Global', 'NAM', 'Europe', 'LATAM', 'Africa', 'APAC']
  const [financials, setFinancials] = useState<Record<string, string>>({})
  const [clients, setClients] = useState([{ name: '', industry: '', activities: '', year: '', turnover: '', incidence: '', exclusivity: false }])
  const [workedWithClient, setWorkedWithClient] = useState<boolean | null>(null)

  // Step 7 — Competencies
  const [competencies, setCompetencies] = useState<Record<string, boolean>>({})
  const [capabilityAllocation, setCapabilityAllocation] = useState<Record<string, string>>({})

  // Step 8 — Sectors
  const [selectedSectors, setSelectedSectors] = useState<Record<string, boolean>>({})

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
  const [awards, setAwards] = useState(AWARD_FESTIVALS.map(f => ({ festival: f, distinction: '', category: '', year: '', ad: '', brand: '' })))
  const [csr, setCsr] = useState<Record<string, boolean | null>>({})

  // Step 12 — About & AI
  const [about, setAbout] = useState('')
  const [philosophy, setPhilosophy] = useState('')
  const [networkDescription, setNetworkDescription] = useState('')
  const [localRepresentation, setLocalRepresentation] = useState('')
  const [governance, setGovernance] = useState({ quality: '', clientData: '', globalLocal: '', additional: '' })
  const [specificServices, setSpecificServices] = useState('')
  const [aiCurrentTools, setAiCurrentTools] = useState('')
  const [aiFuture, setAiFuture] = useState('')
  const [aiBenefits, setAiBenefits] = useState('')
  const [aiEthics, setAiEthics] = useState('')
  const [aiRisk, setAiRisk] = useState('')
  const [strategicOrientation, setStrategicOrientation] = useState('')
  const [activityOutOfCountry, setActivityOutOfCountry] = useState<boolean | null>(null)

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

  const allocationTotal = Object.values(capabilityAllocation).reduce((sum, v) => sum + (parseFloat(v) || 0), 0)

  const handleSubmit = async () => {
    setIsSubmitting(true)
    await new Promise(r => setTimeout(r, 1500))
    const profile = {
      businessName, dunsNumber, vatNumber, legalForm, companyRegNumber, yearEstablished,
      employees, companyLevel, parentCompany, currency, tradeOrganizations,
      countryCoverage, address, postcode, city, country,
      contacts,
      website, twitter, facebook, linkedin, instagram, tiktok,
      financials, clients, workedWithClient,
      competencies, capabilityAllocation,
      selectedSectors,
      hasInHousePost, postServices, outsourcedPartners, subcontracts, outsourcedActivities,
      people, permanentEmployees, freelancers, directors, investments,
      awards, csr,
      about, philosophy, networkDescription, localRepresentation, governance,
      specificServices, aiCurrentTools, aiFuture, aiBenefits, aiEthics, aiRisk,
      strategicOrientation, activityOutOfCountry,
      submittedAt: new Date().toISOString(),
    }
    localStorage.setItem('va_production_profile', JSON.stringify(profile))
    router.push('/dashboard/production?registered=true')
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
    <div className="min-h-screen bg-[#eef0f3] flex flex-col">
      {/* Header */}
      <header className="bg-[#2e3843] px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <Link href="/" className="text-xl font-bold text-white">VA</Link>
        <div className="flex items-center gap-3">
          <span className="text-xs text-white/50">Step {step} of {STEPS.length}</span>
          <Link href="/login" className="text-sm text-white/70 hover:text-white">Already listed? Sign in</Link>
        </div>
      </header>

      <div className="flex-1 max-w-4xl mx-auto w-full px-4 py-10">
        {/* Progress bar */}
        <div className="mb-10">
          <div className="flex items-center gap-0 overflow-x-auto pb-2">
            {STEPS.map((s, i) => (
              <div key={s.id} className="flex items-center flex-shrink-0">
                <button
                  onClick={() => step > s.id && setStep(s.id)}
                  className={`flex items-center gap-1.5 px-2.5 py-2 rounded-lg text-xs font-medium transition-colors ${s.id === step ? 'bg-[#2e3843] text-white' : s.id < step ? 'text-[#4fc487] cursor-pointer hover:bg-[#d8dce2]' : 'text-[#aaa] cursor-default'}`}
                >
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${s.id < step ? 'bg-[#4fc487] text-white' : s.id === step ? 'bg-white text-[#2e3843]' : 'bg-[#d8dce2] text-[#666]'}`}>
                    {s.id < step ? <Check className="w-3 h-3" /> : s.id}
                  </span>
                  <span className="hidden md:inline">{s.label}</span>
                </button>
                {i < STEPS.length - 1 && <div className="w-4 h-px bg-[#d8dce2] flex-shrink-0" />}
              </div>
            ))}
          </div>
          <div className="mt-3 h-1.5 bg-[#d8dce2] rounded-full">
            <div className="h-full bg-[#4fc487] rounded-full transition-all duration-500" style={{ width: `${((step - 1) / (STEPS.length - 1)) * 100}%` }} />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-8">

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
                <FormField label="Number of Employees" required>
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
                <FormField label="Currency">
                  <select value={currency} onChange={e => setCurrency(e.target.value)} className={selectCls}>
                    {CURRENCIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </FormField>
                <FormField label="Trade Organisations" className="sm:col-span-2">
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

          {/* STEP 4 — Contacts */}
          {step === 4 && (
            <div>
              <StepHeader icon="👤" title="Contact Details" subtitle="Key people at your production house" />
              <div className="space-y-8">
                {contacts.map((contact, idx) => (
                  <div key={contact.role} className="border border-[#e5e5e1] rounded-xl p-5">
                    <p className="text-sm font-bold text-[#2e3843] mb-4 uppercase tracking-wide">{contact.role}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField label="First Name"><Input value={contact.firstName} onChange={e => updateContact(idx, 'firstName', e.target.value)} placeholder="First name" /></FormField>
                      <FormField label="Last Name"><Input value={contact.lastName} onChange={e => updateContact(idx, 'lastName', e.target.value)} placeholder="Last name" /></FormField>
                      <FormField label="LinkedIn URL"><Input value={contact.linkedin} onChange={e => updateContact(idx, 'linkedin', e.target.value)} placeholder="linkedin.com/in/..." /></FormField>
                      <FormField label="Email"><Input type="email" value={contact.email} onChange={e => updateContact(idx, 'email', e.target.value)} placeholder="email@company.com" /></FormField>
                      <FormField label="Telephone"><Input value={contact.telephone} onChange={e => updateContact(idx, 'telephone', e.target.value)} placeholder="+44 20 ..." /></FormField>
                      <FormField label="Mobile"><Input value={contact.mobile} onChange={e => updateContact(idx, 'mobile', e.target.value)} placeholder="+44 7..." /></FormField>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 5 — Social Media */}
          {step === 5 && (
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
                ].map(({ label, val, set, ph }) => (
                  <FormField key={label} label={label}>
                    <Input value={val} onChange={e => set(e.target.value)} placeholder={ph} />
                  </FormField>
                ))}
              </div>
            </div>
          )}

          {/* STEP 6 — Turnover & Clients */}
          {step === 6 && (
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
                    {YEARS.map((year, yi) => (
                      <React.Fragment key={year}>
                        <tr className={yi % 2 === 0 ? 'bg-[#f9f9f7]' : 'bg-white'}>
                          <td className="px-3 py-2 font-medium text-[#1a1a1a] whitespace-nowrap">{year} — Revenue</td>
                          {REVENUE_REGIONS.map(region => (
                            <td key={region} className="px-2 py-1.5">
                              <input
                                type="number"
                                placeholder="0"
                                value={financials[`${year}_${region}_revenue`] || ''}
                                onChange={e => updateFinancials(year, region, 'revenue', e.target.value)}
                                className="w-full text-center text-xs border border-[#d8dce2] rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#4fc487]"
                              />
                            </td>
                          ))}
                        </tr>
                        <tr className={yi % 2 === 0 ? 'bg-[#f9f9f7]' : 'bg-white'}>
                          <td className="px-3 py-2 text-[#666] pl-8 text-xs whitespace-nowrap">{year} — EBITDA</td>
                          {REVENUE_REGIONS.map(region => (
                            <td key={region} className="px-2 py-1.5">
                              <input
                                type="number"
                                placeholder="0"
                                value={financials[`${year}_${region}_ebita`] || ''}
                                onChange={e => updateFinancials(year, region, 'ebita', e.target.value)}
                                className="w-full text-center text-xs border border-[#d8dce2] rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#4fc487]"
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
                  <p className="text-sm font-bold text-[#1a1a1a]">Main Clients</p>
                  <Button type="button" variant="outline" onClick={() => setClients(p => [...p, { name: '', industry: '', activities: '', year: '', turnover: '', incidence: '', exclusivity: false }])} className="text-xs h-8 px-3">
                    <Plus className="w-3 h-3 mr-1" /> Add Client
                  </Button>
                </div>
                <div className="space-y-4">
                  {clients.map((client, i) => (
                    <div key={i} className="border border-[#e5e5e1] rounded-xl p-5">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-bold text-[#666] uppercase">Client {i + 1}</span>
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
                              value={(client as Record<string, string>)[f.key] || ''}
                              onChange={e => setClients(p => p.map((c, idx) => idx === i ? { ...c, [f.key]: e.target.value } : c))}
                              placeholder={f.placeholder}
                            />
                          </FormField>
                        ))}
                        <FormField label="Exclusivity">
                          <label className="flex items-center gap-2 mt-2 cursor-pointer">
                            <input type="checkbox" checked={client.exclusivity} onChange={e => setClients(p => p.map((c, idx) => idx === i ? { ...c, exclusivity: e.target.checked } : c))} className="w-4 h-4 accent-[#4fc487]" />
                            <span className="text-sm">Yes</span>
                          </label>
                        </FormField>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pitch client check */}
              <div className="border border-[#e5e5e1] rounded-xl p-5 bg-[#fffbeb]">
                <p className="text-sm font-bold text-[#1a1a1a] mb-1">Pitch Process — Client Conflict Check</p>
                <p className="text-xs text-[#666] mb-4">Complete this only if responding to a specific pitch process.</p>
                <p className="text-sm text-[#444] mb-3">Is your company currently working or has previously worked with the client?</p>
                <div className="flex gap-4">
                  {[true, false].map(v => (
                    <label key={String(v)} className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" checked={workedWithClient === v} onChange={() => setWorkedWithClient(v)} className="w-4 h-4 accent-[#4fc487]" />
                      <span className="text-sm">{v ? 'Yes' : 'No'}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 7 — Competencies */}
          {step === 7 && (
            <div>
              <StepHeader icon="🎯" title="Knowledge & Competencies" subtitle="Select your production capabilities and allocate percentages by service area" />

              <div className="mb-8">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-bold text-[#1a1a1a]">Service Area Allocation <span className="text-[#666] font-normal">(% past 3 years)</span></p>
                  <span className={`text-sm font-bold ${allocationTotal > 100 ? 'text-red-500' : allocationTotal === 100 ? 'text-[#4fc487]' : 'text-[#666]'}`}>
                    Total: {allocationTotal.toFixed(0)}%
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {CAPABILITY_AREAS.map(area => (
                    <div key={area} className="flex items-center gap-3 bg-[#f9f9f7] rounded-lg px-4 py-2.5">
                      <span className="text-sm text-[#444] flex-1">{area}</span>
                      <div className="flex items-center gap-1">
                        <input type="number" min={0} max={100} value={capabilityAllocation[area] || ''} onChange={e => setCapabilityAllocation(prev => ({ ...prev, [area]: e.target.value }))} className="w-16 text-sm text-center border border-[#d8dce2] rounded-lg py-1 focus:outline-none focus:ring-2 focus:ring-[#4fc487]" placeholder="0" />
                        <span className="text-sm text-[#666]">%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                {PRODUCTION_COMPETENCIES.map(group => (
                  <div key={group.label}>
                    <p className="text-xs font-bold text-[#2e3843] uppercase tracking-widest mb-3 flex items-center gap-2">
                      <span className="flex-1 h-px bg-[#eef0f3]" />{group.label}<span className="flex-1 h-px bg-[#eef0f3]" />
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {group.items.map(skill => (
                        <label key={skill} className={`flex items-center gap-2.5 p-2.5 rounded-lg border cursor-pointer transition-all ${competencies[skill] ? 'bg-[#f0fff8] border-[#4fc487]' : 'bg-white border-[#e5e5e1] hover:border-[#d8dce2]'}`}>
                          <input type="checkbox" checked={!!competencies[skill]} onChange={() => setCompetencies(prev => ({ ...prev, [skill]: !prev[skill] }))} className="w-4 h-4 accent-[#4fc487]" />
                          <span className="text-sm text-[#1a1a1a]">{skill}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 8 — Sectors */}
          {step === 8 && (
            <div>
              <StepHeader icon="🏷️" title="Industry Sectors" subtitle="Select all sectors you have expertise in" />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {SECTORS.map(sector => (
                  <label key={sector} className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${selectedSectors[sector] ? 'bg-[#f0fff8] border-[#4fc487]' : 'bg-white border-[#e5e5e1] hover:border-[#d8dce2]'}`}>
                    <input type="checkbox" checked={!!selectedSectors[sector]} onChange={() => setSelectedSectors(prev => ({ ...prev, [sector]: !prev[sector] }))} className="w-4 h-4 accent-[#4fc487]" />
                    <span className="text-sm font-medium text-[#1a1a1a]">{sector}</span>
                  </label>
                ))}
              </div>
              <p className="text-xs text-[#999] mt-4">{Object.values(selectedSectors).filter(Boolean).length} sector(s) selected</p>
            </div>
          )}

          {/* STEP 9 — Post-Production & Activities */}
          {step === 9 && (
            <div>
              <StepHeader icon="🎞️" title="Post-Production & Outsourcing" subtitle="Describe your post-production capabilities and any outsourced activities" />

              <div className="mb-8 border border-[#e5e5e1] rounded-xl p-6">
                <p className="text-sm font-bold text-[#1a1a1a] mb-3">Do you have an in-house post-production department?</p>
                <div className="flex gap-6 mb-4">
                  {[true, false].map(v => (
                    <label key={String(v)} className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" checked={hasInHousePost === v} onChange={() => setHasInHousePost(v)} className="w-4 h-4 accent-[#4fc487]" />
                      <span className="text-sm">{v ? 'Yes' : 'No'}</span>
                    </label>
                  ))}
                </div>
                {hasInHousePost && (
                  <FormField label="Which services does it cover?">
                    <textarea value={postServices} onChange={e => setPostServices(e.target.value)} rows={2} className={textareaCls} placeholder="Editing, colour grading, VFX, sound design, etc." />
                  </FormField>
                )}
              </div>

              {hasInHousePost === false && (
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-bold text-[#1a1a1a]">Outsourced Post-Production Partners</p>
                    <Button type="button" variant="outline" onClick={() => setOutsourcedPartners(p => [...p, { name: '', location: '', audio: false, video: false }])} className="text-xs h-8 px-3">
                      <Plus className="w-3 h-3 mr-1" /> Add Partner
                    </Button>
                  </div>
                  <div className="space-y-3">
                    {outsourcedPartners.map((p, i) => (
                      <div key={i} className="grid grid-cols-2 sm:grid-cols-4 gap-3 border border-[#e5e5e1] rounded-lg p-4">
                        <FormField label="Name"><Input value={p.name} onChange={e => setOutsourcedPartners(prev => prev.map((x, idx) => idx === i ? { ...x, name: e.target.value } : x))} placeholder="Company name" /></FormField>
                        <FormField label="Location"><Input value={p.location} onChange={e => setOutsourcedPartners(prev => prev.map((x, idx) => idx === i ? { ...x, location: e.target.value } : x))} placeholder="City, Country" /></FormField>
                        <FormField label="Audio">
                          <label className="flex items-center gap-2 mt-2 cursor-pointer">
                            <input type="checkbox" checked={p.audio} onChange={e => setOutsourcedPartners(prev => prev.map((x, idx) => idx === i ? { ...x, audio: e.target.checked } : x))} className="w-4 h-4 accent-[#4fc487]" />
                            <span className="text-sm">Yes</span>
                          </label>
                        </FormField>
                        <FormField label="Video">
                          <label className="flex items-center gap-2 mt-2 cursor-pointer">
                            <input type="checkbox" checked={p.video} onChange={e => setOutsourcedPartners(prev => prev.map((x, idx) => idx === i ? { ...x, video: e.target.checked } : x))} className="w-4 h-4 accent-[#4fc487]" />
                            <span className="text-sm">Yes</span>
                          </label>
                        </FormField>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="border border-[#e5e5e1] rounded-xl p-6">
                <p className="text-sm font-bold text-[#1a1a1a] mb-3">Does your company subcontract activities or phases of service?</p>
                <div className="flex gap-6 mb-4">
                  {[true, false].map(v => (
                    <label key={String(v)} className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" checked={subcontracts === v} onChange={() => setSubcontracts(v)} className="w-4 h-4 accent-[#4fc487]" />
                      <span className="text-sm">{v ? 'Yes' : 'No'}</span>
                    </label>
                  ))}
                </div>
                {subcontracts && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-[#666]">Outsourced Activities</p>
                      <Button type="button" variant="outline" onClick={() => setOutsourcedActivities(p => [...p, { activity: '', description: '', pct: '' }])} className="text-xs h-8 px-3">
                        <Plus className="w-3 h-3 mr-1" /> Add
                      </Button>
                    </div>
                    {outsourcedActivities.map((a, i) => (
                      <div key={i} className="grid grid-cols-3 gap-3 border border-[#e5e5e1] rounded-lg p-3">
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
                <p className="text-sm font-bold text-[#1a1a1a] mb-4">Team Structure</p>
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
                      <tr className="bg-[#eef0f3]">
                        <th className="text-left px-4 py-2.5 text-xs font-medium text-[#666]">Role</th>
                        <th className="px-3 py-2.5 text-xs font-medium text-[#666] text-center"># Employees</th>
                        <th className="px-3 py-2.5 text-xs font-medium text-[#666] text-center"># Freelancers</th>
                        <th className="px-3 py-2.5 text-xs font-medium text-[#666] text-center">Avg. Annual Salary</th>
                      </tr>
                    </thead>
                    <tbody>
                      {people.map((row, i) => (
                        <tr key={row.role} className={i % 2 === 0 ? 'bg-white' : 'bg-[#f9f9f7]'}>
                          <td className="px-4 py-2 text-sm text-[#1a1a1a]">{row.role}</td>
                          {['employees', 'freelancers', 'salary'].map(field => (
                            <td key={field} className="px-2 py-1.5">
                              <input type="number" placeholder="0" value={(row as Record<string, string>)[field] || ''} onChange={e => setPeople(p => p.map((r, idx) => idx === i ? { ...r, [field]: e.target.value } : r))} className="w-full text-center text-xs border border-[#d8dce2] rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#4fc487]" />
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
                  <p className="text-sm font-bold text-[#1a1a1a]">Key Directors</p>
                  <Button type="button" variant="outline" onClick={() => setDirectors(p => [...p, { name: '', exclusivity: false, priority: false, occasional: false }])} className="text-xs h-8 px-3">
                    <Plus className="w-3 h-3 mr-1" /> Add Director
                  </Button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse min-w-[400px]">
                    <thead>
                      <tr className="bg-[#eef0f3]">
                        <th className="text-left px-4 py-2.5 text-xs font-medium text-[#666]">Director Name</th>
                        <th className="px-3 py-2.5 text-xs font-medium text-[#666] text-center">Exclusivity</th>
                        <th className="px-3 py-2.5 text-xs font-medium text-[#666] text-center">Priority</th>
                        <th className="px-3 py-2.5 text-xs font-medium text-[#666] text-center">Occasional</th>
                        <th className="px-3 py-2.5"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {directors.map((d, i) => (
                        <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-[#f9f9f7]'}>
                          <td className="px-2 py-1.5">
                            <Input value={d.name} onChange={e => setDirectors(p => p.map((r, idx) => idx === i ? { ...r, name: e.target.value } : r))} placeholder="Full name" />
                          </td>
                          {['exclusivity', 'priority', 'occasional'].map(field => (
                            <td key={field} className="px-3 py-1.5 text-center">
                              <input type="checkbox" checked={(d as Record<string, boolean>)[field] || false} onChange={e => setDirectors(p => p.map((r, idx) => idx === i ? { ...r, [field]: e.target.checked } : r))} className="w-4 h-4 accent-[#4fc487]" />
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

              <div>
                <p className="text-sm font-bold text-[#1a1a1a] mb-3">Investments (% of Turnover)</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {INVESTMENT_ITEMS.map(item => (
                    <div key={item} className="flex items-center gap-3 bg-[#f9f9f7] rounded-lg px-4 py-2.5">
                      <span className="text-sm text-[#444] flex-1">{item}</span>
                      <div className="flex items-center gap-1">
                        <input type="number" min={0} max={100} value={investments[item] || ''} onChange={e => setInvestments(prev => ({ ...prev, [item]: e.target.value }))} className="w-16 text-sm text-center border border-[#d8dce2] rounded-lg py-1 focus:outline-none focus:ring-2 focus:ring-[#4fc487]" placeholder="0" />
                        <span className="text-sm text-[#666]">%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 11 — Awards & CSR */}
          {step === 11 && (
            <div>
              <StepHeader icon="🏆" title="Awards & Social Responsibility" subtitle="List your award wins and answer CSR questions" />

              <div className="mb-10">
                <p className="text-sm font-bold text-[#1a1a1a] mb-4">Award Wins</p>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse min-w-[700px]">
                    <thead>
                      <tr className="bg-[#eef0f3]">
                        {['Festival', 'Distinction', 'Category', 'Year', 'Awarded Ad', 'Brand'].map(h => (
                          <th key={h} className="text-left px-3 py-2.5 text-xs font-medium text-[#666]">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {awards.map((award, i) => (
                        <tr key={award.festival} className={i % 2 === 0 ? 'bg-white' : 'bg-[#f9f9f7]'}>
                          <td className="px-3 py-2 text-sm font-medium text-[#2e3843] whitespace-nowrap">{award.festival}</td>
                          {['distinction', 'category', 'year', 'ad', 'brand'].map(field => (
                            <td key={field} className="px-2 py-1.5">
                              <input value={(award as Record<string, string>)[field] || ''} onChange={e => setAwards(p => p.map((a, idx) => idx === i ? { ...a, [field]: e.target.value } : a))} className="w-full text-xs border border-[#d8dce2] rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#4fc487]" placeholder="—" />
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <p className="text-sm font-bold text-[#1a1a1a] mb-4">Social Responsibility</p>
                <div className="space-y-3">
                  {CSR_QUESTIONS.map(q => (
                    <div key={q.id} className="flex items-start gap-4 p-4 rounded-xl border border-[#e5e5e1] bg-white">
                      <span className="text-xs font-bold text-[#999] w-8 shrink-0 mt-0.5">{q.id}</span>
                      <p className="text-sm text-[#444] flex-1">{q.q}</p>
                      <div className="flex gap-4 shrink-0">
                        {[true, false].map(v => (
                          <label key={String(v)} className="flex items-center gap-1 cursor-pointer">
                            <input type="radio" checked={csr[q.id] === v} onChange={() => setCsr(p => ({ ...p, [q.id]: v }))} className="w-3.5 h-3.5 accent-[#4fc487]" />
                            <span className="text-xs">{v ? 'Yes' : 'No'}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 12 — About & AI */}
          {step === 12 && (
            <div>
              <StepHeader icon="✍️" title="About, Governance & AI" subtitle="Describe your company, governance model, and AI approach" />
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

                <div className="border-t border-[#eef0f3] pt-6">
                  <p className="text-sm font-bold text-[#1a1a1a] mb-4">Governance & Scope of Work</p>
                  <div className="space-y-4">
                    <FormField label="Quality assurance & SLA monitoring systems">
                      <textarea value={governance.quality} onChange={e => setGovernance(p => ({ ...p, quality: e.target.value }))} rows={2} className={textareaCls} placeholder="Describe your QA and SLA systems..." />
                    </FormField>
                    <FormField label="Client data management protocols">
                      <textarea value={governance.clientData} onChange={e => setGovernance(p => ({ ...p, clientData: e.target.value }))} rows={2} className={textareaCls} placeholder="How you handle client data, DMP usage..." />
                    </FormField>
                    <FormField label="Global vs local governance model">
                      <textarea value={governance.globalLocal} onChange={e => setGovernance(p => ({ ...p, globalLocal: e.target.value }))} rows={2} className={textareaCls} placeholder="How global and local strategies are managed..." />
                    </FormField>
                  </div>
                </div>

                <div className="border-t border-[#eef0f3] pt-6">
                  <p className="text-sm font-bold text-[#1a1a1a] mb-2">Strategic Development</p>
                  <FormField label="Strategic development orientation">
                    <textarea value={strategicOrientation} onChange={e => setStrategicOrientation(e.target.value)} rows={2} className={textareaCls} placeholder="Your strategic direction and plans..." />
                  </FormField>
                  <div className="mt-4">
                    <p className="text-sm font-medium text-[#1a1a1a] mb-2">Do you have activity outside your Country / City?</p>
                    <div className="flex gap-6">
                      {[true, false].map(v => (
                        <label key={String(v)} className="flex items-center gap-2 cursor-pointer">
                          <input type="radio" checked={activityOutOfCountry === v} onChange={() => setActivityOutOfCountry(v)} className="w-4 h-4 accent-[#4fc487]" />
                          <span className="text-sm">{v ? 'Yes' : 'No'}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="border-t border-[#eef0f3] pt-6">
                  <p className="text-sm font-bold text-[#1a1a1a] mb-4">AI Usage</p>
                  <div className="space-y-4">
                    <FormField label="Which AI tools are you currently using?">
                      <textarea value={aiCurrentTools} onChange={e => setAiCurrentTools(e.target.value)} rows={2} className={textareaCls} placeholder="e.g. ChatGPT, Runway ML, Adobe Firefly..." />
                    </FormField>
                    <FormField label="AI implementations you anticipate adopting">
                      <textarea value={aiFuture} onChange={e => setAiFuture(e.target.value)} rows={2} className={textareaCls} placeholder="Future AI plans..." />
                    </FormField>
                    <FormField label="Benefits AI delivers — with case examples">
                      <textarea value={aiBenefits} onChange={e => setAiBenefits(e.target.value)} rows={2} className={textareaCls} placeholder="Concrete examples of AI-driven impact..." />
                    </FormField>
                    <FormField label="Ethical aspects & privacy compliance">
                      <textarea value={aiEthics} onChange={e => setAiEthics(e.target.value)} rows={2} className={textareaCls} placeholder="How you ensure ethical and privacy-compliant AI use..." />
                    </FormField>
                    <FormField label="Approach to mitigating AI risks">
                      <textarea value={aiRisk} onChange={e => setAiRisk(e.target.value)} rows={2} className={textareaCls} placeholder="Risk management processes..." />
                    </FormField>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Nav buttons */}
        <div className="flex items-center justify-between mt-6">
          <div>
            {step > 1 ? (
              <Button variant="outline" onClick={() => setStep(s => s - 1)} className="border-[#d8dce2] text-[#2e3843] hover:bg-[#eef0f3]">
                <ChevronLeft className="w-4 h-4 mr-1" /> Back
              </Button>
            ) : (
              <Link href="/signup">
                <Button variant="outline" className="border-[#d8dce2] text-[#2e3843] hover:bg-[#eef0f3]">
                  <ChevronLeft className="w-4 h-4 mr-1" /> Cancel
                </Button>
              </Link>
            )}
          </div>
          <div className="flex items-center gap-3">
            {step < STEPS.length ? (
              <>
                <Button variant="ghost" className="text-[#666] hover:text-[#1a1a1a]" onClick={() => setStep(s => s + 1)}>Skip for now</Button>
                <Button onClick={() => setStep(s => s + 1)} disabled={!canProceed()} className="bg-[#2e3843] hover:bg-[#1a1a1a] text-white px-6">
                  Continue <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </>
            ) : (
              <Button onClick={handleSubmit} disabled={isSubmitting} className="bg-[#4fc487] hover:bg-[#45b078] text-white px-8">
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" /><path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="4" className="opacity-75" /></svg>
                    Submitting...
                  </span>
                ) : (
                  <><Film className="w-4 h-4 mr-2" /> Submit Registration</>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Sub-components ────────────────────────────────────────────────────────────

function StepHeader({ icon, title, subtitle }: { icon: string; title: string; subtitle: string }) {
  return (
    <div className="mb-8 pb-6 border-b border-[#eef0f3]">
      <div className="flex items-center gap-3 mb-2">
        <span className="text-2xl">{icon}</span>
        <h2 className="text-2xl font-bold text-[#1a1a1a]">{title}</h2>
      </div>
      <p className="text-[#666] text-sm ml-9">{subtitle}</p>
    </div>
  )
}

function FormField({ label, required, children, className }: { label: string; required?: boolean; children: React.ReactNode; className?: string }) {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-[#1a1a1a] mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
    </div>
  )
}

const selectCls = 'w-full border border-[#d8dce2] rounded-lg px-3 py-2.5 text-sm bg-white text-[#1a1a1a] focus:outline-none focus:ring-2 focus:ring-[#4fc487]'
const textareaCls = 'w-full border border-[#d8dce2] rounded-lg px-3 py-2.5 text-sm bg-white text-[#1a1a1a] focus:outline-none focus:ring-2 focus:ring-[#4fc487] resize-none'
