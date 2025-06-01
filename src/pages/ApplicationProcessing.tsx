
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Clock, Phone, Mail, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import MobileHeader from "@/components/MobileHeader";

const ApplicationProcessing = () => {
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
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
                <span className="text-tanzania-green font-medium">Payment Submitted</span>
              </div>
            </div>
          </div>

          {/* Main Card */}
          <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-glass hover:shadow-glass-hover transition-all duration-300 animate-scale-in">
            <CardHeader className="text-center pb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-tanzania-green to-green-500 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-xl animate-bounce-gentle">
                <Clock className="w-10 h-10 text-white" />
              </div>
              <CardTitle className="text-2xl sm:text-3xl text-tanzania-navy font-bold">Application Submitted!</CardTitle>
              <CardDescription className="text-tanzania-text/70">
                Your payment verification is being processed
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Success Message */}
              <Card className="bg-gradient-to-br from-green-50 to-blue-50 border-0 p-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-tanzania-green to-green-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <CheckCircle className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-tanzania-navy mb-4 text-lg">Payment Code Received</h3>
                  <p className="text-tanzania-text/70 mb-4">
                    Thank you! We have received your transaction code and your application is now being processed.
                  </p>
                  <div className="bg-white/70 rounded-xl p-4">
                    <h4 className="font-bold text-tanzania-navy mb-2">What happens next?</h4>
                    <ul className="text-left text-sm text-tanzania-text space-y-2">
                      <li className="flex items-center">
                        <div className="w-2 h-2 bg-tanzania-green rounded-full mr-3"></div>
                        Our team will verify your payment within 24 hours
                      </li>
                      <li className="flex items-center">
                        <div className="w-2 h-2 bg-tanzania-green rounded-full mr-3"></div>
                        A representative will contact you via phone or email
                      </li>
                      <li className="flex items-center">
                        <div className="w-2 h-2 bg-tanzania-green rounded-full mr-3"></div>
                        Your dashboard access will be activated upon verification
                      </li>
                      <li className="flex items-center">
                        <div className="w-2 h-2 bg-tanzania-green rounded-full mr-3"></div>
                        You'll receive your unique Ambassador ID
                      </li>
                    </ul>
                  </div>
                </div>
              </Card>

              {/* Contact Information */}
              <Card className="bg-gradient-to-br from-blue-50 to-green-50 border-0 p-6">
                <h3 className="font-semibold text-tanzania-navy mb-4 text-lg flex items-center">
                  <Phone className="w-5 h-5 mr-2 text-tanzania-green" />
                  Need Help?
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-tanzania-text">
                    <Phone className="w-4 h-4 mr-3 text-tanzania-green" />
                    <span>Call us: +255 XXX XXX XXX</span>
                  </div>
                  <div className="flex items-center text-sm text-tanzania-text">
                    <Mail className="w-4 h-4 mr-3 text-tanzania-green" />
                    <span>Email: support@mizaniclinic.com</span>
                  </div>
                </div>
                <p className="text-sm text-tanzania-text/60 mt-4">
                  Our support team is available Monday - Friday, 8:00 AM - 6:00 PM EAT
                </p>
              </Card>

              {/* Expected Timeline */}
              <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-0 p-4">
                <h3 className="font-semibold text-tanzania-navy mb-3 flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-orange-500" />
                  Expected Timeline
                </h3>
                <div className="text-sm text-tanzania-text space-y-2">
                  <div className="flex justify-between">
                    <span>Payment Verification:</span>
                    <span className="font-semibold">Within 24 hours</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Account Activation:</span>
                    <span className="font-semibold">1-2 business days</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Representative Contact:</span>
                    <span className="font-semibold">Within 24 hours</span>
                  </div>
                </div>
              </Card>

              {/* Action Button */}
              <div className="pt-4">
                <Link to="/">
                  <Button 
                    className="w-full h-12 bg-gradient-to-r from-tanzania-green to-green-500 hover:from-green-500 hover:to-tanzania-green text-white text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  >
                    <ArrowLeft className="mr-2 w-5 h-5" />
                    Return to Home
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

export default ApplicationProcessing;
