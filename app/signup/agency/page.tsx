'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Check, ChevronRight } from 'lucide-react'

const COMPETENCIES = [
  'Full Service', 'Digital', 'Social Media', 'PR', 'Media', 'Experiential',
  'Brand Strategy', 'Design', 'Luxury', 'Multicultural', 'Boutique', 'Healthcare',
  'Performance Marketing', 'Content', 'Programmatic', 'Influencer Marketing',
]

const CLIENT_INDUSTRIES = [
  'Automotive', 'Beverages', 'Finance', 'Food', 'Healthcare', 'Luxury', 'Retail',
  'Technology', 'FMCG', 'Entertainment', 'Sports', 'Fashion', 'Travel & Tourism',
  'Media', 'Telecom', 'Real Estate',
]

const COMPANY_TYPES = ['Advertising Agency', 'Production Company', 'Search Consultant', 'Design Studio', 'Media Agency', 'PR Agency', 'Marketing Services']

const COUNTRIES = ['France', 'United Kingdom', 'United States', 'Germany', 'Spain', 'Italy', 'Brazil', 'Australia', 'Japan', 'Canada', 'Netherlands', 'Sweden', 'Belgium', 'Switzerland', 'Singapore']

interface AgencyFormData {
  name: string
  type: string
  city: string
  country: string
  founded: string
  competencies: string[]
  clientIndustries: string[]
  logo: string
  coverImage: string
  tagline: string
  about: string
  website: string
  teamMembers: { name: string; role: string }[]
  campaigns: { title: string; brand: string; year: string }[]
}

const INITIAL_DATA: AgencyFormData = {
  name: '', type: 'Advertising Agency', city: '', country: 'France', founded: '',
  competencies: [], clientIndustries: [],
  logo: '', coverImage: '', tagline: '', about: '', website: '',
  teamMembers: [{ name: '', role: '' }],
  campaigns: [{ title: '', brand: '', year: '' }],
}

const STEPS = ['Basic Info', 'Services & Sectors', 'Profile Details', 'Team & Work']

export default function AgencySignupPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [data, setData] = useState<AgencyFormData>(INITIAL_DATA)

  const update = (partial: Partial<AgencyFormData>) => setData(prev => ({ ...prev, ...partial }))

  const toggleItem = (key: 'competencies' | 'clientIndustries', val: string) => {
    setData(prev => ({
      ...prev,
      [key]: prev[key].includes(val) ? prev[key].filter(v => v !== val) : [...prev[key], val],
    }))
  }

  const handleFinish = () => {
    // In a real app, submit to API. Here we just navigate.
    router.push('/dashboard/agency')
  }

  return (
    <div className="min-h-screen bg-[#eef0f3] flex flex-col">
      <header className="bg-[#2e3843] px-6 py-4">
        <Link href="/" className="text-xl font-bold text-white">REQUISTI</Link>
      </header>

      <div className="flex-1 px-4 py-10">
        <div className="max-w-2xl mx-auto">
          {/* Progress */}
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              {STEPS.map((s, i) => (
                <div key={s} className="flex items-center gap-1">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${i < step ? 'bg-[#4fc487] text-white' : i === step ? 'bg-[#2e3843] text-white' : 'bg-[#d8dce2] text-[#666]'}`}>
                    {i < step ? <Check className="w-3.5 h-3.5" /> : i + 1}
                  </div>
                  <span className={`text-xs hidden sm:inline ${i === step ? 'text-[#1a1a1a] font-medium' : 'text-[#666]'}`}>{s}</span>
                  {i < STEPS.length - 1 && <div className={`h-0.5 w-8 sm:w-16 mx-1 ${i < step ? 'bg-[#4fc487]' : 'bg-[#d8dce2]'}`} />}
                </div>
              ))}
            </div>
            <div className="h-1 bg-[#d8dce2] rounded-full overflow-hidden">
              <div className="h-full bg-[#4fc487] rounded-full transition-all" style={{ width: `${((step + 1) / STEPS.length) * 100}%` }} />
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-8">
            {/* STEP 0: Basic Info */}
            {step === 0 && (
              <div>
                <h2 className="text-2xl font-bold text-[#1a1a1a] mb-6">Basic Information</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Company Name *</label>
                    <Input value={data.name} onChange={e => update({ name: e.target.value })} placeholder="e.g. Wieden+Kennedy" className="h-11" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Company Type *</label>
                    <select value={data.type} onChange={e => update({ type: e.target.value })} className="w-full h-11 border border-[#d8dce2] rounded-lg px-3 text-sm bg-white focus:outline-none focus:border-[#4fc487]">
                      {COMPANY_TYPES.map(t => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1.5">City *</label>
                      <Input value={data.city} onChange={e => update({ city: e.target.value })} placeholder="e.g. Paris" className="h-11" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5">Country *</label>
                      <select value={data.country} onChange={e => update({ country: e.target.value })} className="w-full h-11 border border-[#d8dce2] rounded-lg px-3 text-sm bg-white focus:outline-none focus:border-[#4fc487]">
                        {COUNTRIES.map(c => <option key={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Founded Year</label>
                    <Input value={data.founded} onChange={e => update({ founded: e.target.value })} placeholder="e.g. 1995" type="number" min="1800" max="2026" className="h-11" />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 1: Services & Sectors */}
            {step === 1 && (
              <div>
                <h2 className="text-2xl font-bold text-[#1a1a1a] mb-2">Services & Client Industries</h2>
                <p className="text-sm text-[#666] mb-6">Select what best describes your agency</p>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-[#1a1a1a] mb-3">Competencies / Services</label>
                    <div className="flex flex-wrap gap-2">
                      {COMPETENCIES.map(c => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => toggleItem('competencies', c)}
                          className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${data.competencies.includes(c) ? 'bg-[#2e3843] text-white border-[#2e3843]' : 'bg-white text-[#666] border-[#d8dce2] hover:border-[#4fc487]'}`}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#1a1a1a] mb-3">Client Industries</label>
                    <div className="flex flex-wrap gap-2">
                      {CLIENT_INDUSTRIES.map(c => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => toggleItem('clientIndustries', c)}
                          className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${data.clientIndustries.includes(c) ? 'bg-[#4fc487] text-white border-[#4fc487]' : 'bg-white text-[#666] border-[#d8dce2] hover:border-[#4fc487]'}`}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: Profile Details */}
            {step === 2 && (
              <div>
                <h2 className="text-2xl font-bold text-[#1a1a1a] mb-6">Profile Details</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Tagline</label>
                    <Input value={data.tagline} onChange={e => update({ tagline: e.target.value })} placeholder="Your agency's one-line pitch" className="h-11" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">About</label>
                    <textarea
                      value={data.about}
                      onChange={e => update({ about: e.target.value })}
                      placeholder="Tell brands about your agency - what makes you unique?"
                      rows={4}
                      className="w-full border border-[#d8dce2] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#4fc487] resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Website</label>
                    <Input value={data.website} onChange={e => update({ website: e.target.value })} placeholder="https://youragency.com" className="h-11" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Logo URL</label>
                    <Input value={data.logo} onChange={e => update({ logo: e.target.value })} placeholder="https://..." className="h-11" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Cover Image URL</label>
                    <Input value={data.coverImage} onChange={e => update({ coverImage: e.target.value })} placeholder="https://..." className="h-11" />
                    <p className="text-xs text-[#666] mt-1">We recommend Unsplash images for best results</p>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: Team & Work */}
            {step === 3 && (
              <div>
                <h2 className="text-2xl font-bold text-[#1a1a1a] mb-6">Team & Work</h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-[#1a1a1a] mb-3">Team Members (up to 3)</label>
                    <div className="space-y-3">
                      {data.teamMembers.map((m, i) => (
                        <div key={i} className="grid grid-cols-2 gap-3">
                          <Input value={m.name} onChange={e => { const arr = [...data.teamMembers]; arr[i] = { ...arr[i], name: e.target.value }; update({ teamMembers: arr }) }} placeholder="Name" className="h-10" />
                          <Input value={m.role} onChange={e => { const arr = [...data.teamMembers]; arr[i] = { ...arr[i], role: e.target.value }; update({ teamMembers: arr }) }} placeholder="Role" className="h-10" />
                        </div>
                      ))}
                      {data.teamMembers.length < 3 && (
                        <button type="button" onClick={() => update({ teamMembers: [...data.teamMembers, { name: '', role: '' }] })} className="text-sm text-[#4fc487] hover:underline">
                          + Add team member
                        </button>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#1a1a1a] mb-3">Recent Work (up to 3)</label>
                    <div className="space-y-3">
                      {data.campaigns.map((c, i) => (
                        <div key={i} className="grid grid-cols-3 gap-3">
                          <Input value={c.title} onChange={e => { const arr = [...data.campaigns]; arr[i] = { ...arr[i], title: e.target.value }; update({ campaigns: arr }) }} placeholder="Campaign title" className="h-10 col-span-2" />
                          <Input value={c.brand} onChange={e => { const arr = [...data.campaigns]; arr[i] = { ...arr[i], brand: e.target.value }; update({ campaigns: arr }) }} placeholder="Brand" className="h-10" />
                        </div>
                      ))}
                      {data.campaigns.length < 3 && (
                        <button type="button" onClick={() => update({ campaigns: [...data.campaigns, { title: '', brand: '', year: '' }] })} className="text-sm text-[#4fc487] hover:underline">
                          + Add work
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between mt-8 pt-6 border-t border-[#e5e5e1]">
              {step > 0 ? (
                <Button variant="outline" onClick={() => setStep(step - 1)} className="border-[#d8dce2]">
                  Back
                </Button>
              ) : <div />}
              {step < STEPS.length - 1 ? (
                <Button onClick={() => setStep(step + 1)} className="bg-[#2e3843] hover:bg-[#3d4f5e] text-white gap-1">
                  Next <ChevronRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button onClick={handleFinish} className="bg-[#4fc487] hover:bg-[#45b078] text-white">
                  Create Profile
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
