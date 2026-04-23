'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { VaLogo } from '@/components/va-logo'
import { getPendingCount, getVACategories } from '@/lib/admin-store'
import {
  LayoutDashboard, Clock, Building2, Film,
  Users, FileText, Settings, LogOut, ChevronRight, Shield, Menu, X, Layers
} from 'lucide-react'

import { CategoryIcon } from '@/components/category-icon'

const DEFAULT_NAV = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/pending', label: 'Pending Approvals', icon: Clock, badge: true },
  { href: '/admin/clients', label: 'Client Management', icon: Users, superAdminOnly: true },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/internal-users', label: 'Internal Staff', icon: Shield, superAdminOnly: true },
  { href: '/admin/disclaimer', label: 'Disclaimer Editor', icon: FileText },
  { href: '/admin/settings', label: 'Settings & Categories', icon: Settings, superAdminOnly: true },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isAdmin, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [toggleSuperAdmin, setToggleSuperAdmin] = useState(false) // Demo toggle
  const [pendingCount, setPendingCount] = useState(0)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [dynamicNav, setDynamicNav] = useState<any[]>([])

  useEffect(() => {
    const cats = getVACategories()
    const catNav = cats.map(c => ({
      href: `/admin/listing/${c.id}`, // Generic listing page (needs to be created or use current ones)
      label: c.name,
      categoryName: c.name,
      icon: c.id === 'cat-agency' ? Building2 : c.id === 'cat-production' ? Film : Layers
    }))
    
    // Inject categories after Pending Approvals
    const updated = [...DEFAULT_NAV]
    updated.splice(2, 0, ...catNav)
    setDynamicNav(updated)
  }, [pathname])

  useEffect(() => {
    if (!isAdmin) {
      router.replace('/login')
    }
  }, [isAdmin, router])

  useEffect(() => {
    setPendingCount(getPendingCount())
  }, [pathname])

  const isActive = (item: any) => {
    if (item.exact) return pathname === item.href
    return pathname.startsWith(item.href)
  }

  if (!isAdmin) return null
  
  const isCurrentlySuperAdmin = user?.role === 'super_admin' || toggleSuperAdmin

  const Sidebar = ({ mobile = false }: { mobile?: boolean }) => (
    <div className={`${mobile ? 'flex' : 'hidden lg:flex'} flex-col h-full`}>
      {/* Logo */}
      <div className="px-6 py-5 border-b border-white/[0.06]">
        <Link href="/admin" className="flex items-center gap-3" onClick={() => setSidebarOpen(false)}>
          <VaLogo width={48} height={30} />
          <div>
            <p className="text-xs font-bold text-white tracking-wider uppercase">Admin Panel</p>
            <p className="text-[10px] text-white/30 mt-0.5">VA Consulting</p>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {dynamicNav.map(item => {
          if (item.superAdminOnly && !isCurrentlySuperAdmin) return null
          
          const Icon = item.icon
          const active = isActive(item)
          const count = item.badge ? pendingCount : 0
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                active
                  ? 'bg-[#0763d8]/20 text-[#0763d8] border border-[#0763d8]/20'
                  : 'text-white/50 hover:text-white hover:bg-white/[0.06]'
              }`}
            >
              <CategoryIcon categoryName={(item as any).categoryName} defaultIcon={item.icon} className="w-4 h-4 shrink-0" />
              <span className="flex-1">{item.label}</span>
              {count > 0 && (
                <span className="px-1.5 py-0.5 text-[10px] font-bold bg-amber-500 text-white rounded-full min-w-[18px] text-center">
                  {count}
                </span>
              )}
              {active && <ChevronRight className="w-3 h-3 shrink-0 opacity-50" />}
            </Link>
          )
        })}
      </nav>

      {/* User footer */}
      <div className="p-3 border-t border-white/[0.06]">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/[0.03] mb-1">
          {user?.avatar ? (
            <img src={user.avatar} alt="" className="w-8 h-8 rounded-lg object-cover" />
          ) : (
            <div className="w-8 h-8 rounded-lg bg-[#0763d8]/20 flex items-center justify-center">
              <Shield className="w-4 h-4 text-[#0763d8]" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{user?.name}</p>
            <button 
                onClick={() => setToggleSuperAdmin(!toggleSuperAdmin)}
                className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold text-left underline underline-offset-2 decoration-emerald-500/30"
            >
              Demo: Toggle to {isCurrentlySuperAdmin ? 'Admin' : 'Super Admin'}
            </button>
            <p className="text-[10px] text-white/30 uppercase tracking-wider mt-1">
              {isCurrentlySuperAdmin ? 'Super Admin Mode' : 'Admin Mode'}
            </p>
          </div>
        </div>
        <button
          onClick={() => { logout(); router.push('/login') }}
          className="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-sm text-white/40 hover:text-red-400 hover:bg-red-400/[0.06] transition-all"
        >
          <LogOut className="w-4 h-4" /> Sign out
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#02030E] flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 shrink-0 flex-col border-r border-white/[0.06] fixed inset-y-0 left-0 z-30">
        <Sidebar />
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <aside className="relative w-72 bg-[#02030E] border-r border-white/[0.06] flex flex-col z-50">
            <div className="absolute top-4 right-4">
              <button onClick={() => setSidebarOpen(false)} className="text-white/40 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <Sidebar mobile />
          </aside>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="sticky top-0 z-20 bg-[#02030E]/90 backdrop-blur-md border-b border-white/[0.06] px-4 sm:px-6 h-14 flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-white/40 hover:text-white transition-colors p-1"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex-1" />
          <Link href="/" className="text-xs text-white/30 hover:text-white/60 transition-colors hidden sm:block">
            ← View site
          </Link>
          {pendingCount > 0 && (
            <Link
              href="/admin/pending"
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-400 font-medium hover:bg-amber-500/20 transition-colors"
            >
              <Clock className="w-3.5 h-3.5" />
              {pendingCount} pending
            </Link>
          )}
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
