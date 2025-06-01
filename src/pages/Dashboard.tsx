import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { TrendingUp, Coins, Users, Trophy, Download } from "lucide-react";
import MobileHeader from "@/components/MobileHeader";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import QuickStats from "@/components/dashboard/QuickStats";
import ReferralCodeSharing from "@/components/dashboard/ReferralCodeSharing";
import EarningsOverview from "@/components/dashboard/EarningsOverview";
import CountryDistribution from "@/components/dashboard/CountryDistribution";
import RecentReferrals from "@/components/dashboard/RecentReferrals";
import BonusProgress from "@/components/dashboard/BonusProgress";
import CommissionTierStatus from "@/components/dashboard/CommissionTierStatus";
import AmbassadorTools from "@/components/dashboard/AmbassadorTools";
import type { UserAccount, AmbassadorStats, Country, Referral } from "@/types/dashboard";
import { useAuth } from "@/hooks/useAuth";

const Dashboard = () => {
  const [userAccount, setUserAccount] = useState<UserAccount | null>(null);
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/signin');
      return;
    }

    if (user) {
      // Create a mock user account for now - in a real app this would come from the profiles table
      const mockAccount: UserAccount = {
        fullName: user.user_metadata?.full_name || user.email || "User",
        region: "Dar es Salaam", // This would come from the profiles table
        userReferralId: "MC-DAR-" + user.id.slice(0, 6).toUpperCase()
      };
      setUserAccount(mockAccount);
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50 px-4">
        <Card className="p-6 sm:p-8 text-center border-0 bg-white/80 backdrop-blur-sm shadow-glass max-w-md w-full">
          <CardTitle className="text-gray-800 mb-4">Loading...</CardTitle>
          <CardDescription>Please wait while we load your dashboard</CardDescription>
        </Card>
      </div>
    );
  }

  if (!user) {
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

  if (!userAccount) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50 px-4">
        <Card className="p-6 sm:p-8 text-center border-0 bg-white/80 backdrop-blur-sm shadow-glass max-w-md w-full">
          <CardTitle className="text-gray-800 mb-4">Setting up your account...</CardTitle>
          <CardDescription>Please wait while we prepare your dashboard</CardDescription>
        </Card>
      </div>
    );
  }

  // Mock data for demonstration (converted to USD)
  const ambassadorStats: AmbassadorStats = {
    totalEarnings: 15750,
    activationPackEarnings: 4500,
    directReferralEarnings: 7250,
    secondLevelEarnings: 3200,
    teamProgressLevel1: 750, // out of 1000 for motorbike
    teamProgressLevel2: 2100, // out of 6000 for car (monthly)
    totalReferrals: 31,
    activeReferrals: 29,
    pendingReferrals: 2,
    referralsByCountry: {
      Tanzania: 18,
      Kenya: 7,
      Uganda: 4,
      Rwanda: 2,
      Burundi: 0,
      DRC: 0
    },
    ambassadorLimit: 856, // out of 1000
    currentCommissionTier: "Standard",
    nextPayoutDate: "2024-02-01"
  };

  const countries: Country[] = [
    { name: "Tanzania", flag: "🇹🇿", count: ambassadorStats.referralsByCountry.Tanzania, limit: 100 },
    { name: "Kenya", flag: "🇰🇪", count: ambassadorStats.referralsByCountry.Kenya, limit: 100 },
    { name: "Uganda", flag: "🇺🇬", count: ambassadorStats.referralsByCountry.Uganda, limit: 100 },
    { name: "Rwanda", flag: "🇷🇼", count: ambassadorStats.referralsByCountry.Rwanda, limit: 100 },
    { name: "Burundi", flag: "🇧🇮", count: ambassadorStats.referralsByCountry.Burundi, limit: 100 },
    { name: "DRC", flag: "🇨🇩", count: ambassadorStats.referralsByCountry.DRC, limit: 100 }
  ];

  const recentReferrals: Referral[] = [
    { name: "John Mkwawa", joinDate: "2024-01-15", location: "Dar es Salaam", status: "Active" },
    { name: "Sarah Mwalimu", joinDate: "2024-01-20", location: "Arusha", status: "Active" },
    { name: "David Kimario", joinDate: "2024-01-25", location: "Mwanza", status: "Pending" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-yellow-50 to-orange-50">
      <MobileHeader />
      <DashboardHeader userAccount={userAccount} />

      <div className="px-3 sm:px-4 py-6 sm:py-8">
        <div className="container mx-auto max-w-6xl">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 mb-6 sm:mb-8 bg-white/90 backdrop-blur-sm shadow-lg h-auto p-1">
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
            </TabsList>

            <TabsContent value="overview" className="space-y-4 sm:space-y-6">
              <QuickStats ambassadorStats={ambassadorStats} />
              <ReferralCodeSharing userAccount={userAccount} />
            </TabsContent>

            <TabsContent value="earnings" className="space-y-4 sm:space-y-6">
              <EarningsOverview ambassadorStats={ambassadorStats} />
            </TabsContent>

            <TabsContent value="referrals" className="space-y-4 sm:space-y-6">
              <CountryDistribution countries={countries} />
              <RecentReferrals referrals={recentReferrals} />
            </TabsContent>

            <TabsContent value="bonuses" className="space-y-4 sm:space-y-6">
              <BonusProgress ambassadorStats={ambassadorStats} />
              <CommissionTierStatus ambassadorStats={ambassadorStats} />
            </TabsContent>

            <TabsContent value="tools" className="space-y-4 sm:space-y-6">
              <AmbassadorTools />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
