
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Coins, Calendar, ArrowRight, CheckCircle, Phone, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-tanzania-grey to-white">
      {/* Header */}
      <header className="bg-tanzania-navy text-white py-4 px-6">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-tanzania-green rounded-full flex items-center justify-center">
              <Phone className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-xl font-bold">Dr. Mwaka Referral System</h1>
          </div>
          <div className="space-x-4">
            <Link to="/register">
              <Button variant="outline" className="text-tanzania-navy border-white hover:bg-white hover:text-tanzania-navy">
                Register
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button variant="outline" className="text-tanzania-navy border-white hover:bg-white hover:text-tanzania-navy">
                Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-6 text-center animate-fade-in">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-5xl font-bold text-tanzania-navy mb-6 leading-tight">
            Refer. Earn. Book —<br />
            <span className="text-tanzania-green">A Smarter Way to Connect with Care</span> in Tanzania
          </h1>
          <p className="text-xl text-tanzania-text mb-8 max-w-2xl mx-auto">
            Register with your referral code, earn commissions, and book your appointment with Dr. Mwaka — all in one seamless platform.
          </p>
          <div className="space-x-4">
            <Link to="/register">
              <Button 
                size="lg" 
                className="bg-tanzania-green hover:bg-tanzania-green-light text-white px-8 py-4 text-lg font-semibold transition-all duration-300 transform hover:scale-105"
              >
                Register Now
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Button 
              variant="outline" 
              size="lg"
              className="border-tanzania-navy text-tanzania-navy hover:bg-tanzania-navy hover:text-white px-8 py-4 text-lg font-semibold"
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 px-6 bg-white">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center text-tanzania-navy mb-12">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-8">
            <Card className="text-center border-2 border-tanzania-grey hover:border-tanzania-green transition-all duration-300 animate-slide-in">
              <CardHeader>
                <div className="w-16 h-16 bg-tanzania-green rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-tanzania-navy">1. Register</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-tanzania-text">
                  Enter your referral code and select your region to create your account
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center border-2 border-tanzania-grey hover:border-tanzania-green transition-all duration-300 animate-slide-in" style={{animationDelay: '0.2s'}}>
              <CardHeader>
                <div className="w-16 h-16 bg-tanzania-green rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-tanzania-navy">2. Pay</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-tanzania-text">
                  Complete payment via mobile money or submit your receipt number
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center border-2 border-tanzania-grey hover:border-tanzania-green transition-all duration-300 animate-slide-in" style={{animationDelay: '0.4s'}}>
              <CardHeader>
                <div className="w-16 h-16 bg-tanzania-green rounded-full flex items-center justify-center mx-auto mb-4">
                  <Coins className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-tanzania-navy">3. Refer</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-tanzania-text">
                  Share your unique code and earn KES 500 for each successful referral
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center border-2 border-tanzania-grey hover:border-tanzania-green transition-all duration-300 animate-slide-in" style={{animationDelay: '0.6s'}}>
              <CardHeader>
                <div className="w-16 h-16 bg-tanzania-green rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-tanzania-navy">4. Book</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-tanzania-text">
                  Schedule your appointment with Dr. Mwaka at your convenience
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-6 bg-tanzania-grey">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-in">
              <h2 className="text-3xl font-bold text-tanzania-navy mb-6">Why Choose Our Platform?</h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-tanzania-green mt-1" />
                  <div>
                    <h3 className="font-semibold text-tanzania-navy">Earn While You Help</h3>
                    <p className="text-tanzania-text">Get KES 500 for every person you refer who completes registration</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-tanzania-green mt-1" />
                  <div>
                    <h3 className="font-semibold text-tanzania-navy">Easy Booking</h3>
                    <p className="text-tanzania-text">Book appointments with Dr. Mwaka directly through your dashboard</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-tanzania-green mt-1" />
                  <div>
                    <h3 className="font-semibold text-tanzania-navy">Track Your Success</h3>
                    <p className="text-tanzania-text">Monitor your referrals and earnings in real-time</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-tanzania-green mt-1" />
                  <div>
                    <h3 className="font-semibold text-tanzania-navy">Secure & Trusted</h3>
                    <p className="text-tanzania-text">Safe payments and verified healthcare services</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-center animate-fade-in">
              <div className="bg-white rounded-lg p-8 shadow-lg">
                <div className="w-24 h-24 bg-tanzania-green rounded-full flex items-center justify-center mx-auto mb-6">
                  <Coins className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-tanzania-navy mb-4">Start Earning Today</h3>
                <p className="text-tanzania-text mb-6">Join thousands of Tanzanians already earning through referrals</p>
                <Link to="/register">
                  <Button className="bg-tanzania-green hover:bg-tanzania-green-light text-white px-8 py-3">
                    Get Started Now
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-16 px-6 bg-tanzania-navy text-white text-center">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Journey?</h2>
          <p className="text-xl mb-8 opacity-90">Join our community and start earning while helping others access quality healthcare</p>
          <Link to="/register">
            <Button 
              size="lg" 
              className="bg-tanzania-green hover:bg-tanzania-green-light text-white px-12 py-4 text-lg font-semibold"
            >
              Register Now
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-tanzania-text text-white py-8 px-6">
        <div className="container mx-auto text-center">
          <div className="flex justify-center items-center space-x-2 mb-4">
            <div className="w-6 h-6 bg-tanzania-green rounded-full flex items-center justify-center">
              <Phone className="w-3 h-3 text-white" />
            </div>
            <span className="font-semibold">Dr. Mwaka Referral System</span>
          </div>
          <p className="text-gray-400">Connecting Tanzanians with Quality Healthcare</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
