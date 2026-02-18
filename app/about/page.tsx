import Link from 'next/link'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { companies, campaigns, talent, news } from '@/lib/mock-data'

const stats = [
  { label: 'Agencies Listed', value: companies.length.toString() + '+' },
  { label: 'Creative Works', value: campaigns.length.toString() + '+' },
  { label: 'Creative Professionals', value: talent.length.toString() + '+' },
  { label: 'News Articles', value: news.length.toString() + '+' },
]

const team = [
  { name: 'Mark Tungate', role: 'Editor in Chief', photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&q=80', bio: '25 years covering the advertising industry' },
  { name: 'Sophie Bernard', role: 'Head of Directory', photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&q=80', bio: 'Building relationships with the world\'s best agencies' },
  { name: 'Alex Carter', role: 'Head of Technology', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80', bio: 'Architecting REQUISTI\'s platform for scale' },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#eef0f3] flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <div className="bg-[#2e3843] px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">About REQUISTI</h1>
            <p className="text-white/70 text-xl max-w-2xl mx-auto">
              The global platform connecting brands with the world&apos;s best advertising and creative talent since 2012.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-[#4fc487] px-4 sm:px-6 lg:px-8 py-10">
          <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            {stats.map(stat => (
              <div key={stat.label}>
                <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
                <p className="text-white/80 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Mission */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h2 className="text-3xl font-bold text-[#1a1a1a] mb-4">Our Mission</h2>
              <p className="text-[#666] leading-relaxed mb-4">
                REQUISTI was founded in 2012 with a simple mission: to make it easier for brands to find and work with the world&apos;s best advertising agencies and creative professionals.
              </p>
              <p className="text-[#666] leading-relaxed mb-4">
                We believe great advertising has the power to change culture, build businesses, and even improve the world. Our platform celebrates that work and the people behind it.
              </p>
              <p className="text-[#666] leading-relaxed">
                Today, REQUISTI is the leading independent platform for advertising intelligence, with thousands of agencies, production companies, and creative professionals from over 80 countries.
              </p>
            </div>
            <div className="relative h-64 rounded-2xl overflow-hidden">
              <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80" alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-br from-[#2e3843]/40 to-transparent" />
            </div>
          </div>

          {/* Team */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-[#1a1a1a] mb-8 text-center">The Team</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {team.map(member => (
                <div key={member.name} className="bg-white rounded-2xl p-6 shadow-sm text-center">
                  <img src={member.photo} alt={member.name} className="w-20 h-20 rounded-xl object-cover mx-auto mb-4" />
                  <h3 className="font-bold text-[#1a1a1a] mb-1">{member.name}</h3>
                  <p className="text-sm text-[#4fc487] mb-2">{member.role}</p>
                  <p className="text-xs text-[#666]">{member.bio}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="bg-[#2e3843] rounded-2xl p-8 sm:p-12 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">Get Your Agency Listed</h2>
            <p className="text-white/70 mb-6 max-w-lg mx-auto">
              Join thousands of agencies worldwide who use REQUISTI to showcase their work and win new business.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/signup/agency">
                <Button className="bg-[#4fc487] hover:bg-[#45b078] text-white px-8">List Your Agency</Button>
              </Link>
              <Link href="/pricing">
                <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 px-8">View Plans</Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
