'use client'

import Link from 'next/link'

export function Footer() {
  return (
    <footer className="bg-[#2e3843] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
          <p className="text-sm text-white/80">
            © 2012 - 2026 REQUISTI
          </p>
          <nav className="flex flex-wrap justify-center gap-4 sm:gap-6 text-sm">
            <Link href="/contact" className="hover:text-white transition-colors">
              CONTACT & À PROPOS
            </Link>
            <Link href="/sitemap" className="hover:text-white transition-colors">
              PLAN DU SITE
            </Link>
            <Link href="/legal" className="hover:text-white transition-colors">
              MENTIONS LÉGALES
            </Link>
            <Link href="/group" className="hover:text-white transition-colors">
              GROUPE REQUISTI
            </Link>
          </nav>
          <div className="flex gap-4">
            <a href="#" className="hover:text-[#98F5CC] transition-colors" aria-label="Facebook">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>
            <a href="#" className="hover:text-[#98F5CC] transition-colors" aria-label="Twitter">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
