'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'
import { AuthGuard } from '@/components/auth-guard'
import { Header } from '@/components/header'
import { talent, companies } from '@/lib/mock-data'
import { Edit, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

function TalentDashContent() {
  const { user } = useAuth()
  const profile = user?.talentId ? talent.find(t => t.id === user.talentId) : talent[0]
  const company = profile ? companies.find(c => c.id === profile.companyId) : null
  const [activeTab, setActiveTab] = useState<'overview' | 'edit'>('overview')

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="bg-card border-b border-border px-4 sm:px-6 lg:px-8 py-10">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div>
              <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground mb-2 block">← Dashboard</Link>
              <h1 className="text-2xl font-bold text-foreground">{profile?.name || 'My Profile'}</h1>
              <p className="text-[#98F5CC] text-sm">{profile?.role}</p>
            </div>
            {profile && (
              <Link href={`/talent/${profile.id}`} className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1.5">
                <Eye className="w-4 h-4" /> View Public Profile
              </Link>
            )}
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex gap-1 bg-card border border-border rounded-xl p-1 shadow-sm mb-8 max-w-xs">
            {(['overview', 'edit'] as const).map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${activeTab === tab ? 'bg-secondary text-foreground shadow-sm' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}>
                {tab === 'edit' ? <><Edit className="w-3.5 h-3.5 inline mr-1" />Edit</> : 'Overview'}
              </button>
            ))}
          </div>

          {activeTab === 'overview' && profile && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-card border border-border rounded-xl p-6 shadow-sm flex items-start gap-5">
                  <img src={profile.photo} alt={profile.name} className="w-24 h-24 rounded-xl object-cover shrink-0" />
                  <div>
                    <h2 className="font-bold text-foreground text-xl">{profile.name}</h2>
                    <p className="text-[#0763d8] mb-1">{profile.role}</p>
                    {company && <Link href={`/directory/${company.id}`} className="text-sm text-muted-foreground hover:text-[#0763d8]">{company.name}</Link>}
                    {profile.bio && <p className="text-sm text-muted-foreground mt-3 leading-relaxed">{profile.bio}</p>}
                  </div>
                </div>
                {profile.expertise && (
                  <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                    <h3 className="font-bold text-foreground mb-3">Expertise</h3>
                    <div className="flex flex-wrap gap-2">
                      {profile.expertise.map(e => (
                        <span key={e} className="px-3 py-1.5 bg-muted border border-border text-sm text-[#2e3843] rounded-full font-medium">{e}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="space-y-4">
                <div className="bg-[#2e3843] rounded-xl p-5 text-center">
                  <p className="text-foreground font-bold text-2xl mb-1">0</p>
                  <p className="text-muted-foreground text-sm">Profile followers</p>
                </div>
                <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
                  <p className="text-xs text-muted-foreground mb-3 font-medium">Visibility</p>
                  <div className="h-2 bg-white/[0.12] rounded-full overflow-hidden">
                    <div className="h-full bg-[#0763d8] rounded-full" style={{ width: '35%' }} />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">35% profile completeness</p>
                  <Link href="/pricing" className="block mt-3">
                    <Button className="w-full text-xs bg-[#f5d742] hover:bg-[#e6c93c] text-foreground">Boost Visibility</Button>
                  </Link>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'edit' && profile && (
            <div className="bg-card border border-border rounded-xl p-6 shadow-sm max-w-2xl">
              <h2 className="font-bold text-foreground mb-6">Edit Profile</h2>
              <div className="space-y-4">
                <div><label className="block text-sm font-medium mb-1.5">Full Name</label><Input defaultValue={profile.name} className="h-11" /></div>
                <div><label className="block text-sm font-medium mb-1.5">Role / Title</label><Input defaultValue={profile.role} className="h-11" /></div>
                <div><label className="block text-sm font-medium mb-1.5">Bio</label>
                  <textarea defaultValue={profile.bio || ''} rows={4} className="w-full border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#0763d8] resize-none" />
                </div>
                <div><label className="block text-sm font-medium mb-1.5">Photo URL</label><Input defaultValue={profile.photo} className="h-11" /></div>
                <Button className="bg-[#0763d8] hover:bg-[#0655b3] text-foreground">Save Changes</Button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default function TalentDashboardPage() {
  return <AuthGuard><TalentDashContent /></AuthGuard>
}
