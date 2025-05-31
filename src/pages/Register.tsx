
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, User, MapPin, Key, Phone, CheckCircle, ArrowRight } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { generateReferralId } from "@/utils/regionCodes";
import MobileHeader from "@/components/MobileHeader";

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    referralCode: "",
    region: "",
    phone: ""
  });
  const navigate = useNavigate();

  const tanzanianRegions = [
    "Arusha", "Dar es Salaam", "Dodoma", "Geita", "Iringa", "Kagera", 
    "Katavi", "Kigoma", "Kilimanjaro", "Lindi", "Manyara", "Mara", 
    "Mbeya", "Morogoro", "Mtwara", "Mwanza", "Njombe", "Pemba North", 
    "Pemba South", "Pwani", "Rukwa", "Ruvuma", "Shinyanga", "Simiyu", 
    "Singida", "Songwe", "Tabora", "Tanga", "Unguja North", "Unguja South"
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.fullName || !formData.referralCode || !formData.region || !formData.phone) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    // Generate region-based referral ID
    const userReferralId = generateReferralId(formData.region);
    
    // Store registration data
    localStorage.setItem('registrationData', JSON.stringify({
      ...formData,
      userReferralId,
      registrationDate: new Date().toISOString()
    }));

    toast({
      title: "Registration Successful!",
      description: `Your referral ID: ${userReferralId}`,
    });

    // Navigate to payment page
    navigate('/payment');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <MobileHeader />

      <div className="px-4 py-8">
        <div className="container mx-auto max-w-md">
          {/* Progress Indicator */}
          <div className="mb-8 animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-tanzania-green rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">1</span>
                </div>
                <span className="text-tanzania-green font-medium">Register</span>
              </div>
              <div className="flex-1 h-1 bg-tanzania-grey mx-4 rounded-full">
                <div className="h-1 bg-tanzania-green rounded-full w-1/2"></div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-tanzania-grey rounded-full flex items-center justify-center">
                  <span className="text-tanzania-text text-sm font-bold">2</span>
                </div>
                <span className="text-tanzania-text/60 font-medium">Payment</span>
              </div>
            </div>
          </div>

          <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-glass hover:shadow-glass-hover transition-all duration-300 animate-scale-in">
            <CardHeader className="text-center pb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-tanzania-green to-green-500 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-xl animate-bounce-gentle">
                <User className="w-10 h-10 text-white" />
              </div>
              <CardTitle className="text-2xl sm:text-3xl text-tanzania-navy font-bold">Create Your Account</CardTitle>
              <CardDescription className="text-tanzania-text/70">
                Enter your details and referral code to get started
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="fullName" className="text-tanzania-navy font-medium flex items-center">
                    <User className="w-4 h-4 mr-2 text-tanzania-green" />
                    Full Name *
                  </Label>
                  <Input
                    id="fullName"
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                    className="h-12 border-2 border-tanzania-grey/50 focus:border-tanzania-green rounded-xl transition-all duration-300"
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="phone" className="text-tanzania-navy font-medium flex items-center">
                    <Phone className="w-4 h-4 mr-2 text-tanzania-green" />
                    Phone Number *
                  </Label>
                  <Input
                    id="phone"
                    placeholder="+255 XXX XXX XXX"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    className="h-12 border-2 border-tanzania-grey/50 focus:border-tanzania-green rounded-xl transition-all duration-300"
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="referralCode" className="text-tanzania-navy font-medium flex items-center">
                    <Key className="w-4 h-4 mr-2 text-tanzania-green" />
                    Referral Code *
                  </Label>
                  <Input
                    id="referralCode"
                    placeholder="MC-DAR-AB1234"
                    value={formData.referralCode}
                    onChange={(e) => setFormData(prev => ({ ...prev, referralCode: e.target.value.toUpperCase() }))}
                    className="h-12 border-2 border-tanzania-grey/50 focus:border-tanzania-green rounded-xl transition-all duration-300 font-mono"
                  />
                  <p className="text-sm text-tanzania-text/60 flex items-center">
                    <CheckCircle className="w-3 h-3 mr-1 text-tanzania-green" />
                    Format: MC-REGION-XXXXXX
                  </p>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="region" className="text-tanzania-navy font-medium flex items-center">
                    <MapPin className="w-4 h-4 mr-2 text-tanzania-green" />
                    Region/City *
                  </Label>
                  <Select value={formData.region} onValueChange={(value) => setFormData(prev => ({ ...prev, region: value }))}>
                    <SelectTrigger className="h-12 border-2 border-tanzania-grey/50 focus:border-tanzania-green rounded-xl transition-all duration-300">
                      <SelectValue placeholder="Select your region" />
                    </SelectTrigger>
                    <SelectContent className="max-h-60 bg-white/95 backdrop-blur-sm">
                      {tanzanianRegions.map((region) => (
                        <SelectItem key={region} value={region} className="hover:bg-tanzania-green/10">
                          {region}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button 
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r from-tanzania-green to-green-500 hover:from-green-500 hover:to-tanzania-green text-white text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  Complete Registration
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </form>

              <Card className="bg-gradient-to-br from-blue-50 to-green-50 border-0 p-4 mt-6">
                <h3 className="font-semibold text-tanzania-navy mb-3 flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2 text-tanzania-green" />
                  What happens next?
                </h3>
                <ul className="text-sm text-tanzania-text/70 space-y-2">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-tanzania-green rounded-full mr-3"></div>
                    Your unique referral ID will be generated automatically
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-tanzania-green rounded-full mr-3"></div>
                    You'll be redirected to complete payment
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-tanzania-green rounded-full mr-3"></div>
                    Access your dashboard after payment confirmation
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-tanzania-green rounded-full mr-3"></div>
                    Start earning TSH 500 per referral!
                  </li>
                </ul>
              </Card>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Register;
