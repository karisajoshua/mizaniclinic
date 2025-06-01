
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Globe } from "lucide-react";
import type { Country } from "@/types/dashboard";

interface CountryDistributionProps {
  countries: Country[];
}

const CountryDistribution = ({ countries }: CountryDistributionProps) => {
  return (
    <Card className="border-0 bg-white/90 backdrop-blur-sm shadow-xl animate-fade-in">
      <CardHeader className="px-4 sm:px-6">
        <CardTitle className="text-gray-800 text-lg sm:text-xl font-black flex items-center">
          <Globe className="w-5 h-5 sm:w-6 sm:h-6 mr-3 text-blue-500" />
          Your Global Team
        </CardTitle>
        <CardDescription className="font-semibold text-sm sm:text-base">
          Referrals across East Africa (100 max per country)
        </CardDescription>
      </CardHeader>
      <CardContent className="px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {countries.map((country, index) => (
            <Card key={index} className="p-3 sm:p-4 border-2 border-gray-200 hover:border-blue-300 transition-all duration-300">
              <div className="flex items-center justify-between mb-2 sm:mb-3">
                <div className="flex items-center space-x-2">
                  <span className="text-lg sm:text-2xl">{country.flag}</span>
                  <span className="font-bold text-gray-800 text-sm sm:text-base">{country.name}</span>
                </div>
                <Badge variant={country.count > 0 ? "default" : "secondary"} className="font-bold text-xs">
                  {country.count}/{country.limit}
                </Badge>
              </div>
              <Progress value={(country.count/country.limit)*100} className="h-2 mb-2" />
              <p className="text-xs text-gray-500 font-medium">
                {country.limit - country.count} slots remaining
              </p>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CountryDistribution;
