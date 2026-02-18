'use client'

import Link from 'next/link'
import { useState, useRef, useEffect } from 'react'
import { Menu, X, Search, Mail, ChevronDown, User, LayoutDashboard, LogOut, Building2, Users, MessageSquare } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'

const directoryItems = [
  { label: 'Agencies', href: '/directory' },
  { label: 'Production Companies', href: '/production' },
  { label: 'Search Consultants', href: '/consultants' },
  { label: 'Academic & Education', href: '/academic' },
]

const navItems = [
  { label: 'Directory', href: '/directory', dropdown: directoryItems },
  { label: 'Creative Library', href: '/creative-library' },
  { label: 'Talent', href: '/talent' },
  { label: 'Awards', href: '/awards' },
  { label: 'Insights', href: '/insights' },
  { label: 'Interviews', href: '/interviews' },
]

export function Header() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const userMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpenDropdown(null)
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = () => {
    logout()
    setUserMenuOpen(false)
    router.push('/')
  }

  return (
    <header className="sticky top-0 z-50 bg-[#2e3843] border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 lg:h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center shrink-0">
            <span className="text-xl font-bold text-white tracking-tight">REQUISTI</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1" ref={dropdownRef}>
            {navItems.map((item) => (
              <div key={item.href} className="relative">
                {item.dropdown ? (
                  <button
                    onClick={() => setOpenDropdown(openDropdown === item.label ? null : item.label)}
                    className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-white hover:text-[#98F5CC] transition-colors"
                  >
                    {item.label}
                    <ChevronDown className={`w-3 h-3 transition-transform ${openDropdown === item.label ? 'rotate-180' : ''}`} />
                  </button>
                ) : (
                  <Link
                    href={item.href}
                    className="px-3 py-2 text-sm font-medium text-white hover:text-[#98F5CC] transition-colors block"
                  >
                    {item.label}
                  </Link>
                )}
                {item.dropdown && openDropdown === item.label && (
                  <div className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-lg py-1 w-52 z-50">
                    {item.dropdown.map(sub => (
                      <Link
                        key={sub.href}
                        href={sub.href}
                        className="block px-4 py-2.5 text-sm text-[#1a1a1a] hover:bg-[#eef0f3] hover:text-[#4fc487] transition-colors"
                        onClick={() => setOpenDropdown(null)}
                      >
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <Link href="/search" className="p-2 text-white hover:text-[#98F5CC] transition-colors" aria-label="Search">
              <Search className="w-4 h-4" />
            </Link>
          </nav>

          {/* Desktop right */}
          <div className="hidden lg:flex items-center gap-3">
            <Link href="#newsletter" className="flex items-center gap-1.5 text-xs font-medium text-[#f5d742] hover:text-[#f5d742]/90 transition-colors">
              <Mail className="w-3.5 h-3.5" />
              NEWSLETTER
            </Link>

            {user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 bg-white/10 hover:bg-white/20 rounded-lg px-3 py-1.5 transition-colors"
                >
                  {user.avatar ? (
                    <img src={user.avatar} alt="" className="w-6 h-6 rounded-full object-cover" />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-[#4fc487] flex items-center justify-center text-white text-xs font-bold">
                      {user.name[0].toUpperCase()}
                    </div>
                  )}
                  <span className="text-sm text-white max-w-24 truncate">{user.name}</span>
                  <ChevronDown className="w-3 h-3 text-white/60" />
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-lg py-1 w-48 z-50">
                    <Link href="/dashboard" className="flex items-center gap-2 px-4 py-2.5 text-sm text-[#1a1a1a] hover:bg-[#eef0f3]" onClick={() => setUserMenuOpen(false)}>
                      <LayoutDashboard className="w-4 h-4 text-[#666]" /> Dashboard
                    </Link>
                    {user.role === 'agency_owner' && (
                      <Link href="/dashboard/agency" className="flex items-center gap-2 px-4 py-2.5 text-sm text-[#1a1a1a] hover:bg-[#eef0f3]" onClick={() => setUserMenuOpen(false)}>
                        <Building2 className="w-4 h-4 text-[#666]" /> Manage Agency
                      </Link>
                    )}
                    {user.role === 'talent' && (
                      <Link href="/dashboard/talent" className="flex items-center gap-2 px-4 py-2.5 text-sm text-[#1a1a1a] hover:bg-[#eef0f3]" onClick={() => setUserMenuOpen(false)}>
                        <Users className="w-4 h-4 text-[#666]" /> My Profile
                      </Link>
                    )}
                    <Link href="/dashboard/settings" className="flex items-center gap-2 px-4 py-2.5 text-sm text-[#1a1a1a] hover:bg-[#eef0f3]" onClick={() => setUserMenuOpen(false)}>
                      <User className="w-4 h-4 text-[#666]" /> Settings
                    </Link>
                    <div className="border-t border-[#e5e5e1] my-1" />
                    <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 w-full text-left">
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login" className="text-sm text-white hover:text-[#98F5CC] transition-colors px-3 py-1.5">
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="text-sm font-medium bg-[#4fc487] hover:bg-[#45b078] text-white px-4 py-1.5 rounded-lg transition-colors"
                >
                  Get Listed
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 text-white hover:bg-white/10 rounded"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <nav className="lg:hidden pb-4 border-t border-white/20 overflow-y-auto max-h-[80vh]">
            <div className="flex flex-col pt-4">
              {navItems.map((item) => (
                <div key={item.href}>
                  <Link
                    href={item.href}
                    className="block px-4 py-3 text-sm font-medium text-white hover:bg-white/10 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                  {item.dropdown?.map(sub => (
                    <Link
                      key={sub.href}
                      href={sub.href}
                      className="block pl-8 pr-4 py-2 text-sm text-white/70 hover:bg-white/10 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {sub.label}
                    </Link>
                  ))}
                </div>
              ))}
              <div className="border-t border-white/20 mt-4 pt-4 px-4 flex flex-col gap-2">
                {user ? (
                  <>
                    <Link href="/dashboard" className="flex items-center gap-2 py-2 text-sm text-white" onClick={() => setIsMenuOpen(false)}>
                      <LayoutDashboard className="w-4 h-4" /> Dashboard
                    </Link>
                    <button onClick={() => { handleLogout(); setIsMenuOpen(false) }} className="flex items-center gap-2 py-2 text-sm text-red-400 text-left">
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/login" className="block w-full text-center py-2.5 text-sm text-white border border-white/30 rounded-lg" onClick={() => setIsMenuOpen(false)}>
                      Sign In
                    </Link>
                    <Link href="/signup" className="block w-full text-center py-2.5 text-sm bg-[#4fc487] text-white rounded-lg" onClick={() => setIsMenuOpen(false)}>
                      Get Listed
                    </Link>
                  </>
                )}
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}
