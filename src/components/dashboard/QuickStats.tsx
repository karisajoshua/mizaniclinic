import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { DollarSign, Users, Clock, CheckCircle, Bike } from "lucide-react";
import type { AmbassadorStats } from "@/types/dashboard";
import { formatUSD, formatTZS } from "@/lib/money";

interface QuickStatsProps {
  ambassadorStats: AmbassadorStats;
}

const MOTORBIKE_TARGET_USD = 400;

const QuickStats = ({ ambassadorStats: s }: QuickStatsProps) => {
  const awaiting = s.pendingEarnings + s.approvedEarnings;
  const stats = [
    { title: "Total Earned", value: formatUSD(s.totalEarnings), sub: formatTZS(s.totalEarnings), icon: DollarSign, color: "from-green-500 to-emerald-600" },
    { title: "Awaiting Payment", value: formatUSD(awaiting), sub: `${formatUSD(s.approvedEarnings)} approved`, icon: Clock, color: "from-amber-500 to-orange-600" },
    { title: "Paid Out", value: formatUSD(s.paidEarnings), sub: formatTZS(s.paidEarnings), icon: CheckCircle, color: "from-blue-500 to-cyan-600" },
    { title: "Active Team", value: s.activeReferrals.toString(), sub: `${s.pendingReferrals} pending activation`, icon: Users, color: "from-teal-500 to-green-600" },
  ];

  const progress = Math.min(100, (s.teamProgressLevel1 / MOTORBIKE_TARGET_USD) * 100);
  const remaining = Math.max(0, MOTORBIKE_TARGET_USD - s.teamProgressLevel1);

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="border-0 bg-white/90 shadow-md">
            <CardHeader className="pb-2 px-3 sm:px-6 pt-3 sm:pt-6">
              <div className="flex items-center justify-between gap-2">
                <CardTitle className="text-xs sm:text-sm text-gray-600 font-semibold leading-tight">{stat.title}</CardTitle>
                <div className={`w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br ${stat.color} rounded-lg flex items-center justify-center shadow`}>
                  <stat.icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
              <div className="text-base sm:text-xl font-bold text-gray-900">{stat.value}</div>
              <p className="text-xs text-gray-500 mt-1">{stat.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-0 bg-white/90 shadow-md">
        <CardContent className="p-4 sm:p-6 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-semibold text-gray-800">
              <Bike className="w-5 h-5 text-orange-500" />
              Next milestone: Motorbike Bonus
            </div>
            <span className="text-sm font-semibold text-gray-700">
              {formatUSD(s.teamProgressLevel1)} / {formatUSD(MOTORBIKE_TARGET_USD)}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
          <p className="text-xs text-gray-500">
            {remaining > 0 ? `${formatUSD(remaining)} to go` : "Target reached — the team will contact you about your bonus."}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuickStats;
