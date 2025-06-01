
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BarChart3, TrendingUp, Users, DollarSign, Download, Filter } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";

const AdminAnalytics = () => {
  // Mock analytics data
  const growthData = [
    { month: 'Jan', ambassadors: 120, earnings: 15000 },
    { month: 'Feb', ambassadors: 180, earnings: 22000 },
    { month: 'Mar', ambassadors: 240, earnings: 31000 },
    { month: 'Apr', ambassadors: 320, earnings: 42000 },
    { month: 'May', ambassadors: 450, earnings: 58000 },
    { month: 'Jun', ambassadors: 650, earnings: 78000 }
  ];

  const countryData = [
    { name: 'Tanzania', value: 856, color: '#3B82F6' },
    { name: 'Kenya', value: 45, color: '#10B981' },
    { name: 'Uganda', value: 23, color: '#F59E0B' },
    { name: 'Rwanda', value: 18, color: '#EF4444' },
    { name: 'Burundi', value: 8, color: '#8B5CF6' },
    { name: 'DRC', value: 12, color: '#06B6D4' }
  ];

  const earningsBreakdown = [
    { type: 'Activation Pack', amount: 15750 },
    { type: 'Direct Sales', amount: 18900 },
    { type: 'Second Level', amount: 6750 },
    { type: 'Team Bonuses', amount: 3600 }
  ];

  const topPerformers = [
    { name: 'John Mwangi', region: 'Nairobi', referrals: 45, earnings: 1250 },
    { name: 'Mary Otieno', region: 'Mombasa', referrals: 38, earnings: 980 },
    { name: 'Peter Kimani', region: 'Dar es Salaam', referrals: 42, earnings: 1180 },
    { name: 'Sarah Mutesi', region: 'Kigali', referrals: 28, earnings: 750 },
    { name: 'Grace Uwimana', region: 'Bujumbura', referrals: 22, earnings: 620 }
  ];

  return (
    <div className="space-y-6">
      {/* Analytics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Growth Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">+124%</div>
            <p className="text-xs text-muted-foreground">Last 6 months</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">87%</div>
            <p className="text-xs text-muted-foreground">Registration to active</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Earnings</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">$52</div>
            <p className="text-xs text-muted-foreground">Per ambassador/month</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Retention Rate</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">94%</div>
            <p className="text-xs text-muted-foreground">3-month retention</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Growth Trends */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Growth Trends</span>
              <Button size="sm" variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </CardTitle>
            <CardDescription>Ambassador growth and earnings over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={growthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="ambassadors" stroke="#3B82F6" strokeWidth={2} />
                <Line type="monotone" dataKey="earnings" stroke="#10B981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Country Distribution */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Ambassador Distribution</CardTitle>
            <CardDescription>Breakdown by country</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={countryData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {countryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Earnings Analysis */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Earnings Analysis</CardTitle>
          <CardDescription>Breakdown of earnings by type</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={earningsBreakdown}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="type" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="amount" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Top Performers */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Top Performing Ambassadors</span>
            <div className="flex space-x-2">
              <Button size="sm" variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
              <Button size="sm" variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </CardTitle>
          <CardDescription>Highest earning ambassadors this month</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topPerformers.map((performer, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-semibold">{performer.name}</div>
                    <div className="text-sm text-gray-600">{performer.region}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-green-600">${performer.earnings}</div>
                  <div className="text-sm text-gray-600">{performer.referrals} referrals</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg">Activation Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm">Registration Rate</span>
                <span className="font-bold">23.5%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Activation Rate</span>
                <span className="font-bold">87.2%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">First Referral Rate</span>
                <span className="font-bold">72.8%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg">Financial KPIs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm">Revenue Growth</span>
                <span className="font-bold text-green-600">+45.2%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Payout Ratio</span>
                <span className="font-bold">31.4%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">ROI</span>
                <span className="font-bold text-blue-600">285%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg">Network Health</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm">Active Ratio</span>
                <span className="font-bold">94.3%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Avg. Team Size</span>
                <span className="font-bold">12.7</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Network Depth</span>
                <span className="font-bold">4.2 levels</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminAnalytics;
