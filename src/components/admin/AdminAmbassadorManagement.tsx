import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserCheck, Download, Loader2 } from "lucide-react";
import AmbassadorStatsCards from "./ambassador/AmbassadorStatsCards";
import AmbassadorFilters from "./ambassador/AmbassadorFilters";
import AmbassadorDataTable from "./ambassador/AmbassadorDataTable";
import {
  useAdminAmbassadors,
  useApproveAmbassadors,
  downloadCsv,
} from "@/hooks/useAdminData";

const AdminAmbassadorManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [regionFilter, setRegionFilter] = useState("all");

  const { data: ambassadors = [], isLoading, error } = useAdminAmbassadors();
  const approve = useApproveAmbassadors();

  const regions = useMemo(
    () => [...new Set(ambassadors.map((a) => a.region).filter(Boolean))].sort(),
    [ambassadors]
  );

  const filteredAmbassadors = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return ambassadors.filter((a) => {
      const matchesSearch =
        !term ||
        a.name.toLowerCase().includes(term) ||
        a.ambassadorId.toLowerCase().includes(term) ||
        a.phone.toLowerCase().includes(term);
      const matchesStatus = statusFilter === "all" || a.status === statusFilter;
      const matchesRegion = regionFilter === "all" || a.region === regionFilter;
      return matchesSearch && matchesStatus && matchesRegion;
    });
  }, [ambassadors, searchTerm, statusFilter, regionFilter]);

  const pendingIds = filteredAmbassadors
    .filter((a) => a.status === "pending" && a.canApprove)
    .map((a) => a.id);

  const handleStatusChange = (ambassadorId: string) => {
    approve.mutate([ambassadorId]);
  };

  const handleBulkApproval = () => {
    if (pendingIds.length === 0) return;
    if (
      window.confirm(
        `Approve ${pendingIds.length} pending ambassador${pendingIds.length === 1 ? "" : "s"}?`
      )
    ) {
      approve.mutate(pendingIds);
    }
  };

  const handleExport = () => {
    downloadCsv(
      `ambassadors-${new Date().toISOString().slice(0, 10)}.csv`,
      filteredAmbassadors.map((a) => ({
        Name: a.name,
        "Ambassador ID": a.ambassadorId,
        Phone: a.phone,
        Region: a.region,
        Country: a.country,
        "Total Referrals": a.totalReferrals,
        "Active Referrals": a.activeReferrals,
        "Earnings (USD)": a.totalEarnings.toFixed(2),
        Status: a.status,
        Tier: a.tier,
        Joined: a.joinDate,
      }))
    );
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">User Management</h2>
          <p className="text-slate-400">Manage accounts. Receipt verification is required before activation.</p>
        </div>
        <div className="flex space-x-3">
          <Button
            onClick={handleBulkApproval}
            disabled={pendingIds.length === 0 || approve.isPending}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {approve.isPending ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <UserCheck className="w-4 h-4 mr-2" />
            )}
            Approve verified accounts{pendingIds.length > 0 ? ` (${pendingIds.length})` : ""}
          </Button>
          <Button
            variant="outline"
            onClick={handleExport}
            className="border-slate-600 text-slate-300 hover:bg-slate-700"
          >
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </Button>
        </div>
      </div>

      <AmbassadorStatsCards ambassadors={ambassadors} />

      <Card className="bg-slate-800 border-slate-700 shadow-xl">
        <CardHeader>
          <CardTitle className="text-white">Ambassador Database</CardTitle>
          <CardDescription className="text-slate-400">
            Complete user management and oversight
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AmbassadorFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            regionFilter={regionFilter}
            setRegionFilter={setRegionFilter}
            regions={regions}
          />

          {isLoading ? (
            <div className="flex items-center justify-center py-16 text-slate-400">
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Loading ambassadors...
            </div>
          ) : error ? (
            <div className="py-16 text-center text-red-400">
              Failed to load ambassadors.
            </div>
          ) : filteredAmbassadors.length === 0 ? (
            <div className="py-16 text-center text-slate-400">
              No ambassadors match the current filters.
            </div>
          ) : (
            <AmbassadorDataTable
              ambassadors={filteredAmbassadors}
              onStatusChange={handleStatusChange}
              isUpdating={approve.isPending}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAmbassadorManagement;
