'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { getClientCompanyById, getClientUsersByCompany, updateClientCompanyTokens, createClientUser, ClientCompany, ClientUser } from '@/lib/admin-store'
import { Building, ArrowLeft, Plus, Save, AlertTriangle, Users, Coins, Mail, Shield } from 'lucide-react'

export default function ClientCompanyDetailPage() {
  const params = useParams()
  const id = params.id as string

  const [company, setCompany] = useState<ClientCompany | null>(null)
  const [users, setUsers] = useState<ClientUser[]>([])
  const [tokens, setTokens] = useState<number>(0)
  const [tokenSaved, setTokenSaved] = useState(false)
  
  // New user form state
  const [showNewUser, setShowNewUser] = useState(false)
  const [newUser, setNewUser] = useState({ name: '', email: '', role: '', mobile: '', region: '', country: '' })

  useEffect(() => {
    const comp = getClientCompanyById(id)
    if (comp) {
      setCompany(comp)
      setTokens(comp.tokens)
      setUsers(getClientUsersByCompany(id))
    }
  }, [id])

  if (!company) {
    return <div className="text-white/50 p-6">Loading or Company not found...</div>
  }

  const handleUpdateTokens = () => {
    if (updateClientCompanyTokens(id, tokens)) {
      setTokenSaved(true)
      setTimeout(() => setTokenSaved(false), 2000)
    }
  }

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newUser.name || !newUser.email) return
    const user = createClientUser({ ...newUser, companyId: id })
    setUsers([user, ...users])
    setShowNewUser(false)
    setNewUser({ name: '', email: '', role: '', mobile: '', region: '', country: '' })
  }

  const inputCls = 'w-full bg-transparent border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-[#0763d8]/40 outline-none transition-colors'

  return (
    <div className="max-w-5xl">
      <div className="mb-6">
        <Link href="/admin/clients" className="text-white/50 hover:text-white flex items-center gap-2 text-sm mb-4 transition-colors w-fit">
          <ArrowLeft className="w-4 h-4" /> Back to Clients
        </Link>
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">{company.name}</h1>
            <div className="flex flex-wrap items-center gap-2 text-sm text-white/50">
              {company.holding && <span className="flex items-center gap-1"><Building className="w-3 h-3" /> {company.holding}</span>}
              {company.regionalHub && <span>· {company.regionalHub}</span>}
              {company.region && <span>· {company.region}</span>}
              {company.country && <span>· {company.country}</span>}
            </div>
          </div>
          {/* Token panel */}
          <div className="flex bg-white/5 rounded-xl border border-white/10 p-4 items-center gap-5">
            <div>
              <p className="text-xs text-white/50 uppercase font-semibold flex items-center gap-1">
                <Coins className="w-3 h-3" /> Active Tokens
              </p>
              <div className="flex items-center gap-2 mt-1.5">
                <input 
                  type="number" 
                  value={tokens}
                  onChange={e => setTokens(parseInt(e.target.value) || 0)}
                  className="bg-black/20 border border-white/10 rounded px-2 py-1 text-white w-20 text-center font-bold focus:border-[#0763d8]/40 outline-none"
                />
                <button
                  onClick={handleUpdateTokens}
                  className={`p-1.5 rounded transition-colors ${tokenSaved ? 'bg-emerald-500 text-white' : 'bg-emerald-500/80 hover:bg-emerald-600 text-white'}`}
                >
                  <Save className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Token Exhaustion Banner */}
      {tokens <= 0 && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-red-300 font-semibold">All tokens have been exhausted</p>
            <p className="text-xs text-red-300/70 mt-1">
              This client has used all "Agency Search & Selection" credits. 
              <span className="italic"> Contact VA Consulting to extend your programme.</span>
              {' '}Add more tokens above to restore access.
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Users table */}
        <div className="lg:col-span-2 glass-card rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-white/[0.06] flex items-center justify-between">
            <h2 className="font-semibold text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-[#0763d8]" /> Client Users
            </h2>
            <button 
              onClick={() => setShowNewUser(!showNewUser)}
              className="text-sm border border-white/20 hover:bg-white/5 text-white px-3 py-1.5 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Add User
            </button>
          </div>
          
          {showNewUser && (
            <form onSubmit={handleAddUser} className="p-6 border-b border-white/[0.06] bg-white/[0.02]">
              <p className="text-xs text-white/40 mb-4">
                Creating a user account — on first login, the client will set their password and must complete their account information.
              </p>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs text-white/50 mb-1">Full Name *</label>
                  <input required value={newUser.name} onChange={e => setNewUser({...newUser, name: e.target.value})} className={inputCls} placeholder="Full name" />
                </div>
                <div>
                  <label className="block text-xs text-white/50 mb-1">Email *</label>
                  <input required type="email" value={newUser.email} onChange={e => setNewUser({...newUser, email: e.target.value})} className={inputCls} placeholder="Client email" />
                </div>
                <div>
                  <label className="block text-xs text-white/50 mb-1">Role / Job Title</label>
                  <input value={newUser.role} onChange={e => setNewUser({...newUser, role: e.target.value})} className={inputCls} placeholder="e.g. Marketing Director" />
                </div>
                <div>
                  <label className="block text-xs text-white/50 mb-1">Mobile</label>
                  <input value={newUser.mobile} onChange={e => setNewUser({...newUser, mobile: e.target.value})} className={inputCls} placeholder="+44..." />
                </div>
                <div>
                  <label className="block text-xs text-white/50 mb-1">Region</label>
                  <input value={newUser.region} onChange={e => setNewUser({...newUser, region: e.target.value})} className={inputCls} placeholder="e.g. Europe" />
                </div>
                <div>
                  <label className="block text-xs text-white/50 mb-1">Country</label>
                  <input value={newUser.country} onChange={e => setNewUser({...newUser, country: e.target.value})} className={inputCls} placeholder="e.g. Italy" />
                </div>
              </div>
              <div className="p-3 bg-amber-500/5 border border-amber-500/15 rounded-lg mb-4">
                <p className="text-xs text-amber-300/80 flex items-start gap-2">
                  <Shield className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  The "Company" field will be auto-populated as <strong className="text-amber-300">{company.name}</strong>. 
                  On first login, the user will be required to set their password and complete any missing account information.
                </p>
              </div>
              <div className="flex justify-end gap-2">
                 <button type="button" onClick={() => setShowNewUser(false)} className="px-4 py-2 rounded-lg text-sm font-medium text-white/60 hover:text-white transition-colors">Cancel</button>
                 <button type="submit" className="px-4 py-2 bg-white text-black font-semibold rounded-lg text-sm hover:bg-white/90 transition-colors">Create User</button>
              </div>
            </form>
          )}

          <table className="w-full text-left text-sm text-white/70">
            <thead className="bg-white/[0.02] border-b border-white/[0.06] text-xs uppercase text-white/40 font-semibold tracking-wider">
              <tr>
                <th className="px-6 py-4 font-medium">User</th>
                <th className="px-6 py-4 font-medium">Role</th>
                <th className="px-6 py-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {users.map(u => (
                <tr key={u.id} className="hover:bg-white/[0.02] transition-colors">
                   <td className="px-6 py-4">
                     <p className="text-white font-medium">{u.name}</p>
                     <p className="text-xs text-white/40">{u.email}</p>
                   </td>
                   <td className="px-6 py-4">{u.role || '-'}</td>
                   <td className="px-6 py-4">
                     <span className={`px-2 py-1 rounded text-xs font-semibold ${u.status === 'active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                       {u.status}
                     </span>
                   </td>
                </tr>
              ))}
              {users.length === 0 && !showNewUser && (
                <tr>
                  <td colSpan={3} className="px-6 py-8 text-center text-white/40">
                    No users registered under this company yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Sidebar info */}
        <div className="space-y-4">
          {/* Company details card */}
          <div className="glass-card rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-white mb-4">Company Details</h3>
            <div className="space-y-3 text-sm">
              {[
                { label: 'Holding', value: company.holding },
                { label: 'Regional Hub', value: company.regionalHub },
                { label: 'Region', value: company.region },
                { label: 'Local Company', value: company.localCompany },
                { label: 'Country', value: company.country },
                { label: 'Status', value: company.status },
                { label: 'Created', value: new Date(company.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) },
              ].filter(d => d.value).map(d => (
                <div key={d.label} className="flex items-center justify-between">
                  <span className="text-white/40">{d.label}</span>
                  <span className="text-white/80 capitalize">{d.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Access scoping note */}
          <div className="glass-card rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-white mb-2">Access Scope</h3>
            <p className="text-xs text-white/40 leading-relaxed">
              Tokens purchased by <strong className="text-white/60">{company.name}</strong> grant access only to users under this specific entity. 
              {company.holding && company.holding !== company.name && (
                <> Other entities under <strong className="text-white/60">{company.holding}</strong> must purchase tokens independently.</>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
