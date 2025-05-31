
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Coins, Calendar, ArrowRight, CheckCircle, Phone, MapPin, Star, Shield, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import MobileHeader from "@/components/MobileHeader";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <MobileHeader />

      {/* Hero Section */}
      <section className="relative px-4 py-12 sm:py-20 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-tanzania-navy/5 to-tanzania-green/5"></div>
        <div className="absolute top-20 left-4 w-32 h-32 bg-tanzania-green/10 rounded-full blur-3xl animate-bounce-gentle"></div>
        <div className="absolute bottom-20 right-4 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl animate-bounce-gentle" style={{animationDelay: '1s'}}></div>
        
        <div className="relative container mx-auto max-w-4xl text-center">
          <div className="mb-8 animate-fade-in">
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-tanzania-green/10 to-green-100 rounded-full border border-tanzania-green/20 mb-6">
              <Star className="w-4 h-4 text-tanzania-green mr-2" />
              <span className="text-sm font-medium text-tanzania-green">World-Class Healthcare Platform</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-tanzania-navy mb-6 leading-tight">
              Refer. Earn. Book —<br />
              <span className="bg-gradient-to-r from-tanzania-green to-green-500 bg-clip-text text-transparent">
                A Smarter Way to Connect
              </span><br />
              with Care in Tanzania
            </h1>
            <p className="text-lg sm:text-xl text-tanzania-text/80 mb-8 max-w-3xl mx-auto leading-relaxed">
              Register with your referral code, earn TSH 500 commissions, and book your appointment with Mizani Clinic — all in one seamless platform.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 animate-scale-in">
            <Link to="/register">
              <Button 
                size="lg" 
                className="w-full sm:w-auto bg-gradient-to-r from-tanzania-green to-green-500 hover:from-green-500 hover:to-tanzania-green text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 animate-glow"
              >
                Start Earning Now
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Button 
              variant="outline" 
              size="lg"
              className="w-full sm:w-auto border-2 border-tanzania-navy text-tanzania-navy hover:bg-tanzania-navy hover:text-white px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-300"
            >
              Learn More
            </Button>
          </div>

          {/* Stats Preview */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto animate-slide-in">
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-tanzania-green">TSH 500</div>
              <div className="text-sm text-tanzania-text/70">Per Referral</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-tanzania-navy">10,000+</div>
              <div className="text-sm text-tanzania-text/70">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-tanzania-green">24/7</div>
              <div className="text-sm text-tanzania-text/70">Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 px-4 bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-tanzania-navy mb-4">How It Works</h2>
          <p className="text-center text-tanzania-text/70 mb-12 max-w-2xl mx-auto">
            Join thousands of Tanzanians earning while helping others access quality healthcare
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Users,
                title: "1. Register",
                description: "Enter your referral code and select your region to create your account",
                color: "from-blue-500 to-blue-600"
              },
              {
                icon: CheckCircle,
                title: "2. Pay",
                description: "Complete payment via mobile money or submit your receipt number",
                color: "from-green-500 to-green-600"
              },
              {
                icon: Coins,
                title: "3. Refer",
                description: "Share your unique code and earn TSH 500 for each successful referral",
                color: "from-yellow-500 to-orange-500"
              },
              {
                icon: Calendar,
                title: "4. Book",
                description: "Schedule your appointment with Mizani Clinic at your convenience",
                color: "from-purple-500 to-purple-600"
              }
            ].map((step, index) => (
              <Card 
                key={index}
                className="group relative overflow-hidden border-0 bg-white/70 backdrop-blur-sm hover:bg-white/90 transition-all duration-300 hover:shadow-glass-hover animate-fade-in"
                style={{animationDelay: `${index * 0.2}s`}}
              >
                <CardHeader className="text-center pb-4">
                  <div className={`w-16 h-16 bg-gradient-to-br ${step.color} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <step.icon className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-tanzania-navy text-lg">{step.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-tanzania-text/70 text-center leading-relaxed">
                    {step.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-tanzania-grey/30 to-blue-50/30">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-in">
              <h2 className="text-3xl sm:text-4xl font-bold text-tanzania-navy mb-6">
                Why Choose Mizani Clinic?
              </h2>
              <div className="space-y-6">
                {[
                  {
                    icon: Coins,
                    title: "Earn While You Help",
                    description: "Get TSH 500 for every person you refer who completes registration"
                  },
                  {
                    icon: Clock,
                    title: "Easy Booking",
                    description: "Book appointments with Mizani Clinic directly through your dashboard"
                  },
                  {
                    icon: Users,
                    title: "Track Your Success",
                    description: "Monitor your referrals and earnings in real-time"
                  },
                  {
                    icon: Shield,
                    title: "Secure & Trusted",
                    description: "Safe payments and verified healthcare services"
                  }
                ].map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-4 group">
                    <div className="w-12 h-12 bg-gradient-to-br from-tanzania-green to-green-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <benefit.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-tanzania-navy text-lg mb-2">{benefit.title}</h3>
                      <p className="text-tanzania-text/70 leading-relaxed">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="text-center animate-scale-in">
              <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-white to-blue-50/50 backdrop-blur-sm shadow-glass p-8">
                <div className="absolute inset-0 bg-gradient-to-br from-tanzania-green/5 to-blue-500/5"></div>
                <div className="relative">
                  <div className="w-24 h-24 bg-gradient-to-br from-tanzania-green to-green-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl animate-bounce-gentle">
                    <Coins className="w-12 h-12 text-white" />
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-tanzania-navy mb-4">Start Earning Today</h3>
                  <p className="text-tanzania-text/70 mb-6 leading-relaxed">
                    Join thousands of Tanzanians already earning through referrals with Mizani Clinic
                  </p>
                  <Link to="/register">
                    <Button className="bg-gradient-to-r from-tanzania-green to-green-500 hover:from-green-500 hover:to-tanzania-green text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                      Get Started Now
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-16 px-4 bg-gradient-to-br from-tanzania-navy via-blue-900 to-tanzania-navy text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
        <div className="relative container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Ready to Start Your Journey?</h2>
          <p className="text-xl mb-8 opacity-90 leading-relaxed">
            Join our community and start earning while helping others access quality healthcare
          </p>
          <Link to="/register">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-tanzania-green to-green-500 hover:from-green-500 hover:to-tanzania-green text-white px-12 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              Register Now
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-tanzania-text text-white py-8 px-4">
        <div className="container mx-auto text-center">
          <div className="flex justify-center items-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-tanzania-green to-green-500 rounded-xl flex items-center justify-center shadow-lg">
              <Phone className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-lg">Mizani Clinic</span>
          </div>
          <p className="text-gray-400">Connecting Tanzanians with Quality Healthcare</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
