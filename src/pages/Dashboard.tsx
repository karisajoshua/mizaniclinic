
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Users, 
  Coins, 
  Calendar, 
  Share2, 
  Copy, 
  MapPin,
  Phone,
  TrendingUp,
  Clock,
  Star,
  CheckCircle
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import MobileHeader from "@/components/MobileHeader";

const Dashboard = () => {
  const [userAccount, setUserAccount] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const account = localStorage.getItem('userAccount');
    if (!account) {
      navigate('/register');
      return;
    }
    setUserAccount(JSON.parse(account));
  }, [navigate]);

  const copyReferralCode = () => {
    if (userAccount?.userReferralId) {
      navigator.clipboard.writeText(userAccount.userReferralId);
      toast({
        title: "Copied!",
        description: "Referral code copied to clipboard",
      });
    }
  };

  const shareWhatsApp = () => {
    const message = `Join Mizani Clinic's referral program and start earning! Use my code: ${userAccount?.userReferralId}. Register at: ${window.location.origin}/register`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  if (!userAccount) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50">
        <Card className="p-8 text-center border-0 bg-white/80 backdrop-blur-sm shadow-glass">
          <CardTitle className="text-tanzania-navy mb-4">Access Denied</CardTitle>
          <CardDescription className="mb-4">Please complete registration and payment first</CardDescription>
          <Link to="/register">
            <Button className="bg-gradient-to-r from-tanzania-green to-green-500 hover:from-green-500 hover:to-tanzania-green text-white">
              Go to Registration
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  const mockReferrals = [
    { name: "John Mkwawa", joinDate: "2024-01-15", location: "Dar es Salaam", status: "Active" },
    { name: "Sarah Mwalimu", joinDate: "2024-01-20", location: "Arusha", status: "Active" },
    { name: "David Kimario", joinDate: "2024-01-25", location: "Mwanza", status: "Pending" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <MobileHeader />

      {/* Welcome Header */}
      <div className="bg-gradient-to-br from-tanzania-navy via-blue-900 to-tanzania-navy text-white py-6 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            <div className="animate-fade-in">
              <h1 className="text-2xl sm:text-3xl font-bold">Welcome back, {userAccount.fullName}!</h1>
              <p className="text-blue-200 flex items-center mt-1">
                <MapPin className="w-4 h-4 mr-1" />
                {userAccount.region}
              </p>
            </div>
            <div className="text-left sm:text-right animate-slide-in">
              <p className="text-sm text-blue-200">Your Referral ID</p>
              <div className="flex items-center space-x-2">
                <p className="font-mono font-bold text-tanzania-green text-lg">{userAccount.userReferralId}</p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={copyReferralCode}
                  className="h-8 w-8 p-0 text-white hover:bg-white/10"
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 py-8">
        <div className="container mx-auto max-w-6xl">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 mb-8 bg-white/80 backdrop-blur-sm shadow-lg h-auto p-1">
              <TabsTrigger value="overview" className="flex flex-col sm:flex-row items-center space-y-1 sm:space-y-0 sm:space-x-2 py-3 data-[state=active]:bg-tanzania-green data-[state=active]:text-white">
                <TrendingUp className="w-4 h-4" />
                <span className="text-xs sm:text-sm font-medium">Overview</span>
              </TabsTrigger>
              <TabsTrigger value="referrals" className="flex flex-col sm:flex-row items-center space-y-1 sm:space-y-0 sm:space-x-2 py-3 data-[state=active]:bg-tanzania-green data-[state=active]:text-white">
                <Users className="w-4 h-4" />
                <span className="text-xs sm:text-sm font-medium">Referrals</span>
              </TabsTrigger>
              <TabsTrigger value="commissions" className="flex flex-col sm:flex-row items-center space-y-1 sm:space-y-0 sm:space-x-2 py-3 data-[state=active]:bg-tanzania-green data-[state=active]:text-white">
                <Coins className="w-4 h-4" />
                <span className="text-xs sm:text-sm font-medium">Earnings</span>
              </TabsTrigger>
              <TabsTrigger value="booking" className="flex flex-col sm:flex-row items-center space-y-1 sm:space-y-0 sm:space-x-2 py-3 data-[state=active]:bg-tanzania-green data-[state=active]:text-white">
                <Calendar className="w-4 h-4" />
                <span className="text-xs sm:text-sm font-medium">Booking</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Quick Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in">
                {[
                  {
                    title: "Total Referrals",
                    value: "3",
                    change: "+1 this week",
                    icon: Users,
                    color: "from-blue-500 to-blue-600",
                    changeColor: "text-green-600"
                  },
                  {
                    title: "Total Earnings",
                    value: "TSH 1,500",
                    change: "+TSH 500 this week",
                    icon: Coins,
                    color: "from-green-500 to-green-600",
                    changeColor: "text-green-600"
                  },
                  {
                    title: "Pending",
                    value: "1",
                    change: "Payment pending",
                    icon: Clock,
                    color: "from-orange-500 to-orange-600",
                    changeColor: "text-orange-600"
                  },
                  {
                    title: "Next Appointment",
                    value: "Not Scheduled",
                    change: "Book now",
                    icon: Calendar,
                    color: "from-purple-500 to-purple-600",
                    changeColor: "text-tanzania-text"
                  }
                ].map((stat, index) => (
                  <Card key={index} className="group border-0 bg-white/80 backdrop-blur-sm hover:bg-white/90 transition-all duration-300 hover:shadow-glass-hover animate-scale-in" style={{animationDelay: `${index * 0.1}s`}}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-xs sm:text-sm text-tanzania-text font-medium">{stat.title}</CardTitle>
                        <div className={`w-8 h-8 bg-gradient-to-br ${stat.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                          <stat.icon className="w-4 h-4 text-white" />
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-lg sm:text-xl font-bold text-tanzania-navy">{stat.value}</div>
                      <p className={`text-xs ${stat.changeColor}`}>{stat.change}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Referral Code Sharing */}
              <Card className="border-0 bg-gradient-to-br from-tanzania-green/5 to-green-50 shadow-glass animate-slide-in">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-tanzania-navy">
                    <Share2 className="w-5 h-5 text-tanzania-green" />
                    <span>Share Your Referral Code</span>
                  </CardTitle>
                  <CardDescription>
                    Earn TSH 500 for each person who registers using your code
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col lg:flex-row items-center space-y-4 lg:space-y-0 lg:space-x-4">
                    <Card className="flex-1 w-full p-4 bg-white/70 border-2 border-dashed border-tanzania-green rounded-xl">
                      <p className="text-sm text-tanzania-text mb-1">Your Referral Code:</p>
                      <p className="text-xl sm:text-2xl font-mono font-bold text-tanzania-green">{userAccount.userReferralId}</p>
                    </Card>
                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full lg:w-auto">
                      <Button 
                        onClick={copyReferralCode}
                        variant="outline" 
                        className="border-tanzania-green text-tanzania-green hover:bg-tanzania-green hover:text-white rounded-xl"
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        Copy
                      </Button>
                      <Button 
                        onClick={shareWhatsApp}
                        className="bg-green-500 hover:bg-green-600 text-white rounded-xl"
                      >
                        <Share2 className="w-4 h-4 mr-2" />
                        WhatsApp
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="referrals" className="space-y-6">
              <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-glass animate-fade-in">
                <CardHeader>
                  <CardTitle className="text-tanzania-navy">People You've Referred</CardTitle>
                  <CardDescription>Track everyone who signed up using your code</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {mockReferrals.map((referral, index) => (
                      <Card key={index} className="border-0 bg-gradient-to-r from-white to-blue-50/50 hover:from-blue-50 hover:to-green-50 transition-all duration-300 p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-tanzania-green to-green-500 rounded-2xl flex items-center justify-center shadow-lg">
                              <Users className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <p className="font-semibold text-tanzania-navy text-lg">{referral.name}</p>
                              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 text-sm text-tanzania-text/70">
                                <span className="flex items-center">
                                  <MapPin className="w-3 h-3 mr-1" />
                                  {referral.location}
                                </span>
                                <span>Joined: {referral.joinDate}</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              referral.status === 'Active' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-orange-100 text-orange-800'
                            }`}>
                              {referral.status}
                            </span>
                            {referral.status === 'Active' && (
                              <p className="text-sm text-tanzania-green font-semibold mt-1">+TSH 500</p>
                            )}
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="commissions" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in">
                <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-glass">
                  <CardHeader>
                    <CardTitle className="text-tanzania-navy">Commission Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {[
                      { period: "Today", amount: "TSH 500" },
                      { period: "Last 7 days", amount: "TSH 1,000" },
                      { period: "Last 30 days", amount: "TSH 1,500" }
                    ].map((item, index) => (
                      <div key={index} className="flex justify-between items-center py-2 border-b border-tanzania-grey/30 last:border-b-0">
                        <span className="text-tanzania-text">{item.period}</span>
                        <span className="font-bold text-tanzania-navy text-lg">{item.amount}</span>
                      </div>
                    ))}
                    <div className="border-t pt-4 mt-4">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-tanzania-navy text-lg">Total Earned</span>
                        <span className="font-bold text-2xl text-tanzania-green">TSH 1,500</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-glass">
                  <CardHeader>
                    <CardTitle className="text-tanzania-navy">Payout Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <Card className="bg-gradient-to-br from-blue-50 to-green-50 border-0 p-4">
                        <p className="text-sm text-tanzania-text mb-2">Next Payout</p>
                        <p className="font-bold text-tanzania-navy">Monthly - End of January</p>
                      </Card>
                      <Card className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200 p-4">
                        <p className="text-sm text-green-800 mb-2">Available for Payout</p>
                        <p className="font-bold text-green-900 text-2xl">TSH 1,000</p>
                      </Card>
                      <Button className="w-full bg-gradient-to-r from-tanzania-green to-green-500 hover:from-green-500 hover:to-tanzania-green text-white rounded-xl">
                        Request Payout
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="booking" className="space-y-6">
              <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-glass animate-fade-in">
                <CardHeader>
                  <CardTitle className="text-tanzania-navy">Book Appointment with Mizani Clinic</CardTitle>
                  <CardDescription>Select an available time slot for your consultation</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold text-tanzania-navy mb-4 flex items-center">
                        <Calendar className="w-5 h-5 mr-2 text-tanzania-green" />
                        Available This Week
                      </h3>
                      <div className="space-y-3">
                        {['Monday 10:00 AM', 'Tuesday 2:00 PM', 'Wednesday 11:00 AM', 'Friday 3:00 PM'].map((time, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            className="w-full justify-start border-2 border-tanzania-grey/50 hover:border-tanzania-green hover:bg-tanzania-green hover:text-white rounded-xl transition-all duration-300"
                          >
                            <Calendar className="w-4 h-4 mr-2" />
                            {time}
                          </Button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-tanzania-navy mb-4 flex items-center">
                        <Calendar className="w-5 h-5 mr-2 text-tanzania-green" />
                        Next Week
                      </h3>
                      <div className="space-y-3">
                        {['Monday 9:00 AM', 'Tuesday 1:00 PM', 'Thursday 10:00 AM', 'Friday 4:00 PM'].map((time, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            className="w-full justify-start border-2 border-tanzania-grey/50 hover:border-tanzania-green hover:bg-tanzania-green hover:text-white rounded-xl transition-all duration-300"
                          >
                            <Calendar className="w-4 h-4 mr-2" />
                            {time}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <Card className="mt-6 bg-gradient-to-br from-blue-50 to-green-50 border-0 p-4">
                    <h4 className="font-semibold text-tanzania-navy mb-3 flex items-center">
                      <CheckCircle className="w-5 h-5 mr-2 text-tanzania-green" />
                      Consultation Details
                    </h4>
                    <ul className="text-sm text-tanzania-text/70 space-y-2">
                      <li className="flex items-center">
                        <div className="w-2 h-2 bg-tanzania-green rounded-full mr-3"></div>
                        Duration: 30 minutes
                      </li>
                      <li className="flex items-center">
                        <div className="w-2 h-2 bg-tanzania-green rounded-full mr-3"></div>
                        Location: Mizani Clinic, Dar es Salaam
                      </li>
                      <li className="flex items-center">
                        <div className="w-2 h-2 bg-tanzania-green rounded-full mr-3"></div>
                        Fee: Included in your membership
                      </li>
                      <li className="flex items-center">
                        <div className="w-2 h-2 bg-tanzania-green rounded-full mr-3"></div>
                        Cancellation: Up to 24 hours before
                      </li>
                    </ul>
                  </Card>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
