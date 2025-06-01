
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DollarSign, Download, CheckCircle, Clock, XCircle, TrendingUp } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const AdminFinancialManagement = () => {
  const [payoutFilter, setPayoutFilter] = useState("all");

  // Mock financial data
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
      createdDate: "2024-01-25"
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
      createdDate: "2024-01-25"
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
      createdDate: "2024-01-25"
    }
  ];

  const earningsBreakdown = [
    { type: "Activation Pack", amount: 15750, percentage: 35, color: "bg-blue-500" },
    { type: "Direct Sales", amount: 18900, percentage: 42, color: "bg-green-500" },
    { type: "Second Level", amount: 6750, percentage: 15, color: "bg-purple-500" },
    { type: "Team Bonuses", amount: 3600, percentage: 8, color: "bg-orange-500" }
  ];

  const filteredPayouts = payouts.filter(payout => 
    payoutFilter === "all" || payout.status === payoutFilter
  );

  const handleProcessPayout = (payoutId: string) => {
    console.log(`Processing payout ${payoutId}`);
    // In production, this would update the database and trigger payment processing
  };

  const handleBulkApproval = () => {
    console.log("Processing bulk approval for pending payouts");
    // In production, this would approve all pending payouts
  };

  return (
    <div className="space-y-6">
      {/* Financial Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$45,000</div>
            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Payouts</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$5,250</div>
            <p className="text-xs text-muted-foreground">12 ambassadors</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Paid This Month</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$8,750</div>
            <p className="text-xs text-muted-foreground">25 transactions</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Commission Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">31%</div>
            <p className="text-xs text-muted-foreground">Average across all tiers</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Earnings Breakdown */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Earnings Breakdown</CardTitle>
            <CardDescription>Revenue distribution by earning type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {earningsBreakdown.map((item, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className={`w-4 h-4 ${item.color} rounded`}></div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">{item.type}</span>
                      <span className="text-sm text-gray-600">${item.amount.toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div
                        className={`${item.color} h-2 rounded-full`}
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-gray-600">{item.percentage}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Financial Actions</CardTitle>
            <CardDescription>Quick financial management tools</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button 
                className="w-full justify-start" 
                onClick={handleBulkApproval}
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Approve All Pending Payouts
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Download className="w-4 h-4 mr-2" />
                Export Financial Report
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <DollarSign className="w-4 h-4 mr-2" />
                Update Commission Rates
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <TrendingUp className="w-4 h-4 mr-2" />
                View Analytics Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payouts Management */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Payout Management</span>
            <div className="flex space-x-2">
              <Select value={payoutFilter} onValueChange={setPayoutFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Payouts</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
              <Button>
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </CardTitle>
          <CardDescription>Manage ambassador payouts and commission payments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead>Ambassador</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayouts.map((payout) => (
                  <TableRow key={payout.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{payout.ambassadorName}</div>
                        <div className="text-sm text-gray-500">{payout.ambassadorCode}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">${payout.amount.toFixed(2)}</div>
                      <div className="text-sm text-gray-500">{payout.currency}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{payout.type}</Badge>
                    </TableCell>
                    <TableCell>{payout.dueDate}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={
                          payout.status === 'paid' ? 'default' : 
                          payout.status === 'pending' ? 'secondary' : 
                          'destructive'
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
                            onClick={() => handleProcessPayout(payout.id)}
                          >
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                        )}
                        <Button size="sm" variant="outline">
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
