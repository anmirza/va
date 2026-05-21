'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { getAllClientCompaniesFS, updateClientCompanyFS, deleteClientCompanyFS } from '@/lib/admin-firestore'
import type { ClientCompany } from '@/lib/admin-store'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import toast from 'react-hot-toast'
import {
  Building, Plus, Search, Coins,
  MoreHorizontal, Pencil, Power, PowerOff, Trash2, ChevronRight,
} from 'lucide-react'

export default function ClientsPage() {
  const router = useRouter()
  const { isSuperAdmin, isAdmin } = useAuth()
  const [companies, setCompanies] = useState<ClientCompany[]>([])
  const [query, setQuery] = useState('')
  const [viewMode, setViewMode] = useState<'table' | 'hierarchy'>('table')
  const [isLoading, setIsLoading] = useState(true)
  const [menuOpen, setMenuOpen] = useState<string | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<ClientCompany | null>(null)

  const load = async () => {
    setIsLoading(true)
    const data = await getAllClientCompaniesFS()
    setCompanies(data)
    setIsLoading(false)
  }

  useEffect(() => { load() }, [])

  const filtered = companies.filter(c =>
    !query ||
    c.name.toLowerCase().includes(query.toLowerCase()) ||
    (c.holdingCompany || c.holding || '').toLowerCase().includes(query.toLowerCase()) ||
    (c.country || '').toLowerCase().includes(query.toLowerCase()) ||
    (c.region || '').toLowerCase().includes(query.toLowerCase())
  )

  const handleToggleStatus = async (comp: ClientCompany) => {
    const next: 'active' | 'suspended' = comp.status === 'active' ? 'suspended' : 'active'
    try {
      await updateClientCompanyFS(comp.id, { status: next })
      setCompanies(prev => prev.map(c => c.id === comp.id ? { ...c, status: next } : c))
      toast.success(`${comp.name} ${next === 'active' ? 'activated' : 'suspended'}.`)
    } catch {
      toast.error('Failed to update status.')
    }
  }

  const handleDelete = async () => {
    if (!confirmDelete) return
    try {
      await deleteClientCompanyFS(confirmDelete.id)
      setCompanies(prev => prev.filter(c => c.id !== confirmDelete.id))
      toast.success(`"${confirmDelete.name}" deleted.`)
    } catch {
      toast.error('Failed to delete company.')
    } finally {
      setConfirmDelete(null)
    }
  }

  // Group by holding company for hierarchy view
  const holdingGroups = useMemo(() => {
    const groups: Record<string, ClientCompany[]> = {}
    filtered.forEach(c => {
      const key = c.holdingCompany || c.holding || c.name
      if (!groups[key]) groups[key] = []
      groups[key].push(c)
    })
    return groups
  }, [filtered])

  return (
    <div className="max-w-5xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Client Management</h1>
          <p className="text-white/50 text-sm">Manage directory buyers, corporate hierarchy, regions, and token allocations.</p>
        </div>
        <Link href="/admin/clients/create" className="px-4 py-2.5 bg-white text-black font-semibold rounded-xl text-sm hover:bg-white/90 transition-colors flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Client Company
        </Link>
      </div>

      <div className="glass-card rounded-2xl">
        <div className="px-6 py-4 border-b border-white/[0.06] flex flex-wrap items-center justify-between gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
            <input
              type="text"
              placeholder="Search companies, holdings, countries..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="bg-white/[0.03] border border-white/[0.06] rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-white/20 w-72 min-w-[200px]"
            />
          </div>
          <div className="flex items-center gap-3">
            <p className="text-sm text-white/50">{filtered.length} Companies</p>
            <div className="flex items-center bg-white/[0.04] rounded-lg border border-white/[0.06] p-0.5">
              <button
                onClick={() => setViewMode('table')}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${viewMode === 'table' ? 'bg-[#0763d8]/20 text-[#0763d8]' : 'text-white/40 hover:text-white/60'}`}
              >Table</button>
              <button
                onClick={() => setViewMode('hierarchy')}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${viewMode === 'hierarchy' ? 'bg-[#0763d8]/20 text-[#0763d8]' : 'text-white/40 hover:text-white/60'}`}
              >Hierarchy</button>
            </div>
          </div>
        </div>

        {viewMode === 'table' ? (
          /* ── Table View ── */
          <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-white/70">
            <thead className="bg-white/[0.02] border-b border-white/[0.06] text-xs uppercase text-white/40 font-semibold tracking-wider">
              <tr>
                <th className="px-6 py-4 font-medium">Company</th>
                <th className="px-6 py-4 font-medium">Hierarchy</th>
                <th className="px-6 py-4 font-medium">Country</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Tokens</th>
                <th className="px-6 py-4 font-medium w-12"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {filtered.map(comp => (
                <tr key={comp.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#0763d8]/20 text-[#0763d8] flex items-center justify-center shrink-0">
                        <Building className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-white font-medium">{comp.name}</p>
                        {comp.holding && comp.holding !== comp.name && (
                          <p className="text-xs text-white/40 flex items-center gap-1">
                            <ChevronRight className="w-3 h-3" />{comp.holding}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {comp.holding && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-purple-500/10 text-purple-400 border border-purple-500/20">Holding</span>
                      )}
                      {comp.regionalHub && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">{comp.regionalHub}</span>
                      )}
                      {comp.region && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-teal-500/10 text-teal-400 border border-teal-500/20">{comp.region}</span>
                      )}
                      {!comp.holding && !comp.region && !comp.regionalHub && (
                        <span className="text-white/30 text-xs">—</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-white/60">{comp.country || '—'}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                      comp.status === 'active'
                        ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                        : 'bg-red-500/10 border-red-500/20 text-red-400'
                    }`}>
                      {comp.status === 'active' ? 'Active' : 'Suspended'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${comp.tokens > 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                      {comp.tokens} {comp.tokens === 1 ? 'Token' : 'Tokens'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="relative">
                      <button
                        onClick={() => setMenuOpen(menuOpen === comp.id ? null : comp.id)}
                        className="p-1.5 rounded-lg text-white/30 hover:text-white hover:bg-white/[0.06] transition-colors"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                      {menuOpen === comp.id && (
                        <>
                          <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(null)} />
                          <div className="absolute right-0 top-8 z-20 w-48 bg-[#0d0e1f] border border-white/[0.08] rounded-xl shadow-xl overflow-hidden">
                            <Link
                              href={`/admin/clients/${comp.id}`}
                              onClick={() => setMenuOpen(null)}
                              className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-white/70 hover:bg-white/[0.04] hover:text-white transition-colors"
                            >
                              <Building className="w-4 h-4 text-[#0763d8]" /> Manage
                            </Link>
                            <Link
                              href={`/admin/clients/create?editId=${comp.id}`}
                              onClick={() => setMenuOpen(null)}
                              className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-white/70 hover:bg-white/[0.04] hover:text-white transition-colors"
                            >
                              <Pencil className="w-4 h-4 text-white/40" /> Edit
                            </Link>
                            <div className="border-t border-white/[0.06]" />
                            <button
                              onClick={() => { setMenuOpen(null); handleToggleStatus(comp) }}
                              className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-white/70 hover:bg-white/[0.04] hover:text-white transition-colors"
                            >
                              {comp.status === 'active'
                                ? <><PowerOff className="w-4 h-4 text-amber-400" /> Suspend</>
                                : <><Power className="w-4 h-4 text-emerald-400" /> Activate</>
                              }
                            </button>
                            <div className="border-t border-white/[0.06]" />
                            <button
                              onClick={() => { setMenuOpen(null); setConfirmDelete(comp) }}
                              className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/[0.06] transition-colors"
                            >
                              <Trash2 className="w-4 h-4" /> Delete
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-white/40">
                    No client companies found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          </div>
        ) : (
          /* ── Hierarchy View ── */
          <div className="p-6 space-y-4">
            {Object.keys(holdingGroups).length === 0 ? (
              <p className="text-center text-white/40 text-sm py-8">No client companies found.</p>
            ) : (
              Object.entries(holdingGroups).map(([holdingName, comps]) => (
                <div key={holdingName} className="bg-white/[0.02] border border-white/[0.06] rounded-xl overflow-hidden">
                  {/* Holding header */}
                  <div className="px-5 py-3 border-b border-white/[0.06] bg-white/[0.01] flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center shrink-0">
                      <Building className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white">{holdingName}</p>
                      <p className="text-[10px] text-white/30 uppercase tracking-wider">Holding Company · {comps.length} entit{comps.length === 1 ? 'y' : 'ies'}</p>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-white/40">
                      <span className="flex items-center gap-1">
                        <Coins className="w-3 h-3" />
                        {comps.reduce((sum, c) => sum + c.tokens, 0)} total tokens
                      </span>
                    </div>
                  </div>

                  {/* Child companies */}
                  <div className="divide-y divide-white/[0.04]">
                    {comps.map((comp, idx) => (
                      <div key={comp.id} className="flex items-center gap-4 px-5 py-3 hover:bg-white/[0.02] transition-colors">
                        {/* Indent based on hierarchy depth */}
                        <div className={`flex items-center gap-2 ${comp.region || comp.regionalHub ? 'ml-6' : comp.holding && comp.holding !== comp.name ? 'ml-3' : ''}`}>
                          <div className="w-0.5 h-6 bg-white/10 shrink-0" />
                          <div className={`w-6 h-6 rounded flex items-center justify-center shrink-0 ${
                            comp.country ? 'bg-amber-500/10 text-amber-400' : 
                            comp.region ? 'bg-teal-500/10 text-teal-400' : 
                            'bg-blue-500/10 text-blue-400'
                          }`}>
                            <Building className="w-3 h-3" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-white font-medium">{comp.name}</p>
                          <div className="flex items-center gap-2 text-[10px] text-white/30">
                            {comp.region && <span>{comp.region}</span>}
                            {comp.country && <span>· {comp.country}</span>}
                          </div>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${comp.tokens > 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                          {comp.tokens}
                        </span>
                        <Link href={`/admin/clients/${comp.id}`} className="text-xs text-white/40 hover:text-[#0763d8] transition-colors font-medium">
                          Manage →
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <Dialog open={!!confirmDelete} onOpenChange={() => setConfirmDelete(null)}>
        <DialogContent className="bg-[#0a0b1a] border border-white/[0.08] text-white max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-white text-lg font-bold">Delete Client Company</DialogTitle>
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
