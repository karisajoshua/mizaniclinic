
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserCheck, Download } from "lucide-react";
import AmbassadorStatsCards from "./ambassador/AmbassadorStatsCards";
import AmbassadorFilters from "./ambassador/AmbassadorFilters";
import AmbassadorDataTable from "./ambassador/AmbassadorDataTable";

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
      <AmbassadorStatsCards ambassadors={ambassadors} />

      {/* Main Management Interface */}
      <Card className="bg-slate-800 border-slate-700 shadow-xl">
        <CardHeader>
          <CardTitle className="text-white">Ambassador Database</CardTitle>
          <CardDescription className="text-slate-400">Complete user management and oversight</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <AmbassadorFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            regionFilter={regionFilter}
            setRegionFilter={setRegionFilter}
          />

          {/* Data Table */}
          <AmbassadorDataTable
            ambassadors={filteredAmbassadors}
            onStatusChange={handleStatusChange}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAmbassadorManagement;
