'use client'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { CompanyCard } from '@/components/company-card'
import { CampaignCard } from '@/components/campaign-card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { companies, campaigns, talent, news } from '@/lib/mock-data'
import { Search } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-[#eef0f3] flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section - Split layout (Scanbook style) */}
        <section className="relative flex flex-col lg:flex-row min-h-[320px] lg:min-h-[380px]">
          {/* Left - Dark branding */}
          <div className="flex-1 bg-[#2e3843] flex flex-col justify-center px-6 sm:px-8 lg:px-12 py-12 lg:py-16">
            <div className="relative z-10">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#4fc487] tracking-tight mb-4">
                REQUISTI
              </h1>
              <p className="text-white text-base sm:text-lg max-w-md">
                The global platform connecting brands with the world's best advertising agencies and creative talent.
              </p>
            </div>
          </div>
          {/* Right - Background image with curved yellow shape */}
          <div className="flex-1 relative min-h-[200px] lg:min-h-[380px] overflow-hidden">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url(https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&q=80)`,
              }}
            />
            <div className="absolute inset-0 bg-[#2e3843]/30" />
            {/* Curved yellow accent shape */}
            <div
              className="absolute -bottom-16 -left-8 w-[120%] h-48 lg:h-64 rounded-full opacity-80"
              style={{
                background: 'linear-gradient(135deg, #f5d742 0%, #f5d742 50%, transparent 100%)',
                transform: 'rotate(-5deg)',
              }}
            />
          </div>
        </section>

        {/* Search Block - White overlay (Scanbook style) */}
        <section className="relative -mt-20 lg:-mt-24 z-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
            <p className="text-sm text-[#666] mb-2">{companies.length}+ agencies listed worldwide</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#1a1a1a] mb-6">Find an Agency</h2>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#666]" />
                <Input
                  placeholder="Search agencies, people, campaigns..."
                  className="pl-12 h-12 bg-[#2e3843] border-0 text-white placeholder:text-gray-400 rounded-lg"
                />
              </div>
              <Button className="h-12 px-6 bg-[#4fc487] hover:bg-[#45b078] text-white rounded-lg shrink-0">
                <Search className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </section>

        {/* Featured Agencies */}
        <section className="px-4 sm:px-6 lg:px-8 py-16 lg:py-24 max-w-7xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#1a1a1a] mb-8">
            <span className="relative inline-block">
              Featured Agencies
              <span
                className="absolute bottom-1 left-0 right-0 h-3 -z-10 opacity-60"
                style={{ backgroundColor: '#98F5CC' }}
              />
            </span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {companies.slice(0, 6).map((company) => (
              <CompanyCard key={company.id} company={company} />
            ))}
          </div>
        </section>

        {/* Latest Creative Work */}
        <section className="px-4 sm:px-6 lg:px-8 py-16 lg:py-24 max-w-7xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#2e3843] mb-8">Latest Creative Work</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {campaigns.slice(0, 4).map((campaign) => (
              <CampaignCard key={campaign.id} campaign={campaign} />
            ))}
          </div>
        </section>

        {/* Latest News */}
        <section className="px-4 sm:px-6 lg:px-8 py-16 lg:py-24 max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#4fc487] leading-tight shrink-0 lg:max-w-xs">
              Latest
              <br />
              Industry
              <br />
              News
              <br />
              &amp; Updates
            </h2>
            <div className="flex-1 space-y-6">
              {news.slice(0, 3).map((article) => (
                <article
                  key={article.id}
                  className="flex flex-col sm:flex-row gap-4 bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
                >
                  <div className="w-24 h-24 shrink-0 overflow-hidden rounded-lg">
                    <img src={article.thumbnail} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-xs font-medium text-[#4fc487] uppercase tracking-wide">{article.category}</span>
                    <h3 className="font-bold text-[#1a1a1a] mb-2 mt-1 line-clamp-2">{article.title}</h3>
                    <p className="text-sm text-[#666]">{new Date(article.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Project Types - Tag cloud */}
        <section className="px-4 sm:px-6 lg:px-8 py-16 lg:py-24 max-w-7xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#4fc487] mb-8">Browse by Discipline</h2>
          <div className="flex flex-wrap gap-2">
            {[
              'Brand Content',
              'Advertising / 360',
              'Brand Strategy',
              'Social Media',
              'Digital',
              'Public Relations',
              'Branding',
              'Design',
              'Media',
              'Out of Home',
              'Radio',
              'Film & Cinema',
              'Print',
              'Experiential',
              'Performance Marketing',
              'Email Marketing',
              'Analytics & Data',
              'SEO / Search',
              'Programmatic',
              'UX / Product',
              'E-Commerce',
              'Mobile Marketing',
            ].map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className="px-4 py-2 rounded-full bg-[#d8dce2] border-0 text-[#1a1a1a] hover:bg-[#2e3843] hover:text-white cursor-pointer transition-colors"
              >
                {tag}
              </Badge>
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
            <Button className="bg-[#4fc487] hover:bg-[#45b078] text-white px-8">
              Get Listed
            </Button>
            <Button variant="outline" className="border-[#2e3843] text-[#2e3843] hover:bg-[#2e3843] hover:text-white px-8">
              Browse Agencies
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
