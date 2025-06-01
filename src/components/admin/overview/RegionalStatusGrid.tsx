
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCountryLimits } from "@/hooks/useCountryLimits";

const RegionalStatusGrid = () => {
  const { data: countries } = useCountryLimits();

  return (
    <Card className="bg-slate-800 border-slate-700 shadow-xl">
      <CardHeader>
        <CardTitle className="text-white">Regional Operations Status</CardTitle>
        <CardDescription className="text-slate-400">Real-time status across all regions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {countries?.map((country, index) => (
            <div key={index} className="p-6 bg-slate-900/50 rounded-lg border border-slate-700">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <span className="text-3xl">{country.flag}</span>
                  <div>
                    <h3 className="font-bold text-white text-lg">{country.name}</h3>
                    <p className="text-sm text-slate-400">East Africa</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge 
                    variant={country.count > country.limit * 0.8 ? "destructive" : "default"}
                    className="mb-2"
                  >
                    {country.count}/{country.limit}
                  </Badge>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      country.count > country.limit * 0.8 ? 'bg-red-500' : 'bg-blue-500'
                    }`}
                    style={{ width: `${(country.count / country.limit) * 100}%` }}
                  ></div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-slate-400">Status:</span>
                    <span className="text-emerald-400 font-medium ml-2">Active</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Growth:</span>
                    <span className="text-blue-400 font-medium ml-2">+12%</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RegionalStatusGrid;
