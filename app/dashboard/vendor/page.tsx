'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import { AuthGuard } from '@/components/auth-guard'
import { Header } from '@/components/header'
import { Button } from '@/components/ui/button'
import { companies } from '@/lib/mock-data'
import type { PendingRegistration, VACategory } from '@/lib/admin-store'
import { getRegistrationsByUserFS, getVACategoriesFS } from '@/lib/admin-firestore'
import { CategoryIcon } from '@/components/category-icon'
import {
  Building2, Film, Plus, Settings, ExternalLink,
  ChevronRight, Clock, CheckCircle2, AlertCircle, XCircle, Users, RefreshCw, Layers, AlertTriangle, FileEdit
} from 'lucide-react'

// ── Status helpers ────────────────────────────────────────────────────────────

function RegistrationStatusBadge({ status }: { status: PendingRegistration['status'] }) {
  const map: Record<string, { cls: string; icon: any; label: string }> = {
    pending: { cls: 'bg-amber-500/10 border-amber-500/20 text-amber-400', icon: Clock, label: 'Under Review' },
    approved: { cls: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400', icon: CheckCircle2, label: 'Active' },
    rejected: { cls: 'bg-red-500/10 border-red-500/20 text-red-400', icon: XCircle, label: 'Rejected' },
    amendment_requested: { cls: 'bg-orange-500/10 border-orange-500/20 text-orange-400', icon: AlertTriangle, label: 'Amendment Required' },
  }
  const m = map[status]
  const Icon = m.icon
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${m.cls}`}>
      <Icon className="w-3 h-3" />{m.label}
    </span>
  )
}

// ── Pending Registration Card ─────────────────────────────────────────────────

function PendingCard({ reg }: { reg: PendingRegistration }) {
  const isAgency = reg.type === 'agency'
  const isProduction = reg.type === 'production'
  const color = isAgency ? '[#0763d8]' : isProduction ? '[#7c3aed]' : 'white'
  const Icon = isAgency ? Building2 : Film

  return (
    <div className={`glass-card rounded-2xl overflow-hidden hover:border-white/20 transition-all`}>
      <div className={`h-12 bg-white/5`} />
      <div className="p-4 -mt-3 relative">
        <div className="flex items-start gap-3 mb-3">
          <div className={`w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0`}>
            <Icon className={`w-5 h-5 text-white/40`} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-white truncate">{reg.companyName}</p>
            <p className="text-xs text-white/40 capitalize">{reg.type}</p>
          </div>
          <RegistrationStatusBadge status={reg.status} />
        </div>

        {reg.status === 'pending' && (
          <p className="text-xs text-white/40 mb-3">
            Submitted on {new Date(reg.submittedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}. Our team is reviewing your application.
          </p>
        )}

        {reg.status === 'rejected' && (
          <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-3 mb-3">
            <p className="text-xs text-red-400 font-medium mb-0.5">Rejected</p>
            <p className="text-xs text-red-300/70">{reg.rejectionReason || 'Your application was not approved. Please contact support for details.'}</p>
          </div>
        )}

        {reg.status === 'amendment_requested' && (
          <div className="bg-orange-500/5 border border-orange-500/20 rounded-lg p-3 mb-3">
            <div className="flex items-center gap-1.5 mb-1">
              <FileEdit className="w-3.5 h-3.5 text-orange-400" />
              <p className="text-xs text-orange-400 font-medium">Amendment Required</p>
            </div>
            <p className="text-xs text-orange-300/70">{reg.amendmentNote || 'Your registration requires updates. Please review and resubmit.'}</p>
          </div>
        )}

        {reg.status === 'approved' && (
          <p className="text-xs text-emerald-400 mb-3">
            ✓ Your application was approved. Your profile is now active on the platform.
          </p>
        )}

        {reg.status === 'rejected' && (
          <Link href={reg.type === 'agency' ? '/signup/agency' : reg.type === 'production' ? '/signup/production' : `/signup/register/${reg.type}`}>
            <Button size="sm" className="w-full bg-red-500 hover:bg-red-600 text-white gap-1.5 text-xs">
              <RefreshCw className="w-3.5 h-3.5" /> Resubmit Application
            </Button>
          </Link>
        )}

        {reg.status === 'amendment_requested' && (
          <Link href={reg.type === 'agency' ? '/signup/agency' : reg.type === 'production' ? '/signup/production' : `/signup/register/${reg.type}`}>
            <Button size="sm" className="w-full bg-orange-500 hover:bg-orange-600 text-white gap-1.5 text-xs">
              <FileEdit className="w-3.5 h-3.5" /> Fix & Resubmit
            </Button>
          </Link>
        )}

        {reg.status === 'approved' && (
          <Link href={reg.type === 'agency' ? '/dashboard/agency' : '/dashboard/production'}>
            <Button size="sm" className="w-full bg-[#0763d8] hover:bg-[#0655b3] text-white gap-1.5 text-xs">
              <Settings className="w-3.5 h-3.5" /> Manage Profile
            </Button>
          </Link>
        )}
      </div>
    </div>
  )
}

// ── Main ─────────────────────────────────────────────────────────────────────

function VendorDashboardContent() {
  const { user, isModerator } = useAuth()
  const router = useRouter()
  const [pendingRegs, setPendingRegs] = useState<PendingRegistration[]>([])
  const [categories, setCategories] = useState<VACategory[]>([])

  useEffect(() => {
    if (user && user.accountType !== 'vendor') {
      router.replace('/dashboard')
    }
  }, [user, router])

  useEffect(() => {
    if (user?.id) {
      getRegistrationsByUserFS(user.id).then(setPendingRegs)
    }
    getVACategoriesFS().then(setCategories)
  }, [user?.id])

  const myCompanies = companies.filter(c =>
    user?.companyIds?.includes(c.id) || user?.companyId === c.id
  )

  const hasAnyRegistrations = pendingRegs.length > 0 || myCompanies.length > 0

  return (
    <div className="min-h-screen bg-[#02030E] flex flex-col">
      <Header />
      <main className="flex-1">

        {/* Page header */}
        <div className="border-b border-white/[0.06] px-4 sm:px-6 lg:px-8 py-10">
          <div className="max-w-5xl mx-auto flex items-start justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-4">
              {user?.avatar ? (
                <img src={user.avatar} alt="" className="w-14 h-14 rounded-xl object-cover border-2 border-[#0763d8]" />
              ) : (
                <div className="w-14 h-14 rounded-xl bg-[#0763d8] flex items-center justify-center text-white font-bold text-xl">
                  {user?.name?.[0]?.toUpperCase()}
                </div>
              )}
              <div>
                <h1 className="text-2xl font-bold text-white">Welcome back, {user?.name}</h1>
                <div className="flex items-center gap-2 flex-wrap mt-1">
                  <p className="text-[#0763d8] text-sm">Vendor Account</p>
                  {isModerator && user?.orgId && (
                    <span className="text-xs bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full">Moderator</span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link href="/dashboard/settings">
                <Button variant="outline" size="sm" className="border-white/[0.12] text-white/70 hover:text-white gap-2">
                  <Settings className="w-4 h-4" />
                  Settings
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">

          {/* My Companies / Registrations */}
          <section>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold text-white">My Organisations</h2>
              <span className="text-xs text-white/30">
                {hasAnyRegistrations ? pendingRegs.length + myCompanies.length : 0} total
              </span>
            </div>

            {/* Pending/submitted registrations */}
            {pendingRegs.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                {pendingRegs.map(reg => (
                  <PendingCard key={reg.id} reg={reg} />
                ))}
              </div>
            )}

            {/* Existing active companies */}
            {myCompanies.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                {myCompanies.map(company => (
                  <div
                    key={company.id}
                    className="glass-card rounded-2xl overflow-hidden hover:border-[#0763d8]/30 transition-all group"
                  >
                    <div
                      className="h-20 bg-cover bg-center relative"
                      style={{ backgroundImage: `url(${company.coverImage})` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-[#02030E]/80" />
                    </div>
                    <div className="p-5 -mt-6 relative">
                      <div className="flex items-end gap-3 mb-3">
                        <div className="w-12 h-12 rounded-xl bg-white/[0.06] border border-white/[0.1] flex items-center justify-center text-white font-bold text-lg shrink-0">
                          {company.name[0]}
                        </div>
                        <div className="flex-1 min-w-0 pb-0.5">
                          <p className="font-semibold text-white truncate">{company.name}</p>
                          <p className="text-xs text-white/40">{company.city}, {company.country}</p>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-white/50 shrink-0">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          Active
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Link href={`/directory/${company.id}`} className="flex-1">
                          <Button size="sm" variant="outline" className="w-full border-white/[0.1] text-white/70 hover:text-white gap-1.5 text-xs">
                            <ExternalLink className="w-3.5 h-3.5" />
                            View Profile
                          </Button>
                        </Link>
                        <Link href={`/dashboard/agency`} className="flex-1">
                          <Button size="sm" className="w-full bg-[#0763d8] hover:bg-[#0655b3] text-white gap-1.5 text-xs">
                            <Settings className="w-3.5 h-3.5" />
                            Manage
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!hasAnyRegistrations && (
              <div className="glass-card rounded-2xl p-10 text-center mb-6">
                <div className="w-14 h-14 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center mx-auto mb-4">
                  <Building2 className="w-7 h-7 text-white/20" />
                </div>
                <p className="text-white/60 font-medium mb-1">No organisations registered yet</p>
                <p className="text-white/30 text-sm">Add your agency or production house to get discovered</p>
              </div>
            )}

            <div className="flex items-center gap-2 mb-4">
              <Plus className="w-4 h-4 text-[#0763d8]" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Add Organisation</h3>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map(cat => (
                <Link key={cat.id} href={cat.id.includes('agency') ? '/signup/agency' : cat.id.includes('production') ? '/signup/production' : `/signup/register/${cat.id}`}>
                  <div className="group glass-card rounded-2xl p-5 flex items-center gap-4 hover:border-[#0763d8]/40 hover:shadow-lg hover:shadow-[#0763d8]/10 transition-all cursor-pointer h-full">
                    <div className="w-11 h-11 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center shrink-0 group-hover:bg-[#0763d8]/10 group-hover:border-[#0763d8]/30 transition-colors">
                      <CategoryIcon categoryName={cat.name} className="w-5 h-5 text-white/40 group-hover:text-[#0763d8]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-white group-hover:text-white transition-colors">Add {cat.name}</p>
                      <p className="text-xs text-white/30 mt-0.5 line-clamp-1">Register a new {cat.name.toLowerCase()}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-white/10 group-hover:text-[#0763d8] transition-colors" />
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* Quick Links */}
          <section>
            <h2 className="text-xl font-bold text-white mb-5">Quick Links</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { label: 'Browse Directory', desc: 'Explore other companies', href: '/directory', icon: Building2 },
                { label: 'Get Inspired', desc: 'View award-winning campaigns', href: '/creative-library', icon: Film },
                { label: 'Account Settings', desc: 'Manage your profile', href: '/dashboard/settings', icon: Settings },
              ].map(item => {
                const Icon = item.icon
                return (
                  <Link key={item.href} href={item.href} className="group glass-card rounded-xl p-4 flex items-center gap-3 hover:border-white/20 transition-all">
                    <div className="w-9 h-9 rounded-lg bg-white/[0.04] flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4 text-white/40 group-hover:text-white/70 transition-colors" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-white/80 group-hover:text-white transition-colors">{item.label}</p>
                      <p className="text-xs text-white/30">{item.desc}</p>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-white/20 ml-auto group-hover:text-white/40 transition-colors" />
                  </Link>
                )
              })}
            </div>
          </section>

        </div>
      </main>
    </div>
  )
}

export default function VendorDashboardPage() {
  return (
    <AuthGuard>
      <VendorDashboardContent />
    </AuthGuard>
  )
}
