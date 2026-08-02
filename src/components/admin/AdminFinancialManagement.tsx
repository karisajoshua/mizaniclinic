import { Button } from "@/components/ui/button";
import { CheckCircle, Download, Loader2 } from "lucide-react";
import FinancialMetricsCards from "./financial/FinancialMetricsCards";
import RevenueBreakdown from "./financial/RevenueBreakdown";
import PayoutQueueManagement from "./financial/PayoutQueueManagement";
import { useAdminPayouts, useProcessPayouts, downloadCsv } from "@/hooks/useAdminData";

const AdminFinancialManagement = () => {
  const { data: payouts = [] } = useAdminPayouts();
  const process = useProcessPayouts();

  const pendingIds = payouts.filter((p) => p.status === "pending").map((p) => p.id);

  const handleBulkApproval = () => {
    if (pendingIds.length === 0) return;
    if (
      window.confirm(
        `Mark ${pendingIds.length} pending payout${pendingIds.length === 1 ? "" : "s"} as paid?`
      )
    ) {
      process.mutate(pendingIds);
    }
  };

  const handleExport = () => {
    downloadCsv(
      `payouts-${new Date().toISOString().slice(0, 10)}.csv`,
      payouts.map((p) => ({
        Ambassador: p.ambassadorName,
        "Ambassador ID": p.ambassadorCode,
        Amount: p.amount.toFixed(2),
        Currency: p.currency,
        Type: p.type,
        Status: p.status,
        Earned: p.earnedDate,
        Paid: p.paidDate ?? "",
      }))
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Financial Operations</h2>
          <p className="text-slate-400">Manage payouts, commissions, and financial reporting</p>
        </div>
        <div className="flex space-x-3">
          <Button
            onClick={handleBulkApproval}
            disabled={pendingIds.length === 0 || process.isPending}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            {process.isPending ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <CheckCircle className="w-4 h-4 mr-2" />
            )}
            Approve All Pending{pendingIds.length > 0 ? ` (${pendingIds.length})` : ""}
          </Button>
          <Button
            variant="outline"
            onClick={handleExport}
            className="border-slate-600 text-slate-300 hover:bg-slate-700"
          >
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Financial Metrics */}
      <FinancialMetricsCards />

      {/* Revenue Breakdown and Controls */}
      <RevenueBreakdown />

      {/* Payouts Management */}
      <PayoutQueueManagement />
    </div>
  );
};

export default AdminFinancialManagement;
