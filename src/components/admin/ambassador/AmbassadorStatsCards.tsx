
import { Card, CardContent } from "@/components/ui/card";
import { UserCheck, UserX, Plus } from "lucide-react";

interface Ambassador {
  id: string;
  status: string;
  totalEarnings: number;
  totalReferrals: number;
}

interface AmbassadorStatsCardsProps {
  ambassadors: Ambassador[];
}

const AmbassadorStatsCards = ({ ambassadors }: AmbassadorStatsCardsProps) => {
  const activeCount = ambassadors.filter(a => a.status === 'active').length;
  const pendingCount = ambassadors.filter(a => a.status === 'pending').length;
  const totalEarnings = ambassadors.reduce((sum, a) => sum + a.totalEarnings, 0);
  const totalReferrals = ambassadors.reduce((sum, a) => sum + a.totalReferrals, 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <Card className="bg-slate-800 border-slate-700">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Active Users</p>
              <p className="text-2xl font-bold text-emerald-400">{activeCount}</p>
            </div>
            <UserCheck className="w-8 h-8 text-emerald-400" />
          </div>
        </CardContent>
      </Card>
      <Card className="bg-slate-800 border-slate-700">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Pending Approval</p>
              <p className="text-2xl font-bold text-yellow-400">{pendingCount}</p>
            </div>
            <UserX className="w-8 h-8 text-yellow-400" />
          </div>
        </CardContent>
      </Card>
      <Card className="bg-slate-800 border-slate-700">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Total Earnings</p>
              <p className="text-2xl font-bold text-blue-400">${totalEarnings.toFixed(2)}</p>
            </div>
            <div className="text-blue-400">$</div>
          </div>
        </CardContent>
      </Card>
      <Card className="bg-slate-800 border-slate-700">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Total Referrals</p>
              <p className="text-2xl font-bold text-purple-400">{totalReferrals}</p>
            </div>
            <Plus className="w-8 h-8 text-purple-400" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AmbassadorStatsCards;
