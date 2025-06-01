
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Eye, UserCheck, MoreHorizontal } from "lucide-react";

interface Ambassador {
  id: string;
  name: string;
  email: string;
  referralCode: string;
  region: string;
  totalReferrals: number;
  activeReferrals: number;
  totalEarnings: number;
  status: string;
  tier: string;
  joinDate: string;
  lastActive: string;
}

interface AmbassadorDataTableProps {
  ambassadors: Ambassador[];
  onStatusChange: (ambassadorId: string, newStatus: string) => void;
}

const AmbassadorDataTable = ({ ambassadors, onStatusChange }: AmbassadorDataTableProps) => {
  return (
    <div className="border border-slate-700 rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-900 border-slate-700 hover:bg-slate-900">
            <TableHead className="text-slate-300">User</TableHead>
            <TableHead className="text-slate-300">Referral Code</TableHead>
            <TableHead className="text-slate-300">Region</TableHead>
            <TableHead className="text-slate-300">Performance</TableHead>
            <TableHead className="text-slate-300">Earnings</TableHead>
            <TableHead className="text-slate-300">Status</TableHead>
            <TableHead className="text-slate-300">Last Active</TableHead>
            <TableHead className="text-slate-300">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {ambassadors.map((ambassador) => (
            <TableRow key={ambassador.id} className="border-slate-700 hover:bg-slate-900/50">
              <TableCell>
                <div>
                  <div className="font-medium text-white">{ambassador.name}</div>
                  <div className="text-sm text-slate-400">{ambassador.email}</div>
                  <div className="text-xs text-slate-500">Joined {ambassador.joinDate}</div>
                </div>
              </TableCell>
              <TableCell>
                <code className="bg-slate-900 px-2 py-1 rounded text-sm text-blue-400 border border-slate-700">
                  {ambassador.referralCode}
                </code>
              </TableCell>
              <TableCell>
                <div className="text-white">{ambassador.region}</div>
              </TableCell>
              <TableCell>
                <div className="text-sm">
                  <div className="text-emerald-400 font-medium">{ambassador.activeReferrals} active</div>
                  <div className="text-slate-400">{ambassador.totalReferrals} total</div>
                </div>
              </TableCell>
              <TableCell>
                <div className="font-medium text-white">${ambassador.totalEarnings.toFixed(2)}</div>
              </TableCell>
              <TableCell>
                <Badge 
                  variant={
                    ambassador.status === 'active' ? 'default' : 
                    ambassador.status === 'pending' ? 'secondary' : 
                    'destructive'
                  }
                  className={
                    ambassador.status === 'active' ? 'bg-emerald-600' :
                    ambassador.status === 'pending' ? 'bg-yellow-600' :
                    'bg-red-600'
                  }
                >
                  {ambassador.status}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="text-sm text-slate-400">{ambassador.lastActive}</div>
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
                    <Eye className="w-4 h-4" />
                  </Button>
                  {ambassador.status === 'pending' && (
                    <Button 
                      size="sm" 
                      className="bg-emerald-600 hover:bg-emerald-700"
                      onClick={() => onStatusChange(ambassador.id, 'active')}
                    >
                      <UserCheck className="w-4 h-4" />
                    </Button>
                  )}
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="border-slate-600 text-slate-300 hover:bg-slate-700"
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AmbassadorDataTable;
