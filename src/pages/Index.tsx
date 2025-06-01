
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Coins, Calendar, ArrowRight, CheckCircle, Phone, MapPin, Star, Shield, Clock, Trophy, Zap, Target, Gift } from "lucide-react";
import { Link } from "react-router-dom";
import MobileHeader from "@/components/MobileHeader";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-yellow-50 to-orange-50 overflow-hidden">
      <MobileHeader />

      {/* Floating Money Animation Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 text-4xl animate-bounce" style={{animationDelay: '0s'}}>💰</div>
        <div className="absolute top-32 right-16 text-3xl animate-bounce" style={{animationDelay: '1s'}}>🎯</div>
        <div className="absolute bottom-40 left-20 text-4xl animate-bounce" style={{animationDelay: '2s'}}>🏆</div>
        <div className="absolute top-60 right-8 text-3xl animate-bounce" style={{animationDelay: '3s'}}>💸</div>
        <div className="absolute bottom-32 right-32 text-4xl animate-bounce" style={{animationDelay: '4s'}}>⭐</div>
      </div>

      {/* Hero Section - Super Engaging */}
      <section className="relative px-4 py-8 sm:py-16">
        <div className="container mx-auto max-w-4xl text-center">
          {/* Success Badge */}
          <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full text-white font-bold text-sm mb-6 shadow-xl animate-pulse">
            <Star className="w-5 h-5 mr-2" />
            Jiunge na Familia ya Ambassador! 🇹🇿
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-transparent bg-gradient-to-r from-tanzania-green via-yellow-500 to-orange-500 bg-clip-text mb-6 animate-fade-in leading-tight">
            Start Earning<br />
            <span className="text-5xl sm:text-7xl lg:text-8xl">💰 TODAY! 💰</span>
          </h1>

          {/* Catchy Subtitle */}
          <p className="text-xl sm:text-2xl text-gray-700 font-semibold mb-8 animate-slide-in">
            Share your code ➜ Earn TSH 500+ ➜ Win Motorbike & Car! 🏍️🚗
          </p>

          {/* Big Earning Numbers */}
          <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto mb-8 animate-scale-in">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-xl border-2 border-green-200">
              <div className="text-2xl sm:text-3xl font-black text-green-600">TSH 500</div>
              <div className="text-xs text-gray-600 font-semibold">Per Referral</div>
            </div>
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-xl border-2 border-yellow-200">
              <div className="text-2xl sm:text-3xl font-black text-yellow-600">30%</div>
              <div className="text-xs text-gray-600 font-semibold">Commission</div>
            </div>
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-xl border-2 border-orange-200">
              <div className="text-2xl sm:text-3xl font-black text-orange-600">5 Ways</div>
              <div className="text-xs text-gray-600 font-semibold">To Earn</div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="space-y-4 animate-fade-in">
            <Link to="/register">
              <Button 
                size="lg" 
                className="w-full max-w-md h-16 bg-gradient-to-r from-green-500 via-yellow-500 to-orange-500 hover:from-green-600 hover:via-yellow-600 hover:to-orange-600 text-white text-xl font-black rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 animate-glow border-4 border-white"
              >
                🚀 START EARNING NOW! 🚀
                <ArrowRight className="ml-3 w-6 h-6" />
              </Button>
            </Link>
            <p className="text-sm text-gray-600 font-medium">
              Join 10,000+ Tanzanians already earning! 🎉
            </p>
          </div>
        </div>
      </section>

      {/* Quick Benefits - Minimal but Powerful */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl sm:text-4xl font-black text-center text-gray-800 mb-8">
            Ni Rahisi Sana! 😄
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                emoji: "📱",
                title: "1. Register",
                description: "Jaza form na referral code",
                color: "from-blue-400 to-cyan-500"
              },
              {
                emoji: "💸",
                title: "2. Share & Earn",
                description: "Share code, earn TSH 500+",
                color: "from-green-400 to-emerald-500"
              },
              {
                emoji: "🏆",
                title: "3. Win Big",
                description: "Motorbike & Car bonuses!",
                color: "from-yellow-400 to-orange-500"
              }
            ].map((step, index) => (
              <Card 
                key={index}
                className="group relative overflow-hidden border-0 bg-white/90 backdrop-blur-sm hover:bg-white transition-all duration-300 hover:shadow-2xl animate-fade-in transform hover:scale-105"
                style={{animationDelay: `${index * 0.2}s`}}
              >
                <CardHeader className="text-center pb-4">
                  <div className={`w-20 h-20 bg-gradient-to-br ${step.color} rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-xl group-hover:scale-110 transition-transform duration-300 text-4xl`}>
                    {step.emoji}
                  </div>
                  <CardTitle className="text-gray-800 text-xl font-black">{step.title}</CardTitle>
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
      <section className="py-8 bg-gradient-to-r from-green-500 to-emerald-600 text-white overflow-hidden">
        <div className="animate-scroll">
          <div className="flex space-x-8 text-lg font-bold whitespace-nowrap">
            <span>🎉 John from Dar just earned TSH 2,500!</span>
            <span>🏆 Sarah from Arusha won a Motorbike!</span>
            <span>💰 David from Mwanza earned TSH 15,000 this month!</span>
            <span>🚗 Grace from Dodoma qualified for Car bonus!</span>
            <span>⭐ Michael from Mbeya reached Level 2!</span>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 px-4 bg-gradient-to-br from-gray-900 via-green-900 to-emerald-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23ffffff\" fill-opacity=\"0.1\"%3E%3Ccircle cx=\"30\" cy=\"30\" r=\"2\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>
        <div className="relative container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl sm:text-5xl font-black mb-6 animate-fade-in">
            Ready to Change Your Life? 🌟
          </h2>
          <p className="text-xl mb-8 opacity-90 font-semibold">
            Thousands earning daily. Your turn now! 💪
          </p>
          <Link to="/register">
            <Button 
              size="lg" 
              className="h-16 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 hover:from-yellow-500 hover:via-orange-600 hover:to-red-600 text-black text-xl font-black px-12 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-110 border-4 border-white"
            >
              🔥 JOIN THE FAMILY NOW! 🔥
              <ArrowRight className="ml-3 w-6 h-6" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Simple Footer */}
      <footer className="bg-gray-900 text-white py-6 px-4">
        <div className="container mx-auto text-center">
          <div className="flex justify-center items-center space-x-2 mb-2">
            <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
              <Phone className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg">Mizani Clinic Ambassador</span>
          </div>
          <p className="text-gray-400 font-medium">Your Success, Our Mission! 🎯</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
