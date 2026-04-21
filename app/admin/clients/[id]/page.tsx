'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { getClientCompanyById, getClientUsersByCompany, updateClientCompanyTokens, createClientUser, ClientCompany, ClientUser } from '@/lib/admin-store'
import { Building, Users, ArrowLeft, Plus, Save } from 'lucide-react'

export default function ClientCompanyDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const [company, setCompany] = useState<ClientCompany | null>(null)
  const [users, setUsers] = useState<ClientUser[]>([])
  const [tokens, setTokens] = useState<number>(0)
  
  // New user form state
  const [showNewUser, setShowNewUser] = useState(false)
  const [newUser, setNewUser] = useState({ name: '', email: '', role: '', mobile: '' })

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
      alert('Tokens updated successfully')
    }
  }

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newUser.name || !newUser.email) return
    const user = createClientUser({ ...newUser, companyId: id })
    setUsers([user, ...users])
    setShowNewUser(false)
    setNewUser({ name: '', email: '', role: '', mobile: '' })
  }

  return (
    <div className="max-w-5xl">
      <div className="mb-6">
        <Link href="/admin/clients" className="text-white/50 hover:text-white flex items-center gap-2 text-sm mb-4 transition-colors w-fit">
          <ArrowLeft className="w-4 h-4" /> Back to Clients
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">{company.name}</h1>
            <p className="text-white/50 text-sm">
              {company.holding && `Holding: ${company.holding}`}
              {company.region && ` | Region: ${company.region}`}
              {company.country && ` | Country: ${company.country}`}
            </p>
          </div>
          <div className="flex bg-white/5 rounded-xl border border-white/10 p-3 items-center gap-4">
            <div>
              <p className="text-xs text-white/50 uppercase font-semibold">Active Tokens</p>
              <div className="flex items-center gap-2 mt-1">
                <input 
                  type="number" 
                  value={tokens}
                  onChange={e => setTokens(parseInt(e.target.value) || 0)}
                  className="bg-black/20 border border-white/10 rounded px-2 py-1 text-white w-20 text-center font-bold"
                />
                <button onClick={handleUpdateTokens} className="bg-emerald-500 hover:bg-emerald-600 text-white p-1.5 rounded transition-colors">
                  <Save className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-white/[0.06] flex items-center justify-between">
            <h2 className="font-semibold text-white">Client Users</h2>
            <button 
              onClick={() => setShowNewUser(!showNewUser)}
              className="text-sm border border-white/20 hover:bg-white/5 text-white px-3 py-1.5 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Add User
            </button>
          </div>
          
          {showNewUser && (
            <form onSubmit={handleAddUser} className="p-6 border-b border-white/[0.06] bg-white/[0.02]">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs text-white/50 mb-1">Full Name</label>
                  <input required value={newUser.name} onChange={e => setNewUser({...newUser, name: e.target.value})} className="w-full bg-transparent border border-white/10 rounded-lg px-3 py-2 text-white text-sm" />
                </div>
                <div>
                  <label className="block text-xs text-white/50 mb-1">Email</label>
                  <input required type="email" value={newUser.email} onChange={e => setNewUser({...newUser, email: e.target.value})} className="w-full bg-transparent border border-white/10 rounded-lg px-3 py-2 text-white text-sm" />
                </div>
                <div>
                  <label className="block text-xs text-white/50 mb-1">Role / Job Title</label>
                  <input value={newUser.role} onChange={e => setNewUser({...newUser, role: e.target.value})} className="w-full bg-transparent border border-white/10 rounded-lg px-3 py-2 text-white text-sm" />
                </div>
                <div>
                  <label className="block text-xs text-white/50 mb-1">Mobile</label>
                  <input value={newUser.mobile} onChange={e => setNewUser({...newUser, mobile: e.target.value})} className="w-full bg-transparent border border-white/10 rounded-lg px-3 py-2 text-white text-sm" />
                </div>
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
      </div>
    </div>
  )
}
