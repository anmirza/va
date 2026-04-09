'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import { getDisclaimerContent, saveDisclaimerContent } from '@/lib/admin-store'
import { Button } from '@/components/ui/button'
import { FileText, Save, Check, Building2, Film, Eye, Edit2 } from 'lucide-react'

type Tab = 'agency' | 'production'

export default function DisclaimerPage() {
  const { user } = useAuth()
  const [tab, setTab] = useState<Tab>('agency')
  const [agencyText, setAgencyText] = useState('')
  const [productionText, setProductionText] = useState('')
  const [saved, setSaved] = useState(false)
  const [preview, setPreview] = useState(false)
  const [lastUpdated, setLastUpdated] = useState('')

  useEffect(() => {
    const content = getDisclaimerContent()
    setAgencyText(content.agency)
    setProductionText(content.production)
    setLastUpdated(content.lastUpdatedAt)
  }, [])

  const currentText = tab === 'agency' ? agencyText : productionText
  const setter = tab === 'agency' ? setAgencyText : setProductionText

  const handleSave = () => {
    saveDisclaimerContent(tab, currentText, user?.id ?? 'admin')
    setSaved(true)
    setLastUpdated(new Date().toISOString())
    setTimeout(() => setSaved(false), 2500)
  }

  const charCount = currentText.length
  const paraCount = currentText.split('\n\n').filter(Boolean).length

  return (
    <div className="max-w-3xl">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-1">Disclaimer Editor</h1>
        <p className="text-white/40 text-sm">
          Edit the legal disclaimer shown to users before they start agency or production company registration.
          Changes are saved instantly and shown on the next page visit.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white/[0.04] border border-white/[0.08] rounded-xl p-1 mb-5 w-fit">
        {([
          { id: 'agency', label: 'Agency', icon: Building2 },
          { id: 'production', label: 'Production', icon: Film },
        ] as const).map(t => {
          const Icon = t.icon
          return (
            <button
              key={t.id}
              onClick={() => { setTab(t.id); setPreview(false) }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                tab === t.id ? 'bg-[#0763d8] text-white' : 'text-white/50 hover:text-white'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {t.label}
            </button>
          )
        })}
      </div>

      <div className="glass-card rounded-2xl overflow-hidden">
        {/* Toolbar */}
        <div className="flex items-center gap-3 px-5 py-3 border-b border-white/[0.06] bg-white/[0.02]">
          <FileText className="w-4 h-4 text-[#0763d8]" />
          <span className="text-sm font-medium text-white/70 flex-1">
            {tab === 'agency' ? 'Agency Registration Disclaimer' : 'Production Company Registration Disclaimer'}
          </span>
          <span className="text-xs text-white/30">{charCount} chars · {paraCount} paragraphs</span>
          <button
            onClick={() => setPreview(!preview)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              preview ? 'bg-[#0763d8]/20 text-[#0763d8]' : 'text-white/40 hover:text-white'
            }`}
          >
            {preview ? <Edit2 className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
            {preview ? 'Edit' : 'Preview'}
          </button>
        </div>

        {/* Editor / Preview */}
        <div className="p-5">
          {preview ? (
            <div className="space-y-4 min-h-[300px]">
              {currentText.split('\n\n').filter(Boolean).map((para, i) => (
                <p
                  key={i}
                  className={`text-sm text-white/70 leading-relaxed ${i === 0 ? 'font-semibold text-white/90' : ''}`}
                >
                  {para}
                </p>
              ))}
            </div>
          ) : (
            <textarea
              value={currentText}
              onChange={e => setter(e.target.value)}
              rows={16}
              className="w-full bg-transparent text-sm text-white/80 leading-relaxed placeholder:text-white/20 focus:outline-none resize-none font-mono"
              placeholder="Enter disclaimer text here. Use double line breaks to create paragraphs."
            />
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center gap-4 px-5 py-4 border-t border-white/[0.06] bg-white/[0.02]">
          {lastUpdated && (
            <p className="text-xs text-white/30 flex-1">
              Last saved: {new Date(lastUpdated).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </p>
          )}
          <Button
            onClick={handleSave}
            className={`h-9 px-5 rounded-xl gap-2 text-sm ${saved ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-[#0763d8] hover:bg-[#0655b3]'} text-white`}
          >
            {saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            {saved ? 'Saved!' : 'Save Changes'}
          </Button>
        </div>
      </div>

      <div className="mt-4 p-4 bg-white/[0.02] border border-white/[0.06] rounded-xl">
        <p className="text-xs text-white/40 leading-relaxed">
          <strong className="text-white/60">Formatting tip:</strong> Use double line breaks (press Enter twice) to separate paragraphs. The first paragraph will appear as the headline/title on the disclaimer page.
          Changes are saved to localStorage and shown immediately on the next page load.
        </p>
      </div>
    </div>
  )
}
