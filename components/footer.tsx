'use client'

import Link from 'next/link'
import { MapPin, Phone, Mail } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-[#02030E] border-t border-white/[0.06] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid gap-10 md:grid-cols-[minmax(0,2.1fr)_minmax(0,2.1fr)_minmax(0,1.6fr)]">
          {/* Brand + services */}
          <div>
            <img
              src="/logos/va-consulting.svg"
              alt="VA Consulting"
              className="h-8 w-auto mb-6"
            />
            <h3 className="text-xs font-semibold tracking-[0.28em] text-white/60 uppercase mb-4">
              Services
            </h3>
            <ul className="space-y-1.5 text-sm text-white/70">
              <li>Assessment &amp; Governance</li>
              <li>Scouting &amp; Pitch</li>
              <li>Execution Oversight</li>
              <li>Performance Measurement</li>
            </ul>
          </div>

          {/* Contacts */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold tracking-[0.28em] text-white/60 uppercase">
              Contacts
            </h3>
            <div className="space-y-2 text-sm text-white/70">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 mt-0.5 text-white/40" />
                <div>
                  Piazza Velasca, 6 Milan, Italy
                  <br />
                  Via Pistoia, 11 Roma, Italy
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-white/40" />
                <span>+39 02 72095571</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-white/40" />
                <a
                  href="mailto:info@va-consulting.com"
                  className="hover:text-white transition-colors"
                >
                  info@va-consulting.com
                </a>
              </div>
            </div>
          </div>

          {/* Inquiries / Careers */}
          <div className="space-y-6">
            <div>
              <h3 className="text-xs font-semibold tracking-[0.28em] text-white/60 uppercase mb-3">
                Inquiries
              </h3>
              <div className="flex items-center gap-3 text-sm text-white/70">
                <Mail className="w-4 h-4 text-white/40" />
                <a
                  href="mailto:f.abritrio@va-consulting.com"
                  className="hover:text-white transition-colors"
                >
                  f.abritrio@va-consulting.com
                </a>
              </div>
            </div>
            <div>
              <h3 className="text-xs font-semibold tracking-[0.28em] text-white/60 uppercase mb-3">
                Careers
              </h3>
              <div className="flex items-center gap-3 text-sm text-white/70">
                <Mail className="w-4 h-4 text-white/40" />
                <a
                  href="mailto:careers@va-consulting.com"
                  className="hover:text-white transition-colors"
                >
                  careers@va-consulting.com
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom meta row */}
        <div className="mt-10 border-t border-white/10 pt-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between text-xs text-white/50">
          <div className="space-y-1">
            <p>© 2025 VA Consulting. All rights reserved.</p>
            <p>VAT: IT04747231001 &nbsp;·&nbsp; Rea: MI-1864610</p>
          </div>
          <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-6">
            <div className="flex gap-4 text-white/60">
              <a href="#" aria-label="Instagram" className="hover:text-white transition-colors text-sm">
                IG
              </a>
              <a href="#" aria-label="Facebook" className="hover:text-white transition-colors text-sm">
                FB
              </a>
              <a href="#" aria-label="YouTube" className="hover:text-white transition-colors text-sm">
                YT
              </a>
              <a href="#" aria-label="TikTok" className="hover:text-white transition-colors text-sm">
                TT
              </a>
              <a href="#" aria-label="LinkedIn" className="hover:text-white transition-colors text-sm">
                IN
              </a>
              <a href="#" aria-label="X" className="hover:text-white transition-colors text-sm">
                X
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
