import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, MapPin, Key, Phone, CheckCircle, ArrowRight, Globe, Lock, Eye, EyeOff } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { EAST_AFRICAN_COUNTRIES, COUNTRY_REGIONS } from "@/utils/eastAfricaData";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    country: "Tanzania",
    phone: "+255 ",
    password: "",
    confirmPassword: "",
    referralCode: "",
    region: ""
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { signUp } = useAuth();
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

  const generateAmbassadorId = async (region: string, country: string) => {
    const { data, error } = await supabase.rpc('generate_ambassador_id', {
      p_region: region,
      p_country: country
    });

    if (error) {
      console.error('Error generating ambassador ID:', error);
      throw error;
    }

    return data;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    console.log('Registration form submitted with data:', { ...formData, password: '[REDACTED]' });

    if (!formData.name || !formData.country || !formData.phone || !formData.password || !formData.confirmPassword || !formData.referralCode || !formData.region) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive"
      });
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters long",
        variant: "destructive"
      });
      setLoading(false);
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
      setLoading(false);
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
      setLoading(false);
      return;
    }

    try {
      console.log('Creating user account...');
      // Create user account with Supabase Auth
      const email = `${Date.now()}@mizaniclinic.temp`; // Temporary email since we're using ambassador ID for login
      const { error: signUpError } = await signUp(email, formData.password, formData.name);

      if (signUpError) {
        console.error('Signup error:', signUpError);
        toast({
          title: "Registration Error",
          description: signUpError.message,
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      console.log('Signup successful, getting current user...');
      
      // Wait a moment for auth state to update
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Get the current user
      const { data: { user } } = await supabase.auth.getUser();
      console.log('Current user after signup:', user?.id);
      
      if (!user) {
        console.error('No user found after signup');
        toast({
          title: "Error",
          description: "Failed to create user account. Please try again.",
          variant: "destructive"
        });
        setLoading(false);
        return;
      }

      console.log('Generating ambassador ID...');
      // Generate ambassador ID
      const ambassadorId = await generateAmbassadorId(formData.region, formData.country);
      console.log('Generated ambassador ID:', ambassadorId);

      console.log('Creating ambassador registration record...');
      // Create ambassador registration record
      const { error: registrationError } = await supabase
        .from('ambassador_registrations')
        .insert({
          user_id: user.id,
          ambassador_id: ambassadorId,
          region: formData.region,
          country: formData.country,
          referral_code: formData.referralCode,
          status: 'pending'
        });

      if (registrationError) {
        console.error('Registration error:', registrationError);
        toast({
          title: "Error",
          description: "Failed to complete registration. Please try again.",
          variant: "destructive"
        });
        setLoading(false);
        return;
      }

      console.log('Updating profile...');
      // Update profile with ambassador ID and additional info
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          ambassador_id: ambassadorId,
          phone: formData.phone,
          region: formData.region,
          country: formData.country,
          referral_code: formData.referralCode,
          status: 'pending'
        })
        .eq('id', user.id);

      if (profileError) {
        console.error('Profile update error:', profileError);
      }

      console.log('Registration completed successfully, navigating to payment...');
      
      toast({
        title: "Registration Successful!",
        description: `Your Ambassador ID: ${ambassadorId}. Please proceed to payment.`,
      });

      // Ensure we're not in a loading state before navigation
      setLoading(false);


      console.log("initiating Navigation to Payments")
      // Add a small delay to allow the toast to be shown
      setTimeout(() => {
        navigate('/payment');
        console.log("Navigation to Payments triggered")
      }, 100);

      console.log("NAVIGATION COMPLETE")

    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: "Error",
        description: "Registration failed. Please try again.",
        variant: "destructive"
      });
      setLoading(false);
    } finally {
      setLoading(false);
    }
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
        <Label htmlFor="password" className="text-tanzania-navy font-medium flex items-center">
          <Lock className="w-4 h-4 mr-2 text-tanzania-green" />
          Password *
        </Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Create a password"
            value={formData.password}
            onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
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
        <Label htmlFor="confirmPassword" className="text-tanzania-navy font-medium flex items-center">
          <Lock className="w-4 h-4 mr-2 text-tanzania-green" />
          Confirm Password *
        </Label>
        <div className="relative">
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
            className="h-12 border-2 border-tanzania-grey/50 focus:border-tanzania-green rounded-xl transition-all duration-300 pr-12"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-tanzania-grey hover:text-tanzania-green transition-colors"
            aria-label={showConfirmPassword ? "Hide password" : "Show password"}
          >
            {showConfirmPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        </div>
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
        disabled={loading}
      >
        {loading ? "Creating Account..." : "Complete Registration"}
        <ArrowRight className="ml-2 w-5 h-5" />
      </Button>
    </form>
  );
};

export default RegistrationForm;
