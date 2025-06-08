
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogIn, Eye, EyeOff, UserCheck } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import MobileHeader from "@/components/MobileHeader";
import { useAuth } from "@/hooks/useAuth";

const SignIn = () => {
  const [formData, setFormData] = useState({
    ambassadorId: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.ambassadorId || !formData.password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      setLoading(false);
      return;
    }

    try {
      // For now, use a temporary email format until proper ambassador ID login is implemented
      const email = `${formData.ambassadorId.toLowerCase()}@mizaniclinic.temp`;
      
      const { error } = await signIn(email, formData.password);

      if (error) {
        toast({
          title: "Sign In Failed",
          description: "Invalid Ambassador ID or password. Please check your credentials.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      toast({
        title: "Welcome Back! 🎉",
        description: "Successfully signed in to your ambassador dashboard",
      });

      navigate('/dashboard');
    } catch (error) {
      console.error('Sign in error:', error);
      toast({
        title: "Error",
        description: "Sign in failed. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-yellow-50 to-orange-50">
      <MobileHeader />

      <div className="px-4 py-8">
        <div className="container mx-auto max-w-md">
          <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-glass hover:shadow-glass-hover transition-all duration-300 animate-scale-in">
            <CardHeader className="text-center pb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-tanzania-green to-green-500 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-xl animate-bounce-gentle">
                <LogIn className="w-10 h-10 text-white" />
              </div>
              <CardTitle className="text-2xl sm:text-3xl text-tanzania-navy font-bold">Welcome Back</CardTitle>
              <CardDescription className="text-tanzania-text/70">
                Sign in to your ambassador dashboard
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="ambassadorId" className="text-tanzania-navy font-medium flex items-center">
                    <UserCheck className="w-4 h-4 mr-2 text-tanzania-green" />
                    Ambassador ID *
                  </Label>
                  <Input
                    id="ambassadorId"
                    placeholder="MCA25-000001"
                    value={formData.ambassadorId}
                    onChange={(e) => setFormData(prev => ({ ...prev, ambassadorId: e.target.value.toUpperCase() }))}
                    className="h-12 border-2 border-tanzania-grey/50 focus:border-tanzania-green rounded-xl transition-all duration-300 font-mono"
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="password" className="text-tanzania-navy font-medium flex items-center">
                    <div className="w-4 h-4 mr-2 bg-tanzania-green rounded-full"></div>
                    Password *
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
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

                <Button 
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r from-tanzania-green to-green-500 hover:from-green-500 hover:to-tanzania-green text-white text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  disabled={loading}
                >
                  {loading ? "Signing In..." : "Sign In"}
                  <LogIn className="ml-2 w-5 h-5" />
                </Button>
              </form>

              <div className="text-center space-y-4">
                <p className="text-sm text-tanzania-text/60">
                  Don't have an account?
                </p>
                <Link to="/register">
                  <Button 
                    variant="outline" 
                    className="w-full h-12 border-2 border-tanzania-green text-tanzania-green hover:bg-tanzania-green hover:text-white rounded-xl font-semibold transition-all duration-300"
                  >
                    Create Ambassador Account
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
