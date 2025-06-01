
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Filter, MoreHorizontal, UserCheck, UserX, DollarSign, Eye } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const AdminAmbassadorManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [regionFilter, setRegionFilter] = useState("all");

  // Mock data - in production, this would come from the database
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
      joinDate: "2024-01-15"
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
      joinDate: "2024-01-20"
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
      joinDate: "2024-02-01"
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
    // In production, this would update the database
  };

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <UserCheck className="w-6 h-6 text-blue-500" />
            <span>Ambassador Management</span>
          </CardTitle>
          <CardDescription>Manage all ambassadors, their status, and performance</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters and Search */}
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by name, email, or referral code..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
            <Select value={regionFilter} onValueChange={setRegionFilter}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder="Filter by region" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Regions</SelectItem>
                <SelectItem value="Nairobi">Nairobi</SelectItem>
                <SelectItem value="Mombasa">Mombasa</SelectItem>
                <SelectItem value="Dar es Salaam">Dar es Salaam</SelectItem>
                <SelectItem value="Kampala">Kampala</SelectItem>
                <SelectItem value="Kigali">Kigali</SelectItem>
                <SelectItem value="Bujumbura">Bujumbura</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Ambassador Table */}
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead>Ambassador</TableHead>
                  <TableHead>Referral Code</TableHead>
                  <TableHead>Region</TableHead>
                  <TableHead>Referrals</TableHead>
                  <TableHead>Earnings</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Tier</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAmbassadors.map((ambassador) => (
                  <TableRow key={ambassador.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{ambassador.name}</div>
                        <div className="text-sm text-gray-500">{ambassador.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                        {ambassador.referralCode}
                      </code>
                    </TableCell>
                    <TableCell>{ambassador.region}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{ambassador.activeReferrals} active</div>
                        <div className="text-gray-500">{ambassador.totalReferrals} total</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">${ambassador.totalEarnings.toFixed(2)}</div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={
                          ambassador.status === 'active' ? 'default' : 
                          ambassador.status === 'pending' ? 'secondary' : 
                          'destructive'
                        }
                      >
                        {ambassador.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={ambassador.tier === 'Premium' ? 'default' : 'secondary'}>
                        {ambassador.tier}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4" />
                        </Button>
                        {ambassador.status === 'pending' && (
                          <Button 
                            size="sm" 
                            onClick={() => handleStatusChange(ambassador.id, 'active')}
                          >
                            <UserCheck className="w-4 h-4" />
                          </Button>
                        )}
                        {ambassador.status === 'active' && (
                          <Button 
                            size="sm" 
                            variant="destructive"
                            onClick={() => handleStatusChange(ambassador.id, 'suspended')}
                          >
                            <UserX className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            <Card className="p-4">
              <div className="text-2xl font-bold text-blue-600">
                {ambassadors.filter(a => a.status === 'active').length}
              </div>
              <div className="text-sm text-gray-600">Active Ambassadors</div>
            </Card>
            <Card className="p-4">
              <div className="text-2xl font-bold text-yellow-600">
                {ambassadors.filter(a => a.status === 'pending').length}
              </div>
              <div className="text-sm text-gray-600">Pending Approval</div>
            </Card>
            <Card className="p-4">
              <div className="text-2xl font-bold text-green-600">
                ${ambassadors.reduce((sum, a) => sum + a.totalEarnings, 0).toFixed(2)}
              </div>
              <div className="text-sm text-gray-600">Total Earnings</div>
            </Card>
            <Card className="p-4">
              <div className="text-2xl font-bold text-purple-600">
                {ambassadors.reduce((sum, a) => sum + a.totalReferrals, 0)}
              </div>
              <div className="text-sm text-gray-600">Total Referrals</div>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAmbassadorManagement;
