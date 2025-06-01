
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
    <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white py-6 px-4 relative overflow-hidden">
      <div className="absolute inset-0 opacity-30"></div>
      <div className="container mx-auto relative">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div className="animate-fade-in">
            <h1 className="text-2xl sm:text-3xl font-black">Karibu, {userAccount.fullName}! 🎉</h1>
            <p className="text-green-200 flex items-center mt-1 font-semibold">
              <MapPin className="w-4 h-4 mr-1" />
              {userAccount.region} • Ambassador Level 2 ⭐
            </p>
          </div>
          <div className="text-left sm:text-right animate-slide-in">
            <p className="text-sm text-green-200">Your Ambassador ID</p>
            <div className="flex items-center space-x-2">
              <p className="font-mono font-black text-yellow-300 text-lg border-2 border-yellow-300 px-3 py-1 rounded-lg">{userAccount.userReferralId}</p>
              <Button
                variant="ghost"
                size="sm"
                onClick={copyReferralCode}
                className="h-8 w-8 p-0 text-white hover:bg-white/10 border border-white/30"
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
