
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, DollarSign, Globe, Activity, TrendingUp } from "lucide-react";
import { useCountryLimits } from "@/hooks/useCountryLimits";

const SystemMetricsCards = () => {
  const { data: countries } = useCountryLimits();

  const systemMetrics = [
    {
      title: "Total System Users",
      value: "1,247",
      icon: Users,
      color: "bg-blue-600",
      change: "+15.3%",
      trend: "up"
    },
    {
      title: "Platform Revenue",
      value: "$89,450",
      icon: DollarSign,
      color: "bg-emerald-600",
      change: "+23.8%",
      trend: "up"
    },
    {
      title: "Active Regions",
      value: countries?.length || 6,
      icon: Globe,
      color: "bg-purple-600",
      change: "100%",
      trend: "stable"
    },
    {
      title: "System Health",
      value: "99.8%",
      icon: Activity,
      color: "bg-orange-600",
      change: "+0.2%",
      trend: "up"
    }
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
            <div className="text-3xl font-bold text-white mb-1">{metric.value}</div>
            <div className="flex items-center space-x-1">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span className="text-sm text-emerald-400 font-medium">{metric.change}</span>
              <span className="text-xs text-slate-400">vs last month</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default SystemMetricsCards;
