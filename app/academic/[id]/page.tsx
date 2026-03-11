import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { getAcademicById, academicInstitutions } from '@/lib/mock-data'
import { MapPin, Globe, Calendar, BookOpen, Users } from 'lucide-react'

interface Props {
  params: Promise<{ id: string }>
}

export async function generateStaticParams() {
  return academicInstitutions.map(a => ({ id: a.id }))
}

export default async function AcademicDetailPage({ params }: Props) {
  const { id } = await params
  const institution = getAcademicById(id)
  if (!institution) notFound()

  return (
    <div className="min-h-screen bg-[#eef0f3] flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <div className="relative h-64 sm:h-80 overflow-hidden">
          <img src={institution.coverImage} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a]/80 via-[#1a1a1a]/30 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 max-w-7xl mx-auto">
            <span className="inline-block px-3 py-1 bg-[#f5d742] text-[#1a1a1a] text-xs font-bold rounded-full mb-3">
              {institution.type}
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold text-white">{institution.name}</h1>
          </div>
        </div>

        {/* Breadcrumb */}
        <div className="px-4 sm:px-6 lg:px-8 py-4 bg-white border-b border-[#e5e5e1]">
          <div className="max-w-5xl mx-auto flex items-center gap-2 text-sm">
            <Link href="/" className="text-[#666] hover:text-[#1a1a1a]">Home</Link>
            <span className="text-[#d8dce2]">/</span>
            <Link href="/academic" className="text-[#666] hover:text-[#1a1a1a]">Academic</Link>
            <span className="text-[#d8dce2]">/</span>
            <span className="text-[#1a1a1a] font-medium">{institution.name}</span>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main content */}
            <div className="lg:col-span-2 space-y-8">
              {/* About */}
              <div className="bg-white rounded-xl shadow-sm p-6 sm:p-8">
                <h2 className="text-xl font-bold text-[#1a1a1a] mb-4">About</h2>
                <p className="text-[#444] leading-relaxed">{institution.about}</p>
              </div>

              {/* Programmes */}
              <div className="bg-white rounded-xl shadow-sm p-6 sm:p-8">
                <h2 className="text-xl font-bold text-[#1a1a1a] mb-5">
                  <span className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-[#0763d8]" />
                    Programmes Offered
                  </span>
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {institution.programs.map(program => (
                    <div
                      key={program}
                      className="flex items-center gap-3 p-3 rounded-lg bg-[#eef0f3] hover:bg-[#d8dce2] transition-colors"
                    >
                      <span className="w-2 h-2 rounded-full bg-[#0763d8] shrink-0" />
                      <span className="text-sm font-medium text-[#1a1a1a]">{program}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notable alumni */}
              {institution.notableAlumni && institution.notableAlumni.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm p-6 sm:p-8">
                  <h2 className="text-xl font-bold text-[#1a1a1a] mb-4">
                    <span className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-[#0763d8]" />
                      Notable Alumni
                    </span>
                  </h2>
                  <ul className="space-y-2">
                    {institution.notableAlumni.map((alumni, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-[#444]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#f5d742] mt-1.5 shrink-0" />
                        {alumni}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick facts */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-base font-bold text-[#1a1a1a] mb-4 uppercase tracking-wide text-sm">Quick Facts</h3>
                <dl className="space-y-3">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-[#0763d8] mt-0.5 shrink-0" />
                    <div>
                      <dt className="text-xs text-[#666] uppercase tracking-wide">Location</dt>
                      <dd className="text-sm font-medium text-[#1a1a1a]">{institution.city}, {institution.country}</dd>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Calendar className="w-4 h-4 text-[#0763d8] mt-0.5 shrink-0" />
                    <div>
                      <dt className="text-xs text-[#666] uppercase tracking-wide">Founded</dt>
                      <dd className="text-sm font-medium text-[#1a1a1a]">{institution.founded}</dd>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <BookOpen className="w-4 h-4 text-[#0763d8] mt-0.5 shrink-0" />
                    <div>
                      <dt className="text-xs text-[#666] uppercase tracking-wide">Type</dt>
                      <dd className="text-sm font-medium text-[#1a1a1a]">{institution.type}</dd>
                    </div>
                  </div>
                </dl>

                <a
                  href={`https://${institution.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 flex items-center justify-center gap-2 w-full py-3 bg-[#2e3843] hover:bg-[#1a1a1a] text-white text-sm font-medium rounded-lg transition-colors"
                >
                  <Globe className="w-4 h-4" />
                  Visit Website
                </a>
              </div>

              {/* Related institutions */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-sm font-bold text-[#1a1a1a] mb-4 uppercase tracking-wide">Similar Institutions</h3>
                <div className="space-y-3">
                  {academicInstitutions
                    .filter(a => a.id !== institution.id && a.type === institution.type)
                    .slice(0, 3)
                    .map(related => (
                      <Link
                        key={related.id}
                        href={`/academic/${related.id}`}
                        className="flex items-center gap-3 group"
                      >
                        <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-[#eef0f3]">
                          <img src={related.coverImage} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-[#1a1a1a] group-hover:text-[#0763d8] transition-colors line-clamp-1">{related.name}</p>
                          <p className="text-xs text-[#666]">{related.city}, {related.country}</p>
                        </div>
                      </Link>
                    ))}
                </div>
                <Link href="/academic" className="block mt-4 text-xs text-center text-[#0763d8] hover:underline font-medium">
                  View all institutions →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
