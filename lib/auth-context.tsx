'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { User, mockUsers } from './mock-data'
import { acceptInvitation, getInvitationByToken, addMember } from './admin-store'

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAdmin: boolean
  isSuperAdmin: boolean
  isModerator: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string; mustChangePassword?: boolean }>
  signup: (data: SignupData) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  setAccountType: (type: 'vendor' | 'client') => void
  addCompanyId: (id: string) => void
  acceptInviteToken: (token: string) => Promise<{ success: boolean; orgId?: string; orgName?: string; error?: string }>
  completeSetup: (data: { name: string; mobile: string }) => void
}

export interface SignupData {
  name: string
  email: string
  password: string
  inviteToken?: string
}

const AuthContext = createContext<AuthContextType | null>(null)

const STORAGE_KEY = 'requisti_user'

function persistUser(u: User) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(u))
  // lightweight cookies so middleware can detect auth state and role
  document.cookie = `requisti_auth=1; path=/; max-age=86400`
  const role = u.role === 'super_admin' ? 'super_admin' : u.role === 'admin' ? 'admin' : 'user'
  document.cookie = `requisti_role=${role}; path=/; max-age=86400`
  if (u.mustChangePassword) {
    document.cookie = `requisti_setup=1; path=/; max-age=86400`
  } else {
    document.cookie = `requisti_setup=; path=/; max-age=0`
  }
}

function clearUser() {
  localStorage.removeItem(STORAGE_KEY)
  document.cookie = 'requisti_auth=; path=/; max-age=0'
  document.cookie = 'requisti_role=; path=/; max-age=0'
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        setUser(JSON.parse(stored))
      }
    } catch {
      // ignore parse errors
    } finally {
      setIsLoading(false)
    }
  }, [])

  const isAdmin = user?.role === 'admin' || user?.role === 'super_admin'
  const isSuperAdmin = user?.role === 'super_admin'
  const isModerator = user?.orgRole === 'moderator' || user?.role === 'admin' || user?.role === 'super_admin'

  const login = useCallback(async (email: string, _password: string) => {
    const found = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase())
    if (found) {
      setUser(found)
      persistUser(found)
      return { success: true, mustChangePassword: found.mustChangePassword }
    }
    // Allow demo login with any corporate email if password is "password"
    if (_password === 'password') {
      const newUser: User = {
        id: `user-${Date.now()}`,
        email,
        name: email.split('@')[0],
        accountType: 'client',
        role: 'client',
        tier: 'free',
        status: 'active',
        mustChangePassword: true,
      }
      setUser(newUser)
      persistUser(newUser)
      return { success: true, mustChangePassword: true }
    }
    return { success: false, error: 'Invalid email or password. Try demo@requisti.com or use "password" as password.' }
  }, [])

  const signup = useCallback(async (data: SignupData) => {
    const exists = mockUsers.find(u => u.email.toLowerCase() === data.email.toLowerCase())
    if (exists) {
      return { success: false, error: 'An account with this email already exists.' }
    }
    const newUser: User = {
      id: `user-${Date.now()}`,
      email: data.email,
      name: data.name,
      role: 'client', // temporary default, overwritten on classify
      status: 'active',
      companyIds: [],
    }
    setUser(newUser)
    persistUser(newUser)
    return { success: true }
  }, [])

  const setAccountType = useCallback((type: 'vendor' | 'client') => {
    setUser(prev => {
      if (!prev) return prev
      const updated: User = {
        ...prev,
        accountType: type,
        role: type === 'vendor' ? 'vendor' : 'client',
        tier: type === 'client' ? 'free' : undefined,
        status: type === 'vendor' ? 'pending_review' : 'active',
      }
      persistUser(updated)
      return updated
    })
  }, [])

  const addCompanyId = useCallback((id: string) => {
    setUser(prev => {
      if (!prev) return prev
      const existing = prev.companyIds ?? []
      if (existing.includes(id)) return prev
      const updated: User = {
        ...prev,
        companyIds: [...existing, id],
        status: 'active',
      }
      persistUser(updated)
      return updated
    })
  }, [])

  const acceptInviteToken = useCallback(async (token: string) => {
    if (!user) return { success: false, error: 'Not logged in' }
    const invitation = getInvitationByToken(token)
    if (!invitation) return { success: false, error: 'Invalid or expired invite link' }
    if (invitation.status !== 'pending') return { success: false, error: 'This invite has already been used' }

    // Accept the invitation in the store
    acceptInvitation(token, user.id)

    // Add member to the org
    addMember(invitation.orgId, user.id, user.name, user.email, 'moderator')

    // Update user with org info and moderator role
    setUser(prev => {
      if (!prev) return prev
      const updated: User = {
        ...prev,
        accountType: 'vendor',
        role: 'vendor',
        orgId: invitation.orgId,
        orgRole: 'moderator',
        status: 'active',
      }
      persistUser(updated)
      return updated
    })

    return { success: true, orgId: invitation.orgId, orgName: invitation.orgName }
  }, [user])

  const completeSetup = useCallback((data: { name: string; mobile: string }) => {
    setUser(prev => {
      if (!prev) return prev
      const updated: User = {
        ...prev,
        name: data.name,
        mustChangePassword: false,
        firstLoginComplete: true,
      }
      persistUser(updated)
      return updated
    })
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    clearUser()
  }, [])

  return (
    <AuthContext.Provider value={{
      user, isLoading, isAdmin, isSuperAdmin, isModerator,
      login, signup, logout, setAccountType, addCompanyId, acceptInviteToken, completeSetup,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
