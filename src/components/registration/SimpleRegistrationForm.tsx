
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Key, Mail, Eye, EyeOff } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

const SimpleRegistrationForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    referralCode: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleFieldChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!formData.email.trim()) {
      toast({
        title: "Error",
        description: "Email is required",
        variant: "destructive"
      });
      return false;
    }

    if (!formData.password.trim() || formData.password.length < 6) {
      toast({
        title: "Error", 
        description: "Password must be at least 6 characters",
        variant: "destructive"
      });
      return false;
    }

    if (!formData.referralCode.trim()) {
      toast({
        title: "Error",
        description: "Referral code is required",
        variant: "destructive"
      });
      return false;
    }

    // Simple format validation
    if (!/^MCA25-[A-Z0-9]+$/.test(formData.referralCode)) {
      toast({
        title: "Error",
        description: "Referral code must be in format MCA25-XXXXX",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      console.log('Starting simplified registration...');

      // Step 1: Create user account
      const { error: authError } = await signUp(
        formData.email.trim().toLowerCase(), 
        formData.password,
        "User" // Default name, can be updated later
      );

      if (authError) {
        console.error('Auth error:', authError);
        if (authError.message.includes('already registered')) {
          toast({
            title: "Registration Failed",
            description: "This email is already registered. Please try signing in.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Registration Failed", 
            description: authError.message,
            variant: "destructive",
          });
        }
        return;
      }

      // Step 2: Get the created user
      const { data: { user }, error: getUserError } = await supabase.auth.getUser();

      if (getUserError || !user) {
        console.error('Failed to get user after signup:', getUserError);
        toast({
          title: "Registration Failed",
          description: "Failed to create user account. Please try again.",
          variant: "destructive",
        });
        return;
      }

      console.log('User created successfully:', user.id);

      // Step 3: Generate ambassador ID using the fixed database function
      console.log('Calling generate_ambassador_id function...');
      const { data: ambassadorIdResult, error: idError } = await supabase
        .rpc('generate_ambassador_id', {
          p_region: 'Not Specified',
          p_country: 'Tanzania'
        });

      console.log('Ambassador ID generation result:', { ambassadorIdResult, idError });

      if (idError) {
        console.error('Error generating ambassador ID:', idError);
        toast({
          title: "Registration Failed",
          description: `Failed to generate ambassador ID: ${idError.message}`,
          variant: "destructive"
        });
        return;
      }

      if (!ambassadorIdResult) {
        console.error('No ambassador ID returned from function');
        toast({
          title: "Registration Failed",
          description: "Failed to generate ambassador ID. Please try again.",
          variant: "destructive"
        });
        return;
      }

      const ambassadorId = ambassadorIdResult;
      console.log('Generated ambassador ID:', ambassadorId);

      // Step 4: Create basic profile
      console.log('Creating profile with ambassador ID:', ambassadorId);
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          full_name: "User", // Default name
          phone: "", // Empty, to be filled later
          region: "Not Specified",
          country: "Tanzania",
          ambassador_id: ambassadorId,
          user_referral_id: ambassadorId,
          referral_code: formData.referralCode.trim(),
          status: 'active', // Skip pending status for simplicity
          payment_status: 'pending',
          registration_data: {
            email: formData.email.trim().toLowerCase(),
            referralCode: formData.referralCode.trim(),
            ambassadorId,
            registrationDate: new Date().toISOString(),
            simplified: true
          },
          registration_date: new Date().toISOString()
        });

      if (profileError) {
        console.error('Profile creation error:', profileError);
        toast({
          title: "Registration Failed",
          description: `Failed to create profile: ${profileError.message}`,
          variant: "destructive"
        });
        return;
      }

      console.log('Registration completed successfully');

      toast({
        title: "Welcome to Mizani Clinic!",
        description: `Registration successful! Your Ambassador ID: ${ambassadorId}`,
      });

      // Navigate directly to dashboard
      navigate('/dashboard');

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

  const handleReferralCodeChange = (value: string) => {
    // Auto-format to uppercase and ensure it starts with MCA25-
    let formattedValue = value.toUpperCase();
    
    if (formattedValue && !formattedValue.startsWith('MCA25-')) {
      if (formattedValue.startsWith('MCA25')) {
        formattedValue = formattedValue.replace('MCA25', 'MCA25-');
      } else {
        formattedValue = 'MCA25-' + formattedValue;
      }
    }
    
    handleFieldChange('referralCode', formattedValue);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Email Field */}
      <div className="space-y-3">
        <Label htmlFor="email" className="text-tanzania-navy font-medium flex items-center">
          <Mail className="w-4 h-4 mr-2 text-tanzania-green" />
          Email *
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={(e) => handleFieldChange('email', e.target.value)}
          className="h-12 border-2 border-tanzania-grey/50 focus:border-tanzania-green rounded-xl transition-all duration-300"
        />
      </div>

      {/* Password Field */}
      <div className="space-y-3">
        <Label htmlFor="password" className="text-tanzania-navy font-medium flex items-center">
          <Key className="w-4 h-4 mr-2 text-tanzania-green" />
          Password *
        </Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Create a password (min 6 characters)"
            value={formData.password}
            onChange={(e) => handleFieldChange('password', e.target.value)}
            minLength={6}
            className="h-12 border-2 border-tanzania-grey/50 focus:border-tanzania-green rounded-xl transition-all duration-300 pr-12"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-tanzania-grey hover:text-tanzania-green transition-colors"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Referral Code Field */}
      <div className="space-y-3">
        <Label htmlFor="referralCode" className="text-tanzania-navy font-medium flex items-center">
          <User className="w-4 h-4 mr-2 text-tanzania-green" />
          Referral Code *
        </Label>
        <Input
          id="referralCode"
          placeholder="MCA25-T0001DSM"
          value={formData.referralCode}
          onChange={(e) => handleReferralCodeChange(e.target.value)}
          className="h-12 border-2 border-tanzania-grey/50 focus:border-tanzania-green rounded-xl transition-all duration-300 font-mono"
        />
        <p className="text-sm text-tanzania-text/60">
          Enter the referral code from your sponsor
        </p>
      </div>

      {/* Submit Button */}
      <Button 
        type="submit"
        className="w-full h-12 bg-gradient-to-r from-tanzania-green to-green-500 hover:from-green-500 hover:to-tanzania-green text-white text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
        disabled={loading}
      >
        {loading ? "Creating Account..." : "Join Mizani Clinic"}
      </Button>
    </form>
  );
};

export default SimpleRegistrationForm;
