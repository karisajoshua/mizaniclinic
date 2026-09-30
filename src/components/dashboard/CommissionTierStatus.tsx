import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Award } from "lucide-react";
import type { AmbassadorStats } from "@/types/dashboard";

interface CommissionTierStatusProps {
  ambassadorStats: AmbassadorStats;
}

const CommissionTierStatus = ({ ambassadorStats: s }: CommissionTierStatusProps) => {
  const progress = s.ambassadorLimit > 0 ? Math.min(100, (s.countryActiveCount / s.ambassadorLimit) * 100) : 0;

  return (
    <Card className="border-0 bg-white/90 shadow-md animate-fade-in">
      <CardHeader className="px-4 sm:px-6">
        <CardTitle className="text-gray-800 text-lg sm:text-xl font-bold flex items-center">
          <Award className="w-5 h-5 sm:w-6 sm:h-6 mr-3 text-green-500" />
          Commission Tier
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 sm:px-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <span className="font-semibold text-gray-700 text-sm">Current tier</span>
          {s.premiumUnlocked ? (
            <Badge className="bg-amber-500 text-white w-fit">Premium — unlocked in {s.countryName}</Badge>
          ) : (
            <Badge className="bg-green-600 text-white w-fit">Standard · 35% / 25% / 10%</Badge>
          )}
        </div>
        <div className="rounded-xl border p-4 space-y-2">
          <p className="text-sm text-gray-700">
            {s.premiumUnlocked
              ? `${s.countryName} has reached its Ambassador target. Premium rates will be announced by Mizani Health.`
              : `Premium unlocks when ${s.countryName} reaches ${s.ambassadorLimit.toLocaleString()} active Ambassadors.`}
          </p>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Active Ambassadors in {s.countryName}</span>
            <span className="font-semibold text-gray-800">
              {s.countryActiveCount.toLocaleString()} / {s.ambassadorLimit.toLocaleString()}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </CardContent>
    </Card>
  );
};

export default CommissionTierStatus;
