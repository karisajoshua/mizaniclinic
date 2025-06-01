
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Plus } from "lucide-react";
import { useCountryLimits } from "@/hooks/useCountryLimits";
import GeographicOverviewCards from "./geographic/GeographicOverviewCards";
import CountryManagementCards from "./geographic/CountryManagementCards";
import RegionalAnalytics from "./geographic/RegionalAnalytics";

const AdminGeographicManagement = () => {
  const { data: countries, isLoading } = useCountryLimits();

  const handleUpdateLimit = (countryCode: string, newLimit: number) => {
    console.log(`Updating limit for ${countryCode} to ${newLimit}`);
    // In production, this would update the database
  };

  const handleTogglePremium = (countryCode: string) => {
    console.log(`Toggling premium status for ${countryCode}`);
    // In production, this would update the premium_unlocked status
  };

  const handleAddNewCountry = () => {
    console.log("Adding new country");
    // In production, this would open a modal to add a new country
  };

  return (
    <div className="space-y-6">
      {/* Geographic Overview */}
      <GeographicOverviewCards countries={countries} />

      {/* Country Management */}
      <Card className="bg-slate-800 border-slate-700 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-white">
            <span className="flex items-center space-x-2">
              <MapPin className="w-6 h-6 text-blue-400" />
              <span>Country Limits Management</span>
            </span>
            <Button onClick={handleAddNewCountry} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Add New Country
            </Button>
          </CardTitle>
          <CardDescription className="text-slate-400">
            Manage ambassador limits and premium status for each country
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CountryManagementCards 
            countries={countries}
            onUpdateLimit={handleUpdateLimit}
            onTogglePremium={handleTogglePremium}
          />
        </CardContent>
      </Card>

      {/* Regional Performance */}
      <RegionalAnalytics />
    </div>
  );
};

export default AdminGeographicManagement;
