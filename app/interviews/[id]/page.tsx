'use client'

import { use } from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { getInterviewById, interviews } from '@/lib/mock-data'
import { Calendar, User, ArrowLeft } from 'lucide-react'

export default function InterviewDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const interview = getInterviewById(id)
  if (!interview) notFound()
  const related = interviews.filter(i => i.id !== id).slice(0, 2)

  return (
    <div className="min-h-screen bg-[#eef0f3] flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="relative h-72 overflow-hidden">
          <img src={interview.thumbnail} alt="" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#2e3843] via-[#2e3843]/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 px-4 sm:px-6 lg:px-8 pb-8 max-w-4xl mx-auto">
            <span className="inline-block px-3 py-1 bg-[#0763d8]/80 text-white text-xs font-medium rounded-full mb-3">{interview.category}</span>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">{interview.title}</h1>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <article className="lg:col-span-2">
              <Link href="/interviews" className="flex items-center gap-1.5 text-sm text-[#666] hover:text-[#0763d8] mb-6 transition-colors">
                <ArrowLeft className="w-4 h-4" /> Back to Interviews
              </Link>
              <div className="flex items-center gap-4 text-sm text-[#666] mb-6">
                <span className="flex items-center gap-1.5"><User className="w-4 h-4" />By {interview.author}</span>
                <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" />{new Date(interview.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              </div>
              <div className="bg-white rounded-xl p-6 sm:p-8 shadow-sm">
                <p className="text-lg text-[#444] mb-6 leading-relaxed font-medium italic border-l-4 border-[#0763d8] pl-4">{interview.excerpt}</p>
                <div className="space-y-4 text-[#444] leading-relaxed">
                  {interview.content.split('\n\n').map((para, i) => {
                    if (para.startsWith('**') && !para.startsWith('**A') && !para.startsWith('**T') && !para.startsWith('**W') && !para.startsWith('**H')) {
                      return <h3 key={i} className="font-bold text-[#1a1a1a] text-base mt-6 text-[#0763d8]">{para.replace(/\*\*/g, '')}</h3>
                    }
                    return <p key={i} className={para.startsWith('**') ? 'font-bold text-[#1a1a1a]' : ''}>{para.replace(/\*\*/g, '')}</p>
                  })}
                </div>
              </div>
            </article>
            <aside>
              {related.length > 0 && (
                <div className="bg-white rounded-xl p-6 shadow-sm sticky top-20">
                  <h3 className="font-bold text-[#1a1a1a] mb-4">More Interviews</h3>
                  <div className="space-y-4">
                    {related.map(i => (
                      <Link key={i.id} href={`/interviews/${i.id}`} className="group block">
                        <img src={i.thumbnail} alt="" className="w-full h-28 object-cover rounded-lg mb-2" />
                        <p className="text-sm font-medium text-[#1a1a1a] group-hover:text-[#0763d8] transition-colors line-clamp-2">{i.title}</p>
                        <p className="text-xs text-[#666] mt-1">By {i.author}</p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
