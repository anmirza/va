'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { interviews } from '@/lib/mock-data'
import { Calendar, User } from 'lucide-react'

const CATEGORIES = ['All', 'Creative', 'Leadership', 'Case Study', 'Luxury']

export default function InterviewsPage() {
  const [category, setCategory] = useState('All')
  const filtered = interviews.filter(i => category === 'All' || i.category === category)

  return (
    <div className="min-h-screen bg-[#eef0f3] flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="bg-[#2e3843] px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-4xl font-bold text-white mb-2">Interviews</h1>
            <p className="text-white/70">In-depth conversations with the industry's most influential creative leaders</p>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-wrap gap-2 mb-8">
            {CATEGORIES.map(c => (
              <button key={c} onClick={() => setCategory(c)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${category === c ? 'bg-[#2e3843] text-white' : 'bg-white text-[#666] hover:bg-[#d8dce2]'}`}
              >{c}</button>
            ))}
          </div>

          <div className="space-y-6">
            {filtered.map(interview => (
              <Link key={interview.id} href={`/interviews/${interview.id}`} className="group flex flex-col sm:flex-row gap-0 bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                <div className="sm:w-64 h-48 sm:h-auto overflow-hidden shrink-0">
                  <img src={interview.thumbnail} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                </div>
                <div className="flex-1 p-6">
                  <span className="inline-block px-3 py-1 bg-[#eef0f3] text-xs font-medium text-[#666] rounded-full mb-3">{interview.category}</span>
                  <h2 className="text-xl font-bold text-[#1a1a1a] mb-2 group-hover:text-[#0763d8] transition-colors">{interview.title}</h2>
                  <p className="text-[#666] text-sm mb-4 line-clamp-2">{interview.excerpt}</p>
                  <div className="flex items-center gap-4 text-xs text-[#666]">
                    <span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5" />By {interview.author}</span>
                    <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" />{new Date(interview.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
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
