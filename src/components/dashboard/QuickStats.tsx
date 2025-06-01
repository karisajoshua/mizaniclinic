
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Users, Globe, Bike } from "lucide-react";
import type { AmbassadorStats } from "@/types/dashboard";

interface QuickStatsProps {
  ambassadorStats: AmbassadorStats;
}

const QuickStats = ({ ambassadorStats }: QuickStatsProps) => {
  const stats = [
    {
      title: "Total Earned",
      value: `TSH ${ambassadorStats.totalEarnings.toLocaleString()}`,
      change: "+TSH 2,500 today",
      icon: DollarSign,
      color: "from-green-500 to-emerald-600",
      changeColor: "text-green-600"
    },
    {
      title: "Active Team",
      value: ambassadorStats.activeReferrals.toString(),
      change: "+3 this week",
      icon: Users,
      color: "from-blue-500 to-cyan-600",
      changeColor: "text-blue-600"
    },
    {
      title: "Countries",
      value: "4/6",
      change: "Growing globally",
      icon: Globe,
      color: "from-purple-500 to-violet-600",
      changeColor: "text-purple-600"
    },
    {
      title: "Next Bonus",
      value: "250 TSH",
      change: "to Motorbike",
      icon: Bike,
      color: "from-orange-500 to-red-600",
      changeColor: "text-orange-600"
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in">
      {stats.map((stat, index) => (
        <Card key={index} className="group border-0 bg-white/90 backdrop-blur-sm hover:bg-white transition-all duration-300 hover:shadow-xl animate-scale-in" style={{animationDelay: `${index * 0.1}s`}}>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xs sm:text-sm text-gray-700 font-bold">{stat.title}</CardTitle>
              <div className={`w-10 h-10 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-xl font-black text-gray-800">{stat.value}</div>
            <p className={`text-xs font-semibold ${stat.changeColor}`}>{stat.change}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default QuickStats;
