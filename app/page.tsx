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
                Requisti est la 1ère plateforme des pros du marketing et de la communication
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
            <p className="text-sm text-[#666] mb-2">{companies.length}+ agences recensées</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#1a1a1a] mb-6">Trouver une entreprise</h2>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#666]" />
                <Input
                  placeholder="Rechercher une agence, une personne..."
                  className="pl-12 h-12 bg-[#2e3843] border-0 text-white placeholder:text-gray-400 rounded-lg"
                />
              </div>
              <Button className="h-12 px-6 bg-[#4fc487] hover:bg-[#45b078] text-white rounded-lg shrink-0">
                <Search className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </section>

        {/* Les entreprises du moment */}
        <section className="px-4 sm:px-6 lg:px-8 py-16 lg:py-24 max-w-7xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#1a1a1a] mb-8">
            <span className="relative inline-block">
              Les entreprises du moment
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

        {/* Les dernières réalisations */}
        <section className="px-4 sm:px-6 lg:px-8 py-16 lg:py-24 max-w-7xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#7b68a8] mb-8">Les dernières réalisations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {campaigns.slice(0, 4).map((campaign) => (
              <CampaignCard key={campaign.id} campaign={campaign} />
            ))}
          </div>
        </section>

        {/* Retrouvez les dernières actualités */}
        <section className="px-4 sm:px-6 lg:px-8 py-16 lg:py-24 max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#4fc487] leading-tight shrink-0 lg:max-w-xs">
              Retrouvez les
              <br />
              dernières
              <br />
              actualités
              <br />
              Requisti
            </h2>
            <div className="flex-1 space-y-6">
              {news.slice(0, 3).map((article) => (
                <article
                  key={article.id}
                  className="flex flex-col sm:flex-row gap-4 bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
                >
                  <div className="w-24 h-24 shrink-0 flex items-center justify-center rounded-lg bg-[#2e3843] text-[#4fc487]">
                    <span className="text-2xl font-bold">R</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-[#666] mb-1">requisti</p>
                    <h3 className="font-bold text-[#1a1a1a] mb-2 line-clamp-2">{article.title}</h3>
                    <p className="text-sm text-[#666]">{article.date}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Types de projets - Tag cloud */}
        <section className="px-4 sm:px-6 lg:px-8 py-16 lg:py-24 max-w-7xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#4fc487] mb-8">Types de projets</h2>
          <div className="flex flex-wrap gap-2">
            {[
              'Brand content',
              'Publicité / communication / 360',
              'Stratégie de communication',
              'Social media',
              'Digitale',
              'Relations Publics',
              'Branding',
              'Design',
              'Média',
              'Affichage',
              'Radio',
              'Cinéma',
              'Presse',
              'Activation',
              'Webmarketing',
              'E-mailing',
              'Tracking',
              'Digital',
              'Référencement / SEO',
              'Search marketing',
              'Programmatique / Publicité en ligne',
              'UX',
              'E-commerce',
              'Marketing mobile',
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
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Faites partie du réseau</h2>
          <p className="text-lg text-[#666] mb-8">
            Rejoignez des milliers d&apos;agences et professionnels sur REQUISTI. Présentez votre travail et développez votre réseau.
          </p>
          <Button className="bg-[#4fc487] hover:bg-[#45b078] text-white">
            Postuler
          </Button>
        </section>
      </main>
      <Footer />
    </div>
  )
}
