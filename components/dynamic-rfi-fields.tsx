'use client'

import { RfiField } from '@/lib/admin-store'
import { Input } from '@/components/ui/input'

interface DynamicRfiFieldsProps {
  fields: RfiField[]
  values: Record<string, any>
  onChange: (id: string, value: any) => void
  section?: string
}

export function DynamicRfiFields({ fields, values, onChange, section }: DynamicRfiFieldsProps) {
  const filteredFields = section 
    ? fields.filter(f => f.section === section) 
    : fields

  if (filteredFields.length === 0) return null

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-4">
      {filteredFields.map(f => (
        <div key={f.id} className="space-y-1.5">
          <label className="text-xs font-bold text-white/60 uppercase tracking-widest">
            {f.label}
            {f.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          
          {f.type === 'textarea' ? (
            <textarea
              value={values[f.id] || ''}
              onChange={e => onChange(f.id, e.target.value)}
              className="w-full bg-white/[0.04] border border-white/[0.08] text-white rounded-xl px-4 py-3 text-sm focus:border-[#0763d8] outline-none transition-all min-h-[100px]"
              placeholder={`Enter ${f.label.toLowerCase()}...`}
            />
          ) : f.type === 'checkbox' ? (
            <label className="flex items-center gap-3 p-3 bg-white/[0.03] border border-white/[0.06] rounded-xl cursor-pointer hover:bg-white/[0.05] transition-colors">
              <input
                type="checkbox"
                checked={!!values[f.id]}
                onChange={e => onChange(f.id, e.target.checked)}
                className="w-4 h-4 accent-[#0763d8]"
              />
              <span className="text-sm text-white/70">{f.label}</span>
            </label>
          ) : f.type === 'select' ? (
            <select
              value={values[f.id] || ''}
              onChange={e => onChange(f.id, e.target.value)}
              className="w-full bg-[#02030E] border border-white/[0.1] text-white rounded-xl px-4 py-2.5 text-sm focus:border-[#0763d8] outline-none transition-all"
            >
              <option value="">Select option</option>
              {/* If we had options in RfiField we'd map them here */}
              <option value="Option 1">Option 1</option>
              <option value="Option 2">Option 2</option>
            </select>
          ) : (
            <Input
              type={f.type === 'number' ? 'number' : f.type === 'date' ? 'date' : 'text'}
              value={values[f.id] || ''}
              onChange={e => onChange(f.id, e.target.value)}
              className="bg-white/[0.04] border-white/[0.08] text-white rounded-xl h-11"
              placeholder={`Enter ${f.label.toLowerCase()}...`}
            />
          )}
        </div>
      ))}
    </div>
  )
}
