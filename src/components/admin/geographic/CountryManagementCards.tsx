
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import type { Country } from "@/types/dashboard";

interface CountryManagementCardsProps {
  countries?: Country[];
  onUpdateLimit: (countryCode: string, newLimit: number) => void;
  onTogglePremium: (countryCode: string) => void;
}

const CountryManagementCards = ({ countries, onUpdateLimit, onTogglePremium }: CountryManagementCardsProps) => {
  return (
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
                  <Button size="sm" onClick={() => onUpdateLimit(country.name, country.limit)}>
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
                  onClick={() => onTogglePremium(country.name)}
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
  );
};

export default CountryManagementCards;
