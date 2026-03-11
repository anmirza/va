'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { CompanyCard } from '@/components/company-card'
import { CampaignCard } from '@/components/campaign-card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { companies, campaigns, news } from '@/lib/mock-data'
import HeroSearch from '@/components/hero-search'
import { ArrowRight } from 'lucide-react'

const disciplines = [
  'Brand Content', 'Advertising / 360', 'Brand Strategy', 'Social Media', 'Digital',
  'Public Relations', 'Branding', 'Design', 'Media', 'Out of Home', 'Radio',
  'Film & Cinema', 'Print', 'Experiential', 'Performance Marketing', 'Email Marketing',
  'Analytics & Data', 'SEO / Search', 'Programmatic', 'UX / Product', 'E-Commerce',
  'Mobile Marketing', 'Award',
]

export default function Home() {
  const [showMoreAgencies, setShowMoreAgencies] = useState(false)

  return (
    <div className="min-h-screen bg-[#02030E] flex flex-col">
      <Header />
      <main className="flex-1">

        {/* Hero Section */}
        <section className="relative min-h-[480px] lg:min-h-[520px] flex flex-col">
          {/* Background effects */}
          <div className="absolute inset-0 overflow-hidden">
            <div
              className="absolute right-0 top-0 w-1/2 h-full bg-cover bg-center opacity-[0.07]"
              style={{ backgroundImage: `url(https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&q=80)` }}
            />
            {/* Green glow blob */}
            <div
              className="absolute -bottom-32 right-1/4 w-[600px] h-[600px] rounded-full opacity-[0.06]"
              style={{ background: 'radial-gradient(circle, #0763d8, transparent 70%)' }}
            />
            {/* Blue glow blob */}
            <div
              className="absolute -top-24 -left-24 w-[400px] h-[400px] rounded-full opacity-[0.04]"
              style={{ background: 'radial-gradient(circle, #3b82f6, transparent 70%)' }}
            />
          </div>

          {/* Content */}
          <div className="relative z-10 flex flex-col items-center justify-center flex-1 px-4 sm:px-6 lg:px-8 py-16 lg:py-20 text-center">
            <span className="inline-block mb-4 px-4 py-1.5 bg-[#0763d8]/10 text-[#0763d8] text-xs font-bold uppercase tracking-widest rounded-full border border-[#0763d8]/20">
              The Creative Intelligence Platform
            </span>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight mb-4 leading-none">
              VA
            </h1>
            <p className="text-white/50 text-base sm:text-lg max-w-xl mb-10">
              Connecting brands with the world&apos;s best advertising agencies, production companies, and creative talent.
            </p>

            {/* Stats row */}
            <div className="flex items-center gap-6 sm:gap-10 mb-12 text-white/40 text-sm">
              {[
                { label: 'Agencies', value: `${companies.length}+` },
                { label: 'Campaigns', value: `${campaigns.length}+` },
                { label: 'Countries', value: '60+' },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-2xl font-bold text-[#0763d8]">{stat.value}</p>
                  <p className="text-xs uppercase tracking-wider mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* HeroSearch */}
            <HeroSearch />
          </div>
        </section>

        {/* Featured Agencies — max 6 cards with show more/less */}
        <section className="px-4 sm:px-6 lg:px-8 py-16 lg:py-24 max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              <span className="relative inline-block">
                Featured Agencies
                <span className="absolute bottom-1 left-0 right-0 h-3 -z-10 opacity-20 bg-[#0763d8]" />
              </span>
            </h2>
            <Link href="/directory" className="flex items-center gap-1 text-sm text-[#0763d8]/70 hover:text-[#0763d8] font-medium transition-colors">
              See more agencies <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {companies.slice(0, showMoreAgencies ? 12 : 6).map((company) => (
              <CompanyCard key={company.id} company={company} />
            ))}
          </div>
          
          {companies.length > 6 && (
            <div className="mt-10 flex justify-center">
              <Button
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10"
                onClick={() => setShowMoreAgencies(!showMoreAgencies)}
              >
                {showMoreAgencies ? 'Show less' : 'Show more'}
              </Button>
            </div>
          )}
        </section>

        {/* Latest Creative Work */}
        <section className="px-4 sm:px-6 lg:px-8 py-16 lg:py-24 max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-white">Latest Creative Work</h2>
            <Link href="/creative-library" className="flex items-center gap-1 text-sm text-[#0763d8]/70 hover:text-[#0763d8] font-medium transition-colors">
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {campaigns.slice(0, 4).map((campaign) => (
              <CampaignCard key={campaign.id} campaign={campaign} />
            ))}
          </div>
        </section>

        {/* Spotlight Reports / Research-style cards */}
        <section className="px-4 sm:px-6 lg:px-8 pb-16 lg:pb-24 max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              Creative Insights &amp; Reports
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {campaigns.slice(0, 8).map((campaign, index) => (
              <Link
                key={campaign.id}
                href={`/campaigns/${campaign.id}`}
                className="group relative overflow-hidden rounded-xl bg-[#020617] aspect-[3/5] cursor-pointer"
              >
                {/* Front state – image with title */}
                <div className="absolute inset-0 transition-opacity duration-300 group-hover:opacity-0">
                  <img
                    src={campaign.thumbnail}
                    alt={campaign.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
                    <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-amber-300 mb-2">
                      {index % 2 === 0 ? 'Research Report' : 'Creative Case Study'}
                    </p>
                    <h3 className="text-white font-semibold text-base sm:text-lg leading-snug mb-1 line-clamp-2">
                      {campaign.title} – {campaign.brand}
                    </h3>
                    <p className="text-xs text-[#98F5CC] font-medium">
                      {campaign.agency} · {campaign.mediaType || campaign.format.join(' / ')}
                    </p>
                  </div>
                </div>

                {/* Hover state – solid panel with copy + Explore */}
                <div className="absolute inset-0 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 bg-gradient-to-b from-[#020617] via-[#020618] to-[#030712]">
                  <div className="flex h-full flex-col p-5 sm:p-6">
                    <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-amber-300 mb-3">
                      {index % 2 === 0 ? 'Research Report' : 'Creative Case Study'}
                    </p>
                    <h3 className="text-white font-semibold text-base sm:text-lg leading-snug mb-3">
                      {campaign.title} – {campaign.brand}
                    </h3>
                    <p className="text-sm text-white/80 leading-relaxed line-clamp-5">
                      {campaign.description ||
                        `A closer look at how ${campaign.agency} and ${campaign.brand} used ${campaign.mediaType || campaign.format.join('/')} to move the ${campaign.sector?.toLowerCase() || 'category'} forward.`}
                    </p>
                    <div className="mt-auto flex justify-end">
                      <span className="inline-flex items-center gap-1 text-sm font-medium text-[#98F5CC]">
                        Explore
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Latest News — dark glass cards */}
        {false && (
        <section className="px-4 sm:px-6 lg:px-8 py-16 lg:py-24 max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
            <div className="shrink-0 lg:max-w-xs">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0763d8] leading-tight">
                Latest<br />Industry<br />News<br />&amp; Updates
              </h2>
              <Link href="/news" className="inline-block mt-6 text-sm text-white/40 hover:text-white font-medium transition-colors">
                All news →
              </Link>
            </div>
            <div className="flex-1 space-y-4">
              {news.slice(0, 3).map((article) => (
                <Link
                  key={article.id}
                  href={`/news/${article.id}`}
                  className="flex flex-col sm:flex-row gap-4 glass-card p-5 hover:border-[#0763d8]/30 transition-all group"
                >
                  <div className="w-24 h-24 shrink-0 overflow-hidden rounded-lg">
                    <img src={article.thumbnail} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-xs font-medium text-[#0763d8] uppercase tracking-wide">{article.category}</span>
                    <h3 className="font-bold text-white mb-2 mt-1 line-clamp-2 group-hover:text-[#0763d8] transition-colors">{article.title}</h3>
                    <p className="text-sm text-white/40">{new Date(article.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        )}

        {/* Join the Network CTA */}
        <section className="px-4 sm:px-6 lg:px-8 py-16 lg:py-24 max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Join the Network</h2>
          <p className="text-lg text-white/40 mb-8">
            Join as a Client or as a Vendor. Showcase your agency and grow your business on the creative intelligence platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button className="bg-[#0763d8] hover:bg-[#0655b3] text-white px-8 rounded-full" asChild>
              <Link href="/signup">Sign Up</Link>
            </Button>
            <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 px-8 rounded-full" asChild>
              <Link href="/directory">Browse Agencies</Link>
            </Button>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  )
}
