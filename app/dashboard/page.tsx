"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { useFollow } from "@/lib/follow-context";
import { AuthGuard } from "@/components/auth-guard";
import { Header } from "@/components/header";
import { companies, campaigns } from "@/lib/mock-data";
import {
  Building2,
  Film,
  Settings,
  LayoutDashboard,
  Heart,
  Bookmark,
  ChevronRight,
  Lock,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

function DashboardContent() {
  const { user } = useAuth();
  const { followed } = useFollow();
  const router = useRouter();

  // Vendors get their own dedicated dashboard
  useEffect(() => {
    if (user?.accountType === "vendor") {
      router.replace("/dashboard/vendor");
    }
  }, [user, router]);

  // Clients get their own dedicated dashboard
  useEffect(() => {
    if (user?.role === "client" || user?.accountType === "client") {
      router.replace("/dashboard/client");
    }
  }, [user, router]);

  // Users who have not yet classified get sent to classify
  useEffect(() => {
    if (user && !user.accountType) {
      router.replace("/signup/classify");
    }
  }, [user, router]);

  const followedAgencies = companies.filter((c) =>
    followed.agencies.includes(c.id),
  );
  const savedCampaigns = campaigns.filter((c) =>
    followed.campaigns.includes(c.id),
  );

  const isFreeTier = user?.accountType === "client" && user?.tier === "free";
  const isPaidTier = user?.accountType === "client" && user?.tier === "paid";

  return (
    <div className="min-h-screen bg-[#02030E] flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Page header */}
        <div className="border-b border-white/[0.06] px-4 sm:px-6 lg:px-8 py-10">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-4">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt=""
                  className="w-14 h-14 rounded-xl object-cover border-2 border-[#0763d8]"
                />
              ) : (
                <div className="w-14 h-14 rounded-xl bg-[#0763d8] flex items-center justify-center text-white font-bold text-xl">
                  {user?.name?.[0]?.toUpperCase()}
                </div>
              )}
              <div>
                <h1 className="text-2xl font-bold text-white">
                  Welcome back, {user?.name}
                </h1>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-[#0763d8] text-sm capitalize">
                    Client Account
                  </p>
                  {isFreeTier && (
                    <span className="text-xs bg-white/[0.06] text-white/40 border border-white/[0.08] rounded-full px-2 py-0.5">
                      Free Plan
                    </span>
                  )}
                  {isPaidTier && (
                    <span className="text-xs bg-[#0763d8]/20 text-[#0763d8] border border-[#0763d8]/30 rounded-full px-2 py-0.5">
                      Pro Plan
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Quick Actions */}
              <div>
                <h2 className="text-xl font-bold text-white mb-4">
                  Quick Actions
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Link
                    href="/directory"
                    className="group glass-card p-5 flex items-start gap-4 hover:border-[#0763d8]/30 transition-all rounded-xl"
                  >
                    <div className="w-10 h-10 bg-[#0763d8]/10 rounded-lg flex items-center justify-center shrink-0">
                      <Building2 className="w-5 h-5 text-[#0763d8]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-white group-hover:text-[#0763d8] transition-colors">
                        Browse Directory
                      </p>
                      <p className="text-xs text-white/30 mt-0.5">
                        Discover agencies and production houses
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-white/10 shrink-0 self-center group-hover:text-[#0763d8] transition-colors" />
                  </Link>

                  <Link
                    href="/creative-library"
                    className="group glass-card p-5 flex items-start gap-4 hover:border-[#0763d8]/30 transition-all rounded-xl"
                  >
                    <div className="w-10 h-10 bg-[#0763d8]/10 rounded-lg flex items-center justify-center shrink-0">
                      <Film className="w-5 h-5 text-[#0763d8]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-white group-hover:text-[#0763d8] transition-colors">
                        Creative Library
                      </p>
                      <p className="text-xs text-white/30 mt-0.5">
                        Explore award-winning campaigns
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-white/10 shrink-0 self-center group-hover:text-[#0763d8] transition-colors" />
                  </Link>

                  <Link
                    href="/dashboard/settings"
                    className="group glass-card p-5 flex items-start gap-4 hover:border-[#0763d8]/30 transition-all rounded-xl"
                  >
                    <div className="w-10 h-10 bg-[#0763d8]/10 rounded-lg flex items-center justify-center shrink-0">
                      <Settings className="w-5 h-5 text-[#0763d8]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-white group-hover:text-[#0763d8] transition-colors">
                        Account Settings
                      </p>
                      <p className="text-xs text-white/30 mt-0.5">
                        Manage your profile and preferences
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-white/10 shrink-0 self-center group-hover:text-[#0763d8] transition-colors" />
                  </Link>

                  {/* Locked for free tier */}
                  {isFreeTier ? (
                    <div className="relative glass-card p-5 flex items-start gap-4 rounded-xl opacity-60 cursor-not-allowed overflow-hidden">
                      <div className="absolute inset-0 bg-[#02030E]/30 backdrop-blur-[1px] flex items-center justify-center">
                        <div className="flex items-center gap-2 bg-[#02030E]/80 border border-white/[0.1] rounded-xl px-4 py-2">
                          <Lock className="w-3.5 h-3.5 text-[#0763d8]" />
                          <span className="text-xs text-[#0763d8] font-medium">
                            Coming Soon
                          </span>
                        </div>
                      </div>
                      <div className="w-10 h-10 bg-white/[0.04] rounded-lg flex items-center justify-center shrink-0">
                        <LayoutDashboard className="w-5 h-5 text-white/20" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-white/50">Insights</p>
                        <p className="text-xs text-white/20 mt-0.5">
                          Market insights & analytics
                        </p>
                      </div>
                    </div>
                  ) : (
                    <Link
                      href="/insights"
                      className="group glass-card p-5 flex items-start gap-4 hover:border-[#0763d8]/30 transition-all rounded-xl"
                    >
                      <div className="w-10 h-10 bg-[#0763d8]/10 rounded-lg flex items-center justify-center shrink-0">
                        <LayoutDashboard className="w-5 h-5 text-[#0763d8]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-white group-hover:text-[#0763d8] transition-colors">
                          Insights
                        </p>
                        <p className="text-xs text-white/30 mt-0.5">
                          Market insights & analytics
                        </p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-white/10 shrink-0 self-center group-hover:text-[#0763d8] transition-colors" />
                    </Link>
                  )}
                </div>
              </div>

              {/* Saved Campaigns */}
              {savedCampaigns.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                      <Bookmark className="w-5 h-5 text-[#0763d8]" /> Saved
                      Campaigns
                    </h2>
                    <Link
                      href="/creative-library"
                      className="text-sm text-[#0763d8] hover:underline"
                    >
                      View all
                    </Link>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {savedCampaigns.slice(0, 3).map((c) => (
                      <Link
                        key={c.id}
                        href={`/campaigns/${c.id}`}
                        className="group glass-card overflow-hidden hover:border-[#0763d8]/30 transition-all rounded-xl"
                      >
                        <img
                          src={c.thumbnail}
                          alt=""
                          className="w-full h-28 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="p-3">
                          <p className="text-sm font-medium text-white line-clamp-1">
                            {c.title}
                          </p>
                          <p className="text-xs text-white/30">{c.brand}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Followed agencies */}
              <div className="glass-card p-6 rounded-xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-white flex items-center gap-2">
                    <Heart className="w-4 h-4 text-[#0763d8]" /> Following
                  </h3>
                  <Link
                    href="/directory"
                    className="text-xs text-[#0763d8] hover:underline"
                  >
                    Browse
                  </Link>
                </div>
                {followedAgencies.length > 0 ? (
                  <div className="space-y-3">
                    {followedAgencies.slice(0, 5).map((c) => (
                      <Link
                        key={c.id}
                        href={`/directory/${c.id}`}
                        className="flex items-center gap-3 group"
                      >
                        <div className="w-8 h-8 bg-white/[0.06] rounded-lg flex items-center justify-center text-white/50 font-bold text-xs shrink-0">
                          {c.name[0]}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-white group-hover:text-[#0763d8] transition-colors truncate">
                            {c.name}
                          </p>
                          <p className="text-xs text-white/30">{c.city}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-sm text-white/30 mb-3">
                      Not following any agencies yet
                    </p>
                    <Link href="/directory">
                      <Button
                        size="sm"
                        className="bg-[#0763d8] hover:bg-[#0655b3] text-white text-xs rounded-full"
                      >
                        Discover Agencies
                      </Button>
                    </Link>
                  </div>
                )}
              </div>

              {/* Plan card */}
              <div className="glass-card p-6 rounded-xl">
                <div className="flex items-center gap-3 mb-3">
                  <LayoutDashboard className="w-5 h-5 text-[#0763d8]" />
                  <h3 className="font-bold text-white">Your Plan</h3>
                </div>
                {isFreeTier ? (
                  <>
                    <p className="text-white/50 text-sm mb-1">
                      You are on the{" "}
                      <span className="text-white font-medium">Free</span> plan.
                    </p>
                    <p className="text-white/30 text-xs mb-4">
                      Upgrade to access full company profiles, governance data,
                      financials, and more.
                    </p>
                    <Link href="/pricing">
                      <Button className="w-full bg-[#0763d8] hover:bg-[#0655b3] text-white font-medium text-sm rounded-full gap-2">
                        Upgrade to Pro <ArrowRight className="w-3.5 h-3.5" />
                      </Button>
                    </Link>
                  </>
                ) : (
                  <>
                    <p className="text-white/50 text-sm mb-4">
                      You are on the{" "}
                      <span className="text-[#0763d8] font-medium">Pro</span>{" "}
                      plan.
                    </p>
                    <Link href="/pricing">
                      <Button
                        variant="outline"
                        className="w-full border-white/[0.12] text-white/70 hover:text-white font-medium text-sm rounded-full"
                      >
                        Manage Subscription
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <AuthGuard>
      <DashboardContent />
    </AuthGuard>
  );
}
