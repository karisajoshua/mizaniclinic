
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate, useSearchParams } from "react-router-dom";
import { User, MapPin, Key, Phone, CheckCircle, ArrowRight, Eye, EyeOff } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { EAST_AFRICAN_COUNTRIES, COUNTRY_REGIONS } from "@/utils/eastAfricaData";

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    referralCode: "",
    region: "",
    country: "Tanzania",
    phone: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Pre-fill referral code from URL if available
  useState(() => {
    const refCode = searchParams.get('ref');
    if (refCode) {
      setFormData(prev => ({ ...prev, referralCode: refCode }));
    }
  });

  const handleCountryChange = (country: string) => {
    setFormData(prev => ({ 
      ...prev, 
      country, 
      region: "" // Reset region when country changes
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.fullName || !formData.email || !formData.password || !formData.referralCode || !formData.region || !formData.phone) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      setLoading(false);
      return;
    }

    try {
      console.log('Starting registration process...');
      
      // First create the user account
      const { data, error: authError } = await signUp(formData.email, formData.password, formData.fullName);

      if (authError) {
        console.error('Auth error:', authError);
        toast({
          title: "Registration Failed",
          description: authError.message,
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      if (!data?.user) {
        console.error('No user data returned from signup');
        toast({
          title: "Registration Failed",
          description: "Failed to create user account. Please try again.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      const user = data.user;
      console.log('User created successfully:', user.id);
      
      // Generate ambassador ID using the database function
      const { data: ambassadorIdResult, error: idError } = await supabase
        .rpc('generate_ambassador_id', {
          p_region: formData.region,
          p_country: formData.country
        });

      if (idError || !ambassadorIdResult) {
        console.error('Error generating ambassador ID:', idError);
        
        // Clean up the created user if ambassador ID generation fails
        await supabase.auth.admin.deleteUser(user.id);
        
        toast({
          title: "Registration Failed",
          description: "Failed to generate ambassador ID. Please try again.",
          variant: "destructive"
        });
        setLoading(false);
        return;
      }

      const ambassadorId = ambassadorIdResult;
      console.log('Generated ambassador ID:', ambassadorId);

      // Create both profile and ambassador registration in a transaction-like manner
      const registrationData = {
        fullName: formData.fullName,
        email: formData.email,
        region: formData.region,
        country: formData.country,
        referralCode: formData.referralCode,
        phone: formData.phone,
        ambassadorId,
        userId: user.id,
        registrationDate: new Date().toISOString()
      };

      // Create profile with complete data
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          full_name: formData.fullName,
          phone: formData.phone,
          region: formData.region,
          country: formData.country,
          ambassador_id: ambassadorId,
          user_referral_id: ambassadorId,
          referral_code: formData.referralCode,
          status: 'pending',
          payment_status: 'pending',
          registration_data: registrationData
        });

      if (profileError) {
        console.error('Profile creation error:', profileError);
        
        // Clean up the created user if profile creation fails
        await supabase.auth.admin.deleteUser(user.id);
        
        toast({
          title: "Registration Failed",
          description: "Failed to create user profile. Please try again.",
          variant: "destructive"
        });
        setLoading(false);
        return;
      }

      // Create ambassador registration record
      const { error: ambassadorError } = await supabase
        .from('ambassador_registrations')
        .insert({
          user_id: user.id,
          ambassador_id: ambassadorId,
          region: formData.region,
          country: formData.country,
          referral_code: formData.referralCode,
          status: 'pending'
        });

      if (ambassadorError) {
        console.error('Ambassador registration error:', ambassadorError);
        
        // Clean up created profile and user if ambassador registration fails
        await supabase.from('profiles').delete().eq('id', user.id);
        await supabase.auth.admin.deleteUser(user.id);
        
        toast({
          title: "Registration Failed",
          description: "Failed to complete ambassador registration. Please try again.",
          variant: "destructive"
        });
        setLoading(false);
        return;
      }

      console.log('Registration completed successfully');

      // Store registration data for the payment page
      localStorage.setItem('registrationData', JSON.stringify(registrationData));

      toast({
        title: "Registration Successful!",
        description: `Your Ambassador ID: ${ambassadorId}. Please complete payment to activate your account.`,
      });

      // Navigate to payment page
      navigate('/payment');

    } catch (error) {
      console.error('Unexpected registration error:', error);
      toast({
        title: "Registration Failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const availableRegions = COUNTRY_REGIONS[formData.country] || [];

  return (
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
        <Label htmlFor="email" className="text-tanzania-navy font-medium flex items-center">
          <Phone className="w-4 h-4 mr-2 text-tanzania-green" />
          Email *
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
          className="h-12 border-2 border-tanzania-grey/50 focus:border-tanzania-green rounded-xl transition-all duration-300"
        />
      </div>

      <div className="space-y-3">
        <Label htmlFor="password" className="text-tanzania-navy font-medium flex items-center">
          <Key className="w-4 h-4 mr-2 text-tanzania-green" />
          Password *
        </Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Create a password"
            value={formData.password}
            onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
            minLength={6}
            className="h-12 border-2 border-tanzania-grey/50 focus:border-tanzania-green rounded-xl transition-all duration-300 pr-12"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-tanzania-grey hover:text-tanzania-green transition-colors"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        </div>
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
        <Label htmlFor="country" className="text-tanzania-navy font-medium flex items-center">
          <MapPin className="w-4 h-4 mr-2 text-tanzania-green" />
          Country *
        </Label>
        <Select value={formData.country} onValueChange={handleCountryChange}>
          <SelectTrigger className="h-12 border-2 border-tanzania-grey/50 focus:border-tanzania-green rounded-xl transition-all duration-300">
            <SelectValue placeholder="Select your country" />
          </SelectTrigger>
          <SelectContent className="max-h-60 bg-white/95 backdrop-blur-sm">
            {EAST_AFRICAN_COUNTRIES.map((country) => (
              <SelectItem key={country.name} value={country.name} className="hover:bg-tanzania-green/10">
                {country.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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
        disabled={loading}
      >
        {loading ? "Creating Account..." : "Complete Registration"}
        <ArrowRight className="ml-2 w-5 h-5" />
      </Button>
    </form>
  );
};

export default RegistrationForm;
