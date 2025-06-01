
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Receipt, CheckCircle, Phone, Copy, CreditCard } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { generateReferralId } from "@/utils/regionCodes";
import MobileHeader from "@/components/MobileHeader";

const Payment = () => {
  const [transactionCode, setTransactionCode] = useState("");
  const [registrationData, setRegistrationData] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const data = localStorage.getItem('registrationData');
    if (!data) {
      navigate('/register');
      return;
    }
    setRegistrationData(JSON.parse(data));
  }, [navigate]);

  const handleTransactionVerification = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!transactionCode) {
      toast({
        title: "Error",
        description: "Please enter your transaction code",
        variant: "destructive"
      });
      return;
    }

    // Generate referral ID ONLY after payment confirmation
    const userReferralId = generateReferralId(registrationData.region);

    // Store payment info with newly generated referral ID
    const userAccount = {
      ...registrationData,
      userReferralId,
      paymentConfirmed: true,
      transactionCode,
      paymentDate: new Date().toISOString(),
      commissions: {
        total: 0,
        today: 0,
        last7days: 0,
        last30days: 0
      },
      referrals: []
    };

    localStorage.setItem('userAccount', JSON.stringify(userAccount));
    
    toast({
      title: "Payment Confirmed!",
      description: `Your Ambassador ID: ${userReferralId}. Welcome to Mizani Clinic!`,
    });

    navigate('/dashboard');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Account number copied to clipboard",
    });
  };

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
                  <CardDescription>Your Mizani Clinic account has been created</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="space-y-1">
                  <span className="font-semibold text-tanzania-navy">Name:</span>
                  <p className="text-tanzania-text">{registrationData.name}</p>
                </div>
                <div className="space-y-1">
                  <span className="font-semibold text-tanzania-navy">City:</span>
                  <p className="text-tanzania-text">{registrationData.city}</p>
                </div>
                <div className="space-y-1">
                  <span className="font-semibold text-tanzania-navy">Country:</span>
                  <p className="text-tanzania-text">{registrationData.country}</p>
                </div>
                <div className="space-y-1">
                  <span className="font-semibold text-tanzania-navy">Region:</span>
                  <p className="text-tanzania-text">{registrationData.region}</p>
                </div>
                <div className="space-y-1">
                  <span className="font-semibold text-tanzania-navy">Phone:</span>
                  <p className="text-tanzania-text">{registrationData.phone}</p>
                </div>
                <div className="space-y-1">
                  <span className="font-semibold text-tanzania-navy">Used Code:</span>
                  <p className="text-tanzania-text font-mono">{registrationData.referralCode}</p>
                </div>
              </div>
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <strong>Your Ambassador ID will be generated after payment confirmation.</strong>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Payment Instructions */}
          <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-glass hover:shadow-glass-hover transition-all duration-300 animate-scale-in">
            <CardHeader className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-tanzania-green to-green-500 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-xl animate-bounce-gentle">
                <CreditCard className="w-10 h-10 text-white" />
              </div>
              <CardTitle className="text-2xl sm:text-3xl text-tanzania-navy font-bold">Complete Payment</CardTitle>
              <CardDescription className="text-tanzania-text/70">
                Pay using Paybill and enter your transaction code below
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Paybill Instructions */}
              <Card className="bg-gradient-to-br from-blue-50 to-green-50 border-0 p-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-tanzania-green to-green-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <Phone className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-tanzania-navy mb-4 text-lg">Payment Instructions</h3>
                  
                  <div className="space-y-4">
                    <div className="bg-white/70 rounded-xl p-4">
                      <h4 className="font-bold text-tanzania-navy mb-2">How to Pay:</h4>
                      <ol className="text-left text-sm text-tanzania-text space-y-1">
                        <li>1. Go to M-Pesa, Tigo Pesa, or Airtel Money</li>
                        <li>2. Select "Pay Bill" or "Lipa na Namba"</li>
                        <li>3. Enter the business number below</li>
                        <li>4. Enter account number below</li>
                        <li>5. Enter amount: TSH 30,000</li>
                        <li>6. Complete the payment</li>
                        <li>7. Enter the transaction code below</li>
                      </ol>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="bg-white/70 rounded-xl p-4">
                        <p className="font-semibold text-tanzania-navy text-sm">Business Number:</p>
                        <div className="flex items-center justify-between">
                          <p className="text-xl font-bold text-tanzania-green">400200</p>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => copyToClipboard("400200")}
                            className="h-8"
                          >
                            <Copy className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                      <div className="bg-white/70 rounded-xl p-4">
                        <p className="font-semibold text-tanzania-navy text-sm">Account Number:</p>
                        <div className="flex items-center justify-between">
                          <p className="text-xl font-bold text-tanzania-green">MC{registrationData.phone?.slice(-4) || "1234"}</p>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => copyToClipboard(`MC${registrationData.phone?.slice(-4) || "1234"}`)}
                            className="h-8"
                          >
                            <Copy className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white/70 rounded-xl p-4">
                      <p className="font-semibold text-tanzania-navy text-sm">Amount:</p>
                      <p className="text-2xl font-bold text-tanzania-green">TSH 30,000</p>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Transaction Code Verification */}
              <form onSubmit={handleTransactionVerification} className="space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="transactionCode" className="text-tanzania-navy font-medium flex items-center">
                    <Receipt className="w-4 h-4 mr-2 text-tanzania-green" />
                    Transaction Code *
                  </Label>
                  <Input
                    id="transactionCode"
                    placeholder="Enter M-Pesa/Tigo/Airtel transaction code"
                    value={transactionCode}
                    onChange={(e) => setTransactionCode(e.target.value.toUpperCase())}
                    className="h-12 border-2 border-tanzania-grey/50 focus:border-tanzania-green rounded-xl transition-all duration-300 font-mono"
                  />
                  <p className="text-sm text-tanzania-text/60">
                    Enter the transaction code you received after making the payment
                  </p>
                </div>

                <Button 
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r from-tanzania-green to-green-500 hover:from-green-500 hover:to-tanzania-green text-white text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  Verify Payment & Access Dashboard
                </Button>
              </form>

              <Card className="mt-6 bg-gradient-to-br from-blue-50 to-green-50 border-0 p-4">
                <h3 className="font-semibold text-tanzania-navy mb-3 flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2 text-tanzania-green" />
                  After Payment Verification:
                </h3>
                <ul className="text-sm text-tanzania-text/70 space-y-2">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-tanzania-green rounded-full mr-3"></div>
                    Your unique Ambassador ID will be generated
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-tanzania-green rounded-full mr-3"></div>
                    Your dashboard will be activated immediately
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-tanzania-green rounded-full mr-3"></div>
                    Start sharing your referral code and earn Tshs. 88,000/-
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-tanzania-green rounded-full mr-3"></div>
                    Book appointments with Mizani Clinic
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
