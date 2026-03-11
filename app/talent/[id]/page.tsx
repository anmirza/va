'use client'

import { use } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { getTalentById, getCampaignsByAgency, companies } from '@/lib/mock-data'
import { useFollow } from '@/lib/follow-context'
import { MapPin, Briefcase, Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function TalentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const person = getTalentById(id)
  if (!person) notFound()

  const company = companies.find(c => c.id === person.companyId)
  const { isFollowingTalent, toggleTalent } = useFollow()
  const isFollowing = isFollowingTalent(id)

  return (
    <div className="min-h-screen bg-[#eef0f3] flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <div className="bg-[#2e3843] pt-16 pb-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-start gap-6">
            <img
              src={person.photo}
              alt={person.name}
              className="w-28 h-28 rounded-2xl object-cover border-4 border-white/20 shrink-0"
            />
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-white mb-1">{person.name}</h1>
                  <p className="text-[#98F5CC] text-lg mb-3">{person.role}</p>
                  <div className="flex flex-wrap gap-4 text-sm text-white/70">
                    {company && (
                      <Link href={`/directory/${company.id}`} className="flex items-center gap-1.5 hover:text-[#98F5CC] transition-colors">
                        <Briefcase className="w-4 h-4" />
                        {company.name}
                      </Link>
                    )}
                    {person.city && (
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4" />
                        {person.city}{person.country ? `, ${person.country}` : ''}
                      </span>
                    )}
                  </div>
                </div>
                <Button
                  onClick={() => toggleTalent(id)}
                  variant="outline"
                  className={`border-2 shrink-0 ${isFollowing ? 'border-[#0763d8] text-[#0763d8] bg-transparent' : 'border-white/30 text-white bg-transparent hover:bg-white/10'}`}
                >
                  <Heart className={`w-4 h-4 mr-2 ${isFollowing ? 'fill-[#0763d8]' : ''}`} />
                  {isFollowing ? 'Following' : 'Follow'}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main */}
            <div className="lg:col-span-2 space-y-6">
              {person.bio && (
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h2 className="font-bold text-[#1a1a1a] mb-3">About</h2>
                  <p className="text-[#666] leading-relaxed">{person.bio}</p>
                </div>
              )}
              {person.expertise && person.expertise.length > 0 && (
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h2 className="font-bold text-[#1a1a1a] mb-4">Expertise</h2>
                  <div className="flex flex-wrap gap-2">
                    {person.expertise.map(e => (
                      <span key={e} className="px-3 py-1.5 bg-[#eef0f3] text-[#2e3843] text-sm rounded-full font-medium">{e}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {company && (
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h3 className="font-bold text-[#1a1a1a] mb-4">Current Agency</h3>
                  <Link href={`/directory/${company.id}`} className="flex items-start gap-3 group">
                    <div className="w-12 h-12 bg-[#eef0f3] rounded-lg flex items-center justify-center shrink-0 text-[#2e3843] font-bold text-sm">
                      {company.name[0]}
                    </div>
                    <div>
                      <p className="font-medium text-[#1a1a1a] group-hover:text-[#0763d8] transition-colors">{company.name}</p>
                      <p className="text-sm text-[#666]">{company.city}, {company.country}</p>
                    </div>
                  </Link>
                </div>
              )}
              {person.socialLinks && (
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h3 className="font-bold text-[#1a1a1a] mb-4">Connect</h3>
                  <div className="space-y-2 text-sm">
                    {person.socialLinks.linkedin && (
                      <a href={person.socialLinks.linkedin} className="block text-[#0763d8] hover:underline">LinkedIn</a>
                    )}
                    {person.socialLinks.twitter && (
                      <a href={`https://twitter.com/${person.socialLinks.twitter}`} className="block text-[#0763d8] hover:underline">@{person.socialLinks.twitter}</a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
