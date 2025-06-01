
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, MapPin } from "lucide-react";
import type { Referral } from "@/types/dashboard";

interface RecentReferralsProps {
  referrals: Referral[];
}

const RecentReferrals = ({ referrals }: RecentReferralsProps) => {
  return (
    <Card className="border-0 bg-white/90 backdrop-blur-sm shadow-xl animate-fade-in">
      <CardHeader>
        <CardTitle className="text-gray-800 text-xl font-black">Recent Team Members 👥</CardTitle>
        <CardDescription className="font-semibold">Your latest successful referrals</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {referrals.map((referral, index) => (
            <Card key={index} className="border-0 bg-gradient-to-r from-white to-blue-50/50 hover:from-blue-50 hover:to-green-50 transition-all duration-300 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 text-lg">{referral.name}</p>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 text-sm text-gray-600">
                      <span className="flex items-center">
                        <MapPin className="w-3 h-3 mr-1" />
                        {referral.location}
                      </span>
                      <span>Joined: {referral.joinDate}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    referral.status === 'Active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-orange-100 text-orange-800'
                  }`}>
                    {referral.status}
                  </span>
                  {referral.status === 'Active' && (
                    <p className="text-sm text-green-600 font-semibold mt-1">+TSH 500</p>
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
