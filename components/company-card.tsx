'use client'

import Link from 'next/link'
import { Company } from '@/lib/mock-data'
import { MapPin, Users, Handshake } from 'lucide-react'
import { getCampaignsByAgency } from '@/lib/mock-data'

interface CompanyCardProps {
  company: Company
}

export function CompanyCard({ company }: CompanyCardProps) {
  const latestCampaigns = getCampaignsByAgency(company.id)
  const latestProject = latestCampaigns[0]

  const employeeRange =
    company.employees <= 10
      ? '1-10'
      : company.employees <= 50
        ? '11-50'
        : company.employees <= 100
          ? '51-100'
          : company.employees <= 250
            ? '101-250'
            : '250+'

  return (
    <Link href={`/directory/${company.id}`}>
      <div className="group bg-white rounded-xl shadow-sm overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg">
        {/* Top branding/image area */}
        <div
          className="relative h-32 sm:h-36 bg-cover bg-center"
          style={{ backgroundImage: `url(${company.coverImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <div className="bg-white/95 backdrop-blur px-4 py-2 rounded text-center max-w-full">
              <p className="font-bold text-[#1a1a1a] text-sm truncate">{company.name}</p>
              <p className="text-xs text-[#666] truncate">{company.tagline}</p>
            </div>
          </div>
        </div>

        {/* Details section */}
        <div className="p-4 sm:p-5">
          <h3 className="font-bold text-[#1a1a1a] text-lg mb-3">{company.name}</h3>

          {/* Stats with icons */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 text-sm text-[#666]">
              <MapPin className="w-4 h-4 text-[#4fc487] shrink-0" />
              <span>{company.city}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-[#666]">
              <Users className="w-4 h-4 text-[#4fc487] shrink-0" />
              <span>
                <span className="text-[#4fc487] font-medium">{employeeRange}</span> collaborateurs
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-[#666]">
              <Handshake className="w-4 h-4 text-[#4fc487] shrink-0" />
              <span>
                <span className="text-[#4fc487] font-medium">{company.clients?.length ?? 0}</span> clients
              </span>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1 mb-4">
            {company.services.slice(0, 3).map((service, i) => (
              <span key={i} className="text-xs text-[#666]">
                #{service}
                {i < Math.min(2, company.services.length - 1) ? ' ' : ''}
              </span>
            ))}
          </div>

          {/* Category button */}
          <div className="mb-4">
            <span className="inline-block px-3 py-1.5 rounded bg-[#2e3843] text-white text-xs font-medium">
              {company.services[0] || 'Communication'}
            </span>
          </div>

          {/* Dernière réalisation */}
          {latestProject && (
            <div className="pt-4 border-t border-[#e5e5e1]">
              <p className="text-sm font-medium text-[#1a1a1a] mb-2">Dernière réalisation</p>
              <div className="flex gap-3">
                <div className="w-12 h-12 shrink-0 rounded overflow-hidden bg-[#eef0f3]">
                  <img
                    src={latestProject.thumbnail}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-sm text-[#666] line-clamp-2">{latestProject.title}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
