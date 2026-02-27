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
  const [isLight, setIsLight] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const activeCfg: CategoryConfig = categories.find(c => c.key === activeCategory)!

  // Detect light mode by observing class changes on <html>
  useEffect(() => {
    const html = document.documentElement
    const check = () => setIsLight(html.classList.contains('light-mode'))
    check()
    const obs = new MutationObserver(check)
    obs.observe(html, { attributes: true, attributeFilter: ['class'] })
    return () => obs.disconnect()
  }, [])

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
    <div ref={containerRef} className="w-full max-w-3xl mx-auto">
      {/* Category Tabs — centered above the search bar */}
      <div className="flex items-center justify-center gap-1 mb-0">
        {categories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => handleCategoryChange(cat.key)}
            className={`
              relative px-6 py-2.5 text-sm font-semibold whitespace-nowrap transition-all duration-200
              rounded-t-xl
              ${activeCategory === cat.key
                ? isLight
                  ? 'bg-white text-[#1a1a2e] border border-gray-200 border-b-transparent shadow-sm'
                  : 'bg-white/[0.12] text-white border border-white/[0.15] border-b-transparent backdrop-blur-md'
                : isLight
                  ? 'bg-gray-100 text-gray-500 border border-transparent hover:bg-gray-200 hover:text-gray-700'
                  : 'bg-white/[0.04] text-white/50 border border-transparent hover:bg-white/[0.08] hover:text-white/70'
              }
            `}
          >
            {cat.label}
            {activeCategory === cat.key && (
              <span
                className="absolute bottom-0 left-3 right-3 h-[2px] bg-[#4fc487] rounded-full"
                aria-hidden="true"
              />
            )}
          </button>
        ))}
      </div>

      {/* Search Input Bar */}
      <div className={`relative rounded-2xl shadow-2xl overflow-visible ${
        isLight
          ? 'bg-white border border-gray-200 shadow-gray-200/50'
          : 'bg-white/[0.08] backdrop-blur-xl border border-white/[0.12] shadow-black/30'
      }`}>
        <form onSubmit={handleSearch} className="flex items-center">
          <div className="flex items-center gap-3 flex-1 px-5 py-4">
            <span className={isLight ? 'text-gray-400 flex-shrink-0' : 'text-white/40 flex-shrink-0'}>
              <SearchIcon />
            </span>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setIsOpen(true)}
              placeholder={activeCfg.placeholder}
              className={`flex-1 bg-transparent text-base outline-none font-medium border-none ${
                isLight
                  ? 'text-[#1a1a2e] placeholder-gray-400'
                  : 'text-white placeholder-white/30'
              }`}
              style={{ background: 'transparent' }}
            />
            {query && (
              <button
                type="button"
                onClick={() => { setQuery(''); inputRef.current?.focus() }}
                className={`transition-colors flex-shrink-0 ${isLight ? 'text-gray-400 hover:text-gray-700' : 'text-white/40 hover:text-white'}`}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
          <div className={`h-8 w-px my-3 ${isLight ? 'bg-gray-200' : 'bg-white/[0.1]'}`} />
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-4 bg-[#4fc487] hover:bg-[#45b078] text-white font-semibold text-sm transition-all duration-200 rounded-r-2xl flex-shrink-0"
          >
            <span>Search</span>
            <ArrowIcon />
          </button>
        </form>

        {/* Suggestion Dropdown */}
        {isOpen && (
          <div className={`absolute top-full left-0 right-0 mt-2 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 ${
            isLight
              ? 'bg-white border border-gray-200 shadow-gray-300/40'
              : 'bg-[#151830] border border-white/[0.12] shadow-black/60'
          }`}>
            {/* Header row */}
            <div className={`flex items-center justify-between px-6 pt-5 pb-3 border-b ${
              isLight ? 'border-gray-100' : 'border-white/[0.10]'
            }`}>
              <p className={`text-xs font-semibold uppercase tracking-widest ${
                isLight ? 'text-gray-400' : 'text-white/60'
              }`}>
                Browse {activeCfg.label}
              </p>
              <Link
                href={activeCfg.page}
                className="flex items-center gap-1.5 text-xs text-[#4fc487] hover:text-[#6ddb9f] font-medium transition-colors"
                onClick={() => setIsOpen(false)}
              >
                View all <ArrowIcon />
              </Link>
            </div>

            {/* Suggestion groups */}
            <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0 divide-x ${
              isLight ? 'divide-gray-100' : 'divide-white/[0.06]'
            }`}>
              {activeCfg.groups.map((group) => (
                <div key={group.heading} className="p-5">
                  <p className="flex items-center gap-2 text-xs font-bold text-[#4fc487]/80 uppercase tracking-wider mb-3">
                    <span>{group.icon}</span>
                    {group.heading}
                  </p>
                  <ul className="space-y-0.5">
                    {group.items.map((item) => (
                      <li key={item.label}>
                        <Link
                          href={item.href}
                          className={`flex items-center gap-2.5 py-2 px-3 rounded-lg text-sm font-medium transition-all duration-150 group ${
                            isLight
                              ? 'text-gray-700 hover:text-[#4fc487] hover:bg-[#4fc487]/[0.06]'
                              : 'text-white/90 hover:text-[#4fc487] hover:bg-white/[0.06]'
                          }`}
                          onClick={() => setIsOpen(false)}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-[#4fc487]/50 group-hover:bg-[#4fc487] flex-shrink-0 transition-colors" />
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
              <div className={`border-t px-6 py-3 ${
                isLight ? 'border-gray-100 bg-gray-50' : 'border-white/[0.06] bg-white/[0.02]'
              }`}>
                <button
                  type="button"
                  onClick={handleSearch}
                  className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                    isLight ? 'text-gray-500 hover:text-gray-800' : 'text-white/60 hover:text-white'
                  }`}
                >
                  <SearchIcon />
                  Search for &ldquo;<span className={isLight ? 'text-gray-900 font-bold' : 'text-white font-bold'}>{query}</span>&rdquo; in {activeCfg.label}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
