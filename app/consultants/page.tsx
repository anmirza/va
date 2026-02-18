'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { searchConsultants } from '@/lib/mock-data'
import { MapPin, Search } from 'lucide-react'
import { Input } from '@/components/ui/input'

export default function ConsultantsPage() {
  const [query, setQuery] = useState('')

  const filtered = searchConsultants.filter(c =>
    !query || c.name.toLowerCase().includes(query.toLowerCase()) || c.firm.toLowerCase().includes(query.toLowerCase()) || c.city.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-[#eef0f3] flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="bg-[#2e3843] px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-4xl font-bold text-white mb-2">Search Consultants</h1>
            <p className="text-white/70 mb-8">Expert advisors to help you find the perfect agency partner</p>
            <div className="flex-1 max-w-xl relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#666]" />
              <Input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search consultants..." className="pl-12 h-11 bg-white border-0" />
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {filtered.map(consultant => (
              <Link key={consultant.id} href={`/consultants/${consultant.id}`} className="group bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow flex gap-5">
                <img src={consultant.photo} alt={consultant.name} className="w-20 h-20 rounded-xl object-cover shrink-0" />
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-[#1a1a1a] group-hover:text-[#4fc487] transition-colors">{consultant.name}</h3>
                  <p className="text-sm text-[#4fc487] mb-1">{consultant.firm}</p>
                  <div className="flex items-center gap-1 text-sm text-[#666] mb-3">
                    <MapPin className="w-3.5 h-3.5" />{consultant.city}, {consultant.country}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {consultant.expertise.slice(0, 2).map(e => (
                      <span key={e} className="px-2 py-0.5 bg-[#eef0f3] text-xs text-[#666] rounded-full">{e}</span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
