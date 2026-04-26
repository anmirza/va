'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import type { OrgRecord } from '@/lib/admin-store'
import { getAllOrgsFS, getVACategoriesFS, removeOrgFS, deleteOrgFS, updateOrgFS } from '@/lib/admin-firestore'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { toast } from 'sonner'
import {
  Search, Filter, Plus, MapPin, Users, Calendar,
  Trash2, CheckCircle2, Clock, AlertCircle, Mail, Edit, ShieldAlert
} from 'lucide-react'
import { CategoryIcon } from '@/components/category-icon'
import Link from 'next/link'

function OrgStatusBadge({ status }: { status: OrgRecord['status'] }) {
  const map: Record<string, string> = {
    active:  'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
    pending: 'bg-amber-500/10  border-amber-500/20  text-amber-400',
    rejected:'bg-red-500/10    border-red-500/20    text-red-400',
    removed: 'bg-white/[0.04]  border-white/[0.1]  text-white/30',
  }
  const icons: Record<string, React.ElementType> = { active: CheckCircle2, pending: Clock, rejected: AlertCircle, removed: AlertCircle }
  const labels: Record<string, string> = { active: 'Active', pending: 'Pending', rejected: 'Rejected', removed: 'Removed' }
  const Icon = icons[status] ?? AlertCircle
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${map[status] ?? ''}`}>
      <Icon className="w-3 h-3" />{labels[status] ?? status}
    </span>
  )
}

export default function GenericListingPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const categoryId = params.categoryId as string
  const isSuperAdmin = user?.role === 'super_admin'

  const [orgs, setOrgs] = useState<OrgRecord[]>([])
  const [categoryName, setCategoryName] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [showRemoved, setShowRemoved] = useState(false)

  // Dialog state: 'soft' = remove (set status=removed), 'hard' = permanent delete
  const [removeTarget, setRemoveTarget] = useState<{ id: string; name: string; mode: 'soft' | 'hard' } | null>(null)

  const load = useCallback(async () => {
    const [allOrgs, cats] = await Promise.all([getAllOrgsFS(), getVACategoriesFS()])
    const filtered = allOrgs.filter(o => {
      if (categoryId === 'cat-agency')     return o.type === 'agency'
      if (categoryId === 'cat-production') return o.type === 'production'
      return o.type === categoryId
    })
    setOrgs(filtered)
    const cat = cats.find(c => c.id === categoryId)
    setCategoryName(cat?.name || 'Organizations')
  }, [categoryId])

  useEffect(() => { load() }, [load])

  const filteredOrgs = orgs.filter(o => {
    if (!showRemoved && o.status === 'removed') return false
    return (
      o.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (o.country ?? '').toLowerCase().includes(searchQuery.toLowerCase())
    )
  })

  const handleRemoveConfirm = async () => {
    if (!removeTarget) return
    if (removeTarget.mode === 'hard') {
      await deleteOrgFS(removeTarget.id, user?.id ?? 'admin')
      toast.success(`"${removeTarget.name}" permanently deleted.`)
    } else {
      await removeOrgFS(removeTarget.id, user?.id ?? 'admin')
      toast.success(`"${removeTarget.name}" removed.`)
    }
    setRemoveTarget(null)
    load()
  }

  const handleFollowUp = async (id: string, name: string) => {
    await updateOrgFS(id, { lastFollowUpAt: new Date().toISOString() }, user?.id ?? 'admin')
    toast.success(`Follow-up logged for ${name}.`)
  }

  const editHref = (id: string) =>
    categoryId === 'cat-agency'     ? `/admin/agencies/create?edit=${id}` :
    categoryId === 'cat-production' ? `/admin/production/create?edit=${id}` :
    `/admin/listing/${categoryId}/create?edit=${id}`

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Confirm dialog */}
      <AlertDialog open={!!removeTarget} onOpenChange={open => !open && setRemoveTarget(null)}>
        <AlertDialogContent className="bg-[#0a0b1a] border border-white/10">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">
              {removeTarget?.mode === 'hard' ? 'Permanently Delete' : 'Remove'} {categoryName}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-white/60">
              {removeTarget?.mode === 'hard'
                ? `This will permanently delete "${removeTarget?.name}" from the database. This cannot be undone.`
                : `Are you sure you want to remove "${removeTarget?.name}"? It will be hidden but not deleted.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-white/10 text-white/60 hover:text-white">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRemoveConfirm}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              {removeTarget?.mode === 'hard' ? 'Delete Permanently' : 'Remove'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            {categoryName}
            <span className="text-sm font-normal text-white/30 bg-white/5 px-2 py-0.5 rounded-full">{filteredOrgs.length}</span>
          </h1>
          <p className="text-sm text-white/50 mt-1">Manage and monitor all registered {categoryName.toLowerCase()}.</p>
        </div>
        <Button
          onClick={() => router.push(`/admin/listing/${categoryId}/create`)}
          className="bg-[#0763d8] hover:bg-[#0655b3] text-white rounded-xl gap-2 h-11 px-6 shadow-lg shadow-[#0763d8]/20"
        >
          <Plus className="w-4 h-4" /> Add {categoryName}
        </Button>
      </div>

      {/* Search + filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <Input
            placeholder={`Search ${categoryName.toLowerCase()}...`}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-10 bg-white/[0.03] border-white/10 rounded-xl h-11 text-white placeholder:text-white/20"
          />
        </div>
        {isSuperAdmin && (
          <button
            onClick={() => setShowRemoved(p => !p)}
            className={`flex items-center gap-2 px-4 h-11 rounded-xl border text-sm font-medium transition-colors ${
              showRemoved
                ? 'bg-red-500/10 border-red-500/20 text-red-400'
                : 'bg-white/[0.03] border-white/10 text-white/40 hover:text-white'
            }`}
          >
            <Filter className="w-4 h-4" />
            {showRemoved ? 'Hiding Removed' : 'Show Removed'}
          </button>
        )}
      </div>

      {/* List */}
      {filteredOrgs.length === 0 ? (
        <div className="glass-card rounded-2xl p-16 text-center">
          <Search className="w-10 h-10 text-white/20 mx-auto mb-3" />
          <p className="text-white/40 text-sm">{searchQuery ? 'No records match your search.' : `No ${categoryName.toLowerCase()} registered yet.`}</p>
          <p className="text-white/20 text-xs mt-1 mb-4">Create one manually or approve a pending registration.</p>
          <Button
            size="sm"
            onClick={() => router.push(`/admin/listing/${categoryId}/create`)}
            className="bg-[#0763d8] hover:bg-[#0655b3] text-white rounded-xl"
          >
            <Plus className="w-3.5 h-3.5 mr-1.5" /> Add {categoryName}
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {filteredOrgs.map(org => (
            <div
              key={org.id}
              className={`glass-card rounded-2xl p-5 flex items-center gap-4 group hover:border-white/20 transition-all ${
                org.status === 'removed' ? 'opacity-50' : ''
              }`}
            >
              {/* Avatar */}
              <div className="w-12 h-12 rounded-xl bg-[#0763d8]/10 border border-[#0763d8]/20 flex items-center justify-center shrink-0">
                <CategoryIcon categoryName={org.category || categoryName} className="w-6 h-6 text-[#0763d8]" />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <p className="font-semibold text-white truncate">{org.name}</p>
                  <OrgStatusBadge status={org.status} />
                </div>
                <div className="flex items-center gap-4 text-xs text-white/40 flex-wrap">
                  {org.country && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{org.country}</span>}
                  {org.category && <span>{org.category}</span>}
                  <span className="flex items-center gap-1"><Users className="w-3 h-3" />{org.memberCount ?? 0} member{(org.memberCount ?? 0) !== 1 ? 's' : ''}</span>
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />Added {new Date(org.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleFollowUp(org.id, org.name)}
                  className="px-2 py-1.5 flex items-center gap-1.5 rounded-lg border border-[#0763d8]/20 bg-[#0763d8]/10 text-[#0763d8] hover:bg-[#0763d8]/20 transition-colors text-xs font-semibold"
                  title="Log follow-up"
                >
                  <Mail className="w-3 h-3" /> Follow-up
                </button>
                <Link href={editHref(org.id)}>
                  <Button size="sm" variant="outline" className="h-8 border-white/[0.1] text-white/60 hover:text-white rounded-lg text-xs gap-1.5">
                    <Edit className="w-3 h-3" /> Edit
                  </Button>
                </Link>
                {/* Soft remove — all admins */}
                {org.status !== 'removed' && (
                  <button
                    onClick={() => setRemoveTarget({ id: org.id, name: org.name, mode: 'soft' })}
                    className="p-2 rounded-lg text-white/30 hover:text-red-400 hover:bg-red-400/[0.08] transition-colors"
                    title="Remove (hide)"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
                {/* Hard delete — super admin only */}
                {isSuperAdmin && (
                  <button
                    onClick={() => setRemoveTarget({ id: org.id, name: org.name, mode: 'hard' })}
                    className="p-2 rounded-lg text-white/20 hover:text-red-500 hover:bg-red-500/[0.12] transition-colors"
                    title="Permanently delete (super admin)"
                  >
                    <ShieldAlert className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
