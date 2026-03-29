'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'
import type { AgencyClient } from '@/lib/agency-client-types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { CompanyClientAvatar } from '@/components/company-client-avatar'
import { Trash2, Plus, Save, Upload, Loader2, ExternalLink } from 'lucide-react'

export function AgencyDirectoryListingEditor({ companyId }: { companyId: string }) {
  const { user } = useAuth()
  const [clients, setClients] = useState<AgencyClient[]>([])
  const [sectorText, setSectorText] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const r = await fetch(`/api/companies/${companyId}/listing`, { cache: 'no-store' })
      if (!r.ok) return
      const j = (await r.json()) as { agencyClients: AgencyClient[]; sectors: string[] }
      setClients(j.agencyClients)
      setSectorText(j.sectors.join(', '))
    } finally {
      setLoading(false)
    }
  }, [companyId])

  useEffect(() => {
    load()
  }, [load])

  const authHeaders = (): HeadersInit => ({
    'Content-Type': 'application/json',
    'x-user-id': user?.id ?? '',
  })

  const save = async () => {
    setSaving(true)
    setMsg(null)
    const sectors = sectorText
      .split(/[,;\n]/)
      .map(s => s.trim())
      .filter(Boolean)
    const body = {
      agencyClients: clients.map((c, i) => ({ ...c, sortOrder: i })),
      sectors,
    }
    try {
      const r = await fetch(`/api/companies/${companyId}/listing`, {
        method: 'PATCH',
        headers: authHeaders(),
        body: JSON.stringify(body),
      })
      if (!r.ok) {
        const e = (await r.json().catch(() => ({}))) as { error?: string }
        setMsg(e.error || 'Save failed')
        return
      }
      setMsg('Saved successfully.')
      await load()
    } catch {
      setMsg('Network error')
    } finally {
      setSaving(false)
    }
  }

  const uploadLogo = async (clientId: string, file: File) => {
    const fd = new FormData()
    fd.append('file', file)
    const r = await fetch(`/api/companies/${companyId}/listing/logo`, {
      method: 'POST',
      headers: { 'x-user-id': user?.id ?? '' },
      body: fd,
    })
    if (!r.ok) {
      setMsg('Logo upload failed (check type/size).')
      return
    }
    const { url } = (await r.json()) as { url: string }
    setClients(prev => prev.map(c => (c.id === clientId ? { ...c, logoUrl: url } : c)))
    setMsg(null)
  }

  const addClient = () => {
    setClients(prev => [
      ...prev,
      {
        id: crypto.randomUUID(),
        name: 'New client',
        industry: '',
        logoUrl: null,
        sortOrder: prev.length,
      },
    ])
  }

  const removeClient = (id: string) => setClients(prev => prev.filter(c => c.id !== id))

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-muted-foreground py-8">
        <Loader2 className="w-4 h-4 animate-spin" /> Loading listing…
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground max-w-2xl">
          Edits apply to your public directory profile: <strong>Clients &amp; sectors</strong>, client roster, and
          related sections. Save after uploading logos.
        </p>
        <Link
          href={`/directory/${companyId}`}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 text-sm text-[#0763d8] hover:underline"
        >
          View public profile <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="space-y-3">
        {clients.map(c => (
          <div
            key={c.id}
            className="flex flex-wrap items-start gap-3 p-4 rounded-xl border border-border bg-card"
          >
            <CompanyClientAvatar name={c.name || '?'} logoUrl={c.logoUrl} className="w-12 h-12 rounded-lg shrink-0" />
            <div className="flex-1 min-w-[200px] grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-muted-foreground block mb-1">Brand name</label>
                <Input
                  value={c.name}
                  onChange={e =>
                    setClients(prev => prev.map(x => (x.id === c.id ? { ...x, name: e.target.value } : x)))
                  }
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground block mb-1">Industry</label>
                <Input
                  value={c.industry ?? ''}
                  onChange={e =>
                    setClients(prev => prev.map(x => (x.id === c.id ? { ...x, industry: e.target.value } : x)))
                  }
                  placeholder="e.g. FMCG"
                />
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <label className="cursor-pointer inline-flex items-center gap-1.5 text-xs text-[#0763d8] font-medium hover:underline">
                <Upload className="w-3.5 h-3.5" />
                Logo
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/gif"
                  className="hidden"
                  onChange={e => {
                    const f = e.target.files?.[0]
                    if (f) void uploadLogo(c.id, f)
                    e.target.value = ''
                  }}
                />
              </label>
              <Button type="button" variant="ghost" size="sm" onClick={() => removeClient(c.id)} className="text-red-500">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Button type="button" variant="outline" onClick={addClient} className="gap-2">
        <Plus className="w-4 h-4" /> Add client
      </Button>

      <div>
        <label className="text-xs text-muted-foreground block mb-1">Sector focus (comma-separated)</label>
        <textarea
          className="w-full min-h-[88px] rounded-md border border-input bg-background px-3 py-2 text-sm"
          value={sectorText}
          onChange={e => setSectorText(e.target.value)}
          placeholder="Technology, Sports, Lifestyle, Entertainment"
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button
          type="button"
          onClick={() => void save()}
          disabled={saving}
          className="gap-2 bg-[#0763d8] hover:bg-[#0655b3] text-white"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save to directory
        </Button>
        {msg && <span className="text-sm text-muted-foreground">{msg}</span>}
      </div>
    </div>
  )
}
