
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CheckCircle, Download } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const PayoutQueueManagement = () => {
  const [payoutFilter, setPayoutFilter] = useState("all");

  const payouts = [
    {
      id: "1",
      ambassadorName: "John Mwangi",
      ambassadorCode: "MC-NAI-12345",
      amount: 450.00,
      currency: "USD",
      status: "pending",
      type: "monthly",
      dueDate: "2024-02-01",
      createdDate: "2024-01-25",
      method: "bank_transfer"
    },
    {
      id: "2",
      ambassadorName: "Mary Otieno",
      ambassadorCode: "MC-MSA-67890",
      amount: 320.00,
      currency: "USD",
      status: "paid",
      type: "monthly",
      dueDate: "2024-02-01",
      createdDate: "2024-01-25",
      method: "mobile_money"
    },
    {
      id: "3",
      ambassadorName: "Peter Kimani",
      ambassadorCode: "MC-DAR-11223",
      amount: 75.00,
      currency: "USD",
      status: "pending",
      type: "monthly",
      dueDate: "2024-02-01",
      createdDate: "2024-01-25",
      method: "bank_transfer"
    }
  ];

  const filteredPayouts = payouts.filter(payout => 
    payoutFilter === "all" || payout.status === payoutFilter
  );

  const handleProcessPayout = (payoutId: string) => {
    console.log(`Processing payout ${payoutId}`);
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
        <div className="border border-slate-700 rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-900 border-slate-700 hover:bg-slate-900">
                <TableHead className="text-slate-300">Ambassador</TableHead>
                <TableHead className="text-slate-300">Amount</TableHead>
                <TableHead className="text-slate-300">Method</TableHead>
                <TableHead className="text-slate-300">Due Date</TableHead>
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
                      {payout.method.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-slate-300">{payout.dueDate}</TableCell>
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
                          className="bg-emerald-600 hover:bg-emerald-700"
                          onClick={() => handleProcessPayout(payout.id)}
                        >
                          <CheckCircle className="w-4 h-4" />
                        </Button>
                      )}
                      <Button size="sm" variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default PayoutQueueManagement;
