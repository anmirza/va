'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Badge } from '@/components/ui/badge'
import { awards } from '@/lib/mock-data'
import { Trophy, Award } from 'lucide-react'

const FESTIVALS = ['All', ...new Set(awards.map(a => a.festival))].sort()

export default function AwardsPage() {
  const [selectedFestival, setSelectedFestival] = useState('All')

  const filteredAwards = useMemo(() => {
    let results = [...awards]
    if (selectedFestival !== 'All') {
      results = results.filter(a => a.festival === selectedFestival)
    }
    return results.sort((a, b) => b.year - a.year)
  }, [selectedFestival])

  const awardsByYear = filteredAwards.reduce((acc, award) => {
    if (!acc[award.year]) acc[award.year] = []
    acc[award.year].push(award)
    return acc
  }, {} as Record<number, typeof awards>)

  const levelColors = {
    gold: 'bg-gold text-black',
    silver: 'bg-silver text-black',
    bronze: 'bg-bronze text-white',
  }

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
              <span className="text-foreground font-medium">Awards</span>
            </div>
            <h1 className="text-4xl font-serif font-bold mb-2">Awards & Recognition</h1>
            <p className="text-muted-foreground">Celebrating excellence in advertising</p>
          </div>
        </section>

        <div className="px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-5xl mx-auto w-full">
            {/* Festival Filter */}
            <div className="mb-12">
              <h3 className="text-sm font-medium text-muted-foreground mb-4">FILTER BY FESTIVAL</h3>
              <div className="flex flex-wrap gap-2">
                {FESTIVALS.map((festival) => (
                  <Badge
                    key={festival}
                    onClick={() => setSelectedFestival(festival)}
                    variant={selectedFestival === festival ? 'default' : 'outline'}
                    className="cursor-pointer"
                  >
                    {festival}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Timeline */}
            {filteredAwards.length > 0 ? (
              <div className="space-y-12">
                {Object.entries(awardsByYear)
                  .sort(([yearA], [yearB]) => parseInt(yearB) - parseInt(yearA))
                  .map(([year, yearAwards]) => (
                    <section key={year}>
                      <div className="flex items-center gap-4 mb-8">
                        <h2 className="text-2xl font-serif font-bold">{year}</h2>
                        <div className="flex-1 h-px bg-border" />
                      </div>

                      <div className="space-y-3">
                        {yearAwards.map((award) => (
                          <Link key={award.id} href={`/directory/${award.companyId}`}>
                            <div className="border border-border rounded-lg p-6 hover:shadow-md transition-all hover:border-accent group cursor-pointer">
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex gap-4 flex-1">
                                  <Trophy className={`w-6 h-6 flex-shrink-0 mt-1 ${
                                    award.level === 'gold' ? 'text-gold' :
                                    award.level === 'silver' ? 'text-silver' :
                                    'text-bronze'
                                  }`} />
                                  <div className="flex-1">
                                    <h3 className="font-serif font-bold text-lg group-hover:text-accent transition-colors mb-1">
                                      {award.title}
                                    </h3>
                                    <p className="text-sm text-muted-foreground mb-2">{award.festival}</p>
                                    <p className="text-sm font-medium text-foreground">{award.company}</p>
                                    {award.campaign && (
                                      <p className="text-xs text-muted-foreground mt-1">Campaign: {award.campaign}</p>
                                    )}
                                  </div>
                                </div>
                                <Badge className={levelColors[award.level]}>
                                  {award.level.charAt(0).toUpperCase() + award.level.slice(1)}
                                </Badge>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </section>
                  ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Trophy className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No awards found for this festival.</p>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
