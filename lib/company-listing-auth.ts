import { mockUsers } from '@/lib/mock-data'

/** Demo auth: user must own the company via companyId or companyIds. */
export function canUserEditCompany(userId: string | null | undefined, companyId: string): boolean {
  if (!userId) return false
  const u = mockUsers.find(x => x.id === userId)
  if (!u) return false
  if (u.accountType !== 'vendor') return false
  if (u.companyId === companyId) return true
  return u.companyIds?.includes(companyId) ?? false
}
