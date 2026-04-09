'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'
import { AuthGuard } from '@/components/auth-guard'
import { Header } from '@/components/header'
import {
  getMembersByOrg, addMember, updateMemberRole, removeMember,
  createInvitation, OrgMember, getOrgById,
} from '@/lib/admin-store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Users, Plus, Copy, Check, Shield, User,
  Trash2, ChevronRight, ArrowLeft, Link as LinkIcon,
} from 'lucide-react'

function TeamContent() {
  const { user, isModerator } = useAuth()
  const [members, setMembers] = useState<OrgMember[]>([])
  const [orgName, setOrgName] = useState('')
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteLink, setInviteLink] = useState('')
  const [copied, setCopied] = useState(false)
  const [showInvite, setShowInvite] = useState(false)

  const orgId = user?.orgId ?? ''

  const load = () => {
    if (!orgId) return
    setMembers(getMembersByOrg(orgId))
    const org = getOrgById(orgId)
    if (org) setOrgName(org.name)
  }

  useEffect(() => { load() }, [orgId])

  const handleGenerateInvite = () => {
    if (!orgId || !user) return
    const type = (getOrgById(orgId)?.type) ?? 'agency'
    const inv = createInvitation(orgId, orgName, type, user.id, inviteEmail || undefined)
    const url = `${window.location.origin}/signup/accept-invite?token=${inv.token}`
    setInviteLink(url)
    setInviteEmail('')
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(inviteLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleToggleRole = (member: OrgMember) => {
    const newRole = member.orgRole === 'moderator' ? 'user' : 'moderator'
    updateMemberRole(member.id, newRole)
    load()
  }

  const handleRemove = (member: OrgMember) => {
    if (!confirm(`Remove ${member.name} from your organisation?`)) return
    removeMember(member.id)
    load()
  }

  if (!user?.orgId) {
    return (
      <div className="min-h-screen bg-[#02030E] flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center p-8 text-center">
          <div>
            <Users className="w-12 h-12 text-white/20 mx-auto mb-4" />
            <p className="text-white/60 font-medium mb-2">You are not a member of any organisation</p>
            <p className="text-white/30 text-sm mb-4">Register or join an agency or production company to manage team members.</p>
            <Link href="/dashboard/vendor">
              <Button variant="outline" className="border-white/[0.12] text-white/70 hover:text-white">
                ← Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (!isModerator && user?.orgRole !== 'moderator') {
    return (
      <div className="min-h-screen bg-[#02030E] flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center p-8 text-center">
          <div>
            <Shield className="w-12 h-12 text-white/20 mx-auto mb-4" />
            <p className="text-white/60 font-medium mb-2">Access Restricted</p>
            <p className="text-white/30 text-sm mb-4">Only Moderators can manage team members.</p>
            <Link href="/dashboard/vendor">
              <Button variant="outline" className="border-white/[0.12] text-white/70 hover:text-white">← Back</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#02030E] flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Header */}
        <div className="border-b border-white/[0.06] px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-3xl mx-auto">
            <Link href="/dashboard/vendor" className="text-sm text-white/40 hover:text-white mb-3 flex items-center gap-1 transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
            </Link>
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div>
                <h1 className="text-2xl font-bold text-white">Team Management</h1>
                <p className="text-white/50 text-sm mt-1">{orgName || 'Your Organisation'}</p>
              </div>
              <Button
                onClick={() => setShowInvite(!showInvite)}
                className="h-10 bg-[#0763d8] hover:bg-[#0655b3] text-white rounded-xl gap-2"
              >
                <Plus className="w-4 h-4" /> Invite Member
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

          {/* Invite panel */}
          {showInvite && (
            <div className="glass-card rounded-2xl p-5 border-[#0763d8]/20 space-y-4">
              <div className="flex items-center gap-2">
                <LinkIcon className="w-4 h-4 text-[#0763d8]" />
                <h2 className="font-semibold text-white text-sm">Invite Team Member</h2>
              </div>
              <p className="text-xs text-white/40">Generate a link for the new team member. They must sign up with a corporate email.</p>
              <div className="flex gap-2">
                <Input
                  value={inviteEmail}
                  onChange={e => setInviteEmail(e.target.value)}
                  type="email"
                  placeholder="email@company.com (optional)"
                  className="flex-1 h-10 bg-white/[0.04] border-white/[0.1] text-white placeholder:text-white/30 rounded-xl"
                />
                <Button onClick={handleGenerateInvite} className="h-10 bg-[#0763d8] hover:bg-[#0655b3] text-white rounded-xl px-4">
                  Generate
                </Button>
              </div>
              {inviteLink && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 bg-white/[0.04] border border-white/[0.1] rounded-xl px-3 py-2.5">
                    <p className="flex-1 text-xs text-white/60 truncate font-mono">{inviteLink}</p>
                    <button onClick={handleCopy} className={`shrink-0 transition-colors ${copied ? 'text-emerald-400' : 'text-white/40 hover:text-white'}`}>
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-xs text-white/30">This link can be used once. The invited person will join as a standard team member.</p>
                </div>
              )}
            </div>
          )}

          {/* Members list */}
          <div className="glass-card rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
              <h2 className="font-semibold text-white text-sm">Team Members</h2>
              <span className="text-xs text-white/30">{members.length} member{members.length !== 1 ? 's' : ''}</span>
            </div>

            {members.length === 0 ? (
              <div className="p-10 text-center">
                <Users className="w-8 h-8 text-white/20 mx-auto mb-2" />
                <p className="text-white/40 text-sm">No team members yet.</p>
                <p className="text-white/20 text-xs mt-1">Use the invite button above to add your first team member.</p>
              </div>
            ) : (
              <div className="divide-y divide-white/[0.04]">
                {members.map(m => (
                  <div key={m.id} className="flex items-center gap-4 px-5 py-4 hover:bg-white/[0.02] transition-colors">
                    <div className="w-9 h-9 rounded-xl bg-white/[0.06] border border-white/[0.08] flex items-center justify-center text-white font-bold text-sm shrink-0">
                      {m.name[0]?.toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-medium text-white">{m.name}</p>
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${
                          m.orgRole === 'moderator'
                            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                            : 'bg-white/[0.04] border-white/[0.08] text-white/40'
                        }`}>
                          {m.orgRole === 'moderator' ? <Shield className="w-3 h-3" /> : <User className="w-3 h-3" />}
                          {m.orgRole === 'moderator' ? 'Moderator' : 'Member'}
                        </span>
                      </div>
                      <p className="text-xs text-white/40 mt-0.5">{m.email}</p>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => handleToggleRole(m)}
                        className="text-xs px-2.5 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-white/50 hover:text-white transition-colors"
                        title={m.orgRole === 'moderator' ? 'Demote to Member' : 'Promote to Moderator'}
                      >
                        {m.orgRole === 'moderator' ? 'Demote' : 'Promote'}
                      </button>
                      <button
                        onClick={() => handleRemove(m)}
                        className="p-1.5 rounded-lg text-white/20 hover:text-red-400 hover:bg-red-400/[0.08] transition-colors"
                        title="Remove member"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export default function TeamPage() {
  return (
    <AuthGuard>
      <TeamContent />
    </AuthGuard>
  )
}
