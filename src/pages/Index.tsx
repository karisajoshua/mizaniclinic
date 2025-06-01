
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Coins, Calendar, ArrowRight, CheckCircle, Phone, MapPin, Star, Shield, Clock, Trophy, Zap, Target, Gift } from "lucide-react";
import { Link } from "react-router-dom";
import MobileHeader from "@/components/MobileHeader";
import { useAuth } from "@/hooks/useAuth";

const Index = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-tanzania-grey via-white to-tanzania-grey overflow-hidden">
      <MobileHeader />

      {/* Hero Section - Brand Focused */}
      <section className="relative px-4 py-8 sm:py-16 bg-gradient-to-br from-[#00122D] via-[#00122D] to-blue-900">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left space-y-6">
              {/* Success Badge */}
              <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-tanzania-green to-tanzania-green-light rounded-full text-white font-bold text-sm shadow-xl">
                <Star className="w-5 h-5 mr-2" />
                Join the Ambassadors Family
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight">
                Start Earning
                <br />
                <span className="text-5xl sm:text-6xl lg:text-7xl text-transparent bg-gradient-to-r from-tanzania-green to-tanzania-green-light bg-clip-text">
                  Today!
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-xl sm:text-2xl text-blue-200 font-semibold">Earn up to Tshs 19,800/- per referral + Bonuses</p>

              {/* Earning Numbers */}
              <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto lg:mx-0">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                  <div className="text-2xl sm:text-3xl font-black text-tanzania-green-light">30%</div>
                  <div className="text-xs text-blue-200 font-semibold">Activation Pack</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                  <div className="text-2xl sm:text-3xl font-black text-tanzania-green-light">25%</div>
                  <div className="text-xs text-blue-200 font-semibold">Direct Referral</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                  <div className="text-2xl sm:text-3xl font-black text-tanzania-green-light">15%</div>
                  <div className="text-xs text-blue-200 font-semibold">Second Level</div>
                </div>
              </div>

              {/* Call to Action */}
              <div className="space-y-4">
                {user ? (
                  <Link to="/dashboard">
                    <Button size="lg" className="w-full max-w-md h-16 bg-gradient-to-r from-tanzania-green to-tanzania-green-light hover:from-tanzania-green-light hover:to-tanzania-green text-white text-xl font-black rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 border-4 border-white/20">
                      GO TO DASHBOARD
                      <ArrowRight className="ml-3 w-6 h-6" />
                    </Button>
                  </Link>
                ) : (
                  <div className="space-y-3">
                    <Link to="/register">
                      <Button size="lg" className="w-full max-w-md h-16 bg-gradient-to-r from-tanzania-green to-tanzania-green-light hover:from-tanzania-green-light hover:to-tanzania-green text-white text-xl font-black rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 border-4 border-white/20">
                        REGISTER NOW
                        <ArrowRight className="ml-3 w-6 h-6" />
                      </Button>
                    </Link>
                    {/* Mobile Login Button */}
                    <div className="block lg:hidden">
                      <Link to="/signin">
                        <Button variant="outline" size="lg" className="w-full max-w-md h-14 bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white text-lg font-bold rounded-2xl hover:bg-white/20 transition-all duration-300">
                          LOGIN
                        </Button>
                      </Link>
                    </div>
                  </div>
                )}
                <p className="text-sm text-blue-200 font-medium">
                  {user ? "Welcome back! Check your dashboard" : "Join hundreds of Tanzanians already earning"}
                </p>
              </div>

              {/* Mobile Apps Coming Soon */}
              <div className="flex items-center justify-center lg:justify-start space-x-4 pt-4">
                <img src="https://rpkttbmlvjshkbjrmnvo.supabase.co/storage/v1/object/public/mizaniclinic//app_download-removebg-preview.png" alt="Mobile Apps Download" className="w-32 h-auto object-contain" />
                <div className="text-left">
                  <div className="text-lg font-bold text-white">Mobile apps</div>
                  <div className="text-sm text-blue-200">coming Soon</div>
                </div>
              </div>
            </div>

            {/* Right Image */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative">
                <img src="https://lgtuwkhbucnucegkvirf.supabase.co/storage/v1/object/public/mizaniclinic//mobil_eapp_mizani-removebg-preview.png" alt="Mizani Clinic Mobile App" className="w-80 sm:w-96 lg:w-full max-w-md h-auto object-contain" />
                <div className="absolute -top-4 -right-4 w-20 h-20 bg-tanzania-green rounded-full flex items-center justify-center animate-pulse">
                  <Phone className="w-10 h-10 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Benefits - Brand Colors */}
      <section className="py-12 px-4 bg-white">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl sm:text-4xl font-black text-center text-tanzania-navy mb-8">
            Simple Steps to Success
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Phone,
                title: "1. Register",
                description: "Complete form with referral code",
                color: "from-tanzania-navy to-blue-800"
              },
              {
                icon: Users,
                title: "2. Refer",
                description: "Share code, invite others to join",
                color: "from-tanzania-green to-tanzania-green-light"
              },
              {
                icon: Coins,
                title: "3. Earn",
                description: "Tshs. 19,800/- per referral (30% of Tshs. 66,000/-)",
                color: "from-orange-500 to-red-500"
              }
            ].map((step, index) => (
              <Card key={index} className="group relative overflow-hidden border-0 bg-white hover:bg-tanzania-grey transition-all duration-300 hover:shadow-2xl transform hover:scale-105 shadow-lg">
                <CardHeader className="text-center pb-4">
                  <div className={`w-20 h-20 bg-gradient-to-br ${step.color} rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-xl group-hover:scale-110 transition-transform duration-300`}>
                    <step.icon className="w-10 h-10 text-white" />
                  </div>
                  <CardTitle className="text-tanzania-navy text-xl font-black">{step.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 text-center leading-relaxed font-semibold text-lg">
                    {step.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories Ticker */}
      <section className="py-8 bg-gradient-to-r from-tanzania-green to-tanzania-green-light text-white overflow-hidden">
        <div className="animate-scroll">
          <div className="flex space-x-8 text-lg font-bold whitespace-nowrap">
            <span>John from Dar just earned Tshs. 19,800/-!</span>
            <span>Sarah from Arusha won a Motorbike!</span>
            <span>David from Mwanza earned Tshs. 118,800/- this month!</span>
            <span>Grace from Dodoma qualified for Car bonus!</span>
            <span>Michael from Mbeya reached Level 2!</span>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 px-4 bg-gradient-to-br from-[#00122D] via-[#00122D] to-blue-900 text-white relative overflow-hidden">
        <div className="relative container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl sm:text-5xl font-black mb-6">
            Ready to Change Your Life?
          </h2>
          <p className="text-xl mb-8 opacity-90 font-semibold">
            Thousands earning daily. Your turn now!
          </p>
          {user ? (
            <Link to="/dashboard">
              <Button size="lg" className="h-16 bg-gradient-to-r from-tanzania-green to-tanzania-green-light hover:from-tanzania-green-light hover:to-tanzania-green text-white text-xl font-black px-12 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-110 border-4 border-white/20">
                VIEW YOUR DASHBOARD
                <ArrowRight className="ml-3 w-6 h-6" />
              </Button>
            </Link>
          ) : (
            <Link to="/register">
              <Button size="lg" className="h-16 bg-gradient-to-r from-tanzania-green to-tanzania-green-light hover:from-tanzania-green-light hover:to-tanzania-green text-white text-xl font-black px-12 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-110 border-4 border-white/20">
                JOIN THE FAMILY NOW
                <ArrowRight className="ml-3 w-6 h-6" />
              </Button>
            </Link>
          )}

          {/* Mobile Apps Coming Soon - Bottom Section */}
          <div className="flex flex-col items-center space-y-6 mt-12">
            <img src="https://rpkttbmlvjshkbjrmnvo.supabase.co/storage/v1/object/public/mizaniclinic//app_download-removebg-preview.png" alt="Mobile Apps Download" className="w-64 h-auto object-contain" />
            <div>
              <h3 className="text-3xl font-black text-white mb-2">Mobile apps coming Soon</h3>
              <p className="text-lg text-blue-200 font-semibold">Get ready for the ultimate mobile experience</p>
            </div>
          </div>
        </div>
      </section>

      {/* Simple Footer */}
      <footer className="bg-[#00122D] text-white py-6 px-4">
        <div className="container mx-auto text-center">
          <div className="flex justify-center items-center space-x-2 mb-2">
            <img src="https://rpkttbmlvjshkbjrmnvo.supabase.co/storage/v1/object/public/mizaniclinic//Mizani%20(1).png" alt="Mizani Clinic Logo" className="w-8 h-8 object-contain" />
            <span className="font-bold text-lg">MIZANI CLINIC</span>
          </div>
          <p className="text-blue-200 font-medium">Your Success, Our Mission</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
