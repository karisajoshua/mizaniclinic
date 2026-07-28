import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield } from "lucide-react";
import { useAdminMetrics } from "@/hooks/useAdminData";

const PendingActions = () => {
  const { data, isLoading } = useAdminMetrics();

  const pendingActions = [
    {
      action: "Ambassador applications awaiting activation",
      count: data?.pendingUsers ?? 0,
      urgent: (data?.pendingUsers ?? 0) > 0,
    },
    {
      action: "Payout requests pending approval",
      count: data?.pendingPayoutCount ?? 0,
      urgent: (data?.pendingPayoutCount ?? 0) > 0,
    },
  ];

  return (
    <Card className="bg-slate-800 border-slate-700 shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-white">
          <Shield className="w-5 h-5 text-blue-400" />
          <span>Pending Admin Actions</span>
        </CardTitle>
        <CardDescription className="text-slate-400">Tasks requiring attention</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {isLoading && <p className="text-sm text-slate-400">Loading…</p>}
          {!isLoading &&
            pendingActions.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg border border-slate-700"
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${item.urgent ? "bg-red-400" : "bg-blue-400"}`}></div>
                  <p className="text-sm font-medium text-white">{item.action}</p>
                </div>
                <span className="text-sm font-bold text-white">{item.count}</span>
              </div>
            ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PendingActions;
