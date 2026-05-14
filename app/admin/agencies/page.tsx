"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { OrgRecord } from "@/lib/admin-store";
import {
  getOrgsByTypeFS,
  removeOrgFS,
  updateOrgFS,
} from "@/lib/admin-firestore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import toast from "react-hot-toast";
import {
  Building2,
  Plus,
  Search,
  Trash2,
  Users,
  MapPin,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  Mail,
} from "lucide-react";
import { CategoryIcon } from "@/components/category-icon";

function OrgStatusBadge({ status }: { status: OrgRecord["status"] }) {
  const map: Record<string, string> = {
    active: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
    pending: "bg-amber-500/10 border-amber-500/20 text-amber-400",
    rejected: "bg-red-500/10 border-red-500/20 text-red-400",
    removed: "bg-white/[0.04] border-white/[0.1] text-white/30",
  };
  const labels: Record<string, string> = {
    active: "Active",
    pending: "Pending",
    rejected: "Rejected",
    removed: "Removed",
  };
  const icons: Record<string, React.ElementType> = {
    active: CheckCircle2,
    pending: Clock,
    rejected: AlertCircle,
    removed: AlertCircle,
  };
  const Icon = icons[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${map[status]}`}
    >
      <Icon className="w-3 h-3" />
      {labels[status]}
    </span>
  );
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function AgenciesPage() {
  const { user } = useAuth();
  const [orgs, setOrgs] = useState<OrgRecord[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [removeTarget, setRemoveTarget] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    const data = await getOrgsByTypeFS("agency");
    setOrgs(data);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = orgs.filter(
    (o) =>
      !search ||
      o.name.toLowerCase().includes(search.toLowerCase()) ||
      (o.country ?? "").toLowerCase().includes(search.toLowerCase()),
  );

  const handleRemoveConfirm = async () => {
    if (!removeTarget) return;
    await removeOrgFS(removeTarget.id, user?.id ?? "admin");
    toast.success(`"${removeTarget.name}" has been removed.`);
    setRemoveTarget(null);
    load();
  };

  const handleFollowUp = async (id: string, name: string) => {
    await updateOrgFS(
      id,
      { lastFollowUpAt: new Date().toISOString() },
      user?.id ?? "admin",
    );
    toast.success(`Follow-up logged for ${name}.`);
  };

  return (
    <div className="max-w-5xl">
      <AlertDialog
        open={!!removeTarget}
        onOpenChange={(open) => !open && setRemoveTarget(null)}
      >
        <AlertDialogContent className="bg-[#0a0b1a] border border-white/10">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">
              Remove Agency
            </AlertDialogTitle>
            <AlertDialogDescription className="text-white/60">
              Are you sure you want to remove &quot;{removeTarget?.name}&quot;?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-white/10 text-white/60 hover:text-white">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRemoveConfirm}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-6 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Agencies</h1>
          <p className="text-white/40 text-sm">
            Manage all registered advertising agencies.
          </p>
        </div>
        <Link href="/admin/agencies/create">
          <Button className="h-10 bg-[#0763d8] hover:bg-[#0655b3] text-white rounded-xl gap-2">
            <Plus className="w-4 h-4" /> Add Agency
          </Button>
        </Link>
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or country..."
          className="pl-9 h-10 bg-white/[0.04] border-white/[0.1] text-white placeholder:text-white/30 rounded-xl"
        />
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="glass-card rounded-2xl p-16 text-center">
          <Building2 className="w-10 h-10 text-white/20 mx-auto mb-3" />
          <p className="text-white/40 text-sm">
            {search
              ? "No agencies match your search."
              : "No agencies registered yet."}
          </p>
          <p className="text-white/20 text-xs mt-1 mb-4">
            Create one manually or approve a pending registration.
          </p>
          <Link href="/admin/agencies/create">
            <Button
              size="sm"
              className="bg-[#0763d8] hover:bg-[#0655b3] text-white rounded-xl"
            >
              <Plus className="w-3.5 h-3.5 mr-1.5" /> Add Agency
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {filtered.map((org) => (
            <div
              key={org.id}
              className="glass-card rounded-2xl p-5 flex items-center gap-4 group hover:border-white/20 transition-all"
            >
              {/* Avatar */}
              <div className="w-12 h-12 rounded-xl bg-[#0763d8]/10 border border-[#0763d8]/20 flex items-center justify-center shrink-0">
                <CategoryIcon
                  categoryName={org.category || "Agency"}
                  defaultIcon={Building2}
                  className="w-6 h-6 text-[#0763d8]"
                />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <p className="font-semibold text-white truncate">
                    {org.name}
                  </p>
                  <OrgStatusBadge status={org.status} />
                </div>
                <div className="flex items-center gap-4 text-xs text-white/40 flex-wrap">
                  {org.city && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {org.city}{org.country ? `, ${org.country}` : ""}
                    </span>
                  )}
                  {!org.city && org.country && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {org.country}
                    </span>
                  )}
                  {org.category && <span>{org.category}</span>}
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    {org.memberCount} member{org.memberCount !== 1 ? "s" : ""}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    Added {formatDate(org.createdAt)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Updated:{" "}
                    {org.latestUpdateAt
                      ? formatDate(org.latestUpdateAt)
                      : "Never"}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleFollowUp(org.id, org.name)}
                  className="px-2 py-1.5 flex items-center gap-1.5 rounded-lg border border-[#0763d8]/20 bg-[#0763d8]/10 text-[#0763d8] hover:bg-[#0763d8]/20 transition-colors text-xs font-semibold"
                  title="Send Profile Follow-up Request"
                >
                  <Mail className="w-3 h-3" /> Follow-up
                </button>
                <Link href={`/admin/agencies/create?edit=${org.id}`}>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 border-white/[0.1] text-white/60 hover:text-white rounded-lg text-xs"
                  >
                    Edit
                  </Button>
                </Link>
                <button
                  onClick={() =>
                    setRemoveTarget({ id: org.id, name: org.name })
                  }
                  className="p-2 rounded-lg text-white/30 hover:text-red-400 hover:bg-red-400/[0.08] transition-colors"
                  title="Remove agency"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
