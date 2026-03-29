import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'
import { getCompanyById } from '@/lib/mock-data'
import { mergeListingDisplay } from '@/lib/company-listing-merge'
import { canUserEditCompany } from '@/lib/company-listing-auth'
import type { AgencyClient, SavedCompanyListing } from '@/lib/agency-client-types'

const dataPath = () => path.join(process.cwd(), 'data', 'company-listings.json')

async function readAll(): Promise<Record<string, SavedCompanyListing>> {
  try {
    const raw = await fs.readFile(dataPath(), 'utf-8')
    const p = JSON.parse(raw) as Record<string, SavedCompanyListing>
    return p && typeof p === 'object' ? p : {}
  } catch {
    return {}
  }
}

async function writeAll(data: Record<string, SavedCompanyListing>) {
  await fs.mkdir(path.dirname(dataPath()), { recursive: true })
  await fs.writeFile(dataPath(), JSON.stringify(data, null, 2), 'utf-8')
}

function validatePayload(body: unknown): { ok: true; value: SavedCompanyListing } | { ok: false; error: string } {
  if (!body || typeof body !== 'object') return { ok: false, error: 'Invalid body' }
  const b = body as Record<string, unknown>
  const agencyClients = b.agencyClients
  const sectors = b.sectors
  if (!Array.isArray(agencyClients)) return { ok: false, error: 'agencyClients must be an array' }
  if (!Array.isArray(sectors)) return { ok: false, error: 'sectors must be an array' }
  if (!sectors.every(s => typeof s === 'string')) return { ok: false, error: 'sectors must be strings' }
  for (const c of agencyClients) {
    if (!c || typeof c !== 'object') return { ok: false, error: 'Invalid client' }
    const cl = c as Record<string, unknown>
    if (typeof cl.id !== 'string' || !cl.id) return { ok: false, error: 'Client id required' }
    if (typeof cl.name !== 'string' || !cl.name.trim()) return { ok: false, error: 'Client name required' }
    if (cl.industry != null && typeof cl.industry !== 'string') return { ok: false, error: 'Invalid industry' }
    if (cl.logoUrl != null && typeof cl.logoUrl !== 'string') return { ok: false, error: 'Invalid logoUrl' }
    if (typeof cl.sortOrder !== 'number') return { ok: false, error: 'sortOrder required' }
  }
  const normalized: AgencyClient[] = agencyClients.map((c, i) => {
    const cl = c as AgencyClient
    return {
      id: cl.id,
      name: cl.name.trim(),
      industry: cl.industry?.trim() || undefined,
      logoUrl: cl.logoUrl || null,
      sortOrder: cl.sortOrder ?? i,
    }
  })
  const sectorList = sectors.map(s => String(s).trim()).filter(Boolean)
  return {
    ok: true,
    value: {
      agencyClients: normalized,
      sectors: sectorList,
      updatedAt: new Date().toISOString(),
    },
  }
}

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params
  const base = getCompanyById(id)
  if (!base) {
    return NextResponse.json({ error: 'Company not found' }, { status: 404 })
  }
  const all = await readAll()
  const saved = all[id] ?? null
  const { agencyClients, sectors } = mergeListingDisplay(base, saved)
  return NextResponse.json({
    agencyClients,
    sectors,
    hasOverride: !!saved,
  })
}

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params
  const userId = request.headers.get('x-user-id')
  if (!canUserEditCompany(userId, id)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }
  const base = getCompanyById(id)
  if (!base) {
    return NextResponse.json({ error: 'Company not found' }, { status: 404 })
  }
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }
  const v = validatePayload(body)
  if (!v.ok) {
    return NextResponse.json({ error: v.error }, { status: 400 })
  }
  const all = await readAll()
  all[id] = v.value
  await writeAll(all)
  const { agencyClients, sectors } = mergeListingDisplay(base, v.value)
  return NextResponse.json({ ok: true, agencyClients, sectors })
}
