'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updatePassword,
  type AuthError,
} from 'firebase/auth'
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db } from './firebase'
import { User } from './mock-data'
import { acceptInvitation, getInvitationByToken, addMember } from './admin-store'

// ── Test accounts auto-created on first login ─────────────────────────────────
const TEST_ACCOUNTS: Record<string, { password: string; profile: Partial<User> }> = {
  'superadmin@va-consulting.com': { password: 'password', profile: { name: 'Super Admin', role: 'super_admin', accountType: 'vendor', status: 'active' } },
  'admin@va-consulting.com':      { password: 'password', profile: { name: 'Admin User',  role: 'admin',       accountType: 'vendor', status: 'active' } },
  'demo@requisti.com':            { password: 'password', profile: { name: 'Demo Vendor', role: 'vendor',      accountType: 'vendor', status: 'active' } },
  'client@requisti.com':          { password: 'password', profile: { name: 'Demo Client', role: 'client',      accountType: 'client', tier: 'free', status: 'active' } },
}

// ── Cookie helpers ────────────────────────────────────────────────────────────
function setCookies(u: User) {
  document.cookie = `requisti_auth=1; path=/; max-age=86400`
  const role = u.role === 'super_admin' ? 'super_admin' : u.role === 'admin' ? 'admin' : 'user'
  document.cookie = `requisti_role=${role}; path=/; max-age=86400`
  if (u.mustChangePassword) {
    document.cookie = `requisti_setup=1; path=/; max-age=86400`
  } else {
    document.cookie = `requisti_setup=; path=/; max-age=0`
  }
}

function clearCookies() {
  document.cookie = 'requisti_auth=; path=/; max-age=0'
  document.cookie = 'requisti_role=; path=/; max-age=0'
  document.cookie = 'requisti_setup=; path=/; max-age=0'
}

// ── Firestore profile helpers ─────────────────────────────────────────────────
async function loadUserProfile(uid: string): Promise<User | null> {
  try {
    const snap = await getDoc(doc(db, 'users', uid))
    if (snap.exists()) return snap.data() as User
  } catch (e) {
    console.warn('[Auth] loadUserProfile failed:', (e as Error).message)
  }
  return null
}

async function saveUserProfile(uid: string, profile: User) {
  try {
    await setDoc(doc(db, 'users', uid), { ...profile, updatedAt: serverTimestamp() }, { merge: true })
  } catch (e) {
    console.warn('[Auth] saveUserProfile failed:', (e as Error).message)
  }
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAdmin: boolean
  isSuperAdmin: boolean
  isModerator: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string; mustChangePassword?: boolean; role?: string }>
  signup: (data: SignupData) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  setAccountType: (type: 'vendor' | 'client') => void
  addCompanyId: (id: string) => void
  acceptInviteToken: (token: string) => Promise<{ success: boolean; orgId?: string; orgName?: string; error?: string }>
  completeSetup: (data: { name: string; mobile: string; region?: string; country?: string; newPassword?: string }) => Promise<{ success: boolean; error?: string }>
}

export interface SignupData {
  name: string
  email: string
  password: string
  inviteToken?: string
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const emailLower = (firebaseUser.email ?? '').toLowerCase()
        // Test accounts: never depend on Firestore — use hardcoded profile immediately
        if (TEST_ACCOUNTS[emailLower]) {
          const profile: User = { id: firebaseUser.uid, email: emailLower, ...TEST_ACCOUNTS[emailLower].profile } as User
          saveUserProfile(firebaseUser.uid, profile) // best-effort, non-blocking
          setUser(profile)
          setCookies(profile)
          setIsLoading(false)
          return
        }
        // Real accounts: load from Firestore
        const profile = await loadUserProfile(firebaseUser.uid)
        if (profile) {
          setUser(profile)
          setCookies(profile)
        } else {
          await signOut(auth)
          clearCookies()
          setUser(null)
        }
      } else {
        clearCookies()
        setUser(null)
      }
      setIsLoading(false)
    })
    return unsub
  }, [])

  const isAdmin = user?.role === 'admin' || user?.role === 'super_admin'
  const isSuperAdmin = user?.role === 'super_admin'
  const isModerator = user?.orgRole === 'moderator' || user?.role === 'admin' || user?.role === 'super_admin'

  const login = useCallback(async (email: string, password: string): Promise<{ success: boolean; error?: string; mustChangePassword?: boolean; role?: string }> => {
    const emailLower = email.toLowerCase()
    try {
      const cred = await signInWithEmailAndPassword(auth, emailLower, password)
      // Test accounts: never depend on Firestore
      if (TEST_ACCOUNTS[emailLower]) {
        const profile: User = { id: cred.user.uid, email: emailLower, ...TEST_ACCOUNTS[emailLower].profile } as User
        setUser(profile)
        setCookies(profile)
        saveUserProfile(cred.user.uid, profile) // best-effort, non-blocking
        return { success: true, mustChangePassword: false, role: profile.role }
      }
      // Real accounts: load from Firestore
      const profile = await loadUserProfile(cred.user.uid)
      if (!profile) {
        await signOut(auth)
        return { success: false, error: 'User profile not found. Please contact support.' }
      }
      setUser(profile)
      setCookies(profile)
      return { success: true, mustChangePassword: profile.mustChangePassword, role: profile.role }
    } catch (err) {
      const fbErr = err as AuthError
      // Auto-create test accounts in Firebase Auth on first use
      if (
        (fbErr.code === 'auth/user-not-found' || fbErr.code === 'auth/invalid-credential') &&
        TEST_ACCOUNTS[emailLower] &&
        TEST_ACCOUNTS[emailLower].password === password
      ) {
        try {
          const cred = await createUserWithEmailAndPassword(auth, emailLower, password)
          const profile: User = { id: cred.user.uid, email: emailLower, ...TEST_ACCOUNTS[emailLower].profile } as User
          setUser(profile)
          setCookies(profile)
          saveUserProfile(cred.user.uid, profile) // best-effort, non-blocking
          return { success: true, mustChangePassword: false, role: profile.role }
        } catch (createErr) {
          return { success: false, error: (createErr as AuthError).message }
        }
      }
      if (fbErr.code === 'auth/wrong-password' || fbErr.code === 'auth/invalid-credential') {
        return { success: false, error: 'Invalid email or password.' }
      }
      if (fbErr.code === 'auth/user-not-found') {
        return { success: false, error: 'No account found with this email.' }
      }
      if (fbErr.code === 'auth/too-many-requests') {
        return { success: false, error: 'Too many failed attempts. Please try again later.' }
      }
      return { success: false, error: 'Login failed. Please try again.' }
    }
  }, [])

  const signup = useCallback(async (data: SignupData): Promise<{ success: boolean; error?: string }> => {
    try {
      const cred = await createUserWithEmailAndPassword(auth, data.email.toLowerCase(), data.password)
      const profile: User = {
        id: cred.user.uid,
        email: data.email.toLowerCase(),
        name: data.name,
        role: 'client',
        status: 'active',
        companyIds: [],
      }
      await saveUserProfile(cred.user.uid, profile)
      setUser(profile)
      setCookies(profile)
      return { success: true }
    } catch (err) {
      const fbErr = err as AuthError
      if (fbErr.code === 'auth/email-already-in-use') return { success: false, error: 'An account with this email already exists.' }
      if (fbErr.code === 'auth/weak-password') return { success: false, error: 'Password must be at least 6 characters.' }
      return { success: false, error: 'Signup failed. Please try again.' }
    }
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
      setCookies(updated)
      saveUserProfile(prev.id, updated)
      return updated
    })
  }, [])

  const addCompanyId = useCallback((id: string) => {
    setUser(prev => {
      if (!prev) return prev
      const existing = prev.companyIds ?? []
      if (existing.includes(id)) return prev
      const updated: User = { ...prev, companyIds: [...existing, id], status: 'active' }
      setCookies(updated)
      saveUserProfile(prev.id, updated)
      return updated
    })
  }, [])

  const acceptInviteToken = useCallback(async (token: string) => {
    if (!user) return { success: false, error: 'Not logged in' }
    const invitation = getInvitationByToken(token)
    if (!invitation) return { success: false, error: 'Invalid or expired invite link' }
    if (invitation.status !== 'pending') return { success: false, error: 'This invite has already been used' }

    acceptInvitation(token, user.id)
    addMember(invitation.orgId, user.id, user.name, user.email, 'moderator')

    setUser(prev => {
      if (!prev) return prev
      const updated: User = { ...prev, accountType: 'vendor', role: 'vendor', orgId: invitation.orgId, orgRole: 'moderator', status: 'active' }
      setCookies(updated)
      saveUserProfile(prev.id, updated)
      return updated
    })

    return { success: true, orgId: invitation.orgId, orgName: invitation.orgName }
  }, [user])

  const completeSetup = useCallback(async (data: { name: string; mobile: string; region?: string; country?: string; newPassword?: string }): Promise<{ success: boolean; error?: string }> => {
    try {
      const firebaseUser = auth.currentUser
      if (!firebaseUser) return { success: false, error: 'Not authenticated' }
      // Change password in Firebase Auth if provided
      if (data.newPassword) {
        await updatePassword(firebaseUser, data.newPassword)
      }
      const updates: Partial<User> = {
        name: data.name,
        mustChangePassword: false,
        firstLoginComplete: true,
        ...(data.mobile ? { mobile: data.mobile } : {}),
        ...(data.region ? { region: data.region } : {}),
        ...(data.country ? { country: data.country } : {}),
      }
      setUser(prev => {
        if (!prev) return prev
        const updated: User = { ...prev, ...updates }
        setCookies(updated)
        saveUserProfile(prev.id, updated)
        return updated
      })
      return { success: true }
    } catch (err) {
      const fbErr = err as AuthError
      if (fbErr.code === 'auth/requires-recent-login') {
        return { success: false, error: 'Session expired. Please log in again to change your password.' }
      }
      return { success: false, error: 'Failed to complete setup. Please try again.' }
    }
  }, [])

  const logout = useCallback(() => {
    signOut(auth).catch(() => {})
    setUser(null)
    clearCookies()
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
