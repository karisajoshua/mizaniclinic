
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { TrendingUp, Coins, Users, Trophy, Download, Calendar, Eye } from "lucide-react";
import MobileHeader from "@/components/MobileHeader";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import ReferralCodeSharing from "@/components/dashboard/ReferralCodeSharing";
import AmbassadorTools from "@/components/dashboard/AmbassadorTools";
import AppointmentBooking from "@/components/appointments/AppointmentBooking";
import AppointmentsList from "@/components/appointments/AppointmentsList";
import IrisAnalysis from "@/components/iris/IrisAnalysis";
import RealTimeStats from "@/components/dashboard/RealTimeStats";
import type { UserAccount } from "@/types/dashboard";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Dashboard = () => {
  const [userAccount, setUserAccount] = useState<UserAccount | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [hasCompletedPayment, setHasCompletedPayment] = useState(false);
  const [isLoadingPaymentStatus, setIsLoadingPaymentStatus] = useState(true);
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
        
        // More comprehensive payment completion check
        const hasAmbassadorId = Boolean(ambassadorId);
        const paymentConfirmed = profile.payment_status === 'confirmed';
        const isActiveStatus = profile.status === 'active' || profile.status === 'activated';
        
        console.log('Payment status check:', { 
          hasAmbassadorId, 
          paymentConfirmed, 
          isActiveStatus, 
          ambassadorId,
          status: profile.status,
          paymentStatus: profile.payment_status,
          paymentJustCompleted
        });
        
        // If user has an ambassador ID and either confirmed payment OR active status, they're good
        // OR if payment was just completed, trust that state
        const paymentCompleted = hasAmbassadorId && (paymentConfirmed || isActiveStatus || paymentJustCompleted);
        console.log('Final payment completed status:', paymentCompleted);
        
        setHasCompletedPayment(paymentCompleted);
        setIsLoadingPaymentStatus(false);

        // Update localStorage with current data
        localStorage.setItem('userAccount', JSON.stringify({
          ...accountData,
          paymentConfirmed: paymentCompleted
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
    setIsLoadingPaymentStatus(false);
    
    // Check localStorage as fallback
    const storedUserAccount = localStorage.getItem('userAccount');
    const registrationData = localStorage.getItem('registrationData');
    
    console.log('Stored data check:', { storedUserAccount, registrationData, paymentJustCompleted });
    
    if (storedUserAccount) {
      const accountData = JSON.parse(storedUserAccount);
      console.log('Using stored account data:', accountData);
      setUserAccount(accountData);
      // If payment was just completed, trust that the payment is confirmed
      const paymentStatus = paymentJustCompleted || (accountData.paymentConfirmed && accountData.userReferralId);
      setHasCompletedPayment(paymentStatus);
    } else if (registrationData) {
      const regData = JSON.parse(registrationData);
      console.log('Using registration data:', regData);
      const mockAccount: UserAccount = {
        fullName: regData.fullName || "User",
        region: regData.region || "Dar es Salaam",
        userReferralId: regData.ambassadorId || ""
      };
      setUserAccount(mockAccount);
      // If payment was just completed, they should have access
      setHasCompletedPayment(paymentJustCompleted || false);
    } else {
      console.log('Using default fallback for existing user');
      // Create default account for existing users
      const mockAccount: UserAccount = {
        fullName: user?.user_metadata?.full_name || "User",
        region: "Dar es Salaam",
        userReferralId: "MCA25-T0001DSM" // Default format
      };
      setUserAccount(mockAccount);
      setHasCompletedPayment(true); // Assume existing users have paid
    }
  };

  if (loading || isLoadingPaymentStatus) {
    console.log('Showing loading state');
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50 px-4">
        <Card className="p-6 sm:p-8 text-center border-0 bg-white/80 backdrop-blur-sm shadow-glass max-w-md w-full">
          <CardTitle className="text-gray-800 mb-4">Loading...</CardTitle>
          <CardDescription>Checking your account status...</CardDescription>
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

  if (!hasCompletedPayment && userAccount) {
    console.log('Payment not completed, showing payment required screen');
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
        <MobileHeader />
        <div className="px-3 sm:px-4 py-6 sm:py-8">
          <div className="container mx-auto max-w-4xl">
            <Card className="p-6 sm:p-8 text-center border-0 bg-white/80 backdrop-blur-sm shadow-glass">
              <CardTitle className="text-gray-800 mb-4 text-2xl">Payment Required</CardTitle>
              <CardDescription className="mb-6 text-lg">
                Complete your payment to activate your Ambassador dashboard and receive your unique referral code.
              </CardDescription>
              <div className="space-y-4">
                <p className="text-sm text-gray-600">Your registration details:</p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p><strong>Name:</strong> {userAccount.fullName}</p>
                  <p><strong>Region:</strong> {userAccount.region}</p>
                  <p className="text-orange-600 font-semibold mt-2">⏳ Your Ambassador ID will be assigned after payment</p>
                </div>
                <Link to="/payment">
                  <Button className="w-full max-w-md bg-gradient-to-r from-tanzania-green to-tanzania-green-light hover:from-tanzania-green-light hover:to-tanzania-green text-white">
                    Complete Payment
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>
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
            <TabsList className="grid w-full grid-cols-3 lg:grid-cols-7 mb-6 sm:mb-8 bg-white/90 backdrop-blur-sm shadow-lg h-auto p-1">
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
              <TabsTrigger value="iris" className="flex flex-col sm:flex-row items-center space-y-1 sm:space-y-0 sm:space-x-2 py-2 sm:py-3 data-[state=active]:bg-green-500 data-[state=active]:text-white">
                <Eye className="w-4 h-4" />
                <span className="text-xs sm:text-sm font-bold">Iris Scan</span>
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

            <TabsContent value="iris" className="space-y-4 sm:space-y-6">
              <IrisAnalysis />
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
