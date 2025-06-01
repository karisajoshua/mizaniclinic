
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, DollarSign, Globe, TrendingUp, AlertCircle, CheckCircle } from "lucide-react";
import { useAmbassadorStats } from "@/hooks/useAmbassadorStats";
import { useCountryLimits } from "@/hooks/useCountryLimits";

const AdminOverview = () => {
  const { data: stats, isLoading: statsLoading } = useAmbassadorStats();
  const { data: countries, isLoading: countriesLoading } = useCountryLimits();

  const overviewStats = [
    {
      title: "Total Ambassadors",
      value: "856",
      icon: Users,
      color: "bg-blue-500",
      change: "+12%"
    },
    {
      title: "Total Earnings",
      value: "$45,230",
      icon: DollarSign,
      color: "bg-green-500",
      change: "+8.2%"
    },
    {
      title: "Active Countries",
      value: countries?.length || 6,
      icon: Globe,
      color: "bg-purple-500",
      change: "6/6"
    },
    {
      title: "Monthly Growth",
      value: "23.5%",
      icon: TrendingUp,
      color: "bg-orange-500",
      change: "+5.3%"
    }
  ];

  const recentActivities = [
    { type: "new_ambassador", message: "New ambassador joined from Kenya", time: "2 minutes ago", status: "success" },
    { type: "payout", message: "Monthly payout processed for 45 ambassadors", time: "1 hour ago", status: "success" },
    { type: "limit_reached", message: "Tanzania approaching ambassador limit (850/1000)", time: "3 hours ago", status: "warning" },
    { type: "promotion", message: "5 ambassadors promoted to Premium tier", time: "5 hours ago", status: "success" },
  ];

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {overviewStats.map((stat, index) => (
          <Card key={index} className="border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
              <div className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <p className="text-xs text-green-600 font-medium">
                {stat.change} from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-blue-500" />
              <span>Recent Activities</span>
            </CardTitle>
            <CardDescription>Latest system activities and alerts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  {activity.status === 'success' ? (
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-yellow-500 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="h-auto py-4 flex flex-col space-y-2">
                <Users className="w-6 h-6" />
                <span className="text-sm">Approve Ambassadors</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex flex-col space-y-2">
                <DollarSign className="w-6 h-6" />
                <span className="text-sm">Process Payouts</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex flex-col space-y-2">
                <Globe className="w-6 h-6" />
                <span className="text-sm">Update Limits</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex flex-col space-y-2">
                <TrendingUp className="w-6 h-6" />
                <span className="text-sm">View Reports</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Country Performance Summary */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Country Performance Summary</CardTitle>
          <CardDescription>Ambassador distribution across regions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {countries?.map((country, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">{country.flag}</span>
                    <span className="font-semibold">{country.name}</span>
                  </div>
                  <Badge variant={country.count > country.limit * 0.8 ? "destructive" : "default"}>
                    {country.count}/{country.limit}
                  </Badge>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${(country.count / country.limit) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminOverview;
