'use client'

import { use } from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { getConsultantById } from '@/lib/mock-data'
import { MapPin, Globe, ArrowLeft, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function ConsultantDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const consultant = getConsultantById(id)
  if (!consultant) notFound()

  return (
    <div className="min-h-screen bg-[#eef0f3] flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="bg-[#2e3843] px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-4xl mx-auto">
            <Link href="/consultants" className="flex items-center gap-1.5 text-sm text-white/60 hover:text-white mb-6 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Consultants
            </Link>
            <div className="flex flex-col sm:flex-row gap-6 items-start">
              <img src={consultant.photo} alt={consultant.name} className="w-24 h-24 rounded-2xl object-cover border-4 border-white/20 shrink-0" />
              <div>
                <h1 className="text-3xl font-bold text-white mb-1">{consultant.name}</h1>
                <p className="text-[#98F5CC] text-lg mb-2">{consultant.firm}</p>
                <span className="flex items-center gap-1.5 text-white/70 text-sm">
                  <MapPin className="w-4 h-4" />{consultant.city}, {consultant.country}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h2 className="font-bold text-[#1a1a1a] mb-3">About</h2>
                <p className="text-[#666] leading-relaxed">{consultant.bio}</p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h2 className="font-bold text-[#1a1a1a] mb-4">Expertise</h2>
                <div className="flex flex-wrap gap-2">
                  {consultant.expertise.map(e => (
                    <span key={e} className="px-3 py-2 bg-[#eef0f3] rounded-lg text-sm text-[#2e3843] font-medium">{e}</span>
                  ))}
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="font-bold text-[#1a1a1a] mb-4">Contact</h3>
                <Button className="w-full bg-[#0763d8] hover:bg-[#0655b3] text-white gap-2">
                  <Mail className="w-4 h-4" /> Get in Touch
                </Button>
                {consultant.website && (
                  <a href={`https://${consultant.website}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-[#0763d8] hover:underline text-sm mt-3">
                    <Globe className="w-4 h-4" />{consultant.website}
                  </a>
                )}
              </div>
              {consultant.founded && (
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <dl className="space-y-2 text-sm">
                    <div className="flex justify-between"><dt className="text-[#666]">Firm Founded</dt><dd className="font-medium">{consultant.founded}</dd></div>
                    <div className="flex justify-between"><dt className="text-[#666]">Location</dt><dd className="font-medium">{consultant.city}</dd></div>
                  </dl>
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
