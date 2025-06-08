
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, MapPin, Phone, CreditCard } from "lucide-react";

const ProfileCompletionPrompt = () => {
  return (
    <Card className="border-l-4 border-l-tanzania-green bg-gradient-to-r from-green-50 to-emerald-50">
      <CardHeader>
        <CardTitle className="text-tanzania-navy flex items-center">
          <User className="w-5 h-5 mr-2 text-tanzania-green" />
          Complete Your Profile
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-tanzania-text/70">
          Welcome! You can complete your profile anytime to unlock additional features.
        </p>
        
        <div className="space-y-3">
          <div className="flex items-center text-sm text-tanzania-text/60">
            <User className="w-4 h-4 mr-2 text-tanzania-green" />
            <span>Add your full name</span>
          </div>
          <div className="flex items-center text-sm text-tanzania-text/60">
            <Phone className="w-4 h-4 mr-2 text-tanzania-green" />
            <span>Add your phone number</span>
          </div>
          <div className="flex items-center text-sm text-tanzania-text/60">
            <MapPin className="w-4 h-4 mr-2 text-tanzania-green" />
            <span>Specify your region</span>
          </div>
          <div className="flex items-center text-sm text-tanzania-text/60">
            <CreditCard className="w-4 h-4 mr-2 text-tanzania-green" />
            <span>Activate premium features with payment</span>
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <Button 
            variant="outline" 
            size="sm"
            className="flex-1 border-tanzania-green text-tanzania-green hover:bg-tanzania-green hover:text-white"
          >
            Complete Later
          </Button>
          <Button 
            size="sm"
            className="flex-1 bg-tanzania-green hover:bg-green-600"
          >
            Complete Now
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileCompletionPrompt;
