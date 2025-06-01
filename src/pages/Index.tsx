
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Phone, Users, Coins, MapPin, ArrowRight, Star, CheckCircle, Shield, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import MobileHeader from "@/components/MobileHeader";
import { useAuth } from "@/hooks/useAuth";

const Index = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <MobileHeader />
      
      {/* Hero Section */}
      <section className="relative py-12 sm:py-20 px-4 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-10 w-32 h-32 bg-tanzania-green rounded-full blur-3xl"></div>
          <div className="absolute top-40 right-20 w-40 h-40 bg-blue-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-1/3 w-36 h-36 bg-yellow-400 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto text-center relative">
          <div className="animate-fade-in mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-tanzania-green to-green-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl animate-bounce-gentle">
              <Phone className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-6xl font-black text-tanzania-navy mb-4 leading-tight">
              Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-tanzania-green to-green-500">Mizani Clinic</span>
            </h1>
            <p className="text-lg sm:text-xl text-tanzania-text/80 mb-8 max-w-3xl mx-auto font-medium">
              Book appointments with trusted healthcare professionals and earn money by referring friends. Join our referral network today!
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-in mb-12">
            {user ? (
              <Link to="/dashboard">
                <Button className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-tanzania-green to-green-500 hover:from-green-500 hover:to-tanzania-green text-white text-lg font-semibold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                  Go to Dashboard
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/signin">
                  <Button className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-tanzania-green to-green-500 hover:from-green-500 hover:to-tanzania-green text-white text-lg font-semibold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                    Sign In
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button variant="outline" className="w-full sm:w-auto px-8 py-4 border-2 border-tanzania-green text-tanzania-green hover:bg-tanzania-green hover:text-white text-lg font-semibold rounded-xl transition-all duration-300 transform hover:scale-105">
                    Create Account
                  </Button>
                </Link>
              </>
            )}
            <Link to="/register">
              <Button variant="outline" className="w-full sm:w-auto px-8 py-4 border-2 border-tanzania-navy text-tanzania-navy hover:bg-tanzania-navy hover:text-white text-lg font-semibold rounded-xl transition-all duration-300 transform hover:scale-105">
                Become Ambassador
              </Button>
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center items-center gap-8 text-tanzania-text/60 animate-fade-in">
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-tanzania-green" />
              <span className="font-medium">Secure & Trusted</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-tanzania-green" />
              <span className="font-medium">24/7 Support</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-tanzania-green" />
              <span className="font-medium">Verified Doctors</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-24 px-4 bg-white/50">
        <div className="container mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl sm:text-4xl font-black text-tanzania-navy mb-4">
              Why Choose Mizani Clinic?
            </h2>
            <p className="text-lg text-tanzania-text/70 max-w-2xl mx-auto">
              Experience quality healthcare while earning money through our innovative referral system
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Healthcare Services */}
            <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-glass hover:shadow-glass-hover transition-all duration-300 animate-scale-in">
              <CardHeader className="text-center pb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Phone className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-tanzania-navy">Quality Healthcare</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  Book appointments with certified doctors and specialists. Get quality medical care when you need it most.
                </CardDescription>
              </CardContent>
            </Card>

            {/* Referral System */}
            <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-glass hover:shadow-glass-hover transition-all duration-300 animate-scale-in">
              <CardHeader className="text-center pb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-tanzania-green to-green-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-tanzania-navy">Earn by Referring</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  Share your referral code and earn TSH 500 for every friend who joins. Build your network and increase your earnings.
                </CardDescription>
              </CardContent>
            </Card>

            {/* Easy Booking */}
            <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-glass hover:shadow-glass-hover transition-all duration-300 animate-scale-in">
              <CardHeader className="text-center pb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Coins className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-tanzania-navy">Multiple Income Streams</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  Earn from activation packs, direct referrals, second-level commissions, and unlock bonus rewards.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-24 px-4 bg-gradient-to-r from-tanzania-green to-green-500">
        <div className="container mx-auto text-center">
          <div className="animate-fade-in">
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
              Join thousands of satisfied customers who trust Mizani Clinic for their healthcare needs.
            </p>
            
            {!user && (
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link to="/signup">
                  <Button className="w-full sm:w-auto px-8 py-4 bg-white text-tanzania-green hover:bg-gray-100 text-lg font-semibold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                    Create Your Account
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="outline" className="w-full sm:w-auto px-8 py-4 border-2 border-white text-white hover:bg-white/10 text-lg font-semibold rounded-xl transition-all duration-300 transform hover:scale-105">
                    Become an Ambassador
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-tanzania-navy">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-tanzania-green to-green-400 rounded-xl flex items-center justify-center shadow-lg">
              <Phone className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white">Mizani Clinic</h3>
          </div>
          <p className="text-blue-200 mb-4">
            Quality healthcare and earning opportunities for everyone
          </p>
          <div className="flex justify-center items-center space-x-2 text-blue-300">
            <MapPin className="w-4 h-4" />
            <span>Serving East Africa</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
