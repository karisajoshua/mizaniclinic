import { Card, CardContent } from "@/components/ui/card";
import { UserCheck, UserX, Plus, DollarSign } from "lucide-react";

interface AmbassadorLike {
  status: string;
  totalEarnings: number;
  totalReferrals: number;
}

interface AmbassadorStatsCardsProps {
  ambassadors: AmbassadorLike[];
}

const AmbassadorStatsCards = ({ ambassadors }: AmbassadorStatsCardsProps) => {
  const activeCount = ambassadors.filter(a => a.status === 'active').length;
  const pendingCount = ambassadors.filter(a => a.status !== 'active').length;
  const totalEarnings = ambassadors.reduce((sum, a) => sum + a.totalEarnings, 0);
  const totalReferrals = ambassadors.reduce((sum, a) => sum + a.totalReferrals, 0);

  const cards = [
    { label: "Active Users", value: activeCount, color: "text-emerald-400", Icon: UserCheck },
    { label: "Pending Approval", value: pendingCount, color: "text-yellow-400", Icon: UserX },
    { label: "Total Referrals", value: totalReferrals, color: "text-blue-400", Icon: Plus },
    { label: "Total Earnings", value: `$${totalEarnings.toFixed(2)}`, color: "text-emerald-400", Icon: DollarSign },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {cards.map(({ label, value, color, Icon }) => (
        <Card key={label} className="bg-slate-800 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">{label}</p>
                <p className={`text-2xl font-bold ${color}`}>{value}</p>
              </div>
              <Icon className={`w-8 h-8 ${color}`} />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default AmbassadorStatsCards;
