'use client'

import { useState, useEffect } from 'react'
import { getVACategories, saveVACategory, VACategory } from '@/lib/admin-store'
import { Plus, Save, Settings2, Trash2, FileText } from 'lucide-react'

export default function SettingsPage() {
  const [categories, setCategories] = useState<VACategory[]>([])
  
  // RFI Model state
  const [rfiFields, setRfiFields] = useState<{id: string; label: string; type: string}[]>([
    { id: 'f1', label: 'Company Overview', type: 'text' },
    { id: 'f2', label: 'Financials (Last 3 Years)', type: 'file' },
    { id: 'f3', label: 'DEI Policy', type: 'file' },
  ])

  useEffect(() => {
    setCategories(getVACategories())
  }, [])

  const handleAddCategory = () => {
    const newCat = {
      id: `cat-${Date.now()}`,
      name: 'New Category',
      iconSvg: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-square"><rect width="18" height="18" x="3" y="3" rx="2"/></svg>'
    }
    setCategories([...categories, newCat])
    saveVACategory(newCat)
  }

  const updateCategory = (id: string, field: keyof VACategory, value: string) => {
    const updated = categories.map(c => c.id === id ? { ...c, [field]: value } : c)
    setCategories(updated)
  }
  
  const saveCategory = (id: string) => {
    const cat = categories.find(c => c.id === id)
    if (cat) {
      saveVACategory(cat)
      alert('Category saved')
    }
  }

  return (
    <div className="max-w-5xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white mb-2">Platform Settings</h1>
        <p className="text-white/50 text-sm">Super Admin Only: Manage dynamic categories and RFI template configurations.</p>
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
             {categories.map((cat, index) => (
                <div key={cat.id} className="flex gap-4 items-start bg-white/[0.02] border border-white/[0.06] p-4 rounded-xl">
                    <div 
                      className="w-12 h-12 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center shrink-0 [&>svg]:w-6 [&>svg]:h-6 [&>svg]:text-white/70"
                      dangerouslySetInnerHTML={{ __html: cat.iconSvg }}
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
                    </div>
                </div>
             ))}
          </div>
        </div>

        {/* Dynamic RFI Modeler Mockup */}
        <div className="glass-card rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-white/[0.06] flex items-center justify-between">
            <h2 className="font-semibold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-purple-500" /> RFI Structure Modeler
            </h2>
            <div className="text-xs text-white/40 border border-white/10 px-2 py-1 rounded bg-white/5">Mockup</div>
          </div>
          <div className="p-6">
            <p className="text-sm text-white/50 mb-4">Define the standard RFI fields requested from organizations during onboarding.</p>
            
            <div className="space-y-3 mb-4">
              {rfiFields.map(f => (
                <div key={f.id} className="flex gap-3 items-center bg-white/[0.02] border border-white/[0.06] p-3 rounded-xl">
                   <div className="flex-1">
                     <input value={f.label} disabled className="bg-transparent text-white text-sm w-full outline-none" />
                   </div>
                   <div className="shrink-0 bg-white/5 border border-white/10 px-2 py-1 rounded text-xs text-white/40 font-mono">
                     Type: {f.type}
                   </div>
                   <button className="p-1.5 hover:bg-red-500/10 text-red-400 rounded-md transition-colors"><Trash2 className="w-4 h-4" /></button>
                </div>
              ))}
            </div>
            
            <button className="text-sm border border-white/10 border-dashed hover:bg-white/5 text-white/60 px-4 py-2 w-full rounded-xl flex items-center justify-center gap-2 transition-colors">
              <Plus className="w-4 h-4" /> Add RFI Field
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
