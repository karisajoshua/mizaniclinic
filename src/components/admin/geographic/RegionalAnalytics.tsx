import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { Country } from "@/types/dashboard";
import type { CountryStat } from "@/hooks/useAdminData";

interface RegionalAnalyticsProps {
  countries?: Country[];
  stats?: Record<string, CountryStat>;
}

const RegionalAnalytics = ({ countries, stats }: RegionalAnalyticsProps) => {
  const rows = (countries ?? []).map((c) => ({
    ...c,
    stat: stats?.[c.name],
    total: stats?.[c.name]?.total ?? c.count,
    growth: stats?.[c.name]?.growthPercent ?? 0,
  }));

  const hasData = rows.length > 0;
  const topPerforming = hasData
    ? [...rows].sort((a, b) => b.total - a.total)[0]
    : undefined;
  const fastestGrowing = hasData
    ? [...rows].sort((a, b) => b.growth - a.growth)[0]
    : undefined;
  const needsAttention = hasData
    ? [...rows].sort((a, b) => a.total - b.total)[0]
    : undefined;

  const tiles = [
    {
      title: "Top Performing Region",
      entry: topPerforming,
      wrapper: "p-4 bg-blue-50 border-blue-200",
      heading: "font-semibold text-blue-800 mb-2",
      detail: "text-sm text-blue-600",
    },
    {
      title: "Fastest Growing",
      entry: fastestGrowing,
      wrapper: "p-4 bg-green-50 border-green-200",
      heading: "font-semibold text-green-800 mb-2",
      detail: "text-sm text-green-600",
    },
    {
      title: "Needs Attention",
      entry: needsAttention,
      wrapper: "p-4 bg-yellow-50 border-yellow-200",
      heading: "font-semibold text-yellow-800 mb-2",
      detail: "text-sm text-yellow-600",
    },
  ];

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle>Regional Performance Analytics</CardTitle>
        <CardDescription>Growth trends and performance metrics by region</CardDescription>
      </CardHeader>
      <CardContent>
        {!hasData ? (
          <p className="text-sm text-muted-foreground">No regional data available yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {tiles.map(({ title, entry, wrapper, heading, detail }) => (
              <Card key={title} className={wrapper}>
                <h4 className={heading}>{title}</h4>
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">{entry?.flag}</span>
                  <div>
                    <div className="font-bold">{entry?.name}</div>
                    <div className={detail}>
                      {entry?.total} ambassadors • {(entry?.growth ?? 0) >= 0 ? "+" : ""}
                      {entry?.growth}% growth
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RegionalAnalytics;
