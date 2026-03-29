'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import type { Company } from '@/lib/mock-data'
import type { AgencyClient } from '@/lib/agency-client-types'
import { mergeListingDisplay } from '@/lib/company-listing-merge'

export function useCompanyListing(companyId: string, baseline: Company | undefined) {
  const [remote, setRemote] = useState<{
    agencyClients: AgencyClient[]
    sectors: string[]
  } | null>(null)
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    if (!companyId) {
      setLoading(false)
      return
    }
    setLoading(true)
    try {
      const r = await fetch(`/api/companies/${companyId}/listing`, { cache: 'no-store' })
      if (!r.ok) return
      const j = (await r.json()) as { agencyClients: AgencyClient[]; sectors: string[] }
      setRemote({
        agencyClients: j.agencyClients,
        sectors: j.sectors,
      })
    } catch {
      /* keep baseline */
    } finally {
      setLoading(false)
    }
  }, [companyId])

  useEffect(() => {
    refresh()
  }, [refresh])

  const merged = useMemo(() => {
    if (!baseline) return { agencyClients: [] as AgencyClient[], sectors: [] as string[] }
    if (!remote) return mergeListingDisplay(baseline, null)
    return { agencyClients: remote.agencyClients, sectors: remote.sectors }
  }, [baseline, remote])

  return { ...merged, loading, refresh }
}
