
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, User, MapPin, Key } from "lucide-react";
import { toast } from "@/hooks/use-toast";

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

    // Generate unique referral ID
    const userReferralId = `TDSM-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    
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
    <div className="min-h-screen bg-gradient-to-br from-tanzania-grey to-white">
      {/* Header */}
      <header className="bg-tanzania-navy text-white py-4 px-6">
        <div className="container mx-auto flex items-center space-x-4">
          <Link to="/">
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          <h1 className="text-xl font-bold">Register with Referral Code</h1>
        </div>
      </header>

      <div className="py-12 px-6">
        <div className="container mx-auto max-w-md">
          <Card className="border-2 border-tanzania-grey shadow-lg animate-fade-in">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-tanzania-green rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl text-tanzania-navy">Create Your Account</CardTitle>
              <CardDescription className="text-tanzania-text">
                Enter your details and referral code to get started
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-tanzania-navy font-medium">Full Name *</Label>
                  <Input
                    id="fullName"
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                    className="border-2 border-tanzania-grey focus:border-tanzania-green"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-tanzania-navy font-medium">Phone Number *</Label>
                  <Input
                    id="phone"
                    placeholder="+255 XXX XXX XXX"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    className="border-2 border-tanzania-grey focus:border-tanzania-green"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="referralCode" className="text-tanzania-navy font-medium">Referral Code *</Label>
                  <div className="relative">
                    <Key className="absolute left-3 top-3 w-4 h-4 text-tanzania-green" />
                    <Input
                      id="referralCode"
                      placeholder="TDSM-AB1234"
                      value={formData.referralCode}
                      onChange={(e) => setFormData(prev => ({ ...prev, referralCode: e.target.value.toUpperCase() }))}
                      className="pl-10 border-2 border-tanzania-grey focus:border-tanzania-green"
                    />
                  </div>
                  <p className="text-sm text-gray-600">Format: TDSM-XXXXXX</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="region" className="text-tanzania-navy font-medium">Region/City *</Label>
                  <Select value={formData.region} onValueChange={(value) => setFormData(prev => ({ ...prev, region: value }))}>
                    <SelectTrigger className="border-2 border-tanzania-grey focus:border-tanzania-green">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 text-tanzania-green mr-2" />
                        <SelectValue placeholder="Select your region" />
                      </div>
                    </SelectTrigger>
                    <SelectContent className="max-h-60">
                      {tanzanianRegions.map((region) => (
                        <SelectItem key={region} value={region}>
                          {region}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button 
                  type="submit"
                  className="w-full bg-tanzania-green hover:bg-tanzania-green-light text-white py-3 text-lg font-semibold"
                >
                  Complete Registration
                </Button>
              </form>

              <div className="mt-6 p-4 bg-tanzania-grey rounded-lg">
                <h3 className="font-semibold text-tanzania-navy mb-2">What happens next?</h3>
                <ul className="text-sm text-tanzania-text space-y-1">
                  <li>• Your unique referral ID will be generated</li>
                  <li>• You'll be redirected to complete payment</li>
                  <li>• Access your dashboard after payment confirmation</li>
                  <li>• Start earning KES 500 per referral!</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Register;
