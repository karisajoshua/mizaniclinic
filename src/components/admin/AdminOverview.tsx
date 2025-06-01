
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, DollarSign, Globe, TrendingUp, AlertTriangle, CheckCircle, Clock, Shield, Database, Activity } from "lucide-react";
import { useAmbassadorStats } from "@/hooks/useAmbassadorStats";
import { useCountryLimits } from "@/hooks/useCountryLimits";

const AdminOverview = () => {
  const { data: stats, isLoading: statsLoading } = useAmbassadorStats();
  const { data: countries, isLoading: countriesLoading } = useCountryLimits();

  const systemMetrics = [
    {
      title: "Total System Users",
      value: "1,247",
      icon: Users,
      color: "bg-blue-600",
      change: "+15.3%",
      trend: "up"
    },
    {
      title: "Platform Revenue",
      value: "$89,450",
      icon: DollarSign,
      color: "bg-emerald-600",
      change: "+23.8%",
      trend: "up"
    },
    {
      title: "Active Regions",
      value: countries?.length || 6,
      icon: Globe,
      color: "bg-purple-600",
      change: "100%",
      trend: "stable"
    },
    {
      title: "System Health",
      value: "99.8%",
      icon: Activity,
      color: "bg-orange-600",
      change: "+0.2%",
      trend: "up"
    }
  ];

  const systemAlerts = [
    { type: "warning", message: "Tanzania approaching 85% ambassador capacity", time: "5 min ago", priority: "high" },
    { type: "info", message: "Scheduled maintenance in 2 days", time: "1 hour ago", priority: "medium" },
    { type: "success", message: "Monthly payout batch completed successfully", time: "2 hours ago", priority: "low" },
    { type: "warning", message: "High payout request volume detected", time: "4 hours ago", priority: "high" },
  ];

  const pendingActions = [
    { action: "Approve 12 new ambassador applications", count: 12, urgent: true },
    { action: "Review 5 high-value payout requests", count: 5, urgent: true },
    { action: "Update regional commission rates", count: 3, urgent: false },
    { action: "Generate monthly financial report", count: 1, urgent: false },
  ];

  return (
    <div className="space-y-8">
      {/* System Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {systemMetrics.map((metric, index) => (
          <Card key={index} className="bg-slate-800 border-slate-700 shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">{metric.title}</CardTitle>
              <div className={`w-12 h-12 ${metric.color} rounded-lg flex items-center justify-center shadow-lg`}>
                <metric.icon className="w-6 h-6 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white mb-1">{metric.value}</div>
              <div className="flex items-center space-x-1">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span className="text-sm text-emerald-400 font-medium">{metric.change}</span>
                <span className="text-xs text-slate-400">vs last month</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* System Alerts */}
        <Card className="bg-slate-800 border-slate-700 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-white">
              <AlertTriangle className="w-5 h-5 text-yellow-400" />
              <span>System Alerts</span>
              <Badge variant="destructive" className="ml-2">4</Badge>
            </CardTitle>
            <CardDescription className="text-slate-400">Critical system notifications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {systemAlerts.map((alert, index) => (
                <div key={index} className="flex items-start space-x-3 p-4 bg-slate-900/50 rounded-lg border border-slate-700">
                  {alert.type === 'warning' ? (
                    <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5" />
                  ) : alert.type === 'success' ? (
                    <CheckCircle className="w-5 h-5 text-emerald-400 mt-0.5" />
                  ) : (
                    <Clock className="w-5 h-5 text-blue-400 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white">{alert.message}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-xs text-slate-400">{alert.time}</span>
                      <Badge 
                        variant={alert.priority === 'high' ? 'destructive' : alert.priority === 'medium' ? 'secondary' : 'outline'}
                        className="text-xs"
                      >
                        {alert.priority}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Pending Actions */}
        <Card className="bg-slate-800 border-slate-700 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-white">
              <Shield className="w-5 h-5 text-blue-400" />
              <span>Pending Admin Actions</span>
            </CardTitle>
            <CardDescription className="text-slate-400">Tasks requiring immediate attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingActions.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg border border-slate-700">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${item.urgent ? 'bg-red-400' : 'bg-blue-400'}`}></div>
                    <div>
                      <p className="text-sm font-medium text-white">{item.action}</p>
                      <span className="text-xs text-slate-400">Count: {item.count}</span>
                    </div>
                  </div>
                  <Button 
                    size="sm" 
                    variant={item.urgent ? "destructive" : "outline"}
                    className="text-xs"
                  >
                    {item.urgent ? 'Urgent' : 'Review'}
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Regional Status Grid */}
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

      {/* Quick Admin Actions */}
      <Card className="bg-slate-800 border-slate-700 shadow-xl">
        <CardHeader>
          <CardTitle className="text-white">Quick Administrative Actions</CardTitle>
          <CardDescription className="text-slate-400">Frequently used system operations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex flex-col space-y-2 border-slate-600 text-slate-300 hover:bg-slate-700">
              <Users className="w-6 h-6" />
              <span className="text-sm">User Management</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col space-y-2 border-slate-600 text-slate-300 hover:bg-slate-700">
              <DollarSign className="w-6 h-6" />
              <span className="text-sm">Process Payouts</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col space-y-2 border-slate-600 text-slate-300 hover:bg-slate-700">
              <Database className="w-6 h-6" />
              <span className="text-sm">System Backup</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col space-y-2 border-slate-600 text-slate-300 hover:bg-slate-700">
              <TrendingUp className="w-6 h-6" />
              <span className="text-sm">Generate Reports</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminOverview;
