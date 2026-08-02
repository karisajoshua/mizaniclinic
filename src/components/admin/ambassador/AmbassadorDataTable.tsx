import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { UserCheck } from "lucide-react";
import type { AdminAmbassador } from "@/hooks/useAdminData";

interface AmbassadorDataTableProps {
  ambassadors: AdminAmbassador[];
  onStatusChange: (ambassadorId: string) => void;
  isUpdating?: boolean;
}

const AmbassadorDataTable = ({ ambassadors, onStatusChange, isUpdating }: AmbassadorDataTableProps) => {
  return (
    <div className="border border-slate-700 rounded-lg overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-900 border-slate-700 hover:bg-slate-900">
            <TableHead className="text-slate-300">User</TableHead>
            <TableHead className="text-slate-300">Ambassador ID</TableHead>
            <TableHead className="text-slate-300">Location</TableHead>
            <TableHead className="text-slate-300">Performance</TableHead>
            <TableHead className="text-slate-300">Earnings</TableHead>
            <TableHead className="text-slate-300">Tier</TableHead>
            <TableHead className="text-slate-300">Status</TableHead>
            <TableHead className="text-slate-300">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {ambassadors.map((ambassador) => (
            <TableRow key={ambassador.id} className="border-slate-700 hover:bg-slate-900/50">
              <TableCell>
                <div>
                  <div className="font-medium text-white">{ambassador.name}</div>
                  <div className="text-sm text-slate-400">{ambassador.phone}</div>
                  <div className="text-xs text-slate-500">
                    {ambassador.joinDate ? `Joined ${ambassador.joinDate}` : "Join date unknown"}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <code className="bg-slate-900 px-2 py-1 rounded text-sm text-blue-400 border border-slate-700">
                  {ambassador.ambassadorId}
                </code>
              </TableCell>
              <TableCell>
                <div className="text-white">{ambassador.region}</div>
                <div className="text-xs text-slate-400">{ambassador.country}</div>
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
                <span className="text-slate-300 text-sm">{ambassador.tier}</span>
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
                {ambassador.status !== 'active' && (
                  <Button
                    size="sm"
                    disabled={isUpdating}
                    className="bg-emerald-600 hover:bg-emerald-700"
                    onClick={() => onStatusChange(ambassador.id)}
                  >
                    <UserCheck className="w-4 h-4 mr-1" />
                    Approve
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AmbassadorDataTable;
