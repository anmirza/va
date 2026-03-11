import re

with open('app/signup/production/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update Sectors to Percentages
content = content.replace('const [selectedSectors, setSelectedSectors] = useState<Record<string, boolean>>({})', 'const [sectorPercentages, setSectorPercentages] = useState<Record<string, string>>({})')
content = content.replace('selectedSectors,', 'sectorPercentages,') # For profile payload submission
content = content.replace('selectedSectors: selectedSectors', 'selectedSectors: sectorPercentages') # Just in case

old_sectors_ui = '''              <StepHeader icon="🏷️" title="Industry Sectors" subtitle="Select all sectors you have expertise in" />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {SECTORS.map(sector => (
                  <label key={sector} className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${selectedSectors[sector] ? 'bg-[#4fc487]/10 border-[#4fc487]' : 'bg-white/[0.03] border-white/[0.1] hover:border-white/[0.2]'}`}>
                    <input type="checkbox" checked={!!selectedSectors[sector]} onChange={() => setSelectedSectors(prev => ({ ...prev, [sector]: !prev[sector] }))} className="w-4 h-4 accent-[#4fc487]" />
                    <span className="text-sm font-medium text-white/70">{sector}</span>
                  </label>
                ))}
              </div>
              <p className="text-xs text-[#999] mt-4">{Object.values(selectedSectors).filter(Boolean).length} sector(s) selected</p>'''

new_sectors_ui = '''              <StepHeader icon="🏷️" title="Industry Sectors" subtitle="Allocate percentage of expertise across sectors" />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {SECTORS.map(sector => (
                  <div key={sector} className={`flex items-center gap-2 p-2.5 rounded-xl border transition-all text-sm ${sectorPercentages[sector] ? 'bg-[#4fc487]/10 border-[#4fc487]/30 text-[#4fc487]' : 'bg-white/[0.03] border-white/[0.1] text-white/70'}`}>
                    <span className="flex-1 truncate" title={sector}>{sector}</span>
                    <div className="flex items-center gap-2 shrink-0">
                      <input type="number" min={0} max={100} value={sectorPercentages[sector] || ''} onChange={e => setSectorPercentages(prev => ({ ...prev, [sector]: e.target.value }))} className="w-16 text-sm text-center bg-white/[0.04] border border-white/[0.12] text-white rounded-lg py-1 focus:border-[#4fc487] outline-none" placeholder="0" />
                      <span className="text-sm text-white/40">%</span>
                    </div>
                  </div>
                ))}
              </div>'''
content = content.replace(old_sectors_ui, new_sectors_ui)

# 2. Turnover Pitch Update
new_state = '''  const [clientPitch, setClientPitch] = useState([{ division: '', activities: '', year: '', turnover: '', incidence: '' }])
  const [clientDuration, setClientDuration] = useState('')'''

content = re.sub(r'(const \[workedWithClient, setWorkedWithClient\] = useState<boolean \| null>\(null\))', r'\1\n' + new_state, content)

content = content.replace('workedWithClient,', 'workedWithClient, clientPitch, clientDuration,')

pitch_ui = '''              {/* Pitch client check */}
              <div className="border border-white/[0.1] rounded-xl p-5 bg-yellow-500/[0.06]">
                <p className="text-sm font-bold text-white/80 mb-1">Pitch Process — Client Conflict Check</p>
                <p className="text-xs text-white/50 mb-4">Complete this only if responding to a specific pitch process.</p>
                <p className="text-sm text-white/60 mb-3">Is your company currently working or has previously worked with the client?</p>
                <div className="flex gap-4">
                  {[true, false].map(v => (
                    <label key={String(v)} className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" checked={workedWithClient === v} onChange={() => setWorkedWithClient(v)} className="w-4 h-4 accent-[#4fc487]" />
                      <span className="text-sm">{v ? 'Yes' : 'No'}</span>
                    </label>
                  ))}
                </div>
              </div>'''

new_pitch_ui = '''              {/* Pitch client check */}
              <div className="border border-white/[0.1] rounded-xl p-5 bg-yellow-500/[0.06]">
                <p className="text-sm font-bold text-white/80 mb-1">Pitch Process — Client Conflict Check</p>
                <p className="text-xs text-white/50 mb-4 flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-yellow-500/20 text-yellow-500 flex items-center justify-center text-[10px] font-bold">i</span>
                  Note: Please complete the section below only upon receipt of this Request for Information (RFI) during a pitch process.
                </p>
                <p className="text-sm text-white/60 mb-3">Is your company currently working or has previously worked with the client?</p>
                <div className="flex gap-4 mb-5">
                  {[true, false].map(v => (
                    <label key={String(v)} className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" checked={workedWithClient === v} onChange={() => setWorkedWithClient(v)} className="w-4 h-4 accent-[#4fc487]" />
                      <span className="text-sm">{v ? 'Yes' : 'No'}</span>
                    </label>
                  ))}
                </div>
                
                {workedWithClient === true && (
                  <div className="pt-5 border-t border-white/[0.06] space-y-4">
                    <p className="text-xs font-bold text-white/60 uppercase tracking-widest">Client Engagement Details</p>
                    <div className="space-y-3">
                      {clientPitch.map((pitch, idx) => (
                        <div key={idx} className="grid grid-cols-2 sm:grid-cols-5 gap-3 border border-white/[0.06] bg-white/[0.02] p-3 rounded-xl">
                          <FormField label="Division"><Input value={pitch.division} onChange={e => { const p = [...clientPitch]; p[idx].division = e.target.value; setClientPitch(p) }} placeholder="Client Division" className="text-xs" /></FormField>
                          <FormField label="Activities"><Input value={pitch.activities} onChange={e => { const p = [...clientPitch]; p[idx].activities = e.target.value; setClientPitch(p) }} placeholder="Principal Activities" className="text-xs" /></FormField>
                          <FormField label="Year"><Input value={pitch.year} onChange={e => { const p = [...clientPitch]; p[idx].year = e.target.value; setClientPitch(p) }} placeholder="Year" className="text-xs" /></FormField>
                          <FormField label="Turnover"><Input value={pitch.turnover} onChange={e => { const p = [...clientPitch]; p[idx].turnover = e.target.value; setClientPitch(p) }} placeholder="Turnover (EUR)" className="text-xs" /></FormField>
                          <FormField label="Incidence"><Input value={pitch.incidence} onChange={e => { const p = [...clientPitch]; p[idx].incidence = e.target.value; setClientPitch(p) }} placeholder="% incidence" className="text-xs" /></FormField>
                        </div>
                      ))}
                      <button onClick={() => setClientPitch(prev => [...prev, { division: '', activities: '', year: '', turnover: '', incidence: '' }])} className="text-xs text-yellow-500 hover:text-yellow-400 font-medium">+ Add row</button>
                    </div>
                    <FormField label="Duration of Engagement with the Client" className="pt-2">
                      <Input value={clientDuration} onChange={e => setClientDuration(e.target.value)} placeholder="e.g. 3 years" />
                    </FormField>
                  </div>
                )}
              </div>'''

content = content.replace(pitch_ui, new_pitch_ui)

with open('app/signup/production/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print('Production signup updated')
