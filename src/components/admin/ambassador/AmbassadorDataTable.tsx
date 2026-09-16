import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { UserCheck, KeyRound } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import type { AdminAmbassador } from "@/hooks/useAdminData";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AmbassadorDataTableProps {
  ambassadors: AdminAmbassador[];
  onStatusChange: (ambassadorId: string) => void;
  isUpdating?: boolean;
}

const AmbassadorDataTable = ({ ambassadors, onStatusChange, isUpdating }: AmbassadorDataTableProps) => {
  const [resetTarget, setResetTarget] = useState<AdminAmbassador | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [saving, setSaving] = useState(false);

  const handleReset = async () => {
    if (!resetTarget) return;
    if (newPassword.length < 6) {
      toast({ title: "Password too short", description: "Use at least 6 characters.", variant: "destructive" });
      return;
    }
    setSaving(true);
    const { data, error } = await supabase.functions.invoke<{ error?: string }>("admin-reset-password", {
      body: { targetUserId: resetTarget.id, newPassword },
    });
    setSaving(false);
    if (error || data?.error) {
      toast({
        title: "Could not reset password",
        description: data?.error || error?.message,
        variant: "destructive",
      });
      return;
    }
    toast({ title: "Password updated", description: `${resetTarget.name} can now sign in with the new password.` });
    setResetTarget(null);
    setNewPassword("");
  };


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
                <div className="flex flex-col gap-2">
                  {ambassador.status === 'pending' && (
                    <Button
                      size="sm"
                      disabled={isUpdating || !ambassador.canApprove}
                      className="bg-emerald-600 hover:bg-emerald-700"
                      onClick={() => onStatusChange(ambassador.id)}
                    >
                      <UserCheck className="w-4 h-4 mr-1" />
                      {ambassador.canApprove ? "Approve" : "Awaiting receipt"}
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-slate-600 text-slate-200 hover:bg-slate-800"
                    onClick={() => { setResetTarget(ambassador); setNewPassword(""); }}
                  >
                    <KeyRound className="w-4 h-4 mr-1" />
                    Reset password
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={!!resetTarget} onOpenChange={(o) => !o && setResetTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset password</DialogTitle>
            <DialogDescription>
              Set a new password for {resetTarget?.name} ({resetTarget?.ambassadorId}). Share it with them privately.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="new-password">New password</Label>
            <Input
              id="new-password"
              type="text"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="At least 6 characters"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setResetTarget(null)}>Cancel</Button>
            <Button onClick={handleReset} disabled={saving}>
              {saving ? "Saving..." : "Set password"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AmbassadorDataTable;
