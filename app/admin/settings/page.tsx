'use client'

import { useState, useEffect } from 'react'
import { getVACategoriesFS, saveVACategoryFS, deleteVACategoryFS, getRfiFieldsFS, saveRfiFieldsFS, getRfiStepLabelsFS, saveRfiStepLabelsFS } from '@/lib/admin-firestore'
import type { VACategory, RfiField, RfiStep } from '@/lib/admin-store'
import { ensureFirestoreSeedFS } from '@/lib/firestore-seed'
import { toast } from 'sonner'
import { Plus, Save, Settings2, Trash2, FileText, GripVertical, Check, AlertCircle } from 'lucide-react'

const FIELD_TYPES = ['text', 'textarea', 'file', 'select', 'number', 'date', 'checkbox', 'table']

export default function SettingsPage() {
  const [categories, setCategories] = useState<VACategory[]>([])
  const [rfiFields, setRfiFields] = useState<RfiField[]>([])
  const [rfiSaved, setRfiSaved] = useState(false)
  const [activeRfiCategoryId, setActiveRfiCategoryId] = useState('cat-agency')
  const [catDeleteConfirm, setCatDeleteConfirm] = useState<string | null>(null)
  const [stepLabels, setStepLabels] = useState<RfiStep[]>([])
  const [stepLabelsSaved, setStepLabelsSaved] = useState(false)

  const isBuiltIn = activeRfiCategoryId === 'cat-agency' || activeRfiCategoryId === 'cat-production'

  useEffect(() => {
    ensureFirestoreSeedFS().catch(console.error)
    getVACategoriesFS().then(setCategories)
  }, [])

  useEffect(() => {
    if (isBuiltIn) {
      getRfiStepLabelsFS(activeRfiCategoryId).then(labels => {
        if (labels && labels.length > 0) setStepLabels(labels)
      })
      // Also load fields for built-ins so admin can edit them per step
      getRfiFieldsFS(activeRfiCategoryId).then(remote => {
        if (Array.isArray(remote) && remote.length > 0) setRfiFields(remote)
        else setRfiFields([])
      })
    } else {
      getRfiFieldsFS(activeRfiCategoryId).then(setRfiFields)
    }
  }, [activeRfiCategoryId, isBuiltIn])

  // ── Categories ──────────────────────────────────────────────────────────────

  const handleAddCategory = async () => {
    const newCat = {
      id: `cat-${Date.now()}`,
      name: 'New Category',
      iconSvg: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-square"><rect width="18" height="18" x="3" y="3" rx="2"/></svg>'
    }
    await saveVACategoryFS(newCat)
    setCategories(prev => [...prev, newCat])
  }

  const updateCategory = (id: string, field: keyof VACategory, value: string) => {
    const updated = categories.map(c => c.id === id ? { ...c, [field]: value } : c)
    setCategories(updated)
  }
  
  const saveCategory = async (id: string) => {
    const cat = categories.find(c => c.id === id)
    if (cat) {
      await saveVACategoryFS(cat)
      toast.success('Category saved')
    }
  }

  const handleDeleteCategory = async (id: string) => {
    if (catDeleteConfirm === id) {
      await deleteVACategoryFS(id)
      setCategories(prev => prev.filter(c => c.id !== id))
      setCatDeleteConfirm(null)
    } else {
      setCatDeleteConfirm(id)
      setTimeout(() => setCatDeleteConfirm(null), 3000)
    }
  }

  // ── RFI Modeler ─────────────────────────────────────────────────────────────

  const handleAddRfiField = () => {
    const newField: RfiField = {
      id: `rfi-${Date.now()}`,
      label: '',
      type: 'text',
      required: false,
      section: 'General',
      visible: true,
      order: rfiFields.length + 1
    }
    setRfiFields(prev => [...prev, newField])
  }

  const updateRfiField = (id: string, field: keyof RfiField, value: string | boolean) => {
    setRfiFields(prev => prev.map(f => f.id === id ? { ...f, [field]: value } : f))
  }

  const removeRfiField = (id: string) => {
    setRfiFields(prev => prev.filter(f => f.id !== id))
  }

  const handleSaveRfi = async () => {
    if (!activeRfiCategoryId) return
    await saveRfiFieldsFS(activeRfiCategoryId, rfiFields)
    setRfiSaved(true)
    setTimeout(() => setRfiSaved(false), 2500)
  }

  const handleSaveStepLabels = async () => {
    await saveRfiStepLabelsFS(activeRfiCategoryId, stepLabels)
    setStepLabelsSaved(true)
    setTimeout(() => setStepLabelsSaved(false), 2500)
    toast.success('Step labels saved')
  }

  const updateStepLabel = (idx: number, field: 'label' | 'shortLabel' | 'subtitle' | 'icon', value: string) => {
    setStepLabels(prev => prev.map((s, i) => i === idx ? { ...s, [field]: value } : s))
  }

  const updateSubSection = (stepIdx: number, secIdx: number, value: string) => {
    setStepLabels(prev => prev.map((s, i) => {
      if (i !== stepIdx) return s
      const subs = [...(s.subSections ?? [])]
      subs[secIdx] = { ...subs[secIdx], label: value }
      return { ...s, subSections: subs }
    }))
  }

  const addSubSection = (stepIdx: number) => {
    setStepLabels(prev => prev.map((s, i) => {
      if (i !== stepIdx) return s
      const subs = [...(s.subSections ?? []), { key: `sub-${Date.now()}`, label: 'New Sub-section' }]
      return { ...s, subSections: subs }
    }))
  }

  const removeSubSection = (stepIdx: number, secIdx: number) => {
    setStepLabels(prev => prev.map((s, i) => {
      if (i !== stepIdx) return s
      const subs = (s.subSections ?? []).filter((_, j) => j !== secIdx)
      return { ...s, subSections: subs }
    }))
  }

  const moveRfiField = (idx: number, dir: -1 | 1) => {
    const newIdx = idx + dir
    if (newIdx < 0 || newIdx >= rfiFields.length) return
    const updated = [...rfiFields]
    const temp = updated[idx]
    updated[idx] = updated[newIdx]
    updated[newIdx] = temp
    setRfiFields(updated)
  }

  // ── Built-in: add a field that targets a specific step (and optionally sub-section) ──
  const addFieldToStep = (stepKey: string, subSectionKey?: string) => {
    const newField: RfiField = {
      id: `field-${Date.now()}`,
      label: 'New Field',
      type: 'text',
      required: false,
      visible: true,
      stepKey,
      subSectionKey,
      order: 1000 + rfiFields.filter(f => f.stepKey === stepKey).length,
      isSystem: false,
    }
    setRfiFields(prev => [...prev, newField])
  }

  const updateFieldProp = <K extends keyof RfiField>(id: string, key: K, value: RfiField[K]) => {
    setRfiFields(prev => prev.map(f => f.id === id ? { ...f, [key]: value } : f))
  }

  const deleteCustomField = (id: string) => {
    const f = rfiFields.find(x => x.id === id)
    if (f?.isSystem) return // never delete system fields
    if (!confirm(`Delete field "${f?.label}"? Existing data for this field will remain in records but will no longer be editable.`)) return
    setRfiFields(prev => prev.filter(x => x.id !== id))
  }

  const moveFieldWithinStep = (id: string, dir: -1 | 1) => {
    const f = rfiFields.find(x => x.id === id)
    if (!f?.stepKey) return
    const stepFields = rfiFields
      .filter(x => x.stepKey === f.stepKey)
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    const idx = stepFields.findIndex(x => x.id === id)
    const newIdx = idx + dir
    if (newIdx < 0 || newIdx >= stepFields.length) return
    const a = stepFields[idx]
    const b = stepFields[newIdx]
    setRfiFields(prev => prev.map(x => {
      if (x.id === a.id) return { ...x, order: b.order ?? 0 }
      if (x.id === b.id) return { ...x, order: a.order ?? 0 }
      return x
    }))
  }

  return (
    <div className="max-w-5xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white mb-2">Platform Settings</h1>
        <p className="text-white/50 text-sm">Super Admin Only: Manage dynamic categories, RFI template, and platform configuration.</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Categories Section */}
        <div className="glass-card rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-white/[0.06] flex items-center justify-between">
            <h2 className="font-semibold text-white flex items-center gap-2">
              <Settings2 className="w-4 h-4 text-[#0763d8]" /> Categories Catalog
            </h2>
            <button onClick={handleAddCategory} className="text-sm border border-white/20 hover:bg-white/5 text-white px-3 py-1.5 rounded-lg flex items-center gap-2 transition-colors">
              <Plus className="w-3.5 h-3.5" /> Add Category
            </button>
          </div>
          
          <div className="p-6 space-y-4">
             {categories.map((cat) => (
                <div key={cat.id} className="flex gap-4 items-start bg-white/[0.02] border border-white/[0.06] p-4 rounded-xl">
                    <div 
                      className="w-12 h-12 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center shrink-0 [&>svg]:w-6 [&>svg]:h-6 [&>svg]:text-white/70"
                      dangerouslySetInnerHTML={{ __html: typeof cat.iconSvg === 'string' ? cat.iconSvg : '' }}
                    />
                    <div className="flex-1 space-y-3">
                       <div>
                         <label className="text-[10px] uppercase font-bold tracking-wider text-white/40 mb-1 block">Category Name</label>
                         <input 
                           type="text" 
                           value={cat.name} 
                           onChange={(e) => updateCategory(cat.id, 'name', e.target.value)}
                           className="bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white w-full text-sm" 
                         />
                       </div>
                       <div>
                         <label className="text-[10px] uppercase font-bold tracking-wider text-white/40 mb-1 block">Lucide SVG Icon</label>
                         <textarea 
                           rows={3}
                           value={cat.iconSvg}
                           onChange={(e) => updateCategory(cat.id, 'iconSvg', e.target.value)}
                           className="bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white/60 w-full text-xs font-mono" 
                         />
                       </div>
                    </div>
                    <div className="flex flex-col gap-2 shrink-0">
                       <button onClick={() => saveCategory(cat.id)} className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 p-2 rounded-lg transition-colors" title="Save">
                          <Save className="w-4 h-4" />
                       </button>
                       <button
                         onClick={() => handleDeleteCategory(cat.id)}
                         className={`p-2 rounded-lg transition-colors ${catDeleteConfirm === cat.id ? 'bg-red-500/20 text-red-400' : 'hover:bg-red-500/10 text-white/30 hover:text-red-400'}`}
                         title={catDeleteConfirm === cat.id ? 'Click again to confirm' : 'Delete category'}
                       >
                          {catDeleteConfirm === cat.id ? <AlertCircle className="w-4 h-4" /> : <Trash2 className="w-4 h-4" />}
                       </button>
                    </div>
                </div>
             ))}
             {categories.length === 0 && (
               <p className="text-center text-white/30 text-sm py-6">No categories configured. Add one to get started.</p>
             )}
          </div>
        </div>

        {/* Dynamic RFI Modeler — FUNCTIONAL */}
        <div className="glass-card rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-white/[0.06] flex items-center justify-between">
            <h2 className="font-semibold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-purple-500" /> RFI Structure Modeler
            </h2>
            <div className="flex items-center gap-2">
              {!isBuiltIn && (
                <>
                  <span className="text-xs text-white/30">{rfiFields.length} fields</span>
                  <button
                    onClick={async () => {
                      if (confirm('Reset this RFI to empty? All custom changes will be lost.')) {
                        await saveRfiFieldsFS(activeRfiCategoryId, [])
                        setRfiFields([])
                      }
                    }}
                    className="text-xs text-white/40 hover:text-white/60 px-3 py-1.5 border border-white/10 rounded-lg mr-2"
                  >
                    Clear All Fields
                  </button>
                  <button
                    onClick={handleSaveRfi}
                    className={`text-sm px-4 py-1.5 rounded-lg flex items-center gap-2 font-medium transition-all ${
                      rfiSaved
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-purple-500/10 text-purple-400 border border-purple-500/20 hover:bg-purple-500/20'
                    }`}
                  >
                    {rfiSaved ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
                    {rfiSaved ? 'Saved!' : 'Save RFI'}
                  </button>
                </>
              )}
            </div>
          </div>
          <div className="p-6">
            <p className="text-sm text-white/50 mb-4">
              {isBuiltIn
                ? 'Edit the step labels displayed in the RFI multi-step form for this category.'
                : 'Define the specific RFI fields requested from organizations based on their category.'}
            </p>
            
            {/* Category Selector for RFI */}
            <div className="flex gap-2 overflow-x-auto pb-4 mb-2 scrollbar-hide">
              {/* Built-in tabs */}
              {[{ id: 'cat-agency', name: 'Agency (built-in)' }, { id: 'cat-production', name: 'Production (built-in)' }].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveRfiCategoryId(cat.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                    activeRfiCategoryId === cat.id
                      ? 'bg-[#0763d8] border-[#0763d8] text-white'
                      : 'bg-white/5 border-white/10 text-white/40 hover:bg-white/10'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
              {/* Custom categories */}
              {categories.filter(c => c.id !== 'cat-agency' && c.id !== 'cat-production').map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveRfiCategoryId(cat.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                    activeRfiCategoryId === cat.id
                      ? 'bg-[#0763d8] border-[#0763d8] text-white'
                      : 'bg-white/5 border-white/10 text-white/40 hover:bg-white/10'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {/* ── Step Label Editor (for built-in categories) ── */}
            {isBuiltIn ? (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <p className="text-xs font-bold text-white/50 uppercase tracking-widest">
                    {activeRfiCategoryId === 'cat-agency' ? '8 Steps' : '13 Steps'} — Edit Labels
                  </p>
                  <button
                    onClick={handleSaveStepLabels}
                    className={`text-sm px-4 py-1.5 rounded-lg flex items-center gap-2 font-medium transition-all ${
                      stepLabelsSaved
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-[#0763d8]/10 text-[#0763d8] border border-[#0763d8]/20 hover:bg-[#0763d8]/20'
                    }`}
                  >
                    {stepLabelsSaved ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
                    {stepLabelsSaved ? 'Saved!' : 'Save Labels'}
                  </button>
                </div>
                <div className="space-y-3">
                  {stepLabels.map((step, idx) => (
                    <details key={step.key} className="group/step bg-white/[0.02] border border-white/[0.06] rounded-xl overflow-hidden">
                      <summary className="flex items-center gap-4 p-3 cursor-pointer list-none hover:bg-white/[0.03] transition-colors">
                        <span className="w-6 h-6 rounded-full bg-[#0763d8]/20 text-[#0763d8] text-xs font-bold flex items-center justify-center shrink-0">{idx + 1}</span>
                        <span className="text-xs text-white/30 w-32 shrink-0 font-mono hidden sm:block">{step.key}</span>
                        <span className="flex-1 text-sm text-white font-medium truncate">{step.label || <span className="text-white/20 italic">Untitled</span>}</span>
                        <span className="text-[10px] text-white/20 group-open/step:hidden">▼ expand</span>
                        <span className="text-[10px] text-white/20 hidden group-open/step:inline">▲ collapse</span>
                      </summary>

                      <div className="px-4 pb-4 pt-2 border-t border-white/[0.04] space-y-4">
                        {/* Row 1: label + shortLabel + icon */}
                        <div className="grid grid-cols-1 sm:grid-cols-[1fr_160px_80px] gap-3">
                          <div>
                            <label className="text-[10px] text-white/30 uppercase tracking-wider mb-1 block">Full Label</label>
                            <input
                              value={step.label}
                              onChange={e => updateStepLabel(idx, 'label', e.target.value)}
                              className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-1.5 text-white text-sm focus:border-[#0763d8]/40 outline-none"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] text-white/30 uppercase tracking-wider mb-1 block">Short Label</label>
                            <input
                              value={step.shortLabel}
                              onChange={e => updateStepLabel(idx, 'shortLabel', e.target.value)}
                              className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-1.5 text-white text-sm focus:border-[#0763d8]/40 outline-none"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] text-white/30 uppercase tracking-wider mb-1 block">Icon (emoji)</label>
                            <input
                              value={step.icon ?? ''}
                              onChange={e => updateStepLabel(idx, 'icon', e.target.value)}
                              placeholder="🏢"
                              className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-1.5 text-white text-center text-lg focus:border-[#0763d8]/40 outline-none"
                            />
                          </div>
                        </div>

                        {/* Row 2: subtitle */}
                        <div>
                          <label className="text-[10px] text-white/30 uppercase tracking-wider mb-1 block">Subtitle (shown below step title)</label>
                          <input
                            value={step.subtitle ?? ''}
                            onChange={e => updateStepLabel(idx, 'subtitle', e.target.value)}
                            placeholder="e.g. Legal identity, Organisation & Structure"
                            className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-1.5 text-white/70 text-sm focus:border-[#0763d8]/40 outline-none"
                          />
                        </div>

                        {/* Row 3: sub-sections */}
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <label className="text-[10px] text-white/30 uppercase tracking-wider">Sub-section Headings</label>
                            <button
                              onClick={() => addSubSection(idx)}
                              className="text-[10px] text-[#0763d8] hover:text-[#0655b3] flex items-center gap-1 border border-[#0763d8]/20 px-2 py-0.5 rounded-md"
                            >
                              <Plus className="w-3 h-3" /> Add
                            </button>
                          </div>
                          {(step.subSections ?? []).length === 0 && (
                            <p className="text-xs text-white/20 italic">No sub-sections. Click Add to create one.</p>
                          )}
                          <div className="space-y-1.5">
                            {(step.subSections ?? []).map((sec, secIdx) => (
                              <div key={sec.key} className="flex items-center gap-2">
                                <span className="text-[10px] font-mono text-white/20 w-16 shrink-0 truncate">{sec.key}</span>
                                <input
                                  value={sec.label}
                                  onChange={e => updateSubSection(idx, secIdx, e.target.value)}
                                  className="flex-1 bg-black/20 border border-white/10 rounded-lg px-3 py-1 text-white/70 text-xs focus:border-[#0763d8]/40 outline-none"
                                />
                                <button
                                  onClick={() => removeSubSection(idx, secIdx)}
                                  className="p-1 text-white/20 hover:text-red-400 hover:bg-red-400/10 rounded transition-colors"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </details>
                  ))}
                  {stepLabels.length === 0 && (
                    <div className="text-center py-8 text-white/30 text-sm">
                      <p>No step labels loaded. Labels will be seeded automatically.</p>
                    </div>
                  )}
                </div>

                {/* ── Fields per step ── */}
                <div className="mt-10 border-t border-white/[0.06] pt-8">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-xs font-bold text-white/50 uppercase tracking-widest">Fields Per Step</p>
                      <p className="text-[11px] text-white/30 mt-0.5">Add, edit, hide, or delete the fields shown to users inside each step. System fields (🔒) cannot be deleted but can be hidden or relabelled.</p>
                    </div>
                    <button
                      onClick={handleSaveRfi}
                      className={`text-sm px-4 py-1.5 rounded-lg flex items-center gap-2 font-medium transition-all ${
                        rfiSaved
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-purple-500/10 text-purple-400 border border-purple-500/20 hover:bg-purple-500/20'
                      }`}
                    >
                      {rfiSaved ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
                      {rfiSaved ? 'Saved!' : 'Save Fields'}
                    </button>
                  </div>

                  <div className="space-y-3">
                    {stepLabels.map((step) => {
                      const stepFields = rfiFields
                        .filter(f => f.stepKey === step.key)
                        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
                      return (
                        <details key={step.key} className="group/fstep bg-white/[0.02] border border-white/[0.06] rounded-xl overflow-hidden">
                          <summary className="flex items-center gap-3 p-3 cursor-pointer list-none hover:bg-white/[0.03] transition-colors">
                            <span className="text-xs text-white/40 w-32 shrink-0 font-mono hidden sm:block">{step.key}</span>
                            <span className="flex-1 text-sm text-white font-medium truncate">{step.label}</span>
                            <span className="text-[10px] text-white/30">{stepFields.length} field{stepFields.length !== 1 ? 's' : ''}</span>
                            <span className="text-[10px] text-white/20 group-open/fstep:hidden">▼</span>
                            <span className="text-[10px] text-white/20 hidden group-open/fstep:inline">▲</span>
                          </summary>

                          <div className="px-4 pb-4 pt-2 border-t border-white/[0.04] space-y-2">
                            {stepFields.length === 0 && (
                              <p className="text-xs text-white/30 italic py-2">No fields configured for this step yet.</p>
                            )}
                            {stepFields.map((f) => (
                              <div key={f.id} className="flex flex-wrap items-start gap-2 bg-white/[0.02] border border-white/[0.05] rounded-lg p-2.5">
                                {/* Reorder */}
                                <div className="flex flex-col shrink-0">
                                  <button onClick={() => moveFieldWithinStep(f.id, -1)} className="text-white/30 hover:text-white text-xs leading-none">▲</button>
                                  <button onClick={() => moveFieldWithinStep(f.id, 1)} className="text-white/30 hover:text-white text-xs leading-none">▼</button>
                                </div>

                                {/* Lock indicator */}
                                <div className="shrink-0 pt-1.5 w-5 text-center" title={f.isSystem ? 'System field — cannot be deleted' : 'Custom field'}>
                                  {f.isSystem
                                    ? <span className="text-amber-400/60 text-xs">🔒</span>
                                    : <span className="text-purple-400/60 text-xs">●</span>}
                                </div>

                                {/* Label */}
                                <div className="flex-1 min-w-[180px]">
                                  <label className="text-[9px] uppercase tracking-wider text-white/30 block">Label</label>
                                  <input
                                    value={f.label}
                                    onChange={e => updateFieldProp(f.id, 'label', e.target.value)}
                                    className="w-full bg-black/20 border border-white/10 rounded-md px-2 py-1 text-white text-xs"
                                  />
                                </div>

                                {/* Type — read-only for system fields */}
                                <div className="w-[120px] shrink-0">
                                  <label className="text-[9px] uppercase tracking-wider text-white/30 block">Type</label>
                                  <select
                                    value={f.type}
                                    onChange={e => updateFieldProp(f.id, 'type', e.target.value as RfiField['type'])}
                                    disabled={f.isSystem}
                                    className="w-full bg-[#02030E] border border-white/10 rounded-md px-2 py-1 text-white text-xs disabled:opacity-50"
                                  >
                                    {FIELD_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                                  </select>
                                </div>

                                {/* Sub-section */}
                                <div className="w-[140px] shrink-0">
                                  <label className="text-[9px] uppercase tracking-wider text-white/30 block">Sub-section</label>
                                  <select
                                    value={f.subSectionKey ?? ''}
                                    onChange={e => updateFieldProp(f.id, 'subSectionKey', e.target.value || undefined)}
                                    className="w-full bg-[#02030E] border border-white/10 rounded-md px-2 py-1 text-white/70 text-xs"
                                  >
                                    <option value="">— none —</option>
                                    {(step.subSections ?? []).map(s => (
                                      <option key={s.key} value={s.key}>{s.label}</option>
                                    ))}
                                  </select>
                                </div>

                                {/* Placeholder */}
                                <div className="w-[160px] shrink-0">
                                  <label className="text-[9px] uppercase tracking-wider text-white/30 block">Placeholder</label>
                                  <input
                                    value={f.placeholder ?? ''}
                                    onChange={e => updateFieldProp(f.id, 'placeholder', e.target.value)}
                                    className="w-full bg-black/20 border border-white/10 rounded-md px-2 py-1 text-white/70 text-xs"
                                  />
                                </div>

                                {/* Visible / Required / Delete */}
                                <div className="flex items-center gap-3 shrink-0 pt-4">
                                  <label className="flex items-center gap-1 cursor-pointer select-none" title="Visible to users">
                                    <input type="checkbox" checked={f.visible !== false} onChange={e => updateFieldProp(f.id, 'visible', e.target.checked)} className="w-3.5 h-3.5 accent-emerald-500" />
                                    <span className="text-[10px] text-white/40">Vis</span>
                                  </label>
                                  <label className="flex items-center gap-1 cursor-pointer select-none" title="Required">
                                    <input type="checkbox" checked={f.required} onChange={e => updateFieldProp(f.id, 'required', e.target.checked)} className="w-3.5 h-3.5 accent-purple-500" />
                                    <span className="text-[10px] text-white/40">Req</span>
                                  </label>
                                  <button
                                    onClick={() => deleteCustomField(f.id)}
                                    disabled={f.isSystem}
                                    className="p-1 text-white/30 hover:text-red-400 hover:bg-red-400/10 rounded disabled:opacity-25 disabled:hover:bg-transparent disabled:hover:text-white/20"
                                    title={f.isSystem ? 'System fields cannot be deleted' : 'Delete'}
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            ))}

                            <button
                              onClick={() => addFieldToStep(step.key)}
                              className="text-xs border border-dashed border-purple-500/30 text-purple-400/80 hover:bg-purple-500/10 px-3 py-2 w-full rounded-lg flex items-center justify-center gap-2 transition-colors mt-2"
                            >
                              <Plus className="w-3 h-3" /> Add Field to {step.label}
                            </button>
                          </div>
                        </details>
                      )
                    })}
                  </div>
                </div>
              </div>
            ) : (
              /* ── RFI Field Modeler (for custom categories) ── */
              <div>
              {rfiFields.map((f, idx) => (
                <div key={f.id} className="flex gap-3 items-start bg-white/[0.02] border border-white/[0.06] p-4 rounded-xl group hover:border-white/[0.12] transition-colors">
                   {/* Reorder handle */}
                   <div className="flex flex-col gap-0.5 shrink-0 pt-1">
                     <button
                       onClick={() => moveRfiField(idx, -1)}
                       disabled={idx === 0}
                       className="text-white/20 hover:text-white/60 disabled:opacity-20 transition-colors text-xs leading-none"
                     >▲</button>
                     <GripVertical className="w-4 h-4 text-white/15" />
                     <button
                       onClick={() => moveRfiField(idx, 1)}
                       disabled={idx === rfiFields.length - 1}
                       className="text-white/20 hover:text-white/60 disabled:opacity-20 transition-colors text-xs leading-none"
                     >▼</button>
                   </div>

                   {/* Field config */}
                   <div className="flex-1 grid grid-cols-1 sm:grid-cols-[1fr_140px_120px] gap-3">
                     <div>
                       <label className="text-[10px] uppercase font-bold tracking-wider text-white/40 mb-1 block">Field Label</label>
                       <input
                         value={f.label}
                         onChange={e => updateRfiField(f.id, 'label', e.target.value)}
                         placeholder="e.g. Company Overview"
                         className="bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white text-sm w-full focus:border-purple-500/40 outline-none transition-colors"
                       />
                     </div>
                     <div>
                       <label className="text-[10px] uppercase font-bold tracking-wider text-white/40 mb-1 block">Type</label>
                       <select
                         value={f.type}
                         onChange={e => updateRfiField(f.id, 'type', e.target.value)}
                         className="bg-[#02030E] border border-white/10 rounded-lg px-3 py-2 text-white text-sm w-full cursor-pointer outline-none"
                       >
                         {FIELD_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                       </select>
                     </div>
                     <div>
                       <label className="text-[10px] uppercase font-bold tracking-wider text-white/40 mb-1 block">Section</label>
                       <input
                         value={f.section || ''}
                         onChange={e => updateRfiField(f.id, 'section', e.target.value)}
                         placeholder="General"
                         className="bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white/70 text-sm w-full outline-none"
                       />
                     </div>
                   </div>

                   {/* Required toggle + Visibility + Delete */}
                   <div className="flex flex-col gap-3 shrink-0 items-end">
                     <div className="flex items-center gap-4">
                       <label className="flex items-center gap-1.5 cursor-pointer select-none">
                         <span className="text-[10px] uppercase font-bold tracking-wider text-white/40">Visible</span>
                         <input
                           type="checkbox"
                           checked={f.visible !== false}
                           onChange={e => updateRfiField(f.id, 'visible', e.target.checked as any)}
                           className="w-4 h-4 accent-emerald-500 cursor-pointer"
                         />
                       </label>
                       <label className="flex items-center gap-1.5 cursor-pointer select-none">
                         <span className="text-[10px] uppercase font-bold tracking-wider text-white/40">Req</span>
                         <input
                           type="checkbox"
                           checked={f.required}
                           onChange={e => updateRfiField(f.id, 'required', e.target.checked)}
                           className="w-4 h-4 accent-purple-500 cursor-pointer"
                         />
                       </label>
                     </div>
                     <button
                       onClick={() => removeRfiField(f.id)}
                       className="p-1.5 hover:bg-red-500/10 text-white/25 hover:text-red-400 rounded-md transition-colors"
                     >
                       <Trash2 className="w-4 h-4" />
                     </button>
                   </div>
                </div>
              ))}
              {rfiFields.length === 0 && (
                <div className="text-center py-8 text-white/30 text-sm">
                  <FileText className="w-8 h-8 mx-auto mb-2 text-white/15" />
                  <p>No RFI fields defined yet.</p>
                  <p className="text-xs text-white/20 mt-1">Add fields below to build your RFI template.</p>
                </div>
              )}
              <button
                onClick={handleAddRfiField}
                className="text-sm border border-white/10 border-dashed hover:bg-white/5 text-white/60 px-4 py-2.5 w-full rounded-xl flex items-center justify-center gap-2 transition-colors hover:border-purple-500/30 hover:text-purple-400 mt-4"
              >
                <Plus className="w-4 h-4" /> Add RFI Field
              </button>
            </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
