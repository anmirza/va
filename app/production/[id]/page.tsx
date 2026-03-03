'use client'

import { use } from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { getProductionCompanyById } from '@/lib/mock-data'
import { MapPin, Users, Globe, Calendar, ArrowLeft } from 'lucide-react'

export default function ProductionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const company = getProductionCompanyById(id)
  if (!company) notFound()

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="relative h-64 overflow-hidden">
          <img src={company.coverImage} alt="" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
          <div className="absolute top-4 left-4 sm:left-8">
            <Link href="/production" className="flex items-center gap-1.5 text-sm text-foreground/80 hover:text-foreground bg-background/80 backdrop-blur px-3 py-1.5 rounded-lg">
              <ArrowLeft className="w-4 h-4" /> Production Companies
            </Link>
          </div>
        </div>

        <div className="bg-card border-b border-border px-4 sm:px-6 lg:px-8 pb-10 -mt-1">
          <div className="max-w-5xl mx-auto pt-4">
            <h1 className="text-3xl font-bold text-foreground mb-2">{company.name}</h1>
            <div className="flex flex-wrap gap-4 text-sm text-foreground/70">
              <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" />{company.city}, {company.country}</span>
              <span className="flex items-center gap-1.5"><Users className="w-4 h-4" />{company.employees} team members</span>
              <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" />Est. {company.founded}</span>
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-card rounded-xl p-6 shadow-sm">
                <h2 className="font-bold text-foreground mb-3">About</h2>
                <p className="text-muted-foreground leading-relaxed">{company.about}</p>
              </div>
              <div className="bg-card rounded-xl p-6 shadow-sm">
                <h2 className="font-bold text-foreground mb-4">Specialties</h2>
                <div className="flex flex-wrap gap-2">
                  {company.specialties.map(s => (
                    <span key={s} className="px-3 py-2 bg-background rounded-lg text-sm font-medium text-[#2e3843]">{s}</span>
                  ))}
                </div>
              </div>
              {company.clients.length > 0 && (
                <div className="bg-card rounded-xl p-6 shadow-sm">
                  <h2 className="font-bold text-foreground mb-4">Selected Clients</h2>
                  <div className="flex flex-wrap gap-2">
                    {company.clients.map(c => (
                      <span key={c} className="px-3 py-1.5 border border-border rounded-full text-sm text-muted-foreground">{c}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="space-y-6">
              <div className="bg-card rounded-xl p-6 shadow-sm">
                <h3 className="font-bold text-foreground mb-4">Details</h3>
                <dl className="space-y-3 text-sm">
                  <div className="flex justify-between"><dt className="text-muted-foreground">City</dt><dd className="font-medium">{company.city}</dd></div>
                  <div className="flex justify-between"><dt className="text-muted-foreground">Country</dt><dd className="font-medium">{company.country}</dd></div>
                  <div className="flex justify-between"><dt className="text-muted-foreground">Founded</dt><dd className="font-medium">{company.founded}</dd></div>
                  <div className="flex justify-between"><dt className="text-muted-foreground">Team Size</dt><dd className="font-medium">{company.employees}</dd></div>
                </dl>
                {company.website && (
                  <a href={`https://${company.website}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-[#4fc487] hover:underline text-sm mt-4">
                    <Globe className="w-4 h-4" />{company.website}
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
