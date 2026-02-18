'use client'

import { useState, useMemo, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { talent } from '@/lib/mock-data'
import { Search, X } from 'lucide-react'
import { Input } from '@/components/ui/input'

const ROLES = ['All', 'Creative Director', 'Art Director', 'Copywriter', 'Strategist', 'Motion Designer', 'UX Designer', 'Photographer', 'Director']

function TalentContent() {
  const params = useSearchParams()
  const roleParam = params.get('role') || ''
  const [query, setQuery] = useState(params.get('q') || '')
  const [selectedRole, setSelectedRole] = useState(roleParam || 'All')

  const filtered = useMemo(() => talent.filter(p => {
    const matchQ = !query || p.name.toLowerCase().includes(query.toLowerCase()) || p.role.toLowerCase().includes(query.toLowerCase()) || p.company.toLowerCase().includes(query.toLowerCase())
    const matchR = selectedRole === 'All' || p.role.toLowerCase().includes(selectedRole.toLowerCase())
    return matchQ && matchR
  }), [query, selectedRole])

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="bg-[#2e3843] px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-7xl mx-auto w-full">
            <div className="flex items-center gap-2 mb-4 text-sm">
              <Link href="/" className="text-white/60 hover:text-white">Home</Link>
              <span className="text-white/40">/</span>
              <span className="text-white font-medium">Talent</span>
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">Industry Talent</h1>
            <p className="text-white/70 mb-8">Meet {talent.length}+ creative professionals shaping the industry</p>

            <div className="flex gap-3 max-w-xl">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#666]" />
                <Input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search by name or role..." className="pl-12 h-11 bg-white border-0" />
              </div>
            </div>

            {/* Active filter pills */}
            {roleParam && (
              <div className="flex flex-wrap gap-2 mt-4">
                <button
                  onClick={() => setSelectedRole('All')}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#f5d742] text-[#1a1a1a] text-xs font-semibold rounded-full"
                >
                  {roleParam} <X className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
        </section>

        <div className="px-4 sm:px-6 lg:px-8 py-10">
          <div className="max-w-7xl mx-auto w-full">
            {/* Role filter tabs */}
            <div className="flex flex-wrap gap-2 mb-8">
              {ROLES.map(role => (
                <button
                  key={role}
                  onClick={() => setSelectedRole(role)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedRole === role ? 'bg-[#2e3843] text-white' : 'bg-white text-[#666] hover:bg-[#d8dce2]'}`}
                >
                  {role}
                </button>
              ))}
            </div>

            <p className="text-sm text-[#666] mb-6">{filtered.length} people found</p>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {filtered.map((person) => (
                <Link key={person.id} href={`/talent/${person.id}`}>
                  <div className="group cursor-pointer">
                    <div className="aspect-square overflow-hidden rounded-xl mb-3 bg-muted">
                      <img
                        src={person.photo}
                        alt={person.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <h3 className="font-bold text-sm text-[#1a1a1a] mb-0.5 group-hover:text-[#4fc487] transition-colors line-clamp-1">
                      {person.name}
                    </h3>
                    <p className="text-xs text-[#4fc487] mb-0.5">{person.role}</p>
                    <p className="text-xs text-[#666]">{person.company}</p>
                  </div>
                </Link>
              ))}
            </div>

            {filtered.length === 0 && (
              <div className="text-center py-20 text-[#666]">
                <p className="text-lg font-medium mb-2">No talent found.</p>
                <button onClick={() => { setQuery(''); setSelectedRole('All') }} className="text-sm text-[#4fc487] hover:underline">Clear filters</button>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default function TalentPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <TalentContent />
    </Suspense>
  )
}
