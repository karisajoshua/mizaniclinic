import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Receipt, CheckCircle, Phone, Copy, CreditCard } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import MobileHeader from "@/components/MobileHeader";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const Payment = () => {
  const [receiptCode, setReceiptCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [registrationData, setRegistrationData] = useState<any>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {

    const fetchRegistrationData = async () => {
      const { data, error } = await supabase
        .from('ambassador_registrations')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error || !data) {
        console.error('Error fetching registration data:', error);
        navigate('/register');
        return;
      }

      setRegistrationData(data);
    };

    fetchRegistrationData();
  }, [user, navigate]);

  const handleReceiptVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!receiptCode) {
      toast({
        title: "Error",
        description: "Please enter your receipt code",
        variant: "destructive"
      });
      return;
    }

    if (!user || !registrationData) {
      toast({
        title: "Error",
        description: "Registration data not found",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      // Check if receipt code exists and is available
      const { data: receiptData, error: receiptError } = await supabase
        .from('receipt_codes')
        .select('*')
        .eq('code', receiptCode.toUpperCase())
        .eq('status', 'available')
        .single();

      if (receiptError || !receiptData) {
        // Check if the code exists but is already used
        const { data: usedReceiptData, error: usedReceiptError } = await supabase
          .from('receipt_codes')
          .select('*')
          .eq('code', receiptCode.toUpperCase())
          .single();

        if (usedReceiptError || !usedReceiptData) {
          toast({
            title: "Invalid Receipt Code",
            description: "Sorry, the receipt number does not exist",
            variant: "destructive"
          });
        } else {
          toast({
            title: "Receipt Code Already Used",
            description: "This receipt code has already been used",
            variant: "destructive"
          });
        }
        setLoading(false);
        return;
      }

      // Mark receipt code as used
      const { error: updateReceiptError } = await supabase
        .from('receipt_codes')
        .update({
          status: 'used',
          used_by: user.id,
          used_at: new Date().toISOString()
        })
        .eq('code', receiptCode.toUpperCase());

      if (updateReceiptError) {
        console.error('Error updating receipt code:', updateReceiptError);
        toast({
          title: "Error",
          description: "Failed to process payment verification",
          variant: "destructive"
        });
        setLoading(false);
        return;
      }

      // Update ambassador registration status
      const { error: updateRegistrationError } = await supabase
        .from('ambassador_registrations')
        .update({
          status: 'activated',
          receipt_code: receiptCode.toUpperCase(),
          payment_verified_at: new Date().toISOString(),
          activated_at: new Date().toISOString()
        })
        .eq('user_id', user.id);

      if (updateRegistrationError) {
        console.error('Error updating registration:', updateRegistrationError);
        toast({
          title: "Error",
          description: "Failed to activate account",
          variant: "destructive"
        });
        setLoading(false);
        return;
      }
      console.log("user", user)

      // Update profile status
      const { error: updateProfileError } = await supabase
        .from('profiles')
        .update({
          status: 'activated',
          payment_status: 'confirmed'
        })
        .eq('id', user.id);

      if (updateProfileError) {
        console.error('Error updating profile:', updateProfileError);
      }

      toast({
        title: "Payment Confirmed!",
        description: `Welcome to Mizani Clinic! Your Ambassador ID: ${registrationData.ambassador_id}`,
      });

      // Navigate to dashboard
      navigate('/dashboard');

    } catch (error) {
      console.error('Payment verification error:', error);
      toast({
        title: "Error",
        description: "Payment verification failed. Please try again.",
        variant: "destructive"
      });
    }

    setLoading(false);
  };

  if (!user) {
    navigate('/register');
    return;
  }

  if (!registrationData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <MobileHeader />

      <div className="px-4 py-8">
        <div className="container mx-auto max-w-2xl">
          {/* Progress Indicator */}
          <div className="mb-8 animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-tanzania-green rounded-full flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
                <span className="text-tanzania-green font-medium">Registered</span>
              </div>
              <div className="flex-1 h-1 bg-tanzania-grey mx-4 rounded-full">
                <div className="h-1 bg-tanzania-green rounded-full w-full"></div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-tanzania-green rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">2</span>
                </div>
                <span className="text-tanzania-green font-medium">Payment</span>
              </div>
            </div>
          </div>

          {/* Registration Summary */}
          <Card className="mb-8 border-0 bg-gradient-to-br from-green-50 to-blue-50 shadow-glass animate-fade-in">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-tanzania-green to-green-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-tanzania-navy text-xl">Registration Successful!</CardTitle>
                  <CardDescription>Your Ambassador ID has been generated</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="space-y-1">
                  <span className="font-semibold text-tanzania-navy">Ambassador ID:</span>
                  <p className="text-tanzania-text font-mono text-lg font-bold">{registrationData.ambassador_id}</p>
                </div>
                <div className="space-y-1">
                  <span className="font-semibold text-tanzania-navy">Region:</span>
                  <p className="text-tanzania-text">{registrationData.region}</p>
                </div>
                <div className="space-y-1">
                  <span className="font-semibold text-tanzania-navy">Country:</span>
                  <p className="text-tanzania-text">{registrationData.country}</p>
                </div>
                <div className="space-y-1">
                  <span className="font-semibold text-tanzania-navy">Used Referral:</span>
                  <p className="text-tanzania-text font-mono">{registrationData.referral_code}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Verification */}
          <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-glass hover:shadow-glass-hover transition-all duration-300 animate-scale-in">
            <CardHeader className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-tanzania-green to-green-500 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-xl animate-bounce-gentle">
                <Receipt className="w-10 h-10 text-white" />
              </div>
              <CardTitle className="text-2xl sm:text-3xl text-tanzania-navy font-bold">Verify Payment</CardTitle>
              <CardDescription className="text-tanzania-text/70">
                Enter your receipt code to activate your account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Receipt Code Instructions */}
              <Card className="bg-gradient-to-br from-blue-50 to-green-50 border-0 p-6">
                <div className="text-center">
                  <h3 className="font-semibold text-tanzania-navy mb-4 text-lg">Payment Instructions</h3>
                  <p className="text-sm text-tanzania-text mb-4">
                    Use one of the valid receipt codes below to activate your account:
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-mono bg-white/70 rounded-xl p-4 max-h-40 overflow-y-auto">
                    {["A1F9ZQ", "B3KT82", "C8L5RX", "D4M7VA", "E7Q6PW", "F9A1ZT", "G2X8KY", "H6N0CJ"].map((code) => (
                      <button
                        key={code}
                        onClick={() => setReceiptCode(code)}
                        className="p-2 bg-tanzania-green/10 hover:bg-tanzania-green/20 rounded-md transition-colors cursor-pointer"
                      >
                        {code}
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-tanzania-text/60 mt-2">
                    Click any code above to use it, or enter manually below
                  </p>
                </div>
              </Card>

              {/* Receipt Code Form */}
              <form onSubmit={handleReceiptVerification} className="space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="receiptCode" className="text-tanzania-navy font-medium flex items-center">
                    <Receipt className="w-4 h-4 mr-2 text-tanzania-green" />
                    Receipt Code *
                  </Label>
                  <Input
                    id="receiptCode"
                    placeholder="Enter receipt code (e.g., A1F9ZQ)"
                    value={receiptCode}
                    onChange={(e) => setReceiptCode(e.target.value.toUpperCase())}
                    className="h-12 border-2 border-tanzania-grey/50 focus:border-tanzania-green rounded-xl transition-all duration-300 font-mono text-center text-lg"
                    maxLength={6}
                  />
                  <p className="text-sm text-tanzania-text/60">
                    Enter a valid 6-character receipt code to activate your account
                  </p>
                </div>

                <Button 
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r from-tanzania-green to-green-500 hover:from-green-500 hover:to-tanzania-green text-white text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  disabled={loading}
                >
                  {loading ? "Verifying..." : "Verify Payment & Activate Account"}
                </Button>
              </form>

              <Card className="mt-6 bg-gradient-to-br from-blue-50 to-green-50 border-0 p-4">
                <h3 className="font-semibold text-tanzania-navy mb-3 flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2 text-tanzania-green" />
                  After Verification:
                </h3>
                <ul className="text-sm text-tanzania-text/70 space-y-2">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-tanzania-green rounded-full mr-3"></div>
                    Your account will be immediately activated
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-tanzania-green rounded-full mr-3"></div>
                    You can log in using your Ambassador ID and password
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-tanzania-green rounded-full mr-3"></div>
                    Access your dashboard and start earning
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-tanzania-green rounded-full mr-3"></div>
                    Begin sharing your referral code with others
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

export default Payment;
