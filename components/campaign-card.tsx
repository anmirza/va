'use client'

import Link from 'next/link'
import { Campaign } from '@/lib/mock-data'

interface CampaignCardProps {
  campaign: Campaign
}

export function CampaignCard({ campaign }: CampaignCardProps) {
  return (
    <Link href={`/campaigns/${campaign.id}`}>
      <div className="group relative overflow-hidden rounded-xl bg-[#1a1a1a] aspect-[4/5] cursor-pointer">
        <img
          src={campaign.thumbnail}
          alt={campaign.title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
          <p className="text-white/90 text-xs mb-2">{campaign.format.join(' / ')}</p>
          <h3 className="text-white font-bold text-base sm:text-lg mb-2 line-clamp-2 group-hover:text-[#98F5CC] transition-colors">
            {campaign.title} - {campaign.brand}
          </h3>
          <p className="text-[#98F5CC] text-sm">{campaign.agency}</p>
        </div>
      </div>
    </Link>
  )
}
