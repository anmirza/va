/**
 * admin-store.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Client-side localStorage-backed store that acts as the data layer for
 * the admin panel, pending approvals, org records, invitations, and team
 * membership. This mirrors a real DB until a backend is introduced.
 */

// ── Types ─────────────────────────────────────────────────────────────────────

export type OrgType = 'agency' | 'production' | string // Allow dynamic string for categories
export type RegistrationStatus = 'pending' | 'approved' | 'rejected'

export interface ClientCompany {
  id: string
  name: string
  // Corporate hierarchy
  holdingCompany?: string
  regionalHub?: string
  region?: string
  localCompany?: string
  country?: string
  // Legacy field (kept for compatibility)
  holding?: string
  // Subscription
  createdAt: string
  tokens: number            // total Agency Search & Selection credits purchased
  tokensUsed: number        // credits consumed
  packageSize: number       // agencies per package (6 or 12)
  status: 'active' | 'suspended'
  createdByAdminId?: string
  notes?: string
}

export interface ClientUser {
  id: string
  companyId: string
  name: string
  email: string
  role: string
  mobile?: string
  createdAt: string
  status: 'active' | 'suspended'
}

export interface VACategory {
  id: string
  name: string
  iconSvg: string
}

export interface RfiStep {
  key: string
  label: string
  shortLabel: string
}

export interface RfiField {
  id: string
  label: string
  type: 'text' | 'number' | 'date' | 'textarea' | 'checkbox' | 'select' | 'table' | 'file'
  required: boolean
  section?: string
  order?: number
  visible?: boolean
}

export interface VAInternalUser {
  id: string
  name: string
  email: string
  role: 'super_admin' | 'admin' | 'analyst'
  status: 'active' | 'suspended'
}

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
  latestUpdateAt?: string // track when they last updated profile
  lastFollowUpAt?: string // track when admin sent a follow-up
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
  clientCompanies: 'va_client_companies',
  clientUsers: 'va_client_users',
  vaCategories: 'va_categories',
  internalUsers: 'va_internal_users',
  rfiFieldsMap: 'va_rfi_fields_map'
}

// ── Role Mock ─────────────────────────────────────────────────────────────────

export function getCurrentInternalUserRole(): 'super_admin' | 'admin' | 'analyst' {
  if (typeof window !== 'undefined') {
    return (localStorage.getItem('va_current_role') as any) || 'admin'
  }
  return 'admin'
}

export function setCurrentInternalUserRole(role: 'super_admin' | 'admin' | 'analyst') {
  if (typeof window !== 'undefined') {
    localStorage.setItem('va_current_role', role)
  }
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

export function updateOrg(
  id: string,
  data: { name: string; country?: string; description?: string; category?: string; profileData?: Record<string, unknown> },
  adminId: string,
): OrgRecord | null {
  const orgs = getOrgs()
  const idx = orgs.findIndex(o => o.id === id)
  if (idx === -1) return null

  orgs[idx] = {
    ...orgs[idx],
    ...data,
  }
  saveOrgs(orgs)
  addActivity({ type: 'org_create', description: `Admin updated ${orgs[idx].type}: ${orgs[idx].name}` })
  return orgs[idx]
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
  if (!id) return undefined
  return getOrgs().find(o => o.id === id)
}

// ── Client Companies & Users ──────────────────────────────────────────────────

function getClientCompanies(): ClientCompany[] {
  try { return JSON.parse(localStorage.getItem(KEYS.clientCompanies) || '[]') } catch { return [] }
}
function saveClientCompanies(data: ClientCompany[]) {
  localStorage.setItem(KEYS.clientCompanies, JSON.stringify(data))
}

export function getAllClientCompanies(): ClientCompany[] {
  return getClientCompanies()
}

export function getClientCompanyById(id: string): ClientCompany | undefined {
  return getClientCompanies().find(c => c.id === id)
}

export function createClientCompany(data: Omit<ClientCompany, 'id' | 'createdAt' | 'status'>): ClientCompany {
  const comps = getClientCompanies()
  const comp: ClientCompany = { ...data, id: `ccmp-${Date.now()}`, createdAt: new Date().toISOString(), status: 'active' }
  comps.unshift(comp)
  saveClientCompanies(comps)
  addActivity({ type: 'org_create', description: `Added client company: ${comp.name}` })
  return comp
}

export function submitForApproval(data: Omit<PendingRegistration, 'id' | 'submittedAt' | 'status'>): PendingRegistration {
  const regs = getRegistrations()
  const reg: PendingRegistration = {
    ...data,
    id: `reg-${Date.now()}`,
    submittedAt: new Date().toISOString(),
    status: 'pending'
  }
  regs.unshift(reg)
  saveRegistrations(regs)
  addActivity({
    type: 'signup',
    description: `New ${data.type} registration submitted: ${data.companyName} by ${data.submittedByName}`
  })
  return reg
}

export function updateClientCompanyTokens(id: string, newTokens: number): boolean {
  const comps = getClientCompanies()
  const idx = comps.findIndex(c => c.id === id)
  if (idx === -1) return false
  comps[idx].tokens = newTokens
  saveClientCompanies(comps)
  return true
}

export function deductClientToken(companyId: string): boolean {
  const comps = getClientCompanies()
  const idx = comps.findIndex(c => c.id === companyId)
  if (idx === -1 || comps[idx].tokens <= 0) return false
  comps[idx].tokens -= 1
  saveClientCompanies(comps)
  return true
}

function getClientUsers(): ClientUser[] {
  try { return JSON.parse(localStorage.getItem(KEYS.clientUsers) || '[]') } catch { return [] }
}
function saveClientUsers(data: ClientUser[]) {
  localStorage.setItem(KEYS.clientUsers, JSON.stringify(data))
}

export function getClientUsersByCompany(companyId: string): ClientUser[] {
  return getClientUsers().filter(u => u.companyId === companyId)
}

export function createClientUser(data: Omit<ClientUser, 'id' | 'createdAt' | 'status'>): ClientUser {
  const users = getClientUsers()
  const user: ClientUser = { ...data, id: `cusr-${Date.now()}`, createdAt: new Date().toISOString(), status: 'active' }
  users.unshift(user)
  saveClientUsers(users)
  addActivity({ type: 'invite', description: `Created client user: ${user.name}` })
  return user
}

// ── Categories & Internal Users ──────────────────────────────────────────────

export function getVACategories(): VACategory[] {
  try {
    const defaultCats = [
      { id: 'cat-agency', name: 'Agency', iconSvg: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-building-2"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/></svg>' },
      { id: 'cat-production', name: 'Production', iconSvg: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-film"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M7 3v18"/><path d="M3 7.5h4"/><path d="M3 12h18"/><path d="M3 16.5h4"/><path d="M17 3v18"/><path d="M17 7.5h4"/><path d="M17 16.5h4"/></svg>' }
    ]
    const stored = localStorage.getItem(KEYS.vaCategories)
    if (stored) return JSON.parse(stored)
    return defaultCats
  } catch { return [] }
}

export function getVACategoryByName(name: string): VACategory | undefined {
  if (!name) return undefined
  return getVACategories().find(c => c.name.toLowerCase() === name.toLowerCase())
}

export function saveVACategory(category: VACategory) {
  const cats = getVACategories()
  const existingIdx = cats.findIndex(c => c.id === category.id)
  if (existingIdx > -1) {
    cats[existingIdx] = category
  } else {
    cats.push(category)
  }
  localStorage.setItem(KEYS.vaCategories, JSON.stringify(cats))
}

export function deleteVACategory(id: string) {
  const cats = getVACategories().filter(c => c.id !== id)
  localStorage.setItem(KEYS.vaCategories, JSON.stringify(cats))
}

// ── RFI Fields ────────────────────────────────────────────────────────────────

// ── RFI Fields ────────────────────────────────────────────────────────────────

const DEFAULT_AGENCY_RFI: RfiField[] = [
  // Section: General Information
  { id: 'rag-1', label: 'Registered Business Name', type: 'text', required: true, section: 'General Information', order: 1, visible: true },
  { id: 'rag-2', label: 'D-U-N-S® Number', type: 'text', required: false, section: 'General Information', order: 2, visible: true },
  { id: 'rag-3', label: 'VAT Registration Number', type: 'text', required: true, section: 'General Information', order: 3, visible: true },
  { id: 'rag-4', label: 'Legal Form', type: 'text', required: true, section: 'General Information', order: 4, visible: true },
  { id: 'rag-5', label: 'Company Registration Number', type: 'text', required: true, section: 'General Information', order: 5, visible: true },
  { id: 'rag-6', label: 'Year Established', type: 'number', required: true, section: 'General Information', order: 6, visible: true },
  
  // Section: Organisation & Structure
  { id: 'rag-7', label: '# of Employees', type: 'select', required: true, section: 'Organisation & Structure', order: 7, visible: true },
  { id: 'rag-8', label: 'Company Level', type: 'select', required: true, section: 'Organisation & Structure', order: 8, visible: true },
  { id: 'rag-9', label: 'Parent Company Name', type: 'text', required: false, section: 'Organisation & Structure', order: 9, visible: true },
  { id: 'rag-10', label: 'Category', type: 'select', required: true, section: 'Organisation & Structure', order: 10, visible: true },
  { id: 'rag-11', label: 'Agency Currency', type: 'select', required: true, section: 'Organisation & Structure', order: 11, visible: true },
  { id: 'rag-12', label: 'Trade Organizations', type: 'text', required: false, section: 'Organisation & Structure', order: 12, visible: true },

  // Section: Location & Address
  { id: 'rag-13', label: 'Country Coverage', type: 'select', required: true, section: 'Location & Address', order: 13, visible: true },
  { id: 'rag-14', label: 'Street Address', type: 'text', required: true, section: 'Location & Address', order: 14, visible: true },
  { id: 'rag-15', label: 'City', type: 'text', required: true, section: 'Location & Address', order: 15, visible: true },
  { id: 'rag-16', label: 'Postcode', type: 'text', required: true, section: 'Location & Address', order: 16, visible: true },
  { id: 'rag-17', label: 'Country', type: 'select', required: true, section: 'Location & Address', order: 17, visible: true },

  // Section: Contacts & Social
  { id: 'rag-18', label: 'Key Contacts (Roles & Info)', type: 'table', required: true, section: 'Contacts & Social', order: 18, visible: true },
  { id: 'rag-19', label: 'Social Media Profiles', type: 'table', required: false, section: 'Contacts & Social', order: 19, visible: true },

  // Section: About & Positioning
  { id: 'rag-20', label: 'Agency Overview', type: 'textarea', required: true, section: 'About & Positioning', order: 20, visible: true },
  { id: 'rag-21', label: 'Philosophy & Competitive Advantages', type: 'textarea', required: false, section: 'About & Positioning', order: 21, visible: true },
  { id: 'rag-22', label: 'Network Description', type: 'textarea', required: false, section: 'About & Positioning', order: 22, visible: true },
  { id: 'rag-23', label: 'Local Representation', type: 'textarea', required: false, section: 'About & Positioning', order: 23, visible: true },

  // Section: Turnover & Clients
  { id: 'rag-24', label: 'Revenue & EBITA (Last 3 Years)', type: 'table', required: true, section: 'Turnover & Clients', order: 24, visible: true },
  { id: 'rag-25', label: 'Main Clients List', type: 'table', required: true, section: 'Turnover & Clients', order: 25, visible: true },
  { id: 'rag-26', label: 'Client Pitch History', type: 'table', required: false, section: 'Turnover & Clients', order: 26, visible: true },

  // Section: Knowledge & Competencies
  { id: 'rag-27', label: 'Communication Areas Expertise (%)', type: 'table', required: true, section: 'Knowledge & Competencies', order: 27, visible: true },
  { id: 'rag-28', label: 'Capabilities (Main/Secondary/Additional)', type: 'table', required: true, section: 'Knowledge & Competencies', order: 28, visible: true },
  { id: 'rag-29', label: 'Service Allocations (%)', type: 'table', required: true, section: 'Knowledge & Competencies', order: 29, visible: true },
  { id: 'rag-30', label: 'Outsourced Activities', type: 'table', required: false, section: 'Knowledge & Competencies', order: 30, visible: true },

  // Section: Governance & SOW
  { id: 'rag-31', label: 'Quality Assurance Systems', type: 'textarea', required: false, section: 'Governance & SOW', order: 31, visible: true },
  { id: 'rag-32', label: 'Data Management Protocols', type: 'textarea', required: false, section: 'Governance & SOW', order: 32, visible: true },
  { id: 'rag-33', label: 'Global Brand Governance', type: 'textarea', required: false, section: 'Governance & SOW', order: 33, visible: true },

  // Section: People & Talent
  { id: 'rag-34', label: 'Headcounts (Employees/Freelancers)', type: 'table', required: true, section: 'People & Talent', order: 34, visible: true },
  { id: 'rag-35', label: 'Key Talent Profiles', type: 'table', required: true, section: 'People & Talent', order: 35, visible: true },

  // Section: Awards & Social Responsibility
  { id: 'rag-36', label: 'Award History', type: 'table', required: false, section: 'Awards & Social Responsibility', order: 36, visible: true },
  { id: 'rag-37', label: 'AI Strategy & Tools', type: 'textarea', required: false, section: 'Awards & Social Responsibility', order: 37, visible: true },
  { id: 'rag-38', label: 'CSR Policies & Impact', type: 'table', required: false, section: 'Awards & Social Responsibility', order: 38, visible: true },

  // Section: Add-On
  { id: 'rag-39', label: 'Investment Areas', type: 'table', required: false, section: 'Add-On', order: 39, visible: true },
  { id: 'rag-40', label: 'Strategic Development Goals', type: 'textarea', required: false, section: 'Add-On', order: 40, visible: true },

  // Section: Attachments
  { id: 'rag-41', label: 'Organisational Chart', type: 'file', required: true, section: 'Attachments', order: 41, visible: true },
  { id: 'rag-42', label: 'Company Profile (Creds)', type: 'file', required: true, section: 'Attachments', order: 42, visible: true },
]

const DEFAULT_PRODUCTION_RFI: RfiField[] = [
  // Section: General Information
  { id: 'rpr-1', label: 'Registered Business Name', type: 'text', required: true, section: 'General Information', order: 1, visible: true },
  { id: 'rpr-2', label: 'VAT Registration Number', type: 'text', required: true, section: 'General Information', order: 2, visible: true },
  { id: 'rpr-3', label: 'Year Established', type: 'number', required: true, section: 'General Information', order: 3, visible: true },
  
  // Section: Organisation & Structure
  { id: 'rpr-4', label: '# of Employees', type: 'select', required: true, section: 'Organisation & Structure', order: 4, visible: true },
  { id: 'rpr-5', label: 'Production Category', type: 'select', required: true, section: 'Organisation & Structure', order: 5, visible: true },

  // Section: Capabilities & Services
  { id: 'rpr-6', label: 'Specialties', type: 'textarea', required: true, section: 'Capabilities & Services', order: 6, visible: true },
  { id: 'rpr-7', label: 'Service Coverage (%)', type: 'table', required: true, section: 'Capabilities & Services', order: 7, visible: true },
  { id: 'rpr-8', label: 'In-house Post-Production', type: 'checkbox', required: false, section: 'Capabilities & Services', order: 8, visible: true },

  // Section: Talent & Roster
  { id: 'rpr-9', label: 'Directors Roster', type: 'table', required: true, section: 'Talent & Roster', order: 9, visible: true },
  { id: 'rpr-10', label: 'Executive Producer Profiles', type: 'table', required: true, section: 'Talent & Roster', order: 10, visible: true },

  // Section: Awards & History
  { id: 'rpr-11', label: 'Award History', type: 'table', required: false, section: 'Awards & History', order: 11, visible: true },

  // Section: Compliance & Governance
  { id: 'rpr-12', label: 'Insurance Certificates', type: 'file', required: true, section: 'Compliance & Governance', order: 12, visible: true },
  { id: 'rpr-13', label: 'Quality Control Protocols', type: 'textarea', required: false, section: 'Compliance & Governance', order: 13, visible: true },
  { id: 'rpr-14', label: 'CSR Policies', type: 'table', required: false, section: 'Compliance & Governance', order: 14, visible: true },
]

export function getRfiFields(categoryId?: string): RfiField[] {
  if (typeof window === 'undefined') return []
  try {
    const mapStored = localStorage.getItem(KEYS.rfiFieldsMap)
    const map: Record<string, RfiField[]> = mapStored ? JSON.parse(mapStored) : {}
    
    if (categoryId && map[categoryId]) {
      return map[categoryId]
    }
    
    // Legacy migration or defaults
    if (!categoryId || categoryId === 'cat-agency') {
      if (map['cat-agency']) return map['cat-agency']
      // Check legacy single key
      const legacy = localStorage.getItem('va_rfi_fields')
      if (legacy) {
        const fields = JSON.parse(legacy)
        return fields
      }
      return DEFAULT_AGENCY_RFI
    }
    
    if (categoryId === 'cat-production') {
      return map['cat-production'] || DEFAULT_PRODUCTION_RFI
    }
    
    return map[categoryId || ''] || []
  } catch (e) {
    console.error('Error loading RFI fields:', e)
    return []
  }
}

export function saveRfiFields(categoryId: string, fields: RfiField[]) {
  if (typeof window === 'undefined') return
  try {
    const mapStored = localStorage.getItem(KEYS.rfiFieldsMap)
    const map: Record<string, RfiField[]> = mapStored ? JSON.parse(mapStored) : {}
    map[categoryId] = fields
    localStorage.setItem(KEYS.rfiFieldsMap, JSON.stringify(map))
  } catch (e) {
    console.error('Error saving RFI fields:', e)
  }
}

export function resetRfiToDefaults(categoryId: string) {
  if (typeof window === 'undefined') return
  try {
    const mapStored = localStorage.getItem(KEYS.rfiFieldsMap)
    const map: Record<string, RfiField[]> = mapStored ? JSON.parse(mapStored) : {}
    
    if (categoryId === 'cat-agency') {
      map[categoryId] = DEFAULT_AGENCY_RFI
    } else if (categoryId === 'cat-production') {
      map[categoryId] = DEFAULT_PRODUCTION_RFI
    } else {
      map[categoryId] = []
    }
    
    localStorage.setItem(KEYS.rfiFieldsMap, JSON.stringify(map))
  } catch (e) {
    console.error('Error resetting RFI fields:', e)
  }
}

export function getVAInternalUsers(): VAInternalUser[] {
  try { return JSON.parse(localStorage.getItem(KEYS.internalUsers) || '[]') } catch { return [] }
}

export function createVAInternalUser(data: Omit<VAInternalUser, 'id' | 'status'>) {
  const users = getVAInternalUsers()
  const u: VAInternalUser = { ...data, id: `int-${Date.now()}`, status: 'active' }
  users.unshift(u)
  localStorage.setItem(KEYS.internalUsers, JSON.stringify(users))
  return u
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

// ── Dummy Data Seeder ─────────────────────────────────────────────────────────

export function seedDummyData() {
  const dummyOrgs: OrgRecord[] = [
    { id: `org-a1`, type: 'agency', name: 'Ogilvy UK', country: 'United Kingdom', status: 'active', createdAt: new Date(Date.now() - 30 * 86400000).toISOString(), memberCount: 15, latestUpdateAt: new Date(Date.now() - 200 * 86400000).toISOString() },
    { id: `org-a2`, type: 'agency', name: 'BBDO New York', country: 'United States', status: 'active', createdAt: new Date(Date.now() - 25 * 86400000).toISOString(), memberCount: 8, latestUpdateAt: new Date().toISOString() },
    { id: `org-a3`, type: 'agency', name: 'Publicis Conseil', country: 'France', status: 'active', createdAt: new Date(Date.now() - 22 * 86400000).toISOString(), memberCount: 12 },
    { id: `org-a4`, type: 'agency', name: 'Dentsu Inc.', country: 'Japan', status: 'active', createdAt: new Date(Date.now() - 15 * 86400000).toISOString(), memberCount: 5 },
    { id: `org-p1`, type: 'production', name: 'Smuggler', country: 'United States', status: 'active', createdAt: new Date(Date.now() - 20 * 86400000).toISOString(), memberCount: 3 },
    { id: `org-p2`, type: 'production', name: 'Iconoclast', country: 'France', status: 'active', createdAt: new Date(Date.now() - 18 * 86400000).toISOString(), memberCount: 4 },
    { id: `org-p3`, type: 'production', name: 'Partizan', country: 'United Kingdom', status: 'active', createdAt: new Date(Date.now() - 10 * 86400000).toISOString(), memberCount: 2 },
    { id: `org-p4`, type: 'production', name: 'MJZ', country: 'United States', status: 'active', createdAt: new Date(Date.now() - 5 * 86400000).toISOString(), memberCount: 7, latestUpdateAt: new Date(Date.now() - 200 * 86400000).toISOString() },
  ]
  saveOrgs(dummyOrgs)
  
  // Seed client companies
  const dummyClients: ClientCompany[] = [
    { id: 'ccmp-1', name: 'Coca-Cola', holding: 'The Coca-Cola Company', tokens: 0, tokensUsed: 0, packageSize: 6, status: 'active', createdAt: new Date().toISOString() },
    { id: 'ccmp-2', name: 'Coca-Cola Italy', holding: 'The Coca-Cola Company', region: 'Europe', country: 'Italy', tokens: 12, tokensUsed: 3, packageSize: 6, status: 'active', createdAt: new Date().toISOString() }
  ]
  saveClientCompanies(dummyClients)

  // Seed Va Internal users
  const dummyVAUsers: VAInternalUser[] = [
    { id: 'int-1', name: 'Super Admin', email: 'super@vaconsulting.com', role: 'super_admin', status: 'active' },
    { id: 'int-2', name: 'Dirk Admin', email: 'dirk@vaconsulting.com', role: 'admin', status: 'active' }
  ]
  localStorage.setItem(KEYS.internalUsers, JSON.stringify(dummyVAUsers))

  const pending: PendingRegistration[] = [
    {
      id: `reg-p1`, type: 'agency', companyName: 'TBWA\\Chiat\\Day', submittedByUserId: 'usr-demo1', submittedByName: 'Alice Chang', submittedByEmail: 'alice@tbwa.test', submittedAt: new Date(Date.now() - 2 * 86400000).toISOString(), status: 'pending',
      profileData: { businessName: 'TBWA\\Chiat\\Day', country: 'United States', city: 'Los Angeles', employees: '401 +' }
    },
    {
      id: `reg-p2`, type: 'production', companyName: 'Stink Films', submittedByUserId: 'usr-demo2', submittedByName: 'Bob Harris', submittedByEmail: 'bob@stink.test', submittedAt: new Date(Date.now() - 1 * 86400000).toISOString(), status: 'pending',
      profileData: { businessName: 'Stink Films', country: 'United Kingdom', city: 'London', companyLevel: 'Worldwide Headquarter' }
    },
    {
      id: `reg-p3`, type: 'agency', companyName: 'Wieden+Kennedy', submittedByUserId: 'usr-demo3', submittedByName: 'Carol Dan', submittedByEmail: 'carol@wk.test', submittedAt: new Date(Date.now() - 43200000).toISOString(), status: 'pending',
      profileData: { businessName: 'Wieden+Kennedy', country: 'United States', city: 'Portland' }
    },
     {
      id: `reg-p4`, type: 'production', companyName: 'Biscuit Filmworks', submittedByUserId: 'usr-demo4', submittedByName: 'Dave Miller', submittedByEmail: 'dave@biscuit.test', submittedAt: new Date(Date.now() - 21600000).toISOString(), status: 'pending',
      profileData: { businessName: 'Biscuit Filmworks', country: 'United States', city: 'Los Angeles' }
    }
  ]
  saveRegistrations(pending)

  const logs: ActivityLogEntry[] = [
    { id: 'act-1', type: 'signup', description: 'New production registration submitted: Biscuit Filmworks by Dave Miller', timestamp: new Date(Date.now() - 21600000).toISOString() },
    { id: 'act-2', type: 'signup', description: 'New agency registration submitted: Wieden+Kennedy by Carol Dan', timestamp: new Date(Date.now() - 43200000).toISOString() },
    { id: 'act-3', type: 'approval', description: 'Approved production: MJZ', timestamp: new Date(Date.now() - 5 * 86400000).toISOString() },
    { id: 'act-4', type: 'rejection', description: 'Rejected agency: FakeAgency Ltd — Incomplete data', timestamp: new Date(Date.now() - 6 * 86400000).toISOString() },
    { id: 'act-5', type: 'signup', description: 'New production registration submitted: Stink Films by Bob Harris', timestamp: new Date(Date.now() - 1 * 86400000).toISOString() },
    { id: 'act-6', type: 'signup', description: 'New agency registration submitted: TBWA\\Chiat\\Day by Alice Chang', timestamp: new Date(Date.now() - 2 * 86400000).toISOString() },
    { id: 'act-7', type: 'org_create', description: 'Admin created production: Partizan', timestamp: new Date(Date.now() - 10 * 86400000).toISOString() },
  ]
  localStorage.setItem(KEYS.activityLog, JSON.stringify(logs))
}
