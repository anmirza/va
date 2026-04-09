'use client'

import { useEffect, useState, useCallback } from 'react'
import { useAuth } from '@/lib/auth-context'
import {
  getAllRegistrations, approveRegistration, rejectRegistration, PendingRegistration
} from '@/lib/admin-store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Building2, Film, Clock, CheckCircle2, XCircle,
  Search, Eye, Check, X, ChevronDown, ChevronUp,
  User, Mail, Calendar,
} from 'lucide-react'

type FilterTab = 'all' | 'pending' | 'approved' | 'rejected'

function StatusBadge({ status }: { status: PendingRegistration['status'] }) {
  const map = {
    pending: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
    approved: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
    rejected: 'bg-red-500/10 border-red-500/20 text-red-400',
  }
  const labels = { pending: 'Under Review', approved: 'Approved', rejected: 'Rejected' }
  const icons = { pending: Clock, approved: CheckCircle2, rejected: XCircle }
  const Icon = icons[status]
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${map[status]}`}>
      <Icon className="w-3 h-3" />
      {labels[status]}
    </span>
  )
}

function TypeBadge({ type }: { type: 'agency' | 'production' }) {
  return type === 'agency' ? (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#0763d8]/10 text-[#0763d8] text-xs font-medium border border-[#0763d8]/20">
      <Building2 className="w-3 h-3" /> Agency
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#7c3aed]/10 text-[#7c3aed] text-xs font-medium border border-[#7c3aed]/20">
      <Film className="w-3 h-3" /> Production
    </span>
  )
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

function DetailModal({ reg, onClose, onApprove, onReject }: {
  reg: PendingRegistration
  onClose: () => void
  onApprove: () => void
  onReject: (reason: string) => void
}) {
  const [rejectReason, setRejectReason] = useState('')
  const [showRejectForm, setShowRejectForm] = useState(false)
  const [expanded, setExpanded] = useState(false)

  const profile = reg.profileData ?? {}

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-[#0d1117] border border-white/[0.1] rounded-2xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-4 px-6 py-5 border-b border-white/[0.06]">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <TypeBadge type={reg.type} />
              <StatusBadge status={reg.status} />
            </div>
            <h2 className="text-lg font-bold text-white truncate">{reg.companyName}</h2>
          </div>
          <button onClick={onClose} className="text-white/40 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Submitter info */}
          <div className="glass-card rounded-xl p-4 space-y-2">
            <p className="text-xs font-bold text-white/40 uppercase tracking-widest mb-2">Submitted By</p>
            <div className="flex items-center gap-2 text-sm">
              <User className="w-4 h-4 text-white/40" />
              <span className="text-white/80">{reg.submittedByName}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Mail className="w-4 h-4 text-white/40" />
              <span className="text-white/60">{reg.submittedByEmail}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4 text-white/40" />
              <span className="text-white/60">{formatDate(reg.submittedAt)}</span>
            </div>
          </div>

          {/* Key info */}
          <div className="glass-card rounded-xl p-4">
            <p className="text-xs font-bold text-white/40 uppercase tracking-widest mb-3">Company Details</p>
            <div className="grid grid-cols-2 gap-3 text-sm">
              {[
                ['Country', profile.country],
                ['City', profile.city],
                ['Category', profile.category],
                ['Employees', profile.employees],
                ['Year Est.', profile.yearEstablished],
                ['Legal Form', profile.legalForm],
              ].filter(([, v]) => v).map(([k, v]) => (
                <div key={k as string}>
                  <p className="text-xs text-white/30 mb-0.5">{k as string}</p>
                  <p className="text-white/80">{v as string}</p>
                </div>
              ))}
            </div>
          </div>

          {/* About */}
          {profile.about && (
            <div className="glass-card rounded-xl p-4">
              <p className="text-xs font-bold text-white/40 uppercase tracking-widest mb-2">About</p>
              <p className="text-sm text-white/70 leading-relaxed line-clamp-4">{String(profile.about)}</p>
            </div>
          )}

          {/* Rejection reason if rejected */}
          {reg.status === 'rejected' && reg.rejectionReason && (
            <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-4">
              <p className="text-xs font-bold text-red-400 uppercase tracking-widest mb-1">Rejection Reason</p>
              <p className="text-sm text-red-300">{reg.rejectionReason}</p>
            </div>
          )}

          {/* Reject form */}
          {showRejectForm && reg.status === 'pending' && (
            <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-4 space-y-3">
              <p className="text-sm font-medium text-white">Rejection Reason (optional)</p>
              <textarea
                value={rejectReason}
                onChange={e => setRejectReason(e.target.value)}
                rows={3}
                placeholder="Explain why this registration is being rejected..."
                className="w-full bg-white/[0.04] border border-white/[0.1] rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-red-400/50 resize-none"
              />
              <div className="flex gap-2">
                <Button
                  onClick={() => onReject(rejectReason)}
                  className="flex-1 h-9 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm"
                >
                  Confirm Rejection
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowRejectForm(false)}
                  className="flex-1 h-9 border-white/[0.1] text-white/60 hover:text-white rounded-lg text-sm"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        {reg.status === 'pending' && (
          <div className="p-6 border-t border-white/[0.06] flex gap-3">
            <Button
              onClick={onApprove}
              className="flex-1 h-10 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl gap-2"
            >
              <Check className="w-4 h-4" /> Approve
            </Button>
            <Button
              onClick={() => setShowRejectForm(true)}
              className="flex-1 h-10 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/20 rounded-xl gap-2"
              variant="outline"
            >
              <X className="w-4 h-4" /> Reject
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default function PendingPage() {
  const { user } = useAuth()
  const [registrations, setRegistrations] = useState<PendingRegistration[]>([])
  const [filter, setFilter] = useState<FilterTab>('pending')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<PendingRegistration | null>(null)

  const load = useCallback(() => {
    setRegistrations(getAllRegistrations())
  }, [])

  useEffect(() => { load() }, [load])

  const filtered = registrations.filter(r => {
    if (filter !== 'all' && r.status !== filter) return false
    if (search) {
      const q = search.toLowerCase()
      return r.companyName.toLowerCase().includes(q) || r.submittedByEmail.toLowerCase().includes(q) || r.submittedByName.toLowerCase().includes(q)
    }
    return true
  })

  const handleApprove = (id: string) => {
    approveRegistration(id, user?.id ?? 'admin')
    load()
    setSelected(null)
  }

  const handleReject = (id: string, reason: string) => {
    rejectRegistration(id, reason)
    load()
    setSelected(null)
  }

  const TABS: { id: FilterTab; label: string }[] = [
    { id: 'pending', label: `Pending (${registrations.filter(r => r.status === 'pending').length})` },
    { id: 'approved', label: 'Approved' },
    { id: 'rejected', label: 'Rejected' },
    { id: 'all', label: 'All' },
  ]

  return (
    <div className="max-w-5xl">
      {selected && (
        <DetailModal
          reg={selected}
          onClose={() => setSelected(null)}
          onApprove={() => handleApprove(selected.id)}
          onReject={(r) => handleReject(selected.id, r)}
        />
      )}

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-1">Pending Approvals</h1>
        <p className="text-white/40 text-sm">Review and approve agency and production company registrations.</p>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <Input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by company, name or email..."
            className="pl-9 h-10 bg-white/[0.04] border-white/[0.1] text-white placeholder:text-white/30 rounded-xl"
          />
        </div>
        <div className="flex gap-1 bg-white/[0.04] border border-white/[0.08] rounded-xl p-1">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                filter === tab.id ? 'bg-[#0763d8] text-white' : 'text-white/50 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="glass-card rounded-2xl p-16 text-center">
          <Clock className="w-10 h-10 text-white/20 mx-auto mb-3" />
          <p className="text-white/40 text-sm">No {filter === 'all' ? '' : filter} registrations found.</p>
          {filter === 'pending' && (
            <p className="text-white/20 text-xs mt-1">New agency and production house submissions will appear here.</p>
          )}
        </div>
      ) : (
        <div className="glass-card rounded-2xl overflow-hidden">
          {/* Table header */}
          <div className="hidden md:grid grid-cols-[1fr_100px_140px_120px_100px] gap-4 px-5 py-3 border-b border-white/[0.06] text-xs font-medium text-white/30 uppercase tracking-widest">
            <span>Company</span>
            <span>Type</span>
            <span>Submitted By</span>
            <span>Date</span>
            <span>Status</span>
          </div>

          <div className="divide-y divide-white/[0.04]">
            {filtered.map(reg => (
              <div
                key={reg.id}
                className="flex items-center gap-4 px-5 py-4 hover:bg-white/[0.03] transition-colors group cursor-pointer"
                onClick={() => setSelected(reg)}
              >
                {/* Mobile layout */}
                <div className="flex-1 min-w-0 md:grid md:grid-cols-[1fr_100px_140px_120px_100px] md:gap-4 md:items-center">
                  <div className="min-w-0 mb-2 md:mb-0">
                    <p className="font-semibold text-white truncate">{reg.companyName}</p>
                    <p className="text-xs text-white/40 md:hidden">{reg.submittedByName} · {formatDate(reg.submittedAt)}</p>
                  </div>
                  <div className="hidden md:block"><TypeBadge type={reg.type} /></div>
                  <div className="hidden md:block">
                    <p className="text-sm text-white/70 truncate">{reg.submittedByName}</p>
                    <p className="text-xs text-white/40 truncate">{reg.submittedByEmail}</p>
                  </div>
                  <div className="hidden md:block">
                    <p className="text-sm text-white/60">{formatDate(reg.submittedAt)}</p>
                  </div>
                  <div className="hidden md:block"><StatusBadge status={reg.status} /></div>
                </div>

                {/* Approve/reject inline (pending only) */}
                {reg.status === 'pending' && (
                  <div className="flex items-center gap-1.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={e => { e.stopPropagation(); handleApprove(reg.id) }}
                      className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-colors"
                      title="Approve"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={e => { e.stopPropagation(); setSelected(reg) }}
                      className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                      title="Reject"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                <button className="text-white/20 group-hover:text-white/50 transition-colors shrink-0">
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
