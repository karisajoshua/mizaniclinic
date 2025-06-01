
import { Button } from "@/components/ui/button";
import { MapPin, Copy } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import type { UserAccount } from "@/types/dashboard";

interface DashboardHeaderProps {
  userAccount: UserAccount;
}

const DashboardHeader = ({ userAccount }: DashboardHeaderProps) => {
  const copyReferralCode = () => {
    if (userAccount?.userReferralId) {
      navigator.clipboard.writeText(userAccount.userReferralId);
      toast({
        title: "Copied! 🎉",
        description: "Referral code copied to clipboard",
      });
    }
  };

  return (
    <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white py-4 sm:py-6 px-4 relative overflow-hidden">
      <div className="absolute inset-0 opacity-30"></div>
      <div className="container mx-auto relative">
        <div className="flex flex-col space-y-3 sm:space-y-4">
          <div className="animate-fade-in">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black leading-tight">Karibu, {userAccount.fullName}!</h1>
            <p className="text-green-200 flex items-center mt-1 font-semibold text-sm sm:text-base">
              <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
              {userAccount.region} • Ambassador Level 2
            </p>
          </div>
          <div className="animate-slide-in">
            <p className="text-xs sm:text-sm text-green-200 mb-2">Your Ambassador ID</p>
            <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
              <p className="font-mono font-black text-yellow-300 text-base sm:text-lg border-2 border-yellow-300 px-3 py-2 rounded-lg break-all flex-1">{userAccount.userReferralId}</p>
              <Button
                variant="ghost"
                size="sm"
                onClick={copyReferralCode}
                className="h-10 w-full sm:w-auto px-4 text-white hover:bg-white/10 border border-white/30 self-start"
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
