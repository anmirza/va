'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import { getDisclaimerContentFS, saveDisclaimerContentFS, getDisclaimerVersionsFS, type DisclaimerVersion } from '@/lib/admin-firestore'
import { Button } from '@/components/ui/button'
import { FileText, Save, Check, Building2, Film, Eye, Edit2, Bold, Italic, List, Link as LinkIcon, Heading, Info, History, ChevronDown, ChevronUp, RotateCcw } from 'lucide-react'

type Tab = 'agency' | 'production'

export default function DisclaimerPage() {
  const { user } = useAuth()
  const [tab, setTab] = useState<Tab>('agency')
  const [agencyText, setAgencyText] = useState('')
  const [productionText, setProductionText] = useState('')
  const [saved, setSaved] = useState(false)
  const [preview, setPreview] = useState(false)
  const [lastUpdated, setLastUpdated] = useState('')
  const [versions, setVersions] = useState<DisclaimerVersion[]>([])
  const [showHistory, setShowHistory] = useState(false)
  const [loadingHistory, setLoadingHistory] = useState(false)

  useEffect(() => {
    getDisclaimerContentFS().then(content => {
      setAgencyText(content.agency)
      setProductionText(content.production)
      setLastUpdated(content.lastUpdatedAt)
    })
  }, [])

  const currentText = tab === 'agency' ? agencyText : productionText
  const setter = tab === 'agency' ? setAgencyText : setProductionText

  const handleSave = async () => {
    await saveDisclaimerContentFS(tab, currentText, user?.id ?? 'admin')
    setSaved(true)
    setLastUpdated(new Date().toISOString())
    // Refresh history if open
    if (showHistory) {
      const vers = await getDisclaimerVersionsFS(tab)
      setVersions(vers)
    }
    setTimeout(() => setSaved(false), 2500)
  }

  const handleToggleHistory = async () => {
    if (!showHistory) {
      setLoadingHistory(true)
      const vers = await getDisclaimerVersionsFS(tab)
      setVersions(vers)
      setLoadingHistory(false)
    }
    setShowHistory(v => !v)
  }

  const handleRestore = (content: string) => {
    setter(content)
    setShowHistory(false)
  }

  const charCount = currentText.length
  const paraCount = currentText.split('\n\n').filter(Boolean).length

  return (
    <div className="max-w-3xl">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-1">Disclaimer Editor</h1>
        <p className="text-white/40 text-sm mb-3">
          Manage the legal disclaimer text shown to agencies and production companies during the registration process — before they submit their RFI profile for review.
        </p>
        <div className="flex flex-wrap gap-3 text-xs">
          <div className="flex items-center gap-2 px-3 py-2 bg-[#0763d8]/5 border border-[#0763d8]/15 rounded-lg">
            <Building2 className="w-3.5 h-3.5 text-[#0763d8]" />
            <span className="text-white/60"><strong className="text-white/80">Agency disclaimer</strong> — shown on <code className="text-[#0763d8]/80">/signup/agency</code> registration form</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 bg-[#7c3aed]/5 border border-[#7c3aed]/15 rounded-lg">
            <Film className="w-3.5 h-3.5 text-[#7c3aed]" />
            <span className="text-white/60"><strong className="text-white/80">Production disclaimer</strong> — shown on <code className="text-[#7c3aed]/80">/signup/production</code> registration form</span>
          </div>
        </div>
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
              onClick={() => { setTab(t.id); setPreview(false); setShowHistory(false); setVersions([]) }}
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
        <div className="flex flex-wrap items-center gap-2 px-5 py-3 border-b border-white/[0.06] bg-white/[0.02]">
          <FileText className="w-4 h-4 text-[#0763d8] mr-2" />
          <span className="text-sm font-medium text-white/70 flex-1 min-w-[200px]">
            {tab === 'agency' ? 'Agency Registration Disclaimer' : 'Production Company Registration Disclaimer'}
          </span>
          <div className="hidden sm:flex items-center gap-1 border-r border-white/10 pr-2 mr-2">
            <button className="p-1.5 text-white/40 hover:text-white hover:bg-white/5 rounded transition-colors" title="Bold"><Bold className="w-4 h-4" /></button>
            <button className="p-1.5 text-white/40 hover:text-white hover:bg-white/5 rounded transition-colors" title="Italic"><Italic className="w-4 h-4" /></button>
            <button className="p-1.5 text-white/40 hover:text-white hover:bg-white/5 rounded transition-colors" title="Heading"><Heading className="w-4 h-4" /></button>
            <button className="p-1.5 text-white/40 hover:text-white hover:bg-white/5 rounded transition-colors" title="Bullet List"><List className="w-4 h-4" /></button>
            <button className="p-1.5 text-white/40 hover:text-white hover:bg-white/5 rounded transition-colors" title="Insert Link"><LinkIcon className="w-4 h-4" /></button>
          </div>
          <span className="text-xs text-white/30 mr-2 hidden md:inline">{charCount} chars · {paraCount} paragraphs</span>
          <button
            onClick={() => setPreview(!preview)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              preview ? 'bg-[#0763d8]/20 text-[#0763d8]' : 'bg-white/5 text-white/40 hover:text-white hover:bg-white/10'
            }`}
          >
            {preview ? <Edit2 className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
            {preview ? 'Edit' : 'Preview Live'}
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

      {/* Version History */}
      <div className="mt-4 border border-white/[0.06] rounded-xl overflow-hidden">
        <button
          onClick={handleToggleHistory}
          className="w-full flex items-center gap-2 px-5 py-3 bg-white/[0.02] hover:bg-white/[0.04] transition-colors text-left"
        >
          <History className="w-4 h-4 text-white/40" />
          <span className="text-sm font-medium text-white/60 flex-1">Version History</span>
          <span className="text-xs text-white/30 mr-2">Last 5 saves</span>
          {showHistory ? <ChevronUp className="w-4 h-4 text-white/30" /> : <ChevronDown className="w-4 h-4 text-white/30" />}
        </button>
        {showHistory && (
          <div className="border-t border-white/[0.06]">
            {loadingHistory ? (
              <p className="text-xs text-white/30 px-5 py-4">Loading history...</p>
            ) : versions.length === 0 ? (
              <p className="text-xs text-white/30 px-5 py-4">No saved versions yet for this disclaimer type.</p>
            ) : (
              <div className="divide-y divide-white/[0.04]">
                {versions.map((v, i) => (
                  <div key={v.id} className="flex items-start gap-4 px-5 py-3 hover:bg-white/[0.02] transition-colors">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-medium text-white/60">
                          {new Date(v.savedAt).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </span>
                        {i === 0 && (
                          <span className="text-[10px] px-1.5 py-0.5 bg-emerald-500/10 text-emerald-400 rounded border border-emerald-500/20">Latest</span>
                        )}
                      </div>
                      <p className="text-xs text-white/30 truncate">{v.content.substring(0, 120)}...</p>
                    </div>
                    <button
                      onClick={() => handleRestore(v.content)}
                      className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 text-xs text-white/50 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] rounded-lg transition-colors"
                    >
                      <RotateCcw className="w-3 h-3" /> Restore
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
