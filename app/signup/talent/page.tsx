'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Check, ChevronRight } from 'lucide-react'

const EXPERTISE_OPTIONS = [
  'Creative Direction', 'Art Direction', 'Copywriting', 'Strategy/Planning',
  'Brand Strategy', 'Digital Marketing', 'Social Media', 'Media Planning',
  'Photography', 'Illustration', 'Design', 'Motion Design',
  'Video Production', 'Post Production', 'Music & Sound Design',
  'PR', 'New Business', 'Account Management', 'Data & Analytics',
]

const STEPS = ['Personal Info', 'Expertise', 'Profile & Bio']

interface TalentFormData {
  name: string
  email: string
  city: string
  country: string
  currentRole: string
  currentCompany: string
  expertise: string[]
  bio: string
  photo: string
  linkedin: string
  twitter: string
}

const INITIAL: TalentFormData = {
  name: '', email: '', city: '', country: 'France', currentRole: '', currentCompany: '',
  expertise: [], bio: '', photo: '', linkedin: '', twitter: '',
}

export default function TalentSignupPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [data, setData] = useState<TalentFormData>(INITIAL)
  const update = (partial: Partial<TalentFormData>) => setData(prev => ({ ...prev, ...partial }))

  const toggleExpertise = (val: string) => {
    setData(prev => ({
      ...prev,
      expertise: prev.expertise.includes(val) ? prev.expertise.filter(v => v !== val) : [...prev.expertise, val],
    }))
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
                  {i < STEPS.length - 1 && <div className={`h-0.5 w-12 sm:w-24 mx-1 ${i < step ? 'bg-[#4fc487]' : 'bg-[#d8dce2]'}`} />}
                </div>
              ))}
            </div>
            <div className="h-1 bg-[#d8dce2] rounded-full overflow-hidden">
              <div className="h-full bg-[#4fc487] rounded-full transition-all" style={{ width: `${((step + 1) / STEPS.length) * 100}%` }} />
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-8">
            {step === 0 && (
              <div>
                <h2 className="text-2xl font-bold text-[#1a1a1a] mb-6">Personal Information</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Full Name *</label>
                    <Input value={data.name} onChange={e => update({ name: e.target.value })} placeholder="Your full name" className="h-11" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Email *</label>
                    <Input type="email" value={data.email} onChange={e => update({ email: e.target.value })} placeholder="you@example.com" className="h-11" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1.5">City</label>
                      <Input value={data.city} onChange={e => update({ city: e.target.value })} placeholder="Paris" className="h-11" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5">Country</label>
                      <Input value={data.country} onChange={e => update({ country: e.target.value })} placeholder="France" className="h-11" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Current Role</label>
                    <Input value={data.currentRole} onChange={e => update({ currentRole: e.target.value })} placeholder="e.g. Creative Director" className="h-11" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Current Company / Agency</label>
                    <Input value={data.currentCompany} onChange={e => update({ currentCompany: e.target.value })} placeholder="e.g. Wieden+Kennedy" className="h-11" />
                  </div>
                </div>
              </div>
            )}

            {step === 1 && (
              <div>
                <h2 className="text-2xl font-bold text-[#1a1a1a] mb-2">Your Expertise</h2>
                <p className="text-sm text-[#666] mb-6">Select all areas that apply to your skills</p>
                <div className="flex flex-wrap gap-2">
                  {EXPERTISE_OPTIONS.map(opt => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => toggleExpertise(opt)}
                      className={`px-3 py-2 rounded-full text-sm border transition-colors ${data.expertise.includes(opt) ? 'bg-[#4fc487] text-white border-[#4fc487]' : 'bg-white text-[#666] border-[#d8dce2] hover:border-[#4fc487]'}`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
                {data.expertise.length > 0 && (
                  <p className="text-sm text-[#4fc487] mt-4">{data.expertise.length} skill{data.expertise.length !== 1 ? 's' : ''} selected</p>
                )}
              </div>
            )}

            {step === 2 && (
              <div>
                <h2 className="text-2xl font-bold text-[#1a1a1a] mb-6">Profile & Bio</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Photo URL</label>
                    <Input value={data.photo} onChange={e => update({ photo: e.target.value })} placeholder="https://..." className="h-11" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Bio</label>
                    <textarea
                      value={data.bio}
                      onChange={e => update({ bio: e.target.value })}
                      placeholder="Write a short bio about yourself - your background, achievements, and what drives you."
                      rows={5}
                      className="w-full border border-[#d8dce2] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#4fc487] resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">LinkedIn URL</label>
                    <Input value={data.linkedin} onChange={e => update({ linkedin: e.target.value })} placeholder="https://linkedin.com/in/..." className="h-11" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Twitter / X</label>
                    <Input value={data.twitter} onChange={e => update({ twitter: e.target.value })} placeholder="@yourhandle" className="h-11" />
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-between mt-8 pt-6 border-t border-[#e5e5e1]">
              {step > 0 ? (
                <Button variant="outline" onClick={() => setStep(step - 1)} className="border-[#d8dce2]">Back</Button>
              ) : <div />}
              {step < STEPS.length - 1 ? (
                <Button onClick={() => setStep(step + 1)} className="bg-[#2e3843] hover:bg-[#3d4f5e] text-white gap-1">
                  Next <ChevronRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button onClick={() => router.push('/dashboard/talent')} className="bg-[#4fc487] hover:bg-[#45b078] text-white">
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
