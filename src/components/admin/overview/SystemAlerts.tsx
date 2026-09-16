import { usePlatformSettings } from "@/hooks/usePlatformSettings";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { useCountryLimits } from "@/hooks/useCountryLimits";
import { useAdminMetrics, useAdminCountryStats } from "@/hooks/useAdminData";

interface SystemAlert {
  type: "warning" | "info" | "success";
  message: string;
  priority: "high" | "medium" | "low";
}

const SystemAlerts = () => {
  const { data: settings, isPending: settingsLoading, isError: settingsError } = usePlatformSettings();
  const { data: countries, isPending: countriesLoading, isError: countriesError } = useCountryLimits();
  const { data: stats, isPending: statsLoading, isError: statsError } = useAdminCountryStats();
  const { data: metrics, isPending: metricsLoading, isError: metricsError } = useAdminMetrics();

  const systemAlerts: SystemAlert[] = [];

  (settings?.admin_alerts.country_limits ? countries ?? [] : []).forEach((country) => {
    const registered = stats?.[country.name]?.active ?? country.count;
    const limit = country.limit || 1;
    const pct = Math.round((registered / limit) * 100);
    if (pct >= 100) {
      systemAlerts.push({
        type: "warning",
        message: `${country.name} has reached its ambassador capacity (${registered}/${limit})`,
        priority: "high",
      });
    } else if (pct >= 80) {
      systemAlerts.push({
        type: "warning",
        message: `${country.name} approaching ${pct}% ambassador capacity`,
        priority: "high",
      });
    }
  });

  if (settings?.admin_alerts.registrations && metrics && metrics.pendingUsers > 0) {
    systemAlerts.push({
      type: "info",
      message: `${metrics.pendingUsers} ambassador${metrics.pendingUsers === 1 ? "" : "s"} awaiting receipt activation`,
      priority: metrics.pendingUsers > 10 ? "high" : "medium",
    });
  }

  if (settings?.admin_alerts.payouts && metrics && metrics.pendingPayoutCount > 0) {
    systemAlerts.push({
      type: "warning",
      message: `${metrics.pendingPayoutCount} pending payout${metrics.pendingPayoutCount === 1 ? "" : "s"} totalling $${metrics.pendingPayoutsUsd.toFixed(2)}`,
      priority: metrics.pendingPayoutsUsd > 1000 ? "high" : "medium",
    });
  }

  if (settings?.admin_alerts.milestones && metrics && metrics.paidThisMonthCount > 0) {
    systemAlerts.push({
      type: "success",
      message: `${metrics.paidThisMonthCount} payout${metrics.paidThisMonthCount === 1 ? "" : "s"} completed this month ($${metrics.paidThisMonthUsd.toFixed(2)})`,
      priority: "low",
    });
  }

  return (
    <Card className="bg-slate-800 border-slate-700 shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-white">
          <AlertTriangle className="w-5 h-5 text-yellow-400" />
          <span>System Alerts</span>
          {systemAlerts.length > 0 && (
            <Badge variant="destructive" className="ml-2">{systemAlerts.length}</Badge>
          )}
        </CardTitle>
        <CardDescription className="text-slate-400">Critical system notifications</CardDescription>
      </CardHeader>
      <CardContent>
        {settingsError || countriesError || statsError || metricsError ? <p role="alert" className="text-red-300">Alerts could not be loaded.</p> : settingsLoading || countriesLoading || statsLoading || metricsLoading ? <p className="text-slate-300">Loading alerts…</p> : systemAlerts.length === 0 ? (
          <div className="flex items-center space-x-2 text-slate-400 text-sm py-6">
            <CheckCircle className="w-5 h-5 text-emerald-400" />
            <span>No enabled alerts to display.</span>
          </div>
        ) : (
          <div className="space-y-4">
            {systemAlerts.map((alert, index) => (
              <div key={index} className="flex items-start space-x-3 p-4 bg-slate-900/50 rounded-lg border border-slate-700">
                {alert.type === 'warning' ? (
                  <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5" />
                ) : alert.type === 'success' ? (
                  <CheckCircle className="w-5 h-5 text-emerald-400 mt-0.5" />
                ) : (
                  <Clock className="w-5 h-5 text-blue-400 mt-0.5" />
                )}
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">{alert.message}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge
                      variant={alert.priority === 'high' ? 'destructive' : alert.priority === 'medium' ? 'secondary' : 'outline'}
                      className="text-xs"
                    >
                      {alert.priority}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SystemAlerts;
