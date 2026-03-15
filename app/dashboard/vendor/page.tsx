'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import { AuthGuard } from '@/components/auth-guard'
import { Header } from '@/components/header'
import { Button } from '@/components/ui/button'
import { companies } from '@/lib/mock-data'
import {
  Building2, Film, Plus, Settings, ExternalLink,
  ChevronRight, Clock, CheckCircle2, AlertCircle,
} from 'lucide-react'

function VendorDashboardContent() {
  const { user } = useAuth()
  const router = useRouter()

  // Redirect non-vendors away
  useEffect(() => {
    if (user && user.accountType !== 'vendor') {
      router.replace('/dashboard')
    }
  }, [user, router])

  const myCompanies = companies.filter(c =>
    user?.companyIds?.includes(c.id) || user?.companyId === c.id
  )

  const statusIcon = (status?: string) => {
    if (status === 'active') return <CheckCircle2 className="w-4 h-4 text-emerald-400" />
    if (status === 'pending_review') return <Clock className="w-4 h-4 text-amber-400" />
    return <AlertCircle className="w-4 h-4 text-white/30" />
  }

  const statusLabel = (status?: string) => {
    if (status === 'active') return 'Active'
    if (status === 'pending_review') return 'Under Review'
    return 'Draft'
  }

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
                <p className="text-[#0763d8] text-sm">Vendor Account</p>
              </div>
            </div>
            <Link href="/dashboard/settings">
              <Button variant="outline" size="sm" className="border-white/[0.12] text-white/70 hover:text-white gap-2">
                <Settings className="w-4 h-4" />
                Settings
              </Button>
            </Link>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">

          {/* My Companies */}
          <section>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold text-white">My Companies</h2>
              <span className="text-xs text-white/30">
                {myCompanies.length} registered
              </span>
            </div>

            {myCompanies.length > 0 ? (
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
                          {statusIcon(user?.status)}
                          {statusLabel(user?.status)}
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
            ) : (
              <div className="glass-card rounded-2xl p-10 text-center mb-6">
                <div className="w-14 h-14 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center mx-auto mb-4">
                  <Building2 className="w-7 h-7 text-white/20" />
                </div>
                <p className="text-white/60 font-medium mb-1">No companies registered yet</p>
                <p className="text-white/30 text-sm">Add your agency or production house to get discovered</p>
              </div>
            )}

            {/* Add Company actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link href="/signup/agency">
                <div className="group glass-card rounded-2xl p-5 flex items-center gap-4 hover:border-[#0763d8]/40 hover:shadow-lg hover:shadow-[#0763d8]/10 transition-all cursor-pointer">
                  <div className="w-11 h-11 rounded-xl bg-[#0763d8]/10 border border-[#0763d8]/20 flex items-center justify-center shrink-0 group-hover:bg-[#0763d8]/20 transition-colors">
                    <Building2 className="w-5 h-5 text-[#0763d8]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-white">Add Agency</p>
                    <p className="text-xs text-white/40 mt-0.5">Register an advertising agency</p>
                  </div>
                  <Plus className="w-4 h-4 text-white/30 group-hover:text-[#0763d8] transition-colors" />
                </div>
              </Link>

              <Link href="/signup/production">
                <div className="group glass-card rounded-2xl p-5 flex items-center gap-4 hover:border-[#7c3aed]/40 hover:shadow-lg hover:shadow-[#7c3aed]/10 transition-all cursor-pointer">
                  <div className="w-11 h-11 rounded-xl bg-[#7c3aed]/10 border border-[#7c3aed]/20 flex items-center justify-center shrink-0 group-hover:bg-[#7c3aed]/20 transition-colors">
                    <Film className="w-5 h-5 text-[#7c3aed]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-white">Add Production House</p>
                    <p className="text-xs text-white/40 mt-0.5">Register a film or content production company</p>
                  </div>
                  <Plus className="w-4 h-4 text-white/30 group-hover:text-[#7c3aed] transition-colors" />
                </div>
              </Link>
            </div>
          </section>

          {/* Quick Links */}
          <section>
            <h2 className="text-xl font-bold text-white mb-5">Quick Links</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { label: 'Browse Directory', desc: 'Explore other companies', href: '/directory', icon: Building2 },
                { label: 'Creative Library', desc: 'View award-winning campaigns', href: '/creative-library', icon: Film },
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
