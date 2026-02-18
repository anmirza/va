'use client'

import Link from 'next/link'
import { Campaign } from '@/lib/mock-data'
import { Badge } from '@/components/ui/badge'

interface CampaignCardProps {
  campaign: Campaign
}

export function CampaignCard({ campaign }: CampaignCardProps) {
  return (
    <Link href={`/campaigns/${campaign.id}`}>
      <div className="group overflow-hidden rounded-lg bg-card cursor-pointer transition-all duration-300">
        {/* Image Container */}
        <div className="relative aspect-video overflow-hidden bg-muted">
          <img
            src={campaign.thumbnail}
            alt={campaign.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex gap-2 mb-2">
            {campaign.format.slice(0, 2).map((fmt, i) => (
              <Badge key={i} variant="outline" className="text-xs">
                {fmt}
              </Badge>
            ))}
          </div>
          <h3 className="font-serif font-bold mb-2 line-clamp-2 group-hover:text-accent transition-colors">
            {campaign.title}
          </h3>
          <div className="flex justify-between items-center text-sm text-muted-foreground">
            <span>{campaign.agency}</span>
            <span className="font-mono">{campaign.year}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
