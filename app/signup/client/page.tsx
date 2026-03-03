'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ChevronRight, ChevronLeft, Check, Briefcase } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { COUNTRIES, EMPLOYEE_SIZES } from '@/lib/rfi-data'

const STEPS = [
  { label: 'Company Info', icon: '🏢' },
  { label: 'Contact Details', icon: '📞' },
  { label: 'Interests', icon: '🎯' },
]

export default function ClientSignupPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState({
    companyName: '', industry: '', country: '', city: '',
    employeeSize: '', website: '',
    contactName: '', contactSurname: '', contactEmail: '', contactPhone: '',
    contactRole: '', linkedin: '',
    interests: [] as string[],
    notes: '',
  })

  const update = (field: string, value: string) => setFormData(prev => ({ ...prev, [field]: value }))

  const toggleInterest = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest],
    }))
  }

  const handleSubmit = () => {
    console.log('Client registration data:', formData)
    router.push('/dashboard')
  }

  const interests = [
    'Agency Search', 'Pitch Management', 'Market Intelligence',
    'Creative Benchmarking', 'Cost Benchmarking', 'Agency Evaluation',
    'New Business Tracking', 'Talent Insights',
  ]

  return (
    <div className="min-h-screen bg-[#02030E] flex flex-col">
      <header className="bg-[#02030E]/95 backdrop-blur-md border-b border-white/[0.06] px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-white">VA</Link>
        <Link href="/login" className="text-sm text-white/60 hover:text-white">Already registered? Sign in</Link>
      </header>

      <div className="flex-1 flex items-start justify-center px-4 py-10">
        <div className="w-full max-w-2xl">
          {/* Step indicator */}
          <div className="flex items-center justify-center gap-2 mb-8">
            {STEPS.map((step, i) => (
              <div key={step.label} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                  i < currentStep ? 'bg-[#4fc487] text-white' :
                  i === currentStep ? 'bg-[#4fc487]/20 text-[#4fc487] border border-[#4fc487]/40' :
                  'bg-white/[0.06] text-white/30'
                }`}>
                  {i < currentStep ? <Check className="w-4 h-4" /> : i + 1}
                </div>
                <span className={`text-xs hidden sm:block ${i === currentStep ? 'text-white' : 'text-white/30'}`}>
                  {step.label}
                </span>
                {i < STEPS.length - 1 && <div className="w-8 h-px bg-white/10 mx-1" />}
              </div>
            ))}
          </div>

          <div className="glass-card p-8">
            {/* Step 1: Company Info */}
            {currentStep === 0 && (
              <div className="space-y-5">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-[#4fc487]/10 rounded-xl flex items-center justify-center">
                    <Briefcase className="w-5 h-5 text-[#4fc487]" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Company Information</h2>
                    <p className="text-sm text-white/40">Tell us about your organization</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-white/60 mb-1.5">Company Name *</label>
                    <Input value={formData.companyName} onChange={e => update('companyName', e.target.value)}
                      className="h-10 bg-white/[0.06] border-white/[0.12] text-white rounded-xl" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/60 mb-1.5">Industry</label>
                    <Input value={formData.industry} onChange={e => update('industry', e.target.value)}
                      className="h-10 bg-white/[0.06] border-white/[0.12] text-white rounded-xl" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/60 mb-1.5">Country *</label>
                    <select value={formData.country} onChange={e => update('country', e.target.value)}
                      className="w-full h-10 bg-white/[0.06] border border-white/[0.12] text-white text-sm rounded-xl px-3">
                      <option value="">Select country</option>
                      {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/60 mb-1.5">City</label>
                    <Input value={formData.city} onChange={e => update('city', e.target.value)}
                      className="h-10 bg-white/[0.06] border-white/[0.12] text-white rounded-xl" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/60 mb-1.5">Company Size</label>
                    <select value={formData.employeeSize} onChange={e => update('employeeSize', e.target.value)}
                      className="w-full h-10 bg-white/[0.06] border border-white/[0.12] text-white text-sm rounded-xl px-3">
                      <option value="">Select size</option>
                      {EMPLOYEE_SIZES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/60 mb-1.5">Website</label>
                    <Input value={formData.website} onChange={e => update('website', e.target.value)}
                      placeholder="https://" className="h-10 bg-white/[0.06] border-white/[0.12] text-white rounded-xl" />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Contact Details */}
            {currentStep === 1 && (
              <div className="space-y-5">
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-white">Contact Details</h2>
                  <p className="text-sm text-white/40">Primary contact person</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-white/60 mb-1.5">Name *</label>
                    <Input value={formData.contactName} onChange={e => update('contactName', e.target.value)}
                      className="h-10 bg-white/[0.06] border-white/[0.12] text-white rounded-xl" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/60 mb-1.5">Surname *</label>
                    <Input value={formData.contactSurname} onChange={e => update('contactSurname', e.target.value)}
                      className="h-10 bg-white/[0.06] border-white/[0.12] text-white rounded-xl" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/60 mb-1.5">Corporate Email *</label>
                    <Input type="email" value={formData.contactEmail} onChange={e => update('contactEmail', e.target.value)}
                      placeholder="you@company.com" className="h-10 bg-white/[0.06] border-white/[0.12] text-white rounded-xl" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/60 mb-1.5">Phone</label>
                    <Input value={formData.contactPhone} onChange={e => update('contactPhone', e.target.value)}
                      className="h-10 bg-white/[0.06] border-white/[0.12] text-white rounded-xl" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/60 mb-1.5">Role/Title</label>
                    <Input value={formData.contactRole} onChange={e => update('contactRole', e.target.value)}
                      className="h-10 bg-white/[0.06] border-white/[0.12] text-white rounded-xl" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/60 mb-1.5">LinkedIn</label>
                    <Input value={formData.linkedin} onChange={e => update('linkedin', e.target.value)}
                      placeholder="linkedin.com/in/..." className="h-10 bg-white/[0.06] border-white/[0.12] text-white rounded-xl" />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Interests */}
            {currentStep === 2 && (
              <div className="space-y-5">
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-white">Areas of Interest</h2>
                  <p className="text-sm text-white/40">What are you looking for on the platform?</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {interests.map(interest => (
                    <button key={interest} onClick={() => toggleInterest(interest)}
                      className={`text-left px-4 py-3 rounded-xl text-sm transition-all ${
                        formData.interests.includes(interest)
                          ? 'bg-[#4fc487]/15 text-[#4fc487] border border-[#4fc487]/30'
                          : 'bg-white/[0.04] text-white/60 border border-white/[0.08] hover:border-white/20'
                      }`}
                    >
                      {interest}
                    </button>
                  ))}
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/60 mb-1.5">Additional Notes</label>
                  <textarea value={formData.notes} onChange={e => update('notes', e.target.value)}
                    rows={3} placeholder="Tell us more about your needs..."
                    className="w-full bg-white/[0.06] border border-white/[0.12] text-white text-sm rounded-xl px-4 py-3 placeholder:text-white/30" />
                </div>
              </div>
            )}

            {/* Navigation buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t border-white/[0.06]">
              {currentStep > 0 ? (
                <Button variant="outline" onClick={() => setCurrentStep(currentStep - 1)}
                  className="border-white/20 text-white hover:bg-white/10 rounded-full">
                  <ChevronLeft className="w-4 h-4 mr-1" /> Back
                </Button>
              ) : (
                <Link href="/signup" className="text-sm text-white/40 hover:text-white flex items-center gap-1">
                  <ChevronLeft className="w-3.5 h-3.5" /> Choose type
                </Link>
              )}
              {currentStep < STEPS.length - 1 ? (
                <Button onClick={() => setCurrentStep(currentStep + 1)}
                  className="bg-[#4fc487] hover:bg-[#45b078] text-white rounded-full">
                  Next <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              ) : (
                <Button onClick={handleSubmit}
                  className="bg-[#4fc487] hover:bg-[#45b078] text-white rounded-full">
                  Submit Registration <Check className="w-4 h-4 ml-1" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
