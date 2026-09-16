import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { progressPercent } from '@/lib/reporting';
import type { AmbassadorStats } from '@/types/dashboard';

const ratesLabel = (rates: AmbassadorStats['commissionRates']) =>
  [rates.activation_pack, rates.direct_sales, rates.second_level].map(rate => `${Number((rate * 100).toFixed(2))}%`).join(' / ');

export default function CommissionTierStatus({ ambassadorStats: stats }: { ambassadorStats: AmbassadorStats }) {
  const premium = stats.currentCommissionTier === 'Premium';
  return <Card className="border-0 bg-green-50 shadow-xl">
    <CardHeader><CardTitle>Commission Tier Status</CardTitle></CardHeader>
    <CardContent className="space-y-4">
      <div className="flex flex-wrap justify-between gap-2">
        <span>Current tier</span><Badge>{stats.currentCommissionTier} ({ratesLabel(stats.commissionRates)})</Badge>
      </div>
      <p className="text-sm text-gray-600">Activation packs / direct sales / first generation</p>
      {premium ? <p className="text-green-800 font-semibold">Premium rates are active for new eligible transactions.</p> :
        <div className="rounded-xl bg-yellow-50 border border-yellow-200 p-4 space-y-3">
          <p className="font-bold">Progress towards Premium</p>
          <p>{stats.countryActiveCount.toLocaleString()} / {stats.ambassadorLimit.toLocaleString()} active ambassadors in {stats.countryName}</p>
          <Progress value={progressPercent(stats.countryActiveCount, stats.ambassadorLimit)} />
          <p className="text-sm">Premium rates: {ratesLabel(stats.premiumRates)}</p>
        </div>}
    </CardContent>
  </Card>;
}
