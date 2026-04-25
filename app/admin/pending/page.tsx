'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'
import type { PendingRegistration } from '@/lib/admin-store'
import { getAllRegistrationsFS, approveRegistrationFS } from '@/lib/admin-firestore'
import { Input } from '@/components/ui/input'
import {
  Building2, Film, Clock, CheckCircle2, XCircle,
  Search, ChevronRight, Check
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

function TypeBadge({ type }: { type: string }) {
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

export default function PendingPage() {
  const { user } = useAuth()
  const [registrations, setRegistrations] = useState<PendingRegistration[]>([])
  const [filter, setFilter] = useState<FilterTab>('pending')
  const [search, setSearch] = useState('')

  const load = useCallback(async () => {
    const data = await getAllRegistrationsFS()
    setRegistrations(data)
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

  const handleApprove = async (id: string) => {
    await approveRegistrationFS(id, user?.id ?? 'admin')
    load()
  }

  const TABS: { id: FilterTab; label: string }[] = [
    { id: 'pending', label: `Pending (${registrations.filter(r => r.status === 'pending').length})` },
    { id: 'approved', label: 'Approved' },
    { id: 'rejected', label: 'Rejected' },
    { id: 'all', label: 'All' },
  ]

  return (
    <div className="max-w-5xl">
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
          <div className="hidden md:grid grid-cols-[1fr_100px_140px_120px_100px_auto] gap-4 px-5 py-3 border-b border-white/[0.06] text-xs font-medium text-white/30 uppercase tracking-widest">
            <span>Company</span>
            <span>Type</span>
            <span>Submitted By</span>
            <span>Date</span>
            <span>Status</span>
            <span className="w-4"></span>
          </div>

          <div className="divide-y divide-white/[0.04]">
            {filtered.map(reg => (
              <Link
                key={reg.id}
                href={`/admin/registrations/${reg.id}`}
                className="flex items-center gap-4 px-5 py-4 hover:bg-white/[0.03] transition-colors group cursor-pointer"
              >
                {/* Mobile layout */}
                <div className="flex-1 min-w-0 md:grid md:grid-cols-[1fr_100px_140px_120px_100px] md:gap-4 md:items-center">
                  <div className="min-w-0 mb-2 md:mb-0">
                    <p className="font-semibold text-white truncate group-hover:text-[#0763d8] transition-colors">{reg.companyName}</p>
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

                {/* Approve inline (pending only) */}
                {reg.status === 'pending' && (
                  <div className="flex items-center gap-1.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={e => { e.preventDefault(); e.stopPropagation(); handleApprove(reg.id) }}
                      className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-colors"
                      title="Quick approve"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-white/50 transition-colors shrink-0" />
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
