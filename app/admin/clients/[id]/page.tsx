'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'
import {
  getClientCompanyByIdFS, getClientUsersByCompanyFS, createClientUserFS,
  updateClientCompanyFS, addClientCompanyTokensFS, suspendClientUserFS,
} from '@/lib/admin-firestore'
import type { ClientCompany, ClientUser } from '@/lib/admin-store'
import { toast } from 'sonner'
import {
  Building2, ArrowLeft, Plus, Save, AlertTriangle, Users, Coins,
  Shield, UserX, RefreshCw, Globe, MapPin, ChevronRight,
} from 'lucide-react'

export default function ClientCompanyDetailPage() {
  const params = useParams()
  const { user: adminUser } = useAuth()
  const id = params.id as string

  const [company, setCompany] = useState<ClientCompany | null>(null)
  const [users, setUsers] = useState<ClientUser[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Token management
  const [addTokensAmount, setAddTokensAmount] = useState(1)
  const [packageSize, setPackageSize] = useState<6 | 12>(6)
  const [isAddingTokens, setIsAddingTokens] = useState(false)

  // New user form
  const [showNewUser, setShowNewUser] = useState(false)
  const [newUser, setNewUser] = useState({ name: '', email: '', role: '', mobile: '', region: '', country: '' })
  const [isCreatingUser, setIsCreatingUser] = useState(false)

  const load = useCallback(async () => {
    setIsLoading(true)
    const [comp, compUsers] = await Promise.all([
      getClientCompanyByIdFS(id),
      getClientUsersByCompanyFS(id),
    ])
    setCompany(comp)
    setUsers(compUsers)
    if (comp) setPackageSize(comp.packageSize as 6 | 12 || 6)
    setIsLoading(false)
  }, [id])

  useEffect(() => { load() }, [load])

  const handleAddTokens = async () => {
    if (!company) return
    setIsAddingTokens(true)
    await addClientCompanyTokensFS(company.id, addTokensAmount)
    await updateClientCompanyFS(company.id, { packageSize })
    toast.success(`Added ${addTokensAmount} package${addTokensAmount > 1 ? 's' : ''} (${addTokensAmount * packageSize} agency slots)`)
    load()
    setIsAddingTokens(false)
  }

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newUser.name || !newUser.email) return
    setIsCreatingUser(true)
    try {
      const created = await createClientUserFS({ ...newUser, companyId: id }, adminUser?.id ?? 'admin')
      setUsers(prev => [created, ...prev])
      setShowNewUser(false)
      setNewUser({ name: '', email: '', role: '', mobile: '', region: '', country: '' })
      toast.success(`User "${created.name}" created. They will set their password on first login.`)
    } catch {
      toast.error('Failed to create user.')
    } finally {
      setIsCreatingUser(false)
    }
  }

  const handleSuspendUser = async (userId: string, userName: string) => {
    await suspendClientUserFS(userId)
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: 'suspended' as const } : u))
    toast.success(`${userName} has been suspended.`)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-[#0763d8] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!company) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <p className="text-white/50">Company not found.</p>
        <Link href="/admin/clients" className="text-[#0763d8] text-sm hover:underline">← Back to Client Companies</Link>
      </div>
    )
  }

  const tokensRemaining = company.tokens - (company.tokensUsed ?? 0)
  const isExhausted = tokensRemaining <= 0

  const inputCls = 'w-full h-9 bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#0763d8]/60'

  return (
    <div className="max-w-5xl">
      {/* Header */}
      <div className="mb-6">
        <Link href="/admin/clients" className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white mb-5 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Client Companies
        </Link>
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-[#0763d8]/10 border border-[#0763d8]/20 flex items-center justify-center">
                <Building2 className="w-5 h-5 text-[#0763d8]" />
              </div>
              <h1 className="text-2xl font-bold text-white">{company.name}</h1>
            </div>
            <div className="flex flex-wrap items-center gap-1.5 text-xs text-white/40 ml-13">
              {company.holdingCompany && <><span>{company.holdingCompany}</span><ChevronRight className="w-3 h-3" /></>}
              {company.regionalHub && <><span>{company.regionalHub}</span><ChevronRight className="w-3 h-3" /></>}
              {company.region && <><span>{company.region}</span><ChevronRight className="w-3 h-3" /></>}
              {company.country && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{company.country}</span>}
            </div>
          </div>
          <span className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${company.status === 'active' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
            {company.status}
          </span>
        </div>
      </div>

      {/* Credit exhaustion banner */}
      {isExhausted && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-red-300 font-semibold">All Agency Search &amp; Selection credits exhausted</p>
            <p className="text-xs text-red-300/70 mt-1 italic">
              "Contact VA Consulting to extend your programme." — Add more packages below to restore access.
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Users Management */}
        <div className="lg:col-span-2 space-y-5">
          <div className="glass-card rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-white/[0.06] flex items-center justify-between">
              <h2 className="font-semibold text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-[#0763d8]" /> Client Users
                <span className="text-xs text-white/30 font-normal">({users.length})</span>
              </h2>
              <button
                onClick={() => setShowNewUser(!showNewUser)}
                className="text-sm border border-white/[0.12] hover:border-[#0763d8]/40 text-white/60 hover:text-white px-3 py-1.5 rounded-lg flex items-center gap-2 transition-all"
              >
                <Plus className="w-3.5 h-3.5" /> Add User
              </button>
            </div>

            {showNewUser && (
              <form onSubmit={handleAddUser} className="p-6 border-b border-white/[0.06] bg-white/[0.02]">
                <div className="bg-amber-500/5 border border-amber-500/15 rounded-xl p-3 mb-4 flex gap-2">
                  <Shield className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-300/80 leading-relaxed">
                    Company will be auto-set to <strong className="text-amber-300">{company.name}</strong>. On first login, the user sets their password and must complete Region, Country, Role, and Mobile in Account Information.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div>
                    <label className="block text-xs text-white/50 mb-1">Full Name *</label>
                    <input required value={newUser.name} onChange={e => setNewUser({ ...newUser, name: e.target.value })} className={inputCls} placeholder="Full name" />
                  </div>
                  <div>
                    <label className="block text-xs text-white/50 mb-1">Corporate Email *</label>
                    <input required type="email" value={newUser.email} onChange={e => setNewUser({ ...newUser, email: e.target.value })} className={inputCls} placeholder="user@company.com" />
                  </div>
                  <div>
                    <label className="block text-xs text-white/50 mb-1">Role / Job Title</label>
                    <input value={newUser.role} onChange={e => setNewUser({ ...newUser, role: e.target.value })} className={inputCls} placeholder="e.g. Marketing Director" />
                  </div>
                  <div>
                    <label className="block text-xs text-white/50 mb-1">Mobile</label>
                    <input value={newUser.mobile} onChange={e => setNewUser({ ...newUser, mobile: e.target.value })} className={inputCls} placeholder="+44..." />
                  </div>
                  <div>
                    <label className="block text-xs text-white/50 mb-1">Region</label>
                    <input value={newUser.region} onChange={e => setNewUser({ ...newUser, region: e.target.value })} className={inputCls} placeholder="e.g. Southern Europe" />
                  </div>
                  <div>
                    <label className="block text-xs text-white/50 mb-1">Country</label>
                    <input value={newUser.country} onChange={e => setNewUser({ ...newUser, country: e.target.value })} className={inputCls} placeholder="e.g. Italy" />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <button type="button" onClick={() => setShowNewUser(false)} className="px-4 py-2 rounded-lg text-sm text-white/50 hover:text-white transition-colors">Cancel</button>
                  <button type="submit" disabled={isCreatingUser} className="px-4 py-2 bg-white text-black font-semibold rounded-lg text-sm hover:bg-white/90 transition-colors disabled:opacity-60 flex items-center gap-2">
                    {isCreatingUser ? <><span className="w-3 h-3 border-2 border-black/30 border-t-black rounded-full animate-spin" />Creating…</> : 'Create User'}
                  </button>
                </div>
              </form>
            )}

            <table className="w-full text-left text-sm">
              <thead className="bg-white/[0.02] border-b border-white/[0.06] text-xs uppercase text-white/30 font-semibold tracking-wider">
                <tr>
                  <th className="px-6 py-3 font-medium">User</th>
                  <th className="px-6 py-3 font-medium">Role</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium" />
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {users.map(u => (
                  <tr key={u.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-3.5">
                      <p className="text-white font-medium text-sm">{u.name}</p>
                      <p className="text-xs text-white/40">{u.email}</p>
                    </td>
                    <td className="px-6 py-3.5 text-white/60 text-sm">{u.role || '—'}</td>
                    <td className="px-6 py-3.5">
                      <span className={`px-2 py-0.5 rounded text-xs font-semibold ${u.status === 'active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                        {u.status}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-right">
                      {u.status === 'active' && (
                        <button onClick={() => handleSuspendUser(u.id, u.name)} className="text-xs text-white/30 hover:text-red-400 transition-colors flex items-center gap-1 ml-auto">
                          <UserX className="w-3.5 h-3.5" /> Suspend
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {users.length === 0 && !showNewUser && (
                  <tr><td colSpan={4} className="px-6 py-10 text-center text-white/30 text-sm">No users registered under this company yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Credits */}
          <div className="glass-card rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <Coins className="w-4 h-4 text-amber-400" /> Subscription Credits
            </h3>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-white/[0.03] rounded-xl p-3 text-center">
                <p className="text-2xl font-bold text-white">{company.tokens}</p>
                <p className="text-[10px] text-white/40 uppercase tracking-wider mt-0.5">Purchased</p>
              </div>
              <div className={`rounded-xl p-3 text-center ${isExhausted ? 'bg-red-500/10' : 'bg-emerald-500/10'}`}>
                <p className={`text-2xl font-bold ${isExhausted ? 'text-red-400' : 'text-emerald-400'}`}>{tokensRemaining}</p>
                <p className={`text-[10px] uppercase tracking-wider mt-0.5 ${isExhausted ? 'text-red-400/60' : 'text-emerald-400/60'}`}>Remaining</p>
              </div>
            </div>
            <p className="text-xs text-white/30 mb-3">Package size: <span className="text-white/60">{company.packageSize || 6} agencies/package</span></p>

            <div className="border-t border-white/[0.06] pt-4">
              <p className="text-xs text-white/40 mb-2 font-medium">Add packages</p>
              <div className="flex gap-2 mb-2">
                {([6, 12] as const).map(n => (
                  <button key={n} type="button" onClick={() => setPackageSize(n)}
                    className={`flex-1 h-8 rounded-lg text-xs font-semibold border transition-all ${packageSize === n ? 'bg-[#0763d8]/20 border-[#0763d8]/40 text-[#0763d8]' : 'bg-white/[0.03] border-white/[0.08] text-white/40'}`}>
                    {n}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <input type="number" min={1} max={100} value={addTokensAmount} onChange={e => setAddTokensAmount(Math.max(1, parseInt(e.target.value) || 1))}
                  className="flex-1 h-9 bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 text-sm text-white focus:outline-none focus:border-[#0763d8]/60 text-center" />
                <button onClick={handleAddTokens} disabled={isAddingTokens}
                  className="flex-1 h-9 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg text-xs transition-colors disabled:opacity-60 flex items-center justify-center gap-1">
                  {isAddingTokens ? <span className="w-3 h-3 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : <><Save className="w-3 h-3" />Add</>}
                </button>
              </div>
            </div>
          </div>

          {/* Company Details */}
          <div className="glass-card rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-white mb-3">Company Details</h3>
            <div className="space-y-2.5 text-xs">
              {[
                { label: 'Holding', value: company.holdingCompany || company.holding },
                { label: 'Regional Hub', value: company.regionalHub },
                { label: 'Region', value: company.region },
                { label: 'Local Company', value: company.localCompany },
                { label: 'Country', value: company.country },
                { label: 'Created', value: new Date(company.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) },
              ].map(d => d.value ? (
                <div key={d.label} className="flex items-center justify-between">
                  <span className="text-white/30">{d.label}</span>
                  <span className="text-white/70">{d.value}</span>
                </div>
              ) : null)}
            </div>
            {company.notes && (
              <div className="mt-3 pt-3 border-t border-white/[0.05]">
                <p className="text-[10px] uppercase text-white/30 tracking-wider mb-1">Notes</p>
                <p className="text-xs text-white/50 leading-relaxed">{company.notes}</p>
              </div>
            )}
          </div>

          {/* Access scope note */}
          <div className="glass-card rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
              <Globe className="w-4 h-4 text-white/40" /> Access Scope
            </h3>
            <p className="text-xs text-white/40 leading-relaxed">
              Credits purchased by <strong className="text-white/60">{company.name}</strong> are scoped exclusively to this entity.
              {company.holdingCompany && company.holdingCompany !== company.name && (
                <> Other entities under <strong className="text-white/60">{company.holdingCompany}</strong> must purchase independently.</>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
