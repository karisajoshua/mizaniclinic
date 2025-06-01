
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DollarSign, Download, CheckCircle, Clock, AlertTriangle, TrendingUp, CreditCard, Banknote } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const AdminFinancialManagement = () => {
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

  const financialMetrics = [
    {
      title: "Total Platform Revenue",
      value: "$125,450",
      icon: DollarSign,
      color: "bg-emerald-600",
      change: "+18.2%"
    },
    {
      title: "Pending Payouts",
      value: "$12,250",
      icon: Clock,
      color: "bg-yellow-600",
      change: "23 requests"
    },
    {
      title: "Processed This Month",
      value: "$45,750",
      icon: CheckCircle,
      color: "bg-blue-600",
      change: "156 transactions"
    },
    {
      title: "Average Commission",
      value: "31.2%",
      icon: TrendingUp,
      color: "bg-purple-600",
      change: "+2.1%"
    }
  ];

  const filteredPayouts = payouts.filter(payout => 
    payoutFilter === "all" || payout.status === payoutFilter
  );

  const handleProcessPayout = (payoutId: string) => {
    console.log(`Processing payout ${payoutId}`);
  };

  const handleBulkApproval = () => {
    console.log("Processing bulk payout approval");
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Financial Operations</h2>
          <p className="text-slate-400">Manage payouts, commissions, and financial reporting</p>
        </div>
        <div className="flex space-x-3">
          <Button onClick={handleBulkApproval} className="bg-emerald-600 hover:bg-emerald-700">
            <CheckCircle className="w-4 h-4 mr-2" />
            Approve All Pending
          </Button>
          <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Financial Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {financialMetrics.map((metric, index) => (
          <Card key={index} className="bg-slate-800 border-slate-700 shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">{metric.title}</CardTitle>
              <div className={`w-10 h-10 ${metric.color} rounded-lg flex items-center justify-center`}>
                <metric.icon className="w-5 h-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{metric.value}</div>
              <p className="text-xs text-emerald-400 font-medium">{metric.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Revenue Breakdown */}
        <Card className="lg:col-span-1 bg-slate-800 border-slate-700 shadow-xl">
          <CardHeader>
            <CardTitle className="text-white">Revenue Sources</CardTitle>
            <CardDescription className="text-slate-400">Monthly breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-slate-300">Activation Packs</span>
                </div>
                <span className="text-white font-semibold">$35,250</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                  <span className="text-sm text-slate-300">Direct Sales</span>
                </div>
                <span className="text-white font-semibold">$48,900</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span className="text-sm text-slate-300">Team Bonuses</span>
                </div>
                <span className="text-white font-semibold">$12,750</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="lg:col-span-2 bg-slate-800 border-slate-700 shadow-xl">
          <CardHeader>
            <CardTitle className="text-white">Financial Controls</CardTitle>
            <CardDescription className="text-slate-400">Administrative financial operations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="h-20 flex flex-col space-y-2 border-slate-600 text-slate-300 hover:bg-slate-700">
                <Banknote className="w-6 h-6" />
                <span className="text-sm">Process Batch Payout</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col space-y-2 border-slate-600 text-slate-300 hover:bg-slate-700">
                <CreditCard className="w-6 h-6" />
                <span className="text-sm">Update Payment Methods</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col space-y-2 border-slate-600 text-slate-300 hover:bg-slate-700">
                <TrendingUp className="w-6 h-6" />
                <span className="text-sm">Commission Rate Config</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col space-y-2 border-slate-600 text-slate-300 hover:bg-slate-700">
                <Download className="w-6 h-6" />
                <span className="text-sm">Financial Reports</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payouts Management */}
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
    </div>
  );
};

export default AdminFinancialManagement;
