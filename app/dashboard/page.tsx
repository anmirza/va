'use client'

import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'
import { useFollow } from '@/lib/follow-context'
import { AuthGuard } from '@/components/auth-guard'
import { Header } from '@/components/header'
import { companies, talent, campaigns } from '@/lib/mock-data'
import { Building2, Users, Film, Settings, LayoutDashboard, Heart, Bookmark, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

function DashboardContent() {
  const { user } = useAuth()
  const { followed } = useFollow()

  const followedAgencies = companies.filter(c => followed.agencies.includes(c.id))
  const followedTalent = talent.filter(t => followed.talent.includes(t.id))
  const savedCampaigns = campaigns.filter(c => followed.campaigns.includes(c.id))

  const roleLinks = {
    agency_owner: [
      { label: 'Manage Agency', href: '/dashboard/agency', icon: Building2, desc: 'Edit your agency profile, add work' },
      { label: 'Settings', href: '/dashboard/settings', icon: Settings, desc: 'Account & billing settings' },
    ],
    talent: [
      { label: 'My Profile', href: '/dashboard/talent', icon: Users, desc: 'Edit your talent profile' },
      { label: 'Settings', href: '/dashboard/settings', icon: Settings, desc: 'Account settings' },
    ],
    marketer: [
      { label: 'Saved Agencies', href: '/directory', icon: Building2, desc: 'Browse agency directory' },
      { label: 'Settings', href: '/dashboard/settings', icon: Settings, desc: 'Account settings' },
    ],
    admin: [],
  }

  const links = roleLinks[user?.role || 'marketer']

  return (
    <div className="min-h-screen bg-[#eef0f3] flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Page header */}
        <div className="bg-[#2e3843] px-4 sm:px-6 lg:px-8 py-10">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-4">
              {user?.avatar ? (
                <img src={user.avatar} alt="" className="w-14 h-14 rounded-xl object-cover border-2 border-[#4fc487]" />
              ) : (
                <div className="w-14 h-14 rounded-xl bg-[#4fc487] flex items-center justify-center text-white font-bold text-xl">
                  {user?.name?.[0]?.toUpperCase()}
                </div>
              )}
              <div>
                <h1 className="text-2xl font-bold text-white">Welcome back, {user?.name}</h1>
                <p className="text-[#98F5CC] text-sm capitalize">{user?.role?.replace('_', ' ')}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main */}
            <div className="lg:col-span-2 space-y-8">
              {/* Quick Actions */}
              <div>
                <h2 className="text-xl font-bold text-[#1a1a1a] mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {links.map(link => {
                    const Icon = link.icon
                    return (
                      <Link key={link.href} href={link.href} className="group bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow flex items-start gap-4">
                        <div className="w-10 h-10 bg-[#eef0f3] rounded-lg flex items-center justify-center shrink-0">
                          <Icon className="w-5 h-5 text-[#4fc487]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-[#1a1a1a] group-hover:text-[#4fc487] transition-colors">{link.label}</p>
                          <p className="text-xs text-[#666] mt-0.5">{link.desc}</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-[#d8dce2] shrink-0 self-center group-hover:text-[#4fc487] transition-colors" />
                      </Link>
                    )
                  })}
                  <Link href="/signup/agency" className="group bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow flex items-start gap-4">
                    <div className="w-10 h-10 bg-[#eef0f3] rounded-lg flex items-center justify-center shrink-0">
                      <Building2 className="w-5 h-5 text-[#4fc487]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-[#1a1a1a] group-hover:text-[#4fc487] transition-colors">Register Agency</p>
                      <p className="text-xs text-[#666] mt-0.5">Add your agency to the directory</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[#d8dce2] shrink-0 self-center group-hover:text-[#4fc487] transition-colors" />
                  </Link>
                  <Link href="/creative-library" className="group bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow flex items-start gap-4">
                    <div className="w-10 h-10 bg-[#eef0f3] rounded-lg flex items-center justify-center shrink-0">
                      <Film className="w-5 h-5 text-[#4fc487]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-[#1a1a1a] group-hover:text-[#4fc487] transition-colors">Browse Creative Library</p>
                      <p className="text-xs text-[#666] mt-0.5">Explore award-winning campaigns</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[#d8dce2] shrink-0 self-center group-hover:text-[#4fc487] transition-colors" />
                  </Link>
                </div>
              </div>

              {/* Saved Campaigns */}
              {savedCampaigns.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-[#1a1a1a] flex items-center gap-2"><Bookmark className="w-5 h-5 text-[#4fc487]" /> Saved Campaigns</h2>
                    <Link href="/creative-library" className="text-sm text-[#4fc487] hover:underline">View all</Link>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {savedCampaigns.slice(0, 3).map(c => (
                      <Link key={c.id} href={`/campaigns/${c.id}`} className="group bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                        <img src={c.thumbnail} alt="" className="w-full h-28 object-cover group-hover:scale-105 transition-transform duration-300" />
                        <div className="p-3">
                          <p className="text-sm font-medium text-[#1a1a1a] line-clamp-1">{c.title}</p>
                          <p className="text-xs text-[#666]">{c.brand}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Followed agencies */}
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-[#1a1a1a] flex items-center gap-2"><Heart className="w-4 h-4 text-[#4fc487]" /> Following</h3>
                  <Link href="/directory" className="text-xs text-[#4fc487] hover:underline">Browse</Link>
                </div>
                {followedAgencies.length > 0 ? (
                  <div className="space-y-3">
                    {followedAgencies.slice(0, 5).map(c => (
                      <Link key={c.id} href={`/directory/${c.id}`} className="flex items-center gap-3 group">
                        <div className="w-8 h-8 bg-[#eef0f3] rounded-lg flex items-center justify-center text-[#2e3843] font-bold text-xs shrink-0">
                          {c.name[0]}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-[#1a1a1a] group-hover:text-[#4fc487] transition-colors truncate">{c.name}</p>
                          <p className="text-xs text-[#666]">{c.city}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-sm text-[#666] mb-2">Not following any agencies yet</p>
                    <Link href="/directory">
                      <Button size="sm" className="bg-[#4fc487] hover:bg-[#45b078] text-white text-xs">Discover Agencies</Button>
                    </Link>
                  </div>
                )}
              </div>

              {/* Account card */}
              <div className="bg-[#2e3843] rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <LayoutDashboard className="w-5 h-5 text-[#4fc487]" />
                  <h3 className="font-bold text-white">Your Plan</h3>
                </div>
                <p className="text-white/70 text-sm mb-4">You are on the <span className="text-white font-medium">Free</span> plan.</p>
                <Link href="/pricing">
                  <Button className="w-full bg-[#f5d742] hover:bg-[#e6c93c] text-[#1a1a1a] font-medium text-sm">
                    Upgrade to Pro
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <AuthGuard>
      <DashboardContent />
    </AuthGuard>
  )
}
