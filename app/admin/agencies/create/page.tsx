'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { createOrg, createInvitation } from '@/lib/admin-store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Building2, Copy, Check, ArrowLeft, Link as LinkIcon } from 'lucide-react'
import Link from 'next/link'
import { Suspense } from 'react'

function CreateAgencyContent() {
  const { user } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()

  const [name, setName] = useState('')
  const [country, setCountry] = useState('')
  const [category, setCategory] = useState('')
  const [description, setDescription] = useState('')
  const [inviteEmail, setInviteEmail] = useState('')

  const [orgCreated, setOrgCreated] = useState(false)
  const [inviteLink, setInviteLink] = useState('')
  const [copied, setCopied] = useState(false)
  const [orgId, setOrgId] = useState('')

  const handleCreate = () => {
    if (!name.trim()) return
    const org = createOrg({ name, country, category, description, type: 'agency' }, user?.id ?? 'admin')
    setOrgId(org.id)
    setOrgCreated(true)
  }

  const handleGenerateInvite = () => {
    const inv = createInvitation(orgId, name, 'agency', user?.id ?? 'admin', inviteEmail || undefined)
    const url = `${window.location.origin}/signup/accept-invite?token=${inv.token}`
    setInviteLink(url)
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(inviteLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="max-w-xl">
      <Link href="/admin/agencies" className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Agencies
      </Link>

      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-[#0763d8]/10 border border-[#0763d8]/20 flex items-center justify-center">
          <Building2 className="w-5 h-5 text-[#0763d8]" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">Create Agency</h1>
          <p className="text-white/40 text-sm">Add a new agency and invite its moderator</p>
        </div>
      </div>

      {!orgCreated ? (
        <div className="glass-card rounded-2xl p-6 space-y-5">
          <div>
            <label className="block text-xs font-medium text-white/60 mb-1.5">Agency Name *</label>
            <Input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Creative Studio Ltd." className="h-10 bg-white/[0.04] border-white/[0.1] text-white placeholder:text-white/30 rounded-xl" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-white/60 mb-1.5">Country</label>
              <Input value={country} onChange={e => setCountry(e.target.value)} placeholder="e.g. United Kingdom" className="h-10 bg-white/[0.04] border-white/[0.1] text-white placeholder:text-white/30 rounded-xl" />
            </div>
            <div>
              <label className="block text-xs font-medium text-white/60 mb-1.5">Category</label>
              <Input value={category} onChange={e => setCategory(e.target.value)} placeholder="e.g. Full-service" className="h-10 bg-white/[0.04] border-white/[0.1] text-white placeholder:text-white/30 rounded-xl" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-white/60 mb-1.5">Description</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} placeholder="Brief description of the agency..." className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#0763d8]/50 resize-none" />
          </div>
          <Button onClick={handleCreate} disabled={!name.trim()} className="w-full h-10 bg-[#0763d8] hover:bg-[#0655b3] text-white rounded-xl">
            Create Agency
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-5 flex items-center gap-3">
            <Check className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <p className="font-medium text-white">{name} created successfully!</p>
              <p className="text-sm text-white/50">Now invite the first moderator to manage this agency.</p>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2">
              <LinkIcon className="w-4 h-4 text-[#0763d8]" />
              <h2 className="font-semibold text-white text-sm">Invite First Moderator</h2>
            </div>
            <p className="text-xs text-white/40">Generate an invite link to send to the person who will own and manage this agency profile.</p>
            <div>
              <label className="block text-xs font-medium text-white/60 mb-1.5">Moderator Email (optional)</label>
              <Input value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} type="email" placeholder="email@agency.com" className="h-10 bg-white/[0.04] border-white/[0.1] text-white placeholder:text-white/30 rounded-xl" />
            </div>

            {!inviteLink ? (
              <Button onClick={handleGenerateInvite} className="w-full h-10 bg-[#0763d8] hover:bg-[#0655b3] text-white rounded-xl">
                Generate Invite Link
              </Button>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center gap-2 bg-white/[0.04] border border-white/[0.1] rounded-xl px-3 py-2.5">
                  <p className="flex-1 text-xs text-white/60 truncate font-mono">{inviteLink}</p>
                  <button onClick={handleCopy} className={`shrink-0 transition-colors ${copied ? 'text-emerald-400' : 'text-white/40 hover:text-white'}`}>
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-xs text-white/30">Share this link with the agency owner. They must sign up using a corporate email.</p>
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <Button onClick={() => router.push('/admin/agencies')} variant="outline" className="flex-1 h-10 border-white/[0.1] text-white/60 hover:text-white rounded-xl">
              Back to Agencies
            </Button>
            <Button onClick={() => { setOrgCreated(false); setName(''); setCountry(''); setCategory(''); setDescription(''); setInviteLink(''); setInviteEmail('') }} className="flex-1 h-10 bg-[#0763d8]/20 hover:bg-[#0763d8]/30 text-[#0763d8] rounded-xl">
              Create Another
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export default function CreateAgencyPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#02030E]" />}>
      <CreateAgencyContent />
    </Suspense>
  )
}
