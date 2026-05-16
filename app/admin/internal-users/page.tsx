'use client'

import { useState, useEffect } from 'react'
import { getVAInternalUsersFS, createVAInternalUserFS, updateVAInternalUserStatusFS, deleteVAInternalUserFS } from '@/lib/admin-firestore'
import type { VAInternalUser } from '@/lib/admin-store'
import { useAuth } from '@/lib/auth-context'
import { Plus, Search, User, ShieldOff, MoreHorizontal, PowerOff, Power, Trash2 } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import toast from 'react-hot-toast'

const ROLE_OPTIONS = [
  { value: 'super_admin', label: 'Super Admin' },
  { value: 'admin', label: 'Admin' },
  { value: 'analyst', label: 'Analyst' },
  { value: 'reviewer', label: 'Reviewer' },
  { value: 'editor', label: 'Editor' },
  { value: 'viewer', label: 'Viewer' },
]

const ROLE_COLORS: Record<string, string> = {
  super_admin: 'bg-red-500/10 border-red-500/20 text-red-400',
  admin: 'bg-[#0763d8]/10 border-[#0763d8]/20 text-[#0763d8]',
  analyst: 'bg-purple-500/10 border-purple-500/20 text-purple-400',
  reviewer: 'bg-teal-500/10 border-teal-500/20 text-teal-400',
  editor: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
  viewer: 'bg-white/[0.06] border-white/[0.1] text-white/50',
}

const ROLE_LABELS: Record<string, string> = {
  super_admin: 'Super Admin',
  admin: 'Admin',
  analyst: 'Analyst',
  reviewer: 'Reviewer',
  editor: 'Editor',
  viewer: 'Viewer',
}

type NewUser = {
  name: string
  email: string
  role: 'super_admin' | 'admin' | 'analyst' | 'reviewer' | 'editor' | 'viewer'
  department: string
  notes: string
}

const DEFAULT_USER: NewUser = { name: '', email: '', role: 'admin', department: '', notes: '' }

export default function InternalStaffPage() {
  const { user: currentUser, isAdmin, isSuperAdmin } = useAuth()
  const [users, setUsers] = useState<VAInternalUser[]>([])
  const [query, setQuery] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [newUser, setNewUser] = useState<NewUser>(DEFAULT_USER)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [menuOpen, setMenuOpen] = useState<string | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<VAInternalUser | null>(null)

  useEffect(() => {
    if (isAdmin) getVAInternalUsersFS().then(setUsers)
  }, [isAdmin])



  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(query.toLowerCase()) ||
    u.email.toLowerCase().includes(query.toLowerCase())
  )

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newUser.name || !newUser.email) return
    setIsSubmitting(true)
    try {
      const user = await createVAInternalUserFS({
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        department: newUser.department || undefined,
        notes: newUser.notes || undefined,
      })
      setUsers([user, ...users])
      setShowModal(false)
      setNewUser(DEFAULT_USER)
      toast.success(`${newUser.name} added successfully.`)
    } catch {
      toast.error('Failed to add staff member.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleToggleStatus = async (u: VAInternalUser) => {
    const next = u.status === 'active' ? 'inactive' : 'active'
    try {
      await updateVAInternalUserStatusFS(u.id, next)
      setUsers(prev => prev.map(x => x.id === u.id ? { ...x, status: next } : x))
      toast.success(`${u.name} ${next === 'active' ? 'activated' : 'deactivated'}.`)
    } catch {
      toast.error('Failed to update status.')
    }
  }

  const handleDelete = async () => {
    if (!confirmDelete) return
    try {
      await deleteVAInternalUserFS(confirmDelete.id)
      setUsers(prev => prev.filter(x => x.id !== confirmDelete.id))
      toast.success(`${confirmDelete.name} removed.`)
    } catch {
      toast.error('Failed to delete staff member.')
    } finally {
      setConfirmDelete(null)
    }
  }

  const canAct = (target: VAInternalUser) => {
    if (target.id === currentUser?.id) return false
    if (target.role === 'super_admin' && !isSuperAdmin) return false
    return true
  }

  const inputCls = "w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#0763d8]/60 transition-colors"
  const selectCls = "w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#0763d8]/60 transition-colors"
  const labelCls = "block text-xs font-medium text-white/50 mb-1.5"

  if (!isAdmin) {
    return (
      <div className="max-w-5xl flex flex-col items-center justify-center py-24 text-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
          <ShieldOff className="w-7 h-7 text-red-400" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white mb-1">Access Restricted</h2>
          <p className="text-white/40 text-sm">This page is only accessible to Admin and Super Admin roles.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Internal Staff</h1>
          <p className="text-white/40 text-sm">Admin &amp; Super Admin: Manage VA Consulting staff accounts and roles.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-white text-black font-semibold rounded-lg text-sm hover:bg-white/90 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Staff Member
        </button>
      </div>

      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/[0.06] flex items-center justify-between">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
            <input
              type="text"
              placeholder="Search internal staff..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="bg-white/[0.03] border border-white/[0.06] rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-white/20 w-64 min-w-[200px]"
            />
          </div>
          <p className="text-sm text-white/50">{filtered.length} staff member{filtered.length !== 1 ? 's' : ''}</p>
        </div>

        <table className="w-full text-left text-sm text-white/70">
          <thead className="bg-white/[0.02] border-b border-white/[0.06] text-xs uppercase text-white/40 font-semibold tracking-wider">
            <tr>
              <th className="px-6 py-4 font-medium">Staff Member</th>
              <th className="px-6 py-4 font-medium">Role</th>
              <th className="px-6 py-4 font-medium">Department</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium w-12"></th>
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
                      <p className="font-medium text-white">{u.name}</p>
                      <p className="text-xs text-white/40">{u.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${ROLE_COLORS[u.role] ?? 'bg-white/[0.06] border-white/[0.1] text-white/50'}`}>
                    {ROLE_LABELS[u.role] ?? u.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-white/40 text-xs">{(u as any).department || '—'}</td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                    u.status === 'active'
                      ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                      : 'bg-white/[0.04] border-white/[0.08] text-white/30'
                  }`}>
                    {u.status === 'active' ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {canAct(u) && (
                    <div className="relative">
                      <button
                        onClick={() => setMenuOpen(menuOpen === u.id ? null : u.id)}
                        className="p-1.5 rounded-lg text-white/30 hover:text-white hover:bg-white/[0.06] transition-colors"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                      {menuOpen === u.id && (
                        <>
                          {/* Backdrop — clicking outside closes the menu */}
                          <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(null)} />
                          <div className="absolute right-0 top-8 z-20 w-44 bg-[#0d0e1f] border border-white/[0.08] rounded-xl shadow-xl overflow-hidden">
                            <button
                              onClick={() => { setMenuOpen(null); handleToggleStatus(u) }}
                              className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-white/70 hover:bg-white/[0.04] hover:text-white transition-colors"
                            >
                              {u.status === 'active'
                                ? <><PowerOff className="w-4 h-4 text-amber-400" /> Deactivate</>
                                : <><Power className="w-4 h-4 text-emerald-400" /> Activate</>
                              }
                            </button>
                            <div className="border-t border-white/[0.06]" />
                            <button
                              onClick={() => { setMenuOpen(null); setConfirmDelete(u) }}
                              className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/[0.06] transition-colors"
                            >
                              <Trash2 className="w-4 h-4" /> Delete
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-white/30 text-sm">
                  {query ? 'No staff members match your search.' : 'No internal staff added yet.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add Staff Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="bg-[#0a0b1a] border border-white/[0.08] text-white max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-white text-lg font-bold">Add Staff Member</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAdd} className="space-y-4 mt-2">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Full Name <span className="text-red-400">*</span></label>
                <input required value={newUser.name} onChange={e => setNewUser({...newUser, name: e.target.value})}
                  placeholder="e.g. Jane Smith" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Corporate Email <span className="text-red-400">*</span></label>
                <input required type="email" value={newUser.email} onChange={e => setNewUser({...newUser, email: e.target.value})}
                  placeholder="jane@company.com" className={inputCls} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>System Role</label>
                <select value={newUser.role} onChange={e => setNewUser({...newUser, role: e.target.value as NewUser['role']})} className={selectCls}>
                  {ROLE_OPTIONS.map(r => (
                    <option key={r.value} value={r.value} className="bg-[#0a0b1a]">{r.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelCls}>Department / Function</label>
                <input value={newUser.department} onChange={e => setNewUser({...newUser, department: e.target.value})}
                  placeholder="e.g. Operations" className={inputCls} />
              </div>
            </div>
            <div>
              <label className={labelCls}>Internal Notes (optional)</label>
              <textarea value={newUser.notes} onChange={e => setNewUser({...newUser, notes: e.target.value})}
                rows={3} placeholder="Any notes about this staff member..."
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#0763d8]/60 resize-none" />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-lg text-sm text-white/50 hover:text-white transition-colors">Cancel</button>
              <button type="submit" disabled={isSubmitting}
                className="px-5 py-2 bg-white text-black font-semibold rounded-lg text-sm hover:bg-white/90 transition-colors disabled:opacity-60 flex items-center gap-2">
                {isSubmitting ? <><span className="w-3.5 h-3.5 border-2 border-black/30 border-t-black rounded-full animate-spin" /> Adding...</> : 'Add Staff Member'}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={!!confirmDelete} onOpenChange={() => setConfirmDelete(null)}>
        <DialogContent className="bg-[#0a0b1a] border border-white/[0.08] text-white max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-white text-lg font-bold">Delete Staff Member</DialogTitle>
          </DialogHeader>
          <div className="mt-2 space-y-4">
            <p className="text-sm text-white/60">
              Are you sure you want to permanently delete{' '}
              <span className="text-white font-medium">{confirmDelete?.name}</span>?
              This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setConfirmDelete(null)}
                className="px-4 py-2 rounded-lg text-sm text-white/50 hover:text-white transition-colors">
                Cancel
              </button>
              <button onClick={handleDelete}
                className="px-5 py-2 bg-red-500 text-white font-semibold rounded-lg text-sm hover:bg-red-600 transition-colors flex items-center gap-2">
                <Trash2 className="w-4 h-4" /> Delete
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
