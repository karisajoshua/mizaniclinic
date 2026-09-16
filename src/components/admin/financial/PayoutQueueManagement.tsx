import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CheckCircle, Download, Loader2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAdminPayouts, useProcessPayouts, downloadCsv } from "@/hooks/useAdminData";

const PayoutQueueManagement = () => {
  const [payoutFilter, setPayoutFilter] = useState("all");
  const { data: payouts = [], isLoading, error } = useAdminPayouts();
  const process = useProcessPayouts();
  const [payingId, setPayingId] = useState<string | null>(null);
  const [reference, setReference] = useState('');

  const legacyPaidCount = payouts.filter(p => p.status === 'paid' && !p.reference).length;
  const filteredPayouts = payouts.filter(
    (payout) => payoutFilter === "all" || payout.status === payoutFilter
  );

  const handleProcessPayout = (payoutId: string) => {
    process.mutate({ ids: [payoutId], status: "approved" });
  };

  const handleDownload = (payoutId: string) => {
    const payout = payouts.find((p) => p.id === payoutId);
    if (!payout) return;
    downloadCsv(`payout-${payout.ambassadorCode}-${payout.id.slice(0, 8)}.csv`, [
      {
        Ambassador: payout.ambassadorName,
        "Ambassador ID": payout.ambassadorCode,
        Amount: payout.amount.toFixed(2),
        Currency: payout.currency,
        Type: payout.type,
        Status: payout.status,
        Earned: payout.earnedDate,
        Paid: payout.paidDate ?? "",
        Reference: payout.reference ?? "",
      },
    ]);
  };

  return (
    <Card id="payout-queue" className="bg-slate-800 border-slate-700 shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-white">
          <span>Payout Queue Management</span>
          <div className="flex space-x-2">
            <Select value={payoutFilter} onValueChange={setPayoutFilter}>
              <SelectTrigger className="w-40 bg-slate-900 border-slate-600 text-white">
                <SelectValue placeholder="Filter status" />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-slate-600">
                <SelectItem value="all">All Payouts</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardTitle>
        <CardDescription className="text-slate-400">Approve earned commissions, then record payment after transferring funds separately.</CardDescription>
      </CardHeader>
      <CardContent>
        {legacyPaidCount > 0 && <p className="text-sm text-amber-200 mb-4">{legacyPaidCount} older records are marked paid without a payment reference. Reconcile them against the original payment records.</p>}
        {isLoading ? (
          <div className="flex items-center justify-center py-16 text-slate-400">
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Loading payouts...
          </div>
        ) : error ? (
          <div className="py-16 text-center text-red-400">Failed to load payouts.</div>
        ) : filteredPayouts.length === 0 ? (
          <div className="py-16 text-center text-slate-400">No payouts to show.</div>
        ) : (
          <div className="border border-slate-700 rounded-lg overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-900 border-slate-700 hover:bg-slate-900">
                  <TableHead className="text-slate-300">Ambassador</TableHead>
                  <TableHead className="text-slate-300">Amount</TableHead>
                  <TableHead className="text-slate-300">Type</TableHead>
                  <TableHead className="text-slate-300">Earned</TableHead>
                  <TableHead className="text-slate-300">Status</TableHead>
                  <TableHead className="text-slate-300">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayouts.map((payout) => (
                  <TableRow key={payout.id} className="border-slate-700 hover:bg-slate-900/50">
                    <TableCell>
                      <div>
                        <div className="font-medium text-white">{payout.ambassadorName}</div>
                        <div className="text-sm text-slate-400">{payout.ambassadorCode}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium text-emerald-400">${payout.amount.toFixed(2)}</div>
                      <div className="text-sm text-slate-400">{payout.currency}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="border-slate-600 text-slate-300">
                        {payout.type.replace(/_/g, ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-slate-300">{payout.earnedDate}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          payout.status === 'paid' ? 'default' :
                          payout.status === 'pending' ? 'secondary' :
                          'destructive'
                        }
                        className={
                          payout.status === 'paid' ? 'bg-emerald-600' :
                          payout.status === 'pending' ? 'bg-yellow-600' :
                          payout.status === 'approved' ? 'bg-blue-600' :
                          'bg-red-600'
                        }
                      >
                        {payout.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        {payout.status === 'pending' && (
                          <Button
                            size="sm"
                            disabled={process.isPending}
                            className="bg-emerald-600 hover:bg-emerald-700"
                            onClick={() => handleProcessPayout(payout.id)}
                          >
                            <CheckCircle className="w-4 h-4 mr-1" /> Approve
                          </Button>
                        )}
                        {payout.status === 'approved' && <Button size="sm" disabled={process.isPending}
                          onClick={() => { setPayingId(payout.id); setReference(''); }}>Record payment</Button>}
                        <Button
                          aria-label={`Download payout for ${payout.ambassadorName}`}
                          size="sm"
                          variant="outline"
                          onClick={() => handleDownload(payout.id)}
                          className="border-slate-600 text-slate-300 hover:bg-slate-700"
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
      <Dialog open={payingId !== null} onOpenChange={open => { if (!open && !process.isPending) setPayingId(null); }}>
        <DialogContent><DialogHeader><DialogTitle>Record completed payment</DialogTitle>
          <DialogDescription>Enter the bank or mobile money reference for funds already sent. This action only records the payment.</DialogDescription>
        </DialogHeader><form className="space-y-4" onSubmit={event => {
          event.preventDefault();
          if (payingId) process.mutate({ ids: [payingId], status: 'paid', reference: reference.trim() }, { onSuccess: () => setPayingId(null) });
        }}>
          <Label htmlFor="payout-reference">Payment reference</Label>
          <Input id="payout-reference" value={reference} onChange={e => setReference(e.target.value)} required minLength={3} maxLength={120} />
          {process.isError && <p role="alert" className="text-red-600">{process.error.message}</p>}
          <Button type="submit" disabled={process.isPending || reference.trim().length < 3}>{process.isPending ? 'Saving…' : 'Confirm paid'}</Button>
        </form></DialogContent>
      </Dialog>
    </Card>
  );
};

export default PayoutQueueManagement;
