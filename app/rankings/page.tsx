'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { companies } from '@/lib/mock-data'
import { Trophy, TrendingUp, Users, Award } from 'lucide-react'

const RANKING_TYPES = [
  { id: 'awards', label: 'By Awards', icon: Award },
  { id: 'size', label: 'By Size', icon: Users },
  { id: 'founded', label: 'By Founded Year', icon: TrendingUp },
]

export default function RankingsPage() {
  const [selectedRanking, setSelectedRanking] = useState('awards')

  const rankedCompanies = useMemo(() => {
    let ranked = [...companies]

    if (selectedRanking === 'awards') {
      ranked.sort((a, b) => b.awards - a.awards)
    } else if (selectedRanking === 'size') {
      ranked.sort((a, b) => b.employees - a.employees)
    } else if (selectedRanking === 'founded') {
      ranked.sort((a, b) => a.founded - b.founded)
    }

    return ranked
  }, [selectedRanking])

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Page Header */}
        <section className="px-4 sm:px-6 lg:px-8 py-12 border-b border-border bg-card/50">
          <div className="max-w-7xl mx-auto w-full">
            <div className="flex items-center gap-2 mb-4 text-sm">
              <Link href="/" className="text-muted-foreground hover:text-foreground">Home</Link>
              <span className="text-muted-foreground">/</span>
              <span className="text-foreground font-medium">Rankings</span>
            </div>
            <h1 className="text-4xl font-serif font-bold mb-2">Agency Rankings</h1>
            <p className="text-muted-foreground">Discover the top agencies by various metrics</p>
          </div>
        </section>

        <div className="px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-5xl mx-auto w-full">
            {/* Ranking Type Selector */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
              {RANKING_TYPES.map((type) => {
                const Icon = type.icon
                return (
                  <button
                    key={type.id}
                    onClick={() => setSelectedRanking(type.id)}
                    className={`p-6 rounded-lg border-2 transition-all text-left ${
                      selectedRanking === type.id
                        ? 'border-accent bg-accent/5'
                        : 'border-border hover:border-accent/50'
                    }`}
                  >
                    <Icon className={`w-8 h-8 mb-2 ${
                      selectedRanking === type.id ? 'text-accent' : 'text-muted-foreground'
                    }`} />
                    <h3 className="font-serif font-bold">{type.label}</h3>
                  </button>
                )
              })}
            </div>

            {/* Rankings Table */}
            <div className="border border-border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-card/50">
                    <th className="px-6 py-4 text-left text-sm font-serif font-bold">Rank</th>
                    <th className="px-6 py-4 text-left text-sm font-serif font-bold">Agency</th>
                    <th className="px-6 py-4 text-left text-sm font-serif font-bold">City</th>
                    {selectedRanking === 'awards' && (
                      <th className="px-6 py-4 text-right text-sm font-serif font-bold">Awards</th>
                    )}
                    {selectedRanking === 'size' && (
                      <th className="px-6 py-4 text-right text-sm font-serif font-bold">Employees</th>
                    )}
                    {selectedRanking === 'founded' && (
                      <th className="px-6 py-4 text-right text-sm font-serif font-bold">Founded</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {rankedCompanies.map((company, index) => (
                    <tr key={company.id} className="border-b border-border hover:bg-card/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {index < 3 && (
                            <Trophy className={`w-5 h-5 ${
                              index === 0 ? 'text-gold' :
                              index === 1 ? 'text-silver' :
                              'text-bronze'
                            }`} />
                          )}
                          <span className="text-sm font-serif font-bold text-muted-foreground">{index + 1}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Link href={`/directory/${company.id}`} className="text-sm font-serif font-bold hover:text-accent transition-colors">
                          {company.name}
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{company.city}</td>
                      {selectedRanking === 'awards' && (
                        <td className="px-6 py-4 text-right text-sm font-bold">{company.awards}</td>
                      )}
                      {selectedRanking === 'size' && (
                        <td className="px-6 py-4 text-right text-sm font-bold">{company.employees.toLocaleString()}</td>
                      )}
                      {selectedRanking === 'founded' && (
                        <td className="px-6 py-4 text-right text-sm font-bold">{company.founded}</td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
