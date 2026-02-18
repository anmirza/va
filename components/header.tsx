'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X, Search, Mail } from 'lucide-react'

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navItems = [
    { label: 'LA RÉCLAME', href: '/' },
    { label: 'SCAN BOOK', href: '/directory' },
    { label: 'BRAND TRANSFORMATION AWARDS', href: '/awards' },
    { label: 'KIT MÉDIA', href: '/news' },
  ]

  return (
    <header className="sticky top-0 z-50 bg-[#2e3843] border-b border-[#2e3843]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 lg:h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-xl lg:text-2xl font-bold text-white tracking-tight">REQUISTI</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex gap-6 xl:gap-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-white hover:text-[#98F5CC] transition-colors"
              >
                {item.label}
              </Link>
            ))}
            <button className="p-1 text-white hover:text-[#98F5CC] transition-colors" aria-label="Search">
              <Search className="w-4 h-4" />
            </button>
          </nav>

          {/* Desktop Newsletter CTA */}
          <div className="hidden lg:flex items-center gap-2">
            <Link
              href="#newsletter"
              className="flex items-center gap-2 text-sm font-medium text-[#f5d742] hover:text-[#f5d742]/90 transition-colors"
            >
              <Mail className="w-4 h-4" />
              RECEVEZ NOS NEWSLETTERS
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 text-white hover:bg-white/10 rounded"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <nav className="lg:hidden pb-4 border-t border-white/20">
            <div className="flex flex-col gap-1 pt-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="px-4 py-3 text-sm font-medium text-white hover:bg-white/10 rounded transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href="#newsletter"
                className="flex items-center gap-2 mx-4 mt-4 px-4 py-3 text-sm font-medium text-[#f5d742]"
                onClick={() => setIsMenuOpen(false)}
              >
                <Mail className="w-4 h-4" />
                RECEVEZ NOS NEWSLETTERS
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}
