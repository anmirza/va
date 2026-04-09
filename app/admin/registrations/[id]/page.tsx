'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'
import {
  getRegistrationById, approveRegistration, rejectRegistration, PendingRegistration,
} from '@/lib/admin-store'
import { REGISTRATION_STEPS } from '@/lib/rfi-data'
import { Button } from '@/components/ui/button'
import {
  ArrowLeft, Check, X, Clock, CheckCircle2, XCircle,
  Building2, Film, ChevronLeft, ChevronRight, User, Mail, Phone, Globe,
  MapPin, Calendar, Briefcase, BarChart2, Shield, Users, Star, Zap,
  AlertTriangle, FileText,
} from 'lucide-react'

// ── Helpers ───────────────────────────────────────────────────────────────────

function val(v: unknown): string {
  if (v === null || v === undefined || v === '') return '—'
  if (typeof v === 'boolean') return v ? 'Yes' : 'No'
  return String(v)
}

function DataRow({ label, value }: { label: string; value: unknown }) {
  const display = val(value)
  return (
    <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4 py-3 border-b border-white/[0.05] last:border-0">
      <span className="text-xs text-white/40 sm:w-44 shrink-0 uppercase tracking-wider mt-0.5">{label}</span>
      <span className={`text-sm flex-1 ${display === '—' ? 'text-white/20 italic' : 'text-white/85'}`}>{display}</span>
    </div>
  )
}

function SectionCard({ title, icon: Icon, children }: { title: string; icon: React.ElementType; children: React.ReactNode }) {
  return (
    <div className="glass-card rounded-2xl overflow-hidden mb-5">
      <div className="flex items-center gap-3 px-5 py-3.5 border-b border-white/[0.06] bg-white/[0.02]">
        <div className="w-7 h-7 rounded-lg bg-[#0763d8]/10 border border-[#0763d8]/20 flex items-center justify-center">
          <Icon className="w-3.5 h-3.5 text-[#0763d8]" />
        </div>
        <h3 className="text-sm font-semibold text-white/80">{title}</h3>
      </div>
      <div className="px-5 py-2">{children}</div>
    </div>
  )
}

function StatusBadge({ status }: { status: PendingRegistration['status'] }) {
  const map = {
    pending: { cls: 'bg-amber-500/10 border-amber-500/20 text-amber-400', icon: Clock, label: 'Under Review' },
    approved: { cls: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400', icon: CheckCircle2, label: 'Approved' },
    rejected: { cls: 'bg-red-500/10 border-red-500/20 text-red-400', icon: XCircle, label: 'Rejected' },
  }
  const { cls, icon: Icon, label } = map[status]
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border ${cls}`}>
      <Icon className="w-3.5 h-3.5" />{label}
    </span>
  )
}

// ── Step 1: General Info ──────────────────────────────────────────────────────
function RenderStep1({ p }: { p: Record<string, unknown> }) {
  return (
    <>
      <SectionCard title="Legal Identity" icon={FileText}>
        <DataRow label="Registered Business Name" value={p.businessName} />
        <DataRow label="D-U-N-S® Number" value={p.dunsNumber} />
        <DataRow label="VAT Registration Number" value={p.vatNumber} />
        <DataRow label="Legal Form" value={p.legalForm} />
        <DataRow label="Company Registration Number" value={p.companyRegNumber} />
        <DataRow label="Year Established" value={p.yearEstablished} />
      </SectionCard>
      <SectionCard title="Organisation & Structure" icon={Briefcase}>
        <DataRow label="Number of Employees" value={p.employees} />
        <DataRow label="Company Level" value={p.companyLevel} />
        <DataRow label="Parent Company" value={p.parentCompany} />
        <DataRow label="Category" value={p.category} />
        <DataRow label="Currency" value={p.currency} />
        <DataRow label="Trade Organizations" value={p.tradeOrganizations} />
        <DataRow label="Country Coverage" value={p.countryCoverage} />
      </SectionCard>
      <SectionCard title="Registered Office Address" icon={MapPin}>
        <DataRow label="Address" value={p.address} />
        <DataRow label="Postcode" value={p.postcode} />
        <DataRow label="City" value={p.city} />
        <DataRow label="Country" value={p.country} />
      </SectionCard>
    </>
  )
}

// ── Step 2: Contacts ──────────────────────────────────────────────────────────
function RenderStep2({ p }: { p: Record<string, unknown> }) {
  const contacts = (p.contacts as Record<string, string>[]) ?? []
  const socialMedia = (p.socialMedia as Record<string, string>) ?? {}

  return (
    <>
      <SectionCard title="Key Contacts" icon={User}>
        {contacts.length === 0 ? (
          <p className="py-3 text-sm text-white/30 italic">No contacts provided</p>
        ) : contacts.map((c, i) => (
          <div key={i} className="py-3 border-b border-white/[0.05] last:border-0">
            <p className="text-xs font-bold text-[#0763d8] uppercase tracking-wider mb-2">{c.role || `Contact ${i + 1}`}</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { l: 'First Name', v: c.firstName },
                { l: 'Last Name', v: c.lastName },
                { l: 'Email', v: c.email },
                { l: 'LinkedIn', v: c.linkedin },
                { l: 'Telephone', v: c.telephone },
                { l: 'Mobile', v: c.mobile },
              ].map(f => (
                <div key={f.l}>
                  <p className="text-[10px] text-white/30 uppercase tracking-wider mb-0.5">{f.l}</p>
                  <p className={`text-sm ${!f.v ? 'text-white/20 italic' : 'text-white/80'}`}>{f.v || '—'}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </SectionCard>
      <SectionCard title="Social Media & Online Presence" icon={Globe}>
        {Object.entries(socialMedia).filter(([, v]) => v).length === 0
          ? <p className="py-3 text-sm text-white/30 italic">No social media links provided</p>
          : Object.entries(socialMedia).filter(([, v]) => v).map(([k, v]) => (
              <DataRow key={k} label={k} value={v} />
            ))
        }
      </SectionCard>
    </>
  )
}

// ── Step 3: Turnover & Clients ────────────────────────────────────────────────
function RenderStep3({ p }: { p: Record<string, unknown> }) {
  const clients = (p.clients as Record<string, unknown>[]) ?? []
  const revenue = (p.revenue as Record<string, Record<string, string>>) ?? {}

  return (
    <>
      <SectionCard title="Revenue / Turnover" icon={BarChart2}>
        {Object.keys(revenue).length === 0
          ? <p className="py-3 text-sm text-white/30 italic">No turnover data provided</p>
          : Object.entries(revenue).map(([year, regions]) => (
              <div key={year} className="py-2 border-b border-white/[0.05] last:border-0">
                <p className="text-xs text-white/40 mb-1 uppercase tracking-wider">{year}</p>
                <div className="flex flex-wrap gap-3">
                  {Object.entries(regions).filter(([, v]) => v).map(([region, amount]) => (
                    <span key={region} className="text-sm text-white/70">
                      <span className="text-white/40 text-xs mr-1">{region}:</span>{amount}
                    </span>
                  ))}
                </div>
              </div>
            ))
        }
        <DataRow label="Current Client Duration" value={p.clientDuration} />
        <DataRow label="Worked With Target Client Before" value={p.workedWithClient} />
      </SectionCard>
      <SectionCard title="Clients" icon={Users}>
        {clients.length === 0
          ? <p className="py-3 text-sm text-white/30 italic">No client data provided</p>
          : clients.map((c, i) => (
              <div key={i} className="py-3 border-b border-white/[0.05] last:border-0">
                <p className="font-medium text-white/80 text-sm mb-1">{val(c.name)}</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                  <span><span className="text-white/30">Industry: </span>{val(c.industry)}</span>
                  <span><span className="text-white/30">Year: </span>{val(c.year)}</span>
                  <span><span className="text-white/30">Turnover: </span>{val(c.turnover)}</span>
                  <span><span className="text-white/30">Incidence: </span>{val(c.incidence)}%</span>
                  <span><span className="text-white/30">Exclusivity: </span>{c.exclusivity ? 'Yes' : 'No'}</span>
                </div>
              </div>
            ))
        }
      </SectionCard>
    </>
  )
}

// ── Step 4: Knowledge & Competencies ─────────────────────────────────────────
function RenderStep4({ p }: { p: Record<string, unknown> }) {
  const competencies = (p.competencies as Record<string, string>) ?? {}
  const sectorPercentages = (p.sectorPercentages as Record<string, string>) ?? {}
  const outsourcedActivities = (p.outsourcedActivities as Record<string, string>[]) ?? []

  const activeServices = Object.entries(competencies).filter(([, v]) => v === 'yes' || v === 'Yes').map(([k]) => k)
  const activeSectors = Object.entries(sectorPercentages).filter(([, v]) => v && v !== '0')

  return (
    <>
      <SectionCard title="Capabilities" icon={Zap}>
        <DataRow label="Main Capability" value={p.mainCapability} />
        <DataRow label="Secondary Capability" value={p.secondaryCapability} />
        <DataRow label="Additional Capability" value={p.additionalCapability} />
        <DataRow label="Market Positioning" value={p.marketPositioning} />
      </SectionCard>
      <SectionCard title="Services Offered" icon={Shield}>
        {activeServices.length === 0
          ? <p className="py-3 text-sm text-white/30 italic">No services selected</p>
          : (
            <div className="py-2 flex flex-wrap gap-2">
              {activeServices.map(s => (
                <span key={s} className="px-2.5 py-1 rounded-lg bg-[#0763d8]/10 border border-[#0763d8]/20 text-xs text-[#0763d8]">{s}</span>
              ))}
            </div>
          )
        }
      </SectionCard>
      {activeSectors.length > 0 && (
        <SectionCard title="Sector Breakdown" icon={BarChart2}>
          <div className="grid grid-cols-2 gap-2 py-2">
            {activeSectors.map(([sector, pct]) => (
              <div key={sector} className="flex items-center justify-between py-1.5 border-b border-white/[0.04] last:border-0">
                <span className="text-sm text-white/70 truncate mr-2">{sector}</span>
                <span className="text-sm font-semibold text-[#0763d8] shrink-0">{pct}%</span>
              </div>
            ))}
          </div>
        </SectionCard>
      )}
      {outsourcedActivities.length > 0 && outsourcedActivities[0]?.activity && (
        <SectionCard title="Outsourced Activities" icon={Users}>
          {outsourcedActivities.map((o, i) => (
            <div key={i} className="py-2 border-b border-white/[0.05] last:border-0">
              <DataRow label="Activity" value={o.activity} />
              <DataRow label="Description" value={o.description} />
              <DataRow label="Contractual Value" value={o.contractualValue} />
            </div>
          ))}
        </SectionCard>
      )}
    </>
  )
}

// ── Step 5: Governance & SOW ──────────────────────────────────────────────────
function RenderStep5({ p }: { p: Record<string, unknown> }) {
  return (
    <>
      <SectionCard title="About the Agency" icon={FileText}>
        <div className="py-3 space-y-4">
          {[
            { label: 'About', value: p.about },
            { label: 'Philosophy', value: p.philosophy },
            { label: 'Network Description', value: p.networkDescription },
            { label: 'Local Representation', value: p.localRepresentation },
          ].map(row => (
            <div key={row.label}>
              <p className="text-xs text-white/40 uppercase tracking-wider mb-1">{row.label}</p>
              <p className={`text-sm leading-relaxed ${!row.value ? 'text-white/20 italic' : 'text-white/80'}`}>
                {val(row.value)}
              </p>
            </div>
          ))}
        </div>
      </SectionCard>
      <SectionCard title="Governance Answers" icon={Shield}>
        {[
          { label: 'QA & SLA Systems', value: p.governanceQA },
          { label: 'Data Management Protocols', value: p.governanceData },
          { label: 'Global Brand Governance', value: p.governanceGlobal },
          { label: 'Additional Information', value: p.governanceAdditional },
        ].map(row => (
          <div key={row.label} className="py-3 border-b border-white/[0.05] last:border-0">
            <p className="text-xs text-white/40 uppercase tracking-wider mb-1">{row.label}</p>
            <p className={`text-sm leading-relaxed ${!row.value ? 'text-white/20 italic' : 'text-white/80'}`}>
              {val(row.value)}
            </p>
          </div>
        ))}
        <DataRow label="Outsources Activities" value={p.outsources} />
      </SectionCard>
    </>
  )
}

// ── Step 6: People & Talent ───────────────────────────────────────────────────
function RenderStep6({ p }: { p: Record<string, unknown> }) {
  const peopleCounts = (p.peopleCounts as Record<string, { employees: string; freelancers: string; salary: string }>) ?? {}
  const talentEntries = (p.talentEntries as { role: string; name: string; linkedin: string }[]) ?? []
  const filled = Object.entries(peopleCounts).filter(([, v]) => v.employees || v.freelancers)

  return (
    <>
      <SectionCard title="Headcount by Role" icon={Users}>
        {filled.length === 0
          ? <p className="py-3 text-sm text-white/30 italic">No headcount data provided</p>
          : (
            <div className="divide-y divide-white/[0.05]">
              <div className="grid grid-cols-4 text-[10px] text-white/30 uppercase tracking-wider py-2">
                <span className="col-span-2">Role</span>
                <span>Employees</span>
                <span>Freelancers</span>
              </div>
              {filled.map(([role, counts]) => (
                <div key={role} className="grid grid-cols-4 py-2 text-sm">
                  <span className="col-span-2 text-white/70 truncate pr-4">{role}</span>
                  <span className="text-white/80">{counts.employees || '—'}</span>
                  <span className="text-white/80">{counts.freelancers || '—'}</span>
                </div>
              ))}
            </div>
          )
        }
      </SectionCard>
      {talentEntries.length > 0 && talentEntries[0]?.name && (
        <SectionCard title="Key Talent" icon={Star}>
          {talentEntries.map((t, i) => (
            <div key={i} className="py-2 border-b border-white/[0.05] last:border-0">
              <DataRow label="Role" value={t.role} />
              <DataRow label="Name" value={t.name} />
              <DataRow label="LinkedIn" value={t.linkedin} />
            </div>
          ))}
        </SectionCard>
      )}
    </>
  )
}

// ── Step 7: Awards & Infos ────────────────────────────────────────────────────
function RenderStep7({ p }: { p: Record<string, unknown> }) {
  const awards = (p.awards as { name: string; distinction: string; category: string; year: string; ad: string; brand: string }[]) ?? []
  const filledAwards = awards.filter(a => a.distinction || a.year)
  const aiAnswers = (p.aiAnswers as Record<string, string>) ?? {}
  const srAnswers = (p.srAnswers as Record<string, string>) ?? {}

  return (
    <>
      <SectionCard title="Awards" icon={Star}>
        {filledAwards.length === 0
          ? <p className="py-3 text-sm text-white/30 italic">No awards entered</p>
          : filledAwards.map((a, i) => (
              <div key={i} className="py-3 border-b border-white/[0.05] last:border-0">
                <p className="font-semibold text-white/80 text-sm mb-1">{a.name}</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <span><span className="text-white/30">Distinction: </span>{a.distinction || '—'}</span>
                  <span><span className="text-white/30">Category: </span>{a.category || '—'}</span>
                  <span><span className="text-white/30">Year: </span>{a.year || '—'}</span>
                  <span><span className="text-white/30">Brand: </span>{a.brand || '—'}</span>
                </div>
              </div>
            ))
        }
      </SectionCard>
      <SectionCard title="AI Readiness" icon={Zap}>
        {Object.entries(aiAnswers).filter(([, v]) => v).length === 0
          ? <p className="py-3 text-sm text-white/30 italic">No AI answers provided</p>
          : Object.entries(aiAnswers).filter(([, v]) => v).map(([q, a]) => (
              <div key={q} className="py-3 border-b border-white/[0.05] last:border-0">
                <p className="text-xs text-white/40 mb-1">{q}</p>
                <p className="text-sm text-white/75">{a}</p>
              </div>
            ))
        }
      </SectionCard>
      <SectionCard title="Social Responsibility" icon={Shield}>
        {Object.entries(srAnswers).filter(([, v]) => v).length === 0
          ? <p className="py-3 text-sm text-white/30 italic">No social responsibility answers provided</p>
          : Object.entries(srAnswers).filter(([, v]) => v).map(([q, a]) => (
              <div key={q} className="py-3 border-b border-white/[0.05] last:border-0">
                <p className="text-xs text-white/40 mb-1">{q}</p>
                <p className="text-sm text-white/75">{a}</p>
              </div>
            ))
        }
      </SectionCard>
    </>
  )
}

// ── Step 8: Add-On ────────────────────────────────────────────────────────────
function RenderStep8({ p }: { p: Record<string, unknown> }) {
  const investments = (p.investments as Record<string, string>) ?? {}
  const filledInv = Object.entries(investments).filter(([, v]) => v)

  return (
    <>
      <SectionCard title="Strategic Development" icon={BarChart2}>
        <DataRow label="Strategic Development Plans" value={p.strategicDev} />
        <DataRow label="Activities Outside Country" value={p.activityOutside} />
      </SectionCard>
      <SectionCard title="Investments" icon={Zap}>
        {filledInv.length === 0
          ? <p className="py-3 text-sm text-white/30 italic">No investment data provided</p>
          : filledInv.map(([cat, amount]) => (
              <DataRow key={cat} label={cat} value={amount} />
            ))
        }
      </SectionCard>
    </>
  )
}

const STEP_RENDERERS = [RenderStep1, RenderStep2, RenderStep3, RenderStep4, RenderStep5, RenderStep6, RenderStep7, RenderStep8]
const STEP_ICONS = [FileText, User, BarChart2, Zap, Shield, Users, Star, BarChart2]

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function RegistrationDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { user } = useAuth()

  const [reg, setReg] = useState<PendingRegistration | null>(null)
  const [step, setStep] = useState(1)
  const [showRejectDialog, setShowRejectDialog] = useState(false)
  const [rejectReason, setRejectReason] = useState('')

  useEffect(() => {
    if (id) {
      const r = getRegistrationById(id)
      if (!r) router.replace('/admin/pending')
      else setReg(r)
    }
  }, [id, router])

  if (!reg) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-[#0763d8] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const profile = reg.profileData ?? {}
  const StepRenderer = STEP_RENDERERS[step - 1]
  const totalSteps = REGISTRATION_STEPS.length

  const handleApprove = () => {
    approveRegistration(reg.id, user?.id ?? 'admin')
    setReg(r => r ? { ...r, status: 'approved' } : r)
  }

  const handleReject = () => {
    if (!rejectReason.trim()) return
    rejectRegistration(reg.id, rejectReason)
    setReg(r => r ? { ...r, status: 'rejected', rejectionReason: rejectReason } : r)
    setShowRejectDialog(false)
  }

  const typeColor = reg.type === 'agency' ? '[#0763d8]' : '[#7c3aed]'
  const TypeIcon = reg.type === 'agency' ? Building2 : Film

  return (
    <div className="max-w-4xl">
      {/* Reject dialog */}
      {showRejectDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowRejectDialog(false)} />
          <div className="relative w-full max-w-md bg-[#0d1117] border border-white/[0.1] rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <h3 className="font-bold text-white">Reject Registration</h3>
                <p className="text-xs text-white/40">{reg.companyName}</p>
              </div>
            </div>
            <p className="text-sm text-white/60 mb-4">Please provide a reason for rejection. This will be shown to the applicant.</p>
            <textarea
              value={rejectReason}
              onChange={e => setRejectReason(e.target.value)}
              rows={4}
              placeholder="e.g. Incomplete profile — please provide all required information and resubmit."
              className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-red-400/50 resize-none mb-4"
            />
            <div className="flex gap-3">
              <Button
                onClick={handleReject}
                disabled={!rejectReason.trim()}
                className="flex-1 h-10 bg-red-500 hover:bg-red-600 disabled:opacity-40 text-white rounded-xl gap-2"
              >
                <X className="w-4 h-4" /> Confirm Rejection
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowRejectDialog(false)}
                className="flex-1 h-10 border-white/[0.1] text-white/60 hover:text-white rounded-xl"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Back */}
      <Link href="/admin/pending" className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Pending Approvals
      </Link>

      {/* Title row */}
      <div className="flex items-start justify-between gap-4 mb-6 flex-wrap">
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-xl ${reg.type === 'agency' ? 'bg-[#0763d8]/10 border-[#0763d8]/20' : 'bg-[#7c3aed]/10 border-[#7c3aed]/20'} border flex items-center justify-center shrink-0`}>
            <TypeIcon className={`w-6 h-6 ${reg.type === 'agency' ? 'text-[#0763d8]' : 'text-[#7c3aed]'}`} />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white">{reg.companyName}</h1>
            <div className="flex items-center gap-3 mt-1 flex-wrap">
              <StatusBadge status={reg.status} />
              <span className="text-xs text-white/30">
                Submitted by {reg.submittedByName} · {new Date(reg.submittedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
              </span>
            </div>
          </div>
        </div>

        {reg.status === 'pending' && (
          <div className="flex gap-2 shrink-0">
            <Button
              onClick={handleApprove}
              className="h-10 px-5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl gap-2"
            >
              <Check className="w-4 h-4" /> Approve
            </Button>
            <Button
              onClick={() => setShowRejectDialog(true)}
              className="h-10 px-5 bg-red-500/15 hover:bg-red-500/25 text-red-400 border border-red-500/25 rounded-xl gap-2"
              variant="outline"
            >
              <X className="w-4 h-4" /> Reject
            </Button>
          </div>
        )}

        {reg.status === 'approved' && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span className="text-sm text-emerald-400 font-medium">Approved {reg.approvedAt ? `· ${new Date(reg.approvedAt).toLocaleDateString('en-GB')}` : ''}</span>
          </div>
        )}

        {reg.status === 'rejected' && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20">
            <XCircle className="w-4 h-4 text-red-400" />
            <span className="text-sm text-red-400 font-medium">Rejected</span>
          </div>
        )}
      </div>

      {/* Rejection reason banner */}
      {reg.status === 'rejected' && reg.rejectionReason && (
        <div className="mb-6 p-4 bg-red-500/5 border border-red-500/20 rounded-xl">
          <p className="text-xs font-bold text-red-400 uppercase tracking-widest mb-1">Rejection Reason</p>
          <p className="text-sm text-red-300/80">{reg.rejectionReason}</p>
        </div>
      )}

      {/* Step navigator */}
      <div className="glass-card rounded-2xl p-4 mb-6">
        <div className="flex items-center gap-1 overflow-x-auto pb-1">
          {REGISTRATION_STEPS.map((s, i) => {
            const StepIcon = STEP_ICONS[i]
            const isActive = step === i + 1
            return (
              <button
                key={s.key}
                onClick={() => setStep(i + 1)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap shrink-0 transition-all ${
                  isActive
                    ? 'bg-[#0763d8] text-white shadow-lg shadow-[#0763d8]/20'
                    : 'text-white/40 hover:text-white hover:bg-white/[0.06]'
                }`}
              >
                <span className={`w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center shrink-0 ${
                  isActive ? 'bg-white/20 text-white' : 'bg-white/[0.06] text-white/30'
                }`}>{i + 1}</span>
                <span className="hidden sm:inline">{s.shortLabel}</span>
              </button>
            )
          })}
        </div>
        <div className="mt-3 h-1 bg-white/[0.05] rounded-full">
          <div
            className="h-full bg-[#0763d8] rounded-full transition-all duration-300"
            style={{ width: `${((step) / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {/* Step content */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-xl bg-[#0763d8]/10 border border-[#0763d8]/20 flex items-center justify-center">
            <span className="text-xs font-bold text-[#0763d8]">{step}</span>
          </div>
          <h2 className="text-lg font-bold text-white">{REGISTRATION_STEPS[step - 1].label}</h2>
        </div>
        <StepRenderer p={profile} />
      </div>

      {/* Navigation buttons */}
      <div className="flex items-center justify-between">
        <Button
          onClick={() => setStep(s => Math.max(1, s - 1))}
          disabled={step === 1}
          variant="outline"
          className="h-10 px-5 border-white/[0.1] text-white/60 hover:text-white rounded-xl gap-2 disabled:opacity-30"
        >
          <ChevronLeft className="w-4 h-4" /> Previous
        </Button>
        <span className="text-xs text-white/30">Step {step} of {totalSteps}</span>
        {step < totalSteps ? (
          <Button
            onClick={() => setStep(s => Math.min(totalSteps, s + 1))}
            className="h-10 px-5 bg-[#0763d8] hover:bg-[#0655b3] text-white rounded-xl gap-2"
          >
            Next <ChevronRight className="w-4 h-4" />
          </Button>
        ) : (
          reg.status === 'pending' ? (
            <Button
              onClick={handleApprove}
              className="h-10 px-5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl gap-2"
            >
              <Check className="w-4 h-4" /> Approve Registration
            </Button>
          ) : (
            <Link href="/admin/pending">
              <Button variant="outline" className="h-10 px-5 border-white/[0.1] text-white/60 hover:text-white rounded-xl">
                Back to List
              </Button>
            </Link>
          )
        )}
      </div>
    </div>
  )
}
