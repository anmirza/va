'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Badge } from '@/components/ui/badge'
import { news } from '@/lib/mock-data'

const CATEGORIES = ['All', ...new Set(news.map(n => n.category))].sort()

export default function NewsPage() {
  const [selectedCategory, setSelectedCategory] = useState('All')

  const filteredNews = useMemo(() => {
    let results = [...news]
    if (selectedCategory !== 'All') {
      results = results.filter(n => n.category === selectedCategory)
    }
    return results.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }, [selectedCategory])

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Page Header */}
        <section className="px-4 sm:px-6 lg:px-8 py-12 border-b border-border bg-card/50">
          <div className="max-w-7xl mx-auto w-full">
            <div className="flex items-center gap-2 mb-4 text-sm">
              <Link href="/" className="text-muted-foreground hover:text-foreground">Home</Link>
              <span className="text-muted-foreground">/</span>
              <span className="text-foreground font-medium">News</span>
            </div>
            <h1 className="text-4xl font-serif font-bold mb-2">News & Trends</h1>
            <p className="text-muted-foreground">Stay updated with the latest in advertising</p>
          </div>
        </section>

        <div className="px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-5xl mx-auto w-full">
            {/* Category Filter */}
            <div className="mb-12">
              <h3 className="text-sm font-medium text-muted-foreground mb-4">FILTER BY CATEGORY</h3>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((category) => (
                  <Badge
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    variant={selectedCategory === category ? 'default' : 'outline'}
                    className="cursor-pointer"
                  >
                    {category}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Articles */}
            {filteredNews.length > 0 ? (
              <div className="space-y-8">
                {filteredNews.map((article, index) => (
                  <Link key={article.id} href={`/news/${article.id}`}>
                    <article className="group cursor-pointer pb-8 border-b border-border last:border-b-0 last:pb-0">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Thumbnail */}
                        <div className="md:col-span-1">
                          <div className="aspect-video rounded-lg overflow-hidden bg-muted">
                            <img
                              src={article.thumbnail}
                              alt={article.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                        </div>

                        {/* Content */}
                        <div className="md:col-span-2">
                          <div className="mb-3">
                            <Badge variant="outline">{article.category}</Badge>
                          </div>
                          <h2 className="text-2xl font-serif font-bold mb-3 group-hover:text-accent transition-colors line-clamp-2">
                            {article.title}
                          </h2>
                          <p className="text-muted-foreground mb-4 line-clamp-2">
                            {article.excerpt}
                          </p>
                          <div className="flex justify-between items-center text-sm text-muted-foreground">
                            <span>{article.author}</span>
                            <span className="font-mono">{new Date(article.date).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No news articles found for this category.</p>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
