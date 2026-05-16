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
  'superadmin@va-consulting.com': { password: 'password', profile: { name: 'Super Admin', role: 'super_admin', accountType: 'internal', status: 'active' } },
  'admin@va-consulting.com':      { password: 'password', profile: { name: 'Admin User',  role: 'admin',       accountType: 'internal', status: 'active' } },
  'demo@requisti.com':            { password: 'password', profile: { name: 'Demo Vendor', role: 'vendor',      accountType: 'vendor',   status: 'active' } },
  'client@requisti.com':          { password: 'password', profile: { name: 'Demo Client', role: 'client',      accountType: 'client',   tier: 'free', status: 'active' } },
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

// ── Profile cache helpers (localStorage fallback) ────────────────────────────
// Used so that transient Firestore errors never wipe out the React user state.
// A successful profile load always writes to cache; sign-out clears it.
const PROFILE_CACHE_KEY = (uid: string) => `requisti_profile_${uid}`

function cacheProfile(uid: string, profile: User) {
  try { localStorage.setItem(PROFILE_CACHE_KEY(uid), JSON.stringify(profile)) } catch {}
}
function getCachedProfile(uid: string): User | null {
  try {
    const raw = localStorage.getItem(PROFILE_CACHE_KEY(uid))
    return raw ? (JSON.parse(raw) as User) : null
  } catch { return null }
}
function clearCachedProfile(uid: string) {
  try { localStorage.removeItem(PROFILE_CACHE_KEY(uid)) } catch {}
}

// ── Firestore profile helpers ─────────────────────────────────────────────────
// Returns { profile, found } — distinguished from { profile: null } due to error vs missing doc.
// Retries up to 3 times on transient Firestore errors (network blip, quota, cold start)
// to prevent false logouts during page refresh when Firebase restores a valid session.
async function loadUserProfile(uid: string): Promise<{ profile: User | null; found: boolean }> {
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const snap = await getDoc(doc(db, 'users', uid))
      if (snap.exists()) return { profile: snap.data() as User, found: true }
      return { profile: null, found: false }
    } catch (e) {
      console.warn(`[Auth] loadUserProfile attempt ${attempt + 1} failed:`, (e as Error).message)
      // Wait 1s, then 2s before the next retry — do NOT sign out on transient error
      if (attempt < 2) await new Promise(r => setTimeout(r, 1000 * (attempt + 1)))
    }
  }
  // All retries exhausted — assume transient error, keep session alive
  return { profile: null, found: true }
}

async function saveUserProfile(uid: string, profile: User) {
  cacheProfile(uid, profile) // keep localStorage cache up-to-date immediately
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
    // Debounce timer for null callbacks — Firebase sometimes fires null briefly during
    // token refresh (every ~1 hour) before firing again with the real user.
    // We wait 1 second before treating a null as a genuine sign-out.
    let signOutTimer: ReturnType<typeof setTimeout> | null = null

    const handleSignedOut = () => {
      clearCookies()
      setUser(null)
      setIsLoading(false)
    }

    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      // Cancel any pending sign-out from a previous null callback
      if (signOutTimer) { clearTimeout(signOutTimer); signOutTimer = null }

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
        const { profile, found } = await loadUserProfile(firebaseUser.uid)
        if (profile) {
          // Success — update cache and React state
          cacheProfile(firebaseUser.uid, profile)
          setUser(profile)
          setCookies(profile)
        } else if (!found) {
          // Document confirmed missing — sign out for real
          clearCachedProfile(firebaseUser.uid)
          await signOut(auth)
          clearCookies()
          setUser(null)
        } else {
          // Transient Firestore error — fall back to cached profile so user isn't kicked out
          const cached = getCachedProfile(firebaseUser.uid)
          if (cached) {
            console.warn('[Auth] Firestore unavailable — using cached profile for', firebaseUser.uid)
            setUser(cached)
            setCookies(cached)
          }
          // No cache: first-ever load with Firestore down — user stays null but NOT signed out
        }
        setIsLoading(false)
      } else {
        // Null received — could be a transient null during token refresh.
        // Delay 1s before acting: if a real user arrives in this window, we cancel the timeout.
        // This prevents spurious logouts during Firebase's hourly token refresh cycle.
        signOutTimer = setTimeout(handleSignedOut, 1000)
      }
    })

    return () => {
      unsub()
      if (signOutTimer) clearTimeout(signOutTimer)
    }
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
      const { profile } = await loadUserProfile(cred.user.uid)
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
    if (user) clearCachedProfile(user.id)
    signOut(auth).catch(() => {})
    setUser(null)
    clearCookies()
  }, [user])

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
