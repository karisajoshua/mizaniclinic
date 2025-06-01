
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Bike, Car } from "lucide-react";
import type { AmbassadorStats } from "@/types/dashboard";

interface BonusProgressProps {
  ambassadorStats: AmbassadorStats;
}

const BonusProgress = ({ ambassadorStats }: BonusProgressProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 animate-fade-in">
      {/* Motorbike Bonus */}
      <Card className="border-0 bg-gradient-to-br from-orange-50 to-red-50 shadow-xl">
        <CardHeader className="px-4 sm:px-6">
          <CardTitle className="text-gray-800 text-lg sm:text-xl font-black flex items-center">
            <Bike className="w-5 h-5 sm:w-6 sm:h-6 mr-3 text-orange-500" />
            Motorbike Bonus
          </CardTitle>
          <CardDescription className="font-semibold text-sm sm:text-base">
            Team total: $400 USD target
          </CardDescription>
        </CardHeader>
        <CardContent className="px-4 sm:px-6">
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-2xl sm:text-4xl font-black text-orange-600">
                ${(ambassadorStats.teamProgressLevel1 / 2500).toFixed(0)} USD
              </div>
              <div className="text-xs sm:text-sm text-gray-600 font-semibold">of $400 USD</div>
            </div>
            <Progress value={(ambassadorStats.teamProgressLevel1/1000)*100} className="h-3 sm:h-4" />
            <div className="text-center">
              <Badge className="bg-orange-500 text-white font-bold text-xs sm:text-sm">
                {Math.round((ambassadorStats.teamProgressLevel1/1000)*100)}% Complete
              </Badge>
              <p className="text-xs sm:text-sm text-gray-600 mt-2 font-medium">
                ${(400 - (ambassadorStats.teamProgressLevel1 / 2500)).toFixed(0)} USD remaining
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Car Bonus */}
      <Card className="border-0 bg-gradient-to-br from-blue-50 to-cyan-50 shadow-xl">
        <CardHeader className="px-4 sm:px-6">
          <CardTitle className="text-gray-800 text-lg sm:text-xl font-black flex items-center">
            <Car className="w-5 h-5 sm:w-6 sm:h-6 mr-3 text-blue-500" />
            Car Bonus
          </CardTitle>
          <CardDescription className="font-semibold text-sm sm:text-base">
            Monthly team target: $2,400 USD
          </CardDescription>
        </CardHeader>
        <CardContent className="px-4 sm:px-6">
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-2xl sm:text-4xl font-black text-blue-600">
                ${(ambassadorStats.teamProgressLevel2 / 2500).toFixed(0)} USD
              </div>
              <div className="text-xs sm:text-sm text-gray-600 font-semibold">of $2,400 USD (This Month)</div>
            </div>
            <Progress value={(ambassadorStats.teamProgressLevel2/6000)*100} className="h-3 sm:h-4" />
            <div className="text-center">
              <Badge className="bg-blue-500 text-white font-bold text-xs sm:text-sm">
                {Math.round((ambassadorStats.teamProgressLevel2/6000)*100)}% Complete
              </Badge>
              <p className="text-xs sm:text-sm text-gray-600 mt-2 font-medium">
                ${(2400 - (ambassadorStats.teamProgressLevel2 / 2500)).toFixed(0)} USD remaining this month
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BonusProgress;
