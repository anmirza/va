'use client'

import Link from 'next/link'
import { useState, useRef, useEffect } from 'react'
import { Menu, X, Search, ChevronDown, User, LayoutDashboard, LogOut, Building2, Users, Zap, Sun, Moon } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import { VaLogo } from '@/components/va-logo'

const directoryItems = [
  { label: 'Agencies', href: '/directory', icon: Building2 },
  { label: 'Production Companies', href: '/production', icon: Users },
]

const whatWeDoItems = [
  { label: 'Consulting', href: '#' },
  { label: 'Pitch Management', href: '#' },
  { label: 'Agency Search', href: '#' },
]

const auraItems = [
  { label: 'Database', href: '/directory' },
  // { label: 'Analytics', href: '#' },
  { label: 'Insights', href: '#' },
]

const navItems = [
  { label: 'Directory', href: '/directory', dropdown: directoryItems },
  { label: 'Creative Library', href: '/creative-library' },
  { label: 'What We Do', href: '#', dropdown: whatWeDoItems },
  { label: 'AURA', href: '#', dropdown: auraItems, isAura: true },
]

export function Header() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [isDark, setIsDark] = useState(true)
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

  // Theme toggle
  useEffect(() => {
    const stored = localStorage.getItem('va-theme')
    if (stored === 'light') {
      setIsDark(false)
      document.documentElement.classList.add('light-mode')
    }
  }, [])

  const toggleTheme = () => {
    const next = !isDark
    setIsDark(next)
    if (next) {
      document.documentElement.classList.remove('light-mode')
      localStorage.setItem('va-theme', 'dark')
    } else {
      document.documentElement.classList.add('light-mode')
      localStorage.setItem('va-theme', 'light')
    }
  }

  const handleLogout = () => {
    logout()
    setUserMenuOpen(false)
    router.push('/')
  }

  return (
    <header className="sticky top-0 z-50 bg-[#02030E] border-b border-white/[0.06] light-header">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 lg:h-20">
          {/* Logo — exact VA mark everywhere */}
          <Link href="/" className="flex flex-1 items-center shrink-0 text-white hover:text-white/90 transition-colors">
            <VaLogo width={96} height={60} ariaLabel="VA" />
          </Link>

          {/* Desktop Navigation — centrally aligned */}
          <nav className="hidden lg:flex flex-none items-center gap-1 mx-auto" ref={dropdownRef}>
            {navItems.map((item) => (
              <div key={item.label} className="relative">
                {item.dropdown ? (
                  <button
                    onClick={() => setOpenDropdown(openDropdown === item.label ? null : item.label)}
                    className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium transition-colors ${
                      openDropdown === item.label
                        ? 'text-[#0763d8]'
                        : 'text-white/80 hover:text-white'
                    }`}
                  >
                    {item.isAura && <Zap className="w-3.5 h-3.5" />}
                    {item.label}
                    <ChevronDown className={`w-3 h-3 transition-transform ${openDropdown === item.label ? 'rotate-180' : ''}`} />
                  </button>
                ) : (
                  <Link
                    href={item.href}
                    className="px-3 py-2 text-sm font-medium text-white/80 hover:text-white transition-colors block"
                  >
                    {item.label}
                  </Link>
                )}
                {/* Dropdown — properly positioned, centered under trigger */}
                {item.dropdown && openDropdown === item.label && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-[#0c0e1a] border border-white/[0.08] rounded-xl shadow-2xl shadow-black/50 py-2 w-56 z-50">
                    {/* Arrow/pointer */}
                    <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-[#0c0e1a] border-t border-l border-white/[0.08] rotate-45" />
                    {item.dropdown.map(sub => (
                      <Link
                        key={sub.href + sub.label}
                        href={sub.href}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-white/70 hover:bg-white/[0.06] hover:text-[#0763d8] transition-colors mx-1 rounded-lg"
                        onClick={() => setOpenDropdown(null)}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-[#0763d8]/40" />
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Desktop right — Theme toggle + Search + User */}
          <div className="hidden lg:flex flex-1 items-center justify-end gap-2">
            {/* Dark/Light toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 text-white/60 hover:text-white transition-colors rounded-full hover:bg-white/[0.06]"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Pill-shaped search bar */}
            <div className="relative">
              {searchOpen ? (
                <div className="flex items-center bg-white/[0.06] border border-white/[0.12] rounded-full px-3 py-1.5 gap-2">
                  <Search className="w-4 h-4 text-white/50" />
                  <input
                    type="text"
                    placeholder="Search agencies, campaigns..."
                    className="bg-transparent border-none text-sm text-white placeholder:text-white/40 outline-none w-48"
                    autoFocus
                    onBlur={() => setSearchOpen(false)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        router.push('/search')
                        setSearchOpen(false)
                      }
                    }}
                  />
                  <button onClick={() => setSearchOpen(false)} className="text-white/40 hover:text-white">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setSearchOpen(true)}
                  className="p-2 text-white/60 hover:text-white transition-colors"
                  aria-label="Search"
                >
                  <Search className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* User icon / auth section */}
            {user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 bg-white/[0.06] hover:bg-white/[0.10] border border-white/[0.08] rounded-full px-3 py-1.5 transition-colors"
                >
                  {user.avatar ? (
                    <img src={user.avatar} alt="" className="w-6 h-6 rounded-full object-cover" />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-[#0763d8] flex items-center justify-center text-white text-xs font-bold">
                      {user.name[0].toUpperCase()}
                    </div>
                  )}
                  <span className="text-sm text-white/80 max-w-24 truncate">{user.name}</span>
                  <ChevronDown className="w-3 h-3 text-white/40" />
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 bg-[#0c0e1a] border border-white/[0.08] rounded-xl shadow-2xl shadow-black/50 py-2 w-48 z-50">
                    <Link href="/dashboard" className="flex items-center gap-2 px-4 py-2.5 text-sm text-white/70 hover:bg-white/[0.06] hover:text-[#0763d8] mx-1 rounded-lg" onClick={() => setUserMenuOpen(false)}>
                      <LayoutDashboard className="w-4 h-4 text-white/40" /> Dashboard
                    </Link>
                    {(user.role === 'admin' || user.role === 'super_admin') && (
                      <Link href="/admin" className="flex items-center gap-2 px-4 py-2.5 text-sm text-white/70 hover:bg-white/[0.06] hover:text-[#0763d8] mx-1 rounded-lg" onClick={() => setUserMenuOpen(false)}>
                        <Zap className="w-4 h-4 text-white/40" /> Admin Panel
                      </Link>
                    )}
                    {user.role === 'agency_owner' && (
                      <Link href="/dashboard/agency" className="flex items-center gap-2 px-4 py-2.5 text-sm text-white/70 hover:bg-white/[0.06] hover:text-[#0763d8] mx-1 rounded-lg" onClick={() => setUserMenuOpen(false)}>
                        <Building2 className="w-4 h-4 text-white/40" /> Manage Agency
                      </Link>
                    )}
                    {user.role === 'talent' && (
                      <Link href="/dashboard/talent" className="flex items-center gap-2 px-4 py-2.5 text-sm text-white/70 hover:bg-white/[0.06] hover:text-[#0763d8] mx-1 rounded-lg" onClick={() => setUserMenuOpen(false)}>
                        <Users className="w-4 h-4 text-white/40" /> My Profile
                      </Link>
                    )}
                    <Link href="/dashboard/settings" className="flex items-center gap-2 px-4 py-2.5 text-sm text-white/70 hover:bg-white/[0.06] hover:text-[#0763d8] mx-1 rounded-lg" onClick={() => setUserMenuOpen(false)}>
                      <User className="w-4 h-4 text-white/40" /> Settings
                    </Link>
                    <div className="border-t border-white/[0.06] my-1 mx-2" />
                    <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2.5 text-sm text-red-400 hover:bg-red-400/10 w-full text-left mx-1 rounded-lg">
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login" className="text-sm text-white/70 hover:text-white transition-colors px-3 py-1.5">
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="text-sm font-medium bg-[#0763d8] hover:bg-[#0655b3] text-white px-5 py-1.5 rounded-full transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 text-white/60 hover:text-white transition-colors rounded-full"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-white hover:bg-white/10 rounded-full"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <nav className="lg:hidden pb-4 border-t border-white/[0.06] overflow-y-auto max-h-[80vh]">
            <div className="flex flex-col pt-4">
              {navItems.map((item) => (
                <div key={item.label}>
                  <Link
                    href={item.href}
                    className="block px-4 py-3 text-sm font-medium text-white hover:bg-white/[0.06] transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                  {item.dropdown?.map(sub => (
                    <Link
                      key={sub.href + sub.label}
                      href={sub.href}
                      className="block pl-8 pr-4 py-2 text-sm text-white/60 hover:bg-white/[0.06] hover:text-[#0763d8] transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {sub.label}
                    </Link>
                  ))}
                </div>
              ))}
              <div className="border-t border-white/[0.06] mt-4 pt-4 px-4 flex flex-col gap-2">
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
                    <Link href="/login" className="block w-full text-center py-2.5 text-sm text-white border border-white/20 rounded-full" onClick={() => setIsMenuOpen(false)}>
                      Sign In
                    </Link>
                    <Link href="/signup" className="block w-full text-center py-2.5 text-sm bg-[#0763d8] text-white rounded-full" onClick={() => setIsMenuOpen(false)}>
                      Sign Up
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
