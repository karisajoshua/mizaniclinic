
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Users, DollarSign, MapPin, Settings, BarChart3, Shield, Database, Activity } from "lucide-react";
import AdminAmbassadorManagement from "@/components/admin/AdminAmbassadorManagement";
import AdminFinancialManagement from "@/components/admin/AdminFinancialManagement";
import AdminGeographicManagement from "@/components/admin/AdminGeographicManagement";
import AdminSystemConfiguration from "@/components/admin/AdminSystemConfiguration";
import AdminAnalytics from "@/components/admin/AdminAnalytics";
import AdminOverview from "@/components/admin/AdminOverview";

const Admin = () => {
  const { user, loading } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    console.log("Admin page - user:", user?.email);
    if (user?.email === "admin@mizaniclinic.com" || user?.email === "tessangelika@gmail.com") {
      setIsAdmin(true);
      console.log("Admin access granted");
    } else {
      setIsAdmin(false);
      console.log("Admin access denied");
    }
  }, [user]);

  if (loading || isAdmin === null) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <Card className="p-8 text-center bg-slate-800 border-slate-700">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-6 text-blue-400" />
          <CardTitle className="text-white text-xl mb-2">Verifying Admin Access...</CardTitle>
          <CardDescription className="text-slate-400">Checking system permissions</CardDescription>
        </Card>
      </div>
    );
  }

  if (!user || !isAdmin) {
    console.log("Redirecting to home - user:", user?.email, "isAdmin:", isAdmin);
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Admin Header */}
      <div className="bg-gradient-to-r from-slate-800 via-slate-900 to-blue-900 border-b border-slate-700">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <Shield className="w-8 h-8 text-blue-400" />
                <h1 className="text-3xl font-black text-white">System Administration</h1>
              </div>
              <p className="text-slate-300">Mizani Clinic Ambassador Program Control Center</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-sm text-slate-400">Logged in as</div>
                <div className="text-white font-semibold">{user.email}</div>
              </div>
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
          
          {/* System Status Bar */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
              <div className="flex items-center space-x-2">
                <Activity className="w-4 h-4 text-green-400" />
                <span className="text-sm text-slate-300">System Status</span>
              </div>
              <div className="text-green-400 font-semibold">Online</div>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
              <div className="flex items-center space-x-2">
                <Database className="w-4 h-4 text-blue-400" />
                <span className="text-sm text-slate-300">Database</span>
              </div>
              <div className="text-blue-400 font-semibold">Connected</div>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-purple-400" />
                <span className="text-sm text-slate-300">Active Users</span>
              </div>
              <div className="text-purple-400 font-semibold">1,247</div>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
              <div className="flex items-center space-x-2">
                <DollarSign className="w-4 h-4 text-yellow-400" />
                <span className="text-sm text-slate-300">Pending Payouts</span>
              </div>
              <div className="text-yellow-400 font-semibold">$12,450</div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="bg-slate-800 border-slate-700 grid w-full grid-cols-6 lg:w-auto lg:grid-cols-6">
            <TabsTrigger 
              value="overview" 
              className="flex items-center space-x-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white text-slate-300"
            >
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger 
              value="ambassadors" 
              className="flex items-center space-x-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white text-slate-300"
            >
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Users</span>
            </TabsTrigger>
            <TabsTrigger 
              value="financial" 
              className="flex items-center space-x-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white text-slate-300"
            >
              <DollarSign className="w-4 h-4" />
              <span className="hidden sm:inline">Finance</span>
            </TabsTrigger>
            <TabsTrigger 
              value="geographic" 
              className="flex items-center space-x-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white text-slate-300"
            >
              <MapPin className="w-4 h-4" />
              <span className="hidden sm:inline">Regions</span>
            </TabsTrigger>
            <TabsTrigger 
              value="analytics" 
              className="flex items-center space-x-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white text-slate-300"
            >
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">Analytics</span>
            </TabsTrigger>
            <TabsTrigger 
              value="settings" 
              className="flex items-center space-x-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white text-slate-300"
            >
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Config</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <AdminOverview />
          </TabsContent>

          <TabsContent value="ambassadors">
            <AdminAmbassadorManagement />
          </TabsContent>

          <TabsContent value="financial">
            <AdminFinancialManagement />
          </TabsContent>

          <TabsContent value="geographic">
            <AdminGeographicManagement />
          </TabsContent>

          <TabsContent value="analytics">
            <AdminAnalytics />
          </TabsContent>

          <TabsContent value="settings">
            <AdminSystemConfiguration />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
