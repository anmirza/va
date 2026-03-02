'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ChevronRight, ChevronLeft, Check, Building2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  AGENCY_CATEGORIES, TOP_CURRENCIES, EMPLOYEE_SIZES, COMPANY_LEVELS,
  COUNTRY_COVERAGE, COUNTRIES, COMMUNICATION_AREAS, AGENCY_SERVICE_GROUPS,
  CAPABILITY_AREAS, AGENCY_CONTACT_ROLES, SOCIAL_MEDIA_FIELDS,
  AGENCY_PEOPLE_DEPARTMENTS, AGENCY_TALENT_ROLES, AGENCY_AWARDS,
  AI_QUESTIONS, SOCIAL_RESPONSIBILITY_QUESTIONS, INVESTMENT_CATEGORIES,
  REGISTRATION_STEPS, CSR_IMPACT_AREAS,
} from '@/lib/rfi-data'
import { getTurnoverYears, REVENUE_REGIONS } from '@/lib/turnover-utils'

// ── Component ─────────────────────────────────────────────────────────────────

export default function AgencySignupPage() {
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
  const [employees, setEmployees] = useState('')
  const [companyLevel, setCompanyLevel] = useState('')
  const [parentCompany, setParentCompany] = useState('')
  const [category, setCategory] = useState('')
  const [currency, setCurrency] = useState('Euro - EUR')
  const [tradeOrganizations, setTradeOrganizations] = useState('')

  // Step 2 — Contacts
  const [countryCoverage, setCountryCoverage] = useState('')
  const [address, setAddress] = useState('')
  const [postcode, setPostcode] = useState('')
  const [city, setCity] = useState('')
  const [country, setCountry] = useState('')
  const [contacts, setContacts] = useState(
    AGENCY_CONTACT_ROLES.map(role => ({ role, firstName: '', lastName: '', linkedin: '', telephone: '', mobile: '', email: '' }))
  )
  const [socialMedia, setSocialMedia] = useState<Record<string, string>>({})

  // Step 3 — Turnover & Clients
  const turnoverYears = getTurnoverYears()
  const [revenue, setRevenue] = useState<Record<string, Record<string, string>>>({})
  const [clients, setClients] = useState([{ name: '', industry: '', activities: '', year: '', turnover: '', incidence: '', exclusivity: false }])

  // Step 4 — Knowledge & Competencies
  const [competencies, setCompetencies] = useState<Record<string, boolean>>({})
  const [capabilityAllocation, setCapabilityAllocation] = useState<Record<string, string>>({})
  const [marketPositioning, setMarketPositioning] = useState('')
  const [mainCapability, setMainCapability] = useState('')
  const [secondaryCapability, setSecondaryCapability] = useState('')
  const [additionalCapability, setAdditionalCapability] = useState('')
  const [selectedSectors, setSelectedSectors] = useState<Record<string, boolean>>({})

  // Step 5 — Governance & SOW
  const [about, setAbout] = useState('')
  const [philosophy, setPhilosophy] = useState('')
  const [networkDescription, setNetworkDescription] = useState('')
  const [localRepresentation, setLocalRepresentation] = useState('')
  const [governanceQA, setGovernanceQA] = useState('')
  const [governanceData, setGovernanceData] = useState('')
  const [governanceGlobal, setGovernanceGlobal] = useState('')
  const [governanceAdditional, setGovernanceAdditional] = useState('')
  const [outsources, setOutsources] = useState(false)

  // Step 6 — People & Talent
  const [peopleCounts, setPeopleCounts] = useState<Record<string, { employees: string; freelancers: string }>>({})
  const [talentEntries, setTalentEntries] = useState(AGENCY_TALENT_ROLES.map(role => ({ role, name: '', linkedin: '' })))

  // Step 7 — Awards & Infos
  const [awards, setAwards] = useState(AGENCY_AWARDS.map(name => ({ name, distinction: '', category: '', year: '', ad: '', brand: '' })))
  const [aiAnswers, setAiAnswers] = useState<Record<string, string>>({})
  const [srAnswers, setSrAnswers] = useState<Record<string, string>>({})

  // Step 8 — Add-On
  const [investments, setInvestments] = useState<Record<string, string>>({})
  const [strategicDev, setStrategicDev] = useState('')
  const [activityOutside, setActivityOutside] = useState('')

  // ── Navigation ──────────────────────────────────────────────────────────────

  const canProceed = () => {
    if (step === 1) return businessName.trim().length > 0
    return true
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    await new Promise(r => setTimeout(r, 1500))
    const profile = {
      businessName, dunsNumber, vatNumber, legalForm, companyRegNumber, yearEstablished,
      employees, companyLevel, parentCompany, category, currency, tradeOrganizations,
      countryCoverage, address, postcode, city, country, contacts, socialMedia,
      revenue, clients, competencies, capabilityAllocation, marketPositioning,
      mainCapability, secondaryCapability, additionalCapability, selectedSectors,
      about, philosophy, networkDescription, localRepresentation,
      governanceQA, governanceData, governanceGlobal, governanceAdditional, outsources,
      peopleCounts, talentEntries, awards, aiAnswers, srAnswers,
      investments, strategicDev, activityOutside,
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

  const allocationTotal = Object.values(capabilityAllocation).reduce((sum, v) => sum + (parseFloat(v) || 0), 0)

  return (
    <div className="min-h-screen bg-[#02030E] flex flex-col">
      {/* Header */}
      <header className="bg-[#02030E]/95 backdrop-blur-md border-b border-white/[0.06] px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <Link href="/" className="text-xl font-bold text-white">VA</Link>
        <div className="flex items-center gap-3">
          <span className="text-xs text-white/30">Step {step} of {REGISTRATION_STEPS.length}</span>
          <Link href="/login" className="text-sm text-white/50 hover:text-white">Already listed? Sign in</Link>
        </div>
      </header>

      <div className="flex-1 max-w-4xl mx-auto w-full px-4 py-10">

        {/* Progress bar */}
        <div className="mb-10">
          <div className="flex items-center gap-0 overflow-x-auto pb-2">
            {REGISTRATION_STEPS.map((s, i) => (
              <div key={s.key} className="flex items-center flex-shrink-0">
                <button
                  onClick={() => step > i + 1 && setStep(i + 1)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-full text-xs font-medium transition-colors ${
                    i + 1 === step ? 'bg-[#4fc487]/20 text-[#4fc487] border border-[#4fc487]/30' :
                    i + 1 < step ? 'text-[#4fc487] cursor-pointer hover:bg-white/[0.06]' :
                    'text-white/20 cursor-default'
                  }`}
                >
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                    i + 1 < step ? 'bg-[#4fc487] text-white' :
                    i + 1 === step ? 'bg-[#4fc487]/30 text-[#4fc487]' :
                    'bg-white/[0.06] text-white/30'
                  }`}>
                    {i + 1 < step ? <Check className="w-3 h-3" /> : i + 1}
                  </span>
                  <span className="hidden sm:inline">{s.shortLabel}</span>
                </button>
                {i < REGISTRATION_STEPS.length - 1 && <div className="w-6 h-px bg-white/[0.08] flex-shrink-0" />}
              </div>
            ))}
          </div>
          <div className="mt-3 h-1.5 bg-white/[0.06] rounded-full">
            <div
              className="h-full bg-[#4fc487] rounded-full transition-all duration-500"
              style={{ width: `${((step - 1) / (REGISTRATION_STEPS.length - 1)) * 100}%` }}
            />
          </div>
        </div>

        {/* Step content */}
        <div className="glass-card p-8">

          {/* STEP 1 — General Information */}
          {step === 1 && (
            <div>
              <StepHeader icon="🏢" title="General Information" subtitle="Legal identity, Organisation & Structure" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <FormField label="Registered Business Name" required>
                  <Input value={businessName} onChange={e => setBusinessName(e.target.value)} placeholder="e.g. Acme Agency Ltd." className={inputCls} />
                </FormField>
                <FormField label="D-U-N-S® Number">
                  <Input value={dunsNumber} onChange={e => setDunsNumber(e.target.value)} placeholder="9-digit number" className={inputCls} />
                </FormField>
                <FormField label="VAT Registration Number">
                  <Input value={vatNumber} onChange={e => setVatNumber(e.target.value)} placeholder="e.g. GB123456789" className={inputCls} />
                </FormField>
                <FormField label="Legal Form">
                  <Input value={legalForm} onChange={e => setLegalForm(e.target.value)} placeholder="e.g. Ltd, GmbH, S.A.S." className={inputCls} />
                </FormField>
                <FormField label="Company Registration Number">
                  <Input value={companyRegNumber} onChange={e => setCompanyRegNumber(e.target.value)} placeholder="Companies House number" className={inputCls} />
                </FormField>
                <FormField label="Year Established">
                  <Input type="number" value={yearEstablished} onChange={e => setYearEstablished(e.target.value)} placeholder="e.g. 2005" min={1800} max={2026} className={inputCls} />
                </FormField>
                <FormField label="Number of Employees" required>
                  <select value={employees} onChange={e => setEmployees(e.target.value)} className={selectCls}>
                    <option value="">Select range</option>
                    {EMPLOYEE_SIZES.map(r => <option key={r}>{r}</option>)}
                  </select>
                </FormField>
                <FormField label="Company Level">
                  <select value={companyLevel} onChange={e => setCompanyLevel(e.target.value)} className={selectCls}>
                    <option value="">Select level</option>
                    {COMPANY_LEVELS.map(l => <option key={l}>{l}</option>)}
                  </select>
                </FormField>
                <FormField label="Parent Company Name">
                  <Input value={parentCompany} onChange={e => setParentCompany(e.target.value)} placeholder="If part of a group" className={inputCls} />
                </FormField>
                <FormField label="Agency Category" required>
                  <select value={category} onChange={e => setCategory(e.target.value)} className={selectCls}>
                    <option value="">Select category</option>
                    {AGENCY_CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </FormField>
                <FormField label="Currency">
                  <select value={currency} onChange={e => setCurrency(e.target.value)} className={selectCls}>
                    {TOP_CURRENCIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </FormField>
                <FormField label="Trade Organisations">
                  <Input value={tradeOrganizations} onChange={e => setTradeOrganizations(e.target.value)} placeholder="e.g. IPA, ISBA, EACA" className={inputCls} />
                </FormField>
              </div>
            </div>
          )}

          {/* STEP 2 — Contacts */}
          {step === 2 && (
            <div>
              <StepHeader icon="📞" title="Contacts" subtitle="Address, key contacts, and social media" />
              {/* Address */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
                <FormField label="Country Coverage" className="sm:col-span-2">
                  <select value={countryCoverage} onChange={e => setCountryCoverage(e.target.value)} className={selectCls}>
                    <option value="">Select coverage</option>
                    {COUNTRY_COVERAGE.map(c => <option key={c}>{c}</option>)}
                  </select>
                </FormField>
                <FormField label="Street Address" className="sm:col-span-2">
                  <Input value={address} onChange={e => setAddress(e.target.value)} placeholder="Street address" className={inputCls} />
                </FormField>
                <FormField label="City" required>
                  <Input value={city} onChange={e => setCity(e.target.value)} placeholder="City" className={inputCls} />
                </FormField>
                <FormField label="Postcode">
                  <Input value={postcode} onChange={e => setPostcode(e.target.value)} placeholder="Postcode / ZIP" className={inputCls} />
                </FormField>
                <FormField label="Country" required>
                  <select value={country} onChange={e => setCountry(e.target.value)} className={selectCls}>
                    <option value="">Select country</option>
                    {COUNTRIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </FormField>
              </div>
              {/* Key Contacts */}
              <p className="text-xs font-bold text-white/60 uppercase tracking-widest mb-4">Key Contacts</p>
              <div className="space-y-4 mb-8">
                {contacts.map((contact, idx) => (
                  <div key={contact.role} className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-5">
                    <p className="text-sm font-bold text-[#4fc487] mb-4 uppercase tracking-wide">{contact.role}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {[
                        { label: 'First Name', field: 'firstName' },
                        { label: 'Last Name', field: 'lastName' },
                        { label: 'Email', field: 'email' },
                        { label: 'LinkedIn', field: 'linkedin' },
                        { label: 'Telephone', field: 'telephone' },
                        { label: 'Mobile', field: 'mobile' },
                      ].map(f => (
                        <div key={f.field}>
                          <label className="block text-xs text-white/40 mb-1">{f.label}</label>
                          <Input value={(contact as Record<string,string>)[f.field]} onChange={e => updateContact(idx, f.field, e.target.value)} className={inputCls + ' h-9 text-xs'} />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              {/* Social Media */}
              <p className="text-xs font-bold text-white/60 uppercase tracking-widest mb-4">Social Media</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {SOCIAL_MEDIA_FIELDS.map(field => (
                  <FormField key={field.key} label={field.label}>
                    <Input value={socialMedia[field.key] || ''} onChange={e => setSocialMedia(prev => ({ ...prev, [field.key]: e.target.value }))} className={inputCls} />
                  </FormField>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3 — Turnover & Clients */}
          {step === 3 && (
            <div>
              <StepHeader icon="💰" title="Turnover & Clients" subtitle={`Revenue data (auto-updated: ${turnoverYears[0]}–${turnoverYears[4]})`} />
              <p className="text-xs text-white/30 mb-4">Revenue in EUR. Years auto-update annually.</p>
              <div className="overflow-x-auto mb-8">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-white/[0.06]">
                      <th className="text-left py-2 text-white/40 font-medium">Year</th>
                      <th className="text-left py-2 text-white/40 font-medium">Type</th>
                      {REVENUE_REGIONS.map(r => (
                        <th key={r} className="text-center py-2 text-white/40 font-medium px-2">{r}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {turnoverYears.map(year => (
                      ['Annual Revenue', 'EBITA'].map(type => (
                        <tr key={`${year}-${type}`} className="border-b border-white/[0.04]">
                          <td className="py-2 text-white/60 font-medium">{type === 'Annual Revenue' ? year : ''}</td>
                          <td className="py-2 text-white/40">{type}</td>
                          {REVENUE_REGIONS.map(region => (
                            <td key={region} className="py-1 px-1">
                              <input type="text" value={revenue[`${year}-${type}`]?.[region] || ''}
                                onChange={e => setRevenue(prev => ({
                                  ...prev,
                                  [`${year}-${type}`]: { ...prev[`${year}-${type}`], [region]: e.target.value }
                                }))}
                                className="w-20 bg-white/[0.04] border border-white/[0.08] text-white text-xs rounded-lg px-2 py-1.5 text-center" />
                            </td>
                          ))}
                        </tr>
                      ))
                    ))}
                  </tbody>
                </table>
              </div>
              {/* Main Clients */}
              <p className="text-xs font-bold text-white/60 uppercase tracking-widest mb-4">Main Clients</p>
              <div className="space-y-3">
                {clients.map((client, idx) => (
                  <div key={idx} className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <Input value={client.name} onChange={e => { const c = [...clients]; c[idx].name = e.target.value; setClients(c) }} placeholder="Client name" className={inputCls + ' h-9 text-xs'} />
                    <Input value={client.industry} onChange={e => { const c = [...clients]; c[idx].industry = e.target.value; setClients(c) }} placeholder="Industry" className={inputCls + ' h-9 text-xs'} />
                    <Input value={client.activities} onChange={e => { const c = [...clients]; c[idx].activities = e.target.value; setClients(c) }} placeholder="Activities" className={inputCls + ' h-9 text-xs'} />
                    <Input value={client.incidence} onChange={e => { const c = [...clients]; c[idx].incidence = e.target.value; setClients(c) }} placeholder="% incidence" className={inputCls + ' h-9 text-xs'} />
                  </div>
                ))}
                <button onClick={() => setClients(prev => [...prev, { name: '', industry: '', activities: '', year: '', turnover: '', incidence: '', exclusivity: false }])}
                  className="text-xs text-[#4fc487] hover:text-[#45b078]">+ Add client</button>
              </div>
            </div>
          )}

          {/* STEP 4 — Knowledge & Competencies */}
          {step === 4 && (
            <div>
              <StepHeader icon="🎯" title="Knowledge & Competencies" subtitle="Communication areas, capabilities, and service expertise" />
              {/* Communication Areas */}
              <p className="text-xs font-bold text-white/60 uppercase tracking-widest mb-3">Communication Areas</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-8">
                {COMMUNICATION_AREAS.map(area => (
                  <label key={area} className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer transition-all text-xs ${selectedSectors[area] ? 'bg-[#4fc487]/10 border-[#4fc487]/30 text-[#4fc487]' : 'bg-white/[0.03] border-white/[0.06] text-white/60 hover:border-white/20'}`}>
                    <input type="checkbox" checked={!!selectedSectors[area]} onChange={() => setSelectedSectors(prev => ({ ...prev, [area]: !prev[area] }))} className="w-3.5 h-3.5 accent-[#4fc487]" />
                    {area}
                  </label>
                ))}
              </div>
              {/* Capabilities */}
              <p className="text-xs font-bold text-white/60 uppercase tracking-widest mb-3">Capabilities</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
                {['Main', 'Secondary', 'Additional'].map((level, i) => (
                  <FormField key={level} label={`${level} Capability`}>
                    <select value={[mainCapability, secondaryCapability, additionalCapability][i]}
                      onChange={e => [setMainCapability, setSecondaryCapability, setAdditionalCapability][i](e.target.value)} className={selectCls}>
                      <option value="">Select</option>
                      {CAPABILITY_AREAS.map(a => <option key={a}>{a}</option>)}
                    </select>
                  </FormField>
                ))}
              </div>
              {/* Service allocation */}
              <p className="text-xs font-bold text-white/60 uppercase tracking-widest mb-3">Service Allocation <span className={`ml-2 ${allocationTotal > 100 ? 'text-red-400' : allocationTotal === 100 ? 'text-[#4fc487]' : ''}`}>({allocationTotal}%)</span></p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-8">
                {CAPABILITY_AREAS.map(area => (
                  <div key={area} className="flex items-center gap-3 bg-white/[0.03] rounded-xl px-4 py-2.5">
                    <span className="text-xs text-white/50 flex-1">{area}</span>
                    <div className="flex items-center gap-1">
                      <input type="number" min={0} max={100} value={capabilityAllocation[area] || ''}
                        onChange={e => setCapabilityAllocation(prev => ({ ...prev, [area]: e.target.value }))}
                        className="w-14 text-xs text-center bg-white/[0.04] border border-white/[0.08] text-white rounded-lg py-1" placeholder="0" />
                      <span className="text-xs text-white/30">%</span>
                    </div>
                  </div>
                ))}
              </div>
              {/* Service checkboxes */}
              <div className="space-y-6">
                {AGENCY_SERVICE_GROUPS.map(group => (
                  <div key={group.label}>
                    <p className="text-xs font-bold text-[#4fc487]/60 uppercase tracking-widest mb-2 flex items-center gap-2">
                      <span className="flex-1 h-px bg-white/[0.06]" />
                      {group.label}
                      <span className="flex-1 h-px bg-white/[0.06]" />
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                      {group.items.map(skill => (
                        <label key={skill} className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer transition-all text-xs ${competencies[skill] ? 'bg-[#4fc487]/10 border-[#4fc487]/30 text-[#4fc487]' : 'bg-white/[0.03] border-white/[0.06] text-white/50 hover:border-white/20'}`}>
                          <input type="checkbox" checked={!!competencies[skill]} onChange={() => toggleCompetency(skill)} className="w-3.5 h-3.5 accent-[#4fc487]" />
                          {skill}
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 5 — Governance & SOW */}
          {step === 5 && (
            <div>
              <StepHeader icon="📋" title="Governance & SOW" subtitle="About, governance, and outsourcing activities" />
              <div className="space-y-5">
                <FormField label="About Your Agency"><textarea value={about} onChange={e => setAbout(e.target.value)} rows={3} className={textareaCls} placeholder="Brief overview..." /></FormField>
                <FormField label="Philosophy & Competitive Advantages"><textarea value={philosophy} onChange={e => setPhilosophy(e.target.value)} rows={3} className={textareaCls} placeholder="What makes you different?" /></FormField>
                <FormField label="Network Description"><textarea value={networkDescription} onChange={e => setNetworkDescription(e.target.value)} rows={2} className={textareaCls} placeholder="Your agency network..." /></FormField>
                <FormField label="Local Representation"><textarea value={localRepresentation} onChange={e => setLocalRepresentation(e.target.value)} rows={2} className={textareaCls} placeholder="Local offices..." /></FormField>
                <div className="border-t border-white/[0.06] pt-5">
                  <p className="text-xs font-bold text-white/60 uppercase tracking-widest mb-4">Governance</p>
                  <FormField label="Quality Assurance & SLA Systems"><textarea value={governanceQA} onChange={e => setGovernanceQA(e.target.value)} rows={2} className={textareaCls} /></FormField>
                  <FormField label="Client Data Management Protocols" className="mt-4"><textarea value={governanceData} onChange={e => setGovernanceData(e.target.value)} rows={2} className={textareaCls} /></FormField>
                  <FormField label="Global vs. Local Governance" className="mt-4"><textarea value={governanceGlobal} onChange={e => setGovernanceGlobal(e.target.value)} rows={2} className={textareaCls} /></FormField>
                  <FormField label="Additional Information" className="mt-4"><textarea value={governanceAdditional} onChange={e => setGovernanceAdditional(e.target.value)} rows={2} className={textareaCls} /></FormField>
                </div>
                <div className="border-t border-white/[0.06] pt-5">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" checked={outsources} onChange={e => setOutsources(e.target.checked)} className="w-4 h-4 accent-[#4fc487]" />
                    <span className="text-sm text-white/60">Does your company subcontract activities or phases of services?</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* STEP 6 — People & Talent */}
          {step === 6 && (
            <div>
              <StepHeader icon="👥" title="People & Talent" subtitle="Staff headcount by department and primary talent" />
              <div className="space-y-6">
                {AGENCY_PEOPLE_DEPARTMENTS.map(dept => (
                  <div key={dept.label}>
                    <p className="text-xs font-bold text-[#4fc487]/60 uppercase tracking-widest mb-2">{dept.label}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {dept.roles.slice(0, 6).map(role => (
                        <div key={role} className="flex items-center gap-2 bg-white/[0.03] rounded-xl px-3 py-2">
                          <span className="text-xs text-white/50 flex-1 truncate">{role}</span>
                          <input type="number" min={0} value={peopleCounts[role]?.employees || ''} onChange={e => setPeopleCounts(prev => ({ ...prev, [role]: { ...prev[role], employees: e.target.value, freelancers: prev[role]?.freelancers || '' } }))}
                            placeholder="Emp" className="w-14 text-xs text-center bg-white/[0.04] border border-white/[0.08] text-white rounded-lg py-1" />
                          <input type="number" min={0} value={peopleCounts[role]?.freelancers || ''} onChange={e => setPeopleCounts(prev => ({ ...prev, [role]: { ...prev[role], freelancers: e.target.value, employees: prev[role]?.employees || '' } }))}
                            placeholder="Free" className="w-14 text-xs text-center bg-white/[0.04] border border-white/[0.08] text-white rounded-lg py-1" />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t border-white/[0.06] pt-5 mt-6">
                <p className="text-xs font-bold text-white/60 uppercase tracking-widest mb-4">Primary Talent</p>
                {talentEntries.map((t, i) => (
                  <div key={t.role} className="grid grid-cols-3 gap-3 mb-3">
                    <span className="text-xs text-white/50 flex items-center">{t.role}</span>
                    <Input value={t.name} onChange={e => { const n = [...talentEntries]; n[i].name = e.target.value; setTalentEntries(n) }} placeholder="Name" className={inputCls + ' h-8 text-xs'} />
                    <Input value={t.linkedin} onChange={e => { const n = [...talentEntries]; n[i].linkedin = e.target.value; setTalentEntries(n) }} placeholder="LinkedIn" className={inputCls + ' h-8 text-xs'} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 7 — Awards & Infos */}
          {step === 7 && (
            <div>
              <StepHeader icon="🏆" title="Awards & Infos" subtitle="Awards, AI usage, and social responsibility" />
              <div className="space-y-4 mb-8">
                {awards.map((award, i) => (
                  <div key={award.name} className="grid grid-cols-2 sm:grid-cols-6 gap-2 items-center">
                    <span className="text-xs text-white/50 col-span-2 sm:col-span-1">{award.name}</span>
                    <Input value={award.distinction} onChange={e => { const a = [...awards]; a[i].distinction = e.target.value; setAwards(a) }} placeholder="Distinction" className={inputCls + ' h-8 text-xs'} />
                    <Input value={award.category} onChange={e => { const a = [...awards]; a[i].category = e.target.value; setAwards(a) }} placeholder="Category" className={inputCls + ' h-8 text-xs'} />
                    <Input value={award.year} onChange={e => { const a = [...awards]; a[i].year = e.target.value; setAwards(a) }} placeholder="Year" className={inputCls + ' h-8 text-xs'} />
                    <Input value={award.ad} onChange={e => { const a = [...awards]; a[i].ad = e.target.value; setAwards(a) }} placeholder="Ad" className={inputCls + ' h-8 text-xs'} />
                    <Input value={award.brand} onChange={e => { const a = [...awards]; a[i].brand = e.target.value; setAwards(a) }} placeholder="Brand" className={inputCls + ' h-8 text-xs'} />
                  </div>
                ))}
              </div>
              <div className="border-t border-white/[0.06] pt-5 space-y-4 mb-8">
                <p className="text-xs font-bold text-white/60 uppercase tracking-widest mb-2">AI Usage</p>
                {AI_QUESTIONS.map((q, i) => (
                  <FormField key={i} label={q}>
                    <textarea value={aiAnswers[`ai-${i}`] || ''} onChange={e => setAiAnswers(prev => ({ ...prev, [`ai-${i}`]: e.target.value }))} rows={2} className={textareaCls} />
                  </FormField>
                ))}
              </div>
              <div className="border-t border-white/[0.06] pt-5 space-y-3">
                <p className="text-xs font-bold text-white/60 uppercase tracking-widest mb-2">Social Responsibility</p>
                {SOCIAL_RESPONSIBILITY_QUESTIONS.map((q) => (
                  <div key={q.id}>
                    <div className="flex items-start gap-3 bg-white/[0.03] rounded-xl p-3">
                      <span className="text-xs text-white/40 font-mono w-8 flex-shrink-0">{q.id}</span>
                      <span className="text-xs text-white/50 flex-1">{q.text}</span>
                      <select value={srAnswers[`sr-${q.id}`] || ''} onChange={e => setSrAnswers(prev => ({ ...prev, [`sr-${q.id}`]: e.target.value }))}
                        className="bg-white/[0.04] border border-white/[0.08] text-white text-xs rounded-lg px-2 py-1">
                        <option value="">—</option>
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                      </select>
                    </div>
                    {q.id === '1.6' && (
                      <div className="ml-11 mt-2 grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {CSR_IMPACT_AREAS.map(area => (
                          <label key={area} className="flex items-center gap-2 bg-white/[0.02] rounded-lg p-2 cursor-pointer hover:bg-white/[0.04] transition">
                            <input type="checkbox" checked={!!srAnswers[`impact-${area}`]} onChange={e => setSrAnswers(prev => ({ ...prev, [`impact-${area}`]: e.target.checked ? 'yes' : '' }))}
                              className="w-3.5 h-3.5 rounded border-white/20 bg-white/[0.06] accent-[#4fc487]" />
                            <span className="text-xs text-white/60">{area}</span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 8 — Add-On */}
          {step === 8 && (
            <div>
              <StepHeader icon="📎" title="Add-On" subtitle="Investments, attachments, and strategic development" />
              <p className="text-xs font-bold text-white/60 uppercase tracking-widest mb-4">% of Turnover Invested</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                {INVESTMENT_CATEGORIES.map(cat => (
                  <div key={cat} className="flex items-center gap-3 bg-white/[0.03] rounded-xl px-4 py-2.5">
                    <span className="text-xs text-white/50 flex-1">{cat}</span>
                    <div className="flex items-center gap-1">
                      <input type="number" min={0} max={100} value={investments[cat] || ''}
                        onChange={e => setInvestments(prev => ({ ...prev, [cat]: e.target.value }))}
                        className="w-14 text-xs text-center bg-white/[0.04] border border-white/[0.08] text-white rounded-lg py-1" placeholder="0" />
                      <span className="text-xs text-white/30">%</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="space-y-5">
                <FormField label="Strategic Development Orientation">
                  <textarea value={strategicDev} onChange={e => setStrategicDev(e.target.value)} rows={3} className={textareaCls} placeholder="Present your strategic development plan..." />
                </FormField>
                <FormField label="Activity Outside Your Location">
                  <textarea value={activityOutside} onChange={e => setActivityOutside(e.target.value)} rows={2} className={textareaCls} placeholder="International presence..." />
                </FormField>
              </div>
              <div className="border-t border-white/[0.06] pt-5 mt-6">
                <p className="text-xs font-bold text-white/60 uppercase tracking-widest mb-3">Attachments</p>
                <p className="text-xs text-white/30 mb-3">Upload: Org Chart, Chamber of Commerce Extract, References, Company Profile, Certifications</p>
                <div className="border-2 border-dashed border-white/[0.08] rounded-xl p-8 text-center">
                  <p className="text-sm text-white/30">Drag & drop files here or click to browse</p>
                  <p className="text-xs text-white/20 mt-1">PDF, PPT, DOC — max 10MB each</p>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Navigation buttons */}
        <div className="flex items-center justify-between mt-6">
          <div>
            {step > 1 ? (
              <Button variant="outline" onClick={() => setStep(s => s - 1)} className="border-white/20 text-white hover:bg-white/10 rounded-full">
                <ChevronLeft className="w-4 h-4 mr-1" /> Back
              </Button>
            ) : (
              <Link href="/signup">
                <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 rounded-full">
                  <ChevronLeft className="w-4 h-4 mr-1" /> Cancel
                </Button>
              </Link>
            )}
          </div>
          <div className="flex items-center gap-3">
            {step < REGISTRATION_STEPS.length ? (
              <>
                <Button variant="ghost" className="text-white/30 hover:text-white" onClick={() => setStep(s => s + 1)}>
                  Skip for now
                </Button>
                <Button onClick={() => setStep(s => s + 1)} disabled={!canProceed()}
                  className="bg-[#4fc487] hover:bg-[#45b078] text-white px-6 rounded-full">
                  Continue <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </>
            ) : (
              <Button onClick={handleSubmit} disabled={isSubmitting}
                className="bg-[#4fc487] hover:bg-[#45b078] text-white px-8 rounded-full">
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" /><path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="4" className="opacity-75" /></svg>
                    Submitting...
                  </span>
                ) : (
                  <><Building2 className="w-4 h-4 mr-2" /> Submit Registration</>
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
      <label className="block text-sm font-medium text-white/60 mb-1.5">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      {children}
    </div>
  )
}

const inputCls = 'h-10 bg-white/[0.06] border-white/[0.12] text-white placeholder:text-white/20 rounded-full'
const selectCls = 'w-full h-10 bg-white/[0.06] border border-white/[0.12] text-white text-sm rounded-full px-3 focus:outline-none focus:ring-2 focus:ring-[#4fc487]'
const textareaCls = 'w-full bg-white/[0.06] border border-white/[0.12] text-white text-sm rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#4fc487] resize-none placeholder:text-white/20'
