'use client'

import { useState, useMemo } from 'react'
import { RfiField } from '@/lib/admin-store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ChevronRight, ChevronLeft, Check, Upload, Plus, Trash2 } from 'lucide-react'

interface DynamicRfiFormProps {
  fields: RfiField[]
  onSubmit: (data: Record<string, any>) => void
  onCancel: () => void
  isSubmitting?: boolean
  title: string
  subtitle: string
}

export function DynamicRfiForm({ fields, onSubmit, onCancel, isSubmitting, title, subtitle }: DynamicRfiFormProps) {
  const [step, setStep] = useState(0)
  const [formData, setFormData] = useState<Record<string, any>>({})
  
  // Group fields by section
  const sections = useMemo(() => {
    const groups: Record<string, RfiField[]> = {}
    fields.filter(f => f.visible !== false).forEach(f => {
      const s = f.section || 'General'
      if (!groups[s]) groups[s] = []
      groups[s].push(f)
    })
    return Object.entries(groups).map(([name, fields]) => ({ name, fields: fields.sort((a, b) => (a.order || 0) - (b.order || 0)) }))
  }, [fields])

  const currentSection = sections[step]
  const isLastStep = step === sections.length - 1

  const handleNext = () => {
    if (step < sections.length - 1) setStep(step + 1)
    else onSubmit(formData)
  }

  const handleBack = () => {
    if (step > 0) setStep(step - 1)
  }

  const updateField = (id: string, value: any) => {
    setFormData(prev => ({ ...prev, [id]: value }))
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold text-white mb-2">{title}</h1>
        <p className="text-white/40">{subtitle}</p>
      </div>

      {/* Progress Stepper */}
      <div className="mb-12 flex items-center justify-between px-4 overflow-x-auto pb-4 scrollbar-hide">
        {sections.map((s, i) => (
          <div key={s.name} className="flex items-center">
            <div className={`flex flex-col items-center gap-2 min-w-[80px]`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                i === step ? 'bg-[#0763d8] text-white ring-4 ring-[#0763d8]/20' :
                i < step ? 'bg-emerald-500 text-white' : 'bg-white/5 text-white/20 border border-white/10'
              }`}>
                {i < step ? <Check className="w-4 h-4" /> : i + 1}
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-widest ${i === step ? 'text-[#0763d8]' : 'text-white/20'}`}>
                {s.name.split(' ')[0]}
              </span>
            </div>
            {i < sections.length - 1 && (
              <div className={`w-12 h-px mx-2 ${i < step ? 'bg-emerald-500/50' : 'bg-white/10'}`} />
            )}
          </div>
        ))}
      </div>

      {/* Form Content */}
      <div className="glass-card p-8 rounded-3xl border-white/10 shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="mb-8">
          <h2 className="text-xl font-bold text-white mb-1">{currentSection?.name}</h2>
          <p className="text-white/40 text-sm">Please provide the details below.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {currentSection?.fields.map(field => (
            <div key={field.id} className={`${field.type === 'textarea' || field.type === 'table' ? 'md:col-span-2' : ''} space-y-2`}>
              <label className="text-sm font-medium text-white/70 flex items-center gap-1.5">
                {field.label}
                {field.required && <span className="text-red-500">*</span>}
              </label>

              {field.type === 'textarea' ? (
                <textarea
                  value={formData[field.id] || ''}
                  onChange={e => updateField(field.id, e.target.value)}
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#0763d8] outline-none min-h-[120px] transition-all"
                  placeholder={`Enter ${field.label.toLowerCase()}...`}
                />
              ) : field.type === 'checkbox' ? (
                <label className="flex items-center gap-3 p-4 bg-white/[0.03] border border-white/10 rounded-xl cursor-pointer hover:bg-white/[0.05] transition-all">
                  <input
                    type="checkbox"
                    checked={!!formData[field.id]}
                    onChange={e => updateField(field.id, e.target.checked)}
                    className="w-5 h-5 rounded border-white/20 bg-transparent text-[#0763d8] focus:ring-0"
                  />
                  <span className="text-sm text-white/60">Yes, this applies</span>
                </label>
              ) : field.type === 'file' ? (
                <div className="relative group">
                  <input
                    type="file"
                    onChange={e => updateField(field.id, e.target.files?.[0]?.name)}
                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                  />
                  <div className="border-2 border-dashed border-white/10 rounded-xl p-6 flex flex-col items-center justify-center gap-2 group-hover:border-[#0763d8]/50 transition-all bg-white/[0.02]">
                    <Upload className="w-6 h-6 text-white/20 group-hover:text-[#0763d8] transition-colors" />
                    <span className="text-sm text-white/40">{formData[field.id] || 'Click to upload or drag and drop'}</span>
                  </div>
                </div>
              ) : field.type === 'table' ? (
                <div className="bg-white/[0.02] border border-white/10 rounded-xl p-4 overflow-x-auto">
                   <p className="text-xs text-white/30 italic mb-4">Table input is currently simplified in this view. Use the custom Excel-like inputs for high-fidelity tables.</p>
                   <Button variant="outline" className="w-full border-dashed border-white/10 text-white/40 h-20">
                     <Plus className="w-4 h-4 mr-2" /> Configure Data Table
                   </Button>
                </div>
              ) : field.type === 'select' ? (
                 <select
                  value={formData[field.id] || ''}
                  onChange={e => updateField(field.id, e.target.value)}
                  className="w-full bg-[#02030E] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-[#0763d8] outline-none appearance-none cursor-pointer"
                >
                  <option value="">Select option</option>
                  <option value="Option 1">Option 1</option>
                  <option value="Option 2">Option 2</option>
                </select>
              ) : (
                <Input
                  type={field.type === 'number' ? 'number' : field.type === 'date' ? 'date' : 'text'}
                  value={formData[field.id] || ''}
                  onChange={e => updateField(field.id, e.target.value)}
                  className="h-12 bg-white/[0.03] border-white/10 rounded-xl text-white placeholder:text-white/20"
                  placeholder={`Enter ${field.label.toLowerCase()}...`}
                />
              )}
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between mt-12 pt-8 border-t border-white/10">
          <Button
            variant="ghost"
            onClick={step === 0 ? onCancel : handleBack}
            className="text-white/60 hover:text-white hover:bg-white/5"
          >
            {step === 0 ? 'Cancel' : <><ChevronLeft className="w-4 h-4 mr-2" /> Back</>}
          </Button>
          <Button
            onClick={handleNext}
            disabled={isSubmitting}
            className={`h-12 px-8 rounded-xl font-bold transition-all ${
              isLastStep ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-[0_0_20px_rgba(16,185,129,0.3)]' : 'bg-[#0763d8] hover:bg-[#0655b3] text-white'
            }`}
          >
            {isSubmitting ? 'Processing...' : isLastStep ? 'Complete Registration' : <>{'Next Step'} <ChevronRight className="w-4 h-4 ml-2" /></>}
          </Button>
        </div>
      </div>
    </div>
  )
}
