"use client";

import { useState, useMemo, Suspense, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { CompanyCard } from "@/components/company-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { companies } from "@/lib/mock-data";
import {
  getRegionForCountry,
  getAvailableRegionsFromCompanies,
} from "@/lib/geo-data";
import {
  Search,
  Grid3x3,
  List,
  ChevronLeft,
  ChevronRight,
  X,
  Lock,
} from "lucide-react";
import { MultiSelectFilter } from "@/components/multi-select-filter";
import { useAuth } from "@/lib/auth-context";
import { getClientCompanyByUserIdFS } from "@/lib/admin-firestore";

const SERVICES = [
  "Advertising",
  "Digital",
  "Strategy",
  "Design",
  "Content",
  "Media",
  "Production",
  "Technology",
];
const INDUSTRIES = [
  "Technology",
  "Sports",
  "Luxury",
  "Automotive",
  "Finance",
  "Entertainment",
  "Retail",
  "Lifestyle",
];

// Derived at module level from mock data for performance
const ALL_COMPANY_COUNTRIES = companies
  .map((c) => c.country)
  .filter(Boolean) as string[];
const ALL_COMPANY_REGIONS = getAvailableRegionsFromCompanies(ALL_COMPANY_COUNTRIES);

function DirectoryContent() {
  const params = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(params.get("q") || "");
  const [selectedRegion, setSelectedRegion] = useState<string>(
    params.get("region") || "",
  );
  const [selectedCountry, setSelectedCountry] = useState<string>(
    params.get("country") || "",
  );
  const [selectedCities, setSelectedCities] = useState<string[]>(
    params.get("city") ? [params.get("city") as string] : [],
  );
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("name");
  const [currentPage, setCurrentPage] = useState(1);

  const { user } = useAuth();
  const isClient = user?.accountType === "client";
  const [clientTokens, setClientTokens] = useState<number | null>(null);

  useEffect(() => {
    if (isClient && user?.id) {
      getClientCompanyByUserIdFS(user.id).then((comp) => {
        if (comp) setClientTokens((comp.tokens ?? 0) - (comp.tokensUsed ?? 0));
      });
    }
  }, [isClient, user?.id]);

  const isLockedOut = isClient && user?.tier !== "free" && clientTokens === 0;

  // Sync active filter pill from URL competency param
  const competencyParam = params.get("competency");
  const activeFilterLabel = competencyParam
    ? competencyParam
        .replace(/-/g, " ")
        .replace(/\b\w/g, (l) => l.toUpperCase())
    : null;

  const itemsPerPage = 30;

  // Countries available for the Country dropdown (filtered by selected region)
  const availableCountries = useMemo(() => {
    const base = selectedRegion
      ? companies
          .filter((c) => c.country && getRegionForCountry(c.country) === selectedRegion)
          .map((c) => c.country as string)
      : ALL_COMPANY_COUNTRIES;
    return [...new Set(base)].sort();
  }, [selectedRegion]);

  // Cities available for the City multi-select (filtered by country or region)
  const availableCities = useMemo(() => {
    if (selectedCountry) {
      return [
        ...new Set(
          companies
            .filter((c) => c.country === selectedCountry)
            .map((c) => c.city),
        ),
      ].sort();
    }
    if (selectedRegion) {
      return [
        ...new Set(
          companies
            .filter(
              (c) => c.country && getRegionForCountry(c.country) === selectedRegion,
            )
            .map((c) => c.city),
        ),
      ].sort();
    }
    return [...new Set(companies.map((c) => c.city))].sort();
  }, [selectedRegion, selectedCountry]);

  const filteredCompanies = useMemo(() => {
    let results = companies;

    if (searchQuery) {
      results = results.filter(
        (c) =>
          c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.description.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    if (selectedServices.length > 0) {
      results = results.filter((c) =>
        selectedServices.some((s) => c.services.includes(s)),
      );
    }

    if (selectedIndustries.length > 0) {
      results = results.filter((c) =>
        selectedIndustries.some((s) => c.sectors.includes(s)),
      );
    }

    if (selectedCities.length > 0) {
      results = results.filter((c) => selectedCities.includes(c.city));
    } else if (selectedCountry) {
      results = results.filter((c) => c.country === selectedCountry);
    } else if (selectedRegion) {
      results = results.filter(
        (c) => c.country && getRegionForCountry(c.country) === selectedRegion,
      );
    }

    if (sortBy === "name") {
      results = [...results].sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "founded") {
      results = [...results].sort((a, b) => a.founded - b.founded);
    } else if (sortBy === "awards") {
      results = [...results].sort((a, b) => b.awards - a.awards);
    }

    return results;
  }, [searchQuery, selectedServices, selectedIndustries, selectedRegion, selectedCountry, selectedCities, sortBy]);

  const totalPages = Math.ceil(filteredCompanies.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const paginatedCompanies = filteredCompanies.slice(
    startIdx,
    startIdx + itemsPerPage,
  );

  const toggleFilter = (
    filter: string,
    setter: (items: string[]) => void,
    items: string[],
  ) => {
    setter(
      items.includes(filter)
        ? items.filter((f) => f !== filter)
        : [...items, filter],
    );
    setCurrentPage(1);
  };

  const activeFilters =
    selectedServices.length +
    selectedIndustries.length +
    (selectedRegion ? 1 : 0) +
    (selectedCountry ? 1 : 0) +
    selectedCities.length;

  const clearAllFilters = () => {
    setSelectedServices([]);
    setSelectedIndustries([]);
    setSelectedRegion("");
    setSelectedCountry("");
    setSelectedCities([]);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="px-4 sm:px-6 lg:px-8 py-12 border-b border-border bg-card/50">
          <div className="max-w-7xl mx-auto w-full">
            <div className="flex items-center gap-2 mb-4 text-sm">
              <Link
                href="/"
                className="text-muted-foreground hover:text-foreground"
              >
                Home
              </Link>
              <span className="text-muted-foreground">/</span>
              <span className="text-foreground font-medium">Directory</span>
            </div>
            <div className="flex flex-col justify-center items-center gap-2">
              <h1 className="text-4xl font-serif font-bold mb-2">
                Find Your Agencies
              </h1>
              <p className="text-muted-foreground">
                Browse {filteredCompanies.length} agencies from around the world
              </p>

              {/* Active filter pills */}
              {(activeFilterLabel || selectedRegion || selectedCountry || selectedCities.length > 0 || selectedServices.length > 0 || selectedIndustries.length > 0) && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {activeFilterLabel && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#f5d742] text-[#1a1a1a] text-xs font-semibold rounded-full">
                      {activeFilterLabel}
                    </span>
                  )}
                  {selectedRegion && (
                    <button
                      onClick={() => { setSelectedRegion(""); setSelectedCountry(""); setSelectedCities([]); setCurrentPage(1); }}
                      className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#2e3843] text-white text-xs font-semibold rounded-full hover:bg-[#1a1a1a] transition-colors"
                    >
                      {selectedRegion} <X className="w-3 h-3" />
                    </button>
                  )}
                  {selectedCountry && (
                    <button
                      onClick={() => { setSelectedCountry(""); setSelectedCities([]); setCurrentPage(1); }}
                      className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#2e3843] text-white text-xs font-semibold rounded-full hover:bg-[#1a1a1a] transition-colors"
                    >
                      {selectedCountry} <X className="w-3 h-3" />
                    </button>
                  )}
                  {selectedCities.map((city) => (
                    <button
                      key={city}
                      onClick={() => { setSelectedCities((prev) => prev.filter((c) => c !== city)); setCurrentPage(1); }}
                      className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#2e3843] text-white text-xs font-semibold rounded-full hover:bg-[#1a1a1a] transition-colors"
                    >
                      {city} <X className="w-3 h-3" />
                    </button>
                  ))}
                  {selectedServices.map((svc) => (
                    <button
                      key={svc}
                      onClick={() => { setSelectedServices((prev) => prev.filter((s) => s !== svc)); setCurrentPage(1); }}
                      className="inline-flex items-center gap-1.5 px-3 py-1 bg-card border border-[#0763d8]/30 text-foreground text-xs font-semibold rounded-full hover:bg-muted transition-colors"
                    >
                      {svc} <X className="w-3 h-3" />
                    </button>
                  ))}
                  {selectedIndustries.map((ind) => (
                    <button
                      key={ind}
                      onClick={() => { setSelectedIndustries((prev) => prev.filter((i) => i !== ind)); setCurrentPage(1); }}
                      className="inline-flex items-center gap-1.5 px-3 py-1 bg-card border border-[#0763d8]/30 text-foreground text-xs font-semibold rounded-full hover:bg-muted transition-colors"
                    >
                      {ind} <X className="w-3 h-3" />
                    </button>
                  ))}
                </div>
              )}

              {clientTokens !== null && (
                <div
                  className={`mt-6 px-4 py-3 rounded-xl border flex items-center justify-between ${
                    isLockedOut
                      ? "bg-red-500/10 border-red-500/20"
                      : "bg-emerald-500/10 border-emerald-500/20"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Lock
                      className={`w-5 h-5 ${isLockedOut ? "text-red-500" : "text-emerald-500"}`}
                    />
                    <div>
                      <p
                        className={`font-semibold ${isLockedOut ? "text-red-500" : "text-emerald-400"}`}
                      >
                        {isLockedOut
                          ? "Credits Exhausted"
                          : `${clientTokens} Credits Remaining`}
                      </p>
                      <p className="text-xs text-white/50">
                        {isLockedOut
                          ? "You must purchase more credits to view full agency profiles and continue searching."
                          : "Unlock full agency profiles, data insights, and reach out directly."}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Filter bar */}
              <div className="mt-8 w-full max-w-5xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="relative flex-1 max-w-xl">
                    <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search agencies..."
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="pl-9"
                    />
                  </div>
                </div>
                <div className="flex flex-wrap gap-3">
                  {/* Region — cascading level 1, always visible */}
                  <div className="flex items-center gap-2 bg-card border border-border rounded-lg px-3 py-2">
                    <span className="text-xs text-muted-foreground font-medium">
                      Region:
                    </span>
                    <select
                      value={selectedRegion}
                      onChange={(e) => {
                        setSelectedRegion(e.target.value);
                        setSelectedCountry("");
                        setSelectedCities([]);
                        setCurrentPage(1);
                      }}
                      className="text-sm bg-transparent focus:outline-none"
                    >
                      <option value="">All Regions</option>
                      {ALL_COMPANY_REGIONS.map((r) => (
                        <option key={r}>{r}</option>
                      ))}
                    </select>
                  </div>

                  {/* Country — level 2, only shown once a Region is picked */}
                  {selectedRegion && (
                    <div className="flex items-center gap-2 bg-card border border-border rounded-lg px-3 py-2">
                      <span className="text-xs text-muted-foreground font-medium">
                        Country:
                      </span>
                      <select
                        value={selectedCountry}
                        onChange={(e) => {
                          setSelectedCountry(e.target.value);
                          setSelectedCities([]);
                          setCurrentPage(1);
                        }}
                        className="text-sm bg-transparent focus:outline-none"
                      >
                        <option value="">All Countries</option>
                        {availableCountries.map((c) => (
                          <option key={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* City — level 3, only shown once a Country is picked (prevents endless city list) */}
                  {selectedCountry && (
                    <MultiSelectFilter
                      label="City"
                      options={availableCities}
                      selected={selectedCities}
                      onChange={(v) => { setSelectedCities(v); setCurrentPage(1); }}
                      placeholder="All Cities"
                    />
                  )}

                  {/* Service — always visible, multi-select */}
                  <MultiSelectFilter
                    label="Service"
                    options={SERVICES}
                    selected={selectedServices}
                    onChange={(v) => { setSelectedServices(v); setCurrentPage(1); }}
                    placeholder="All Services"
                  />

                  {/* Industry — always visible, multi-select */}
                  <MultiSelectFilter
                    label="Industry"
                    options={INDUSTRIES}
                    selected={selectedIndustries}
                    onChange={(v) => { setSelectedIndustries(v); setCurrentPage(1); }}
                    placeholder="All Industries"
                  />

                  {activeFilters > 0 && (
                    <button
                      onClick={clearAllFilters}
                      className="flex items-center gap-1 text-xs font-medium text-accent hover:underline px-3 py-2"
                    >
                      <X className="w-3 h-3" /> Clear filters ({activeFilters})
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-7xl mx-auto w-full">
            <div className="flex items-center justify-between mb-6">
              <div className="text-sm text-muted-foreground">
                Showing {Math.min(startIdx + 1, filteredCompanies.length)} –{" "}
                {Math.min(startIdx + itemsPerPage, filteredCompanies.length)} of{" "}
                {filteredCompanies.length}
              </div>
              <div className="flex items-center gap-4">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="text-sm border border-border rounded-lg px-3 py-2 bg-background"
                >
                  <option value="name">Sort by Name</option>
                  <option value="founded">Sort by Founded</option>
                  <option value="awards">Sort by Awards</option>
                </select>
                <div className="flex gap-2 border border-border rounded-lg p-1">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded transition-colors ${viewMode === "grid" ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:text-foreground"}`}
                  >
                    <Grid3x3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded transition-colors ${viewMode === "list" ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:text-foreground"}`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {isLockedOut ? (
              <div className="flex flex-col items-center justify-center py-24 text-center bg-card/20 rounded-2xl border border-border mt-12">
                <Lock className="w-12 h-12 text-red-500/50 mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">
                  Agency Directory Locked
                </h3>
                <p className="text-muted-foreground max-w-md bg-transparent">
                  Your company has exhausted its Agency Search & Selection
                  credits. To continue discovering and reaching out to agencies,
                  please contact your account manager to replenish your tokens.
                </p>
              </div>
            ) : paginatedCompanies.length > 0 ? (
              <>
                {viewMode === "grid" ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                    {paginatedCompanies.map((company) => (
                      <CompanyCard key={company.id} company={company} />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4 mb-12">
                    {paginatedCompanies.map((company) => (
                      <Link key={company.id} href={`/directory/${company.id}`}>
                        <div className="border border-border rounded-lg p-4 hover:bg-card/80 transition-colors group cursor-pointer">
                          <div className="flex gap-4">
                            <div className="w-16 h-16 rounded bg-muted flex-shrink-0">
                              <img
                                src={company.logo}
                                alt={company.name}
                                className="w-full h-full object-contain p-2"
                              />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-serif font-bold text-lg group-hover:text-accent transition-colors mb-1">
                                {company.name}
                              </h3>
                              <p className="text-sm text-muted-foreground mb-2 line-clamp-1">
                                {company.description}
                              </p>
                              <div className="flex gap-2 text-xs">
                                <Badge variant="outline">{company.city}</Badge>
                                <Badge variant="outline">
                                  {company.employees} employees
                                </Badge>
                                <Badge variant="outline">
                                  {company.awards} awards
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}

                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() =>
                        setCurrentPage(Math.max(1, currentPage - 1))
                      }
                      disabled={currentPage === 1}
                      className="p-2 hover:bg-muted disabled:opacity-50 rounded-lg transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <div className="flex gap-1">
                      {Array.from(
                        { length: Math.min(5, totalPages) },
                        (_, i) => {
                          const page =
                            currentPage <= 3 ? i + 1 : currentPage + i - 2;
                          return page <= totalPages ? (
                            <button
                              key={page}
                              onClick={() => setCurrentPage(page)}
                              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${page === currentPage ? "bg-accent text-accent-foreground" : "hover:bg-muted"}`}
                            >
                              {page}
                            </button>
                          ) : null;
                        },
                      )}
                    </div>
                    <button
                      onClick={() =>
                        setCurrentPage(Math.min(totalPages, currentPage + 1))
                      }
                      disabled={currentPage === totalPages}
                      className="p-2 hover:bg-muted disabled:opacity-50 rounded-lg transition-colors"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">
                  No agencies found matching your filters.
                </p>
                <Button
                  variant="outline"
                  onClick={clearAllFilters}
                >
                  Clear filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function DirectoryPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          Loading...
        </div>
      }
    >
      <DirectoryContent />
    </Suspense>
  );
}
