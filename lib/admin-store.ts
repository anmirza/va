/**
 * admin-store.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Client-side localStorage-backed store that acts as the data layer for
 * the admin panel, pending approvals, org records, invitations, and team
 * membership. This mirrors a real DB until a backend is introduced.
 */

// ── Types ─────────────────────────────────────────────────────────────────────

export type OrgType = 'agency' | 'production'
export type RegistrationStatus = 'pending' | 'approved' | 'rejected'

export interface PendingRegistration {
  id: string
  type: OrgType
  companyName: string
  submittedByUserId: string
  submittedByName: string
  submittedByEmail: string
  submittedAt: string
  status: RegistrationStatus
  profileData: Record<string, unknown>
  rejectionReason?: string
  approvedAt?: string
  approvedByAdminId?: string
}

export interface OrgRecord {
  id: string
  type: OrgType
  name: string
  country?: string
  description?: string
  category?: string
  status: 'active' | 'pending' | 'rejected' | 'removed'
  createdAt: string
  createdByAdminId?: string
  moderatorUserId?: string
  memberCount: number
  registrationId?: string // linked PendingRegistration id
  profileData?: Record<string, unknown>
}

export interface Invitation {
  id: string
  token: string
  orgId: string
  orgName: string
  orgType: OrgType
  invitedEmail?: string
  createdByAdminId: string
  createdAt: string
  acceptedAt?: string
  acceptedByUserId?: string
  status: 'pending' | 'accepted' | 'expired'
}

export interface OrgMember {
  id: string
  orgId: string
  userId: string
  name: string
  email: string
  orgRole: 'moderator' | 'user'
  joinedAt: string
  status: 'active' | 'suspended'
}

export interface DisclaimerContent {
  agency: string
  production: string
  lastUpdatedAt: string
  lastUpdatedBy?: string
}

// ── Storage keys ──────────────────────────────────────────────────────────────

const KEYS = {
  registrations: 'va_admin_registrations',
  orgs: 'va_admin_orgs',
  invitations: 'va_admin_invitations',
  members: 'va_admin_members',
  disclaimer: 'va_admin_disclaimer',
  activityLog: 'va_admin_activity',
}

// ── Default disclaimer text ───────────────────────────────────────────────────

const DEFAULT_AGENCY_DISCLAIMER = `Welcome to the VA Consulting agency registration portal.

Before proceeding with your registration, please read the following legal disclaimer carefully.

By submitting your agency profile, you confirm that all information provided is accurate, complete, and truthful. VA Consulting reserves the right to verify any information submitted and to reject or remove registrations that do not meet our quality standards or are found to be inaccurate.

Your submission will be reviewed by our team before your agency appears in the directory. This process typically takes 2–5 business days.

All data submitted will be processed in accordance with our Privacy Policy and applicable data protection legislation.

If you have any questions, please contact our team before proceeding.`

const DEFAULT_PRODUCTION_DISCLAIMER = `Welcome to the VA Consulting production company registration portal.

Before proceeding with your registration, please read the following legal disclaimer carefully.

By submitting your production company profile, you confirm that all information provided is accurate, complete, and truthful. VA Consulting reserves the right to verify any information submitted and to reject or remove registrations that do not meet our quality standards or are found to be inaccurate.

Your submission will be reviewed by our team before your production company appears in the directory. This process typically takes 2–5 business days.

All data submitted will be processed in accordance with our Privacy Policy and applicable data protection legislation.

If you have any questions, please contact our team before proceeding.`

// ── Activity Log ──────────────────────────────────────────────────────────────

export interface ActivityLogEntry {
  id: string
  type: 'approval' | 'rejection' | 'signup' | 'org_create' | 'org_remove' | 'invite'
  description: string
  timestamp: string
}

function getActivityLog(): ActivityLogEntry[] {
  try {
    return JSON.parse(localStorage.getItem(KEYS.activityLog) || '[]')
  } catch { return [] }
}

function addActivity(entry: Omit<ActivityLogEntry, 'id' | 'timestamp'>) {
  const log = getActivityLog()
  log.unshift({ ...entry, id: `act-${Date.now()}`, timestamp: new Date().toISOString() })
  localStorage.setItem(KEYS.activityLog, JSON.stringify(log.slice(0, 100)))
}

export function getRecentActivity(limit = 10): ActivityLogEntry[] {
  return getActivityLog().slice(0, limit)
}

// ── Registrations ─────────────────────────────────────────────────────────────

function getRegistrations(): PendingRegistration[] {
  try {
    return JSON.parse(localStorage.getItem(KEYS.registrations) || '[]')
  } catch { return [] }
}

function saveRegistrations(data: PendingRegistration[]) {
  localStorage.setItem(KEYS.registrations, JSON.stringify(data))
}

export function submitForApproval(
  profileData: Record<string, unknown>,
  type: OrgType,
  userId: string,
  userName: string,
  userEmail: string,
): PendingRegistration {
  const list = getRegistrations()
  const entry: PendingRegistration = {
    id: `reg-${Date.now()}`,
    type,
    companyName: String(profileData.businessName || 'Unnamed'),
    submittedByUserId: userId,
    submittedByName: userName,
    submittedByEmail: userEmail,
    submittedAt: new Date().toISOString(),
    status: 'pending',
    profileData,
  }
  list.unshift(entry)
  saveRegistrations(list)
  addActivity({ type: 'signup', description: `New ${type} registration submitted: ${entry.companyName} by ${userName}` })
  return entry
}

export function getAllRegistrations(): PendingRegistration[] {
  return getRegistrations()
}

export function getRegistrationsByUser(userId: string): PendingRegistration[] {
  return getRegistrations().filter(r => r.submittedByUserId === userId)
}

export function getRegistrationById(id: string): PendingRegistration | undefined {
  return getRegistrations().find(r => r.id === id)
}

export function approveRegistration(id: string, adminId: string): PendingRegistration | null {
  const list = getRegistrations()
  const idx = list.findIndex(r => r.id === id)
  if (idx === -1) return null
  list[idx] = {
    ...list[idx],
    status: 'approved',
    approvedAt: new Date().toISOString(),
    approvedByAdminId: adminId,
  }
  saveRegistrations(list)

  // Create an OrgRecord for the approved registration
  const reg = list[idx]
  const orgs = getOrgs()
  const existing = orgs.find(o => o.registrationId === id)
  if (!existing) {
    const newOrg: OrgRecord = {
      id: `org-${Date.now()}`,
      type: reg.type,
      name: reg.companyName,
      country: String(reg.profileData.country || ''),
      status: 'active',
      createdAt: new Date().toISOString(),
      moderatorUserId: reg.submittedByUserId,
      memberCount: 1,
      registrationId: id,
    }
    orgs.unshift(newOrg)
    saveOrgs(orgs)
  }

  addActivity({ type: 'approval', description: `Approved ${reg.type}: ${reg.companyName}` })
  return list[idx]
}

export function rejectRegistration(id: string, reason?: string): PendingRegistration | null {
  const list = getRegistrations()
  const idx = list.findIndex(r => r.id === id)
  if (idx === -1) return null
  list[idx] = { ...list[idx], status: 'rejected', rejectionReason: reason }
  saveRegistrations(list)
  addActivity({ type: 'rejection', description: `Rejected ${list[idx].type}: ${list[idx].companyName}${reason ? ` — ${reason}` : ''}` })
  return list[idx]
}

export function getPendingCount(): number {
  return getRegistrations().filter(r => r.status === 'pending').length
}

// ── Orgs ─────────────────────────────────────────────────────────────────────

function getOrgs(): OrgRecord[] {
  try {
    return JSON.parse(localStorage.getItem(KEYS.orgs) || '[]')
  } catch { return [] }
}

function saveOrgs(data: OrgRecord[]) {
  localStorage.setItem(KEYS.orgs, JSON.stringify(data))
}

export function getAllOrgs(): OrgRecord[] {
  return getOrgs()
}

export function getOrgsByType(type: OrgType): OrgRecord[] {
  return getOrgs().filter(o => o.type === type && o.status !== 'removed')
}

export function createOrg(
  data: { name: string; type: OrgType; country?: string; description?: string; category?: string; profileData?: Record<string, unknown> },
  adminId: string,
): OrgRecord {
  const orgs = getOrgs()
  const org: OrgRecord = {
    id: `org-${Date.now()}`,
    type: data.type,
    name: data.name,
    country: data.country,
    description: data.description,
    category: data.category,
    status: 'active',
    createdAt: new Date().toISOString(),
    createdByAdminId: adminId,
    memberCount: 0,
    profileData: data.profileData,
  }
  orgs.unshift(org)
  saveOrgs(orgs)
  addActivity({ type: 'org_create', description: `Admin created ${data.type}: ${data.name}` })
  return org
}

export function removeOrg(id: string, adminId: string): boolean {
  const orgs = getOrgs()
  const idx = orgs.findIndex(o => o.id === id)
  if (idx === -1) return false
  orgs[idx] = { ...orgs[idx], status: 'removed' }
  saveOrgs(orgs)
  addActivity({ type: 'org_remove', description: `Admin removed org: ${orgs[idx].name}` })
  return true
}

export function getOrgById(id: string): OrgRecord | undefined {
  return getOrgs().find(o => o.id === id)
}

// ── Invitations ───────────────────────────────────────────────────────────────

function getInvitations(): Invitation[] {
  try {
    return JSON.parse(localStorage.getItem(KEYS.invitations) || '[]')
  } catch { return [] }
}

function saveInvitations(data: Invitation[]) {
  localStorage.setItem(KEYS.invitations, JSON.stringify(data))
}

export function createInvitation(
  orgId: string,
  orgName: string,
  orgType: OrgType,
  adminId: string,
  invitedEmail?: string,
): Invitation {
  const inv = getInvitations()
  const token = `inv-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
  const invitation: Invitation = {
    id: `inv-${Date.now()}`,
    token,
    orgId,
    orgName,
    orgType,
    invitedEmail,
    createdByAdminId: adminId,
    createdAt: new Date().toISOString(),
    status: 'pending',
  }
  inv.unshift(invitation)
  saveInvitations(inv)
  addActivity({ type: 'invite', description: `Invite created for ${orgName}${invitedEmail ? ` → ${invitedEmail}` : ''}` })
  return invitation
}

export function getInvitationByToken(token: string): Invitation | undefined {
  return getInvitations().find(i => i.token === token)
}

export function acceptInvitation(token: string, userId: string): Invitation | null {
  const inv = getInvitations()
  const idx = inv.findIndex(i => i.token === token)
  if (idx === -1) return null
  inv[idx] = { ...inv[idx], status: 'accepted', acceptedAt: new Date().toISOString(), acceptedByUserId: userId }
  saveInvitations(inv)
  return inv[idx]
}

export function getInvitationsByOrg(orgId: string): Invitation[] {
  return getInvitations().filter(i => i.orgId === orgId)
}

// ── Members ───────────────────────────────────────────────────────────────────

function getMembersStore(): OrgMember[] {
  try {
    return JSON.parse(localStorage.getItem(KEYS.members) || '[]')
  } catch { return [] }
}

function saveMembers(data: OrgMember[]) {
  localStorage.setItem(KEYS.members, JSON.stringify(data))
}

export function getMembersByOrg(orgId: string): OrgMember[] {
  return getMembersStore().filter(m => m.orgId === orgId && m.status === 'active')
}

export function addMember(
  orgId: string,
  userId: string,
  name: string,
  email: string,
  role: 'moderator' | 'user' = 'user',
): OrgMember {
  const members = getMembersStore()
  const existing = members.find(m => m.orgId === orgId && m.userId === userId)
  if (existing) return existing
  const member: OrgMember = {
    id: `mem-${Date.now()}`,
    orgId,
    userId,
    name,
    email,
    orgRole: role,
    joinedAt: new Date().toISOString(),
    status: 'active',
  }
  members.unshift(member)
  saveMembers(members)

  // Update memberCount on OrgRecord
  const orgs = getOrgs()
  const orgIdx = orgs.findIndex(o => o.id === orgId)
  if (orgIdx !== -1) {
    orgs[orgIdx].memberCount = getMembersStore().filter(m => m.orgId === orgId && m.status === 'active').length + 1
    saveOrgs(orgs)
  }
  return member
}

export function updateMemberRole(memberId: string, newRole: 'moderator' | 'user'): boolean {
  const members = getMembersStore()
  const idx = members.findIndex(m => m.id === memberId)
  if (idx === -1) return false
  members[idx] = { ...members[idx], orgRole: newRole }
  saveMembers(members)
  return true
}

export function removeMember(memberId: string): boolean {
  const members = getMembersStore()
  const idx = members.findIndex(m => m.id === memberId)
  if (idx === -1) return false
  members[idx] = { ...members[idx], status: 'suspended' }
  saveMembers(members)
  return true
}

export function getMemberByUserId(orgId: string, userId: string): OrgMember | undefined {
  return getMembersStore().find(m => m.orgId === orgId && m.userId === userId && m.status === 'active')
}

// ── Disclaimer ────────────────────────────────────────────────────────────────

export function getDisclaimerContent(): DisclaimerContent {
  try {
    const stored = localStorage.getItem(KEYS.disclaimer)
    if (stored) return JSON.parse(stored)
  } catch { /* ignore */ }
  return {
    agency: DEFAULT_AGENCY_DISCLAIMER,
    production: DEFAULT_PRODUCTION_DISCLAIMER,
    lastUpdatedAt: new Date().toISOString(),
  }
}

export function saveDisclaimerContent(
  type: OrgType,
  text: string,
  adminId: string,
): DisclaimerContent {
  const current = getDisclaimerContent()
  const updated: DisclaimerContent = {
    ...current,
    [type]: text,
    lastUpdatedAt: new Date().toISOString(),
    lastUpdatedBy: adminId,
  }
  localStorage.setItem(KEYS.disclaimer, JSON.stringify(updated))
  return updated
}

// ── Admin Stats ───────────────────────────────────────────────────────────────

export function getAdminStats() {
  const regs = getRegistrations()
  const orgs = getOrgs().filter(o => o.status !== 'removed')
  const members = getMembersStore().filter(m => m.status === 'active')
  return {
    totalAgencies: orgs.filter(o => o.type === 'agency' && o.status === 'active').length,
    totalProduction: orgs.filter(o => o.type === 'production' && o.status === 'active').length,
    pendingApprovals: regs.filter(r => r.status === 'pending').length,
    totalUsers: members.length,
    recentApprovals: regs.filter(r => r.status === 'approved').length,
    recentRejections: regs.filter(r => r.status === 'rejected').length,
  }
}
