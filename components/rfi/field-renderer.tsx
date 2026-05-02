/**
 * field-renderer.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Renders a single scalar RfiField. Used by AgencyRfiForm / ProductionRfiForm
 * to display admin-added custom fields, and by the dynamic forms used for
 * non-built-in categories.
 */

'use client'

import type { RfiField } from '@/lib/admin-store'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

const inputCls =
  'bg-white/[0.04] border-white/10 text-white rounded-xl h-11 focus:border-[#0763d8]/40'
const selectCls =
  'flex h-11 w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white focus:outline-none focus:border-[#0763d8]/40'
const textareaCls =
  'bg-white/[0.04] border-white/10 text-white rounded-xl min-h-[100px] focus:border-[#0763d8]/40'

interface FieldRendererProps {
  field: RfiField
  value: unknown
  onChange: (value: unknown) => void
}

export function FieldRenderer({ field, value, onChange }: FieldRendererProps) {
  const v = value ?? field.defaultValue ?? ''

  return (
    <div>
      <label className="block text-xs font-medium text-white/60 mb-1.5">
        {field.label}
        {field.required && <span className="text-red-400 ml-0.5">*</span>}
      </label>

      {(() => {
        switch (field.type) {
          case 'textarea':
            return (
              <Textarea
                value={String(v)}
                onChange={(e) => onChange(e.target.value)}
                placeholder={field.placeholder}
                className={textareaCls}
              />
            )
          case 'select':
            return (
              <select
                value={String(v)}
                onChange={(e) => onChange(e.target.value)}
                className={selectCls}
              >
                <option value="">{field.placeholder ?? 'Select…'}</option>
                {(field.options ?? []).map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            )
          case 'checkbox':
            return (
              <label className="flex items-center gap-2 h-11 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={Boolean(v)}
                  onChange={(e) => onChange(e.target.checked)}
                  className="w-4 h-4 accent-[#0763d8] cursor-pointer"
                />
                <span className="text-sm text-white/70">{field.placeholder ?? 'Yes'}</span>
              </label>
            )
          case 'number':
            return (
              <Input
                type="number"
                value={String(v)}
                onChange={(e) => onChange(e.target.value)}
                placeholder={field.placeholder}
                className={inputCls}
              />
            )
          case 'date':
            return (
              <Input
                type="date"
                value={String(v)}
                onChange={(e) => onChange(e.target.value)}
                className={inputCls}
              />
            )
          case 'email':
            return (
              <Input
                type="email"
                value={String(v)}
                onChange={(e) => onChange(e.target.value)}
                placeholder={field.placeholder}
                className={inputCls}
              />
            )
          case 'url':
            return (
              <Input
                type="url"
                value={String(v)}
                onChange={(e) => onChange(e.target.value)}
                placeholder={field.placeholder ?? 'https://'}
                className={inputCls}
              />
            )
          case 'tel':
            return (
              <Input
                type="tel"
                value={String(v)}
                onChange={(e) => onChange(e.target.value)}
                placeholder={field.placeholder}
                className={inputCls}
              />
            )
          case 'file':
            return (
              <Input
                type="file"
                onChange={(e) => onChange(e.target.files?.[0]?.name ?? '')}
                className={inputCls}
              />
            )
          case 'table':
            return (
              <div className="rounded-xl border border-dashed border-white/10 bg-white/[0.02] p-4 text-xs text-white/40">
                Table fields are not supported for custom inputs yet.
              </div>
            )
          default:
            return (
              <Input
                value={String(v)}
                onChange={(e) => onChange(e.target.value)}
                placeholder={field.placeholder}
                className={inputCls}
              />
            )
        }
      })()}

      {field.helpText && (
        <p className="text-[11px] text-white/30 mt-1.5">{field.helpText}</p>
      )}
    </div>
  )
}

/**
 * Renders all admin-added custom fields belonging to a step, grouped by
 * sub-section if any. Drop this component at the bottom of each step's JSX.
 */
interface CustomFieldsSectionProps {
  fields: RfiField[]
  values: Record<string, unknown>
  onChange: (id: string, value: unknown) => void
  /** Optional title shown above the section. Defaults to "Additional Fields" when not provided. */
  title?: string
}

export function CustomFieldsSection({ fields, values, onChange, title }: CustomFieldsSectionProps) {
  if (fields.length === 0) return null
  return (
    <div className="mt-8 pt-8 border-t border-dashed border-white/[0.08]">
      <h3 className="text-sm font-semibold text-white/80 mb-4 flex items-center gap-2">
        <span className="w-1 h-4 bg-purple-500 rounded-full" />
        {title ?? 'Additional Fields'}
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {fields.map((f) => (
          <FieldRenderer
            key={f.id}
            field={f}
            value={values[f.id]}
            onChange={(val) => onChange(f.id, val)}
          />
        ))}
      </div>
    </div>
  )
}
