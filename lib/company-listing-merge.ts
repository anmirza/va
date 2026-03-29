import type { Company } from '@/lib/mock-data'
import type { AgencyClient, SavedCompanyListing } from '@/lib/agency-client-types'

/** Build structured clients from legacy mock company fields. */
export function clientsFromCompany(c: Company): AgencyClient[] {
  if (c.agencyClients && c.agencyClients.length > 0) {
    return [...c.agencyClients].sort((a, b) => a.sortOrder - b.sortOrder)
  }
  return c.clients.map((name, i) => ({
    id: `legacy-${c.id}-${i}`,
    name,
    industry: c.clientIndustries?.[i],
    logoUrl: null,
    sortOrder: i,
  }))
}

/** Display listing: saved override replaces mock when present. */
export function mergeListingDisplay(
  base: Company,
  saved: SavedCompanyListing | null
): { agencyClients: AgencyClient[]; sectors: string[] } {
  if (!saved) {
    return {
      agencyClients: clientsFromCompany(base),
      sectors: [...base.sectors],
    }
  }
  return {
    agencyClients: [...saved.agencyClients].sort((a, b) => a.sortOrder - b.sortOrder),
    sectors: [...saved.sectors],
  }
}
