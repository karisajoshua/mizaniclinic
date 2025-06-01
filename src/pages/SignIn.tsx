
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { Phone } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";
import MobileHeader from "@/components/MobileHeader";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await signIn(email, password);

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success!",
        description: "You have been signed in successfully.",
      });
      navigate("/");
    }

    setLoading(false);
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
              Sign in to your Mizani Clinic account
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-tanzania-navy font-semibold">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="border-2 border-gray-200 focus:border-tanzania-green"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-tanzania-navy font-semibold">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="border-2 border-gray-200 focus:border-tanzania-green"
                />
              </div>
              
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-tanzania-green to-tanzania-green-light hover:from-tanzania-green-light hover:to-tanzania-green text-white font-bold py-3 rounded-xl shadow-lg"
                disabled={loading}
              >
                {loading ? "Signing In..." : "Sign In"}
              </Button>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Don't have an account?{" "}
                <Link to="/signup" className="text-tanzania-green font-semibold hover:underline">
                  Sign up here
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
