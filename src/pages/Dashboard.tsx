
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
  ArrowLeft, 
  MapPin,
  Phone,
  TrendingUp,
  Clock
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

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
    const message = `Join Dr. Mwaka's referral program and start earning! Use my code: ${userAccount?.userReferralId}. Register at: ${window.location.origin}/register`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  if (!userAccount) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-tanzania-grey">
        <Card className="p-8 text-center">
          <CardTitle className="text-tanzania-navy mb-4">Access Denied</CardTitle>
          <CardDescription className="mb-4">Please complete registration and payment first</CardDescription>
          <Link to="/register">
            <Button className="bg-tanzania-green hover:bg-tanzania-green-light">
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
    <div className="min-h-screen bg-gradient-to-br from-tanzania-grey to-white">
      {/* Header */}
      <header className="bg-tanzania-navy text-white py-4 px-6">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Link to="/">
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Home
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-bold">Welcome, {userAccount.fullName}</h1>
              <p className="text-sm opacity-80">{userAccount.region}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm opacity-80">Your Referral ID</p>
            <p className="font-mono font-bold text-tanzania-green">{userAccount.userReferralId}</p>
          </div>
        </div>
      </header>

      <div className="py-8 px-6">
        <div className="container mx-auto max-w-6xl">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="overview" className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4" />
                <span>Overview</span>
              </TabsTrigger>
              <TabsTrigger value="referrals" className="flex items-center space-x-2">
                <Users className="w-4 h-4" />
                <span>Referrals</span>
              </TabsTrigger>
              <TabsTrigger value="commissions" className="flex items-center space-x-2">
                <Coins className="w-4 h-4" />
                <span>Earnings</span>
              </TabsTrigger>
              <TabsTrigger value="booking" className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>Book Appointment</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-fade-in">
                <Card className="border-2 border-tanzania-grey hover:border-tanzania-green transition-all">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm text-tanzania-text">Total Referrals</CardTitle>
                      <Users className="w-4 h-4 text-tanzania-green" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-tanzania-navy">3</div>
                    <p className="text-xs text-green-600">+1 this week</p>
                  </CardContent>
                </Card>

                <Card className="border-2 border-tanzania-grey hover:border-tanzania-green transition-all">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm text-tanzania-text">Total Earnings</CardTitle>
                      <Coins className="w-4 h-4 text-tanzania-green" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-tanzania-navy">KES 1,500</div>
                    <p className="text-xs text-green-600">+KES 500 this week</p>
                  </CardContent>
                </Card>

                <Card className="border-2 border-tanzania-grey hover:border-tanzania-green transition-all">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm text-tanzania-text">Pending</CardTitle>
                      <Clock className="w-4 h-4 text-orange-500" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-tanzania-navy">1</div>
                    <p className="text-xs text-orange-600">Payment pending</p>
                  </CardContent>
                </Card>

                <Card className="border-2 border-tanzania-grey hover:border-tanzania-green transition-all">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm text-tanzania-text">Next Appointment</CardTitle>
                      <Calendar className="w-4 h-4 text-tanzania-green" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm font-bold text-tanzania-navy">Not Scheduled</div>
                    <p className="text-xs text-tanzania-text">Book now</p>
                  </CardContent>
                </Card>
              </div>

              {/* Referral Code Sharing */}
              <Card className="border-2 border-tanzania-green animate-slide-in">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-tanzania-navy">
                    <Share2 className="w-5 h-5 text-tanzania-green" />
                    <span>Share Your Referral Code</span>
                  </CardTitle>
                  <CardDescription>
                    Earn KES 500 for each person who registers using your code
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-4">
                    <div className="flex-1 p-4 bg-tanzania-grey rounded-lg border-2 border-dashed border-tanzania-green">
                      <p className="text-sm text-tanzania-text mb-1">Your Referral Code:</p>
                      <p className="text-2xl font-mono font-bold text-tanzania-green">{userAccount.userReferralId}</p>
                    </div>
                    <div className="space-x-2">
                      <Button 
                        onClick={copyReferralCode}
                        variant="outline" 
                        className="border-tanzania-green text-tanzania-green hover:bg-tanzania-green hover:text-white"
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        Copy
                      </Button>
                      <Button 
                        onClick={shareWhatsApp}
                        className="bg-green-500 hover:bg-green-600 text-white"
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
              <Card className="animate-fade-in">
                <CardHeader>
                  <CardTitle className="text-tanzania-navy">People You've Referred</CardTitle>
                  <CardDescription>Track everyone who signed up using your code</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockReferrals.map((referral, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border border-tanzania-grey rounded-lg hover:border-tanzania-green transition-all">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-tanzania-green rounded-full flex items-center justify-center">
                            <Users className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="font-semibold text-tanzania-navy">{referral.name}</p>
                            <div className="flex items-center space-x-4 text-sm text-tanzania-text">
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
                            <p className="text-sm text-tanzania-green font-semibold mt-1">+KES 500</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="commissions" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
                <Card className="border-2 border-tanzania-grey">
                  <CardHeader>
                    <CardTitle className="text-tanzania-navy">Commission Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-tanzania-text">Today</span>
                      <span className="font-bold text-tanzania-navy">KES 500</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-tanzania-text">Last 7 days</span>
                      <span className="font-bold text-tanzania-navy">KES 1,000</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-tanzania-text">Last 30 days</span>
                      <span className="font-bold text-tanzania-navy">KES 1,500</span>
                    </div>
                    <div className="border-t pt-4">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-tanzania-navy">Total Earned</span>
                        <span className="font-bold text-xl text-tanzania-green">KES 1,500</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-2 border-tanzania-grey">
                  <CardHeader>
                    <CardTitle className="text-tanzania-navy">Payout Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 bg-tanzania-grey rounded-lg">
                        <p className="text-sm text-tanzania-text mb-2">Next Payout</p>
                        <p className="font-bold text-tanzania-navy">Monthly - End of January</p>
                      </div>
                      <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                        <p className="text-sm text-green-800 mb-2">Available for Payout</p>
                        <p className="font-bold text-green-900 text-xl">KES 1,000</p>
                      </div>
                      <Button className="w-full bg-tanzania-green hover:bg-tanzania-green-light">
                        Request Payout
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="booking" className="space-y-6">
              <Card className="animate-fade-in">
                <CardHeader>
                  <CardTitle className="text-tanzania-navy">Book Appointment with Dr. Mwaka</CardTitle>
                  <CardDescription>Select an available time slot for your consultation</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold text-tanzania-navy mb-4">Available This Week</h3>
                      <div className="space-y-3">
                        {['Monday 10:00 AM', 'Tuesday 2:00 PM', 'Wednesday 11:00 AM', 'Friday 3:00 PM'].map((time, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            className="w-full justify-start border-tanzania-grey hover:border-tanzania-green hover:bg-tanzania-green hover:text-white"
                          >
                            <Calendar className="w-4 h-4 mr-2" />
                            {time}
                          </Button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-tanzania-navy mb-4">Next Week</h3>
                      <div className="space-y-3">
                        {['Monday 9:00 AM', 'Tuesday 1:00 PM', 'Thursday 10:00 AM', 'Friday 4:00 PM'].map((time, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            className="w-full justify-start border-tanzania-grey hover:border-tanzania-green hover:bg-tanzania-green hover:text-white"
                          >
                            <Calendar className="w-4 h-4 mr-2" />
                            {time}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-tanzania-navy mb-2">Consultation Details</h4>
                    <ul className="text-sm text-tanzania-text space-y-1">
                      <li>• Duration: 30 minutes</li>
                      <li>• Location: Dr. Mwaka's Clinic, Dar es Salaam</li>
                      <li>• Fee: Included in your membership</li>
                      <li>• Cancellation: Up to 24 hours before</li>
                    </ul>
                  </div>
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
