'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { CampaignCard } from '@/components/campaign-card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { companies, getCampaignsByAgency, getAwardsByCompany, getTalentByCompany, getCompanyById } from '@/lib/mock-data'
import { MapPin, Globe, Users, Calendar, Award, Share2, Bookmark, ExternalLink } from 'lucide-react'
import { useParams } from 'next/navigation'

export default function CompanyProfilePage() {
  const params = useParams()
  const id = params.id as string
  const company = getCompanyById(id)

  const [activeTab, setActiveTab] = useState('information')

  if (!company) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-serif font-bold mb-2">Agency not found</h1>
            <Link href="/directory" className="text-accent hover:underline">
              Back to Directory
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const campaigns = getCampaignsByAgency(company.id)
  const awards = getAwardsByCompany(company.id)
  const teamMembers = getTalentByCompany(company.id)

  const tabs = [
    { id: 'information', label: 'Information' },
    { id: 'work', label: 'Work' },
    { id: 'team', label: 'Team' },
    { id: 'awards', label: 'Awards' },
  ]

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Cover Section */}
        <div className="relative w-full h-80 bg-muted">
          <img
            src={company.coverImage}
            alt={company.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
        </div>

        {/* Header Content */}
        <div className="relative -mt-20 mb-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="flex gap-6 items-end mb-6">
              {/* Logo */}
              <div className="w-32 h-32 bg-white rounded-lg shadow-lg flex-shrink-0 border border-border">
                <img src={company.logo} alt={company.name} className="w-full h-full object-contain p-4" />
              </div>

              {/* Header Info */}
              <div className="flex-1 pb-2">
                <h1 className="text-4xl font-serif font-bold mb-2">{company.name}</h1>
                <p className="text-lg text-muted-foreground mb-4">{company.tagline}</p>
                <div className="flex gap-2">
                  <Badge>{company.city}, {company.country}</Badge>
                  <Badge variant="outline">{company.employees.toLocaleString()} employees</Badge>
                  <Badge variant="outline">Founded {company.founded}</Badge>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 flex-col">
                <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
                  Contact
                </Button>
                <Button variant="outline" className="gap-2">
                  <Share2 className="w-4 h-4" />
                  Share
                </Button>
                <Button variant="outline" className="gap-2">
                  <Bookmark className="w-4 h-4" />
                  Save
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="sticky top-16 bg-background/80 backdrop-blur-sm border-b border-border z-40">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex gap-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-accent text-foreground'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-5xl mx-auto">
            {/* Information Tab */}
            {activeTab === 'information' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-12">
                  {/* About */}
                  <section>
                    <h2 className="text-2xl font-serif font-bold mb-4">About</h2>
                    <p className="text-muted-foreground mb-4">{company.about}</p>
                  </section>

                  {/* Services */}
                  <section>
                    <h3 className="text-xl font-serif font-bold mb-4">Services</h3>
                    <div className="flex flex-wrap gap-2">
                      {company.services.map((service) => (
                        <Badge key={service}>{service}</Badge>
                      ))}
                    </div>
                  </section>

                  {/* Sectors */}
                  <section>
                    <h3 className="text-xl font-serif font-bold mb-4">Sectors</h3>
                    <div className="flex flex-wrap gap-2">
                      {company.sectors.map((sector) => (
                        <Badge key={sector} variant="outline">{sector}</Badge>
                      ))}
                    </div>
                  </section>

                  {/* Clients */}
                  <section>
                    <h3 className="text-xl font-serif font-bold mb-4">Notable Clients</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {company.clients.map((client) => (
                        <div key={client} className="bg-card border border-border rounded-lg p-4 text-center text-sm font-medium hover:shadow-md transition-shadow grayscale hover:grayscale-0">
                          {client}
                        </div>
                      ))}
                    </div>
                  </section>
                </div>

                {/* Sidebar */}
                <div>
                  {/* Contact Card */}
                  <div className="bg-card border border-border rounded-lg p-6 mb-6">
                    <h3 className="font-serif font-bold mb-4">Contact</h3>
                    <div className="space-y-4">
                      <div className="flex gap-3">
                        <MapPin className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">{company.city}, {company.country}</p>
                        </div>
                      </div>
                      {company.website && (
                        <div className="flex gap-3">
                          <Globe className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                          <a href={`https://${company.website}`} className="text-sm text-accent hover:underline">
                            {company.website}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Stats Card */}
                  <div className="bg-card border border-border rounded-lg p-6">
                    <h3 className="font-serif font-bold mb-4">Company Info</h3>
                    <div className="space-y-4">
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Founded</p>
                        <p className="font-bold">{company.founded}</p>
                      </div>
                      <div className="border-t border-border pt-4">
                        <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Employees</p>
                        <p className="font-bold">{company.employees.toLocaleString()}</p>
                      </div>
                      <div className="border-t border-border pt-4">
                        <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Revenue</p>
                        <p className="font-bold">{company.turnover || 'N/A'}</p>
                      </div>
                      <div className="border-t border-border pt-4">
                        <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Awards</p>
                        <p className="font-bold">{company.awards}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Work Tab */}
            {activeTab === 'work' && (
              <div>
                <h2 className="text-2xl font-serif font-bold mb-8">Recent Work</h2>
                {campaigns.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {campaigns.map((campaign) => (
                      <CampaignCard key={campaign.id} campaign={campaign} />
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No campaigns featured yet.</p>
                )}
              </div>
            )}

            {/* Team Tab */}
            {activeTab === 'team' && (
              <div>
                <h2 className="text-2xl font-serif font-bold mb-8">Team</h2>
                {teamMembers.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {teamMembers.map((person) => (
                      <div key={person.id} className="text-center">
                        <div className="aspect-square rounded-lg overflow-hidden mb-4 bg-muted">
                          <img
                            src={person.photo}
                            alt={person.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <h3 className="font-serif font-bold mb-1">{person.name}</h3>
                        <p className="text-sm text-accent">{person.role}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No team members featured yet.</p>
                )}
              </div>
            )}

            {/* Awards Tab */}
            {activeTab === 'awards' && (
              <div>
                <h2 className="text-2xl font-serif font-bold mb-8">Awards & Recognition</h2>
                {awards.length > 0 ? (
                  <div className="space-y-4">
                    {awards.map((award) => (
                      <div key={award.id} className="border border-border rounded-lg p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-start gap-4">
                          <Award className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h3 className="font-serif font-bold text-lg">{award.title}</h3>
                                <p className="text-sm text-muted-foreground">{award.festival}</p>
                              </div>
                              <Badge className={`${
                                award.level === 'gold' ? 'bg-gold text-black' :
                                award.level === 'silver' ? 'bg-silver text-black' :
                                'bg-bronze text-white'
                              }`}>
                                {award.level.charAt(0).toUpperCase() + award.level.slice(1)}
                              </Badge>
                            </div>
                            {award.campaign && (
                              <p className="text-sm text-muted-foreground">Campaign: {award.campaign}</p>
                            )}
                            <p className="text-xs text-muted-foreground mt-2">{award.year}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No awards featured yet.</p>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
