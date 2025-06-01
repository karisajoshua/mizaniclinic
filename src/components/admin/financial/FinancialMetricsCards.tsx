
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Clock, CheckCircle, TrendingUp } from "lucide-react";

const FinancialMetricsCards = () => {
  const financialMetrics = [
    {
      title: "Total Platform Revenue",
      value: "$125,450",
      icon: DollarSign,
      color: "bg-emerald-600",
      change: "+18.2%"
    },
    {
      title: "Pending Payouts",
      value: "$12,250",
      icon: Clock,
      color: "bg-yellow-600",
      change: "23 requests"
    },
    {
      title: "Processed This Month",
      value: "$45,750",
      icon: CheckCircle,
      color: "bg-blue-600",
      change: "156 transactions"
    },
    {
      title: "Average Commission",
      value: "31.2%",
      icon: TrendingUp,
      color: "bg-purple-600",
      change: "+2.1%"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {financialMetrics.map((metric, index) => (
        <Card key={index} className="bg-slate-800 border-slate-700 shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">{metric.title}</CardTitle>
            <div className={`w-10 h-10 ${metric.color} rounded-lg flex items-center justify-center`}>
              <metric.icon className="w-5 h-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{metric.value}</div>
            <p className="text-xs text-emerald-400 font-medium">{metric.change}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default FinancialMetricsCards;
