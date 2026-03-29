'use client'

import Link from 'next/link'
import { Company } from '@/lib/mock-data'
import { MapPin, Users, Handshake, Award } from 'lucide-react'
import { getCampaignsByAgency } from '@/lib/mock-data'
import {
  COVER_ASPECT_CLASS,
  CARD_LOGO_SQUARE_SIZE,
  CARD_CONTENT_PAD_TOP,
} from '@/lib/cover-logo-spec'

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
      <div className="group glass-card overflow-visible cursor-pointer transition-all duration-300 hover:border-[#0763d8]/30 hover:shadow-xl hover:shadow-[#0763d8]/8 rounded-xl">
        {/* Cover (clipped) + square logo straddling cover / body */}
        <div className="relative w-full">
          <div
            className={`relative w-full ${COVER_ASPECT_CLASS} bg-cover bg-center overflow-hidden rounded-t-xl`}
            style={{ backgroundImage: `url(${company.coverImage})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-[#02030E]/60" />
          </div>
          <div
            className="absolute bottom-0 left-1/2 z-10 flex -translate-x-1/2 translate-y-1/2 items-center justify-center"
            style={{ width: CARD_LOGO_SQUARE_SIZE, height: CARD_LOGO_SQUARE_SIZE }}
          >
            {company.logo ? (
              <div className="cover-logo-block h-full w-full flex items-center justify-center p-2.5 sm:p-3">
                <img
                  src={company.logo}
                  alt={`${company.name} logo`}
                  className="max-h-[90%] w-auto max-w-[90%] object-contain"
                />
              </div>
            ) : (
              <div className="cover-logo-block h-full w-full flex flex-col items-center justify-center px-2 py-2.5 sm:p-3 text-center min-h-0">
                <p className="font-bold text-[#0f111a] text-xs sm:text-sm leading-tight line-clamp-3 w-full tracking-tight">{company.name}</p>
                {company.tagline && (
                  <p className="text-[10px] sm:text-xs text-[#0f111a]/70 line-clamp-2 w-full mt-1">{company.tagline}</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Details section */}
        <div className="px-4 sm:px-5 pb-4 sm:pb-5 rounded-b-xl" style={{ paddingTop: CARD_CONTENT_PAD_TOP }}>
          <h3 className="font-bold text-white text-lg mb-3 tracking-tight">{company.name}</h3>

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
