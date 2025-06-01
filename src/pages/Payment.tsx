
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, CreditCard, Receipt, CheckCircle, Phone, Copy } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { generateReferralId } from "@/utils/regionCodes";
import MobileHeader from "@/components/MobileHeader";

const Payment = () => {
  const [receiptNumber, setReceiptNumber] = useState("");
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

  const handleReceiptSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!receiptNumber) {
      toast({
        title: "Error",
        description: "Please enter your receipt number",
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
      receiptNumber,
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

  const handleMobileMoneyPayment = () => {
    // Generate referral ID for mobile money payment too
    const userReferralId = generateReferralId(registrationData.region);

    const userAccount = {
      ...registrationData,
      userReferralId,
      paymentConfirmed: true,
      paymentMethod: "mobile_money",
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
                  <p className="text-tanzania-text">{registrationData.fullName}</p>
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

          {/* Payment Options */}
          <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-glass hover:shadow-glass-hover transition-all duration-300 animate-scale-in">
            <CardHeader className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-tanzania-green to-green-500 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-xl animate-bounce-gentle">
                <CreditCard className="w-10 h-10 text-white" />
              </div>
              <CardTitle className="text-2xl sm:text-3xl text-tanzania-navy font-bold">Complete Payment</CardTitle>
              <CardDescription className="text-tanzania-text/70">
                Choose your preferred payment method to activate your dashboard
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="receipt" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6 bg-tanzania-grey/50">
                  <TabsTrigger value="receipt" className="flex items-center space-x-2 data-[state=active]:bg-white data-[state=active]:text-tanzania-navy">
                    <Receipt className="w-4 h-4" />
                    <span className="hidden sm:inline">Receipt Number</span>
                    <span className="sm:hidden">Receipt</span>
                  </TabsTrigger>
                  <TabsTrigger value="mobile-money" className="flex items-center space-x-2 data-[state=active]:bg-white data-[state=active]:text-tanzania-navy">
                    <Phone className="w-4 h-4" />
                    <span className="hidden sm:inline">Mobile Money</span>
                    <span className="sm:hidden">Mobile</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="receipt" className="mt-6">
                  <form onSubmit={handleReceiptSubmit} className="space-y-6">
                    <div className="space-y-3">
                      <Label htmlFor="receiptNumber" className="text-tanzania-navy font-medium flex items-center">
                        <Receipt className="w-4 h-4 mr-2 text-tanzania-green" />
                        Receipt Number *
                      </Label>
                      <Input
                        id="receiptNumber"
                        placeholder="Enter your receipt number"
                        value={receiptNumber}
                        onChange={(e) => setReceiptNumber(e.target.value)}
                        className="h-12 border-2 border-tanzania-grey/50 focus:border-tanzania-green rounded-xl transition-all duration-300"
                      />
                      <p className="text-sm text-tanzania-text/60">
                        Enter the receipt number from your payment transaction
                      </p>
                    </div>

                    <Button 
                      type="submit"
                      className="w-full h-12 bg-gradient-to-r from-tanzania-green to-green-500 hover:from-green-500 hover:to-tanzania-green text-white text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                    >
                      Confirm Payment
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="mobile-money" className="mt-6">
                  <div className="space-y-6">
                    <Card className="bg-gradient-to-br from-blue-50 to-green-50 border-0 p-6">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-gradient-to-br from-tanzania-green to-green-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                          <Phone className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="font-semibold text-tanzania-navy mb-2 text-lg">Mobile Money Payment</h3>
                        <p className="text-tanzania-text/70 mb-4">
                          Pay securely using M-Pesa, Tigo Pesa, or Airtel Money
                        </p>
                        <div className="bg-white/70 rounded-xl p-4 mb-4">
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="font-semibold text-tanzania-navy">Amount:</p>
                              <p className="text-xl font-bold text-tanzania-green">TSH 1,000</p>
                            </div>
                            <div>
                              <p className="font-semibold text-tanzania-navy">Reference:</p>
                              <p className="font-mono text-tanzania-text">REF-{registrationData.phone?.slice(-4) || "1234"}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>

                    <Button 
                      onClick={handleMobileMoneyPayment}
                      className="w-full h-12 bg-gradient-to-r from-tanzania-green to-green-500 hover:from-green-500 hover:to-tanzania-green text-white text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                    >
                      Pay with Mobile Money
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>

              <Card className="mt-6 bg-gradient-to-br from-blue-50 to-green-50 border-0 p-4">
                <h3 className="font-semibold text-tanzania-navy mb-3 flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2 text-tanzania-green" />
                  After Payment Confirmation:
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
                    Start sharing your referral code and earn TSH 500 per referral
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
