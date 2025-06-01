
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
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
  CheckCircle,
  Trophy,
  Target,
  Zap,
  Gift,
  Download,
  Car,
  Bike,
  Globe,
  Award,
  DollarSign,
  BarChart3,
  Flag
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
        title: "Copied! 🎉",
        description: "Referral code copied to clipboard",
      });
    }
  };

  const shareWhatsApp = () => {
    const message = `🎉 Jiunge na Mizani Clinic Ambassador program! Start earning TSH 500+ per referral! Use my code: ${userAccount?.userReferralId}. Register here: ${window.location.origin}/register 💰🚀`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const downloadFlyer = () => {
    toast({
      title: "Download Started! 📱",
      description: "WhatsApp flyer is being downloaded",
    });
  };

  if (!userAccount) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50">
        <Card className="p-8 text-center border-0 bg-white/80 backdrop-blur-sm shadow-glass">
          <CardTitle className="text-tanzania-navy mb-4">Access Denied 🔒</CardTitle>
          <CardDescription className="mb-4">Complete registration and payment first</CardDescription>
          <Link to="/register">
            <Button className="bg-gradient-to-r from-tanzania-green to-green-500 hover:from-green-500 hover:to-tanzania-green text-white">
              Go to Registration 🚀
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  // Mock data for demonstration
  const ambassadorStats = {
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

  const countries = [
    { name: "Tanzania", flag: "🇹🇿", count: ambassadorStats.referralsByCountry.Tanzania, limit: 100 },
    { name: "Kenya", flag: "🇰🇪", count: ambassadorStats.referralsByCountry.Kenya, limit: 100 },
    { name: "Uganda", flag: "🇺🇬", count: ambassadorStats.referralsByCountry.Uganda, limit: 100 },
    { name: "Rwanda", flag: "🇷🇼", count: ambassadorStats.referralsByCountry.Rwanda, limit: 100 },
    { name: "Burundi", flag: "🇧🇮", count: ambassadorStats.referralsByCountry.Burundi, limit: 100 },
    { name: "DRC", flag: "🇨🇩", count: ambassadorStats.referralsByCountry.DRC, limit: 100 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-yellow-50 to-orange-50">
      <MobileHeader />

      {/* Celebration Header */}
      <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white py-6 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-30"></div>
        <div className="container mx-auto relative">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            <div className="animate-fade-in">
              <h1 className="text-2xl sm:text-3xl font-black">Karibu, {userAccount.fullName}! 🎉</h1>
              <p className="text-green-200 flex items-center mt-1 font-semibold">
                <MapPin className="w-4 h-4 mr-1" />
                {userAccount.region} • Ambassador Level 2 ⭐
              </p>
            </div>
            <div className="text-left sm:text-right animate-slide-in">
              <p className="text-sm text-green-200">Your Ambassador ID</p>
              <div className="flex items-center space-x-2">
                <p className="font-mono font-black text-yellow-300 text-lg border-2 border-yellow-300 px-3 py-1 rounded-lg">{userAccount.userReferralId}</p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={copyReferralCode}
                  className="h-8 w-8 p-0 text-white hover:bg-white/10 border border-white/30"
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
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 mb-8 bg-white/90 backdrop-blur-sm shadow-lg h-auto p-1">
              <TabsTrigger value="overview" className="flex flex-col sm:flex-row items-center space-y-1 sm:space-y-0 sm:space-x-2 py-3 data-[state=active]:bg-green-500 data-[state=active]:text-white">
                <TrendingUp className="w-4 h-4" />
                <span className="text-xs sm:text-sm font-bold">Overview</span>
              </TabsTrigger>
              <TabsTrigger value="earnings" className="flex flex-col sm:flex-row items-center space-y-1 sm:space-y-0 sm:space-x-2 py-3 data-[state=active]:bg-green-500 data-[state=active]:text-white">
                <Coins className="w-4 h-4" />
                <span className="text-xs sm:text-sm font-bold">5 Ways</span>
              </TabsTrigger>
              <TabsTrigger value="referrals" className="flex flex-col sm:flex-row items-center space-y-1 sm:space-y-0 sm:space-x-2 py-3 data-[state=active]:bg-green-500 data-[state=active]:text-white">
                <Users className="w-4 h-4" />
                <span className="text-xs sm:text-sm font-bold">Team</span>
              </TabsTrigger>
              <TabsTrigger value="bonuses" className="flex flex-col sm:flex-row items-center space-y-1 sm:space-y-0 sm:space-x-2 py-3 data-[state=active]:bg-green-500 data-[state=active]:text-white">
                <Trophy className="w-4 h-4" />
                <span className="text-xs sm:text-sm font-bold">Bonuses</span>
              </TabsTrigger>
              <TabsTrigger value="tools" className="flex flex-col sm:flex-row items-center space-y-1 sm:space-y-0 sm:space-x-2 py-3 data-[state=active]:bg-green-500 data-[state=active]:text-white">
                <Download className="w-4 h-4" />
                <span className="text-xs sm:text-sm font-bold">Tools</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Quick Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in">
                {[
                  {
                    title: "Total Earned",
                    value: `TSH ${ambassadorStats.totalEarnings.toLocaleString()}`,
                    change: "+TSH 2,500 today",
                    icon: DollarSign,
                    color: "from-green-500 to-emerald-600",
                    changeColor: "text-green-600"
                  },
                  {
                    title: "Active Team",
                    value: ambassadorStats.activeReferrals.toString(),
                    change: "+3 this week",
                    icon: Users,
                    color: "from-blue-500 to-cyan-600",
                    changeColor: "text-blue-600"
                  },
                  {
                    title: "Countries",
                    value: "4/6",
                    change: "Growing globally",
                    icon: Globe,
                    color: "from-purple-500 to-violet-600",
                    changeColor: "text-purple-600"
                  },
                  {
                    title: "Next Bonus",
                    value: "250 TSH",
                    change: "to Motorbike",
                    icon: Bike,
                    color: "from-orange-500 to-red-600",
                    changeColor: "text-orange-600"
                  }
                ].map((stat, index) => (
                  <Card key={index} className="group border-0 bg-white/90 backdrop-blur-sm hover:bg-white transition-all duration-300 hover:shadow-xl animate-scale-in" style={{animationDelay: `${index * 0.1}s`}}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-xs sm:text-sm text-gray-700 font-bold">{stat.title}</CardTitle>
                        <div className={`w-10 h-10 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                          <stat.icon className="w-5 h-5 text-white" />
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-lg sm:text-xl font-black text-gray-800">{stat.value}</div>
                      <p className={`text-xs font-semibold ${stat.changeColor}`}>{stat.change}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Referral Code Sharing */}
              <Card className="border-0 bg-gradient-to-br from-green-100 via-emerald-50 to-teal-50 shadow-xl animate-slide-in">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-gray-800 text-xl font-black">
                    <Share2 className="w-6 h-6 text-green-600" />
                    <span>Share Your Magic Code! ✨</span>
                  </CardTitle>
                  <CardDescription className="font-semibold text-gray-600">
                    Earn TSH 500+ for each person who joins using your code 💰
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col lg:flex-row items-center space-y-4 lg:space-y-0 lg:space-x-4">
                    <Card className="flex-1 w-full p-6 bg-white border-4 border-dashed border-green-400 rounded-2xl shadow-lg">
                      <p className="text-sm text-gray-600 mb-2 font-bold">Your Ambassador Code:</p>
                      <p className="text-2xl sm:text-3xl font-mono font-black text-green-600 tracking-wider">{userAccount.userReferralId}</p>
                    </Card>
                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full lg:w-auto">
                      <Button 
                        onClick={copyReferralCode}
                        variant="outline" 
                        className="border-2 border-green-500 text-green-600 hover:bg-green-500 hover:text-white rounded-xl font-bold"
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        Copy 📋
                      </Button>
                      <Button 
                        onClick={shareWhatsApp}
                        className="bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold"
                      >
                        <Share2 className="w-4 h-4 mr-2" />
                        WhatsApp 📱
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="earnings" className="space-y-6">
              <Card className="border-0 bg-white/90 backdrop-blur-sm shadow-xl animate-fade-in">
                <CardHeader>
                  <CardTitle className="text-gray-800 text-2xl font-black flex items-center">
                    <Coins className="w-7 h-7 mr-3 text-yellow-500" />
                    5 Ways to Earn Money! 💰
                  </CardTitle>
                  <CardDescription className="font-semibold text-gray-600">
                    Multiple income streams for maximum earnings
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {[
                      {
                        way: "Way 1",
                        emoji: "🥇",
                        title: "Activation Pack Referrals",
                        description: "30% commission from new Ambassador registrations",
                        earnings: `TSH ${ambassadorStats.activationPackEarnings.toLocaleString()}`,
                        status: "Paid after every 5 referrals",
                        color: "from-yellow-400 to-orange-500"
                      },
                      {
                        way: "Way 2", 
                        emoji: "🥈",
                        title: "Direct Treatment/Product Sales",
                        description: "25% commission on direct customer sales",
                        earnings: `TSH ${ambassadorStats.directReferralEarnings.toLocaleString()}`,
                        status: "Paid immediately per transaction",
                        color: "from-green-400 to-emerald-500"
                      },
                      {
                        way: "Way 3",
                        emoji: "🥉", 
                        title: "Second-Level Referrals",
                        description: "15% of what your Ambassadors earn",
                        earnings: `TSH ${ambassadorStats.secondLevelEarnings.toLocaleString()}`,
                        status: "Paid per transaction",
                        color: "from-blue-400 to-cyan-500"
                      },
                      {
                        way: "Way 4",
                        emoji: "🏆",
                        title: "Team Progression Bonus - Level 1",
                        description: "Motorbike when team earns TSH 1,000 total",
                        earnings: `${ambassadorStats.teamProgressLevel1}/1,000 TSH`,
                        status: `${Math.round((ambassadorStats.teamProgressLevel1/1000)*100)}% Complete`,
                        color: "from-purple-400 to-violet-500"
                      },
                      {
                        way: "Way 5",
                        emoji: "🥇",
                        title: "Team Progression Bonus - Level 2", 
                        description: "Car when team earns TSH 6,000/month",
                        earnings: `${ambassadorStats.teamProgressLevel2}/6,000 TSH`,
                        status: `${Math.round((ambassadorStats.teamProgressLevel2/6000)*100)}% Complete (This Month)`,
                        color: "from-red-400 to-pink-500"
                      }
                    ].map((way, index) => (
                      <Card key={index} className="border-2 border-gray-200 hover:border-gray-300 transition-all duration-300 hover:shadow-lg">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-4 flex-1">
                              <div className={`w-16 h-16 bg-gradient-to-br ${way.color} rounded-2xl flex items-center justify-center shadow-lg text-2xl`}>
                                {way.emoji}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-2">
                                  <Badge variant="outline" className="font-bold text-xs">{way.way}</Badge>
                                  <h3 className="font-black text-gray-800 text-lg">{way.title}</h3>
                                </div>
                                <p className="text-gray-600 mb-3 font-medium">{way.description}</p>
                                <p className="text-sm text-gray-500 font-semibold">{way.status}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-black text-green-600">{way.earnings}</div>
                              {(way.way === "Way 4" || way.way === "Way 5") && (
                                <Progress 
                                  value={way.way === "Way 4" ? (ambassadorStats.teamProgressLevel1/1000)*100 : (ambassadorStats.teamProgressLevel2/6000)*100} 
                                  className="w-24 mt-2"
                                />
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="referrals" className="space-y-6">
              {/* Country Distribution */}
              <Card className="border-0 bg-white/90 backdrop-blur-sm shadow-xl animate-fade-in">
                <CardHeader>
                  <CardTitle className="text-gray-800 text-xl font-black flex items-center">
                    <Globe className="w-6 h-6 mr-3 text-blue-500" />
                    Your Global Team 🌍
                  </CardTitle>
                  <CardDescription className="font-semibold">
                    Referrals across East Africa (100 max per country)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                    {countries.map((country, index) => (
                      <Card key={index} className="p-4 border-2 border-gray-200 hover:border-blue-300 transition-all duration-300">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-2">
                            <span className="text-2xl">{country.flag}</span>
                            <span className="font-bold text-gray-800">{country.name}</span>
                          </div>
                          <Badge variant={country.count > 0 ? "default" : "secondary"} className="font-bold">
                            {country.count}/{country.limit}
                          </Badge>
                        </div>
                        <Progress value={(country.count/country.limit)*100} className="h-2" />
                        <p className="text-xs text-gray-500 mt-2 font-medium">
                          {country.limit - country.count} slots remaining
                        </p>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Referrals */}
              <Card className="border-0 bg-white/90 backdrop-blur-sm shadow-xl animate-fade-in">
                <CardHeader>
                  <CardTitle className="text-gray-800 text-xl font-black">Recent Team Members 👥</CardTitle>
                  <CardDescription className="font-semibold">Your latest successful referrals</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { name: "John Mkwawa", joinDate: "2024-01-15", location: "Dar es Salaam", status: "Active" },
                      { name: "Sarah Mwalimu", joinDate: "2024-01-20", location: "Arusha", status: "Active" },
                      { name: "David Kimario", joinDate: "2024-01-25", location: "Mwanza", status: "Pending" }
                    ].map((referral, index) => (
                      <Card key={index} className="border-0 bg-gradient-to-r from-white to-blue-50/50 hover:from-blue-50 hover:to-green-50 transition-all duration-300 p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                              <Users className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <p className="font-semibold text-gray-800 text-lg">{referral.name}</p>
                              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 text-sm text-gray-600">
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
                              <p className="text-sm text-green-600 font-semibold mt-1">+TSH 500</p>
                            )}
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="bonuses" className="space-y-6">
              {/* Bonus Progress */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in">
                {/* Motorbike Bonus */}
                <Card className="border-0 bg-gradient-to-br from-orange-50 to-red-50 shadow-xl">
                  <CardHeader>
                    <CardTitle className="text-gray-800 text-xl font-black flex items-center">
                      <Bike className="w-6 h-6 mr-3 text-orange-500" />
                      Motorbike Bonus 🏍️
                    </CardTitle>
                    <CardDescription className="font-semibold">
                      Team total: TSH 1,000 target
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-center">
                        <div className="text-4xl font-black text-orange-600">
                          TSH {ambassadorStats.teamProgressLevel1}
                        </div>
                        <div className="text-sm text-gray-600 font-semibold">of TSH 1,000</div>
                      </div>
                      <Progress value={(ambassadorStats.teamProgressLevel1/1000)*100} className="h-4" />
                      <div className="text-center">
                        <Badge className="bg-orange-500 text-white font-bold">
                          {Math.round((ambassadorStats.teamProgressLevel1/1000)*100)}% Complete
                        </Badge>
                        <p className="text-sm text-gray-600 mt-2 font-medium">
                          TSH {1000 - ambassadorStats.teamProgressLevel1} remaining
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Car Bonus */}
                <Card className="border-0 bg-gradient-to-br from-blue-50 to-cyan-50 shadow-xl">
                  <CardHeader>
                    <CardTitle className="text-gray-800 text-xl font-black flex items-center">
                      <Car className="w-6 h-6 mr-3 text-blue-500" />
                      Car Bonus 🚗
                    </CardTitle>
                    <CardDescription className="font-semibold">
                      Monthly team target: TSH 6,000
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-center">
                        <div className="text-4xl font-black text-blue-600">
                          TSH {ambassadorStats.teamProgressLevel2}
                        </div>
                        <div className="text-sm text-gray-600 font-semibold">of TSH 6,000 (This Month)</div>
                      </div>
                      <Progress value={(ambassadorStats.teamProgressLevel2/6000)*100} className="h-4" />
                      <div className="text-center">
                        <Badge className="bg-blue-500 text-white font-bold">
                          {Math.round((ambassadorStats.teamProgressLevel2/6000)*100)}% Complete
                        </Badge>
                        <p className="text-sm text-gray-600 mt-2 font-medium">
                          TSH {6000 - ambassadorStats.teamProgressLevel2} remaining this month
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Commission Tier Status */}
              <Card className="border-0 bg-gradient-to-br from-green-50 to-emerald-50 shadow-xl animate-slide-in">
                <CardHeader>
                  <CardTitle className="text-gray-800 text-xl font-black flex items-center">
                    <Award className="w-6 h-6 mr-3 text-green-500" />
                    Commission Tier Status 📈
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-gray-700">Current Tier:</span>
                      <Badge className="bg-green-500 text-white font-bold text-lg px-4 py-2">
                        Standard (30%–25%–15%)
                      </Badge>
                    </div>
                    <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4">
                      <h4 className="font-black text-yellow-800 mb-2 flex items-center">
                        Upgrade to Premium Tier! 🚀
                      </h4>
                      <p className="text-yellow-700 font-semibold mb-3">
                        When 1,000 total Ambassadors reached across Tanzania:
                      </p>
                      <ul className="space-y-2 text-sm text-yellow-700 font-medium">
                        <li>• Activation Pack: 70% commission</li>
                        <li>• Direct Sales: 35%–75% commission</li>
                        <li>• Global expansion unlocked</li>
                      </ul>
                      <div className="mt-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-bold text-yellow-800">Tanzania Ambassadors:</span>
                          <span className="font-black text-yellow-800">{ambassadorStats.ambassadorLimit}/1,000</span>
                        </div>
                        <Progress value={(ambassadorStats.ambassadorLimit/1000)*100} className="h-3" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="tools" className="space-y-6">
              {/* Ambassador Tools */}
              <Card className="border-0 bg-white/90 backdrop-blur-sm shadow-xl animate-fade-in">
                <CardHeader>
                  <CardTitle className="text-gray-800 text-xl font-black flex items-center">
                    <Download className="w-6 h-6 mr-3 text-purple-500" />
                    Ambassador Tools & Resources 🛠️
                  </CardTitle>
                  <CardDescription className="font-semibold">
                    Everything you need to succeed as an Ambassador
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      {
                        title: "WhatsApp Flyer",
                        description: "Branded promotional material for sharing",
                        icon: Share2,
                        action: "Download",
                        color: "from-green-400 to-emerald-500",
                        onClick: downloadFlyer
                      },
                      {
                        title: "Training Materials",
                        description: "Learn effective referral techniques",
                        icon: Star,
                        action: "Access",
                        color: "from-blue-400 to-cyan-500",
                        onClick: () => toast({ title: "Training Unlocked! 📚", description: "Access your learning materials" })
                      },
                      {
                        title: "Success Stories",
                        description: "Real Ambassador success examples",
                        icon: Trophy,
                        action: "View",
                        color: "from-yellow-400 to-orange-500",
                        onClick: () => toast({ title: "Inspiration! 💪", description: "Check out success stories" })
                      },
                      {
                        title: "Support Center",
                        description: "Get help when you need it",
                        icon: Phone,
                        action: "Contact",
                        color: "from-purple-400 to-violet-500",
                        onClick: () => toast({ title: "Support Ready! 🤝", description: "Our team is here to help" })
                      }
                    ].map((tool, index) => (
                      <Card key={index} className="p-6 border-2 border-gray-200 hover:border-gray-300 transition-all duration-300 hover:shadow-lg cursor-pointer" onClick={tool.onClick}>
                        <div className="flex items-center space-x-4">
                          <div className={`w-16 h-16 bg-gradient-to-br ${tool.color} rounded-2xl flex items-center justify-center shadow-lg`}>
                            <tool.icon className="w-8 h-8 text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-black text-gray-800 text-lg mb-2">{tool.title}</h3>
                            <p className="text-gray-600 text-sm font-medium mb-3">{tool.description}</p>
                            <Button size="sm" className="bg-gray-800 hover:bg-gray-900 text-white font-bold">
                              {tool.action} ➤
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
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
