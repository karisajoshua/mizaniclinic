import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, DollarSign, Globe, UserCheck } from "lucide-react";
import { useCountryLimits } from "@/hooks/useCountryLimits";
import { useAdminMetrics } from "@/hooks/useAdminData";

const SystemMetricsCards = () => {
  const { data: countries } = useCountryLimits();
  const { data, isLoading } = useAdminMetrics();

  const systemMetrics = [
    {
      title: "Total System Users",
      value: `${data?.totalUsers ?? 0}`,
      icon: Users,
      color: "bg-blue-600",
      detail: `${data?.pendingUsers ?? 0} pending activation`,
    },
    {
      title: "Platform Revenue",
      value: `$${(data?.totalRevenueUsd ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: DollarSign,
      color: "bg-emerald-600",
      detail: "paid earnings to date",
    },
    {
      title: "Active Regions",
      value: `${countries?.length ?? 0}`,
      icon: Globe,
      color: "bg-purple-600",
      detail: "countries enabled",
    },
    {
      title: "Active Ambassadors",
      value: `${data?.activeUsers ?? 0}`,
      icon: UserCheck,
      color: "bg-orange-600",
      detail: "status active",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {systemMetrics.map((metric, index) => (
        <Card key={index} className="bg-slate-800 border-slate-700 shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">{metric.title}</CardTitle>
            <div className={`w-12 h-12 ${metric.color} rounded-lg flex items-center justify-center shadow-lg`}>
              <metric.icon className="w-6 h-6 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white mb-1">{isLoading ? "—" : metric.value}</div>
            <span className="text-xs text-slate-400">{metric.detail}</span>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default SystemMetricsCards;
