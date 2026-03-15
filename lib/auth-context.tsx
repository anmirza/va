'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { User, mockUsers } from './mock-data'

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signup: (data: SignupData) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  setAccountType: (type: 'vendor' | 'client') => void
  addCompanyId: (id: string) => void
}

export interface SignupData {
  name: string
  email: string
  password: string
}

const AuthContext = createContext<AuthContextType | null>(null)

const STORAGE_KEY = 'requisti_user'

function persistUser(u: User) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(u))
  // lightweight cookie so middleware can detect auth state
  document.cookie = `requisti_auth=1; path=/; max-age=86400`
}

function clearUser() {
  localStorage.removeItem(STORAGE_KEY)
  document.cookie = 'requisti_auth=; path=/; max-age=0'
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

  const login = useCallback(async (email: string, _password: string) => {
    const found = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase())
    if (found) {
      setUser(found)
      persistUser(found)
      return { success: true }
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
      }
      setUser(newUser)
      persistUser(newUser)
      return { success: true }
    }
    return { success: false, error: 'Invalid email or password. Try demo@requisti.com or use "password" as password.' }
  }, [])

  const signup = useCallback(async (data: SignupData) => {
    const exists = mockUsers.find(u => u.email.toLowerCase() === data.email.toLowerCase())
    if (exists) {
      return { success: false, error: 'An account with this email already exists.' }
    }
    // Create user without accountType — set after classification step
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

  const logout = useCallback(() => {
    setUser(null)
    clearUser()
  }, [])

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout, setAccountType, addCompanyId }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
