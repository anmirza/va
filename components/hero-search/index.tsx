'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { categories, type CategoryConfig, type CategoryKey } from './suggestion-data'

const SearchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.35-4.35" />
  </svg>
)

const ArrowIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
)

export default function HeroSearch() {
  const router = useRouter()
  const [activeCategory, setActiveCategory] = useState<CategoryKey>('agencies')
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const activeCfg: CategoryConfig = categories.find(c => c.key === activeCategory)!

  const handleClickOutside = useCallback((e: MouseEvent) => {
    if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
      setIsOpen(false)
    }
  }, [])

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [handleClickOutside])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) {
      router.push(activeCfg.page)
    } else {
      router.push(`${activeCfg.page}?q=${encodeURIComponent(query.trim())}`)
    }
    setIsOpen(false)
  }

  const handleCategoryChange = (key: CategoryKey) => {
    setActiveCategory(key)
    setQuery('')
    setIsOpen(true)
    setTimeout(() => inputRef.current?.focus(), 50)
  }

  return (
    <div ref={containerRef} className="w-full max-w-4xl mx-auto">
      {/* Category Tabs */}
      <div className="flex items-center gap-0 mb-0 overflow-x-auto scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => handleCategoryChange(cat.key)}
            className={`
              relative px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-all duration-200
              rounded-t-lg border border-b-0
              ${activeCategory === cat.key
                ? 'bg-white text-[#1a1a1a] border-white/30 z-10'
                : 'bg-white/10 text-white/70 border-white/10 hover:bg-white/20 hover:text-white'
              }
            `}
          >
            {cat.label}
            {activeCategory === cat.key && (
              <span
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#f5d742]"
                aria-hidden="true"
              />
            )}
          </button>
        ))}
      </div>

      {/* Search Input Bar */}
      <div className="relative bg-white rounded-b-2xl rounded-tr-2xl shadow-2xl overflow-visible">
        <form onSubmit={handleSearch} className="flex items-center">
          <div className="flex items-center gap-3 flex-1 px-5 py-4">
            <span className="text-[#2e3843]/40 flex-shrink-0">
              <SearchIcon />
            </span>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setIsOpen(true)}
              placeholder={activeCfg.placeholder}
              className="flex-1 bg-transparent text-[#1a1a1a] placeholder-[#2e3843]/40 text-base outline-none font-medium"
            />
            {query && (
              <button
                type="button"
                onClick={() => { setQuery(''); inputRef.current?.focus() }}
                className="text-[#2e3843]/40 hover:text-[#2e3843] transition-colors flex-shrink-0"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
          <div className="h-full w-px bg-gray-100 my-3" />
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-4 bg-[#f5d742] hover:bg-[#e8c93c] text-[#1a1a1a] font-semibold text-sm transition-all duration-200 rounded-br-2xl flex-shrink-0"
          >
            <span>Search</span>
            <ArrowIcon />
          </button>
        </form>

        {/* Suggestion Dropdown */}
        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
            {/* Header row */}
            <div className="flex items-center justify-between px-6 pt-5 pb-3 border-b border-gray-50">
              <p className="text-xs font-semibold text-[#2e3843]/50 uppercase tracking-widest">
                Browse {activeCfg.label}
              </p>
              <Link
                href={activeCfg.page}
                className="flex items-center gap-1.5 text-xs text-[#2e3843]/60 hover:text-[#2e3843] font-medium transition-colors"
                onClick={() => setIsOpen(false)}
              >
                View all <ArrowIcon />
              </Link>
            </div>

            {/* Suggestion groups */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0 divide-x divide-gray-50">
              {activeCfg.groups.map((group) => (
                <div key={group.heading} className="p-5">
                  <p className="flex items-center gap-2 text-xs font-bold text-[#2e3843]/70 uppercase tracking-wider mb-3">
                    <span>{group.icon}</span>
                    {group.heading}
                  </p>
                  <ul className="space-y-1">
                    {group.items.map((item) => (
                      <li key={item.label}>
                        <Link
                          href={item.href}
                          className="flex items-center gap-2 py-1.5 px-2 rounded-lg text-sm text-[#2e3843]/80 hover:text-[#1a1a1a] hover:bg-[#f5f5f0] transition-all duration-150 group"
                          onClick={() => setIsOpen(false)}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-[#f5d742] flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Footer CTA */}
            {query.trim() && (
              <div className="border-t border-gray-50 px-6 py-3 bg-[#f9f9f7]">
                <button
                  type="button"
                  onClick={handleSearch}
                  className="flex items-center gap-2 text-sm text-[#2e3843] font-medium hover:text-[#1a1a1a] transition-colors"
                >
                  <SearchIcon />
                  Search for &ldquo;<span className="text-[#1a1a1a] font-bold">{query}</span>&rdquo; in {activeCfg.label}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
