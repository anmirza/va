'use client'

import Link from 'next/link'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { CompanyCard } from '@/components/company-card'
import { CampaignCard } from '@/components/campaign-card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { companies, campaigns, news } from '@/lib/mock-data'
import HeroSearch from '@/components/hero-search'

const disciplines = [
  'Brand Content', 'Advertising / 360', 'Brand Strategy', 'Social Media', 'Digital',
  'Public Relations', 'Branding', 'Design', 'Media', 'Out of Home', 'Radio',
  'Film & Cinema', 'Print', 'Experiential', 'Performance Marketing', 'Email Marketing',
  'Analytics & Data', 'SEO / Search', 'Programmatic', 'UX / Product', 'E-Commerce',
  'Mobile Marketing',
]

export default function Home() {
  return (
    <div className="min-h-screen bg-[#eef0f3] flex flex-col">
      <Header />
      <main className="flex-1">

        {/* Hero Section — split layout with HeroSearch inside */}
        <section className="relative bg-[#2e3843] min-h-[480px] lg:min-h-[520px] flex flex-col">
          {/* Background accent image */}
          <div className="absolute inset-0 overflow-hidden">
            <div
              className="absolute right-0 top-0 w-1/2 h-full bg-cover bg-center opacity-20"
              style={{ backgroundImage: `url(https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&q=80)` }}
            />
            {/* Yellow decorative blob */}
            <div
              className="absolute -bottom-24 right-0 w-[500px] h-[500px] rounded-full opacity-10"
              style={{ background: '#f5d742' }}
            />
          </div>

          {/* Content */}
          <div className="relative z-10 flex flex-col items-center justify-center flex-1 px-4 sm:px-6 lg:px-8 py-16 lg:py-20 text-center">
            {/* Eyebrow label */}
            <span className="inline-block mb-4 px-4 py-1.5 bg-[#f5d742]/20 text-[#f5d742] text-xs font-bold uppercase tracking-widest rounded-full border border-[#f5d742]/30">
              The Creative Intelligence Platform
            </span>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight mb-4 leading-none">
              REQUISTI
            </h1>
            <p className="text-white/70 text-base sm:text-lg max-w-xl mb-10">
              Connecting brands with the world&apos;s best advertising agencies, production companies, and creative talent.
            </p>

            {/* Stats row */}
            <div className="flex items-center gap-6 sm:gap-10 mb-12 text-white/60 text-sm">
              {[
                { label: 'Agencies', value: `${companies.length}+` },
                { label: 'Campaigns', value: `${campaigns.length}+` },
                { label: 'Countries', value: '60+' },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-2xl font-bold text-[#4fc487]">{stat.value}</p>
                  <p className="text-xs uppercase tracking-wider mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* HeroSearch */}
            <HeroSearch />
          </div>
        </section>

        {/* Featured Agencies */}
        <section className="px-4 sm:px-6 lg:px-8 py-16 lg:py-24 max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#1a1a1a]">
              <span className="relative inline-block">
                Featured Agencies
                <span className="absolute bottom-1 left-0 right-0 h-3 -z-10 opacity-50 bg-[#98F5CC]" />
              </span>
            </h2>
            <Link href="/directory" className="text-sm text-[#2e3843]/60 hover:text-[#2e3843] font-medium transition-colors">
              View all →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {companies.slice(0, 6).map((company) => (
              <CompanyCard key={company.id} company={company} />
            ))}
          </div>
        </section>

        {/* Latest Creative Work */}
        <section className="px-4 sm:px-6 lg:px-8 py-16 lg:py-24 max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#2e3843]">Latest Creative Work</h2>
            <Link href="/creative-library" className="text-sm text-[#2e3843]/60 hover:text-[#2e3843] font-medium transition-colors">
              View all →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {campaigns.slice(0, 4).map((campaign) => (
              <CampaignCard key={campaign.id} campaign={campaign} />
            ))}
          </div>
        </section>

        {/* Latest News */}
        <section className="px-4 sm:px-6 lg:px-8 py-16 lg:py-24 max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
            <div className="shrink-0 lg:max-w-xs">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#4fc487] leading-tight">
                Latest<br />Industry<br />News<br />&amp; Updates
              </h2>
              <Link href="/news" className="inline-block mt-6 text-sm text-[#2e3843]/60 hover:text-[#2e3843] font-medium transition-colors">
                All news →
              </Link>
            </div>
            <div className="flex-1 space-y-6">
              {news.slice(0, 3).map((article) => (
                <Link
                  key={article.id}
                  href={`/news/${article.id}`}
                  className="flex flex-col sm:flex-row gap-4 bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow group"
                >
                  <div className="w-24 h-24 shrink-0 overflow-hidden rounded-lg">
                    <img src={article.thumbnail} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-xs font-medium text-[#4fc487] uppercase tracking-wide">{article.category}</span>
                    <h3 className="font-bold text-[#1a1a1a] mb-2 mt-1 line-clamp-2 group-hover:text-[#2e3843]">{article.title}</h3>
                    <p className="text-sm text-[#666]">{new Date(article.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Browse by Discipline */}
        <section className="px-4 sm:px-6 lg:px-8 py-16 lg:py-24 max-w-7xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#4fc487] mb-8">Browse by Discipline</h2>
          <div className="flex flex-wrap gap-2">
            {disciplines.map((tag) => (
              <Link
                key={tag}
                href={`/directory?competency=${encodeURIComponent(tag.toLowerCase().replace(/[\s/&]+/g, '-'))}`}
              >
                <Badge
                  variant="outline"
                  className="px-4 py-2 rounded-full bg-[#d8dce2] border-0 text-[#1a1a1a] hover:bg-[#2e3843] hover:text-white cursor-pointer transition-colors"
                >
                  {tag}
                </Badge>
              </Link>
            ))}
          </div>
        </section>

        {/* Get Listed CTA */}
        <section className="px-4 sm:px-6 lg:px-8 py-16 lg:py-24 max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Join the Network</h2>
          <p className="text-lg text-[#666] mb-8">
            Join thousands of agencies and creative professionals on REQUISTI. Showcase your work and grow your business.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button className="bg-[#4fc487] hover:bg-[#45b078] text-white px-8" asChild>
              <Link href="/signup/agency">Get Listed</Link>
            </Button>
            <Button variant="outline" className="border-[#2e3843] text-[#2e3843] hover:bg-[#2e3843] hover:text-white px-8" asChild>
              <Link href="/directory">Browse Agencies</Link>
            </Button>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  )
}
