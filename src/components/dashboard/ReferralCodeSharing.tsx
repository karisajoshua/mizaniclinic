import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Share2, Copy, QrCode } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";
import QRCodeGenerator from "@/components/QRCodeGenerator";
import type { UserAccount } from "@/types/dashboard";

interface ReferralCodeSharingProps {
  userAccount: UserAccount;
}

const ReferralCodeSharing = ({ userAccount }: ReferralCodeSharingProps) => {
  const [showQR, setShowQR] = useState(false);
  
  const referralLink = `${window.location.origin}/register?ref=${userAccount?.userReferralId}`;

  const copyReferralCode = () => {
    if (userAccount?.userReferralId) {
      navigator.clipboard.writeText(userAccount.userReferralId);
      toast({
        title: "Copied! 🎉",
        description: "Ambassador code copied to clipboard",
      });
    }
  };

  const shareWhatsApp = () => {
    const message = `🎉 Jiunge na Mizani Clinic Ambassador program! Earn 35% commission on every Activation Pack! Use my code: ${userAccount?.userReferralId}. Register here: ${referralLink} 💰🚀`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <Card className="border-0 bg-gradient-to-br from-green-100 via-emerald-50 to-teal-50 shadow-xl animate-slide-in">
      <CardHeader className="px-4 sm:px-6">
        <CardTitle className="flex items-center space-x-2 text-gray-800 text-lg sm:text-xl font-black">
          <Share2 className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
          <span>Share Your Magic Code!</span>
        </CardTitle>
        <CardDescription className="font-semibold text-gray-600 text-sm sm:text-base">
          Earn 35% commission for each person who joins using your code
        </CardDescription>
      </CardHeader>
      <CardContent className="px-4 sm:px-6">
        <div className="flex flex-col space-y-4">
          <Card className="w-full p-4 sm:p-6 bg-white border-4 border-dashed border-green-400 rounded-2xl shadow-lg">
            <p className="text-xs sm:text-sm text-gray-600 mb-2 font-bold">Your Ambassador Code:</p>
            <p className="text-xl sm:text-2xl lg:text-3xl font-mono font-black text-green-600 tracking-wider break-all">{userAccount.userReferralId}</p>
          </Card>
          
          {showQR && (
            <Card className="w-full p-4 bg-white border-2 border-green-400 rounded-2xl shadow-lg">
              <div className="flex flex-col items-center space-y-3">
                <p className="text-sm text-gray-600 font-bold">Scan to Register:</p>
                <QRCodeGenerator 
                  value={referralLink} 
                  size={180} 
                  className="mx-auto"
                />
                <p className="text-xs text-gray-500 text-center">Share this QR code for easy registration</p>
              </div>
            </Card>
          )}
          
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full">
            <Button 
              onClick={copyReferralCode}
              variant="outline" 
              className="flex-1 border-2 border-green-500 text-green-600 hover:bg-green-500 hover:text-white rounded-xl font-bold h-12"
            >
              <Copy className="w-4 h-4 mr-2" />
              Copy
            </Button>
            <Button 
              onClick={() => setShowQR(!showQR)}
              variant="outline" 
              className="flex-1 border-2 border-green-500 text-green-600 hover:bg-green-500 hover:text-white rounded-xl font-bold h-12"
            >
              <QrCode className="w-4 h-4 mr-2" />
              {showQR ? 'Hide' : 'QR Code'}
            </Button>
            <Button 
              onClick={shareWhatsApp}
              className="flex-1 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold h-12"
            >
              <Share2 className="w-4 h-4 mr-2" />
              WhatsApp
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReferralCodeSharing;
