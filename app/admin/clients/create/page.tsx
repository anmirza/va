"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { createClientCompanyFS, updateClientCompanyFS, getClientCompanyByIdFS } from "@/lib/admin-firestore";
import { GooglePlacesAutocomplete } from "@/components/google-places-autocomplete";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  Building2,
  Globe,
  Coins,
  Save,
  MapPin,
  Clock,
} from "lucide-react";

const OPERATE_AS_OPTIONS = [
  { value: "regional_hub", label: "Regional Hub" },
  { value: "multi_country", label: "Multi Country" },
  { value: "country_company", label: "Country Company" },
];

const REGIONAL_HUB_OPTIONS = [
  "Global","EMEA","Americas","APAC","LATAM","MEA","North America","Other",
];

const REGION_OPTIONS = [
  "Western Europe","Eastern Europe","Central Europe","Northern Europe","Southern Europe",
  "Nordics","DACH","Benelux","Iberia","UK & Ireland","Mediterranean","Middle East",
  "North Africa","Sub-Saharan Africa","East Asia","South Asia","Southeast Asia",
  "Greater China","Japan & Korea","India Subcontinent","ANZ","Oceania",
  "Central America","South America","Caribbean","Other",
];

const COUNTRIES = [
  "Afghanistan","Albania","Algeria","Angola","Argentina","Armenia","Australia",
  "Austria","Azerbaijan","Bahrain","Bangladesh","Belarus","Belgium","Bolivia",
  "Bosnia and Herzegovina","Brazil","Bulgaria","Cambodia","Cameroon","Canada",
  "Chile","China","Colombia","Croatia","Czech Republic","Denmark","Ecuador",
  "Egypt","El Salvador","Estonia","Ethiopia","Finland","France","Georgia",
  "Germany","Ghana","Greece","Guatemala","Honduras","Hungary","India",
  "Indonesia","Iran","Iraq","Ireland","Israel","Italy","Ivory Coast","Japan",
  "Jordan","Kazakhstan","Kenya","Kuwait","Latvia","Lebanon","Libya","Lithuania",
  "Luxembourg","Malaysia","Mexico","Moldova","Morocco","Myanmar","Netherlands",
  "New Zealand","Nigeria","Norway","Oman","Pakistan","Panama","Paraguay","Peru",
  "Philippines","Poland","Portugal","Qatar","Romania","Russia","Saudi Arabia",
  "Senegal","Serbia","Singapore","Slovakia","Slovenia","South Africa",
  "South Korea","Spain","Sri Lanka","Sweden","Switzerland","Taiwan","Tanzania",
  "Thailand","Tunisia","Turkey","Uganda","Ukraine","United Arab Emirates",
  "United Kingdom","United States","Uruguay","Uzbekistan","Venezuela","Vietnam",
  "Yemen","Zambia","Zimbabwe",
];

const ADDRESS_TYPES = [
  "Headquarters","Legal Office","Local Office","Billing","Operational Office",
];

export default function CreateClientCompanyPage() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("editId");
  const isEditMode = !!editId;

  const [name, setName] = useState("");
  const [operateAs, setOperateAs] = useState("");
  const [holdingCompany, setHoldingCompany] = useState("");
  const [regionalHub, setRegionalHub] = useState("");
  const [region, setRegion] = useState("");
  const [coveredRegions, setCoveredRegions] = useState<string[]>([]);
  const [coveredCountries, setCoveredCountries] = useState<string[]>([]);
  const [country, setCountry] = useState("");
  const [legalEntityName, setLegalEntityName] = useState("");
  const [localCompany, setLocalCompany] = useState("");
  const [address, setAddress] = useState("");
  const [addressType, setAddressType] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pre-fill form when editing an existing company
  useEffect(() => {
    if (!editId) return;
    getClientCompanyByIdFS(editId).then(comp => {
      if (!comp) return;
      setName(comp.name ?? "");
      setOperateAs(comp.operateAs ?? "");
      setHoldingCompany(comp.holdingCompany ?? "");
      setRegionalHub(comp.regionalHub ?? "");
      setRegion(comp.region ?? "");
      setCoveredRegions(comp.coveredRegions ?? []);
      setCoveredCountries(comp.coveredCountries ?? []);
      setCountry(comp.country ?? "");
      setLegalEntityName(comp.legalEntityName ?? "");
      setLocalCompany(comp.localCompany ?? "");
      setAddress(comp.address ?? "");
      setAddressType(comp.addressType ?? "");
      setNotes(comp.notes ?? "");
    });
  }, [editId]);

  const inputCls =
    "w-full h-10 bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#0763d8]/60 transition-colors";
  const selectCls =
    "w-full h-10 bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 text-sm text-white focus:outline-none focus:border-[#0763d8]/60 transition-colors";

  const toggleMulti = (
    value: string,
    current: string[],
    setter: (v: string[]) => void,
  ) => {
    setter(
      current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value],
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { toast.error("Company name is required"); return; }
    setIsSubmitting(true);
    try {
      if (isEditMode && editId) {
        const updates = {
          name: name.trim(),
          legalEntityName: legalEntityName.trim() || undefined,
          holdingCompany: holdingCompany.trim() || undefined,
          operateAs: (operateAs || undefined) as any,
          regionalHub: regionalHub || undefined,
          region: region || undefined,
          coveredRegions: coveredRegions.length > 0 ? coveredRegions : undefined,
          coveredCountries: coveredCountries.length > 0 ? coveredCountries : undefined,
          country: country || undefined,
          localCompany: localCompany.trim() || undefined,
          address: address.trim() || undefined,
          addressType: addressType || undefined,
          notes: notes.trim() || undefined,
        };
        // Strip undefined fields — Firestore rejects them in updateDoc
        const payload = Object.fromEntries(Object.entries(updates).filter(([, v]) => v !== undefined));
        await updateClientCompanyFS(editId, payload);
        toast.success(`"${name.trim()}" updated successfully.`);
      } else {
        await createClientCompanyFS(
          {
            name: name.trim(),
            legalEntityName: legalEntityName.trim() || undefined,
            holdingCompany: holdingCompany.trim() || undefined,
            operateAs: (operateAs || undefined) as any,
            regionalHub: regionalHub || undefined,
            region: region || undefined,
            coveredRegions: coveredRegions.length > 0 ? coveredRegions : undefined,
            coveredCountries: coveredCountries.length > 0 ? coveredCountries : undefined,
            country: country || undefined,
            localCompany: localCompany.trim() || undefined,
            address: address.trim() || undefined,
            addressType: addressType || undefined,
            tokens: 0, tokensUsed: 0, packageSize: 6, status: "active",
            notes: notes.trim() || undefined,
          },
          user?.id ?? "admin",
        );
        toast.success(`"${name.trim()}" created successfully.`);
      }
      router.push("/admin/clients");
    } catch {
      toast.error(isEditMode ? "Failed to update company." : "Failed to create company.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-3 mb-8">
        <Link
          href="/admin/clients"
          className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/[0.04] transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white">{isEditMode ? "Edit Client Company" : "Add Client Company"}</h1>
          <p className="text-white/40 text-sm mt-0.5">
            {isEditMode ? "Update company details, hierarchy, and operating structure." : "Register a new client company with geographic structure and hierarchy."}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Geographic & Operating Structure */}
        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-8 rounded-lg bg-[#0763d8]/10 border border-[#0763d8]/20 flex items-center justify-center">
              <Building2 className="w-4 h-4 text-[#0763d8]" />
            </div>
            <h2 className="text-sm font-semibold text-white">
              Geographic &amp; Operating Structure
            </h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-white/50 mb-1.5 uppercase tracking-wider">
                Company Name <span className="text-red-400">*</span>
              </label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Coca-Cola Italy" className={inputCls} required />
            </div>
            <div>
              <label className="block text-xs font-medium text-white/50 mb-1.5 uppercase tracking-wider">
                Legal Entity Name
              </label>
              <input type="text" value={legalEntityName} onChange={(e) => setLegalEntityName(e.target.value)}
                placeholder="e.g. Coca-Cola Italia S.p.A." className={inputCls} />
            </div>
            <div>
              <label className="block text-xs font-medium text-white/50 mb-1.5 uppercase tracking-wider">
                Operate As <span className="text-red-400">*</span>
              </label>
              <select value={operateAs} onChange={(e) => { setOperateAs(e.target.value); setCoveredRegions([]); setCoveredCountries([]); setCountry(""); setRegion(""); }}
                className={selectCls} required>
                <option value="">Select operating type…</option>
                {OPERATE_AS_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value} className="bg-[#0a0b1a]">{o.label}</option>
                ))}
              </select>
              <p className="text-[10px] text-white/30 mt-1">Controls which fields are required below.</p>
            </div>
          </div>
        </div>

        {/* Section 2: Hierarchy (shown once Operate As is selected) */}
        {operateAs && (
          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                <Globe className="w-4 h-4 text-purple-400" />
              </div>
              <h2 className="text-sm font-semibold text-white">Hierarchy</h2>
            </div>
            <p className="text-xs text-white/30 mb-5 ml-11">
              Parent Company → Regional Hub → Region → Country → Local Legal Entity
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-white/50 mb-1.5 uppercase tracking-wider">Parent Company</label>
                <input type="text" value={holdingCompany} onChange={(e) => setHoldingCompany(e.target.value)}
                  placeholder="e.g. The Coca-Cola Company" className={inputCls} />
              </div>
              <div>
                <label className="block text-xs font-medium text-white/50 mb-1.5 uppercase tracking-wider">Regional Hub</label>
                <select value={regionalHub} onChange={(e) => setRegionalHub(e.target.value)} className={selectCls}>
                  <option value="">Select operational hub… e.g. EMEA</option>
                  {REGIONAL_HUB_OPTIONS.map((r) => (
                    <option key={r} value={r} className="bg-[#0a0b1a]">{r}</option>
                  ))}
                </select>
              </div>
              {operateAs === "regional_hub" && (
                <div>
                  <label className="block text-xs font-medium text-white/50 mb-1.5 uppercase tracking-wider">Covered Regions</label>
                  <div className="flex flex-wrap gap-2 p-3 bg-white/[0.03] border border-white/[0.08] rounded-lg">
                    {REGION_OPTIONS.map((r) => (
                      <button key={r} type="button"
                        onClick={() => toggleMulti(r, coveredRegions, setCoveredRegions)}
                        className={`px-2.5 py-1 rounded-full text-xs border transition-colors ${coveredRegions.includes(r) ? "bg-[#0763d8]/20 border-[#0763d8]/40 text-[#0763d8]" : "bg-white/[0.03] border-white/[0.08] text-white/40 hover:border-white/20"}`}>
                        {r}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {(operateAs === "multi_country" || operateAs === "country_company") && (
                <div>
                  <label className="block text-xs font-medium text-white/50 mb-1.5 uppercase tracking-wider">Region</label>
                  <select value={region} onChange={(e) => setRegion(e.target.value)} className={selectCls}>
                    <option value="">Select geographical region… e.g. Southern Europe</option>
                    {REGION_OPTIONS.map((r) => (
                      <option key={r} value={r} className="bg-[#0a0b1a]">{r}</option>
                    ))}
                  </select>
                </div>
              )}
              {(operateAs === "regional_hub" || operateAs === "multi_country") && (
                <div>
                  <label className="block text-xs font-medium text-white/50 mb-1.5 uppercase tracking-wider">Covered Countries</label>
                  <div className="max-h-44 overflow-y-auto flex flex-wrap gap-2 p-3 bg-white/[0.03] border border-white/[0.08] rounded-lg">
                    {COUNTRIES.map((c) => (
                      <button key={c} type="button"
                        onClick={() => toggleMulti(c, coveredCountries, setCoveredCountries)}
                        className={`px-2.5 py-1 rounded-full text-xs border transition-colors ${coveredCountries.includes(c) ? "bg-[#0763d8]/20 border-[#0763d8]/40 text-[#0763d8]" : "bg-white/[0.03] border-white/[0.08] text-white/40 hover:border-white/20"}`}>
                        {c}
                      </button>
                    ))}
                  </div>
                  {coveredCountries.length > 0 && (
                    <p className="text-xs text-white/30 mt-1">{coveredCountries.length} country/countries selected</p>
                  )}
                </div>
              )}
              {operateAs === "country_company" && (
                <>
                  <div>
                    <label className="block text-xs font-medium text-white/50 mb-1.5 uppercase tracking-wider">Country</label>
                    <select value={country} onChange={(e) => setCountry(e.target.value)} className={selectCls}>
                      <option value="">Select country… e.g. Italy</option>
                      {COUNTRIES.map((c) => (
                        <option key={c} value={c} className="bg-[#0a0b1a]">{c}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-white/50 mb-1.5 uppercase tracking-wider">Local Legal Entity Name</label>
                    <input type="text" value={localCompany} onChange={(e) => setLocalCompany(e.target.value)}
                      placeholder="e.g. Coca-Cola Italia S.r.l." className={inputCls} />
                  </div>
                </>
              )}
              {(holdingCompany || regionalHub || region || name) && (
                <div className="p-4 bg-white/[0.02] border border-white/[0.05] rounded-xl">
                  <p className="text-[10px] uppercase font-bold text-white/30 tracking-wider mb-3">Hierarchy Preview</p>
                  <div className="space-y-1.5 text-xs">
                    {[
                      { label: holdingCompany, tag: "PARENT", color: "bg-purple-500/20 border-purple-500/30", indent: 0 },
                      { label: regionalHub, tag: "HUB", color: "bg-blue-500/20 border-blue-500/30", indent: 1 },
                      { label: region, tag: "REGION", color: "bg-teal-500/20 border-teal-500/30", indent: 2 },
                      { label: country || (coveredCountries.length > 0 ? `${coveredCountries.length} countries` : ""), tag: "COUNTRY", color: "bg-amber-500/20 border-amber-500/30", indent: 3 },
                      { label: localCompany || name, tag: "ENTITY", color: "bg-emerald-500/20 border-emerald-500/30", indent: 4 },
                    ].filter((r) => r.label).map((r, i) => (
                      <div key={i} className="flex items-center gap-2" style={{ paddingLeft: r.indent * 20 }}>
                        <div className={`w-3 h-3 rounded border shrink-0 ${r.color}`} />
                        <span className="text-white/70">{r.label}</span>
                        <span className="text-white/20 text-[10px]">{r.tag}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Section 3: Address (country_company only) */}
        {operateAs === "country_company" && (
          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center">
                <MapPin className="w-4 h-4 text-teal-400" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-white">Address</h2>
                <p className="text-[10px] text-white/30 mt-0.5">Physical office location</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-white/50 mb-1.5 uppercase tracking-wider">Address Type</label>
                <select value={addressType} onChange={(e) => setAddressType(e.target.value)} className={selectCls}>
                  <option value="">Select address type…</option>
                  {ADDRESS_TYPES.map((t) => (
                    <option key={t} value={t} className="bg-[#0a0b1a]">{t}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-white/50 mb-1.5 uppercase tracking-wider">Address</label>
                <GooglePlacesAutocomplete value={address} onChange={(addr) => setAddress(addr)} placeholder="Start typing an address…" />
              </div>
            </div>
          </div>
        )}

        {/* Token Allocation — ON HOLD */}
        <div className="glass-card rounded-2xl p-6 opacity-60 pointer-events-none select-none">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
              <Coins className="w-4 h-4 text-amber-400" />
            </div>
            <h2 className="text-sm font-semibold text-white">Token Allocation</h2>
          </div>
          <div className="bg-amber-500/5 border border-amber-500/15 rounded-xl p-4 flex items-start gap-3">
            <Clock className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-amber-300 font-medium mb-1">On Hold</p>
              <p className="text-xs text-amber-300/60 leading-relaxed">
                Token allocation is being reviewed. This section will be enabled in a future update once the commercial model is finalised.
              </p>
            </div>
          </div>
        </div>

        {/* Internal Notes */}
        <div className="glass-card rounded-2xl p-6">
          <label className="block text-xs font-medium text-white/50 mb-1.5 uppercase tracking-wider">
            Internal Notes (optional)
          </label>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3}
            placeholder="Any internal notes about this client…"
            className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#0763d8]/60 resize-none" />
        </div>

        <div className="flex justify-end gap-3">
          <Link href="/admin/clients"
            className="px-5 py-2.5 rounded-xl text-sm text-white/50 hover:text-white border border-white/[0.08] hover:border-white/20 transition-all">
            Cancel
          </Link>
          <button type="submit" disabled={isSubmitting}
            className="px-6 py-2.5 bg-white text-black font-semibold rounded-xl text-sm hover:bg-white/90 transition-colors disabled:opacity-60 flex items-center gap-2">
            {isSubmitting ? (
              <><span className="w-3.5 h-3.5 border-2 border-black/30 border-t-black rounded-full animate-spin" /> {isEditMode ? "Saving…" : "Creating…"}</>
            ) : (
              <><Save className="w-4 h-4" /> {isEditMode ? "Save Changes" : "Create Client Company"}</>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
