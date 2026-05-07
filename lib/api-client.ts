/**
 * api-client.ts
 * Typed HTTP client for the Requisti Node.js backend.
 * Automatically attaches Firebase Auth JWT to every request.
 */

import { auth } from './firebase'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000'

async function getToken(): Promise<string | null> {
  try {
    return (await auth.currentUser?.getIdToken()) ?? null
  } catch {
    return null
  }
}

async function request<T = unknown>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = await getToken()

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers ?? {}),
    },
  })

  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: res.statusText }))
    const err = new Error(body.error ?? `API error ${res.status}`) as Error & { status: number }
    err.status = res.status
    throw err
  }

  return res.json() as Promise<T>
}

// ── Convenience methods ───────────────────────────────────────────────────────

export const api = {
  get:    <T>(path: string)                    => request<T>(path, { method: 'GET' }),
  post:   <T>(path: string, body: unknown)     => request<T>(path, { method: 'POST',  body: JSON.stringify(body) }),
  patch:  <T>(path: string, body: unknown)     => request<T>(path, { method: 'PATCH', body: JSON.stringify(body) }),
  put:    <T>(path: string, body: unknown)     => request<T>(path, { method: 'PUT',   body: JSON.stringify(body) }),
  delete: <T>(path: string)                    => request<T>(path, { method: 'DELETE' }),
}

// ── Typed helpers (mirrors admin-firestore.ts functions) ──────────────────────

export const statsApi = {
  getAdminStats: () => api.get<{ totalAgencies: number; totalProduction: number; pendingApprovals: number; totalUsers: number }>('/api/stats'),
}

export const orgsApi = {
  getAll:      (type?: string) => api.get<any[]>(`/api/orgs${type ? `?type=${type}` : ''}`),
  getById:     (id: string)    => api.get<any>(`/api/orgs/${id}`),
  create:      (data: any)     => api.post<any>('/api/orgs', data),
  update:      (id: string, data: any) => api.patch<any>(`/api/orgs/${id}`, data),
  remove:      (id: string)    => api.delete<{ success: boolean }>(`/api/orgs/${id}`),
}

export const clientsApi = {
  getAll:        ()           => api.get<any[]>('/api/clients'),
  getById:       (id: string) => api.get<any>(`/api/clients/${id}`),
  getByUserId:   (uid: string) => api.get<any>(`/api/clients/by-user/${uid}`),
  create:        (data: any)  => api.post<any>('/api/clients', data),
  update:        (id: string, data: any) => api.patch<any>(`/api/clients/${id}`, data),
  addTokens:     (id: string, amount: number) => api.post<any>(`/api/clients/${id}/add-tokens`, { amount }),
  deductToken:   (id: string) => api.post<{ success: boolean; remaining: number }>(`/api/clients/${id}/deduct-token`, {}),
  getUsers:      (id: string) => api.get<any[]>(`/api/clients/${id}/users`),
  createUser:    (id: string, data: any) => api.post<any>(`/api/clients/${id}/users`, data),
  updateUser:    (companyId: string, userId: string, data: any) => api.patch<any>(`/api/clients/${companyId}/users/${userId}`, data),
  suspendUser:   (companyId: string, userId: string) => api.delete<{ success: boolean }>(`/api/clients/${companyId}/users/${userId}`),
}

export const usersApi = {
  getAll:          ()           => api.get<any[]>('/api/users'),
  getInternal:     ()           => api.get<any[]>('/api/users/internal'),
  getById:         (id: string) => api.get<any>(`/api/users/${id}`),
  createInternal:  (data: any)  => api.post<any>('/api/users/internal', data),
  update:          (id: string, data: any) => api.patch<any>(`/api/users/${id}`, data),
  suspend:         (id: string) => api.delete<{ success: boolean }>(`/api/users/${id}`),
  sync:            (data?: any) => api.post<any>('/api/users/sync', data ?? {}),
}

export const registrationsApi = {
  getAll:    ()           => api.get<any[]>('/api/registrations'),
  getById:   (id: string) => api.get<any>(`/api/registrations/${id}`),
  submit:    (data: any)  => api.post<any>('/api/registrations', data),
  approve:   (id: string) => api.post<any>(`/api/registrations/${id}/approve`, {}),
  reject:    (id: string, reason?: string) => api.post<any>(`/api/registrations/${id}/reject`, { reason }),
}

export const settingsApi = {
  getCategories:     ()                      => api.get<any[]>('/api/settings/categories'),
  saveCategory:      (data: any)             => api.post<any>('/api/settings/categories', data),
  deleteCategory:    (id: string)            => api.delete<{ success: boolean }>(`/api/settings/categories/${id}`),
  getRfiFields:      (categoryId: string)    => api.get<any[]>(`/api/settings/rfi/${categoryId}`),
  saveRfiFields:     (categoryId: string, fields: any[]) => api.put<any[]>(`/api/settings/rfi/${categoryId}`, { fields }),
  getDisclaimers:    ()                      => api.get<{ agency: string; production: string }>('/api/settings/disclaimers'),
  saveDisclaimers:   (data: { agency?: string; production?: string }) => api.put<any>('/api/settings/disclaimers', data),
}

export const activityApi = {
  getRecent: (limit = 10) => api.get<any[]>(`/api/activity?limit=${limit}`),
}
