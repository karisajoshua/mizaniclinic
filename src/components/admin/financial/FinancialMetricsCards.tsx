import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Clock, CheckCircle, TrendingUp } from "lucide-react";
import { useAdminMetrics } from "@/hooks/useAdminData";

const money = (n: number) =>
  `$${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const FinancialMetricsCards = () => {
  const { data, isLoading, isError } = useAdminMetrics();

  const financialMetrics = [
    {
      title: "Total Platform Revenue",
      value: money(data?.totalRevenueUsd ?? 0),
      icon: DollarSign,
      color: "bg-emerald-600",
      change: "recorded receipts, sales and consultations",
    },
    {
      title: "Pending Payouts",
      value: money(data?.pendingPayoutsUsd ?? 0),
      icon: Clock,
      color: "bg-yellow-600",
      change: `${data?.pendingPayoutCount ?? 0} requests`,
    },
    {
      title: "Processed This Month",
      value: money(data?.paidThisMonthUsd ?? 0),
      icon: CheckCircle,
      color: "bg-blue-600",
      change: `${data?.paidThisMonthCount ?? 0} transactions`,
    },
    {
      title: "Approved for Payment",
      value: money(data?.approvedPayoutsUsd ?? 0),
      icon: TrendingUp,
      color: "bg-purple-600",
      change: `${data?.approvedPayoutCount ?? 0} commissions`,
    },
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
            <div className="text-2xl font-bold text-white">{isError ? "Unavailable" : isLoading ? "—" : metric.value}</div>
            <p className="text-xs text-emerald-400 font-medium">{metric.change}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default FinancialMetricsCards;
