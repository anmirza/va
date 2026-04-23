'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { getAllOrgs, OrgRecord, getVACategories } from '@/lib/admin-store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, Filter, Plus, MoreHorizontal, MapPin, Users, Calendar, ExternalLink } from 'lucide-react'
import { CategoryIcon } from '@/components/category-icon'

export default function GenericListingPage() {
  const params = useParams()
  const router = useRouter()
  const categoryId = params.categoryId as string
  const [orgs, setOrgs] = useState<OrgRecord[]>([])
  const [categoryName, setCategoryName] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const allOrgs = getAllOrgs()
    const filtered = allOrgs.filter(o => {
      if (categoryId === 'cat-agency') return o.type === 'agency'
      if (categoryId === 'cat-production') return o.type === 'production'
      return o.type === categoryId
    })
    setOrgs(filtered)

    const cats = getVACategories()
    const cat = cats.find(c => c.id === categoryId)
    setCategoryName(cat?.name || 'Organizations')
  }, [categoryId])

  const filteredOrgs = orgs.filter(o => 
    o.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.country?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            {categoryName}
            <span className="text-sm font-normal text-white/30 bg-white/5 px-2 py-0.5 rounded-full">{filteredOrgs.length}</span>
          </h1>
          <p className="text-sm text-white/50 mt-1">Manage and monitor all registered {categoryName.toLowerCase()}.</p>
        </div>
        <Button 
          onClick={() => router.push(`/admin/listing/${categoryId}/create`)}
          className="bg-[#0763d8] hover:bg-[#0655b3] text-white rounded-xl gap-2 h-11 px-6 shadow-lg shadow-[#0763d8]/20"
        >
          <Plus className="w-4 h-4" /> Add {categoryName}
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <Input 
            placeholder={`Search ${categoryName.toLowerCase()}...`}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-10 bg-white/[0.03] border-white/10 rounded-xl h-11 text-white placeholder:text-white/20"
          />
        </div>
        <Button variant="outline" className="border-white/10 text-white/60 gap-2 h-11 rounded-xl">
          <Filter className="w-4 h-4" /> Filter
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredOrgs.map(org => (
          <div key={org.id} className="glass-card rounded-2xl overflow-hidden border-white/5 hover:border-white/10 transition-all group">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-white font-bold text-xl">
                  {org.name[0]}
                </div>
                <button className="text-white/20 hover:text-white transition-colors">
                  <MoreHorizontal className="w-5 h-5" />
                </button>
              </div>

              <h3 className="text-lg font-bold text-white mb-1 group-hover:text-[#0763d8] transition-colors">{org.name}</h3>
              
              <div className="flex items-center gap-3 text-xs text-white/40 mb-6">
                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {org.country || 'N/A'}</span>
                <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {org.memberCount || 0} Members</span>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between text-[10px] uppercase tracking-wider font-bold">
                  <span className="text-white/20">Status</span>
                  <span className={`px-2 py-0.5 rounded-md ${
                    org.status === 'active' ? 'bg-emerald-500/10 text-emerald-400' : 
                    org.status === 'pending' ? 'bg-amber-500/10 text-amber-400' : 'bg-red-500/10 text-red-400'
                  }`}>
                    {org.status}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[10px] uppercase tracking-wider font-bold">
                  <span className="text-white/20">Created</span>
                  <span className="text-white/40">{new Date(org.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1 border-white/10 text-white/60 text-xs rounded-lg h-9">
                  View Profile
                </Button>
                <Button size="sm" className="flex-1 bg-white/5 hover:bg-white/10 text-white text-xs rounded-lg h-9">
                  Edit Details
                </Button>
              </div>
            </div>
          </div>
        ))}

        {filteredOrgs.length === 0 && (
          <div className="col-span-full py-20 text-center glass-card rounded-3xl border-dashed border-white/10">
            <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-white/10" />
            </div>
            <p className="text-white/40 font-medium">No {categoryName.toLowerCase()} found.</p>
            <p className="text-white/20 text-sm mt-1">Try adjusting your search or add a new record.</p>
          </div>
        )}
      </div>
    </div>
  )
}
