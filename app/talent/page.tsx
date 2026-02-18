'use client'

import Link from 'next/link'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { talent } from '@/lib/mock-data'

export default function TalentPage() {
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
              <span className="text-foreground font-medium">Talent</span>
            </div>
            <h1 className="text-4xl font-serif font-bold mb-2">Industry Talent</h1>
            <p className="text-muted-foreground">Meet {talent.length}+ creative professionals shaping the industry</p>
          </div>
        </section>

        <div className="px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-7xl mx-auto w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {talent.map((person) => (
                <Link key={person.id} href={`/talent/${person.id}`}>
                  <div className="group cursor-pointer">
                    <div className="aspect-square overflow-hidden rounded-lg mb-4 bg-muted">
                      <img
                        src={person.photo}
                        alt={person.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <h3 className="font-serif font-bold text-lg mb-1 group-hover:text-accent transition-colors">
                      {person.name}
                    </h3>
                    <p className="text-sm text-accent mb-1">{person.role}</p>
                    <p className="text-xs text-muted-foreground">{person.company}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
