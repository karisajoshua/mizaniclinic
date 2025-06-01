
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Share2, Copy } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import type { UserAccount } from "@/types/dashboard";

interface ReferralCodeSharingProps {
  userAccount: UserAccount;
}

const ReferralCodeSharing = ({ userAccount }: ReferralCodeSharingProps) => {
  const copyReferralCode = () => {
    if (userAccount?.userReferralId) {
      navigator.clipboard.writeText(userAccount.userReferralId);
      toast({
        title: "Copied! 🎉",
        description: "Referral code copied to clipboard",
      });
    }
  };

  const shareWhatsApp = () => {
    const message = `🎉 Jiunge na Mizani Clinic Ambassador program! Start earning TSH 500+ per referral! Use my code: ${userAccount?.userReferralId}. Register here: ${window.location.origin}/register 💰🚀`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <Card className="border-0 bg-gradient-to-br from-green-100 via-emerald-50 to-teal-50 shadow-xl animate-slide-in">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-gray-800 text-xl font-black">
          <Share2 className="w-6 h-6 text-green-600" />
          <span>Share Your Magic Code! ✨</span>
        </CardTitle>
        <CardDescription className="font-semibold text-gray-600">
          Earn TSH 500+ for each person who joins using your code 💰
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col lg:flex-row items-center space-y-4 lg:space-y-0 lg:space-x-4">
          <Card className="flex-1 w-full p-6 bg-white border-4 border-dashed border-green-400 rounded-2xl shadow-lg">
            <p className="text-sm text-gray-600 mb-2 font-bold">Your Ambassador Code:</p>
            <p className="text-2xl sm:text-3xl font-mono font-black text-green-600 tracking-wider">{userAccount.userReferralId}</p>
          </Card>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full lg:w-auto">
            <Button 
              onClick={copyReferralCode}
              variant="outline" 
              className="border-2 border-green-500 text-green-600 hover:bg-green-500 hover:text-white rounded-xl font-bold"
            >
              <Copy className="w-4 h-4 mr-2" />
              Copy 📋
            </Button>
            <Button 
              onClick={shareWhatsApp}
              className="bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold"
            >
              <Share2 className="w-4 h-4 mr-2" />
              WhatsApp 📱
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReferralCodeSharing;
