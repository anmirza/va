"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { AuthGuard } from "@/components/auth-guard";
import { Header } from "@/components/header";
import {
  getClientCompanyByUserIdFS,
  getOrgsByTypeFS,
  deductClientTokenFS,
} from "@/lib/admin-firestore";
import type { ClientCompany, OrgRecord } from "@/lib/admin-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Building2,
  Search,
  Phone,
  AlertTriangle,
  CreditCard,
  ChevronRight,
  MapPin,
  Globe,
  Users,
  ExternalLink,
  Zap,
} from "lucide-react";
import toast from "react-hot-toast";

function ClientDashboardContent() {
  const { user } = useAuth();
  const router = useRouter();

  const [company, setCompany] = useState<ClientCompany | null>(null);
  const [agencies, setAgencies] = useState<OrgRecord[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState<OrgRecord[] | null>(null);

  useEffect(() => {
    if (user?.role !== "client") {
      router.replace("/dashboard");
      return;
    }
    async function load() {
      setLoading(true);
      const [comp, orgs] = await Promise.all([
        user?.id ? getClientCompanyByUserIdFS(user.id) : null,
        getOrgsByTypeFS("agency"),
      ]);
      setCompany(comp);
      setAgencies(orgs);
      setLoading(false);
    }
    if (user?.id) load();
  }, [user, router]);

  const remaining = company
    ? (company.tokens ?? 0) - (company.tokensUsed ?? 0)
    : 0;
  const creditsExhausted = company !== null && remaining <= 0;

  const handleSearch = async () => {
    if (!query.trim()) return;
    if (creditsExhausted) {
      toast.error("No credits remaining. Please contact VA Consulting.");
      return;
    }
    if (!company) return;
    setSearching(true);
    // Deduct one token for the search
    const ok = await deductClientTokenFS(company.id);
    if (!ok) {
      toast.error("Could not deduct credit. Please try again.");
      setSearching(false);
      return;
    }
    // Reload company to get updated token count
    const { getClientCompanyByIdFS } = await import("@/lib/admin-firestore");
    const updated = await getClientCompanyByIdFS(company.id);
    if (updated) setCompany(updated);

    const filtered = agencies.filter(
      (a) =>
        a.name.toLowerCase().includes(query.toLowerCase()) ||
        a.country?.toLowerCase().includes(query.toLowerCase()) ||
        a.city?.toLowerCase().includes(query.toLowerCase()),
    );
    setResults(filtered);
    setSearching(false);
    toast.success("1 credit used for this search.");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#02030E] flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-[#0763d8] border-t-transparent rounded-full animate-spin" />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#02030E] flex flex-col">
      <Header />
      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-10 max-w-5xl mx-auto w-full">
        {/* Greeting */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 rounded-xl bg-[#0763d8] flex items-center justify-center text-white font-bold text-xl shrink-0">
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">
              Welcome, {user?.name}
            </h1>
            {company && (
              <p className="text-white/50 text-sm mt-0.5">{company.name}</p>
            )}
          </div>
        </div>

        {/* Credits exhausted banner */}
        {creditsExhausted && (
          <div className="flex items-center gap-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl px-6 py-4 mb-8">
            <AlertTriangle className="w-6 h-6 text-amber-400 shrink-0" />
            <div className="flex-1">
              <p className="text-amber-300 font-semibold text-sm">
                Your programme credits have been used up.
              </p>
              <p className="text-amber-300/70 text-sm mt-0.5">
                Contact VA Consulting to extend your programme.
              </p>
            </div>
            <a
              href="mailto:info@va-consulting.com"
              className="shrink-0 px-4 py-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-sm font-medium rounded-xl border border-amber-500/30 transition-colors"
            >
              Contact Us
            </a>
          </div>
        )}

        {/* Credit bar */}
        {company && (
          <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#0763d8]/20 flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-[#0763d8]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">
                    Agency Search Credits
                  </p>
                  <p className="text-xs text-white/40">
                    Each search uses 1 credit from your package
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p
                  className={`text-2xl font-bold ${remaining <= 0 ? "text-red-400" : remaining <= 2 ? "text-amber-400" : "text-white"}`}
                >
                  {remaining}
                </p>
                <p className="text-xs text-white/40">
                  of {company.tokens} remaining
                </p>
              </div>
            </div>
            {/* Progress bar */}
            <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${remaining <= 0 ? "bg-red-500" : remaining <= 2 ? "bg-amber-400" : "bg-[#0763d8]"}`}
                style={{
                  width:
                    company.tokens > 0
                      ? `${(remaining / company.tokens) * 100}%`
                      : "0%",
                }}
              />
            </div>

            {/* Company scope */}
            <div className="flex flex-wrap gap-4 mt-5 pt-5 border-t border-white/[0.06] text-xs text-white/40">
              {company.holdingCompany && (
                <span className="flex items-center gap-1.5">
                  <Building2 className="w-3 h-3" /> {company.holdingCompany}
                </span>
              )}
              {company.region && (
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3 h-3" /> {company.region}
                </span>
              )}
              {company.country && (
                <span className="flex items-center gap-1.5">
                  <Globe className="w-3 h-3" /> {company.country}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Search */}
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6 mb-8">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-xl bg-[#0763d8]/20 flex items-center justify-center">
              <Search className="w-5 h-5 text-[#0763d8]" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">
                Agency Search & Selection
              </p>
              <p className="text-xs text-white/40">
                Search by name, country or city. 1 credit per search.
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="Search agencies by name, country, city..."
                className="pl-10 h-11 bg-white/[0.03] border-white/[0.08] text-white rounded-xl focus:border-[#0763d8]/50"
                disabled={creditsExhausted}
              />
            </div>
            <Button
              onClick={handleSearch}
              disabled={creditsExhausted || searching || !query.trim()}
              className="h-11 bg-[#0763d8] hover:bg-[#0655b3] text-white rounded-xl px-6 gap-2 shadow-lg shadow-[#0763d8]/20"
            >
              {searching ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Zap className="w-4 h-4" /> Search
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Results */}
        {results !== null && (
          <div>
            <p className="text-sm text-white/50 mb-4">
              {results.length} result{results.length !== 1 ? "s" : ""} for
              &ldquo;{query}&rdquo;
            </p>
            {results.length === 0 ? (
              <div className="text-center py-16 text-white/30">
                <Building2 className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p>No agencies found for your search.</p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {results.map((agency) => (
                  <Link
                    key={agency.id}
                    href={`/directory/${agency.id}`}
                    className="group bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] hover:border-[#0763d8]/30 rounded-2xl p-5 transition-all"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#0763d8]/10 border border-[#0763d8]/20 flex items-center justify-center shrink-0">
                          <Building2 className="w-5 h-5 text-[#0763d8]" />
                        </div>
                        <div>
                          <p className="font-semibold text-white text-sm group-hover:text-[#0763d8] transition-colors">
                            {agency.name}
                          </p>
                          {(agency.city || agency.country) && (
                            <p className="text-xs text-white/40 mt-0.5 flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {[agency.city, agency.country]
                                .filter(Boolean)
                                .join(", ")}
                            </p>
                          )}
                        </div>
                      </div>
                      <ExternalLink className="w-4 h-4 text-white/20 group-hover:text-[#0763d8] transition-colors shrink-0 mt-0.5" />
                    </div>
                    {agency.memberCount !== undefined && (
                      <div className="mt-3 pt-3 border-t border-white/[0.06] flex items-center gap-1.5 text-xs text-white/30">
                        <Users className="w-3 h-3" />
                        {agency.memberCount} member
                        {agency.memberCount !== 1 ? "s" : ""}
                      </div>
                    )}
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {/* No company assigned */}
        {!company && !loading && (
          <div className="text-center py-20 text-white/30">
            <Building2 className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p className="font-medium">No company assigned to your account.</p>
            <p className="text-sm mt-2">
              Please contact VA Consulting to complete your account setup.
            </p>
            <a
              href="mailto:info@va-consulting.com"
              className="inline-flex items-center gap-2 mt-6 px-5 py-2.5 bg-[#0763d8]/10 hover:bg-[#0763d8]/20 text-[#0763d8] text-sm font-medium rounded-xl border border-[#0763d8]/20 transition-colors"
            >
              <Phone className="w-4 h-4" /> Contact VA Consulting
            </a>
          </div>
        )}
      </main>
    </div>
  );
}

export default function ClientDashboardPage() {
  return (
    <AuthGuard>
      <ClientDashboardContent />
    </AuthGuard>
  );
}
