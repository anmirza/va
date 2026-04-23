'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClientCompany, getAllClientCompanies, ClientCompany } from '@/lib/admin-store'
import { ArrowLeft, Building, Plus, Save } from 'lucide-react'

const HIERARCHY_LEVELS = [
  'Holding Company',
  'Regional Hub',
  'Local Company',
]

export default function CreateClientCompanyPage() {
  const router = useRouter()

  const [name, setName] = useState('')
  const [level, setLevel] = useState('')
  const [holding, setHolding] = useState('')
  const [regionalHub, setRegionalHub] = useState('')
  const [region, setRegion] = useState('')
  const [localCompany, setLocalCompany] = useState('')
  const [country, setCountry] = useState('')
  const [tokens, setTokens] = useState(0)
  const [maxUsers, setMaxUsers] = useState(5)

  const existingCompanies = getAllClientCompanies()
  const holdingCompanies = existingCompanies.filter(c => !c.holding || c.holding === c.name)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    createClientCompany({
      name: name.trim(),
      holding: holding || undefined,
      regionalHub: regionalHub || undefined,
      region: region || undefined,
      localCompany: localCompany || undefined,
      country: country || undefined,
      tokens,
    })

    router.push('/admin/clients')
  }

  const inputCls = 'w-full bg-white/[0.04] border border-white/[0.1] rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/30 focus:border-[#0763d8]/50 outline-none transition-colors'
  const selectCls = 'w-full bg-[#02030E] border border-white/[0.1] rounded-xl px-4 py-3 text-white text-sm cursor-pointer outline-none transition-colors focus:border-[#0763d8]/50'

  return (
    <div className="max-w-3xl">
      <Link href="/admin/clients" className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Clients
      </Link>

      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-[#0763d8]/10 border border-[#0763d8]/20 flex items-center justify-center">
          <Building className="w-5 h-5 text-[#0763d8]" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">Add Client Company</h1>
          <p className="text-white/40 text-sm">Register a new client company with hierarchy and token allocation.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Company Identity */}
        <div className="glass-card rounded-2xl p-6">
          <h2 className="text-sm font-semibold text-white/80 mb-5 flex items-center gap-2">
            <span className="w-1 h-4 bg-[#0763d8] rounded-full" />
            Company Identity
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="sm:col-span-2">
              <label className="block text-xs text-white/50 mb-1.5 font-medium">Company Name *</label>
              <input
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Coca-Cola Italy"
                className={inputCls}
              />
            </div>
            <div>
              <label className="block text-xs text-white/50 mb-1.5 font-medium">Company Level *</label>
              <select value={level} onChange={e => setLevel(e.target.value)} className={selectCls}>
                <option value="">Select level</option>
                {HIERARCHY_LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-white/50 mb-1.5 font-medium">Country</label>
              <input
                value={country}
                onChange={e => setCountry(e.target.value)}
                placeholder="e.g. Italy"
                className={inputCls}
              />
            </div>
          </div>
        </div>

        {/* Corporate Hierarchy */}
        <div className="glass-card rounded-2xl p-6">
          <h2 className="text-sm font-semibold text-white/80 mb-2 flex items-center gap-2">
            <span className="w-1 h-4 bg-purple-500 rounded-full" />
            Corporate Hierarchy
          </h2>
          <p className="text-xs text-white/30 mb-5">
            Holding Company → Regional Hub → Region → Local Company → Country → Client
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs text-white/50 mb-1.5 font-medium">Parent / Holding Company</label>
              <input
                value={holding}
                onChange={e => setHolding(e.target.value)}
                placeholder="e.g. The Coca-Cola Company"
                className={inputCls}
                list="holding-suggestions"
              />
              {holdingCompanies.length > 0 && (
                <datalist id="holding-suggestions">
                  {holdingCompanies.map(c => <option key={c.id} value={c.name} />)}
                </datalist>
              )}
            </div>
            <div>
              <label className="block text-xs text-white/50 mb-1.5 font-medium">Regional Hub</label>
              <input
                value={regionalHub}
                onChange={e => setRegionalHub(e.target.value)}
                placeholder="e.g. Europe Hub"
                className={inputCls}
              />
            </div>
            <div>
              <label className="block text-xs text-white/50 mb-1.5 font-medium">Region</label>
              <input
                value={region}
                onChange={e => setRegion(e.target.value)}
                placeholder="e.g. Southern Europe"
                className={inputCls}
              />
            </div>
            <div>
              <label className="block text-xs text-white/50 mb-1.5 font-medium">Local Company Name</label>
              <input
                value={localCompany}
                onChange={e => setLocalCompany(e.target.value)}
                placeholder="e.g. Coca-Cola Italia S.r.l."
                className={inputCls}
              />
            </div>
          </div>

          {/* Visual hierarchy preview */}
          {(holding || name) && (
            <div className="mt-6 p-4 bg-white/[0.02] border border-white/[0.06] rounded-xl">
              <p className="text-[10px] uppercase font-bold text-white/40 tracking-wider mb-3">Hierarchy Preview</p>
              <div className="space-y-1 text-xs">
                {holding && (
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-purple-500/20 border border-purple-500/30" />
                    <span className="text-white/60">{holding}</span>
                    <span className="text-white/20 text-[10px]">HOLDING</span>
                  </div>
                )}
                {regionalHub && (
                  <div className="flex items-center gap-2 ml-5">
                    <div className="w-0.5 h-3 bg-white/10 -ml-[3px] mr-[5px]" />
                    <div className="w-3 h-3 rounded bg-blue-500/20 border border-blue-500/30" />
                    <span className="text-white/60">{regionalHub}</span>
                    <span className="text-white/20 text-[10px]">HUB</span>
                  </div>
                )}
                {region && (
                  <div className="flex items-center gap-2 ml-10">
                    <div className="w-0.5 h-3 bg-white/10 -ml-[3px] mr-[5px]" />
                    <div className="w-3 h-3 rounded bg-teal-500/20 border border-teal-500/30" />
                    <span className="text-white/60">{region}</span>
                    <span className="text-white/20 text-[10px]">REGION</span>
                  </div>
                )}
                {(localCompany || name) && (
                  <div className="flex items-center gap-2 ml-[60px]">
                    <div className="w-0.5 h-3 bg-white/10 -ml-[3px] mr-[5px]" />
                    <div className="w-3 h-3 rounded bg-emerald-500/20 border border-emerald-500/30" />
                    <span className="text-white font-medium">{localCompany || name}</span>
                    <span className="text-white/20 text-[10px]">LOCAL</span>
                  </div>
                )}
                {country && (
                  <div className="flex items-center gap-2 ml-[80px]">
                    <div className="w-0.5 h-3 bg-white/10 -ml-[3px] mr-[5px]" />
                    <div className="w-3 h-3 rounded bg-amber-500/20 border border-amber-500/30" />
                    <span className="text-white/60">{country}</span>
                    <span className="text-white/20 text-[10px]">COUNTRY</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Token Allocation */}
        <div className="glass-card rounded-2xl p-6">
          <h2 className="text-sm font-semibold text-white/80 mb-2 flex items-center gap-2">
            <span className="w-1 h-4 bg-emerald-500 rounded-full" />
            Token Allocation
          </h2>
          <p className="text-xs text-white/30 mb-5">
            Agency Search & Selection credits. Each token allows one search/selection package.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs text-white/50 mb-1.5 font-medium">Initial Tokens</label>
              <input
                type="number"
                min={0}
                value={tokens}
                onChange={e => setTokens(parseInt(e.target.value) || 0)}
                className={inputCls}
              />
              <p className="text-[10px] text-white/20 mt-1">e.g. 3 packages × 6 agencies = 18 tokens</p>
            </div>
            <div>
              <label className="block text-xs text-white/50 mb-1.5 font-medium">Max User Accounts</label>
              <input
                type="number"
                min={1}
                value={maxUsers}
                onChange={e => setMaxUsers(parseInt(e.target.value) || 1)}
                className={inputCls}
              />
              <p className="text-[10px] text-white/20 mt-1">How many user accounts this company can have</p>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-between">
          <Link href="/admin/clients" className="text-sm text-white/40 hover:text-white transition-colors">Cancel</Link>
          <button
            type="submit"
            disabled={!name.trim()}
            className="px-6 py-3 bg-white text-black font-semibold rounded-xl text-sm hover:bg-white/90 transition-colors flex items-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4" /> Create Company
          </button>
        </div>
      </form>
    </div>
  )
}
