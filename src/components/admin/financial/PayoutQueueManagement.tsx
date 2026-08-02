import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CheckCircle, Download, Loader2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAdminPayouts, useProcessPayouts, downloadCsv } from "@/hooks/useAdminData";

const PayoutQueueManagement = () => {
  const [payoutFilter, setPayoutFilter] = useState("all");
  const { data: payouts = [], isLoading, error } = useAdminPayouts();
  const process = useProcessPayouts();

  const filteredPayouts = payouts.filter(
    (payout) => payoutFilter === "all" || payout.status === payoutFilter
  );

  const handleProcessPayout = (payoutId: string) => {
    process.mutate([payoutId]);
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
      },
    ]);
  };

  return (
    <Card className="bg-slate-800 border-slate-700 shadow-xl">
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
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardTitle>
        <CardDescription className="text-slate-400">Review and process ambassador payout requests</CardDescription>
      </CardHeader>
      <CardContent>
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
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                        )}
                        <Button
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
    </Card>
  );
};

export default PayoutQueueManagement;
