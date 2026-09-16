import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Bike, Car } from "lucide-react";
import type { AmbassadorStats } from "@/types/dashboard";

interface BonusProgressProps {
  ambassadorStats: AmbassadorStats;
}

const pct = (current: number, target: number) =>
  target > 0 ? Math.min(100, Math.max(0, (current / target) * 100)) : 0;

const BonusProgress = ({ ambassadorStats }: BonusProgressProps) => {
  const MOTORBIKE_TARGET_USD = ambassadorStats.motorbikeTarget;
  const CAR_TARGET_USD = ambassadorStats.carTarget;
  const motorbikeUsd = ambassadorStats.teamProgressLevel1;
  const carUsd = ambassadorStats.teamProgressLevel2;

  const motorbikePct = pct(motorbikeUsd, MOTORBIKE_TARGET_USD);
  const carPct = pct(carUsd, CAR_TARGET_USD);

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
            Team total: ${MOTORBIKE_TARGET_USD} USD target
          </CardDescription>
        </CardHeader>
        <CardContent className="px-4 sm:px-6">
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-2xl sm:text-4xl font-black text-orange-600">
                ${motorbikeUsd.toFixed(2)} USD
              </div>
              <div className="text-xs sm:text-sm text-gray-600 font-semibold">of ${MOTORBIKE_TARGET_USD} USD</div>
            </div>
            <Progress value={motorbikePct} className="h-3 sm:h-4" />
            <div className="text-center">
              <Badge className="bg-orange-500 text-white font-bold text-xs sm:text-sm">
                {Math.round(motorbikePct)}% Complete
              </Badge>
              <p className="text-xs sm:text-sm text-gray-600 mt-2 font-medium">
                ${Math.max(0, MOTORBIKE_TARGET_USD - motorbikeUsd).toFixed(2)} USD remaining
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
            Monthly team target: ${CAR_TARGET_USD.toLocaleString()} USD
          </CardDescription>
        </CardHeader>
        <CardContent className="px-4 sm:px-6">
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-2xl sm:text-4xl font-black text-blue-600">
                ${carUsd.toFixed(2)} USD
              </div>
              <div className="text-xs sm:text-sm text-gray-600 font-semibold">
                of ${CAR_TARGET_USD.toLocaleString()} USD (This Month)
              </div>
            </div>
            <Progress value={carPct} className="h-3 sm:h-4" />
            <div className="text-center">
              <Badge className="bg-blue-500 text-white font-bold text-xs sm:text-sm">
                {Math.round(carPct)}% Complete
              </Badge>
              <p className="text-xs sm:text-sm text-gray-600 mt-2 font-medium">
                ${Math.max(0, CAR_TARGET_USD - carUsd).toFixed(2)} USD remaining this month
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BonusProgress;
