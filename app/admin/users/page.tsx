"use client";

import { useEffect, useState } from "react";
import { getAllUsersFS, updateUserStatusFS } from "@/lib/admin-firestore";
import { useAuth } from "@/lib/auth-context";
import type { User } from "@/lib/mock-data";
import {
  Shield,
  Users,
  Crown,
  User as UserIcon,
  Search,
  Filter,
  UserX,
  UserCheck,
} from "lucide-react";
import toast from "react-hot-toast";

const ROLE_LABELS: Record<string, string> = {
  super_admin: "Super Admin",
  admin: "Admin",
  moderator: "Moderator",
  vendor: "Vendor",
  client: "Client",
  talent: "Talent",
  agency_owner: "Agency Owner",
  production: "Production",
  user: "User",
};

const ROLE_COLORS: Record<string, string> = {
  super_admin: "bg-amber-500/10 border-amber-500/20 text-amber-400",
  admin: "bg-[#0763d8]/10 border-[#0763d8]/20 text-[#0763d8]",
  moderator: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
  vendor: "bg-white/[0.06] border-white/[0.1] text-white/60",
  client: "bg-purple-500/10 border-purple-500/20 text-purple-400",
  talent: "bg-pink-500/10 border-pink-500/20 text-pink-400",
  agency_owner: "bg-blue-500/10 border-blue-500/20 text-blue-400",
  production: "bg-indigo-500/10 border-indigo-500/20 text-indigo-400",
  user: "bg-white/[0.04] border-white/[0.08] text-white/40",
};

const ROLE_ICONS: Record<string, React.ElementType> = {
  super_admin: Crown,
  admin: Shield,
  moderator: Users,
  vendor: UserIcon,
  client: UserIcon,
  talent: UserIcon,
  agency_owner: UserIcon,
  production: UserIcon,
  user: UserIcon,
};

export default function UsersPage() {
  const { user: currentUser } = useAuth();
  const isSuperAdmin = currentUser?.role === "super_admin";

  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [accountTypeFilter, setAccountTypeFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  const load = () => {
    getAllUsersFS().then((data) => {
      setAllUsers(data as User[]);
      setIsLoading(false);
    });
  };

  useEffect(() => {
    load();
  }, []);

  const filteredUsers = allUsers.filter((u) => {
    if (
      query &&
      !u.name?.toLowerCase().includes(query.toLowerCase()) &&
      !u.email?.toLowerCase().includes(query.toLowerCase())
    )
      return false;
    if (roleFilter !== "all" && u.role !== roleFilter) return false;
    if (accountTypeFilter !== "all" && u.accountType !== accountTypeFilter)
      return false;
    return true;
  });

  const handleToggleStatus = async (u: User) => {
    const newStatus = u.status === "suspended" ? "active" : "suspended";
    await updateUserStatusFS(u.id, newStatus);
    toast.success(
      `${u.name} ${newStatus === "suspended" ? "suspended" : "restored"}.`,
    );
    load();
  };

  return (
    <div className="max-w-5xl">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Users</h1>
          <p className="text-white/40 text-sm">
            View and manage all registered platform users.
          </p>
        </div>
      </div>

      <div className="glass-card rounded-2xl overflow-hidden mb-6">
        <div className="flex flex-wrap items-center gap-4 px-5 py-4 border-b border-white/[0.06] bg-white/[0.01]">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-black/20 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder:text-white/30 focus:border-white/30 outline-none transition-colors"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-white/30" />
            <select
              value={accountTypeFilter}
              onChange={(e) => setAccountTypeFilter(e.target.value)}
              className="bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none cursor-pointer"
            >
              <option value="all">All Account Types</option>
              <option value="vendor">Vendor</option>
              <option value="client">Client</option>
            </select>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none cursor-pointer"
            >
              <option value="all">All Roles</option>
              {Object.entries(ROLE_LABELS).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Table header */}
        <div
          className={`hidden md:grid gap-4 px-5 py-3 border-b border-white/[0.06] text-xs font-medium text-white/30 uppercase tracking-widest bg-white/[0.01] ${isSuperAdmin ? "grid-cols-[1fr_160px_100px_120px_80px]" : "grid-cols-[1fr_160px_100px_120px]"}`}
        >
          <span>User</span>
          <span>Account Type</span>
          <span>Status</span>
          <span>Role</span>
          {isSuperAdmin && <span>Actions</span>}
        </div>

        <div className="divide-y divide-white/[0.04]">
          {filteredUsers.map((u) => {
            const Icon = ROLE_ICONS[u.role] ?? UserIcon;
            const isSuspended = u.status === "suspended";
            const isSelf = u.id === currentUser?.id;
            return (
              <div
                key={u.id}
                className={`flex items-center gap-4 px-5 py-4 hover:bg-white/[0.02] transition-colors ${isSuspended ? "opacity-60" : ""}`}
              >
                <div
                  className={`md:grid md:gap-4 md:items-center flex-1 min-w-0 ${isSuperAdmin ? "md:grid-cols-[1fr_160px_100px_120px_80px]" : "md:grid-cols-[1fr_160px_100px_120px]"}`}
                >
                  {/* Name + email */}
                  <div className="flex items-center gap-3 min-w-0">
                    {u.avatar ? (
                      <img
                        src={u.avatar}
                        alt=""
                        className="w-9 h-9 rounded-xl object-cover shrink-0"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-xl bg-white/[0.06] flex items-center justify-center text-white/40 font-bold text-sm shrink-0">
                        {u.name[0]?.toUpperCase()}
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="font-medium text-white text-sm truncate">
                        {u.name}
                      </p>
                      <p className="text-xs text-white/40 truncate">
                        {u.email}
                      </p>
                    </div>
                  </div>

                  {/* Account type */}
                  <div className="hidden md:block">
                    <p className="text-sm text-white/60 capitalize">
                      {u.accountType ?? "—"}
                    </p>
                  </div>

                  {/* Status */}
                  <div className="hidden md:block">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs border ${
                        isSuspended
                          ? "bg-red-500/10 border-red-500/20 text-red-400"
                          : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                      }`}
                    >
                      {isSuspended ? "Suspended" : "Active"}
                    </span>
                  </div>

                  {/* Role */}
                  <div className="hidden md:block">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${ROLE_COLORS[u.role] ?? "bg-white/[0.04] border-white/[0.08] text-white/40"}`}
                    >
                      <Icon className="w-3 h-3" />
                      {ROLE_LABELS[u.role] ?? u.role}
                    </span>
                  </div>

                  {/* Actions — super admin only, cannot act on self */}
                  {isSuperAdmin && (
                    <div className="hidden md:flex items-center">
                      {!isSelf && (
                        <button
                          onClick={() => handleToggleStatus(u)}
                          title={
                            isSuspended ? "Restore access" : "Revoke access"
                          }
                          className={`p-2 rounded-lg transition-colors ${
                            isSuspended
                              ? "text-emerald-400/60 hover:text-emerald-400 hover:bg-emerald-400/10"
                              : "text-white/30 hover:text-red-400 hover:bg-red-400/10"
                          }`}
                        >
                          {isSuspended ? (
                            <UserCheck className="w-4 h-4" />
                          ) : (
                            <UserX className="w-4 h-4" />
                          )}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          {filteredUsers.length === 0 && (
            <div className="px-5 py-8 text-center text-white/40 text-sm">
              No users found matching your filters.
            </div>
          )}
        </div>
      </div>

      <p className="text-xs text-white/20 mt-4">
        Showing {filteredUsers.length} of {allUsers.length} registered users.
        {isSuperAdmin && (
          <span className="ml-2 text-amber-400/50">
            Super admin: click the icon to revoke or restore access.
          </span>
        )}
      </p>
    </div>
  );
}
