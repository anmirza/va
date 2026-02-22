'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ChevronRight, ChevronLeft, Check, Building2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

// ── Step definitions ──────────────────────────────────────────────────────────

const STEPS = [
  { id: 1, label: 'General Info' },
  { id: 2, label: 'Organisation' },
  { id: 3, label: 'Address' },
  { id: 4, label: 'Contacts' },
  { id: 5, label: 'Social Media' },
  { id: 6, label: 'Competencies' },
  { id: 7, label: 'Sectors' },
  { id: 8, label: 'About & AI' },
]

const EMPLOYEE_RANGES = ['1 to 10', '11 to 50', '51 to 100', '101 to 250', '251 to 400', '401 +']
const COMPANY_LEVELS = ['Holding Company', 'Worldwide Headquarter', 'Regional Headquarters', 'National Headquarters', 'Company', 'Subsidiary']
const COUNTRY_COVERAGES = ['Country Level', 'North America', 'Latin America', 'EMEA', 'Europe', 'APAC', 'Global']
const AGENCY_CATEGORIES = ['ATL', 'Digital Marketing', 'Event & Experience', 'Full Service', 'Influencer Marketing', 'PR', 'Social Media', 'Tech Dev (Web site CRM Application)', 'Point of Sales Material']
const CURRENCIES = ['Euro - EUR', 'US Dollar - USD', 'British Pound - GBP', 'Swiss Franc - CHF', 'Japanese Yen - JPY', 'Australian Dollar - AUD']

const SECTORS = [
  'Automotive & Mobility', 'Beauty & Personal Care', 'Beverage', 'Consumer Goods',
  'Corporate & B2B', 'Electronics & Technology', 'Energy', 'Entertainment & Media',
  'Fashion & Luxury', 'Food & Beverage', 'Healthcare & Pharma', 'Home & Living',
  'Lifestyle', 'Mobility & Transportation', 'Pet Care', 'Sport & Outdoor',
  'Tobacco', 'Travel, Tourism & Hospitality',
]

const COMPETENCY_GROUPS = [
  {
    label: 'Strategic & Consulting',
    items: ['Strategic Planning', 'Brand Audit', 'Brand Identity Development', 'Positioning Strategy Development', 'Reputation Management', 'Crisis Management', 'Marketing Research', 'Consumer Insight'],
  },
  {
    label: 'Creative & Content',
    items: ['Campaign Creation', 'Creative Concept Development', 'Creative Production', 'Content Creation / Copywriting', 'Graphic Design', 'Point of Sale Materials', 'Photography', 'Illustration', 'Motion Graphics & Animation', 'Video Production', 'Audio Production', 'Post Production & Editing'],
  },
  {
    label: 'PR & Events',
    items: ['Media Relations', 'Public Relations Strategy', 'Influencer Relations', 'Press Releases & Press Kits', 'Event Organisation & Management', 'Sponsorship Management', 'Experiential Marketing'],
  },
  {
    label: 'Above the Line',
    items: ['Media Management', 'Media Planning', 'Media Buying', 'Media Agencies Coordination', 'Broadcast Advertising', 'OOH / DOOH', 'Direct Marketing'],
  },
  {
    label: 'Below the Line / Trade',
    items: ['Promotional Marketing', 'In-store Marketing', 'Sampling Campaigns', 'Merchandising Strategy', 'Point-of-Sale (POS) Materials', 'Distribution Channel Analysis', 'Channel Promotions', 'Trade Events', 'Distributor Relationship Management'],
  },
  {
    label: 'Digital Marketing',
    items: ['Digital Strategy', 'SEO', 'SEM', 'Display & Programmatic Advertising', 'Performance Marketing', 'Digital Data Analysis / Reporting'],
  },
  {
    label: 'Social Media & Influencer',
    items: ['Social Media Strategy & Management', 'Community Management', 'Paid Social Campaigns', 'Influencer Marketing Strategy', 'Social Listening', 'Sentiment Analysis'],
  },
  {
    label: 'Technology & Digital',
    items: ['Web Development & Maintenance', 'App Development', 'E-commerce Solution', 'UX/UI Design', 'CRM Integration & Management'],
  },
  {
    label: 'Retail & Media',
    items: ['Visual Merchandising', 'Omnichannel Retail Strategy', 'Merchandising & Planogramming', 'Retail Sales Analysis', 'In-Store Customer Experience', 'Media Space Buying', 'Media Content Development', 'Media Monitoring', 'Editorial Planning', 'Impact Analysis'],
  },
]

const CAPABILITY_AREAS = [
  'Strategic & Consulting', 'Creative & Content', 'Audio / Visual Production',
  'PR & Events', 'Above the Line', 'Below the Line', 'Digital Marketing',
  'Social Media & Influencer Marketing', 'Technology & Digital', 'Analytics & Reporting',
  'Email & Content Marketing', 'Trade Marketing', 'Retail', 'Media',
]

const CONTACT_ROLES_AGENCY = ['CEO', 'General Manager', 'Business Director', 'ECD (Executive Creative Director)', 'Executive Producer']

// ── Component ─────────────────────────────────────────────────────────────────

export default function AgencySignupPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // ── Form state ──────────────────────────────────────────────────────────────

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

  // Step 4 — Contacts
  const [contacts, setContacts] = useState(
    CONTACT_ROLES_AGENCY.map(role => ({ role, firstName: '', lastName: '', linkedin: '', telephone: '', mobile: '', email: '' }))
  )

  // Step 5 — Social Media
  const [website, setWebsite] = useState('')
  const [twitter, setTwitter] = useState('')
  const [facebook, setFacebook] = useState('')
  const [linkedin, setLinkedin] = useState('')
  const [instagram, setInstagram] = useState('')
  const [tiktok, setTiktok] = useState('')
  const [pinterest, setPinterest] = useState('')
  const [reddit, setReddit] = useState('')

  // Step 6 — Competencies
  const [competencies, setCompetencies] = useState<Record<string, boolean>>({})
  const [capabilityAllocation, setCapabilityAllocation] = useState<Record<string, string>>({})
  const [marketPositioning, setMarketPositioning] = useState('')

  // Step 7 — Sectors
  const [selectedSectors, setSelectedSectors] = useState<Record<string, boolean>>({})

  // Step 8 — About & AI
  const [about, setAbout] = useState('')
  const [philosophy, setPhilosophy] = useState('')
  const [networkDescription, setNetworkDescription] = useState('')
  const [localRepresentation, setLocalRepresentation] = useState('')
  const [aiCurrentTools, setAiCurrentTools] = useState('')
  const [aiFuture, setAiFuture] = useState('')
  const [aiBenefits, setAiBenefits] = useState('')
  const [aiEthics, setAiEthics] = useState('')
  const [aiRisk, setAiRisk] = useState('')
  const [specificServices, setSpecificServices] = useState('')

  // ── Navigation ──────────────────────────────────────────────────────────────

  const canProceed = () => {
    if (step === 1) return businessName.trim().length > 0
    if (step === 2) return employees !== '' && companyLevel !== '' && category !== ''
    if (step === 3) return city.trim().length > 0 && country.trim().length > 0
    return true
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    await new Promise(r => setTimeout(r, 1500))
    const profile = {
      businessName, dunsNumber, vatNumber, legalForm, companyRegNumber, yearEstablished,
      employees, companyLevel, parentCompany, category, currency, tradeOrganizations,
      countryCoverage, address, postcode, city, country,
      contacts,
      website, twitter, facebook, linkedin, instagram, tiktok, pinterest, reddit,
      competencies, capabilityAllocation, marketPositioning,
      selectedSectors,
      about, philosophy, networkDescription, localRepresentation,
      aiCurrentTools, aiFuture, aiBenefits, aiEthics, aiRisk, specificServices,
      submittedAt: new Date().toISOString(),
    }
    localStorage.setItem('va_agency_profile', JSON.stringify(profile))
    router.push('/dashboard/agency?registered=true')
  }

  // ── UI helpers ──────────────────────────────────────────────────────────────

  const updateContact = (idx: number, field: string, value: string) => {
    setContacts(prev => prev.map((c, i) => i === idx ? { ...c, [field]: value } : c))
  }

  const toggleCompetency = (skill: string) => {
    setCompetencies(prev => ({ ...prev, [skill]: !prev[skill] }))
  }

  const toggleSector = (sector: string) => {
    setSelectedSectors(prev => ({ ...prev, [sector]: !prev[sector] }))
  }

  const allocationTotal = Object.values(capabilityAllocation).reduce((sum, v) => sum + (parseFloat(v) || 0), 0)

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
          <div className="flex items-center gap-0 overflow-x-auto">
            {STEPS.map((s, i) => (
              <div key={s.id} className="flex items-center flex-shrink-0">
                <button
                  onClick={() => step > s.id && setStep(s.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                    s.id === step ? 'bg-[#2e3843] text-white' :
                    s.id < step ? 'text-[#4fc487] cursor-pointer hover:bg-[#d8dce2]' :
                    'text-[#aaa] cursor-default'
                  }`}
                >
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                    s.id < step ? 'bg-[#4fc487] text-white' :
                    s.id === step ? 'bg-white text-[#2e3843]' :
                    'bg-[#d8dce2] text-[#666]'
                  }`}>
                    {s.id < step ? <Check className="w-3 h-3" /> : s.id}
                  </span>
                  <span className="hidden sm:inline">{s.label}</span>
                </button>
                {i < STEPS.length - 1 && <div className="w-6 h-px bg-[#d8dce2] flex-shrink-0" />}
              </div>
            ))}
          </div>
          <div className="mt-3 h-1.5 bg-[#d8dce2] rounded-full">
            <div
              className="h-full bg-[#4fc487] rounded-full transition-all duration-500"
              style={{ width: `${((step - 1) / (STEPS.length - 1)) * 100}%` }}
            />
          </div>
        </div>

        {/* Step content */}
        <div className="bg-white rounded-2xl shadow-sm p-8">

          {/* STEP 1 — General Information */}
          {step === 1 && (
            <div>
              <StepHeader icon="🏢" title="General Information" subtitle="Legal identity of your company" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <FormField label="Registered Business Name" required>
                  <Input value={businessName} onChange={e => setBusinessName(e.target.value)} placeholder="e.g. Acme Agency Ltd." />
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

          {/* STEP 2 — Organisation & Structure */}
          {step === 2 && (
            <div>
              <StepHeader icon="🏗️" title="Organisation & Structure" subtitle="Tell us about your company's size and position" />
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
                <FormField label="Agency Category" required>
                  <select value={category} onChange={e => setCategory(e.target.value)} className={selectCls}>
                    <option value="">Select category</option>
                    {AGENCY_CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </FormField>
                <FormField label="Currency">
                  <select value={currency} onChange={e => setCurrency(e.target.value)} className={selectCls}>
                    {CURRENCIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </FormField>
                <FormField label="Trade Organisations">
                  <Input value={tradeOrganizations} onChange={e => setTradeOrganizations(e.target.value)} placeholder="e.g. IPA, ISBA, EACA" />
                </FormField>
              </div>
            </div>
          )}

          {/* STEP 3 — Registered Office Address */}
          {step === 3 && (
            <div>
              <StepHeader icon="📍" title="Registered Office Address" subtitle="Your company's official address and geographic coverage" />
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

          {/* STEP 4 — Contact Details */}
          {step === 4 && (
            <div>
              <StepHeader icon="👤" title="Contact Details" subtitle="Key people at your agency — fill in the roles that apply" />
              <div className="space-y-8">
                {contacts.map((contact, idx) => (
                  <div key={contact.role} className="border border-[#e5e5e1] rounded-xl p-5">
                    <p className="text-sm font-bold text-[#2e3843] mb-4 uppercase tracking-wide">{contact.role}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField label="First Name">
                        <Input value={contact.firstName} onChange={e => updateContact(idx, 'firstName', e.target.value)} placeholder="First name" />
                      </FormField>
                      <FormField label="Last Name">
                        <Input value={contact.lastName} onChange={e => updateContact(idx, 'lastName', e.target.value)} placeholder="Last name" />
                      </FormField>
                      <FormField label="LinkedIn URL">
                        <Input value={contact.linkedin} onChange={e => updateContact(idx, 'linkedin', e.target.value)} placeholder="linkedin.com/in/..." />
                      </FormField>
                      <FormField label="Email">
                        <Input type="email" value={contact.email} onChange={e => updateContact(idx, 'email', e.target.value)} placeholder="email@agency.com" />
                      </FormField>
                      <FormField label="Telephone">
                        <Input value={contact.telephone} onChange={e => updateContact(idx, 'telephone', e.target.value)} placeholder="+44 20 ..." />
                      </FormField>
                      <FormField label="Mobile">
                        <Input value={contact.mobile} onChange={e => updateContact(idx, 'mobile', e.target.value)} placeholder="+44 7..." />
                      </FormField>
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
                  { label: 'Official Website', val: website, set: setWebsite, ph: 'https://agency.com' },
                  { label: 'LinkedIn', val: linkedin, set: setLinkedin, ph: 'linkedin.com/company/...' },
                  { label: 'X (Twitter)', val: twitter, set: setTwitter, ph: '@handle' },
                  { label: 'Instagram', val: instagram, set: setInstagram, ph: '@handle' },
                  { label: 'Facebook', val: facebook, set: setFacebook, ph: 'facebook.com/...' },
                  { label: 'TikTok', val: tiktok, set: setTiktok, ph: '@handle' },
                  { label: 'Pinterest', val: pinterest, set: setPinterest, ph: 'pinterest.com/...' },
                  { label: 'Reddit', val: reddit, set: setReddit, ph: 'r/...' },
                ].map(({ label, val, set, ph }) => (
                  <FormField key={label} label={label}>
                    <Input value={val} onChange={e => set(e.target.value)} placeholder={ph} />
                  </FormField>
                ))}
              </div>
            </div>
          )}

          {/* STEP 6 — Knowledge & Competencies */}
          {step === 6 && (
            <div>
              <StepHeader icon="🎯" title="Knowledge & Competencies" subtitle="Select all capabilities that apply to your agency, then allocate percentages to each service area (total must equal 100%)" />

              {/* Market positioning */}
              <FormField label="Market Positioning Statement" className="mb-8">
                <textarea
                  value={marketPositioning}
                  onChange={e => setMarketPositioning(e.target.value)}
                  placeholder="If you had to prioritize your positioning, describe what best represents your company..."
                  rows={3}
                  className={textareaCls}
                />
              </FormField>

              {/* Capability allocation */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-bold text-[#1a1a1a]">Service Area Allocation <span className="text-[#666] font-normal">(% of work in past 3 years)</span></p>
                  <span className={`text-sm font-bold ${allocationTotal > 100 ? 'text-red-500' : allocationTotal === 100 ? 'text-[#4fc487]' : 'text-[#666]'}`}>
                    Total: {allocationTotal.toFixed(0)}%
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {CAPABILITY_AREAS.map(area => (
                    <div key={area} className="flex items-center gap-3 bg-[#f9f9f7] rounded-lg px-4 py-2.5">
                      <span className="text-sm text-[#444] flex-1">{area}</span>
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          min={0} max={100}
                          value={capabilityAllocation[area] || ''}
                          onChange={e => setCapabilityAllocation(prev => ({ ...prev, [area]: e.target.value }))}
                          className="w-16 text-sm text-center border border-[#d8dce2] rounded-lg py-1 focus:outline-none focus:ring-2 focus:ring-[#4fc487]"
                          placeholder="0"
                        />
                        <span className="text-sm text-[#666]">%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Competencies checkboxes */}
              <div className="space-y-6">
                {COMPETENCY_GROUPS.map(group => (
                  <div key={group.label}>
                    <p className="text-xs font-bold text-[#2e3843] uppercase tracking-widest mb-3 flex items-center gap-2">
                      <span className="flex-1 h-px bg-[#eef0f3]" />
                      {group.label}
                      <span className="flex-1 h-px bg-[#eef0f3]" />
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                      {group.items.map(skill => (
                        <label key={skill} className={`flex items-center gap-2.5 p-2.5 rounded-lg border cursor-pointer transition-all ${competencies[skill] ? 'bg-[#f0fff8] border-[#4fc487]' : 'bg-white border-[#e5e5e1] hover:border-[#d8dce2]'}`}>
                          <input
                            type="checkbox"
                            checked={!!competencies[skill]}
                            onChange={() => toggleCompetency(skill)}
                            className="w-4 h-4 accent-[#4fc487]"
                          />
                          <span className="text-sm text-[#1a1a1a]">{skill}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 7 — Industry Sectors */}
          {step === 7 && (
            <div>
              <StepHeader icon="🏷️" title="Industry Sectors" subtitle="Select all sectors your agency has expertise and experience in" />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {SECTORS.map(sector => (
                  <label key={sector} className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${selectedSectors[sector] ? 'bg-[#f0fff8] border-[#4fc487]' : 'bg-white border-[#e5e5e1] hover:border-[#d8dce2]'}`}>
                    <input
                      type="checkbox"
                      checked={!!selectedSectors[sector]}
                      onChange={() => toggleSector(sector)}
                      className="w-4 h-4 accent-[#4fc487]"
                    />
                    <span className="text-sm font-medium text-[#1a1a1a]">{sector}</span>
                  </label>
                ))}
              </div>
              <p className="text-xs text-[#999] mt-4">
                {Object.values(selectedSectors).filter(Boolean).length} sector(s) selected
              </p>
            </div>
          )}

          {/* STEP 8 — About & AI */}
          {step === 8 && (
            <div>
              <StepHeader icon="✍️" title="About Your Agency" subtitle="Describe your philosophy, network, and approach to AI" />
              <div className="space-y-6">
                <FormField label="About Your Agency">
                  <textarea value={about} onChange={e => setAbout(e.target.value)} rows={4} className={textareaCls} placeholder="A brief overview of your agency..." />
                </FormField>
                <FormField label="Philosophy & Competitive Advantages">
                  <textarea value={philosophy} onChange={e => setPhilosophy(e.target.value)} rows={3} className={textareaCls} placeholder="What makes you different?" />
                </FormField>
                <FormField label="Network Description">
                  <textarea value={networkDescription} onChange={e => setNetworkDescription(e.target.value)} rows={3} className={textareaCls} placeholder="Describe your agency network, if applicable..." />
                </FormField>
                <FormField label="Local Representation">
                  <textarea value={localRepresentation} onChange={e => setLocalRepresentation(e.target.value)} rows={2} className={textareaCls} placeholder="Local offices or representatives..." />
                </FormField>
                <FormField label="Specific Services, Tools or Apps">
                  <textarea value={specificServices} onChange={e => setSpecificServices(e.target.value)} rows={2} className={textareaCls} placeholder="Any proprietary tools or platforms you'd like to highlight?" />
                </FormField>

                <div className="border-t border-[#eef0f3] pt-6">
                  <p className="text-sm font-bold text-[#1a1a1a] mb-4">AI Usage</p>
                  <div className="space-y-4">
                    <FormField label="Which AI tools are you currently using?">
                      <textarea value={aiCurrentTools} onChange={e => setAiCurrentTools(e.target.value)} rows={2} className={textareaCls} placeholder="e.g. ChatGPT, Midjourney, Adobe Firefly..." />
                    </FormField>
                    <FormField label="AI implementations you anticipate adopting">
                      <textarea value={aiFuture} onChange={e => setAiFuture(e.target.value)} rows={2} className={textareaCls} placeholder="Future AI plans..." />
                    </FormField>
                    <FormField label="Benefits AI delivers — with case examples">
                      <textarea value={aiBenefits} onChange={e => setAiBenefits(e.target.value)} rows={2} className={textareaCls} placeholder="Concrete examples of AI-driven impact..." />
                    </FormField>
                    <FormField label="Ethical aspects of AI usage & privacy compliance">
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

        {/* Navigation buttons */}
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
                <Button variant="ghost" className="text-[#666] hover:text-[#1a1a1a]" onClick={() => setStep(s => s + 1)}>
                  Skip for now
                </Button>
                <Button
                  onClick={() => setStep(s => s + 1)}
                  disabled={!canProceed()}
                  className="bg-[#2e3843] hover:bg-[#1a1a1a] text-white px-6"
                >
                  Continue <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-[#4fc487] hover:bg-[#45b078] text-white px-8"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" /><path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="4" className="opacity-75" /></svg>
                    Submitting...
                  </span>
                ) : (
                  <>
                    <Building2 className="w-4 h-4 mr-2" /> Submit Registration
                  </>
                )}
              </Button>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}

// ── Shared sub-components ─────────────────────────────────────────────────────

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
