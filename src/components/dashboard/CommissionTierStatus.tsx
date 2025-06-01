
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
      <CardHeader>
        <CardTitle className="text-gray-800 text-xl font-black flex items-center">
          <Award className="w-6 h-6 mr-3 text-green-500" />
          Commission Tier Status 📈
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-bold text-gray-700">Current Tier:</span>
            <Badge className="bg-green-500 text-white font-bold text-lg px-4 py-2">
              Standard (30%–25%–15%)
            </Badge>
          </div>
          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4">
            <h4 className="font-black text-yellow-800 mb-2 flex items-center">
              Upgrade to Premium Tier! 🚀
            </h4>
            <p className="text-yellow-700 font-semibold mb-3">
              When 1,000 total Ambassadors reached across Tanzania:
            </p>
            <ul className="space-y-2 text-sm text-yellow-700 font-medium">
              <li>• Activation Pack: 70% commission</li>
              <li>• Direct Sales: 35%–75% commission</li>
              <li>• Global expansion unlocked</li>
            </ul>
            <div className="mt-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-bold text-yellow-800">Tanzania Ambassadors:</span>
                <span className="font-black text-yellow-800">{ambassadorStats.ambassadorLimit}/1,000</span>
              </div>
              <Progress value={(ambassadorStats.ambassadorLimit/1000)*100} className="h-3" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CommissionTierStatus;
