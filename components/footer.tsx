'use client'

import Link from 'next/link'

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div>
            <h2 className="text-2xl font-serif font-bold mb-4">REQUISTI</h2>
            <p className="text-sm text-white/80 mb-4">
              Discover the world's most innovative advertising agencies, campaigns, and talent.
            </p>
          </div>

          {/* Directory */}
          <div>
            <h3 className="font-serif font-bold mb-4">Directory</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/directory" className="text-white/80 hover:text-white transition-colors">
                  Agencies
                </Link>
              </li>
              <li>
                <Link href="/talent" className="text-white/80 hover:text-white transition-colors">
                  Talent
                </Link>
              </li>
              <li>
                <Link href="/campaigns" className="text-white/80 hover:text-white transition-colors">
                  Campaigns
                </Link>
              </li>
              <li>
                <Link href="/awards" className="text-white/80 hover:text-white transition-colors">
                  Awards
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-serif font-bold mb-4">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/news" className="text-white/80 hover:text-white transition-colors">
                  News & Trends
                </Link>
              </li>
              <li>
                <Link href="/rankings" className="text-white/80 hover:text-white transition-colors">
                  Rankings
                </Link>
              </li>
              <li>
                <a href="#" className="text-white/80 hover:text-white transition-colors">
                  Get Listed
                </a>
              </li>
              <li>
                <a href="#" className="text-white/80 hover:text-white transition-colors">
                  Advertise
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-serif font-bold mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-white/80 hover:text-white transition-colors">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="text-white/80 hover:text-white transition-colors">
                  Contact
                </a>
              </li>
              <li>
                <a href="#" className="text-white/80 hover:text-white transition-colors">
                  Privacy
                </a>
              </li>
              <li>
                <a href="#" className="text-white/80 hover:text-white transition-colors">
                  Terms
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/20 pt-8 flex flex-col sm:flex-row justify-between items-center text-sm text-white/60">
          <p>&copy; 2024 REQUISTI. All rights reserved.</p>
          <div className="flex gap-6 mt-4 sm:mt-0">
            <a href="#" className="hover:text-white transition-colors">Twitter</a>
            <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
            <a href="#" className="hover:text-white transition-colors">Instagram</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
