'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { insights } from '@/lib/mock-data'
import { Calendar, User } from 'lucide-react'

const CATEGORIES = ['All', 'Industry', 'Brand Strategy', 'Markets']

export default function InsightsPage() {
  const [category, setCategory] = useState('All')
  const filtered = insights.filter(i => category === 'All' || i.category === category)
  const featured = filtered[0]
  const rest = filtered.slice(1)

  return (
    <div className="min-h-screen bg-[#eef0f3] flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <div className="bg-[#2e3843] px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-4xl font-bold text-white mb-2">Insights</h1>
            <p className="text-white/70">Industry perspectives and opinion from leading voices in advertising</p>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {/* Category filter */}
          <div className="flex flex-wrap gap-2 mb-8">
            {CATEGORIES.map(c => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${category === c ? 'bg-[#2e3843] text-white' : 'bg-white text-[#666] hover:bg-[#d8dce2]'}`}
              >
                {c}
              </button>
            ))}
          </div>

          {/* Featured */}
          {featured && (
            <Link href={`/insights/${featured.id}`} className="group block mb-10">
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden flex flex-col sm:flex-row hover:shadow-md transition-shadow">
                <div className="sm:w-2/5 h-56 sm:h-auto overflow-hidden">
                  <img src={featured.thumbnail} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="sm:w-3/5 p-6 sm:p-8 flex flex-col justify-center">
                  <span className="inline-block px-3 py-1 bg-[#eef0f3] text-xs font-medium text-[#666] rounded-full mb-3 w-fit">{featured.category}</span>
                  <h2 className="text-2xl font-bold text-[#1a1a1a] mb-3 group-hover:text-[#4fc487] transition-colors">{featured.title}</h2>
                  <p className="text-[#666] mb-4 line-clamp-3">{featured.excerpt}</p>
                  <div className="flex items-center gap-4 text-sm text-[#666]">
                    <span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5" />{featured.author}</span>
                    <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" />{new Date(featured.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  </div>
                </div>
              </div>
            </Link>
          )}

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {rest.map(insight => (
              <Link key={insight.id} href={`/insights/${insight.id}`} className="group bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                <div className="h-44 overflow-hidden">
                  <img src={insight.thumbnail} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                </div>
                <div className="p-5">
                  <span className="text-xs text-[#666] font-medium">{insight.category}</span>
                  <h3 className="font-bold text-[#1a1a1a] mt-1 mb-2 group-hover:text-[#4fc487] transition-colors line-clamp-2">{insight.title}</h3>
                  <p className="text-sm text-[#666] line-clamp-2 mb-3">{insight.excerpt}</p>
                  <div className="flex items-center gap-3 text-xs text-[#666]">
                    <span>{insight.author}</span>
                    <span>{new Date(insight.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
