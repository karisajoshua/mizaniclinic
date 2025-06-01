
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, MapPin, Key, Phone, CheckCircle, ArrowRight, Globe } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { EAST_AFRICAN_COUNTRIES, COUNTRY_REGIONS } from "@/utils/eastAfricaData";

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    country: "Tanzania",
    phone: "+255 ",
    referralCode: "",
    region: ""
  });
  const navigate = useNavigate();

  // Update phone code when country changes
  useEffect(() => {
    const selectedCountry = EAST_AFRICAN_COUNTRIES.find(c => c.name === formData.country);
    if (selectedCountry) {
      setFormData(prev => ({ 
        ...prev, 
        phone: `${selectedCountry.phoneCode} `,
        region: "" // Reset region when country changes
      }));
    }
  }, [formData.country]);

  const availableRegions = COUNTRY_REGIONS[formData.country] || [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.country || !formData.phone || !formData.referralCode || !formData.region) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    // Validate phone number has more than just country code
    const selectedCountry = EAST_AFRICAN_COUNTRIES.find(c => c.name === formData.country);
    if (selectedCountry && formData.phone.trim() === selectedCountry.phoneCode.trim()) {
      toast({
        title: "Error",
        description: "Please enter your phone number after the country code",
        variant: "destructive"
      });
      return;
    }

    // Validate referral code format (MCA25-T0001DSM)
    const referralCodeRegex = /^MCA25-[A-Z]\d{4}[A-Z]{3}$/;
    if (!referralCodeRegex.test(formData.referralCode)) {
      toast({
        title: "Invalid Referral Code",
        description: "Referral code must be in format: MCA25-T0001DSM",
        variant: "destructive"
      });
      return;
    }

    // Store registration data WITHOUT generating referral ID
    localStorage.setItem('registrationData', JSON.stringify({
      ...formData,
      registrationDate: new Date().toISOString()
    }));

    toast({
      title: "Registration Successful!",
      description: "Please proceed to payment to activate your account",
    });

    // Navigate to payment page
    navigate('/payment');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-3">
        <Label htmlFor="name" className="text-tanzania-navy font-medium flex items-center">
          <User className="w-4 h-4 mr-2 text-tanzania-green" />
          Name *
        </Label>
        <Input
          id="name"
          placeholder="Enter your name"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          className="h-12 border-2 border-tanzania-grey/50 focus:border-tanzania-green rounded-xl transition-all duration-300"
        />
      </div>

      <div className="space-y-3">
        <Label htmlFor="country" className="text-tanzania-navy font-medium flex items-center">
          <Globe className="w-4 h-4 mr-2 text-tanzania-green" />
          Country *
        </Label>
        <Select value={formData.country} onValueChange={(value) => setFormData(prev => ({ ...prev, country: value }))}>
          <SelectTrigger className="h-12 border-2 border-tanzania-grey/50 focus:border-tanzania-green rounded-xl transition-all duration-300">
            <SelectValue placeholder="Select your country" />
          </SelectTrigger>
          <SelectContent className="max-h-60 bg-white/95 backdrop-blur-sm">
            {EAST_AFRICAN_COUNTRIES.map((country) => (
              <SelectItem key={country.code} value={country.name} className="hover:bg-tanzania-green/10">
                {country.name} ({country.phoneCode})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        <Label htmlFor="phone" className="text-tanzania-navy font-medium flex items-center">
          <Phone className="w-4 h-4 mr-2 text-tanzania-green" />
          Phone Number *
        </Label>
        <Input
          id="phone"
          placeholder="XXX XXX XXX"
          value={formData.phone}
          onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
          className="h-12 border-2 border-tanzania-grey/50 focus:border-tanzania-green rounded-xl transition-all duration-300"
        />
        <p className="text-sm text-tanzania-text/60">
          Country code is automatically added based on your selected country
        </p>
      </div>

      <div className="space-y-3">
        <Label htmlFor="referralCode" className="text-tanzania-navy font-medium flex items-center">
          <Key className="w-4 h-4 mr-2 text-tanzania-green" />
          Referral Code *
        </Label>
        <Input
          id="referralCode"
          placeholder="MCA25-T0001DSM"
          value={formData.referralCode}
          onChange={(e) => setFormData(prev => ({ ...prev, referralCode: e.target.value.toUpperCase() }))}
          className="h-12 border-2 border-tanzania-grey/50 focus:border-tanzania-green rounded-xl transition-all duration-300 font-mono"
        />
        <p className="text-sm text-tanzania-text/60 flex items-center">
          <CheckCircle className="w-3 h-3 mr-1 text-tanzania-green" />
          Format: MCA25-T0001DSM
        </p>
      </div>

      <div className="space-y-3">
        <Label htmlFor="region" className="text-tanzania-navy font-medium flex items-center">
          <MapPin className="w-4 h-4 mr-2 text-tanzania-green" />
          Region *
        </Label>
        <Select value={formData.region} onValueChange={(value) => setFormData(prev => ({ ...prev, region: value }))}>
          <SelectTrigger className="h-12 border-2 border-tanzania-grey/50 focus:border-tanzania-green rounded-xl transition-all duration-300">
            <SelectValue placeholder="Select your region" />
          </SelectTrigger>
          <SelectContent className="max-h-60 bg-white/95 backdrop-blur-sm">
            {availableRegions.map((region) => (
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
  );
};

export default RegistrationForm;
