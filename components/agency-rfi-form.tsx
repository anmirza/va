'use client'

/**
 * agency-rfi-form.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Shared 8-step Agency RFI form used by:
 *   - /app/admin/agencies/create (mode="admin")
 *   - /app/signup/agency          (mode="signup")
 *
 * Step labels are loaded from Firestore (config/rfiStepLabels › cat-agency)
 * and fall back to the static REGISTRATION_STEPS constants if not found.
 */

import { useState, useEffect, useRef } from 'react'
import { ChevronRight, ChevronLeft, Check, Building2, Plus, Trash2, Copy, Link as LinkIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/lib/auth-context'
import {
  createOrgFS, createInvitationFS, getOrgByIdFS, updateOrgFS,
  getRfiStepLabelsFS,
} from '@/lib/admin-firestore'
import {
  AGENCY_CATEGORIES, TOP_CURRENCIES, EMPLOYEE_SIZES, COMPANY_LEVELS,
  COUNTRY_COVERAGE, COUNTRIES, COMMUNICATION_AREAS, AGENCY_SERVICE_GROUPS,
  CAPABILITY_AREAS, AGENCY_CONTACT_ROLES, SOCIAL_MEDIA_FIELDS,
  AGENCY_PEOPLE_DEPARTMENTS, AGENCY_AWARDS,
  AI_QUESTIONS, SOCIAL_RESPONSIBILITY_QUESTIONS, INVESTMENT_CATEGORIES,
  REGISTRATION_STEPS, CSR_IMPACT_AREAS, ATTACHMENTS_REQUESTED,
  GOVERNANCE_QUESTIONS,
} from '@/lib/rfi-data'
import { getTurnoverYears, REVENUE_REGIONS } from '@/lib/turnover-utils'
import type { RfiStep } from '@/lib/admin-store'
import { useRfiSchema } from '@/lib/use-rfi-schema'
import { CustomFieldsSection } from '@/components/rfi/field-renderer'

// ── Types ─────────────────────────────────────────────────────────────────────

interface AgencyRfiFormProps {
  /** admin: shows invite-link step after submit; signup: shows success + redirect */
  mode: 'admin' | 'signup'
  /** pre-fill & edit an existing org (admin mode only) */
  editId?: string | null
  /** called after navigating away — e.g. router.push('/admin/agencies') */
  onDone?: () => void
}

// ── Styles ────────────────────────────────────────────────────────────────────
const inputCls    = 'h-10 bg-white/[0.06] border-white/[0.12] text-white placeholder:text-white/20 rounded-xl'
const selectCls   = 'w-full h-10 bg-white/[0.06] border border-white/[0.12] text-white text-sm rounded-xl px-3 focus:outline-none focus:ring-2 focus:ring-[#0763d8] [&_option]:bg-[#1a1d2e] [&_option]:text-white'
const textareaCls = 'w-full bg-white/[0.06] border border-white/[0.12] text-white text-sm rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#0763d8] resize-none placeholder:text-white/20'

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

function FormField({ label, required, children, className }: {
  label: string; required?: boolean; children: React.ReactNode; className?: string
}) {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-white/60 mb-1.5">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      {children}
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export function AgencyRfiForm({ mode, editId, onDone }: AgencyRfiFormProps) {
  const { user } = useAuth()
  const schema = useRfiSchema('cat-agency')
  const [stepLabels, setStepLabels] = useState<RfiStep[]>([...REGISTRATION_STEPS])
  const [isEditMode, setIsEditMode] = useState(false)
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [orgCreated, setOrgCreated] = useState(false)
  const [orgId, setOrgId] = useState('')
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteLink, setInviteLink] = useState('')
  const [copied, setCopied] = useState(false)
  /** Stores values for admin-added custom fields keyed by field id. */
  const [customFieldsData, setCustomFieldsData] = useState<Record<string, unknown>>({})

  // ── Load dynamic step labels from Firestore ───────────────────────────────
  useEffect(() => {
    getRfiStepLabelsFS('cat-agency').then(labels => {
      if (labels && labels.length > 0) setStepLabels(labels)
    })
  }, [])

  // ── Step 1 — General Info ─────────────────────────────────────────────────
  const [businessName,    setBusinessName]    = useState('')
  const [dunsNumber,      setDunsNumber]      = useState('')
  const [vatNumber,       setVatNumber]       = useState('')
  const [legalForm,       setLegalForm]       = useState('')
  const [companyRegNumber,setCompanyRegNumber]= useState('')
  const [yearEstablished, setYearEstablished] = useState('')
  const [employees,       setEmployees]       = useState('')
  const [companyLevel,    setCompanyLevel]    = useState('')
  const [parentCompany,   setParentCompany]   = useState('')
  const [category,        setCategory]        = useState('')
  const [currency,        setCurrency]        = useState('Euro - EUR')
  const [tradeOrganizations, setTradeOrganizations] = useState('')

  // ── Step 2 — Contacts ─────────────────────────────────────────────────────
  const [contacts, setContacts] = useState(
    AGENCY_CONTACT_ROLES.map(role => ({ role, firstName: '', lastName: '', linkedin: '', telephone: '', mobile: '', email: '' }))
  )
  const [socialMedia, setSocialMedia] = useState<Record<string, string>>({})
  const lastContactRef = useRef<HTMLDivElement | null>(null)
  const [shouldScrollToNewContact, setShouldScrollToNewContact] = useState(false)

  // ── Step 3 — Location, About & Turnover ──────────────────────────────────
  const turnoverYears = getTurnoverYears()
  const [countryCoverage, setCountryCoverage] = useState('')
  const [address,  setAddress]  = useState('')
  const [postcode, setPostcode] = useState('')
  const [city,     setCity]     = useState('')
  const [country,  setCountry]  = useState('')
  const [about,    setAbout]    = useState('')
  const [philosophy, setPhilosophy] = useState('')
  const [networkDescription,  setNetworkDescription]  = useState('')
  const [localRepresentation, setLocalRepresentation] = useState('')
  const [revenue, setRevenue] = useState<Record<string, Record<string, string>>>({})
  const [clients, setClients] = useState([{ name: '', industry: '', activities: '', year: '', turnover: '', incidence: '', exclusivity: false }])
  const [workedWithClient, setWorkedWithClient] = useState('')
  const [clientPitch, setClientPitch] = useState([{ division: '', activities: '', year: '', turnover: '', incidence: '' }])
  const [clientDuration, setClientDuration] = useState('')

  // ── Step 4 — Knowledge & Competencies ────────────────────────────────────
  const [competencies,        setCompetencies]        = useState<Record<string, string>>({})
  const [mainCapability,      setMainCapability]      = useState('')
  const [secondaryCapability, setSecondaryCapability] = useState('')
  const [additionalCapability,setAdditionalCapability]= useState('')
  const [sectorPercentages,   setSectorPercentages]   = useState<Record<string, string>>({})
  const [outsources, setOutsources] = useState(false)
  const [outsourcedActivities, setOutsourcedActivities] = useState([{ activity: '', description: '', contractualValue: '' }])

  // ── Step 5 — Governance & SOW ─────────────────────────────────────────────
  const [governanceQA,       setGovernanceQA]       = useState('')
  const [governanceData,     setGovernanceData]     = useState('')
  const [governanceGlobal,   setGovernanceGlobal]   = useState('')
  const [governanceAdditional, setGovernanceAdditional] = useState('')

  // ── Step 6 — People & Talent ──────────────────────────────────────────────
  const [peopleCounts, setPeopleCounts] = useState<Record<string, { employees: string; freelancers: string; salary: string }>>({})
  const [otherRoles,   setOtherRoles]   = useState([{ id: 'other-1', name: 'Other' }])
  const [talentEntries, setTalentEntries] = useState([{ role: '', name: '', linkedin: '' }])

  // ── Step 7 — Awards & Infos ───────────────────────────────────────────────
  const [awards, setAwards] = useState(
    AGENCY_AWARDS.map(name => ({ name, distinction: '', category: '', year: '', ad: '', brand: '' }))
  )
  const [aiAnswers, setAiAnswers]  = useState<Record<string, string>>({})
  const [srAnswers, setSrAnswers]  = useState<Record<string, string>>({})

  // ── Step 8 — Add-On ───────────────────────────────────────────────────────
  const [investments,   setInvestments]   = useState<Record<string, string>>({})
  const [strategicDev,  setStrategicDev]  = useState('')
  const [activityOutside, setActivityOutside] = useState('')

  // ── Load existing org for edit mode ──────────────────────────────────────
  useEffect(() => {
    if (!editId) return
    getOrgByIdFS(editId).then(org => {
      if (!org?.profileData) return
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
      if (p.socialMedia) setSocialMedia(p.socialMedia)
      if (p.revenue) setRevenue(p.revenue)
      if (p.clients) setClients(p.clients)
      setWorkedWithClient(p.workedWithClient || '')
      if (p.clientPitch) setClientPitch(p.clientPitch)
      setClientDuration(p.clientDuration || '')
      if (p.competencies) setCompetencies(p.competencies)
      setMainCapability(p.mainCapability || '')
      setSecondaryCapability(p.secondaryCapability || '')
      setAdditionalCapability(p.additionalCapability || '')
      if (p.sectorPercentages) setSectorPercentages(p.sectorPercentages)
      if (p.outsourcedActivities) setOutsourcedActivities(p.outsourcedActivities)
      setAbout(p.about || '')
      setPhilosophy(p.philosophy || '')
      setNetworkDescription(p.networkDescription || '')
      setLocalRepresentation(p.localRepresentation || '')
      setGovernanceQA(p.governanceQA || '')
      setGovernanceData(p.governanceData || '')
      setGovernanceGlobal(p.governanceGlobal || '')
      setGovernanceAdditional(p.governanceAdditional || '')
      setOutsources(!!p.outsources)
      if (p.peopleCounts) setPeopleCounts(p.peopleCounts)
      if (p.talentEntries) setTalentEntries(p.talentEntries)
      if (p.awards) setAwards(p.awards)
      if (p.aiAnswers) setAiAnswers(p.aiAnswers)
      if (p.srAnswers) setSrAnswers(p.srAnswers)
      if (p.investments) setInvestments(p.investments)
      setStrategicDev(p.strategicDev || '')
      setActivityOutside(p.activityOutside || '')
      if (p.customFields && typeof p.customFields === 'object') {
        setCustomFieldsData(p.customFields as Record<string, unknown>)
      }
    })
  }, [editId])

  // ── Scroll to newly added contact ────────────────────────────────────────
  useEffect(() => {
    if (shouldScrollToNewContact && lastContactRef.current) {
      lastContactRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
      setShouldScrollToNewContact(false)
    }
  }, [shouldScrollToNewContact, contacts.length])

  const updateContact = (idx: number, field: string, value: string) =>
    setContacts(prev => prev.map((c, i) => i === idx ? { ...c, [field]: value } : c))

  const canProceed = () => step === 1 ? businessName.trim().length > 0 : true

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    setIsSubmitting(true)
    await new Promise(r => setTimeout(r, 1200))

    const finalPeopleCounts = { ...peopleCounts }
    otherRoles.forEach(r => {
      if (finalPeopleCounts[r.id]) {
        const stats = finalPeopleCounts[r.id]
        delete finalPeopleCounts[r.id]
        if (r.name.trim()) finalPeopleCounts[r.name.trim()] = stats
      }
    })

    const profile = {
      businessName, dunsNumber, vatNumber, legalForm, companyRegNumber, yearEstablished,
      employees, companyLevel, parentCompany, category, currency, tradeOrganizations,
      countryCoverage, address, postcode, city, country, contacts, socialMedia,
      revenue, clients, workedWithClient, clientPitch, clientDuration,
      competencies, mainCapability, secondaryCapability, additionalCapability,
      sectorPercentages, outsourcedActivities, outsources,
      about, philosophy, networkDescription, localRepresentation,
      governanceQA, governanceData, governanceGlobal, governanceAdditional,
      peopleCounts: finalPeopleCounts, talentEntries,
      awards, aiAnswers, srAnswers,
      investments, strategicDev, activityOutside,
      customFields: customFieldsData,
      submittedAt: new Date().toISOString(),
    }

    if (isEditMode && editId) {
      await updateOrgFS(editId, {
        name: businessName, country, category,
        description: about.substring(0, 200),
        profileData: profile as Record<string, unknown>,
      }, user?.id ?? 'admin')
      setIsSubmitting(false)
      onDone?.()
      return
    }

    const org = await createOrgFS({
      name: businessName, country, category,
      description: about.substring(0, 200),
      type: 'agency',
      profileData: profile as Record<string, unknown>,
    }, user?.id ?? 'admin')

    setOrgId(org.id)
    setOrgCreated(true)
    setIsSubmitting(false)
    setStep(9)
  }

  const handleGenerateInvite = async () => {
    const inv = await createInvitationFS(orgId, businessName, 'agency', user?.id ?? 'admin', inviteEmail || undefined)
    const url = `${window.location.origin}/signup/accept-invite?token=${inv.token}`
    setInviteLink(url)
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(inviteLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // ── Success screen (signup mode) ──────────────────────────────────────────
  if (orgCreated && mode === 'signup') {
    return (
      <div className="min-h-screen bg-[#02030E] flex items-center justify-center p-4 text-center">
        <div className="glass-card max-w-md p-10 rounded-3xl border-emerald-500/20">
          <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-500/20">
            <svg className="w-8 h-8 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Registration Received</h2>
          <p className="text-white/40 mb-8 text-sm leading-relaxed">
            Thank you for registering your agency. Our team will review your details and notify you once your profile is active.
          </p>
          <button onClick={() => onDone?.()} className="w-full h-12 bg-emerald-500 text-white rounded-xl font-bold hover:bg-emerald-600 transition-all">
            Return to Dashboard
          </button>
        </div>
      </div>
    )
  }

  // ── Step 9: Invite link (admin mode) ─────────────────────────────────────
  if (step === 9 && mode === 'admin') {
    return (
      <div className="max-w-xl mx-auto mt-10">
        <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-5 flex items-center gap-3 mb-6">
          <Check className="w-5 h-5 text-emerald-400 shrink-0" />
          <div>
            <p className="font-medium text-white">{businessName} created successfully!</p>
            <p className="text-sm text-white/50">Now invite the first moderator to manage this agency profile.</p>
          </div>
        </div>
        <div className="glass-card rounded-2xl p-6 space-y-4 mb-6">
          <div className="flex items-center gap-2">
            <LinkIcon className="w-4 h-4 text-[#0763d8]" />
            <h2 className="font-semibold text-white text-sm">Invite First Moderator</h2>
          </div>
          <p className="text-xs text-white/40">Generate an invite link to send to the person who will own and manage this agency profile.</p>
          <div>
            <label className="block text-xs font-medium text-white/60 mb-1.5">Moderator Email (optional)</label>
            <Input value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} type="email" placeholder="email@agency.com" className="h-10 bg-white/[0.04] border-white/[0.1] text-white placeholder:text-white/30 rounded-xl" />
          </div>
          {!inviteLink ? (
            <Button onClick={handleGenerateInvite} className="w-full h-10 bg-[#0763d8] hover:bg-[#0655b3] text-white rounded-xl">
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
              <p className="text-xs text-white/30">Share this link with the agency owner. They must sign up using a corporate email.</p>
            </div>
          )}
        </div>
        <div className="flex justify-center">
          <Button variant="outline" onClick={() => onDone?.()} className="h-10 border-white/[0.1] text-white/60 hover:text-white rounded-xl px-8">
            Back to Agencies List
          </Button>
        </div>
      </div>
    )
  }

  // ── Form ──────────────────────────────────────────────────────────────────
  return (
    <div className="max-w-5xl w-full mx-auto px-4 pt-2 pb-10">

      {/* Progress stepper */}
      <div className="mb-10">
        <div className="flex items-center gap-0 overflow-x-auto pb-4 scrollbar-hide">
          {stepLabels.map((s, i) => (
            <div key={s.key} className="flex items-center flex-shrink-0">
              <button
                onClick={() => step > i + 1 && setStep(i + 1)}
                className={`flex items-center gap-2 px-3 py-2 rounded-full text-xs font-medium transition-colors ${
                  i + 1 === step ? 'bg-[#0763d8]/20 text-[#0763d8] border border-[#0763d8]/30' :
                  i + 1 < step  ? 'text-[#0763d8] cursor-pointer hover:bg-white/[0.06]' :
                                   'text-white/20 cursor-default'
                }`}
              >
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                  i + 1 < step  ? 'bg-[#0763d8] text-white' :
                  i + 1 === step ? 'bg-[#0763d8]/30 text-[#0763d8]' :
                                   'bg-white/[0.06] text-white/30'
                }`}>
                  {i + 1 < step ? <Check className="w-3 h-3" /> : i + 1}
                </span>
                <span className="hidden sm:inline">{s.shortLabel}</span>
              </button>
              {i < stepLabels.length - 1 && <div className="w-6 h-px bg-white/[0.08] flex-shrink-0" />}
            </div>
          ))}
        </div>
        <div className="mt-3 h-1.5 bg-white/[0.06] rounded-full">
          <div
            className="h-full bg-[#0763d8] rounded-full transition-all duration-500"
            style={{ width: `${((step - 1) / Math.max(stepLabels.length - 1, 1)) * 100}%` }}
          />
        </div>
      </div>

      {/* Step content card */}
      <div className="glass-card p-8">

        {/* ── STEP 1 — General Information ── */}
        {step === 1 && (
          <div>
            <StepHeader icon={stepLabels[0]?.icon ?? '🏢'} title={stepLabels[0]?.label ?? 'General Information'} subtitle={stepLabels[0]?.subtitle ?? 'Legal identity, Organisation & Structure'} />
            <div className="mb-8">
              <h3 className="text-sm font-semibold text-white/80 mb-4 flex items-center gap-2">
                <span className="w-1 h-4 bg-[#0763d8] rounded-full" />Legal identity
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {schema.isVisible('businessName') && (
                  <FormField label={schema.getLabel('businessName', 'Registered Business Name')} required={schema.isRequired('businessName', true)}>
                    <Input value={businessName} onChange={e => setBusinessName(e.target.value)} placeholder={schema.getPlaceholder('businessName', 'e.g. Acme Agency Ltd.')} className={inputCls} />
                  </FormField>
                )}
                {schema.isVisible('dunsNumber') && (
                  <FormField label={schema.getLabel('dunsNumber', 'D-U-N-S® Number')} required={schema.isRequired('dunsNumber', false)}>
                    <Input value={dunsNumber} onChange={e => setDunsNumber(e.target.value)} placeholder={schema.getPlaceholder('dunsNumber', '9-digit number')} className={inputCls} />
                  </FormField>
                )}
                {schema.isVisible('vatNumber') && (
                  <FormField label={schema.getLabel('vatNumber', 'VAT Registration Number')} required={schema.isRequired('vatNumber', false)}>
                    <Input value={vatNumber} onChange={e => setVatNumber(e.target.value)} placeholder={schema.getPlaceholder('vatNumber', 'e.g. GB123456789')} className={inputCls} />
                  </FormField>
                )}
                {schema.isVisible('legalForm') && (
                  <FormField label={schema.getLabel('legalForm', 'Legal Form')} required={schema.isRequired('legalForm', false)}>
                    <Input value={legalForm} onChange={e => setLegalForm(e.target.value)} placeholder={schema.getPlaceholder('legalForm', 'e.g. Ltd, GmbH, S.A.S.')} className={inputCls} />
                  </FormField>
                )}
                {schema.isVisible('companyRegNumber') && (
                  <FormField label={schema.getLabel('companyRegNumber', 'Company Registration Number')} required={schema.isRequired('companyRegNumber', false)}>
                    <Input value={companyRegNumber} onChange={e => setCompanyRegNumber(e.target.value)} placeholder={schema.getPlaceholder('companyRegNumber', 'Companies House number')} className={inputCls} />
                  </FormField>
                )}
                {schema.isVisible('yearEstablished') && (
                  <FormField label={schema.getLabel('yearEstablished', 'Year Established')} required={schema.isRequired('yearEstablished', false)}>
                    <Input type="number" value={yearEstablished} onChange={e => setYearEstablished(e.target.value)} placeholder={schema.getPlaceholder('yearEstablished', 'e.g. 2005')} className={inputCls} />
                  </FormField>
                )}
              </div>
            </div>
            <div className="border-t border-white/[0.08] my-8" />
            <div>
              <h3 className="text-sm font-semibold text-white/80 mb-4 flex items-center gap-2">
                <span className="w-1 h-4 bg-[#0763d8] rounded-full" />Organisation & Structure
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {schema.isVisible('employees') && (
                  <FormField label={schema.getLabel('employees', '# of Employees')} required={schema.isRequired('employees', true)}>
                    <select value={employees} onChange={e => setEmployees(e.target.value)} className={selectCls}>
                      <option value="">Select range</option>
                      {EMPLOYEE_SIZES.map(r => <option key={r}>{r}</option>)}
                    </select>
                  </FormField>
                )}
                {schema.isVisible('companyLevel') && (
                  <FormField label={schema.getLabel('companyLevel', 'Company Level')} required={schema.isRequired('companyLevel', false)}>
                    <select value={companyLevel} onChange={e => setCompanyLevel(e.target.value)} className={selectCls}>
                      <option value="">Select level</option>
                      {COMPANY_LEVELS.map(l => <option key={l}>{l}</option>)}
                    </select>
                  </FormField>
                )}
                {schema.isVisible('parentCompany') && (
                  <FormField label={schema.getLabel('parentCompany', 'Parent Company Name')} required={schema.isRequired('parentCompany', false)}>
                    <Input value={parentCompany} onChange={e => setParentCompany(e.target.value)} placeholder={schema.getPlaceholder('parentCompany', 'If part of a group')} className={inputCls} />
                  </FormField>
                )}
                {schema.isVisible('category') && (
                  <FormField label={schema.getLabel('category', 'Category')} required={schema.isRequired('category', true)}>
                    <select value={category} onChange={e => setCategory(e.target.value)} className={selectCls}>
                      <option value="">Select category</option>
                      {AGENCY_CATEGORIES.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </FormField>
                )}
                {schema.isVisible('currency') && (
                  <FormField label={schema.getLabel('currency', 'Agency Currency')} required={schema.isRequired('currency', false)}>
                    <select value={currency} onChange={e => setCurrency(e.target.value)} className={selectCls}>
                      {TOP_CURRENCIES.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </FormField>
                )}
                {schema.isVisible('tradeOrganizations') && (
                  <FormField label={schema.getLabel('tradeOrganizations', 'Trade Organizations')} required={schema.isRequired('tradeOrganizations', false)}>
                    <Input value={tradeOrganizations} onChange={e => setTradeOrganizations(e.target.value)} placeholder={schema.getPlaceholder('tradeOrganizations', 'e.g. IPA, ISBA, EACA')} className={inputCls} />
                  </FormField>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 2 — Contacts ── */}
        {step === 2 && (
          <div>
            <StepHeader icon={stepLabels[1]?.icon ?? '📞'} title={stepLabels[1]?.label ?? 'Contacts'} subtitle={stepLabels[1]?.subtitle ?? 'Key contacts and social media'} />
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-bold text-white/60 uppercase tracking-widest">Key Contacts</p>
              <Button type="button" variant="outline" onClick={() => {
                setContacts(p => [...p, { role: 'Additional Contact', firstName: '', lastName: '', email: '', linkedin: '', telephone: '', mobile: '' }])
                setShouldScrollToNewContact(true)
              }} className="text-xs h-8 px-3"><Plus className="w-3 h-3 mr-1" /> Add Contact</Button>
            </div>
            <div className="space-y-4 mb-8">
              {contacts.map((contact, idx) => (
                <div key={idx} ref={idx === contacts.length - 1 ? lastContactRef : null}
                  className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-5">
                  <div className="flex items-center justify-between mb-4">
                    {idx >= AGENCY_CONTACT_ROLES.length ? (
                      <Input value={contact.role} onChange={e => updateContact(idx, 'role', e.target.value)}
                        placeholder="Role Name" className="max-w-[200px] h-8 text-sm font-bold bg-transparent border-b border-white/20 rounded-none px-0 text-[#0763d8] uppercase tracking-wide focus-visible:ring-0 focus-visible:border-[#0763d8]" />
                    ) : (
                      <p className="text-sm font-bold text-[#0763d8] uppercase tracking-wide">{contact.role}</p>
                    )}
                    {idx >= AGENCY_CONTACT_ROLES.length && (
                      <button onClick={() => setContacts(p => p.filter((_, i) => i !== idx))} className="text-red-400 hover:text-red-500 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {(['firstName','lastName','email','linkedin','telephone','mobile'] as const).map(f => (
                      <div key={f}>
                        <label className="block text-xs text-white/40 mb-1 capitalize">{f === 'firstName' ? 'First Name' : f === 'lastName' ? 'Last Name' : f.charAt(0).toUpperCase() + f.slice(1)}</label>
                        <Input value={(contact as Record<string,string>)[f]} onChange={e => updateContact(idx, f, e.target.value)} className={inputCls + ' h-9 text-xs'} />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-white/[0.08] pt-6">
              <h3 className="text-sm font-semibold text-white/80 mb-4 flex items-center gap-2">
                <span className="w-1 h-4 bg-[#0763d8] rounded-full" />Social Media
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {SOCIAL_MEDIA_FIELDS.map(field => (
                <FormField key={field.key} label={field.label}>
                  <Input value={socialMedia[field.key] || ''} onChange={e => setSocialMedia(prev => ({ ...prev, [field.key]: e.target.value }))} className={inputCls} />
                </FormField>
              ))}
            </div>
          </div>
        )}

        {/* ── STEP 3 — Location, About & Turnover ── */}
        {step === 3 && (
          <div>
            <StepHeader icon={stepLabels[2]?.icon ?? '📍'} title={stepLabels[2]?.label ?? 'Location & Profile'} subtitle={stepLabels[2]?.subtitle ?? 'Registered address, agency overview, and financial information'} />
            <h3 className="text-sm font-semibold text-white/80 mb-4 flex items-center gap-2">
              <span className="w-1 h-4 bg-[#0763d8] rounded-full" />Registered Office Address
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-2">
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
            <div className="border-t border-white/[0.08] my-8" />
            <h3 className="text-sm font-semibold text-white/80 mb-4 flex items-center gap-2">
              <span className="w-1 h-4 bg-[#0763d8] rounded-full" />About Your Agency
            </h3>
            <div className="space-y-5 mb-8">
              <FormField label="Agency Overview">
                <textarea value={about} onChange={e => setAbout(e.target.value)} rows={3} className={textareaCls} placeholder="Brief overview..." />
              </FormField>
              <FormField label="Philosophy & Competitive Advantages">
                <textarea value={philosophy} onChange={e => setPhilosophy(e.target.value)} rows={3} className={textareaCls} placeholder="What makes you different?" />
              </FormField>
              <FormField label="Network Description">
                <textarea value={networkDescription} onChange={e => setNetworkDescription(e.target.value)} rows={2} className={textareaCls} placeholder="Your agency network..." />
              </FormField>
              <FormField label="Local Representation">
                <textarea value={localRepresentation} onChange={e => setLocalRepresentation(e.target.value)} rows={2} className={textareaCls} placeholder="Local offices..." />
              </FormField>
            </div>
            <div className="border-t border-white/[0.08] my-8" />
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-sm font-semibold text-white/80 flex items-center gap-2">
                <span className="w-1 h-4 bg-[#0763d8] rounded-full" />Turnover &amp; Clients
              </h3>
              <p className="text-xs text-white/30">Revenue in EUR</p>
            </div>
            <div className="overflow-x-auto mb-8">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-white/[0.06]">
                    <th className="text-left py-2 text-white/40 font-medium">Year</th>
                    <th className="text-left py-2 text-white/40 font-medium">Type</th>
                    {REVENUE_REGIONS.map(r => <th key={r} className="text-center py-2 text-white/40 font-medium px-2">{r}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {turnoverYears.map(year => (['Annual Revenue','EBITA'] as const).map(type => (
                    <tr key={`${year}-${type}`} className="border-b border-white/[0.04]">
                      <td className="py-2 text-white/60 font-medium">{type === 'Annual Revenue' ? year : ''}</td>
                      <td className="py-2 text-white/40">{type}</td>
                      {REVENUE_REGIONS.map(region => (
                        <td key={region} className="py-1 px-1">
                          <input type="text" value={revenue[`${year}-${type}`]?.[region] || ''}
                            onChange={e => setRevenue(prev => ({ ...prev, [`${year}-${type}`]: { ...prev[`${year}-${type}`], [region]: e.target.value } }))}
                            className="w-20 bg-white/[0.04] border border-white/[0.08] text-foreground text-xs rounded-lg px-2 py-1.5 text-center focus:border-[#0763d8] outline-none" />
                        </td>
                      ))}
                    </tr>
                  )))}
                </tbody>
              </table>
            </div>
            <p className="text-xs font-bold text-white/60 uppercase tracking-widest mb-4">Main Clients</p>
            <div className="space-y-3">
              {clients.map((client, idx) => (
                <div key={idx} className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-8 gap-2">
                  <Input value={client.name} onChange={e => { const c = [...clients]; c[idx].name = e.target.value; setClients(c) }} placeholder="Client name" className={inputCls + ' h-9 text-xs sm:col-span-2'} />
                  <Input value={client.industry} onChange={e => { const c = [...clients]; c[idx].industry = e.target.value; setClients(c) }} placeholder="Industry" className={inputCls + ' h-9 text-xs'} />
                  <Input value={client.activities} onChange={e => { const c = [...clients]; c[idx].activities = e.target.value; setClients(c) }} placeholder="Activities" className={inputCls + ' h-9 text-xs'} />
                  <Input value={client.year} onChange={e => { const c = [...clients]; c[idx].year = e.target.value; setClients(c) }} placeholder="Year" className={inputCls + ' h-9 text-xs'} />
                  <Input value={client.turnover} onChange={e => { const c = [...clients]; c[idx].turnover = e.target.value; setClients(c) }} placeholder="Turnover in EUR" className={inputCls + ' h-9 text-xs'} />
                  <Input value={client.incidence} onChange={e => { const c = [...clients]; c[idx].incidence = e.target.value; setClients(c) }} placeholder="% incidence" className={inputCls + ' h-9 text-xs'} />
                  <label className="flex items-center gap-2 h-9 px-3 rounded-xl border border-white/[0.12] bg-white/[0.06] text-white text-xs cursor-pointer">
                    <input type="checkbox" checked={client.exclusivity} onChange={e => { const c = [...clients]; c[idx].exclusivity = e.target.checked; setClients(c) }} className="accent-[#0763d8]" />
                    Exclusivity
                  </label>
                </div>
              ))}
              <button onClick={() => setClients(prev => [...prev, { name: '', industry: '', activities: '', year: '', turnover: '', incidence: '', exclusivity: false }])}
                className="text-xs text-[#0763d8] hover:text-[#0655b3]">+ Add client</button>
            </div>
            <div className="border-t border-white/[0.06] pt-6 mt-8">
              <p className="text-xs text-white/40 italic mb-4">Note: Complete below only upon receipt of RFI during a pitch process.</p>
              <FormField label="Is your company currently working or has previously worked with the CLIENT?">
                <select value={workedWithClient} onChange={e => setWorkedWithClient(e.target.value)} className={selectCls}>
                  <option value="">Select</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </FormField>
              {workedWithClient === 'Yes' && (
                <div className="mt-6 space-y-4">
                  <p className="text-xs font-bold text-white/60 uppercase tracking-widest">Client Engagement Details</p>
                  {clientPitch.map((pitch, idx) => (
                    <div key={idx} className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                      <Input value={pitch.division} onChange={e => { const p = [...clientPitch]; p[idx].division = e.target.value; setClientPitch(p) }} placeholder="Client Division" className={inputCls + ' h-9 text-xs'} />
                      <Input value={pitch.activities} onChange={e => { const p = [...clientPitch]; p[idx].activities = e.target.value; setClientPitch(p) }} placeholder="Principal Activities" className={inputCls + ' h-9 text-xs'} />
                      <Input value={pitch.year} onChange={e => { const p = [...clientPitch]; p[idx].year = e.target.value; setClientPitch(p) }} placeholder="Year" className={inputCls + ' h-9 text-xs'} />
                      <Input value={pitch.turnover} onChange={e => { const p = [...clientPitch]; p[idx].turnover = e.target.value; setClientPitch(p) }} placeholder="Turnover (EUR)" className={inputCls + ' h-9 text-xs'} />
                      <Input value={pitch.incidence} onChange={e => { const p = [...clientPitch]; p[idx].incidence = e.target.value; setClientPitch(p) }} placeholder="% incidence" className={inputCls + ' h-9 text-xs'} />
                    </div>
                  ))}
                  <button onClick={() => setClientPitch(prev => [...prev, { division: '', activities: '', year: '', turnover: '', incidence: '' }])} className="text-xs text-[#0763d8]">+ Add row</button>
                  <FormField label="Duration of Engagement">
                    <Input value={clientDuration} onChange={e => setClientDuration(e.target.value)} placeholder="e.g. 3 years" className={inputCls} />
                  </FormField>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── STEP 4 — Knowledge & Competencies ── */}
        {step === 4 && (
          <div>
            <StepHeader icon={stepLabels[3]?.icon ?? '🎯'} title={stepLabels[3]?.label ?? 'Knowledge & Competencies'} subtitle={stepLabels[3]?.subtitle ?? 'Communication areas, capabilities, and service expertise'} />
            <p className="text-xs font-bold text-white/60 uppercase tracking-widest mb-3">Communication Areas</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 mb-8">
              {COMMUNICATION_AREAS.map(area => (
                <div key={area} className={`flex items-center gap-2 p-2.5 rounded-xl border transition-all text-xs ${sectorPercentages[area] ? 'bg-[#0763d8]/10 border-[#0763d8]/30 text-[#0763d8]' : 'bg-white/[0.03] border-white/[0.06] text-white/50'}`}>
                  <span className="flex-1 truncate" title={area}>{area}</span>
                  <div className="flex items-center gap-1 shrink-0">
                    <input type="number" min={0} max={100} value={sectorPercentages[area] || ''} onChange={e => setSectorPercentages(prev => ({ ...prev, [area]: e.target.value }))} className="w-14 text-xs text-center bg-white/[0.04] border border-white/[0.08] text-foreground rounded-lg py-1 focus:border-[#0763d8] outline-none" placeholder="0" />
                    <span className="text-xs text-white/30">%</span>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs font-bold text-white/60 uppercase tracking-widest mb-3">Capabilities</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
              {(['Main','Secondary','Additional'] as const).map((level, i) => (
                <FormField key={level} label={`${level} Capability`}>
                  <select value={[mainCapability, secondaryCapability, additionalCapability][i]}
                    onChange={e => [setMainCapability, setSecondaryCapability, setAdditionalCapability][i](e.target.value)} className={selectCls}>
                    <option value="">Select</option>
                    {CAPABILITY_AREAS.map(a => <option key={a}>{a}</option>)}
                  </select>
                </FormField>
              ))}
            </div>
            <div className="space-y-6">
              {AGENCY_SERVICE_GROUPS.map(group => (
                <div key={group.label}>
                  <p className="text-xs font-bold text-[#0763d8]/60 uppercase tracking-widest mb-2 flex items-center gap-2">
                    <span className="flex-1 h-px bg-white/[0.06]" />{group.label}<span className="flex-1 h-px bg-white/[0.06]" />
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                    {group.items.map(skill => (
                      <div key={skill} className={`flex items-center gap-2 p-2.5 rounded-xl border transition-all text-xs ${competencies[skill] ? 'bg-[#0763d8]/10 border-[#0763d8]/30 text-[#0763d8]' : 'bg-white/[0.03] border-white/[0.06] text-white/50'}`}>
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
            <div className="border-t border-white/[0.08] pt-6 mt-10 space-y-4">
              <p className="text-xs font-bold text-white/60 uppercase tracking-widest">Activities</p>
              <label className="flex items-center gap-3 text-sm text-white/70">
                <input type="checkbox" checked={outsources} onChange={e => setOutsources(e.target.checked)} className="w-4 h-4 accent-[#0763d8]" />
                Please indicate if your company subcontracts activities or some phase of services
              </label>
              {outsources && (
                <div className="space-y-3">
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs border-collapse min-w-[540px]">
                      <thead>
                        <tr className="bg-white/[0.04] text-white/80">
                          <th className="px-3 py-2 text-left font-medium">Activities outsourced</th>
                          <th className="px-3 py-2 text-left font-medium">Detailed description</th>
                          <th className="px-3 py-2 text-left font-medium">% Contractual value</th>
                        </tr>
                      </thead>
                      <tbody>
                        {outsourcedActivities.map((row, idx) => (
                          <tr key={idx} className="border-b border-white/[0.06] last:border-0">
                            <td className="px-3 py-2 align-top">
                              <Input value={row.activity} onChange={e => setOutsourcedActivities(prev => { const n = [...prev]; n[idx] = { ...n[idx], activity: e.target.value }; return n })} placeholder="e.g. Media buying…" className={inputCls + ' h-8 text-xs'} />
                            </td>
                            <td className="px-3 py-2 align-top">
                              <Input value={row.description} onChange={e => setOutsourcedActivities(prev => { const n = [...prev]; n[idx] = { ...n[idx], description: e.target.value }; return n })} placeholder="Scope of outsourced activity" className={inputCls + ' h-8 text-xs'} />
                            </td>
                            <td className="px-3 py-2 align-top w-32">
                              <div className="flex items-center gap-1">
                                <input type="number" min={0} max={100} value={row.contractualValue} onChange={e => setOutsourcedActivities(prev => { const n = [...prev]; n[idx] = { ...n[idx], contractualValue: e.target.value }; return n })} className="w-16 bg-white/[0.04] border border-white/[0.08] text-white text-xs rounded-lg px-2 py-1 text-right focus:border-[#0763d8] outline-none" placeholder="0" />
                                <span className="text-white/40 text-xs">%</span>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <button type="button" onClick={() => setOutsourcedActivities(prev => [...prev, { activity: '', description: '', contractualValue: '' }])} className="text-xs text-[#0763d8] hover:text-[#0655b3]">+ Add activity</button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── STEP 5 — Governance & SOW ── */}
        {step === 5 && (
          <div>
            <StepHeader icon={stepLabels[4]?.icon ?? '📋'} title={stepLabels[4]?.label ?? 'Governance & SOW'} subtitle={stepLabels[4]?.subtitle ?? 'Governance questions and statements of work'} />
            <div className="space-y-5">
              <div className="border-t border-white/[0.06] pt-5">
                <p className="text-xs font-bold text-white/60 uppercase tracking-widest mb-4">Governance</p>
                <FormField label={GOVERNANCE_QUESTIONS[0]}>
                  <textarea value={governanceQA} onChange={e => setGovernanceQA(e.target.value)} rows={2} className={textareaCls} />
                </FormField>
                <FormField label={GOVERNANCE_QUESTIONS[1]} className="mt-4">
                  <textarea value={governanceData} onChange={e => setGovernanceData(e.target.value)} rows={2} className={textareaCls} />
                </FormField>
                <FormField label={GOVERNANCE_QUESTIONS[2]} className="mt-4">
                  <textarea value={governanceGlobal} onChange={e => setGovernanceGlobal(e.target.value)} rows={2} className={textareaCls} />
                </FormField>
                <FormField label={GOVERNANCE_QUESTIONS[3]} className="mt-4">
                  <textarea value={governanceAdditional} onChange={e => setGovernanceAdditional(e.target.value)} rows={2} className={textareaCls} />
                </FormField>
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 6 — People & Talent ── */}
        {step === 6 && (
          <div>
            <StepHeader icon={stepLabels[5]?.icon ?? '👥'} title={stepLabels[5]?.label ?? 'People & Talent'} subtitle={stepLabels[5]?.subtitle ?? 'Staff headcount by department and primary talent'} />
            <p className="text-xs text-white/30 italic mb-4">Note: Complete Annual Salary column only upon receipt of RFI during a pitch process.</p>
            <div className="space-y-6">
              {AGENCY_PEOPLE_DEPARTMENTS.map(dept => (
                <div key={dept.label}>
                  <p className="text-xs font-bold text-[#0763d8]/60 uppercase tracking-widest mb-2">{dept.label}</p>
                  {dept.label === 'Other' ? (
                    <div className="grid grid-cols-1 gap-1.5">
                      {otherRoles.map(role => (
                        <div key={role.id} className="flex items-center gap-2 bg-white/[0.03] rounded-xl px-3 py-2">
                          <input value={role.name} onChange={e => setOtherRoles(prev => prev.map(r => r.id === role.id ? { ...r, name: e.target.value } : r))}
                            className="text-xs text-white bg-transparent border-b border-white/[0.12] focus:border-[#0763d8] focus:outline-none flex-1 truncate py-1" placeholder="Role Name" />
                          <input type="number" min={0} value={peopleCounts[role.id]?.employees || ''} onChange={e => setPeopleCounts(prev => ({ ...prev, [role.id]: { ...prev[role.id], employees: e.target.value, freelancers: prev[role.id]?.freelancers || '', salary: prev[role.id]?.salary || '' } }))} placeholder="# Emp" className="w-16 text-xs text-center bg-white/[0.04] border border-white/[0.08] text-white rounded-lg py-1" />
                          <input type="number" min={0} value={peopleCounts[role.id]?.freelancers || ''} onChange={e => setPeopleCounts(prev => ({ ...prev, [role.id]: { ...prev[role.id], freelancers: e.target.value, employees: prev[role.id]?.employees || '', salary: prev[role.id]?.salary || '' } }))} placeholder="# Free" className="w-16 text-xs text-center bg-white/[0.04] border border-white/[0.08] text-white rounded-lg py-1" />
                          <input type="number" min={0} value={peopleCounts[role.id]?.salary || ''} onChange={e => setPeopleCounts(prev => ({ ...prev, [role.id]: { ...prev[role.id], salary: e.target.value, employees: prev[role.id]?.employees || '', freelancers: prev[role.id]?.freelancers || '' } }))} placeholder="Salary" className="w-16 text-xs text-center bg-white/[0.04] border border-white/[0.08] text-white rounded-lg py-1" />
                          {otherRoles.length > 1 && (
                            <button type="button" onClick={() => { setOtherRoles(prev => prev.filter(r => r.id !== role.id)); setPeopleCounts(prev => { const n = { ...prev }; delete n[role.id]; return n }) }} className="p-1 text-white/30 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      ))}
                      <button type="button" onClick={() => setOtherRoles(prev => [...prev, { id: `other-${Date.now()}`, name: '' }])} className="mt-2 flex items-center gap-2 px-4 py-1.5 border border-[#0763d8]/20 text-[#0763d8] text-xs font-medium rounded-full hover:bg-[#0763d8]/10 transition-colors w-max">
                        <Plus className="w-3 h-3" /> Add Role
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-1.5">
                      {dept.roles.map(role => (
                        <div key={role} className="flex items-center gap-2 bg-white/[0.03] rounded-xl px-3 py-2">
                          <span className="text-xs text-white/50 flex-1 truncate">{role}</span>
                          <input type="number" min={0} value={peopleCounts[role]?.employees || ''} onChange={e => setPeopleCounts(prev => ({ ...prev, [role]: { ...prev[role], employees: e.target.value, freelancers: prev[role]?.freelancers || '', salary: prev[role]?.salary || '' } }))} placeholder="# Emp" className="w-16 text-xs text-center bg-white/[0.04] border border-white/[0.08] text-white rounded-lg py-1" />
                          <input type="number" min={0} value={peopleCounts[role]?.freelancers || ''} onChange={e => setPeopleCounts(prev => ({ ...prev, [role]: { ...prev[role], freelancers: e.target.value, employees: prev[role]?.employees || '', salary: prev[role]?.salary || '' } }))} placeholder="# Free" className="w-16 text-xs text-center bg-white/[0.04] border border-white/[0.08] text-white rounded-lg py-1" />
                          <input type="number" min={0} value={peopleCounts[role]?.salary || ''} onChange={e => setPeopleCounts(prev => ({ ...prev, [role]: { ...prev[role], salary: e.target.value, employees: prev[role]?.employees || '', freelancers: prev[role]?.freelancers || '' } }))} placeholder="Salary" className="w-16 text-xs text-center bg-white/[0.04] border border-white/[0.08] text-white rounded-lg py-1" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="border-t border-white/[0.06] pt-5 mt-6">
              <p className="text-xs font-bold text-white/60 uppercase tracking-widest mb-4">Primary Talent</p>
              <div className="space-y-3 mb-4">
                {talentEntries.map((t, i) => (
                  <div key={i} className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] gap-3 items-center">
                    <select value={t.role} onChange={e => { const n = [...talentEntries]; n[i].role = e.target.value; setTalentEntries(n) }} className={selectCls + ' h-9 text-xs'}>
                      <option value="">Select Role</option>
                      {AGENCY_PEOPLE_DEPARTMENTS.flatMap(d => d.roles).map(role => <option key={role} value={role}>{role}</option>)}
                    </select>
                    <Input value={t.name} onChange={e => { const n = [...talentEntries]; n[i].name = e.target.value; setTalentEntries(n) }} placeholder="Name" className={inputCls + ' h-9 text-xs'} />
                    <div className="flex items-center gap-2">
                      <Input value={t.linkedin} onChange={e => { const n = [...talentEntries]; n[i].linkedin = e.target.value; setTalentEntries(n) }} placeholder="LinkedIn" className={inputCls + ' h-9 text-xs flex-1 sm:w-48'} />
                      <button onClick={() => setTalentEntries(prev => prev.filter((_, idx) => idx !== i))} className="text-red-400 hover:text-red-300 p-1.5 bg-white/[0.03] rounded-lg border border-white/[0.06]">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <button onClick={() => setTalentEntries(prev => [...prev, { role: '', name: '', linkedin: '' }])} className="text-xs text-[#0763d8] hover:bg-[#0763d8]/10 px-3 py-1.5 rounded-lg border border-[#0763d8]/30 transition-colors inline-block">+ Add Talent</button>
            </div>
          </div>
        )}

        {/* ── STEP 7 — Awards & Infos ── */}
        {step === 7 && (
          <div>
            <StepHeader icon={stepLabels[6]?.icon ?? '🏆'} title={stepLabels[6]?.label ?? 'Awards & Infos'} subtitle={stepLabels[6]?.subtitle ?? 'Awards, AI usage, and social responsibility'} />
            <div className="space-y-4 mb-4">
              {awards.map((award, i) => (
                <div key={i} className="grid grid-cols-1 sm:grid-cols-[1.5fr_1fr_1fr_80px_1fr_1fr_auto] gap-2 items-center bg-white/[0.02] p-3 rounded-xl border border-white/[0.04]">
                  <Input value={award.name} onChange={e => { const a = [...awards]; a[i].name = e.target.value; setAwards(a) }} placeholder="Award Name" className={inputCls + ' h-9 text-xs'} />
                  <Input value={award.distinction} onChange={e => { const a = [...awards]; a[i].distinction = e.target.value; setAwards(a) }} placeholder="Distinction" className={inputCls + ' h-9 text-xs'} />
                  <Input value={award.category} onChange={e => { const a = [...awards]; a[i].category = e.target.value; setAwards(a) }} placeholder="Category" className={inputCls + ' h-9 text-xs'} />
                  <Input value={award.year} onChange={e => { const a = [...awards]; a[i].year = e.target.value; setAwards(a) }} placeholder="Year" className={inputCls + ' h-9 text-xs'} />
                  <Input value={award.ad} onChange={e => { const a = [...awards]; a[i].ad = e.target.value; setAwards(a) }} placeholder="Ad" className={inputCls + ' h-9 text-xs'} />
                  <div className="flex items-center gap-2 max-sm:col-span-full">
                    <Input value={award.brand} onChange={e => { const a = [...awards]; a[i].brand = e.target.value; setAwards(a) }} placeholder="Brand" className={inputCls + ' h-9 text-xs flex-1'} />
                    <button onClick={() => setAwards(prev => prev.filter((_, idx) => idx !== i))} className="text-red-400 hover:text-red-300 p-2 bg-white/[0.03] rounded-lg border border-white/[0.06] shrink-0">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => setAwards(prev => [...prev, { name: '', distinction: '', category: '', year: '', ad: '', brand: '' }])} className="text-xs text-[#0763d8] hover:bg-[#0763d8]/10 px-3 py-1.5 rounded-lg border border-[#0763d8]/30 transition-colors inline-block">+ Add Award</button>
            <div className="border-t border-white/[0.08] my-8" />
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-white/80 mb-4 flex items-center gap-2">
                <span className="w-1 h-4 bg-[#0763d8] rounded-full" />AI Usage
              </h3>
              {AI_QUESTIONS.map((q, i) => (
                <FormField key={i} label={q}>
                  <textarea value={aiAnswers[`ai-${i}`] || ''} onChange={e => setAiAnswers(prev => ({ ...prev, [`ai-${i}`]: e.target.value }))} rows={2} className={textareaCls} />
                </FormField>
              ))}
            </div>
          </div>
        )}

        {/* ── STEP 8 — Add-On ── */}
        {step === 8 && (
          <div>
            <StepHeader icon={stepLabels[7]?.icon ?? '📎'} title={stepLabels[7]?.label ?? 'Add-On'} subtitle={stepLabels[7]?.subtitle ?? 'Investments, strategic development, social responsibility, and attachments'} />
            <h3 className="text-sm font-semibold text-white/80 mb-4 flex items-center gap-2">
              <span className="w-1 h-4 bg-[#0763d8] rounded-full" />% of Turnover Invested
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
              {INVESTMENT_CATEGORIES.map(cat => (
                <div key={cat} className="flex items-center gap-3 bg-white/[0.03] rounded-xl px-4 py-2.5">
                  <span className="text-xs text-white/50 flex-1">{cat}</span>
                  <div className="flex items-center gap-1">
                    <input type="number" min={0} max={100} value={investments[cat] || ''} onChange={e => setInvestments(prev => ({ ...prev, [cat]: e.target.value }))} className="w-14 text-xs text-center bg-white/[0.04] border border-white/[0.08] text-white rounded-lg py-1" placeholder="0" />
                    <span className="text-xs text-white/30">%</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-white/[0.08] my-8" />
            <h3 className="text-sm font-semibold text-white/80 mb-4 flex items-center gap-2">
              <span className="w-1 h-4 bg-[#0763d8] rounded-full" />Strategic Development
            </h3>
            <div className="space-y-5 mb-8">
              {schema.isVisible('strategicDevelopment') && (
                <FormField label={schema.getLabel('strategicDevelopment', '1.1 Could you please present your strategic development')} required={schema.isRequired('strategicDevelopment', false)}>
                  <textarea value={strategicDev} onChange={e => setStrategicDev(e.target.value)} rows={3} placeholder={schema.getPlaceholder('strategicDevelopment', '')} className={textareaCls} />
                </FormField>
              )}
              <FormField label="1.2 Do you have any activity out of your Country / City?">
                <textarea value={activityOutside} onChange={e => setActivityOutside(e.target.value)} rows={2} className={textareaCls} />
              </FormField>
            </div>
            <div className="border-t border-white/[0.08] my-8" />
            <h3 className="text-sm font-semibold text-white/80 mb-4 flex items-center gap-2">
              <span className="w-1 h-4 bg-[#0763d8] rounded-full" />Social Responsibility
            </h3>
            <div className="space-y-3 mb-8">
              {SOCIAL_RESPONSIBILITY_QUESTIONS.map((q) => (
                <div key={q.id}>
                  <div className="flex items-start gap-3 bg-white/[0.03] rounded-xl p-3">
                    <span className="text-xs text-white/40 font-mono w-8 flex-shrink-0">{q.id}</span>
                    <span className="text-xs text-white/50 flex-1">{q.text}</span>
                    <select value={srAnswers[`sr-${q.id}`] || ''} onChange={e => setSrAnswers(prev => ({ ...prev, [`sr-${q.id}`]: e.target.value }))} className="bg-white/[0.04] border border-white/[0.08] text-white text-xs rounded-lg px-2 py-1">
                      <option value="">—</option><option value="yes">Yes</option><option value="no">No</option>
                    </select>
                  </div>
                  {q.id === '1.6' && (
                    <div className="ml-11 mt-2 grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {CSR_IMPACT_AREAS.map(area => (
                        <label key={area} className="flex items-center gap-2 bg-white/[0.02] rounded-lg p-2 cursor-pointer hover:bg-white/[0.04] transition">
                          <input type="checkbox" checked={!!srAnswers[`impact-${area}`]} onChange={e => setSrAnswers(prev => ({ ...prev, [`impact-${area}`]: e.target.checked ? 'yes' : '' }))} className="w-3.5 h-3.5 rounded border-white/20 bg-white/[0.06] accent-[#0763d8]" />
                          <span className="text-xs text-white/60">{area}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="border-t border-white/[0.08] my-8" />
            <h3 className="text-sm font-semibold text-white/80 mb-4 flex items-center gap-2">
              <span className="w-1 h-4 bg-[#0763d8] rounded-full" />Attachments Requested
            </h3>
            <div className="space-y-3 mb-6">
              {ATTACHMENTS_REQUESTED.map(att => (
                <div key={att.id} className="flex items-center gap-4 bg-white/[0.03] rounded-xl px-4 py-3">
                  <span className="text-xs font-mono text-white/40 w-8 flex-shrink-0">{att.id}</span>
                  <span className="text-sm text-white/60 flex-1">{att.label}</span>
                  <label className="flex items-center gap-2 px-3 py-1.5 bg-white/[0.04] border border-white/[0.08] rounded-lg cursor-pointer hover:bg-white/[0.08] transition">
                    <span className="text-xs text-white/40">Upload</span>
                    <input type="file" accept=".pdf" className="hidden" />
                  </label>
                </div>
              ))}
            </div>
            <div className="bg-white/[0.03] rounded-xl p-5 border border-white/[0.06]">
              <p className="text-sm text-white/60 font-medium mb-2">Please provide a presentation (.pdf) summarizing key figures, capabilities, and clients.</p>
              <div className="border-2 border-dashed border-white/[0.08] rounded-xl p-6 text-center mt-4 cursor-pointer hover:bg-white/[0.04] transition relative">
                <input type="file" accept=".pdf" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                <p className="text-sm text-white/30">Drag & drop presentation here or click to browse</p>
                <p className="text-xs text-white/20 mt-1">PDF — max 10MB</p>
              </div>
            </div>
          </div>
        )}

        {/* ── Admin-added custom fields for the current step ── */}
        {(() => {
          const stepKeyForCurrent = stepLabels[step - 1]?.key
          if (!stepKeyForCurrent) return null
          const customFields = schema.customFieldsForStep(stepKeyForCurrent)
          if (customFields.length === 0) return null
          return (
            <CustomFieldsSection
              fields={customFields}
              values={customFieldsData}
              onChange={(id, val) => setCustomFieldsData(prev => ({ ...prev, [id]: val }))}
            />
          )
        })()}

      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-6">
        <div>
          {step > 1 ? (
            <Button variant="outline" onClick={() => setStep(s => s - 1)} className="border-border text-foreground hover:bg-muted rounded-full">
              <ChevronLeft className="w-4 h-4 mr-1" /> Back
            </Button>
          ) : <div />}
        </div>
        <div className="flex items-center gap-3">
          {step < stepLabels.length ? (
            <>
              <Button variant="ghost" className="text-white/30 hover:text-white" onClick={() => setStep(s => s + 1)}>Skip for now</Button>
              <Button onClick={() => setStep(s => s + 1)} disabled={!canProceed()} className="bg-[#0763d8] hover:bg-[#0655b3] text-white px-6 rounded-full">
                Continue <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </>
          ) : step === stepLabels.length ? (
            <Button onClick={handleSubmit} disabled={isSubmitting} className="bg-[#0763d8] hover:bg-[#0655b3] text-white px-8 rounded-full">
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" /><path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="4" className="opacity-75" /></svg>
                  {isEditMode ? 'Updating...' : 'Submitting...'}
                </span>
              ) : (
                <><Building2 className="w-4 h-4 mr-2" /> {isEditMode ? 'Update Agency' : mode === 'admin' ? 'Create Agency' : 'Submit Registration'}</>
              )}
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  )
}
