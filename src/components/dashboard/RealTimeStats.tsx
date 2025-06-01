
import { useAmbassadorStats } from "@/hooks/useAmbassadorStats";
import { useReferrals } from "@/hooks/useReferrals";
import { useCountryLimits } from "@/hooks/useCountryLimits";
import QuickStats from "./QuickStats";
import CountryDistribution from "./CountryDistribution";
import RecentReferrals from "./RecentReferrals";
import BonusProgress from "./BonusProgress";
import CommissionTierStatus from "./CommissionTierStatus";
import EarningsOverview from "./EarningsOverview";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface RealTimeStatsProps {
  activeTab: string;
}

const RealTimeStats = ({ activeTab }: RealTimeStatsProps) => {
  const { data: ambassadorStats, isLoading: statsLoading, error: statsError } = useAmbassadorStats();
  const { data: referrals, isLoading: referralsLoading } = useReferrals();
  const { data: countries, isLoading: countriesLoading } = useCountryLimits();

  if (statsLoading || referralsLoading || countriesLoading) {
    return (
      <Card className="p-6 text-center">
        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
        <CardTitle>Loading your dashboard...</CardTitle>
        <CardDescription>Fetching your latest ambassador statistics</CardDescription>
      </Card>
    );
  }

  if (statsError) {
    return (
      <Card className="p-6 text-center border-red-200 bg-red-50">
        <CardTitle className="text-red-800">Unable to load data</CardTitle>
        <CardDescription className="text-red-600">
          Please check your connection and try again
        </CardDescription>
      </Card>
    );
  }

  if (!ambassadorStats) {
    return (
      <Card className="p-6 text-center">
        <CardTitle>Welcome to your Ambassador Dashboard!</CardTitle>
        <CardDescription>
          Start referring new ambassadors to see your statistics here
        </CardDescription>
      </Card>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return <QuickStats ambassadorStats={ambassadorStats} />;
      case "earnings":
        return <EarningsOverview ambassadorStats={ambassadorStats} />;
      case "referrals":
        return (
          <div className="space-y-4 sm:space-y-6">
            {countries && <CountryDistribution countries={countries} />}
            {referrals && <RecentReferrals referrals={referrals} />}
          </div>
        );
      case "bonuses":
        return (
          <div className="space-y-4 sm:space-y-6">
            <BonusProgress ambassadorStats={ambassadorStats} />
            <CommissionTierStatus ambassadorStats={ambassadorStats} />
          </div>
        );
      default:
        return <QuickStats ambassadorStats={ambassadorStats} />;
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      {renderTabContent()}
    </div>
  );
};

export default RealTimeStats;
