'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'
import { AuthGuard } from '@/components/auth-guard'
import { Header } from '@/components/header'
import { companies, campaigns } from '@/lib/mock-data'
import { Building2, Edit, Plus, BarChart3, Users, Film, Eye, Award, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

function AgencyDashContent() {
  const { user } = useAuth()
  const agency = user?.companyId ? companies.find(c => c.id === user.companyId) : companies[0]
  const agencyCampaigns = agency ? campaigns.filter(c => c.agencyId === agency.id) : []
  const [activeTab, setActiveTab] = useState<'overview' | 'edit' | 'work' | 'analytics'>('overview')

  const TABS = [
    { id: 'overview', label: 'Overview', icon: Building2 },
    { id: 'edit', label: 'Edit Profile', icon: Edit },
    { id: 'work', label: 'Work', icon: Film },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  ] as const

  return (
    <div className="min-h-screen bg-[#eef0f3] flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="bg-[#2e3843] px-4 sm:px-6 lg:px-8 py-10">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div>
              <Link href="/dashboard" className="text-sm text-white/60 hover:text-white mb-2 block">← Dashboard</Link>
              <h1 className="text-2xl font-bold text-white">{agency?.name || 'My Agency'}</h1>
              <p className="text-[#98F5CC] text-sm">{agency?.city}, {agency?.country}</p>
            </div>
            {agency && (
              <Link href={`/directory/${agency.id}`} className="text-sm text-white/60 hover:text-white flex items-center gap-1.5">
                <Eye className="w-4 h-4" /> View Public Profile
              </Link>
            )}
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Tabs */}
          <div className="flex gap-1 bg-white rounded-xl p-1 shadow-sm mb-8 overflow-x-auto">
            {TABS.map(tab => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors flex-1 justify-center ${activeTab === tab.id ? 'bg-[#2e3843] text-white' : 'text-[#666] hover:text-[#1a1a1a]'}`}
                >
                  <Icon className="w-4 h-4" />{tab.label}
                </button>
              )
            })}
          </div>

          {/* Overview Tab */}
          {activeTab === 'overview' && agency && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="h-40 rounded-lg overflow-hidden mb-4">
                    <img src={agency.coverImage} alt="" className="w-full h-full object-cover" />
                  </div>
                  <h2 className="font-bold text-[#1a1a1a] text-xl mb-1">{agency.name}</h2>
                  <p className="text-[#666] text-sm mb-3">{agency.tagline}</p>
                  <p className="text-[#666] text-sm leading-relaxed">{agency.about}</p>
                </div>
                {agencyCampaigns.length > 0 && (
                  <div className="bg-white rounded-xl p-6 shadow-sm">
                    <h3 className="font-bold text-[#1a1a1a] mb-4">Recent Work</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {agencyCampaigns.slice(0, 3).map(c => (
                        <Link key={c.id} href={`/campaigns/${c.id}`} className="group">
                          <img src={c.thumbnail} alt="" className="w-full h-24 object-cover rounded-lg mb-2" />
                          <p className="text-xs font-medium text-[#1a1a1a] group-hover:text-[#4fc487] transition-colors">{c.title}</p>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="space-y-4">
                <div className="bg-white rounded-xl p-5 shadow-sm">
                  <h3 className="font-medium text-[#666] text-sm mb-4">Quick Stats</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-[#666]"><Users className="w-4 h-4" />Employees</div>
                      <span className="font-bold text-[#1a1a1a]">{agency.employees}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-[#666]"><Award className="w-4 h-4" />Awards</div>
                      <span className="font-bold text-[#1a1a1a]">{agency.awards}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-[#666]"><Film className="w-4 h-4" />Work Items</div>
                      <span className="font-bold text-[#1a1a1a]">{agencyCampaigns.length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-[#666]"><Building2 className="w-4 h-4" />Founded</div>
                      <span className="font-bold text-[#1a1a1a]">{agency.founded}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Edit Profile Tab */}
          {activeTab === 'edit' && agency && (
            <div className="bg-white rounded-xl p-6 shadow-sm max-w-2xl">
              <h2 className="font-bold text-[#1a1a1a] mb-6">Edit Profile</h2>
              <div className="space-y-4">
                <div><label className="block text-sm font-medium mb-1.5">Agency Name</label><Input defaultValue={agency.name} className="h-11" /></div>
                <div><label className="block text-sm font-medium mb-1.5">Tagline</label><Input defaultValue={agency.tagline} className="h-11" /></div>
                <div><label className="block text-sm font-medium mb-1.5">City</label><Input defaultValue={agency.city} className="h-11" /></div>
                <div><label className="block text-sm font-medium mb-1.5">About</label>
                  <textarea defaultValue={agency.about} rows={4} className="w-full border border-[#d8dce2] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#4fc487] resize-none" />
                </div>
                <div><label className="block text-sm font-medium mb-1.5">Website</label><Input defaultValue={agency.website || ''} className="h-11" /></div>
                <div><label className="block text-sm font-medium mb-1.5">Cover Image URL</label><Input defaultValue={agency.coverImage} className="h-11" /></div>
                <Button className="bg-[#4fc487] hover:bg-[#45b078] text-white">Save Changes</Button>
              </div>
            </div>
          )}

          {/* Work Tab */}
          {activeTab === 'work' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-[#1a1a1a]">Work Portfolio ({agencyCampaigns.length})</h2>
                <Button className="bg-[#4fc487] hover:bg-[#45b078] text-white gap-2 text-sm">
                  <Plus className="w-4 h-4" /> Add Work
                </Button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {agencyCampaigns.map(c => (
                  <div key={c.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <img src={c.thumbnail} alt="" className="w-full h-40 object-cover" />
                    <div className="p-4">
                      <h3 className="font-medium text-[#1a1a1a] mb-1">{c.title}</h3>
                      <p className="text-sm text-[#666]">{c.brand} · {c.year}</p>
                      <div className="flex gap-2 mt-3">
                        <Link href={`/campaigns/${c.id}`}><Button variant="outline" size="sm" className="text-xs border-[#d8dce2]">View</Button></Link>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="border-2 border-dashed border-[#d8dce2] rounded-xl flex flex-col items-center justify-center p-8 text-[#666] hover:border-[#4fc487] hover:text-[#4fc487] transition-colors cursor-pointer min-h-[200px]">
                  <Plus className="w-8 h-8 mb-2" />
                  <p className="text-sm font-medium">Add New Work</p>
                </div>
              </div>
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-6">
                <TrendingUp className="w-5 h-5 text-[#4fc487]" />
                <h2 className="font-bold text-[#1a1a1a]">Profile Analytics</h2>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                {[
                  { label: 'Profile Views', value: '1,284', change: '+12%' },
                  { label: 'Work Views', value: '3,451', change: '+8%' },
                  { label: 'Followers', value: '47', change: '+5' },
                  { label: 'Contact Clicks', value: '23', change: '+3' },
                ].map(stat => (
                  <div key={stat.label} className="bg-[#eef0f3] rounded-xl p-4 text-center">
                    <p className="text-2xl font-bold text-[#1a1a1a] mb-1">{stat.value}</p>
                    <p className="text-xs text-[#666] mb-1">{stat.label}</p>
                    <p className="text-xs text-[#4fc487] font-medium">{stat.change} this month</p>
                  </div>
                ))}
              </div>
              <div className="border border-[#f5d742] bg-[#f5d742]/10 rounded-xl p-4 text-center">
                <p className="text-sm font-medium text-[#a87e00] mb-1">Unlock Full Analytics</p>
                <p className="text-xs text-[#666] mb-3">Upgrade to Pro to see detailed traffic sources, engagement metrics, and more.</p>
                <Link href="/pricing"><Button className="bg-[#f5d742] hover:bg-[#e6c93c] text-[#1a1a1a] text-sm">View Plans</Button></Link>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default function AgencyDashboardPage() {
  return (
    <AuthGuard>
      <AgencyDashContent />
    </AuthGuard>
  )
}
