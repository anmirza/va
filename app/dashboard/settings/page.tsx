"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { AuthGuard } from "@/components/auth-guard";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User, Lock, Bell, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

function SettingsContent() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<
    "account" | "password" | "notifications"
  >("account");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const TABS = [
    { id: "account", label: "Account", icon: User },
    { id: "password", label: "Password", icon: Lock },
    { id: "notifications", label: "Notifications", icon: Bell },
  ] as const;

  /* Theme-aware card/sidebar styling uses CSS variables
     so the page works in BOTH dark and light mode */
  const cardCls = "bg-card border border-border rounded-lg p-6";
  const labelCls = "block text-sm font-medium text-muted-foreground mb-1.5";

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="bg-[#0C0D17] px-4 sm:px-6 lg:px-8 py-10">
          <div className="max-w-4xl mx-auto">
            <Link
              href="/dashboard"
              className="text-sm text-white/60 hover:text-white mb-2 block"
            >
              ← Dashboard
            </Link>
            <h1 className="text-2xl font-bold text-white">Account Settings</h1>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row gap-8">
            {/* Sidebar */}
            <aside className="sm:w-52 shrink-0">
              <nav className="bg-card border border-border rounded-lg overflow-hidden">
                {TABS.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-3 w-full px-4 py-3 text-sm transition-colors border-b border-border last:border-0 ${activeTab === tab.id ? "bg-secondary text-foreground font-medium" : "text-muted-foreground hover:bg-muted"}`}
                    >
                      <Icon className="w-4 h-4" />
                      {tab.label}
                    </button>
                  );
                })}
              </nav>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 mt-4 px-4 py-3 text-sm text-red-500 hover:text-red-400 w-full"
              >
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </aside>

            {/* Content */}
            <div className="flex-1">
              {activeTab === "account" && (
                <div className={cardCls}>
                  <h2 className="font-bold text-foreground mb-6">
                    Account Information
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className={labelCls}>Full Name</label>
                      <Input defaultValue={user?.name} className="h-11" />
                    </div>
                    <div>
                      <label className={labelCls}>Email Address</label>
                      <Input
                        type="email"
                        defaultValue={user?.email}
                        className="h-11"
                      />
                    </div>
                    <div>
                      <label className={labelCls}>Account Type</label>
                      <div className="px-3 py-2.5 border border-border rounded-lg bg-muted text-sm text-muted-foreground capitalize">
                        {user?.role?.replace("_", " ")}
                      </div>
                    </div>
                    {saved ? (
                      <div className="px-4 py-2.5 bg-[#0763d8]/20 text-[#0763d8] rounded-lg text-sm font-medium">
                        Changes saved!
                      </div>
                    ) : (
                      <Button
                        onClick={handleSave}
                        className="bg-[#0763d8] hover:bg-[#0655b3] text-white"
                      >
                        Save Changes
                      </Button>
                    )}
                  </div>
                </div>
              )}

              {activeTab === "password" && (
                <div className={cardCls}>
                  <h2 className="font-bold text-foreground mb-6">
                    Change Password
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className={labelCls}>Current Password</label>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        className="h-11"
                      />
                    </div>
                    <div>
                      <label className={labelCls}>New Password</label>
                      <Input
                        type="password"
                        placeholder="Min 8 characters"
                        className="h-11"
                      />
                    </div>
                    <div>
                      <label className={labelCls}>Confirm New Password</label>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        className="h-11"
                      />
                    </div>
                    <Button className="bg-[#2e3843] hover:bg-[#3d4f5e] text-white">
                      Update Password
                    </Button>
                  </div>
                </div>
              )}

              {activeTab === "notifications" && (
                <div className={cardCls}>
                  <h2 className="font-bold text-foreground mb-6">
                    Notification Preferences
                  </h2>
                  <div className="space-y-4">
                    {[
                      {
                        label: "New insights",
                        desc: "When someone see your agency or profile",
                      },
                      {
                        label: "Industry news",
                        desc: "Weekly digest of top industry news",
                      },
                      {
                        label: "New campaigns from followed agencies",
                        desc: "Get notified when agencies you follow add new work",
                      },
                      {
                        label: "Award show results",
                        desc: "Results from Cannes, D&AD, One Show and more",
                      },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className="flex items-start justify-between gap-4 py-3 border-b border-border last:border-0"
                      >
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            {item.label}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {item.desc}
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            defaultChecked
                            className="sr-only peer"
                          />
                          <div className="w-10 h-6 bg-secondary peer-checked:bg-[#0763d8] rounded-full transition-colors peer-focus:ring-2 peer-focus:ring-[#0763d8]/20 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-4" />
                        </label>
                      </div>
                    ))}
                    <Button className="bg-[#0763d8] hover:bg-[#0655b3] text-white">
                      Save Preferences
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <AuthGuard>
      <SettingsContent />
    </AuthGuard>
  );
}
