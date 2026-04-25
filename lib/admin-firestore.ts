/**
 * admin-firestore.ts
 * Async Firestore CRUD layer replacing the localStorage admin-store functions.
 * All admin pages should import from here for data operations.
 */

import {
  collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc,
  query, where, orderBy, limit, addDoc, serverTimestamp,
  onSnapshot, type Unsubscribe, increment, writeBatch,
} from 'firebase/firestore'
import { db } from './firebase'
import type {
  OrgRecord, OrgType, PendingRegistration, RegistrationStatus,
  Invitation, OrgMember, ClientCompany, ClientUser,
  VACategory, RfiField, VAInternalUser, DisclaimerContent, ActivityLogEntry,
} from './admin-store'

// ── Helpers ───────────────────────────────────────────────────────────────────

function uid(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

async function addActivity(entry: Omit<ActivityLogEntry, 'id' | 'timestamp'>) {
  try {
    await addDoc(collection(db, 'activityLog'), {
      ...entry,
      id: uid(),
      timestamp: new Date().toISOString(),
      createdAt: serverTimestamp(),
    })
  } catch { /* ignore */ }
}

// ── Stats ─────────────────────────────────────────────────────────────────────

export async function getAdminStatsFS(): Promise<{
  totalAgencies: number; totalProduction: number; pendingApprovals: number; totalUsers: number
}> {
  try {
    const [agenciesSnap, prodSnap, pendingSnap, usersSnap] = await Promise.all([
      getDocs(query(collection(db, 'organisations'), where('type', '==', 'agency'), where('status', '==', 'active'))),
      getDocs(query(collection(db, 'organisations'), where('type', '==', 'production'), where('status', '==', 'active'))),
      getDocs(query(collection(db, 'pendingRegistrations'), where('status', '==', 'pending'))),
      getDocs(collection(db, 'users')),
    ])
    return {
      totalAgencies: agenciesSnap.size,
      totalProduction: prodSnap.size,
      pendingApprovals: pendingSnap.size,
      totalUsers: usersSnap.size,
    }
  } catch {
    return { totalAgencies: 0, totalProduction: 0, pendingApprovals: 0, totalUsers: 0 }
  }
}

// ── Activity Log ──────────────────────────────────────────────────────────────

export async function getRecentActivityFS(limitCount = 10): Promise<ActivityLogEntry[]> {
  try {
    const snap = await getDocs(query(collection(db, 'activityLog'), orderBy('createdAt', 'desc'), limit(limitCount)))
    return snap.docs.map(d => d.data() as ActivityLogEntry)
  } catch {
    return []
  }
}

export function subscribePendingCount(cb: (count: number) => void): Unsubscribe {
  const q = query(collection(db, 'pendingRegistrations'), where('status', '==', 'pending'))
  return onSnapshot(q, snap => cb(snap.size), () => cb(0))
}

// ── Registrations ─────────────────────────────────────────────────────────────

export async function getAllRegistrationsFS(): Promise<PendingRegistration[]> {
  try {
    const snap = await getDocs(query(collection(db, 'pendingRegistrations'), orderBy('submittedAt', 'desc')))
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as PendingRegistration))
  } catch {
    return []
  }
}

export async function getRegistrationByIdFS(id: string): Promise<PendingRegistration | null> {
  try {
    const snap = await getDoc(doc(db, 'pendingRegistrations', id))
    if (snap.exists()) return { id: snap.id, ...snap.data() } as PendingRegistration
  } catch { /* ignore */ }
  return null
}

export async function getRegistrationsByUserFS(userId: string): Promise<PendingRegistration[]> {
  try {
    const snap = await getDocs(query(collection(db, 'pendingRegistrations'), where('submittedByUserId', '==', userId)))
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as PendingRegistration))
  } catch {
    return []
  }
}

export async function submitForApprovalFS(data: Omit<PendingRegistration, 'id' | 'status' | 'submittedAt'>): Promise<PendingRegistration> {
  const id = uid()
  const reg: PendingRegistration = {
    ...data,
    id,
    status: 'pending',
    submittedAt: new Date().toISOString(),
  }
  await setDoc(doc(db, 'pendingRegistrations', id), reg)
  await addActivity({ type: 'signup', description: `New ${data.type} registration: ${data.companyName}` })
  return reg
}

export async function approveRegistrationFS(id: string, adminId: string): Promise<void> {
  const regDoc = await getDoc(doc(db, 'pendingRegistrations', id))
  if (!regDoc.exists()) return

  const reg = regDoc.data() as PendingRegistration
  const batch = writeBatch(db)

  // Update registration status
  batch.update(doc(db, 'pendingRegistrations', id), {
    status: 'approved',
    approvedAt: new Date().toISOString(),
    approvedByAdminId: adminId,
  })

  // Create org record
  const orgId = uid()
  const orgData: OrgRecord = {
    id: orgId,
    type: reg.type,
    name: reg.companyName,
    status: 'active',
    createdAt: new Date().toISOString(),
    createdByAdminId: adminId,
    memberCount: 0,
    registrationId: id,
    profileData: reg.profileData,
  }
  batch.set(doc(db, 'organisations', orgId), orgData)

  await batch.commit()
  await addActivity({ type: 'approval', description: `Approved ${reg.type}: ${reg.companyName}` })
}

export async function rejectRegistrationFS(id: string, adminId: string, reason?: string): Promise<void> {
  const regDoc = await getDoc(doc(db, 'pendingRegistrations', id))
  if (!regDoc.exists()) return
  const reg = regDoc.data() as PendingRegistration

  await updateDoc(doc(db, 'pendingRegistrations', id), {
    status: 'rejected',
    rejectionReason: reason ?? '',
    rejectedAt: new Date().toISOString(),
    rejectedByAdminId: adminId,
  })
  await addActivity({ type: 'rejection', description: `Rejected ${reg.type}: ${reg.companyName}` })
}

// ── Organisations ─────────────────────────────────────────────────────────────

export async function getAllOrgsFS(): Promise<OrgRecord[]> {
  try {
    const snap = await getDocs(query(collection(db, 'organisations'), orderBy('createdAt', 'desc')))
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as OrgRecord))
  } catch {
    return []
  }
}

export async function getOrgsByTypeFS(type: OrgType): Promise<OrgRecord[]> {
  try {
    const snap = await getDocs(query(collection(db, 'organisations'), where('type', '==', type), orderBy('createdAt', 'desc')))
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as OrgRecord))
  } catch {
    return []
  }
}

export async function getOrgByIdFS(id: string): Promise<OrgRecord | null> {
  try {
    const snap = await getDoc(doc(db, 'organisations', id))
    if (snap.exists()) return { id: snap.id, ...snap.data() } as OrgRecord
  } catch { /* ignore */ }
  return null
}

export async function createOrgFS(
  data: Omit<OrgRecord, 'id' | 'createdAt' | 'memberCount' | 'status'>,
  adminId: string,
): Promise<OrgRecord> {
  const id = uid()
  const org: OrgRecord = {
    ...data,
    id,
    status: 'active',
    createdAt: new Date().toISOString(),
    createdByAdminId: adminId,
    memberCount: 0,
  }
  await setDoc(doc(db, 'organisations', id), org)
  await addActivity({ type: 'org_create', description: `Created ${data.type}: ${data.name}` })
  return org
}

export async function updateOrgFS(
  id: string,
  updates: Partial<Omit<OrgRecord, 'id' | 'createdAt'>>,
  adminId: string,
): Promise<void> {
  await updateDoc(doc(db, 'organisations', id), {
    ...updates,
    latestUpdateAt: new Date().toISOString(),
    updatedByAdminId: adminId,
  })
}

export async function removeOrgFS(id: string, adminId: string): Promise<void> {
  await updateDoc(doc(db, 'organisations', id), { status: 'removed' })
  await addActivity({ type: 'org_remove', description: `Removed org ${id}` })
}

// ── Invitations ───────────────────────────────────────────────────────────────

export async function createInvitationFS(
  orgId: string,
  orgName: string,
  orgType: OrgType,
  adminId: string,
  invitedEmail?: string,
): Promise<Invitation> {
  const token = `inv-${uid()}`
  const inv: Invitation = {
    id: uid(),
    token,
    orgId,
    orgName,
    orgType,
    invitedEmail,
    createdByAdminId: adminId,
    createdAt: new Date().toISOString(),
    status: 'pending',
  }
  await setDoc(doc(db, 'invitations', inv.id), inv)
  await addActivity({ type: 'invite', description: `Invite created for ${orgName}` })
  return inv
}

export async function getInvitationByTokenFS(token: string): Promise<Invitation | null> {
  try {
    const snap = await getDocs(query(collection(db, 'invitations'), where('token', '==', token), limit(1)))
    if (!snap.empty) return { id: snap.docs[0].id, ...snap.docs[0].data() } as Invitation
  } catch { /* ignore */ }
  return null
}

// ── Users (all users) ─────────────────────────────────────────────────────────

export async function getAllUsersFS(): Promise<any[]> {
  try {
    const snap = await getDocs(collection(db, 'users'))
    return snap.docs.map(d => d.data())
  } catch {
    return []
  }
}

// ── Internal Users ────────────────────────────────────────────────────────────

export async function getVAInternalUsersFS(): Promise<VAInternalUser[]> {
  try {
    const snap = await getDocs(
      query(collection(db, 'users'), where('role', 'in', ['super_admin', 'admin', 'analyst']))
    )
    return snap.docs.map(d => {
      const data = d.data()
      return {
        id: d.id,
        name: data.name ?? '',
        email: data.email ?? '',
        role: data.role ?? 'admin',
        status: data.status ?? 'active',
      } as VAInternalUser
    })
  } catch {
    return []
  }
}

export async function createVAInternalUserFS(data: { name: string; email: string; role: VAInternalUser['role'] }): Promise<VAInternalUser> {
  const id = uid()
  const user: VAInternalUser = { id, ...data, status: 'active' }
  await setDoc(doc(db, 'users', id), { ...user, accountType: 'vendor', mustChangePassword: true })
  return user
}

// ── Client Companies ──────────────────────────────────────────────────────────

export async function getAllClientCompaniesFS(): Promise<ClientCompany[]> {
  try {
    const snap = await getDocs(query(collection(db, 'clientCompanies'), orderBy('createdAt', 'desc')))
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as ClientCompany))
  } catch {
    return []
  }
}

export async function getClientCompanyByIdFS(id: string): Promise<ClientCompany | null> {
  try {
    const snap = await getDoc(doc(db, 'clientCompanies', id))
    if (snap.exists()) return { id: snap.id, ...snap.data() } as ClientCompany
  } catch { /* ignore */ }
  return null
}

export async function createClientCompanyFS(data: Omit<ClientCompany, 'id' | 'createdAt'>, adminId: string): Promise<ClientCompany> {
  const id = uid()
  const company: ClientCompany = {
    ...data,
    id,
    createdAt: new Date().toISOString(),
    createdByAdminId: adminId,
    tokensUsed: data.tokensUsed ?? 0,
    packageSize: data.packageSize ?? 6,
  }
  await setDoc(doc(db, 'clientCompanies', id), company)
  await addActivity({ type: 'org_create', description: `Created client company: ${data.name}` })
  return company
}

export async function updateClientCompanyFS(id: string, updates: Partial<ClientCompany>): Promise<void> {
  await updateDoc(doc(db, 'clientCompanies', id), { ...updates, updatedAt: new Date().toISOString() })
}

export async function addClientCompanyTokensFS(companyId: string, tokensToAdd: number): Promise<void> {
  await updateDoc(doc(db, 'clientCompanies', companyId), { tokens: increment(tokensToAdd) })
}

// ── Client Users ──────────────────────────────────────────────────────────────

export async function getClientUsersByCompanyFS(companyId: string): Promise<ClientUser[]> {
  try {
    const snap = await getDocs(query(collection(db, 'clientUsers'), where('companyId', '==', companyId)))
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as ClientUser))
  } catch {
    return []
  }
}

export async function getAllClientUsersFS(): Promise<ClientUser[]> {
  try {
    const snap = await getDocs(collection(db, 'clientUsers'))
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as ClientUser))
  } catch {
    return []
  }
}

export async function createClientUserFS(data: {
  companyId: string
  name: string
  email: string
  role: string
  mobile?: string
  region?: string
  country?: string
}, adminId: string): Promise<ClientUser> {
  const id = uid()
  const user: ClientUser = {
    id,
    ...data,
    createdAt: new Date().toISOString(),
    status: 'active',
  }
  // Create Firestore user record
  await setDoc(doc(db, 'clientUsers', id), user)
  // Also create the platform user record (mustChangePassword = true for first login)
  await setDoc(doc(db, 'users', id), {
    id,
    email: data.email,
    name: data.name,
    role: 'client',
    accountType: 'client',
    companyId: data.companyId,
    mustChangePassword: true,
    status: 'active',
    createdAt: new Date().toISOString(),
  })
  await addActivity({ type: 'invite', description: `Client user created: ${data.email}` })
  return user
}

export async function updateClientUserFS(id: string, updates: Partial<ClientUser>): Promise<void> {
  await updateDoc(doc(db, 'clientUsers', id), { ...updates })
  // Also update the users collection
  try { await updateDoc(doc(db, 'users', id), { ...updates }) } catch { /* ignore */ }
}

export async function suspendClientUserFS(id: string): Promise<void> {
  await updateDoc(doc(db, 'clientUsers', id), { status: 'suspended' })
  try { await updateDoc(doc(db, 'users', id), { status: 'suspended' }) } catch { /* ignore */ }
}

// ── Disclaimer ────────────────────────────────────────────────────────────────

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

export async function getDisclaimerContentFS(): Promise<DisclaimerContent> {
  try {
    const snap = await getDoc(doc(db, 'config', 'disclaimers'))
    if (snap.exists()) return snap.data() as DisclaimerContent
  } catch { /* ignore */ }
  return {
    agency: DEFAULT_AGENCY_DISCLAIMER,
    production: DEFAULT_PRODUCTION_DISCLAIMER,
    lastUpdatedAt: new Date().toISOString(),
  }
}

export async function saveDisclaimerContentFS(tab: 'agency' | 'production', text: string, adminId: string): Promise<void> {
  await setDoc(doc(db, 'config', 'disclaimers'), {
    [tab]: text,
    lastUpdatedAt: new Date().toISOString(),
    lastUpdatedBy: adminId,
  }, { merge: true })
}

// ── Categories ────────────────────────────────────────────────────────────────

const DEFAULT_CATEGORIES: VACategory[] = [
  { id: 'cat-agency', name: 'Agencies', iconSvg: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="18" height="18" x="3" y="3" rx="2"/></svg>' },
  { id: 'cat-production', name: 'Production', iconSvg: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="23 7 16 12 23 17 23 7"/><rect width="15" height="14" x="1" y="5" rx="2"/></svg>' },
]

export async function getVACategoriesFS(): Promise<VACategory[]> {
  try {
    const snap = await getDoc(doc(db, 'config', 'categories'))
    if (snap.exists()) {
      const data = snap.data()
      return (data.items as VACategory[]) ?? DEFAULT_CATEGORIES
    }
  } catch { /* ignore */ }
  return DEFAULT_CATEGORIES
}

export async function saveVACategoryFS(cat: VACategory): Promise<void> {
  const current = await getVACategoriesFS()
  const idx = current.findIndex(c => c.id === cat.id)
  if (idx >= 0) current[idx] = cat
  else current.push(cat)
  await setDoc(doc(db, 'config', 'categories'), { items: current }, { merge: false })
}

export async function deleteVACategoryFS(id: string): Promise<void> {
  const current = await getVACategoriesFS()
  const updated = current.filter(c => c.id !== id)
  await setDoc(doc(db, 'config', 'categories'), { items: updated }, { merge: false })
}

// ── RFI Fields ────────────────────────────────────────────────────────────────

export async function getRfiFieldsFS(categoryId: string): Promise<RfiField[]> {
  try {
    const snap = await getDoc(doc(db, 'config', 'rfiFields'))
    if (snap.exists()) {
      const map = snap.data() as Record<string, RfiField[]>
      return map[categoryId] ?? []
    }
  } catch { /* ignore */ }
  return []
}

export async function saveRfiFieldsFS(categoryId: string, fields: RfiField[]): Promise<void> {
  await setDoc(doc(db, 'config', 'rfiFields'), { [categoryId]: fields }, { merge: true })
}
