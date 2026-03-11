import re

with open('app/signup/agency/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('const [selectedSectors, setSelectedSectors] = useState<Record<string, boolean>>({})', 'const [sectorPercentages, setSectorPercentages] = useState<Record<string, string>>({})')
content = content.replace('selectedSectors,', 'sectorPercentages,')
content = content.replace('selectedSectors: selectedSectors', 'selectedSectors: sectorPercentages')

new_state = '''  const [workedWithClient, setWorkedWithClient] = useState('')
  const [clientPitch, setClientPitch] = useState([{ division: '', activities: '', year: '', turnover: '', incidence: '' }])
  const [clientDuration, setClientDuration] = useState('')'''
content = re.sub(r'(const \[clients, setClients\] = useState\([^)]+\))', r'\1\n' + new_state, content)

content = content.replace('revenue, clients, competencies', 'revenue, clients, workedWithClient, clientPitch, clientDuration, competencies')

old_ui = '''              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-8">
                {COMMUNICATION_AREAS.map(area => (
                  <label key={area} className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer transition-all text-xs ${selectedSectors[area] ? 'bg-[#4fc487]/10 border-[#4fc487]/30 text-[#4fc487]' : 'bg-white/[0.03] border-white/[0.06] text-white/60 hover:border-white/20'}`}>
                    <input type="checkbox" checked={!!selectedSectors[area]} onChange={() => setSelectedSectors(prev => ({ ...prev, [area]: !prev[area] }))} className="w-3.5 h-3.5 accent-[#4fc487]" />
                    {area}
                  </label>
                ))}
              </div>'''

new_ui = '''              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 mb-8">
                {COMMUNICATION_AREAS.map(area => (
                  <div key={area} className={`flex items-center gap-2 p-2.5 rounded-xl border transition-all text-xs ${sectorPercentages[area] ? 'bg-[#4fc487]/10 border-[#4fc487]/30 text-[#4fc487]' : 'bg-white/[0.03] border-white/[0.06] text-white/50'}`}>
                    <span className="flex-1 truncate" title={area}>{area}</span>
                    <div className="flex items-center gap-1 shrink-0">
                      <input type="number" min={0} max={100} value={sectorPercentages[area] || ''} onChange={e => setSectorPercentages(prev => ({ ...prev, [area]: e.target.value }))} className="w-14 text-xs text-center bg-white/[0.04] border border-white/[0.08] text-foreground rounded-lg py-1 focus:border-[#4fc487] outline-none" placeholder="0" />
                      <span className="text-xs text-white/30">%</span>
                    </div>
                  </div>
                ))}
              </div>'''
content = content.replace(old_ui, new_ui)

turnover_ui = '''                <button onClick={() => setClients(prev => [...prev, { name: '', industry: '', activities: '', year: '', turnover: '', incidence: '', exclusivity: false }])}
                  className="text-xs text-[#4fc487] hover:text-[#45b078]">+ Add client</button>
              </div>'''
pitch_ui = turnover_ui + '''
              
              <div className="border-t border-white/[0.06] pt-6 mt-8">
                <p className="text-xs text-white/40 italic mb-4">Note: Please complete the section below only upon receipt of this Request for Information (RFI) during a pitch process.</p>
                <FormField label="Please specify whether your company is currently working or has previously worked with the CLIENT.">
                  <select value={workedWithClient} onChange={e => setWorkedWithClient(e.target.value)} className={selectCls}>
                    <option value="">Select</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </FormField>
                
                {workedWithClient === 'Yes' && (
                  <div className="mt-6 space-y-4">
                    <p className="text-xs font-bold text-white/60 uppercase tracking-widest">Client Engagement Details</p>
                    <div className="space-y-3">
                      {clientPitch.map((pitch, idx) => (
                        <div key={idx} className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                          <Input value={pitch.division} onChange={e => { const p = [...clientPitch]; p[idx].division = e.target.value; setClientPitch(p) }} placeholder="Client Division" className={inputCls + ' h-9 text-xs'} />
                          <Input value={pitch.activities} onChange={e => { const p = [...clientPitch]; p[idx].activities = e.target.value; setClientPitch(p) }} placeholder="Principal Activities" className={inputCls + ' h-9 text-xs'} />
                          <Input value={pitch.year} onChange={e => { const p = [...clientPitch]; p[idx].year = e.target.value; setClientPitch(p) }} placeholder="Year" className={inputCls + ' h-9 text-xs'} />
                          <Input value={pitch.turnover} onChange={e => { const p = [...clientPitch]; p[idx].turnover = e.target.value; setClientPitch(p) }} placeholder="Turnover (EUR)" className={inputCls + ' h-9 text-xs'} />
                          <Input value={pitch.incidence} onChange={e => { const p = [...clientPitch]; p[idx].incidence = e.target.value; setClientPitch(p) }} placeholder="% incidence" className={inputCls + ' h-9 text-xs'} />
                        </div>
                      ))}
                      <button onClick={() => setClientPitch(prev => [...prev, { division: '', activities: '', year: '', turnover: '', incidence: '' }])}
                        className="text-xs text-[#4fc487] hover:text-[#45b078]">+ Add row</button>
                    </div>
                    <FormField label="Duration of Engagement with the Client" className="mt-4">
                      <Input value={clientDuration} onChange={e => setClientDuration(e.target.value)} placeholder="e.g. 3 years" className={inputCls} />
                    </FormField>
                  </div>
                )}
              </div>
'''
content = content.replace(turnover_ui, pitch_ui)

old_client_row = '''                    <Input value={client.name} onChange={e => { const c = [...clients]; c[idx].name = e.target.value; setClients(c) }} placeholder="Client name" className={inputCls + ' h-9 text-xs'} />
                    <Input value={client.industry} onChange={e => { const c = [...clients]; c[idx].industry = e.target.value; setClients(c) }} placeholder="Industry" className={inputCls + ' h-9 text-xs'} />
                    <Input value={client.activities} onChange={e => { const c = [...clients]; c[idx].activities = e.target.value; setClients(c) }} placeholder="Activities" className={inputCls + ' h-9 text-xs'} />
                    <Input value={client.incidence} onChange={e => { const c = [...clients]; c[idx].incidence = e.target.value; setClients(c) }} placeholder="% incidence" className={inputCls + ' h-9 text-xs'} />'''

new_client_row = '''                    <Input value={client.name} onChange={e => { const c = [...clients]; c[idx].name = e.target.value; setClients(c) }} placeholder="Client name" className={inputCls + ' h-9 text-xs sm:col-span-2'} />
                    <Input value={client.industry} onChange={e => { const c = [...clients]; c[idx].industry = e.target.value; setClients(c) }} placeholder="Industry" className={inputCls + ' h-9 text-xs'} />
                    <Input value={client.activities} onChange={e => { const c = [...clients]; c[idx].activities = e.target.value; setClients(c) }} placeholder="Activities" className={inputCls + ' h-9 text-xs'} />
                    <Input value={client.year} onChange={e => { const c = [...clients]; c[idx].year = e.target.value; setClients(c) }} placeholder="Year" className={inputCls + ' h-9 text-xs'} />
                    <Input value={client.turnover} onChange={e => { const c = [...clients]; c[idx].turnover = e.target.value; setClients(c) }} placeholder="Turnover in EUR" className={inputCls + ' h-9 text-xs'} />
                    <Input value={client.incidence} onChange={e => { const c = [...clients]; c[idx].incidence = e.target.value; setClients(c) }} placeholder="% incidence" className={inputCls + ' h-9 text-xs'} />
                    <label className="flex items-center gap-2 h-9 px-3 rounded-xl border border-white/[0.12] bg-white/[0.06] text-white text-xs cursor-pointer">
                      <input type="checkbox" checked={client.exclusivity} onChange={e => { const c = [...clients]; c[idx].exclusivity = e.target.checked; setClients(c) }} className="accent-[#4fc487]" />
                      Exclusivity
                    </label>'''

content = content.replace(old_client_row, new_client_row)
content = content.replace('className="grid grid-cols-2 sm:grid-cols-4 gap-2"', 'className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-8 gap-2"')

with open('app/signup/agency/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print('Agency signup updated')
