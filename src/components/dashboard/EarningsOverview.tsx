
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Coins } from "lucide-react";
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
      description: "30% commission from new Ambassador registrations",
      earnings: `TSH ${ambassadorStats.activationPackEarnings.toLocaleString()}`,
      status: "Paid after every 5 referrals",
      color: "from-yellow-400 to-orange-500"
    },
    {
      way: "Way 2", 
      emoji: "🥈",
      title: "Direct Treatment/Product Sales",
      description: "25% commission on direct customer sales",
      earnings: `TSH ${ambassadorStats.directReferralEarnings.toLocaleString()}`,
      status: "Paid immediately per transaction",
      color: "from-green-400 to-emerald-500"
    },
    {
      way: "Way 3",
      emoji: "🥉", 
      title: "Second-Level Referrals",
      description: "15% of what your Ambassadors earn",
      earnings: `TSH ${ambassadorStats.secondLevelEarnings.toLocaleString()}`,
      status: "Paid per transaction",
      color: "from-blue-400 to-cyan-500"
    },
    {
      way: "Way 4",
      emoji: "🏆",
      title: "Team Progression Bonus - Level 1",
      description: "Motorbike when team earns TSH 1,000 total",
      earnings: `${ambassadorStats.teamProgressLevel1}/1,000 TSH`,
      status: `${Math.round((ambassadorStats.teamProgressLevel1/1000)*100)}% Complete`,
      color: "from-purple-400 to-violet-500"
    },
    {
      way: "Way 5",
      emoji: "🥇",
      title: "Team Progression Bonus - Level 2", 
      description: "Car when team earns TSH 6,000/month",
      earnings: `${ambassadorStats.teamProgressLevel2}/6,000 TSH`,
      status: `${Math.round((ambassadorStats.teamProgressLevel2/6000)*100)}% Complete (This Month)`,
      color: "from-red-400 to-pink-500"
    }
  ];

  return (
    <Card className="border-0 bg-white/90 backdrop-blur-sm shadow-xl animate-fade-in">
      <CardHeader>
        <CardTitle className="text-gray-800 text-2xl font-black flex items-center">
          <Coins className="w-7 h-7 mr-3 text-yellow-500" />
          5 Ways to Earn Money! 💰
        </CardTitle>
        <CardDescription className="font-semibold text-gray-600">
          Multiple income streams for maximum earnings
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {earningWays.map((way, index) => (
            <Card key={index} className="border-2 border-gray-200 hover:border-gray-300 transition-all duration-300 hover:shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className={`w-16 h-16 bg-gradient-to-br ${way.color} rounded-2xl flex items-center justify-center shadow-lg text-2xl`}>
                      {way.emoji}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge variant="outline" className="font-bold text-xs">{way.way}</Badge>
                        <h3 className="font-black text-gray-800 text-lg">{way.title}</h3>
                      </div>
                      <p className="text-gray-600 mb-3 font-medium">{way.description}</p>
                      <p className="text-sm text-gray-500 font-semibold">{way.status}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-black text-green-600">{way.earnings}</div>
                    {(way.way === "Way 4" || way.way === "Way 5") && (
                      <Progress 
                        value={way.way === "Way 4" ? (ambassadorStats.teamProgressLevel1/1000)*100 : (ambassadorStats.teamProgressLevel2/6000)*100} 
                        className="w-24 mt-2"
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
