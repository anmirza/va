'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { CampaignCard } from '@/components/campaign-card'
import { Badge } from '@/components/ui/badge'
import { campaigns } from '@/lib/mock-data'

const FORMATS = ['All', 'Digital', 'Print', 'TV', 'OOH', 'Social', 'Video']

export default function CampaignsPage() {
  const [selectedFormat, setSelectedFormat] = useState('All')
  const [sortBy, setSortBy] = useState('recent')

  const filteredCampaigns = useMemo(() => {
    let results = [...campaigns]

    if (selectedFormat !== 'All') {
      results = results.filter(c => c.format.includes(selectedFormat))
    }

    if (sortBy === 'recent') {
      results.sort((a, b) => b.year - a.year)
    } else if (sortBy === 'name') {
      results.sort((a, b) => a.title.localeCompare(b.title))
    }

    return results
  }, [selectedFormat, sortBy])

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
              <span className="text-foreground font-medium">Campaigns</span>
            </div>
            <h1 className="text-4xl font-serif font-bold mb-2">Campaigns</h1>
            <p className="text-muted-foreground">Explore {filteredCampaigns.length} award-winning campaigns from around the world</p>
          </div>
        </section>

        <div className="px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-7xl mx-auto w-full">
            {/* Filters */}
            <div className="mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-3">Format</h3>
                  <div className="flex flex-wrap gap-2">
                    {FORMATS.map((format) => (
                      <Badge
                        key={format}
                        onClick={() => setSelectedFormat(format)}
                        variant={selectedFormat === format ? 'default' : 'outline'}
                        className="cursor-pointer"
                      >
                        {format}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground block mb-2">Sort</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="text-sm border border-border rounded-lg px-3 py-2 bg-background"
                  >
                    <option value="recent">Most Recent</option>
                    <option value="name">Alphabetical</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Results */}
            {filteredCampaigns.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredCampaigns.map((campaign) => (
                  <CampaignCard key={campaign.id} campaign={campaign} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No campaigns found for this format.</p>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
