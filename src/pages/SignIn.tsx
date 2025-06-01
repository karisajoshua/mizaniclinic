
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { Phone, User, Key, TestTube } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";
import MobileHeader from "@/components/MobileHeader";
import { TEST_AMBASSADORS } from "@/utils/eastAfricaData";

const SignIn = () => {
  const [ambassadorId, setAmbassadorId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Check if it's a test account first
    const testAccount = TEST_AMBASSADORS.find(
      account => account.ambassadorId === ambassadorId && account.password === password
    );

    if (testAccount) {
      // Store test user data in localStorage for dashboard access
      localStorage.setItem('testUser', JSON.stringify({
        ambassadorId: testAccount.ambassadorId,
        name: testAccount.name,
        region: testAccount.region,
        country: testAccount.country,
        isTestAccount: true
      }));

      toast({
        title: "Test Login Successful!",
        description: `Welcome ${testAccount.name}! You are using a test account.`,
      });
      navigate("/dashboard");
      setLoading(false);
      return;
    }

    // For real accounts, use the auth system
    const email = `${ambassadorId.toLowerCase()}@mizaniclinic.com`;
    const { error } = await signIn(email, password);

    if (error) {
      toast({
        title: "Error",
        description: "Invalid Ambassador ID or password",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success!",
        description: "You have been signed in successfully.",
      });
      navigate("/dashboard");
    }

    setLoading(false);
  };

  const handleTestLogin = (testAccount: typeof TEST_AMBASSADORS[0]) => {
    setAmbassadorId(testAccount.ambassadorId);
    setPassword(testAccount.password);
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
              Sign in with your Ambassador ID
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
                  placeholder="MCA25-T0001DSM"
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

            {/* Test Accounts Section */}
            <Card className="bg-gradient-to-br from-blue-50 to-green-50 border-0 p-4">
              <h3 className="font-bold text-tanzania-navy mb-3 flex items-center">
                <TestTube className="w-5 h-5 mr-2 text-tanzania-green" />
                Test Accounts (For Development)
              </h3>
              <div className="space-y-2">
                {TEST_AMBASSADORS.map((account, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => handleTestLogin(account)}
                    className="w-full text-left justify-start hover:bg-tanzania-green/10 border-tanzania-green/30"
                  >
                    <div className="text-left">
                      <div className="font-semibold text-xs">{account.ambassadorId}</div>
                      <div className="text-xs text-gray-600">{account.name} - {account.country}</div>
                    </div>
                  </Button>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Click any test account to auto-fill login credentials
              </p>
            </Card>
            
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
