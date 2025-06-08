
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams, useLocation } from "react-router-dom";
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
import { supabase } from "@/integrations/supabase/client";

const Dashboard = () => {
  const [userAccount, setUserAccount] = useState<UserAccount | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const location = useLocation();

  // Check if user just completed payment
  const paymentJustCompleted = location.state?.paymentJustCompleted;

  useEffect(() => {
    // Check for appointment success/cancellation
    if (searchParams.get('appointment_success') === 'true') {
      toast({
        title: "Payment Successful!",
        description: "Your appointment has been confirmed. You'll receive a confirmation email shortly.",
      });
      setActiveTab("appointments");
      navigate('/dashboard', { replace: true });
    } else if (searchParams.get('appointment_cancelled') === 'true') {
      toast({
        title: "Payment Cancelled",
        description: "Your appointment booking was cancelled. You can try again anytime.",
        variant: "destructive",
      });
      setActiveTab("appointments");
      navigate('/dashboard', { replace: true });
    }
  }, [searchParams, navigate]);

  useEffect(() => {
    console.log('Dashboard useEffect - loading:', loading, 'user:', user?.id, 'paymentJustCompleted:', paymentJustCompleted);
    
    if (!loading && !user) {
      console.log('No user found, redirecting to signin');
      navigate('/signin');
      return;
    }

    if (user) {
      console.log('User found, fetching user data');
      fetchUserData();
    }
  }, [user, loading, navigate, paymentJustCompleted]);

  const fetchUserData = async (isRetry = false) => {
    if (!user) {
      console.log('No user available for data fetch');
      return;
    }

    try {
      console.log(`Starting fetchUserData for user: ${user.id} ${isRetry ? '(retry)' : ''}`);
      
      // If payment was just completed, add a small delay to ensure DB consistency
      if (paymentJustCompleted && !isRetry) {
        console.log('Payment just completed, adding delay for DB consistency...');
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      // Fetch user profile from database
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      console.log('Profile fetch result:', { profile, profileError });

      if (profileError) {
        console.error('Error fetching profile:', profileError);
        
        // If this is the first attempt and we just completed payment, retry once
        if (!isRetry && paymentJustCompleted && retryCount < 2) {
          console.log('Retrying data fetch after payment completion...');
          setRetryCount(prev => prev + 1);
          setTimeout(() => fetchUserData(true), 2000);
          return;
        }
        
        handleFallbackData();
        return;
      }

      if (profile) {
        console.log('Processing profile data:', profile);
        
        // Check for ambassador ID in either field - more flexible approach
        const ambassadorId = profile.user_referral_id || profile.ambassador_id || "";
        console.log('Ambassador ID found:', ambassadorId);
        
        const accountData: UserAccount = {
          fullName: profile.full_name || user.user_metadata?.full_name || "User",
          region: profile.region || "Dar es Salaam",
          userReferralId: ambassadorId
        };

        setUserAccount(accountData);
        setIsLoadingUser(false);

        // Update localStorage with current data
        localStorage.setItem('userAccount', JSON.stringify({
          ...accountData,
          hasAmbassadorId: Boolean(ambassadorId)
        }));

        // If payment was just completed, clear the state to prevent issues on refresh
        if (paymentJustCompleted) {
          navigate('/dashboard', { replace: true, state: {} });
        }
      } else {
        console.log('No profile found, using fallback data');
        handleFallbackData();
      }
    } catch (error) {
      console.error('Error in fetchUserData:', error);
      
      // If this is the first attempt and we just completed payment, retry once
      if (!isRetry && paymentJustCompleted && retryCount < 2) {
        console.log('Retrying data fetch due to error after payment completion...');
        setRetryCount(prev => prev + 1);
        setTimeout(() => fetchUserData(true), 2000);
        return;
      }
      
      handleFallbackData();
    }
  };

  const handleFallbackData = () => {
    console.log('Using fallback data approach');
    setIsLoadingUser(false);
    
    // Check localStorage as fallback
    const storedUserAccount = localStorage.getItem('userAccount');
    const registrationData = localStorage.getItem('registrationData');
    
    console.log('Stored data check:', { storedUserAccount, registrationData, paymentJustCompleted });
    
    if (storedUserAccount) {
      const accountData = JSON.parse(storedUserAccount);
      console.log('Using stored account data:', accountData);
      setUserAccount(accountData);
    } else if (registrationData) {
      const regData = JSON.parse(registrationData);
      console.log('Using registration data:', regData);
      const mockAccount: UserAccount = {
        fullName: regData.fullName || "User",
        region: regData.region || "Dar es Salaam",
        userReferralId: regData.ambassadorId || ""
      };
      setUserAccount(mockAccount);
    } else {
      console.log('Using default fallback for existing user');
      // Create default account for existing users
      const mockAccount: UserAccount = {
        fullName: user?.user_metadata?.full_name || "User",
        region: "Dar es Salaam",
        userReferralId: "MCA25-T0001DSM" // Default format
      };
      setUserAccount(mockAccount);
    }
  };

  if (loading || isLoadingUser) {
    console.log('Showing loading state');
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50 px-4">
        <Card className="p-6 sm:p-8 text-center border-0 bg-white/80 backdrop-blur-sm shadow-glass max-w-md w-full">
          <CardTitle className="text-gray-800 mb-4">Loading...</CardTitle>
          <CardDescription>Setting up your dashboard...</CardDescription>
        </Card>
      </div>
    );
  }

  if (!user || !userAccount) {
    console.log('No user or account data, showing access denied');
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

  console.log('Rendering main dashboard for user:', userAccount.fullName);

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
