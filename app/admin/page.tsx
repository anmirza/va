'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getAdminStats, getRecentActivity, ActivityLogEntry } from '@/lib/admin-store'
import { Building2, Film, Clock, Users, CheckCircle2, XCircle, TrendingUp, ArrowRight } from 'lucide-react'

function StatCard({
  label, value, icon: Icon, color, href,
}: {
  label: string; value: number; icon: React.ElementType; color: string; href?: string;
}) {
  const content = (
    <div className={`glass-card rounded-2xl p-5 group ${href ? 'hover:border-white/20 cursor-pointer' : ''} transition-all`}>
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
          <Icon className="w-5 h-5" />
        </div>
        {href && <ArrowRight className="w-4 h-4 text-white/20 group-hover:text-white/50 transition-colors" />}
      </div>
      <p className="text-3xl font-bold text-white mb-1">{value}</p>
      <p className="text-sm text-white/50">{label}</p>
    </div>
  )
  return href ? <Link href={href}>{content}</Link> : content
}

const ACTIVITY_ICONS: Record<string, React.ElementType> = {
  approval: CheckCircle2,
  rejection: XCircle,
  signup: TrendingUp,
  org_create: Building2,
  org_remove: XCircle,
  invite: Users,
}

const ACTIVITY_COLORS: Record<string, string> = {
  approval: 'text-emerald-400',
  rejection: 'text-red-400',
  signup: 'text-[#0763d8]',
  org_create: 'text-emerald-400',
  org_remove: 'text-red-400',
  invite: 'text-amber-400',
}

function timeAgo(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime()
  const min = Math.floor(ms / 60000)
  if (min < 1) return 'just now'
  if (min < 60) return `${min}m ago`
  const hr = Math.floor(min / 60)
  if (hr < 24) return `${hr}h ago`
  return `${Math.floor(hr / 24)}d ago`
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({ totalAgencies: 0, totalProduction: 0, pendingApprovals: 0, totalUsers: 0, recentApprovals: 0, recentRejections: 0 })
  const [activity, setActivity] = useState<ActivityLogEntry[]>([])

  useEffect(() => {
    setStats(getAdminStats())
    setActivity(getRecentActivity(10))
  }, [])

  return (
    <div className="max-w-5xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">Admin Dashboard</h1>
        <p className="text-white/40 text-sm">Manage organisations, approvals, and users.</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Active Agencies" value={stats.totalAgencies} icon={Building2} color="bg-[#0763d8]/10 text-[#0763d8]" href="/admin/agencies" />
        <StatCard label="Production Companies" value={stats.totalProduction} icon={Film} color="bg-[#7c3aed]/10 text-[#7c3aed]" href="/admin/production" />
        <StatCard label="Pending Approvals" value={stats.pendingApprovals} icon={Clock} color="bg-amber-500/10 text-amber-400" href="/admin/pending" />
        <StatCard label="Team Members" value={stats.totalUsers} icon={Users} color="bg-emerald-500/10 text-emerald-400" href="/admin/users" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity feed */}
        <div className="lg:col-span-2 glass-card rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
            <h2 className="font-semibold text-white text-sm">Recent Activity</h2>
            <span className="text-xs text-white/30">{activity.length} events</span>
          </div>
          <div className="divide-y divide-white/[0.04]">
            {activity.length === 0 ? (
              <div className="px-6 py-10 text-center">
                <p className="text-white/30 text-sm">No activity yet.</p>
                <p className="text-white/20 text-xs mt-1">Actions will appear here as users register and admins take actions.</p>
              </div>
            ) : (
              activity.map(item => {
                const Icon = ACTIVITY_ICONS[item.type] ?? TrendingUp
                const color = ACTIVITY_COLORS[item.type] ?? 'text-white/50'
                return (
                  <div key={item.id} className="flex items-start gap-3 px-6 py-4">
                    <div className={`mt-0.5 shrink-0 ${color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white/80">{item.description}</p>
                    </div>
                    <span className="text-xs text-white/30 shrink-0">{timeAgo(item.timestamp)}</span>
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* Quick actions */}
        <div className="space-y-4">
          <div className="glass-card rounded-2xl p-5">
            <h2 className="font-semibold text-white text-sm mb-4">Quick Actions</h2>
            <div className="space-y-2">
              {[
                { label: 'Review Pending Requests', href: '/admin/pending', color: 'bg-amber-500/10 border-amber-500/20 text-amber-400', count: stats.pendingApprovals },
                { label: 'Create Agency', href: '/admin/agencies/create', color: 'bg-[#0763d8]/10 border-[#0763d8]/20 text-[#0763d8]' },
                { label: 'Create Production Co.', href: '/admin/production/create', color: 'bg-[#7c3aed]/10 border-[#7c3aed]/20 text-[#7c3aed]' },
                { label: 'Edit Disclaimer Text', href: '/admin/disclaimer', color: 'bg-white/[0.04] border-white/[0.1] text-white/60' },
              ].map(action => (
                <Link
                  key={action.href}
                  href={action.href}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl border transition-all hover:opacity-80 ${action.color}`}
                >
                  <span className="text-sm font-medium">{action.label}</span>
                  <div className="flex items-center gap-2">
                    {action.count != null && action.count > 0 && (
                      <span className="text-xs bg-amber-500 text-white px-1.5 py-0.5 rounded-full font-bold">{action.count}</span>
                    )}
                    <ArrowRight className="w-3.5 h-3.5 opacity-60" />
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="glass-card rounded-2xl p-5">
            <h2 className="font-semibold text-white text-sm mb-3">Approval Stats</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-400 text-sm"><CheckCircle2 className="w-4 h-4" /> Approved</div>
                <span className="font-bold text-white">{stats.recentApprovals}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-red-400 text-sm"><XCircle className="w-4 h-4" /> Rejected</div>
                <span className="font-bold text-white">{stats.recentRejections}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-amber-400 text-sm"><Clock className="w-4 h-4" /> Pending</div>
                <span className="font-bold text-white">{stats.pendingApprovals}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
