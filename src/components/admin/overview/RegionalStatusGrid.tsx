import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCountryLimits } from "@/hooks/useCountryLimits";
import { useAdminCountryStats } from "@/hooks/useAdminData";

const RegionalStatusGrid = () => {
  const { data: countries } = useCountryLimits();
  const { data: stats } = useAdminCountryStats();

  return (
    <Card className="bg-slate-800 border-slate-700 shadow-xl">
      <CardHeader>
        <CardTitle className="text-white">Regional Operations Status</CardTitle>
        <CardDescription className="text-slate-400">Real-time status across all regions</CardDescription>
      </CardHeader>
      <CardContent>
        {!countries || countries.length === 0 ? (
          <p className="text-slate-400 text-sm">No regions configured yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {countries.map((country) => {
              const stat = stats?.[country.name];
              const registered = stat?.total ?? country.count;
              const limit = country.limit || 1;
              const percent = Math.min(100, (registered / limit) * 100);
              const nearCapacity = registered > limit * 0.8;
              const growth = stat?.growthPercent ?? 0;

              return (
                <div key={country.code || country.name} className="p-6 bg-slate-900/50 rounded-lg border border-slate-700">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <span className="text-3xl">{country.flag}</span>
                      <div>
                        <h3 className="font-bold text-white text-lg">{country.name}</h3>
                        <p className="text-sm text-slate-400">{country.code || "East Africa"}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant={nearCapacity ? "destructive" : "default"} className="mb-2">
                        {registered}/{limit}
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${nearCapacity ? 'bg-red-500' : 'bg-blue-500'}`}
                        style={{ width: `${percent}%` }}
                      ></div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-slate-400">Status:</span>
                        <span
                          className={`font-medium ml-2 ${
                            registered >= limit
                              ? 'text-red-400'
                              : nearCapacity
                                ? 'text-yellow-400'
                                : 'text-emerald-400'
                          }`}
                        >
                          {registered >= limit ? 'Full' : nearCapacity ? 'Near capacity' : 'Active'}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400">Growth:</span>
                        <span
                          className={`font-medium ml-2 ${growth >= 0 ? 'text-blue-400' : 'text-red-400'}`}
                        >
                          {growth >= 0 ? '+' : ''}{growth}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RegionalStatusGrid;
