
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { Phone, User, Key, Eye, EyeOff } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import MobileHeader from "@/components/MobileHeader";
import { supabase } from "@/integrations/supabase/client";

const SignIn = () => {
  const [ambassadorId, setAmbassadorId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Real ambassador accounts
  const REAL_AMBASSADORS = [
    {
      ambassadorId: "TO001DSM",
      password: "Juma427",
      name: "Juma Mwaka Juma",
      phone: "+255744100100",
      region: "Dar es Salaam",
      country: "Tanzania"
    },
    {
      ambassadorId: "TO002DSM",
      password: "Margareth839",
      name: "Margareth Alex Tendwa", 
      phone: "+255763800300",
      region: "Dar es Salaam",
      country: "Tanzania"
    },
    {
      ambassadorId: "TO003DSM",
      password: "Hussein692",
      name: "Hussein Kyakalaba",
      phone: "+255654830826", 
      region: "Mbezi Luis",
      country: "Tanzania"
    },
    {
      ambassadorId: "TO004DSM",
      password: "Mapigano315",
      name: "Mapigano Hellon Lisso",
      phone: "+255766580600",
      region: "Kimara Suka", 
      country: "Tanzania"
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Check if it's one of the real ambassador accounts
    const realAccount = REAL_AMBASSADORS.find(
      account => account.ambassadorId === ambassadorId && account.password === password
    );

    if (realAccount) {
      // Store real user data in localStorage for dashboard access
      localStorage.setItem('currentUser', JSON.stringify({
        ambassadorId: realAccount.ambassadorId,
        name: realAccount.name,
        phone: realAccount.phone,
        region: realAccount.region,
        country: realAccount.country,
        isRealAccount: true
      }));

      toast({
        title: "Login Successful!",
        description: `Welcome back, ${realAccount.name}!`,
      });
      navigate("/dashboard");
      setLoading(false);
      return;
    }

    try {
      // Check database for other registered users
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id, full_name, ambassador_id, status')
        .eq('ambassador_id', ambassadorId)
        .single();

      if (profileError || !profileData) {
        toast({
          title: "Error",
          description: "Invalid Ambassador ID or password",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      if (profileData.status !== 'activated') {
        toast({
          title: "Account Not Activated",
          description: "Please complete payment verification first",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      // Store user data for dashboard access
      localStorage.setItem('currentUser', JSON.stringify({
        id: profileData.id,
        ambassadorId: profileData.ambassador_id,
        name: profileData.full_name,
        status: profileData.status
      }));

      toast({
        title: "Success!",
        description: `Welcome back, ${profileData.full_name}!`,
      });
      navigate("/dashboard");

    } catch (error) {
      console.error('Sign in error:', error);
      toast({
        title: "Error",
        description: "Sign in failed. Please try again.",
        variant: "destructive",
      });
    }

    setLoading(false);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-tanzania-grey via-white to-tanzania-grey">
      <MobileHeader />
      
      <div className="container mx-auto px-4 py-8 max-w-md">
        <Card className="border-0 shadow-2xl bg-white/90 backdrop-blur-sm">
          <CardHeader className="text-center space-y-4">
            <div className="w-16 h-16 bg-gradient-to-br from-tanzania-green to-tanzania-green-light rounded-2xl flex items-center justify-center mx-auto shadow-xl">
              <Phone className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-black text-tanzania-navy">Welcome Back</CardTitle>
            <CardDescription className="text-gray-600 font-medium">
              Sign in with your Ambassador ID and password
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="ambassadorId" className="text-tanzania-navy font-semibold flex items-center">
                  <User className="w-4 h-4 mr-2 text-tanzania-green" />
                  Ambassador ID
                </Label>
                <Input
                  id="ambassadorId"
                  type="text"
                  placeholder="TO001DSM"
                  value={ambassadorId}
                  onChange={(e) => setAmbassadorId(e.target.value.toUpperCase())}
                  required
                  className="border-2 border-gray-200 focus:border-tanzania-green font-mono"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-tanzania-navy font-semibold flex items-center">
                  <Key className="w-4 h-4 mr-2 text-tanzania-green" />
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="border-2 border-gray-200 focus:border-tanzania-green pr-10"
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-tanzania-green transition-colors"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
              
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-tanzania-green to-tanzania-green-light hover:from-tanzania-green-light hover:to-tanzania-green text-white font-bold py-3 rounded-xl shadow-lg"
                disabled={loading}
              >
                {loading ? "Signing In..." : "Sign In"}
              </Button>
            </form>
            
            <div className="text-center">
              <p className="text-gray-600">
                Don't have an account?{" "}
                <Link to="/register" className="text-tanzania-green font-semibold hover:underline">
                  Register here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignIn;
