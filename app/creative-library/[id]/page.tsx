import { redirect, notFound } from 'next/navigation'
import { getCampaignById } from '@/lib/mock-data'

export default async function CreativeLibraryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const campaign = getCampaignById(id)
  if (!campaign) notFound()
  redirect(`/campaigns/${id}`)
}
