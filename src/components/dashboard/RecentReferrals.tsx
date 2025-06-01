
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, MapPin } from "lucide-react";
import type { Referral } from "@/types/dashboard";

interface RecentReferralsProps {
  referrals: Referral[];
}

const RecentReferrals = ({ referrals }: RecentReferralsProps) => {
  return (
    <Card className="border-0 bg-white/90 backdrop-blur-sm shadow-xl animate-fade-in">
      <CardHeader className="px-4 sm:px-6">
        <CardTitle className="text-gray-800 text-lg sm:text-xl font-black">Recent Team Members</CardTitle>
        <CardDescription className="font-semibold text-sm sm:text-base">Your latest successful referrals</CardDescription>
      </CardHeader>
      <CardContent className="px-4 sm:px-6">
        <div className="space-y-3">
          {referrals.map((referral, index) => (
            <Card key={index} className="border-0 bg-gradient-to-r from-white to-blue-50/50 hover:from-blue-50 hover:to-green-50 transition-all duration-300 p-3 sm:p-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                    <Users className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-gray-800 text-base sm:text-lg">{referral.name}</p>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 text-xs sm:text-sm text-gray-600 space-y-1 sm:space-y-0">
                      <span className="flex items-center">
                        <MapPin className="w-3 h-3 mr-1 flex-shrink-0" />
                        {referral.location}
                      </span>
                      <span>Joined: {referral.joinDate}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between sm:flex-col sm:items-end sm:justify-center space-x-2 sm:space-x-0">
                  <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${
                    referral.status === 'Active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-orange-100 text-orange-800'
                  }`}>
                    {referral.status}
                  </span>
                  {referral.status === 'Active' && (
                    <p className="text-xs sm:text-sm text-green-600 font-semibold">+$0.20</p>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentReferrals;
