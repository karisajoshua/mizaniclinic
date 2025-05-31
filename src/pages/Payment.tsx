
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, CreditCard, Receipt, CheckCircle, Phone } from "lucide-react";
import { toast } from "@/hooks/use-toast";

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

    // Store payment info
    const userAccount = {
      ...registrationData,
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
      description: "Your dashboard is now active. Welcome!",
    });

    navigate('/dashboard');
  };

  const handleMobileMoneyPayment = () => {
    toast({
      title: "Mobile Money Payment",
      description: "This feature will be integrated with mobile money providers",
    });
  };

  if (!registrationData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-tanzania-grey to-white">
      {/* Header */}
      <header className="bg-tanzania-navy text-white py-4 px-6">
        <div className="container mx-auto flex items-center space-x-4">
          <Link to="/register">
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          <h1 className="text-xl font-bold">Complete Your Registration</h1>
        </div>
      </header>

      <div className="py-12 px-6">
        <div className="container mx-auto max-w-2xl">
          {/* Registration Summary */}
          <Card className="mb-8 border-2 border-tanzania-green animate-fade-in">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-6 h-6 text-tanzania-green" />
                <div>
                  <CardTitle className="text-tanzania-navy">Registration Successful!</CardTitle>
                  <CardDescription>Your account details have been created</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-semibold text-tanzania-navy">Name:</span>
                  <p className="text-tanzania-text">{registrationData.fullName}</p>
                </div>
                <div>
                  <span className="font-semibold text-tanzania-navy">Region:</span>
                  <p className="text-tanzania-text">{registrationData.region}</p>
                </div>
                <div>
                  <span className="font-semibold text-tanzania-navy">Your Referral ID:</span>
                  <p className="text-tanzania-green font-mono font-bold">{registrationData.userReferralId}</p>
                </div>
                <div>
                  <span className="font-semibold text-tanzania-navy">Used Code:</span>
                  <p className="text-tanzania-text">{registrationData.referralCode}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Options */}
          <Card className="border-2 border-tanzania-grey shadow-lg animate-slide-in">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-tanzania-green rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl text-tanzania-navy">Complete Payment</CardTitle>
              <CardDescription className="text-tanzania-text">
                Choose your preferred payment method to activate your dashboard
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="receipt" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="receipt" className="flex items-center space-x-2">
                    <Receipt className="w-4 h-4" />
                    <span>Receipt Number</span>
                  </TabsTrigger>
                  <TabsTrigger value="mobile-money" className="flex items-center space-x-2">
                    <Phone className="w-4 h-4" />
                    <span>Mobile Money</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="receipt" className="mt-6">
                  <form onSubmit={handleReceiptSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="receiptNumber" className="text-tanzania-navy font-medium">
                        Receipt Number *
                      </Label>
                      <Input
                        id="receiptNumber"
                        placeholder="Enter your receipt number"
                        value={receiptNumber}
                        onChange={(e) => setReceiptNumber(e.target.value)}
                        className="border-2 border-tanzania-grey focus:border-tanzania-green"
                      />
                      <p className="text-sm text-gray-600">
                        Enter the receipt number from your payment transaction
                      </p>
                    </div>

                    <Button 
                      type="submit"
                      className="w-full bg-tanzania-green hover:bg-tanzania-green-light text-white py-3 text-lg font-semibold"
                    >
                      Confirm Payment
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="mobile-money" className="mt-6">
                  <div className="space-y-6">
                    <div className="text-center p-6 bg-tanzania-grey rounded-lg">
                      <Phone className="w-12 h-12 text-tanzania-green mx-auto mb-4" />
                      <h3 className="font-semibold text-tanzania-navy mb-2">Mobile Money Payment</h3>
                      <p className="text-tanzania-text mb-4">
                        Pay securely using M-Pesa, Tigo Pesa, or Airtel Money
                      </p>
                      <div className="text-sm text-tanzania-text mb-4">
                        <p><strong>Amount:</strong> KES 1,000</p>
                        <p><strong>Reference:</strong> {registrationData.userReferralId}</p>
                      </div>
                    </div>

                    <Button 
                      onClick={handleMobileMoneyPayment}
                      className="w-full bg-tanzania-green hover:bg-tanzania-green-light text-white py-3 text-lg font-semibold"
                    >
                      Pay with Mobile Money
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-tanzania-navy mb-2">After Payment Confirmation:</h3>
                <ul className="text-sm text-tanzania-text space-y-1">
                  <li>• Your dashboard will be activated immediately</li>
                  <li>• You can start sharing your referral code: <strong>{registrationData.userReferralId}</strong></li>
                  <li>• Earn KES 500 for each successful referral</li>
                  <li>• Book appointments with Dr. Mwaka</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Payment;
