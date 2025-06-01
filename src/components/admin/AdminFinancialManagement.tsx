
import { Button } from "@/components/ui/button";
import { CheckCircle, Download } from "lucide-react";
import FinancialMetricsCards from "./financial/FinancialMetricsCards";
import RevenueBreakdown from "./financial/RevenueBreakdown";
import PayoutQueueManagement from "./financial/PayoutQueueManagement";

const AdminFinancialManagement = () => {
  const handleBulkApproval = () => {
    console.log("Processing bulk payout approval");
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
          <Button onClick={handleBulkApproval} className="bg-emerald-600 hover:bg-emerald-700">
            <CheckCircle className="w-4 h-4 mr-2" />
            Approve All Pending
          </Button>
          <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
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
