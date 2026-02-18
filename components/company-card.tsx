'use client'

import Link from 'next/link'
import { Company } from '@/lib/mock-data'
import { Badge } from '@/components/ui/badge'

interface CompanyCardProps {
  company: Company
}

export function CompanyCard({ company }: CompanyCardProps) {
  return (
    <Link href={`/directory/${company.id}`}>
      <div className="group relative overflow-hidden bg-card rounded-lg aspect-[4/3] cursor-pointer transition-all duration-220 hover:shadow-lg hover:-translate-y-1">
        {/* Background Image */}
        <div className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-[1.03]"
          style={{
            backgroundImage: `url(${company.coverImage})`,
          }}
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

        {/* Logo - Top Left */}
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded p-2 h-12 w-12 flex items-center justify-center">
          <img src={company.logo} alt={company.name} className="w-full h-full object-contain" />
        </div>

        {/* Content - Bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-white font-serif text-lg font-bold mb-1 line-clamp-2">{company.name}</h3>
          <p className="text-white/80 text-sm mb-3 line-clamp-1">{company.tagline}</p>
          
          {/* Badges */}
          <div className="flex flex-wrap gap-1">
            {company.services.slice(0, 2).map((service, i) => (
              <Badge key={i} variant="secondary" className="bg-white/20 text-white text-xs backdrop-blur-sm">
                {service}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </Link>
  )
}
