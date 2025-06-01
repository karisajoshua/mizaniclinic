
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { MapPin, Users, TrendingUp, Settings, Plus } from "lucide-react";
import { useCountryLimits } from "@/hooks/useCountryLimits";

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

  const totalAmbassadors = countries?.reduce((sum, country) => sum + country.count, 0) || 0;
  const totalCapacity = countries?.reduce((sum, country) => sum + country.limit, 0) || 0;

  return (
    <div className="space-y-6">
      {/* Geographic Overview */}
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

      {/* Country Management */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center space-x-2">
              <MapPin className="w-6 h-6 text-blue-500" />
              <span>Country Limits Management</span>
            </span>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add New Country
            </Button>
          </CardTitle>
          <CardDescription>Manage ambassador limits and premium status for each country</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {countries?.map((country, index) => (
              <Card key={index} className="border-2 border-gray-200 hover:border-blue-300 transition-all">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-3xl">{country.flag}</span>
                      <div>
                        <h3 className="font-bold text-lg">{country.name}</h3>
                        <p className="text-sm text-gray-500">East Africa Region</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge 
                        variant={country.count > country.limit * 0.8 ? "destructive" : "default"}
                        className="mb-2"
                      >
                        {country.count}/{country.limit}
                      </Badge>
                      <div className="text-xs text-gray-500">
                        {Math.round((country.count / country.limit) * 100)}% filled
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Progress Bar */}
                  <div>
                    <Progress 
                      value={(country.count / country.limit) * 100} 
                      className="h-3"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>{country.count} ambassadors</span>
                      <span>{country.limit - country.count} slots remaining</span>
                    </div>
                  </div>

                  {/* Limit Management */}
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Ambassador Limit</label>
                      <div className="flex space-x-2 mt-1">
                        <Input
                          type="number"
                          defaultValue={country.limit}
                          className="flex-1"
                        />
                        <Button size="sm" onClick={() => handleUpdateLimit(country.name, country.limit)}>
                          Update
                        </Button>
                      </div>
                    </div>

                    {/* Premium Status */}
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-sm font-medium">Premium Tier</span>
                        <p className="text-xs text-gray-500">Enhanced commission rates</p>
                      </div>
                      <Button
                        size="sm"
                        variant={country.name === "Tanzania" ? "default" : "outline"}
                        onClick={() => handleTogglePremium(country.name)}
                      >
                        {country.name === "Tanzania" ? "Enabled" : "Enable"}
                      </Button>
                    </div>

                    {/* Performance Metrics */}
                    <div className="grid grid-cols-2 gap-3 pt-2 border-t">
                      <div className="text-center">
                        <div className="text-lg font-bold text-green-600">85%</div>
                        <div className="text-xs text-gray-500">Activation Rate</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-blue-600">$2,450</div>
                        <div className="text-xs text-gray-500">Avg. Earnings</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Regional Performance */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Regional Performance Analytics</CardTitle>
          <CardDescription>Growth trends and performance metrics by region</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-4 bg-blue-50 border-blue-200">
              <h4 className="font-semibold text-blue-800 mb-2">Top Performing Region</h4>
              <div className="flex items-center space-x-2">
                <span className="text-2xl">🇹🇿</span>
                <div>
                  <div className="font-bold">Tanzania</div>
                  <div className="text-sm text-blue-600">856 ambassadors • 85% growth</div>
                </div>
              </div>
            </Card>
            <Card className="p-4 bg-green-50 border-green-200">
              <h4 className="font-semibold text-green-800 mb-2">Fastest Growing</h4>
              <div className="flex items-center space-x-2">
                <span className="text-2xl">🇰🇪</span>
                <div>
                  <div className="font-bold">Kenya</div>
                  <div className="text-sm text-green-600">45 ambassadors • 120% growth</div>
                </div>
              </div>
            </Card>
            <Card className="p-4 bg-yellow-50 border-yellow-200">
              <h4 className="font-semibold text-yellow-800 mb-2">Needs Attention</h4>
              <div className="flex items-center space-x-2">
                <span className="text-2xl">🇧🇮</span>
                <div>
                  <div className="font-bold">Burundi</div>
                  <div className="text-sm text-yellow-600">8 ambassadors • 15% growth</div>
                </div>
              </div>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminGeographicManagement;
