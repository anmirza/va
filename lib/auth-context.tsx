'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { User, mockUsers } from './mock-data'

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signup: (data: SignupData) => Promise<{ success: boolean; error?: string }>
  logout: () => void
}

export interface SignupData {
  name: string
  email: string
  password: string
  role: 'agency_owner' | 'talent' | 'marketer'
}

const AuthContext = createContext<AuthContextType | null>(null)

const STORAGE_KEY = 'requisti_user'

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
    // Find in mock users OR accept any email with password "password"
    const found = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase())
    if (found) {
      setUser(found)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(found))
      return { success: true }
    }
    // Allow demo login with any email if password is "password"
    if (_password === 'password') {
      const newUser: User = {
        id: `user-${Date.now()}`,
        email,
        name: email.split('@')[0],
        role: 'marketer',
      }
      setUser(newUser)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser))
      return { success: true }
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
      role: data.role,
    }
    setUser(newUser)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser))
    return { success: true }
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    localStorage.removeItem(STORAGE_KEY)
  }, [])

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
