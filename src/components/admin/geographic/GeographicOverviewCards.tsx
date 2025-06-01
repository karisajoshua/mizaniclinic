
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Users, TrendingUp, Settings } from "lucide-react";
import type { Country } from "@/types/dashboard";

interface GeographicOverviewCardsProps {
  countries?: Country[];
}

const GeographicOverviewCards = ({ countries }: GeographicOverviewCardsProps) => {
  const totalAmbassadors = countries?.reduce((sum, country) => sum + country.count, 0) || 0;
  const totalCapacity = countries?.reduce((sum, country) => sum + country.limit, 0) || 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card className="border-0 shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Countries</CardTitle>
          <MapPin className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{countries?.length || 0}</div>
          <p className="text-xs text-muted-foreground">Operational regions</p>
        </CardContent>
      </Card>
      <Card className="border-0 shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Ambassadors</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalAmbassadors}</div>
          <p className="text-xs text-muted-foreground">Across all regions</p>
        </CardContent>
      </Card>
      <Card className="border-0 shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Capacity Utilization</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {totalCapacity > 0 ? Math.round((totalAmbassadors / totalCapacity) * 100) : 0}%
          </div>
          <p className="text-xs text-muted-foreground">{totalAmbassadors}/{totalCapacity} slots</p>
        </CardContent>
      </Card>
      <Card className="border-0 shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Premium Regions</CardTitle>
          <Settings className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">1</div>
          <p className="text-xs text-muted-foreground">Tanzania unlocked</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default GeographicOverviewCards;
