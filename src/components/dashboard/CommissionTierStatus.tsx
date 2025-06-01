
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Award } from "lucide-react";
import type { AmbassadorStats } from "@/types/dashboard";

interface CommissionTierStatusProps {
  ambassadorStats: AmbassadorStats;
}

const CommissionTierStatus = ({ ambassadorStats }: CommissionTierStatusProps) => {
  return (
    <Card className="border-0 bg-gradient-to-br from-green-50 to-emerald-50 shadow-xl animate-slide-in">
      <CardHeader className="px-4 sm:px-6">
        <CardTitle className="text-gray-800 text-lg sm:text-xl font-black flex items-center">
          <Award className="w-5 h-5 sm:w-6 sm:h-6 mr-3 text-green-500" />
          Commission Tier Status
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 sm:px-6">
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
            <span className="font-bold text-gray-700 text-sm sm:text-base">Current Tier:</span>
            <Badge className="bg-green-500 text-white font-bold text-sm sm:text-lg px-3 sm:px-4 py-1 sm:py-2 w-fit">
              Standard (30%–25%–15%)
            </Badge>
          </div>
          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4">
            <h4 className="font-black text-yellow-800 mb-2 flex items-center text-sm sm:text-base">
              Upgrade to Premium Tier!
            </h4>
            <p className="text-yellow-700 font-semibold mb-3 text-sm sm:text-base">
              When 1,000 total Ambassadors reached across Tanzania:
            </p>
            <ul className="space-y-2 text-xs sm:text-sm text-yellow-700 font-medium">
              <li>• Activation Pack: 70% commission</li>
              <li>• Direct Sales: 35%–75% commission</li>
              <li>• Global expansion unlocked</li>
            </ul>
            <div className="mt-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs sm:text-sm font-bold text-yellow-800">Tanzania Ambassadors:</span>
                <span className="font-black text-yellow-800 text-sm sm:text-base">{ambassadorStats.ambassadorLimit}/1,000</span>
              </div>
              <Progress value={(ambassadorStats.ambassadorLimit/1000)*100} className="h-2 sm:h-3" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CommissionTierStatus;
