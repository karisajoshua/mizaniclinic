
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CreditCard, CheckCircle, Receipt, ArrowLeft, User, MapPin } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import MobileHeader from "@/components/MobileHeader";
import ProgressIndicator from "@/components/registration/ProgressIndicator";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

interface RegistrationData {
  fullName: string;
  email: string;
  region: string;
  country: string;
  referralCode: string;
  phone: string;
  ambassadorId: string;
  userId: string;
  registrationDate: string;
}

const Payment = () => {
  const [receiptCode, setReceiptCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [registrationData, setRegistrationData] = useState<RegistrationData | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Get registration data from localStorage
    const storedData = localStorage.getItem('registrationData');
    if (storedData) {
      setRegistrationData(JSON.parse(storedData));
    } else if (user) {
      // Fallback: try to get data from the database
      fetchRegistrationData();
    }
  }, [user]);

  const fetchRegistrationData = async () => {
    if (!user) return;

    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return;
      }

      if (profile && profile.registration_data) {
        setRegistrationData(profile.registration_data as unknown as RegistrationData);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const progressSteps = [
    { number: 1, label: "Register" },
    { number: 2, label: "Payment" }
  ];

  const handleVerifyReceipt = async () => {
    if (!receiptCode.trim()) {
      toast({
        title: "Error",
        description: "Please enter a receipt code",
        variant: "destructive"
      });
      return;
    }

    if (!registrationData) {
      toast({
        title: "Error",
        description: "Registration data not found. Please register again.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      console.log('Starting payment verification process...');
      
      // Check if receipt code exists and is available
      const { data: receiptData, error: receiptError } = await supabase
        .from('receipt_codes')
        .select('*')
        .eq('code', receiptCode.trim())
        .eq('status', 'available')
        .single();

      if (receiptError || !receiptData) {
        toast({
          title: "Invalid Receipt Code",
          description: "This receipt code is not valid or has already been used.",
          variant: "destructive"
        });
        setLoading(false);
        return;
      }

      console.log('Receipt code validated, proceeding with updates...');

      // Start transaction-like updates
      const updates = [];

      // 1. Mark receipt as used
      updates.push(
        supabase
          .from('receipt_codes')
          .update({
            status: 'used',
            used_by: user?.id,
            used_at: new Date().toISOString()
          })
          .eq('code', receiptCode.trim())
      );

      // 2. Update ambassador registration status
      updates.push(
        supabase
          .from('ambassador_registrations')
          .update({
            status: 'active',
            payment_verified_at: new Date().toISOString(),
            activated_at: new Date().toISOString(),
            receipt_code: receiptCode.trim()
          })
          .eq('user_id', user?.id)
      );

      // 3. Update profile with BOTH ambassador_id and user_referral_id for consistency
      updates.push(
        supabase
          .from('profiles')
          .update({
            status: 'active',
            payment_status: 'confirmed',
            ambassador_id: registrationData.ambassadorId,
            user_referral_id: registrationData.ambassadorId // Ensure both fields are set
          })
          .eq('id', user?.id)
      );

      // Execute all updates
      const results = await Promise.all(updates);
      
      // Check for any errors in the updates
      const hasErrors = results.some(result => result.error);
      if (hasErrors) {
        console.error('Some updates failed:', results.map(r => r.error).filter(Boolean));
        throw new Error('Failed to complete all payment updates');
      }

      console.log('All database updates completed successfully');

      // Store payment confirmation with the correct ambassador ID
      const userAccount = {
        fullName: registrationData.fullName,
        region: registrationData.region,
        country: registrationData.country,
        userReferralId: registrationData.ambassadorId,
        paymentConfirmed: true,
        ambassadorId: registrationData.ambassadorId
      };

      localStorage.setItem('userAccount', JSON.stringify(userAccount));
      
      // Clear registration data since it's no longer needed
      localStorage.removeItem('registrationData');

      console.log('Payment verified successfully, showing success message...');

      toast({
        title: "Payment Verified! 🎉",
        description: "Your account has been activated. Welcome to the Mizani Clinic Ambassador program!",
      });

      // Add a small delay to ensure database updates propagate
      setTimeout(() => {
        console.log('Navigating to dashboard with payment success state...');
        navigate('/dashboard', { 
          replace: true,
          state: { paymentJustCompleted: true }
        });
      }, 1500); // 1.5 second delay to ensure updates complete

    } catch (error) {
      console.error('Payment verification error:', error);
      toast({
        title: "Error",
        description: "Payment verification failed. Please try again.",
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
          <ProgressIndicator 
            currentStep={2} 
            totalSteps={2} 
            steps={progressSteps} 
          />

          <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-glass hover:shadow-glass-hover transition-all duration-300 animate-scale-in">
            <CardHeader className="text-center pb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-tanzania-green to-green-500 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-xl animate-bounce-gentle">
                <CreditCard className="w-10 h-10 text-white" />
              </div>
              <CardTitle className="text-2xl sm:text-3xl text-tanzania-navy font-bold">Payment Verification</CardTitle>
              <CardDescription className="text-tanzania-text/70">
                Enter your receipt code to activate your ambassador account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {registrationData && (
                <Card className="bg-gradient-to-br from-blue-50 to-green-50 border-2 border-tanzania-green/20 p-4 rounded-xl">
                  <h3 className="font-bold text-tanzania-navy mb-3 flex items-center">
                    <CheckCircle className="w-5 h-5 mr-2 text-tanzania-green" />
                    Registration Summary
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-tanzania-text/70 flex items-center">
                        <User className="w-4 h-4 mr-2 text-tanzania-green" />
                        Full Name:
                      </span>
                      <span className="font-semibold text-tanzania-navy">{registrationData.fullName}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-tanzania-text/70 flex items-center">
                        <CheckCircle className="w-4 h-4 mr-2 text-tanzania-green" />
                        Referral Code Used:
                      </span>
                      <span className="font-mono font-semibold text-tanzania-green">{registrationData.referralCode}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-tanzania-text/70 flex items-center">
                        <MapPin className="w-4 h-4 mr-2 text-tanzania-green" />
                        Region:
                      </span>
                      <span className="font-semibold text-tanzania-navy">{registrationData.region}, {registrationData.country}</span>
                    </div>
                  </div>
                </Card>
              )}

              <div className="space-y-4">
                <div className="space-y-3">
                  <Label htmlFor="receiptCode" className="text-tanzania-navy font-medium flex items-center">
                    <Receipt className="w-4 h-4 mr-2 text-tanzania-green" />
                    Receipt Code *
                  </Label>
                  <Input
                    id="receiptCode"
                    placeholder="Enter your receipt code"
                    value={receiptCode}
                    onChange={(e) => setReceiptCode(e.target.value.toUpperCase())}
                    className="h-12 border-2 border-tanzania-grey/50 focus:border-tanzania-green rounded-xl transition-all duration-300"
                  />
                  <p className="text-sm text-tanzania-text/60">
                    Enter the receipt code you received after making your payment
                  </p>
                </div>

                <Button 
                  onClick={handleVerifyReceipt}
                  className="w-full h-12 bg-gradient-to-r from-tanzania-green to-green-500 hover:from-green-500 hover:to-tanzania-green text-white text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  disabled={loading}
                >
                  {loading ? "Verifying..." : "Verify Payment"}
                  <CheckCircle className="ml-2 w-5 h-5" />
                </Button>

                <Button 
                  onClick={() => navigate('/register')}
                  variant="outline"
                  className="w-full h-12 border-2 border-tanzania-green text-tanzania-green hover:bg-tanzania-green hover:text-white rounded-xl font-semibold transition-all duration-300"
                >
                  <ArrowLeft className="mr-2 w-5 h-5" />
                  Back to Registration
                </Button>
              </div>

              <div className="bg-blue-50 p-4 rounded-xl">
                <h4 className="font-semibold text-blue-800 mb-2">Need Help?</h4>
                <p className="text-sm text-blue-600">
                  If you don't have a receipt code yet, please complete your payment first. 
                  Contact support if you've made a payment but haven't received your code.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Payment;
