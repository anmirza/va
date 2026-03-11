'use client'

import { use } from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { getNewsById, news } from '@/lib/mock-data'
import { Calendar, ArrowLeft, Tag } from 'lucide-react'

export default function NewsDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const article = getNewsById(id)
  if (!article) notFound()

  const related = news.filter(n => n.id !== id && n.category === article.category).slice(0, 3)

  return (
    <div className="min-h-screen bg-[#eef0f3] flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <div className="relative h-72 sm:h-96 overflow-hidden">
          <img src={article.thumbnail} alt="" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#2e3843] via-[#2e3843]/50 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 px-4 sm:px-6 lg:px-8 pb-8 max-w-4xl mx-auto">
            <span className="inline-block px-3 py-1 bg-[#0763d8] text-white text-xs font-medium rounded-full mb-3">{article.category}</span>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">{article.title}</h1>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Article */}
            <article className="lg:col-span-2">
              <Link href="/news" className="flex items-center gap-1.5 text-sm text-[#666] hover:text-[#0763d8] mb-6 transition-colors">
                <ArrowLeft className="w-4 h-4" /> Back to News
              </Link>
              <div className="flex items-center gap-4 text-sm text-[#666] mb-6">
                <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" />{new Date(article.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                <span>By <span className="font-medium text-[#1a1a1a]">{article.author}</span></span>
              </div>
              <div className="bg-white rounded-xl p-6 sm:p-8 shadow-sm">
                <p className="text-lg text-[#666] mb-6 leading-relaxed font-medium">{article.excerpt}</p>
                {article.content ? (
                  <div className="prose max-w-none text-[#444] leading-relaxed space-y-4">
                    {article.content.split('\n\n').map((para, i) => (
                      <p key={i}>{para}</p>
                    ))}
                  </div>
                ) : (
                  <p className="text-[#666]">Full article content coming soon.</p>
                )}
              </div>
              {article.tags && (
                <div className="mt-6 flex flex-wrap gap-2">
                  {article.tags.map(tag => (
                    <span key={tag} className="flex items-center gap-1 px-3 py-1.5 bg-white rounded-full text-sm text-[#666] shadow-sm">
                      <Tag className="w-3 h-3" />{tag}
                    </span>
                  ))}
                </div>
              )}
            </article>

            {/* Sidebar */}
            <aside>
              {related.length > 0 && (
                <div className="bg-white rounded-xl p-6 shadow-sm sticky top-20">
                  <h3 className="font-bold text-[#1a1a1a] mb-4">Related Articles</h3>
                  <div className="space-y-4">
                    {related.map(n => (
                      <Link key={n.id} href={`/news/${n.id}`} className="group block">
                        <img src={n.thumbnail} alt="" className="w-full h-28 object-cover rounded-lg mb-2" />
                        <p className="text-sm font-medium text-[#1a1a1a] group-hover:text-[#0763d8] transition-colors line-clamp-2">{n.title}</p>
                        <p className="text-xs text-[#666] mt-1">{n.date}</p>
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
