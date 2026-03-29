/**
 * Structured client rows for directory listing (replaces parallel clients[] + clientIndustries[]).
 */
export interface AgencyClient {
  id: string
  name: string
  industry?: string
  logoUrl?: string | null
  sortOrder: number
}

export interface SavedCompanyListing {
  agencyClients: AgencyClient[]
  sectors: string[]
  updatedAt: string
}
