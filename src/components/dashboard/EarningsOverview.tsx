import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Coins, UserPlus, ShoppingBag, Users, Bike, Car } from "lucide-react";
import type { AmbassadorStats } from "@/types/dashboard";
import { formatUSD } from "@/lib/money";
import EarningsBreakdown from "./EarningsBreakdown";

interface EarningsOverviewProps {
  ambassadorStats: AmbassadorStats;
}

const pct = (v: number, t: number) => Math.min(100, (v / t) * 100);

const EarningsOverview = ({ ambassadorStats: s }: EarningsOverviewProps) => {
  const ways = [
    { n: 1, icon: UserPlus, title: "Activation Pack Referrals", description: "35% of the $35 Activation Pack ($12.25) for every Ambassador you sponsor", earnings: formatUSD(s.activationPackEarnings), note: "Paid after admin approval", color: "from-amber-400 to-orange-500" },
    { n: 2, icon: ShoppingBag, title: "Direct Treatment & Product Sales", description: "25% commission on your direct customer sales", earnings: formatUSD(s.directReferralEarnings), note: "Paid after admin approval", color: "from-green-400 to-emerald-500" },
    { n: 3, icon: Users, title: "First Generation Leadership", description: "10% of activations and sales made by Ambassadors you sponsored", earnings: formatUSD(s.secondLevelEarnings), note: "Paid after admin approval", color: "from-blue-400 to-cyan-500" },
    { n: 4, icon: Bike, title: "Team Progression Bonus — Level 1", description: "Motorbike when your team earnings reach $400", earnings: `${formatUSD(s.teamProgressLevel1)} / $400`, note: `${Math.round(pct(s.teamProgressLevel1, 400))}% complete`, progress: pct(s.teamProgressLevel1, 400), color: "from-purple-400 to-violet-500" },
    { n: 5, icon: Car, title: "Team Progression Bonus — Level 2", description: "Car when your team earns $2,400 in a month", earnings: `${formatUSD(s.teamProgressLevel2)} / $2,400`, note: `${Math.round(pct(s.teamProgressLevel2, 2400))}% complete this month`, progress: pct(s.teamProgressLevel2, 2400), color: "from-rose-400 to-pink-500" },
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      <Card className="border-0 bg-white/90 shadow-md animate-fade-in">
        <CardHeader className="px-4 sm:px-6">
          <CardTitle className="text-gray-800 text-xl font-bold flex items-center">
            <Coins className="w-6 h-6 mr-3 text-amber-500" />
            Five Ways to Earn
          </CardTitle>
          <CardDescription>Your earnings from each income stream</CardDescription>
        </CardHeader>
        <CardContent className="px-4 sm:px-6 space-y-3">
          {ways.map((w) => (
            <div key={w.n} className="border rounded-xl p-4 flex flex-col sm:flex-row sm:items-center gap-4">
              <div className={`w-12 h-12 bg-gradient-to-br ${w.color} rounded-xl flex items-center justify-center shadow flex-shrink-0`}>
                <w.icon className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="outline" className="text-xs">Way {w.n}</Badge>
                  <h3 className="font-semibold text-gray-800 text-sm sm:text-base">{w.title}</h3>
                </div>
                <p className="text-sm text-gray-600">{w.description}</p>
                <p className="text-xs text-gray-500 mt-1">{w.note}</p>
              </div>
              <div className="sm:text-right flex-shrink-0">
                <div className="text-lg font-bold text-green-600">{w.earnings}</div>
                {w.progress !== undefined && <Progress value={w.progress} className="w-full sm:w-28 mt-2 h-2" />}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
      <EarningsBreakdown />
    </div>
  );
};

export default EarningsOverview;
