
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "lucide-react";
import MobileHeader from "@/components/MobileHeader";
import ProgressIndicator from "@/components/registration/ProgressIndicator";
import RegistrationForm from "@/components/registration/RegistrationForm";
import NextStepsInfo from "@/components/registration/NextStepsInfo";

const Register = () => {
  const progressSteps = [
    { number: 1, label: "Register" },
    { number: 2, label: "Payment" }
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
              <CardTitle className="text-2xl sm:text-3xl text-tanzania-navy font-bold">Create Your Account</CardTitle>
              <CardDescription className="text-tanzania-text/70">
                Enter your details and referral code to get started
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <RegistrationForm />
              <NextStepsInfo />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Register;
