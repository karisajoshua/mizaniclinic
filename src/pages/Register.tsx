
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "lucide-react";
import MobileHeader from "@/components/MobileHeader";
import ProgressIndicator from "@/components/registration/ProgressIndicator";
import SimpleRegistrationForm from "@/components/registration/SimpleRegistrationForm";
import { Link } from "react-router-dom";

const Register = () => {
  const progressSteps = [
    { number: 1, label: "Register" },
    { number: 2, label: "Get Started" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <MobileHeader />

      <div className="px-4 py-8">
        <div className="container mx-auto max-w-md">
          <ProgressIndicator 
            currentStep={1} 
            totalSteps={2} 
            steps={progressSteps} 
          />

          <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-glass hover:shadow-glass-hover transition-all duration-300 animate-scale-in">
            <CardHeader className="text-center pb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-tanzania-green to-green-500 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-xl animate-bounce-gentle">
                <User className="w-10 h-10 text-white" />
              </div>
              <CardTitle className="text-2xl sm:text-3xl text-tanzania-navy font-bold">Join Mizani Clinic</CardTitle>
              <CardDescription className="text-tanzania-text/70">
                Quick registration - just 3 simple fields to get started
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <SimpleRegistrationForm />
              
              <div className="text-center">
                <p className="text-gray-600">
                  Already have an account?{" "}
                  <Link to="/signin" className="text-tanzania-green font-semibold hover:underline">
                    Sign in here
                  </Link>
                </p>
              </div>

              <Card className="bg-gradient-to-br from-blue-50 to-green-50 border-0 p-4">
                <h3 className="font-semibold text-tanzania-navy mb-2 text-sm">
                  What happens next?
                </h3>
                <ul className="text-xs text-tanzania-text/70 space-y-1">
                  <li>• Instant access to your dashboard</li>
                  <li>• Your unique ambassador ID generated automatically</li>
                  <li>• Complete your profile when convenient</li>
                  <li>• Start earning up to TSH 88,000 per referral!</li>
                </ul>
              </Card>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Register;
