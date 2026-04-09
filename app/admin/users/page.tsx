'use client'

import { useEffect, useState } from 'react'
import { mockUsers } from '@/lib/mock-data'
import { Shield, Users, Crown, User } from 'lucide-react'

const ROLE_LABELS: Record<string, string> = {
  super_admin: 'Super Admin',
  admin: 'Admin',
  moderator: 'Moderator',
  vendor: 'Vendor',
  client: 'Client',
  talent: 'Talent',
  agency_owner: 'Agency Owner',
  production: 'Production',
  user: 'User',
}

const ROLE_COLORS: Record<string, string> = {
  super_admin: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
  admin: 'bg-[#0763d8]/10 border-[#0763d8]/20 text-[#0763d8]',
  moderator: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
  vendor: 'bg-white/[0.06] border-white/[0.1] text-white/60',
  client: 'bg-purple-500/10 border-purple-500/20 text-purple-400',
  talent: 'bg-pink-500/10 border-pink-500/20 text-pink-400',
  agency_owner: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
  production: 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400',
  user: 'bg-white/[0.04] border-white/[0.08] text-white/40',
}

const ROLE_ICONS: Record<string, React.ElementType> = {
  super_admin: Crown,
  admin: Shield,
  moderator: Users,
  vendor: User,
  client: User,
  talent: User,
  agency_owner: User,
  production: User,
  user: User,
}

function formatDate(iso?: string) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

export default function UsersPage() {
  return (
    <div className="max-w-5xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-1">Users</h1>
        <p className="text-white/40 text-sm">View and manage all registered platform users.</p>
      </div>

      <div className="glass-card rounded-2xl overflow-hidden">
        {/* Table header */}
        <div className="hidden md:grid grid-cols-[1fr_160px_100px_120px] gap-4 px-5 py-3 border-b border-white/[0.06] text-xs font-medium text-white/30 uppercase tracking-widest">
          <span>User</span>
          <span>Account Type</span>
          <span>Status</span>
          <span>Role</span>
        </div>

        <div className="divide-y divide-white/[0.04]">
          {mockUsers.map(u => {
            const Icon = ROLE_ICONS[u.role] ?? User
            return (
              <div key={u.id} className="flex items-center gap-4 px-5 py-4 hover:bg-white/[0.02] transition-colors">
                <div className="md:grid md:grid-cols-[1fr_160px_100px_120px] md:gap-4 md:items-center flex-1 min-w-0">
                  {/* Name + email */}
                  <div className="flex items-center gap-3 min-w-0">
                    {u.avatar ? (
                      <img src={u.avatar} alt="" className="w-9 h-9 rounded-xl object-cover shrink-0" />
                    ) : (
                      <div className="w-9 h-9 rounded-xl bg-white/[0.06] flex items-center justify-center text-white/40 font-bold text-sm shrink-0">
                        {u.name[0]?.toUpperCase()}
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="font-medium text-white text-sm truncate">{u.name}</p>
                      <p className="text-xs text-white/40 truncate">{u.email}</p>
                    </div>
                  </div>

                  {/* Account type */}
                  <div className="hidden md:block">
                    <p className="text-sm text-white/60 capitalize">{u.accountType ?? '—'}</p>
                  </div>

                  {/* Status */}
                  <div className="hidden md:block">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs border ${
                      u.status === 'active'
                        ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                        : 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                    }`}>
                      {u.status ?? 'active'}
                    </span>
                  </div>

                  {/* Role */}
                  <div className="hidden md:block">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${ROLE_COLORS[u.role] ?? 'bg-white/[0.04] border-white/[0.08] text-white/40'}`}>
                      <Icon className="w-3 h-3" />
                      {ROLE_LABELS[u.role] ?? u.role}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <p className="text-xs text-white/20 mt-4">
        Showing {mockUsers.length} seed users. Live-registered users will also appear here once persisted to a database.
      </p>
    </div>
  )
}
