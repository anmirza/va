import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'
import { randomUUID } from 'crypto'
import { canUserEditCompany } from '@/lib/company-listing-auth'
import { getCompanyById } from '@/lib/mock-data'

const ALLOWED = new Set(['image/png', 'image/jpeg', 'image/webp', 'image/gif'])
const MAX_BYTES = 2 * 1024 * 1024

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id: companyId } = await context.params
  const userId = request.headers.get('x-user-id')
  if (!canUserEditCompany(userId, companyId)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }
  if (!getCompanyById(companyId)) {
    return NextResponse.json({ error: 'Company not found' }, { status: 404 })
  }
  let formData: FormData
  try {
    formData = await request.formData()
  } catch {
    return NextResponse.json({ error: 'Expected multipart form' }, { status: 400 })
  }
  const file = formData.get('file')
  if (!file || !(file instanceof Blob)) {
    return NextResponse.json({ error: 'Missing file' }, { status: 400 })
  }
  const type = file.type || ''
  if (!ALLOWED.has(type)) {
    return NextResponse.json({ error: 'Only PNG, JPEG, WebP, or GIF allowed' }, { status: 400 })
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: 'File too large (max 2MB)' }, { status: 400 })
  }
  const ext =
    type === 'image/png'
      ? '.png'
      : type === 'image/jpeg'
        ? '.jpg'
        : type === 'image/webp'
          ? '.webp'
          : '.gif'
  const buf = Buffer.from(await file.arrayBuffer())
  const dir = path.join(process.cwd(), 'public', 'uploads', 'client-logos', companyId)
  await fs.mkdir(dir, { recursive: true })
  const name = `${randomUUID()}${ext}`
  const full = path.join(dir, name)
  await fs.writeFile(full, buf)
  const url = `/uploads/client-logos/${companyId}/${name}`
  return NextResponse.json({ url })
}
