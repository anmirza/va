'use client'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { CompanyCard } from '@/components/company-card'
import { CampaignCard } from '@/components/campaign-card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { companies, campaigns, talent, news } from '@/lib/mock-data'
import { Search, MapPin, Briefcase, TrendingUp, BookOpen, Award } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="px-4 sm:px-6 lg:px-8 py-20 max-w-7xl mx-auto w-full">
          <div className="text-center mb-12">
            <h1 className="text-5xl sm:text-6xl font-serif font-bold mb-4 text-balance">
              Discover the World's Best Advertising
            </h1>
            <p className="text-lg text-muted-foreground mb-8 text-balance">
              Explore innovative agencies, award-winning campaigns, and industry talent all in one place.
            </p>
          </div>

          {/* Search Block */}
          <div className="bg-card rounded-lg shadow-lg p-6 sm:p-8 mb-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Search agencies, campaigns..."
                  className="pl-10"
                />
              </div>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="City or country"
                  className="pl-10"
                />
              </div>
              <div className="relative">
                <Briefcase className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Service type"
                  className="pl-10"
                />
              </div>
            </div>
            <Button className="w-full mt-4 bg-accent hover:bg-accent/90">Search</Button>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            <div className="text-center">
              <div className="text-3xl font-serif font-bold text-accent mb-1">{companies.length}+</div>
              <p className="text-sm text-muted-foreground">Agencies</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-serif font-bold text-accent mb-1">{campaigns.length}+</div>
              <p className="text-sm text-muted-foreground">Campaigns</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-serif font-bold text-accent mb-1">{talent.length}+</div>
              <p className="text-sm text-muted-foreground">Talent</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-serif font-bold text-accent mb-1">50+</div>
              <p className="text-sm text-muted-foreground">Awards</p>
            </div>
          </div>
        </section>

        {/* Featured Companies Section */}
        <section className="px-4 sm:px-6 lg:px-8 py-20 border-t border-border bg-card/50">
          <div className="max-w-7xl mx-auto w-full">
            <div className="flex items-center gap-3 mb-8">
              <TrendingUp className="w-6 h-6 text-accent" />
              <h2 className="text-3xl font-serif font-bold">Featured Agencies</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {companies.slice(0, 6).map((company) => (
                <CompanyCard key={company.id} company={company} />
              ))}
            </div>
          </div>
        </section>

        {/* Latest Campaigns Section */}
        <section className="px-4 sm:px-6 lg:px-8 py-20 max-w-7xl mx-auto w-full">
          <div className="flex items-center gap-3 mb-8">
            <BookOpen className="w-6 h-6 text-accent" />
            <h2 className="text-3xl font-serif font-bold">Latest Campaigns</h2>
          </div>
          <div className="mb-6 flex gap-2">
            {['All', 'Digital', 'Print', 'TV', 'OOH'].map((format) => (
              <Badge key={format} variant={format === 'All' ? 'default' : 'outline'} className="cursor-pointer">
                {format}
              </Badge>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {campaigns.slice(0, 4).map((campaign) => (
              <CampaignCard key={campaign.id} campaign={campaign} />
            ))}
          </div>
        </section>

        {/* Talent Spotlight Section */}
        <section className="px-4 sm:px-6 lg:px-8 py-20 border-t border-border bg-card/50">
          <div className="max-w-7xl mx-auto w-full">
            <div className="flex items-center gap-3 mb-8">
              <Briefcase className="w-6 h-6 text-accent" />
              <h2 className="text-3xl font-serif font-bold">Talent Spotlight</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {talent.slice(0, 4).map((person) => (
                <div key={person.id} className="group cursor-pointer">
                  <div className="aspect-square overflow-hidden rounded-lg mb-4 bg-muted">
                    <img
                      src={person.photo}
                      alt={person.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <h3 className="font-serif font-bold mb-1">{person.name}</h3>
                  <p className="text-sm text-accent mb-1">{person.role}</p>
                  <p className="text-xs text-muted-foreground">{person.company}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Award-Winning Work Section */}
        <section className="px-4 sm:px-6 lg:px-8 py-20 bg-primary text-primary-foreground">
          <div className="max-w-7xl mx-auto w-full">
            <div className="flex items-center gap-3 mb-8">
              <Award className="w-6 h-6" />
              <h2 className="text-3xl font-serif font-bold">Award-Winning Work</h2>
            </div>
            <p className="text-lg text-white/80 mb-8 max-w-2xl">
              Celebrate the most innovative and impactful advertising campaigns recognized by prestigious international awards.
            </p>
            <Button variant="outline" className="border-white/30 text-white hover:bg-white/10">
              Explore All Awards →
            </Button>
          </div>
        </section>

        {/* Latest News Section */}
        <section className="px-4 sm:px-6 lg:px-8 py-20 max-w-7xl mx-auto w-full">
          <h2 className="text-3xl font-serif font-bold mb-8">Latest News</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {news.slice(0, 3).map((article) => (
              <article key={article.id} className="group cursor-pointer">
                <div className="aspect-video overflow-hidden rounded-lg mb-4 bg-muted">
                  <img
                    src={article.thumbnail}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <Badge className="mb-3" variant="outline">{article.category}</Badge>
                <h3 className="font-serif font-bold text-lg mb-2 group-hover:text-accent transition-colors line-clamp-2">
                  {article.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{article.excerpt}</p>
                <div className="flex justify-between items-center text-xs text-muted-foreground">
                  <span>{article.author}</span>
                  <span>{article.date}</span>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Get Listed CTA Section */}
        <section className="px-4 sm:px-6 lg:px-8 py-20 border-t border-border bg-card/50">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl font-serif font-bold mb-4">Get Your Agency Listed</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join thousands of agencies, studios, and talent on REQUISTI. Showcase your work, attract clients, and grow your network.
            </p>
            <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
              Apply Now
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
