
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { TrendingUp, Coins, Users, Trophy, Download, Calendar } from "lucide-react";
import MobileHeader from "@/components/MobileHeader";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import ReferralCodeSharing from "@/components/dashboard/ReferralCodeSharing";
import AmbassadorTools from "@/components/dashboard/AmbassadorTools";
import AppointmentBooking from "@/components/appointments/AppointmentBooking";
import AppointmentsList from "@/components/appointments/AppointmentsList";
import RealTimeStats from "@/components/dashboard/RealTimeStats";
import type { UserAccount } from "@/types/dashboard";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";

const Dashboard = () => {
  const [userAccount, setUserAccount] = useState<UserAccount | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // Check for appointment success/cancellation
    if (searchParams.get('appointment_success') === 'true') {
      toast({
        title: "Payment Successful!",
        description: "Your appointment has been confirmed. You'll receive a confirmation email shortly.",
      });
      setActiveTab("appointments");
      // Clean up URL parameters
      navigate('/dashboard', { replace: true });
    } else if (searchParams.get('appointment_cancelled') === 'true') {
      toast({
        title: "Payment Cancelled",
        description: "Your appointment booking was cancelled. You can try again anytime.",
        variant: "destructive",
      });
      setActiveTab("appointments");
      // Clean up URL parameters
      navigate('/dashboard', { replace: true });
    }
  }, [searchParams, navigate]);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/signin');
      return;
    }

    if (user) {
      // For now, use mock data. In a real app, fetch from Supabase
      const mockAccount: UserAccount = {
        fullName: user.user_metadata?.full_name || "User",
        region: "Dar es Salaam",
        userReferralId: `MZ${user.id.slice(0, 8).toUpperCase()}`
      };
      setUserAccount(mockAccount);
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50 px-4">
        <Card className="p-6 sm:p-8 text-center border-0 bg-white/80 backdrop-blur-sm shadow-glass max-w-md w-full">
          <CardTitle className="text-gray-800 mb-4">Loading...</CardTitle>
        </Card>
      </div>
    );
  }

  if (!user || !userAccount) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50 px-4">
        <Card className="p-6 sm:p-8 text-center border-0 bg-white/80 backdrop-blur-sm shadow-glass max-w-md w-full">
          <CardTitle className="text-gray-800 mb-4">Access Denied</CardTitle>
          <CardDescription className="mb-4">Please sign in to access your dashboard</CardDescription>
          <Link to="/signin">
            <Button className="w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-600 text-white">
              Sign In
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-yellow-50 to-orange-50">
      <MobileHeader />
      <DashboardHeader userAccount={userAccount} />

      <div className="px-3 sm:px-4 py-6 sm:py-8">
        <div className="container mx-auto max-w-6xl">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6 mb-6 sm:mb-8 bg-white/90 backdrop-blur-sm shadow-lg h-auto p-1">
              <TabsTrigger value="overview" className="flex flex-col sm:flex-row items-center space-y-1 sm:space-y-0 sm:space-x-2 py-2 sm:py-3 data-[state=active]:bg-green-500 data-[state=active]:text-white">
                <TrendingUp className="w-4 h-4" />
                <span className="text-xs sm:text-sm font-bold">Overview</span>
              </TabsTrigger>
              <TabsTrigger value="earnings" className="flex flex-col sm:flex-row items-center space-y-1 sm:space-y-0 sm:space-x-2 py-2 sm:py-3 data-[state=active]:bg-green-500 data-[state=active]:text-white">
                <Coins className="w-4 h-4" />
                <span className="text-xs sm:text-sm font-bold">5 Ways</span>
              </TabsTrigger>
              <TabsTrigger value="referrals" className="flex flex-col sm:flex-row items-center space-y-1 sm:space-y-0 sm:space-x-2 py-2 sm:py-3 data-[state=active]:bg-green-500 data-[state=active]:text-white">
                <Users className="w-4 h-4" />
                <span className="text-xs sm:text-sm font-bold">Team</span>
              </TabsTrigger>
              <TabsTrigger value="bonuses" className="flex flex-col sm:flex-row items-center space-y-1 sm:space-y-0 sm:space-x-2 py-2 sm:py-3 data-[state=active]:bg-green-500 data-[state=active]:text-white">
                <Trophy className="w-4 h-4" />
                <span className="text-xs sm:text-sm font-bold">Bonuses</span>
              </TabsTrigger>
              <TabsTrigger value="tools" className="flex flex-col sm:flex-row items-center space-y-1 sm:space-y-0 sm:space-x-2 py-2 sm:py-3 data-[state=active]:bg-green-500 data-[state=active]:text-white">
                <Download className="w-4 h-4" />
                <span className="text-xs sm:text-sm font-bold">Tools</span>
              </TabsTrigger>
              <TabsTrigger value="appointments" className="flex flex-col sm:flex-row items-center space-y-1 sm:space-y-0 sm:space-x-2 py-2 sm:py-3 data-[state=active]:bg-green-500 data-[state=active]:text-white">
                <Calendar className="w-4 h-4" />
                <span className="text-xs sm:text-sm font-bold">Appointments</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4 sm:space-y-6">
              <RealTimeStats activeTab="overview" />
              <ReferralCodeSharing userAccount={userAccount} />
            </TabsContent>

            <TabsContent value="earnings" className="space-y-4 sm:space-y-6">
              <RealTimeStats activeTab="earnings" />
            </TabsContent>

            <TabsContent value="referrals" className="space-y-4 sm:space-y-6">
              <RealTimeStats activeTab="referrals" />
            </TabsContent>

            <TabsContent value="bonuses" className="space-y-4 sm:space-y-6">
              <RealTimeStats activeTab="bonuses" />
            </TabsContent>

            <TabsContent value="tools" className="space-y-4 sm:space-y-6">
              <AmbassadorTools />
            </TabsContent>

            <TabsContent value="appointments" className="space-y-4 sm:space-y-6">
              <Tabs defaultValue="book" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="book">Book New Appointment</TabsTrigger>
                  <TabsTrigger value="manage">My Appointments</TabsTrigger>
                </TabsList>
                <TabsContent value="book">
                  <AppointmentBooking />
                </TabsContent>
                <TabsContent value="manage">
                  <AppointmentsList />
                </TabsContent>
              </Tabs>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
