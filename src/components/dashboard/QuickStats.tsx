
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Coins, Users, Globe, Bike } from "lucide-react";
import { money } from "@/lib/reporting";
import type { AmbassadorStats } from "@/types/dashboard";

interface QuickStatsProps {
  ambassadorStats: AmbassadorStats;
}

const QuickStats = ({ ambassadorStats }: QuickStatsProps) => {
  const motorbikeReached = ambassadorStats.motorbikeAchieved || ambassadorStats.teamProgressLevel1 >= ambassadorStats.motorbikeTarget;
  const carReached = ambassadorStats.carAchieved || ambassadorStats.teamProgressLevel2 >= ambassadorStats.carTarget;
  const bonusRemaining = motorbikeReached
    ? Math.max(0, ambassadorStats.carTarget - ambassadorStats.teamProgressLevel2)
    : Math.max(0, ambassadorStats.motorbikeTarget - ambassadorStats.teamProgressLevel1);
  const stats = [
    { title: "Total Earned", value: money(ambassadorStats.totalEarnings),
      change: `${money(ambassadorStats.todayEarnings)} earned today`, icon: Coins,
      color: "from-green-500 to-emerald-600", changeColor: "text-green-600" },
    { title: "Your Referrals", value: String(ambassadorStats.totalReferrals),
      change: `${ambassadorStats.referralsThisWeek} joined this week`, icon: Users,
      color: "from-blue-500 to-cyan-600", changeColor: "text-blue-600" },
    { title: "Countries Reached", value: `${ambassadorStats.countriesReached}/${ambassadorStats.availableCountries}`,
      change: "Countries with your active referrals", icon: Globe,
      color: "from-purple-500 to-violet-600", changeColor: "text-purple-600" },
    { title: "Next Bonus", value: motorbikeReached && carReached ? "Targets reached" : money(bonusRemaining),
      change: motorbikeReached && carReached ? "Awaiting reward fulfilment" : motorbikeReached ? "remaining to Car target" : "remaining to Motorbike target",
      icon: Bike, color: "from-orange-500 to-red-600", changeColor: "text-orange-600" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 animate-fade-in">
      {stats.map((stat, index) => (
        <Card key={index} className="group border-0 bg-white/90 backdrop-blur-sm hover:bg-white transition-all duration-300 hover:shadow-xl animate-scale-in" style={{animationDelay: `${index * 0.1}s`}}>
          <CardHeader className="pb-2 px-3 sm:px-6 pt-3 sm:pt-6">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xs sm:text-sm text-gray-700 font-bold leading-tight">{stat.title}</CardTitle>
              <div className={`w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br ${stat.color} rounded-lg sm:rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                <stat.icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
            <div className="text-sm sm:text-lg lg:text-xl font-black text-gray-800 leading-tight">{stat.value}</div>
            <p className={`text-xs font-semibold ${stat.changeColor} mt-1`}>{stat.change}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default QuickStats;
