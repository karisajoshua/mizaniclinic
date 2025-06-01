
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Users, DollarSign, MapPin, Settings, BarChart3, Bell } from "lucide-react";
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
    // Simple admin check - in production, this should be based on database roles
    if (user?.email === "admin@mizaniclinic.com" || user?.email === "tessangelika@gmail.com") {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  }, [user]);

  if (loading || isAdmin === null) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-6 text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <CardTitle>Verifying Admin Access...</CardTitle>
          <CardDescription>Please wait while we check your permissions</CardDescription>
        </Card>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white py-6 px-4">
        <div className="container mx-auto">
          <h1 className="text-3xl font-black">Mizani Clinic Admin Dashboard</h1>
          <p className="text-gray-300 mt-2">Complete ambassador program management</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 lg:w-auto lg:grid-cols-6">
            <TabsTrigger value="overview" className="flex items-center space-x-2">
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="ambassadors" className="flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Ambassadors</span>
            </TabsTrigger>
            <TabsTrigger value="financial" className="flex items-center space-x-2">
              <DollarSign className="w-4 h-4" />
              <span className="hidden sm:inline">Financial</span>
            </TabsTrigger>
            <TabsTrigger value="geographic" className="flex items-center space-x-2">
              <MapPin className="w-4 h-4" />
              <span className="hidden sm:inline">Geographic</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center space-x-2">
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">Analytics</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center space-x-2">
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Settings</span>
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
