
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Filter, UserCheck, UserX, Eye, Download, Plus, MoreHorizontal } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const AdminAmbassadorManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [regionFilter, setRegionFilter] = useState("all");

  const ambassadors = [
    {
      id: "1",
      name: "John Mwangi",
      email: "john@example.com",
      referralCode: "MC-NAI-12345",
      region: "Nairobi",
      totalReferrals: 25,
      activeReferrals: 23,
      totalEarnings: 450.00,
      status: "active",
      tier: "Standard",
      joinDate: "2024-01-15",
      lastActive: "2 hours ago"
    },
    {
      id: "2",
      name: "Mary Otieno",
      email: "mary@example.com",
      referralCode: "MC-MSA-67890",
      region: "Mombasa",
      totalReferrals: 18,
      activeReferrals: 16,
      totalEarnings: 320.00,
      status: "active",
      tier: "Premium",
      joinDate: "2024-01-20",
      lastActive: "1 day ago"
    },
    {
      id: "3",
      name: "Peter Kimani",
      email: "peter@example.com",
      referralCode: "MC-DAR-11223",
      region: "Dar es Salaam",
      totalReferrals: 5,
      activeReferrals: 4,
      totalEarnings: 75.00,
      status: "pending",
      tier: "Standard",
      joinDate: "2024-02-01",
      lastActive: "Never"
    }
  ];

  const filteredAmbassadors = ambassadors.filter(ambassador => {
    const matchesSearch = ambassador.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ambassador.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ambassador.referralCode.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || ambassador.status === statusFilter;
    const matchesRegion = regionFilter === "all" || ambassador.region === regionFilter;
    
    return matchesSearch && matchesStatus && matchesRegion;
  });

  const handleStatusChange = (ambassadorId: string, newStatus: string) => {
    console.log(`Changing status for ${ambassadorId} to ${newStatus}`);
  };

  const handleBulkApproval = () => {
    console.log("Processing bulk approval");
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">User Management</h2>
          <p className="text-slate-400">Manage ambassador accounts, approvals, and permissions</p>
        </div>
        <div className="flex space-x-3">
          <Button onClick={handleBulkApproval} className="bg-blue-600 hover:bg-blue-700">
            <UserCheck className="w-4 h-4 mr-2" />
            Bulk Approve
          </Button>
          <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Active Users</p>
                <p className="text-2xl font-bold text-emerald-400">{ambassadors.filter(a => a.status === 'active').length}</p>
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
                <p className="text-2xl font-bold text-yellow-400">{ambassadors.filter(a => a.status === 'pending').length}</p>
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
                <p className="text-2xl font-bold text-blue-400">${ambassadors.reduce((sum, a) => sum + a.totalEarnings, 0).toFixed(2)}</p>
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
                <p className="text-2xl font-bold text-purple-400">{ambassadors.reduce((sum, a) => sum + a.totalReferrals, 0)}</p>
              </div>
              <Plus className="w-8 h-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Management Interface */}
      <Card className="bg-slate-800 border-slate-700 shadow-xl">
        <CardHeader>
          <CardTitle className="text-white">Ambassador Database</CardTitle>
          <CardDescription className="text-slate-400">Complete user management and oversight</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search users by name, email, or code..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-slate-900 border-slate-600 text-white placeholder:text-slate-400"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full lg:w-48 bg-slate-900 border-slate-600 text-white">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-slate-600">
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
            <Select value={regionFilter} onValueChange={setRegionFilter}>
              <SelectTrigger className="w-full lg:w-48 bg-slate-900 border-slate-600 text-white">
                <SelectValue placeholder="Filter by region" />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-slate-600">
                <SelectItem value="all">All Regions</SelectItem>
                <SelectItem value="Nairobi">Nairobi</SelectItem>
                <SelectItem value="Mombasa">Mombasa</SelectItem>
                <SelectItem value="Dar es Salaam">Dar es Salaam</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Data Table */}
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
                {filteredAmbassadors.map((ambassador) => (
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
                            onClick={() => handleStatusChange(ambassador.id, 'active')}
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
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAmbassadorManagement;
