import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import type { Country } from "@/types/dashboard";
import type { CountryStat } from "@/hooks/useAdminData";

interface CountryManagementCardsProps {
  countries?: Country[];
  stats?: Record<string, CountryStat>;
  onUpdateLimit: (countryCode: string, newLimit: number) => void;
  onTogglePremium: (countryCode: string, premium: boolean) => void;
  isUpdating?: boolean;
}

const CountryCard = ({
  country,
  stat,
  onUpdateLimit,
  onTogglePremium,
  isUpdating,
}: {
  country: Country;
  stat?: CountryStat;
  onUpdateLimit: (countryCode: string, newLimit: number) => void;
  onTogglePremium: (countryCode: string, premium: boolean) => void;
  isUpdating?: boolean;
}) => {
  const [limitValue, setLimitValue] = useState(String(country.limit));
  const registered = stat?.total ?? country.count;
  const active = stat?.active ?? 0;
  const limit = country.limit || 1;
  const percent = Math.min(100, Math.round((registered / limit) * 100));

  return (
    <Card className="border-2 border-gray-200 hover:border-blue-300 transition-all">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-3xl">{country.flag}</span>
            <div>
              <h3 className="font-bold text-lg">{country.name}</h3>
              <p className="text-sm text-gray-500">{country.code || "East Africa Region"}</p>
            </div>
          </div>
          <div className="text-right">
            <Badge
              variant={registered > limit * 0.8 ? "destructive" : "default"}
              className="mb-2"
            >
              {registered}/{limit}
            </Badge>
            <div className="text-xs text-gray-500">{percent}% filled</div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Progress value={percent} className="h-3" />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>{active} active ambassadors</span>
            <span>{Math.max(0, limit - registered)} slots remaining</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <span className="text-gray-500">New (30d):</span>
            <span className="font-medium ml-2">{stat?.last30Days ?? 0}</span>
          </div>
          <div>
            <span className="text-gray-500">Growth:</span>
            <span
              className={`font-medium ml-2 ${
                (stat?.growthPercent ?? 0) >= 0 ? "text-emerald-600" : "text-red-600"
              }`}
            >
              {(stat?.growthPercent ?? 0) >= 0 ? "+" : ""}
              {stat?.growthPercent ?? 0}%
            </span>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium text-gray-700">Ambassador Limit</label>
            <div className="flex space-x-2 mt-1">
              <Input
                type="number"
                min={1}
                value={limitValue}
                onChange={(e) => setLimitValue(e.target.value)}
                className="flex-1"
              />
              <Button
                size="sm"
                disabled={isUpdating || !country.code}
                onClick={() => {
                  const parsed = parseInt(limitValue, 10);
                  if (!Number.isNaN(parsed) && country.code) {
                    onUpdateLimit(country.code, parsed);
                  }
                }}
              >
                Update
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm font-medium">Premium Tier</span>
              <p className="text-xs text-gray-500">Enhanced commission rates</p>
            </div>
            <Button
              size="sm"
              disabled={isUpdating || !country.code}
              variant={country.premiumUnlocked ? "default" : "outline"}
              onClick={() => country.code && onTogglePremium(country.code, !country.premiumUnlocked)}
            >
              {country.premiumUnlocked ? "Unlocked" : "Locked"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const CountryManagementCards = ({
  countries,
  stats,
  onUpdateLimit,
  onTogglePremium,
  isUpdating,
}: CountryManagementCardsProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {countries?.map((country) => (
        <CountryCard
          key={country.code || country.name}
          country={country}
          stat={stats?.[country.name]}
          onUpdateLimit={onUpdateLimit}
          onTogglePremium={onTogglePremium}
          isUpdating={isUpdating}
        />
      ))}
    </div>
  );
};

export default CountryManagementCards;
