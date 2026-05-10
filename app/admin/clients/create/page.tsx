"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { createClientCompanyFS } from "@/lib/admin-firestore";
import { GooglePlacesAutocomplete } from "@/components/google-places-autocomplete";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  Building2,
  Globe,
  Coins,
  Info,
  Save,
  MapPin,
  Clock,
} from "lucide-react";

// ── Regional Hub dropdown values (exact match from client Slide 12) ───────────
const REGIONAL_HUBS = [
  "Global",
  "EMEA",
  "Europe",
  "Western Europe",
  "Eastern Europe",
  "Central Europe",
  "Northern Europe",
  "Southern Europe",
  "Nordics",
  "DACH",
  "Benelux",
  "Iberia",
  "UK & Ireland",
  "Mediterranean",
  "Middle East",
  "MENA",
  "Africa",
  "North Africa",
  "Sub-Saharan Africa",
  "Americas",
  "North America",
  "Latin America",
  "LATAM",
  "Central America",
  "South America",
  "Caribbean",
  "APAC",
  "Asia Pacific",
  "East Asia",
  "South Asia",
  "Southeast Asia",
  "Greater China",
  "Japan & Korea",
  "India Subcontinent",
  "ANZ",
  "Oceania",
  "Emerging Markets",
  "Developed Markets",
  "International Markets",
  "Export Markets",
  "Global Travel Retail",
  "Other",
];

// ── Operate As options (from client Slide 12 requirement #2) ─────────────────
const OPERATE_AS_OPTIONS = [
  { value: "regional_hub", label: "Regional Hub" },
  { value: "multi_country", label: "Multi Country" },
  { value: "country_company", label: "Country Company" },
];

export default function CreateClientCompanyPage() {
  const { user } = useAuth();
  const router = useRouter();

  // Section 1: Company Identity fields
  const [name, setName] = useState("");
  const [holdingCompany, setHoldingCompany] = useState("");
  const [operateAs, setOperateAs] = useState("");
  const [country, setCountry] = useState("");

  // Section 2: Company (hierarchy) fields
  const [regionalHub, setRegionalHub] = useState("");
  const [region, setRegion] = useState("");
  const [localCompany, setLocalCompany] = useState("");

  // Section 3: Address
  const [address, setAddress] = useState("");

  // Other
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const inputCls =
    "w-full h-10 bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#0763d8]/60 transition-colors";
  const selectCls =
    "w-full h-10 bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 text-sm text-white focus:outline-none focus:border-[#0763d8]/60";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Company name is required");
      return;
    }
    setIsSubmitting(true);
    try {
      const company = await createClientCompanyFS(
        {
          name: name.trim(),
          holdingCompany: holdingCompany.trim() || undefined,
          regionalHub: regionalHub.trim() || undefined,
          region: region.trim() || undefined,
          localCompany: localCompany.trim() || undefined,
          country: country.trim() || undefined,
          address: address.trim() || undefined,
          operateAs: (operateAs || undefined) as any,
          tokens: 0,
          tokensUsed: 0,
          packageSize: 6,
          status: "active",
          notes: notes.trim() || undefined,
        },
        user?.id ?? "admin",
      );
      toast.success(`"${company.name}" created successfully.`);
      router.push("/admin/clients");
    } catch {
      toast.error("Failed to create company.");
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
          <h1 className="text-2xl font-bold text-white">Add Client Company</h1>
          <p className="text-white/40 text-sm mt-0.5">
            Register a new client company with hierarchy and token allocation.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* ═══ SECTION 1: Company Identity ═══ */}
        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-8 rounded-lg bg-[#0763d8]/10 border border-[#0763d8]/20 flex items-center justify-center">
              <Building2 className="w-4 h-4 text-[#0763d8]" />
            </div>
            <h2 className="text-sm font-semibold text-white">
              Global / Holding Company
            </h2>
          </div>

          <div className="space-y-4">
            {/* 1) Company Name */}
            <div>
              <label className="block text-xs font-medium text-white/50 mb-1.5 uppercase tracking-wider">
                Company Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Coca-Cola Italy"
                className={inputCls}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* 2) Operate As */}
              <div>
                <label className="block text-xs font-medium text-white/50 mb-1.5 uppercase tracking-wider">
                  Operate As
                </label>
                <select
                  value={operateAs}
                  onChange={(e) => setOperateAs(e.target.value)}
                  className={selectCls}
                >
                  <option value="">Select type…</option>
                  {OPERATE_AS_OPTIONS.map((o) => (
                    <option
                      key={o.value}
                      value={o.value}
                      className="bg-[#0a0b1a]"
                    >
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* ═══ SECTION 2: Company (Hierarchy) ═══ */}
        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
              <Globe className="w-4 h-4 text-purple-400" />
            </div>
            <h2 className="text-sm font-semibold text-white">Company</h2>
          </div>
          <p className="text-xs text-white/30 mb-5 ml-11">
            Holding Company → Regional Hub → Region → Local Company → Country →
            Client
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* 3) Regional Hub — dropdown with 40 values */}
            <div>
              <label className="block text-xs font-medium text-white/50 mb-1.5 uppercase tracking-wider">
                Regional Hub
              </label>
              <select
                value={regionalHub}
                onChange={(e) => setRegionalHub(e.target.value)}
                className={selectCls}
              >
                <option value="">Select regional hub…</option>
                {REGIONAL_HUBS.map((r) => (
                  <option key={r} value={r} className="bg-[#0a0b1a]">
                    {r}
                  </option>
                ))}
              </select>
            </div>

            {/* Region */}
            <div>
              <label className="block text-xs font-medium text-white/50 mb-1.5 uppercase tracking-wider">
                Country
              </label>
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="e.g. Southern Europe"
                className={inputCls}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-white/50 mb-1.5 uppercase tracking-wider">
                Address (powered by google)
              </label>
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="e.g. Southern Europe"
                className={inputCls}
              />
            </div>
          </div>

          {/* Hierarchy Preview */}
          {(holdingCompany ||
            regionalHub ||
            region ||
            localCompany ||
            name) && (
            <div className="mt-5 p-4 bg-white/[0.02] border border-white/[0.05] rounded-xl">
              <p className="text-[10px] uppercase font-bold text-white/30 tracking-wider mb-3">
                Hierarchy Preview
              </p>
              <div className="space-y-1.5 text-xs">
                {[
                  {
                    label: holdingCompany,
                    tag: "HOLDING",
                    color: "bg-purple-500/20 border-purple-500/30",
                    indent: 0,
                  },
                  {
                    label: regionalHub,
                    tag: "HUB",
                    color: "bg-blue-500/20 border-blue-500/30",
                    indent: 1,
                  },
                  {
                    label: region,
                    tag: "REGION",
                    color: "bg-teal-500/20 border-teal-500/30",
                    indent: 2,
                  },
                  {
                    label: localCompany || name,
                    tag: "LOCAL",
                    color: "bg-emerald-500/20 border-emerald-500/30",
                    indent: 3,
                  },
                  {
                    label: country,
                    tag: "COUNTRY",
                    color: "bg-amber-500/20 border-amber-500/30",
                    indent: 4,
                  },
                ]
                  .filter((r) => r.label)
                  .map((r, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2"
                      style={{ paddingLeft: r.indent * 20 }}
                    >
                      <div
                        className={`w-3 h-3 rounded border shrink-0 ${r.color}`}
                      />
                      <span className="text-white/70">{r.label}</span>
                      <span className="text-white/20 text-[10px]">{r.tag}</span>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>

        {/* ═══ SECTION 3: Address (Google Maps) ═══ */}
        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center">
              <MapPin className="w-4 h-4 text-teal-400" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white">Address</h2>
              <p className="text-[10px] text-white/30 mt-0.5">
                Powered by Google Maps
              </p>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-white/50 mb-1.5 uppercase tracking-wider">
              Address
            </label>
            <GooglePlacesAutocomplete
              value={address}
              onChange={(addr) => setAddress(addr)}
              placeholder="Start typing an address…"
            />
          </div>
        </div>

        {/* ═══ SECTION 4: Token Allocation — ON HOLD ═══ */}
        <div className="glass-card rounded-2xl p-6 opacity-60 pointer-events-none select-none">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
              <Coins className="w-4 h-4 text-amber-400" />
            </div>
            <h2 className="text-sm font-semibold text-white">
              Token Allocation
            </h2>
          </div>
          <div className="bg-amber-500/5 border border-amber-500/15 rounded-xl p-4 flex items-start gap-3">
            <Clock className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-amber-300 font-medium mb-1">On Hold</p>
              <p className="text-xs text-amber-300/60 leading-relaxed">
                Token allocation is being reviewed. This section will be enabled
                in a future update once the commercial model is finalised.
              </p>
            </div>
          </div>
        </div>

        {/* ═══ Notes ═══ */}
        <div className="glass-card rounded-2xl p-6">
          <label className="block text-xs font-medium text-white/50 mb-1.5 uppercase tracking-wider">
            Internal Notes (optional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            placeholder="Any internal notes about this client…"
            className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#0763d8]/60 resize-none"
          />
        </div>

        <div className="flex justify-end gap-3">
          <Link
            href="/admin/clients"
            className="px-5 py-2.5 rounded-xl text-sm text-white/50 hover:text-white border border-white/[0.08] hover:border-white/20 transition-all"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 bg-white text-black font-semibold rounded-xl text-sm hover:bg-white/90 transition-colors disabled:opacity-60 flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-black/30 border-t-black rounded-full animate-spin" />{" "}
                Creating…
              </>
            ) : (
              <>
                <Save className="w-4 h-4" /> Create Company
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
