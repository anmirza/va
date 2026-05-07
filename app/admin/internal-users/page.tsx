'use client'

import { useState, useEffect } from 'react'
import { getVAInternalUsersFS, createVAInternalUserFS } from '@/lib/admin-firestore'
import type { VAInternalUser } from '@/lib/admin-store'
import { Plus, Shield, Search, User } from 'lucide-react'

export default function InternalUsersPage() {
  const [users, setUsers] = useState<VAInternalUser[]>([])
  const [query, setQuery] = useState('')
  const [showNew, setShowNew] = useState(false)
  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'admin' as 'super_admin'|'admin'|'analyst' })

  useEffect(() => {
    getVAInternalUsersFS().then(setUsers)
  }, [])

  const filtered = users.filter(u => u.name.toLowerCase().includes(query.toLowerCase()) || u.email.toLowerCase().includes(query.toLowerCase()))

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newUser.name || !newUser.email) return
    const user = await createVAInternalUserFS(newUser)
    setUsers([user, ...users])
    setShowNew(false)
    setNewUser({ name: '', email: '', role: 'admin' })
  }

  return (
    <div className="max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Internal Users</h1>
          <p className="text-white/40 text-sm">Super Admin Only: Manage VA Consulting staff accounts and roles.</p>
        </div>
        <button 
          onClick={() => setShowNew(!showNew)}
          className="px-4 py-2 bg-white text-black font-semibold rounded-lg text-sm hover:bg-white/90 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add User
        </button>
      </div>

      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/[0.06] flex items-center justify-between">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
            <input
              type="text"
              placeholder="Search internal users..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="bg-white/[0.03] border border-white/[0.06] rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-white/20 w-64 min-w-[200px]"
            />
          </div>
          <p className="text-sm text-white/50">{filtered.length} Internal Users</p>
        </div>
        
        {showNew && (
            <form onSubmit={handleAdd} className="p-6 border-b border-white/[0.06] bg-white/[0.02]">
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-xs text-white/50 mb-1">Full Name</label>
                  <input required value={newUser.name} onChange={e => setNewUser({...newUser, name: e.target.value})} className="w-full bg-transparent border border-white/10 rounded-lg px-3 py-2 text-white text-sm" />
                </div>
                <div>
                  <label className="block text-xs text-white/50 mb-1">Email (Corporate)</label>
                  <input required type="email" value={newUser.email} onChange={e => setNewUser({...newUser, email: e.target.value})} className="w-full bg-transparent border border-white/10 rounded-lg px-3 py-2 text-white text-sm" />
                </div>
                <div>
                  <label className="block text-xs text-white/50 mb-1">System Role</label>
                  <select value={newUser.role} onChange={e => setNewUser({...newUser, role: e.target.value as any})} className="w-full bg-[#02030E] border border-white/10 rounded-lg px-3 py-2 text-white text-sm">
                    <option value="super_admin">Super Admin</option>
                    <option value="admin">Admin</option>
                    <option value="analyst">Analyst</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                 <button type="button" onClick={() => setShowNew(false)} className="px-4 py-2 rounded-lg text-sm font-medium text-white/60 hover:text-white transition-colors">Cancel</button>
                 <button type="submit" className="px-4 py-2 bg-emerald-500 text-white font-semibold rounded-lg text-sm hover:bg-emerald-600 transition-colors">Create User</button>
              </div>
            </form>
        )}

        <table className="w-full text-left text-sm text-white/70">
          <thead className="bg-white/[0.02] border-b border-white/[0.06] text-xs uppercase text-white/40 font-semibold tracking-wider">
            <tr>
              <th className="px-6 py-4 font-medium">User Profile</th>
              <th className="px-6 py-4 font-medium">Role</th>
              <th className="px-6 py-4 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {filtered.map(u => (
              <tr key={u.id} className="hover:bg-white/[0.02] transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                      <User className="w-4 h-4 text-white/50" />
                    </div>
                    <div>
                      <p className="text-white font-medium">{u.name}</p>
                      <p className="text-[11px] text-white/40">{u.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold border ${u.role === 'super_admin' ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' : 'bg-[#0763d8]/10 border-[#0763d8]/20 text-[#0763d8]'}`}>
                    <Shield className="w-3 h-3" /> {u.role.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-6 py-4">
                     <span className={`px-2 py-1 rounded text-[10px] uppercase tracking-wider font-bold ${u.status === 'active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                       {u.status}
                     </span>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && !showNew && (
              <tr>
                <td colSpan={3} className="px-6 py-8 text-center text-white/40">
                  No internal users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
