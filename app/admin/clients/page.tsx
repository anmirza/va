'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getAllClientCompanies, ClientCompany } from '@/lib/admin-store'
import { Building, Plus, Search } from 'lucide-react'

export default function ClientsPage() {
  const [companies, setCompanies] = useState<ClientCompany[]>([])
  const [query, setQuery] = useState('')

  useEffect(() => {
    setCompanies(getAllClientCompanies())
  }, [])

  const filtered = companies.filter(c => c.name.toLowerCase().includes(query.toLowerCase()))

  return (
    <div className="max-w-5xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Client Companies</h1>
          <p className="text-white/50 text-sm">Manage the directory buyers, regions, and tokens.</p>
        </div>
        <Link href="/admin/clients/create" className="px-4 py-2 bg-white text-black font-semibold rounded-lg text-sm hover:bg-white/90 transition-colors flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Company
        </Link>
      </div>

      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/[0.06] flex items-center justify-between">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
            <input
              type="text"
              placeholder="Search companies..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="bg-white/[0.03] border border-white/[0.06] rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-white/20 w-64 min-w-[200px]"
            />
          </div>
          <p className="text-sm text-white/50">{filtered.length} Companies</p>
        </div>

        <table className="w-full text-left text-sm text-white/70">
          <thead className="bg-white/[0.02] border-b border-white/[0.06] text-xs uppercase text-white/40 font-semibold tracking-wider">
            <tr>
              <th className="px-6 py-4 font-medium">Company Level</th>
              <th className="px-6 py-4 font-medium">Hierarchy Focus</th>
              <th className="px-6 py-4 font-medium">Tokens</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
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
                      {comp.holding && <p className="text-xs text-white/40">{comp.holding}</p>}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  {comp.region && <p><span className="text-white/40">Region:</span> {comp.region}</p>}
                  {comp.country && <p><span className="text-white/40">Country:</span> {comp.country}</p>}
                  {!comp.region && !comp.country && <p className="text-white/40">Holding/Global Hub</p>}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${comp.tokens > 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                    {comp.tokens} Tokens
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <Link href={`/admin/clients/${comp.id}`} className="text-white hover:text-[#0763d8] font-medium text-sm transition-colors">
                    Manage →
                  </Link>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-white/40">
                  No client companies found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
