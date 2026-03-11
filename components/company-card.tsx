'use client'

import Link from 'next/link'
import { Company } from '@/lib/mock-data'
import { MapPin, Users, Handshake, Award } from 'lucide-react'
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
      <div className="group glass-card overflow-hidden cursor-pointer transition-all duration-300 hover:border-[#0763d8]/30 hover:shadow-lg hover:shadow-[#0763d8]/5">
        {/* Top branding/image area */}
        <div
          className="relative h-32 sm:h-36 bg-cover bg-center"
          style={{ backgroundImage: `url(${company.coverImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-[#02030E] to-transparent" />
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <div className="bg-[#02030E]/80 backdrop-blur-md border border-white/[0.1] px-4 py-2 rounded-xl text-center max-w-full">
              <p className="font-bold shadow-sm text-sm truncate badge-text-main">{company.name}</p>
              <p className="text-xs shadow-sm truncate badge-text-sub">{company.tagline}</p>
            </div>
          </div>
        </div>

        {/* Details section */}
        <div className="p-4 sm:p-5">
          <h3 className="font-bold text-white text-lg mb-3">{company.name}</h3>

          {/* Stats with icons */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 text-sm text-white/40">
              <MapPin className="w-4 h-4 text-[#0763d8] shrink-0" />
              <span>{company.city}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-white/40">
              <Users className="w-4 h-4 text-[#0763d8] shrink-0" />
              <span>
                <span className="text-[#0763d8] font-medium">{employeeRange}</span> collaborators
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-white/40">
              <Handshake className="w-4 h-4 text-[#0763d8] shrink-0" />
              <span>
                <span className="text-[#0763d8] font-medium">{company.clients?.length ?? 0}</span> clients
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-white/40">
              <Award className="w-4 h-4 text-[#0763d8] shrink-0" />
              <span>
                <span className="text-[#0763d8] font-medium">{company.awards ?? 0}</span> awards
              </span>
            </div>
          </div>

          {/* Category button */}
          <div className="mb-4">
            <span className="inline-block px-3 py-1.5 rounded-full bg-[#0763d8]/10 text-[#0763d8] text-xs font-medium border border-[#0763d8]/20">
              {company.services[0] || 'Communication'}
            </span>
          </div>

          {/* Latest campaign */}
          {latestProject && (
            <div className="pt-4 border-t border-white/[0.06]">
              <p className="text-sm font-medium text-white/60 mb-2">Latest Work</p>
              <div className="flex gap-3">
                <div className="w-12 h-12 shrink-0 rounded-lg overflow-hidden bg-white/[0.06]">
                  <img
                    src={latestProject.thumbnail}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-sm text-white/40 line-clamp-2">{latestProject.title}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
