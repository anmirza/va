'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'

interface FollowState {
  agencies: string[]
  talent: string[]
  campaigns: string[]
}

interface FollowContextType {
  followed: FollowState
  toggleAgency: (id: string) => void
  toggleTalent: (id: string) => void
  toggleCampaign: (id: string) => void
  isFollowingAgency: (id: string) => boolean
  isFollowingTalent: (id: string) => boolean
  isSavedCampaign: (id: string) => boolean
}

const FollowContext = createContext<FollowContextType | null>(null)
const STORAGE_KEY = 'requisti_follows'

export function FollowProvider({ children }: { children: React.ReactNode }) {
  const [followed, setFollowed] = useState<FollowState>({ agencies: [], talent: [], campaigns: [] })

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) setFollowed(JSON.parse(stored))
    } catch { /* ignore */ }
  }, [])

  const save = (next: FollowState) => {
    setFollowed(next)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  }

  const toggleAgency = useCallback((id: string) => {
    setFollowed(prev => {
      const next = prev.agencies.includes(id)
        ? { ...prev, agencies: prev.agencies.filter(a => a !== id) }
        : { ...prev, agencies: [...prev.agencies, id] }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }, [])

  const toggleTalent = useCallback((id: string) => {
    setFollowed(prev => {
      const next = prev.talent.includes(id)
        ? { ...prev, talent: prev.talent.filter(t => t !== id) }
        : { ...prev, talent: [...prev.talent, id] }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }, [])

  const toggleCampaign = useCallback((id: string) => {
    setFollowed(prev => {
      const next = prev.campaigns.includes(id)
        ? { ...prev, campaigns: prev.campaigns.filter(c => c !== id) }
        : { ...prev, campaigns: [...prev.campaigns, id] }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }, [])

  return (
    <FollowContext.Provider value={{
      followed,
      toggleAgency,
      toggleTalent,
      toggleCampaign,
      isFollowingAgency: (id) => followed.agencies.includes(id),
      isFollowingTalent: (id) => followed.talent.includes(id),
      isSavedCampaign: (id) => followed.campaigns.includes(id),
    }}>
      {children}
    </FollowContext.Provider>
  )
}

export function useFollow() {
  const ctx = useContext(FollowContext)
  if (!ctx) throw new Error('useFollow must be used within FollowProvider')
  return ctx
}
