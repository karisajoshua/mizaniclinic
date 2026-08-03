
import { Card } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

const NextStepsInfo = () => {
  return (
    <Card className="bg-gradient-to-br from-blue-50 to-green-50 border-0 p-4 mt-6">
      <h3 className="font-semibold text-tanzania-navy mb-3 flex items-center">
        <CheckCircle className="w-5 h-5 mr-2 text-tanzania-green" />
        What happens next?
      </h3>
      <ul className="text-sm text-tanzania-text/70 space-y-2">
        <li className="flex items-center">
          <div className="w-2 h-2 bg-tanzania-green rounded-full mr-3"></div>
          You'll be issued with a code upon payment confirmation
        </li>
        <li className="flex items-center">
          <div className="w-2 h-2 bg-tanzania-green rounded-full mr-3"></div>
          Enter your 5 digit code for verification
        </li>
        <li className="flex items-center">
          <div className="w-2 h-2 bg-tanzania-green rounded-full mr-3"></div>
          Access your dashboard after payment confirmation
        </li>
        <li className="flex items-center">
          <div className="w-2 h-2 bg-tanzania-green rounded-full mr-3"></div>
          Start earning 35% on every Activation Pack you sponsor!
        </li>
      </ul>
    </Card>
  );
};

export default NextStepsInfo;
