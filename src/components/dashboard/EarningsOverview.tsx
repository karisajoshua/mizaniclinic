
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Coins } from "lucide-react";
import { money, progressPercent } from "@/lib/reporting";
import type { AmbassadorStats } from "@/types/dashboard";

interface EarningsOverviewProps {
  ambassadorStats: AmbassadorStats;
}

const EarningsOverview = ({ ambassadorStats }: EarningsOverviewProps) => {
  const earningWays = [
    {
      way: "Way 1",
      emoji: "🥇",
      title: "Activation Pack Referrals",
      description: `${ambassadorStats.commissionRates.activation_pack * 100}% commission from new Ambassador registrations`,
      earnings: money(ambassadorStats.activationPackEarnings),
      status: "Recorded when a receipt is verified",
      color: "from-yellow-400 to-orange-500"
    },
    {
      way: "Way 2",
      emoji: "🥈",
      title: "Direct Treatment/Product Sales",
      description: `${ambassadorStats.commissionRates.direct_sales * 100}% commission on direct customer sales`,
      earnings: money(ambassadorStats.directReferralEarnings),
      status: "Recorded per eligible sale",
      color: "from-green-400 to-emerald-500"
    },
    {
      way: "Way 3",
      emoji: "🥉",
      title: "First Generation Leadership",
      description: `${ambassadorStats.commissionRates.second_level * 100}% of sales by Ambassadors you sponsored`,
      earnings: money(ambassadorStats.secondLevelEarnings),
      status: "Recorded per eligible transaction",
      color: "from-blue-400 to-cyan-500"
    },
    {
      way: "Way 4",
      emoji: "🏆",
      title: "Team Progression Bonus - Level 1",
      description: `Motorbike at ${money(ambassadorStats.motorbikeTarget)} team total`,
      earnings: `${money(ambassadorStats.teamProgressLevel1)} / ${money(ambassadorStats.motorbikeTarget)}`,
      status: `${Math.round(progressPercent(ambassadorStats.teamProgressLevel1, ambassadorStats.motorbikeTarget))}% Complete`,
      color: "from-purple-400 to-violet-500"
    },
    {
      way: "Way 5",
      emoji: "🥇",
      title: "Team Progression Bonus - Level 2",
      description: `Car at ${money(ambassadorStats.carTarget)} this month`,
      earnings: `${money(ambassadorStats.teamProgressLevel2)} / ${money(ambassadorStats.carTarget)}`,
      status: `${Math.round(progressPercent(ambassadorStats.teamProgressLevel2, ambassadorStats.carTarget))}% Complete (This Month)`,
      color: "from-red-400 to-pink-500"
    }
  ];

  return (
    <Card className="border-0 bg-white/90 backdrop-blur-sm shadow-xl animate-fade-in">
      <CardHeader className="px-4 sm:px-6">
        <CardTitle className="text-gray-800 text-xl sm:text-2xl font-black flex items-center">
          <Coins className="w-6 h-6 sm:w-7 sm:h-7 mr-3 text-yellow-500" />
          5 Ways to Earn Money!
        </CardTitle>
        <CardDescription className="font-semibold text-gray-600">
          Multiple income streams for maximum earnings
        </CardDescription>
      </CardHeader>
      <CardContent className="px-4 sm:px-6">
        <div className="grid sm:grid-cols-3 gap-4 mb-6">
          {[
            ['Pending approval', ambassadorStats.pendingEarnings],
            ['Approved, awaiting payment', ambassadorStats.approvedEarnings],
            ['Paid out', ambassadorStats.paidEarnings],
          ].map(([label, value]) => <div key={label} className="rounded-xl bg-green-50 p-4">
            <p className="text-sm text-gray-600">{label}</p>
            <p className="text-xl font-bold">{money(Number(value))}</p>
          </div>)}
        </div>
        <p className="text-sm text-gray-600 mb-4">Earned commissions become paid only after a payout is recorded.</p>
        <div className="space-y-4 sm:space-y-6">
          {earningWays.map((way, index) => (
            <Card key={index} className="border-2 border-gray-200 hover:border-gray-300 transition-all duration-300 hover:shadow-lg">
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between space-y-4 sm:space-y-0">
                  <div className="flex items-start space-x-3 sm:space-x-4 flex-1">
                    <div className={`w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br ${way.color} rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg text-lg sm:text-2xl flex-shrink-0`}>
                      {way.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2 mb-2">
                        <Badge variant="outline" className="font-bold text-xs w-fit">{way.way}</Badge>
                        <h3 className="font-black text-gray-800 text-sm sm:text-lg leading-tight">{way.title}</h3>
                      </div>
                      <p className="text-gray-600 mb-2 sm:mb-3 font-medium text-sm sm:text-base leading-relaxed">{way.description}</p>
                      <p className="text-xs sm:text-sm text-gray-500 font-semibold">{way.status}</p>
                    </div>
                  </div>
                  <div className="text-left sm:text-right flex-shrink-0">
                    <div className="text-lg sm:text-2xl font-black text-green-600">{way.earnings}</div>
                    {(way.way === "Way 4" || way.way === "Way 5") && (
                      <Progress
                        value={way.way === "Way 4" ? progressPercent(ambassadorStats.teamProgressLevel1, ambassadorStats.motorbikeTarget) : progressPercent(ambassadorStats.teamProgressLevel2, ambassadorStats.carTarget)}
                        className="w-full sm:w-24 mt-2"
                      />
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default EarningsOverview;
