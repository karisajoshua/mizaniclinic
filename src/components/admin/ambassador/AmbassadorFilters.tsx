
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";

interface AmbassadorFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  regionFilter: string;
  setRegionFilter: (value: string) => void;
}

const AmbassadorFilters = ({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  regionFilter,
  setRegionFilter
}: AmbassadorFiltersProps) => {
  return (
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
  );
};

export default AmbassadorFilters;
