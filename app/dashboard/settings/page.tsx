'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'
import { AuthGuard } from '@/components/auth-guard'
import { Header } from '@/components/header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { User, Lock, Bell, CreditCard, LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'

function SettingsContent() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'account' | 'password' | 'notifications' | 'billing'>('account')
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  const TABS = [
    { id: 'account', label: 'Account', icon: User },
    { id: 'password', label: 'Password', icon: Lock },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'billing', label: 'Billing', icon: CreditCard },
  ] as const

  return (
    <div className="min-h-screen bg-[#eef0f3] flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="bg-[#2e3843] px-4 sm:px-6 lg:px-8 py-10">
          <div className="max-w-4xl mx-auto">
            <Link href="/dashboard" className="text-sm text-white/60 hover:text-white mb-2 block">← Dashboard</Link>
            <h1 className="text-2xl font-bold text-white">Account Settings</h1>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row gap-8">
            {/* Sidebar */}
            <aside className="sm:w-52 shrink-0">
              <nav className="bg-white rounded-xl shadow-sm overflow-hidden">
                {TABS.map(tab => {
                  const Icon = tab.icon
                  return (
                    <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-3 w-full px-4 py-3 text-sm transition-colors border-b border-[#e5e5e1] last:border-0 ${activeTab === tab.id ? 'bg-[#eef0f3] text-[#2e3843] font-medium' : 'text-[#666] hover:bg-[#f5f5f5]'}`}>
                      <Icon className="w-4 h-4" />{tab.label}
                    </button>
                  )
                })}
              </nav>
              <button onClick={handleLogout} className="flex items-center gap-2 mt-4 px-4 py-3 text-sm text-red-600 hover:text-red-700 w-full">
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </aside>

            {/* Content */}
            <div className="flex-1">
              {activeTab === 'account' && (
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h2 className="font-bold text-[#1a1a1a] mb-6">Account Information</h2>
                  <div className="space-y-4">
                    <div><label className="block text-sm font-medium mb-1.5">Full Name</label><Input defaultValue={user?.name} className="h-11" /></div>
                    <div><label className="block text-sm font-medium mb-1.5">Email Address</label><Input type="email" defaultValue={user?.email} className="h-11" /></div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5">Account Type</label>
                      <div className="px-3 py-2.5 border border-[#d8dce2] rounded-lg bg-[#f5f5f5] text-sm text-[#666] capitalize">{user?.role?.replace('_', ' ')}</div>
                    </div>
                    {saved ? (
                      <div className="px-4 py-2.5 bg-[#4fc487]/20 text-[#4fc487] rounded-lg text-sm font-medium">Changes saved!</div>
                    ) : (
                      <Button onClick={handleSave} className="bg-[#4fc487] hover:bg-[#45b078] text-white">Save Changes</Button>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'password' && (
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h2 className="font-bold text-[#1a1a1a] mb-6">Change Password</h2>
                  <div className="space-y-4">
                    <div><label className="block text-sm font-medium mb-1.5">Current Password</label><Input type="password" placeholder="••••••••" className="h-11" /></div>
                    <div><label className="block text-sm font-medium mb-1.5">New Password</label><Input type="password" placeholder="Min 8 characters" className="h-11" /></div>
                    <div><label className="block text-sm font-medium mb-1.5">Confirm New Password</label><Input type="password" placeholder="••••••••" className="h-11" /></div>
                    <Button className="bg-[#2e3843] hover:bg-[#3d4f5e] text-white">Update Password</Button>
                  </div>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h2 className="font-bold text-[#1a1a1a] mb-6">Notification Preferences</h2>
                  <div className="space-y-4">
                    {[
                      { label: 'New followers', desc: 'When someone follows your agency or profile' },
                      { label: 'Industry news', desc: 'Weekly digest of top industry news' },
                      { label: 'New campaigns from followed agencies', desc: 'Get notified when agencies you follow add new work' },
                      { label: 'Award show results', desc: 'Results from Cannes, D&AD, One Show and more' },
                    ].map(item => (
                      <div key={item.label} className="flex items-start justify-between gap-4 py-3 border-b border-[#e5e5e1] last:border-0">
                        <div>
                          <p className="text-sm font-medium text-[#1a1a1a]">{item.label}</p>
                          <p className="text-xs text-[#666] mt-0.5">{item.desc}</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" defaultChecked className="sr-only peer" />
                          <div className="w-10 h-6 bg-[#d8dce2] peer-checked:bg-[#4fc487] rounded-full transition-colors peer-focus:ring-2 peer-focus:ring-[#4fc487]/20 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-4" />
                        </label>
                      </div>
                    ))}
                    <Button className="bg-[#4fc487] hover:bg-[#45b078] text-white">Save Preferences</Button>
                  </div>
                </div>
              )}

              {activeTab === 'billing' && (
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h2 className="font-bold text-[#1a1a1a] mb-6">Billing & Plan</h2>
                  <div className="bg-[#eef0f3] rounded-xl p-5 mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-bold text-[#1a1a1a]">Free Plan</p>
                      <span className="px-3 py-1 bg-[#d8dce2] text-[#666] text-xs rounded-full font-medium">Current</span>
                    </div>
                    <p className="text-sm text-[#666] mb-3">Basic directory listing and search access</p>
                    <Link href="/pricing"><Button className="bg-[#f5d742] hover:bg-[#e6c93c] text-[#1a1a1a] font-medium">Upgrade Plan</Button></Link>
                  </div>
                  <p className="text-sm text-[#666]">No payment method on file. Upgrade to add a payment method.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default function SettingsPage() {
  return <AuthGuard><SettingsContent /></AuthGuard>
}
