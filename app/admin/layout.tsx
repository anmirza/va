'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { VaLogo } from '@/components/va-logo'
import { subscribePendingCount, getVACategoriesFS } from '@/lib/admin-firestore'
import {
  LayoutDashboard, Clock, Building2, Film,
  Users, FileText, Settings, LogOut, ChevronRight, Shield, Menu, X, Layers,
  Briefcase, Star
} from 'lucide-react'
import { CategoryIcon } from '@/components/category-icon'

// Nav items that are always shown to all admins
const BASE_NAV = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/pending', label: 'Pending Approvals', icon: Clock, badge: true },
]

// Category listings injected dynamically between BASE_NAV and BOTTOM_NAV

// Shown to both admin and super admin
const SHARED_NAV = [
  { href: '/admin/clients', label: 'Client Management', icon: Briefcase },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/internal-users', label: 'Internal Staff', icon: Shield },
  { href: '/admin/disclaimer', label: 'Disclaimer Editor', icon: FileText },
]

// Super admin only
const SUPER_ADMIN_NAV = [
  { href: '/admin/settings', label: 'Settings & RFI', icon: Settings },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isAdmin, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [pendingCount, setPendingCount] = useState(0)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [categoryNav, setCategoryNav] = useState<any[]>([])

  const isCurrentlySuperAdmin = user?.role === 'super_admin'

  useEffect(() => {
    getVACategoriesFS().then(cats => {
      setCategoryNav(cats.map(c => ({
        href: `/admin/listing/${c.id}`,
        label: c.name,
        categoryName: c.name,
        icon: c.id === 'cat-agency' ? Building2 : c.id === 'cat-production' ? Film : Layers
      })))
    })
  }, [])

  useEffect(() => {
    if (!isAdmin) router.replace('/login')
  }, [isAdmin, router])

  useEffect(() => {
    const unsub = subscribePendingCount(setPendingCount)
    return unsub
  }, [])

  const isActive = (item: { href: string; exact?: boolean }) => {
    if (item.exact) return pathname === item.href
    return pathname.startsWith(item.href)
  }

  if (!isAdmin) return null

  const allNav = [
    ...BASE_NAV,
    ...categoryNav,
    ...SHARED_NAV,
    ...(isCurrentlySuperAdmin ? SUPER_ADMIN_NAV : []),
  ]

  const NavItem = ({ item }: { item: any }) => {
    const Icon = item.icon
    const active = isActive(item)
    const count = item.badge ? pendingCount : 0
    return (
      <Link
        href={item.href}
        onClick={() => setSidebarOpen(false)}
        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
          active
            ? 'bg-[#0763d8]/20 text-[#0763d8] border border-[#0763d8]/20'
            : 'text-white/50 hover:text-white hover:bg-white/[0.06]'
        }`}
      >
        <CategoryIcon categoryName={item.categoryName} defaultIcon={item.icon} className="w-4 h-4 shrink-0" />
        <span className="flex-1">{item.label}</span>
        {count > 0 && (
          <span className="px-1.5 py-0.5 text-[10px] font-bold bg-amber-500 text-white rounded-full min-w-[18px] text-center">
            {count}
          </span>
        )}
        {active && <ChevronRight className="w-3 h-3 shrink-0 opacity-50" />}
      </Link>
    )
  }

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

      {/* Role badge */}
      {isCurrentlySuperAdmin && (
        <div className="mx-3 mt-3 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center gap-2">
          <Star className="w-3 h-3 text-amber-400 shrink-0" />
          <span className="text-xs font-semibold text-amber-400">Super Admin</span>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {/* Base + category items */}
        {[...BASE_NAV, ...categoryNav].map(item => (
          <NavItem key={item.href} item={item} />
        ))}

        {/* Divider */}
        {categoryNav.length > 0 && (
          <div className="my-2 border-t border-white/[0.05]" />
        )}

        {/* Shared management items */}
        <p className="px-3 pt-1 pb-1 text-[10px] font-bold text-white/20 uppercase tracking-widest">Management</p>
        {SHARED_NAV.map(item => (
          <NavItem key={item.href} item={item} />
        ))}

        {/* Super admin section */}
        {isCurrentlySuperAdmin && (
          <>
            <div className="my-2 border-t border-amber-500/10" />
            <p className="px-3 pt-1 pb-1 text-[10px] font-bold text-amber-400/50 uppercase tracking-widest">Super Admin</p>
            {SUPER_ADMIN_NAV.map(item => (
              <NavItem key={item.href} item={item} />
            ))}
          </>
        )}
      </nav>

      {/* User footer */}
      <div className="p-3 border-t border-white/[0.06]">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/[0.03] mb-1">
          {user?.avatar ? (
            <img src={user.avatar} alt="" className="w-8 h-8 rounded-lg object-cover" />
          ) : (
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isCurrentlySuperAdmin ? 'bg-amber-500/20' : 'bg-[#0763d8]/20'}`}>
              <Shield className={`w-4 h-4 ${isCurrentlySuperAdmin ? 'text-amber-400' : 'text-[#0763d8]'}`} />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{user?.name}</p>
            <p className={`text-[10px] uppercase tracking-wider ${isCurrentlySuperAdmin ? 'text-amber-400/60' : 'text-white/30'}`}>
              {isCurrentlySuperAdmin ? 'Super Admin' : 'Admin'}
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
