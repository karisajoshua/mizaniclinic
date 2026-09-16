import { useAdminNavigation } from "../AdminNavigation";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, DollarSign, Database, TrendingUp } from "lucide-react";

const QuickAdminActions = () => {
  const navigate = useAdminNavigation();
  return (
    <Card className="bg-slate-800 border-slate-700 shadow-xl">
      <CardHeader>
        <CardTitle className="text-white">Quick Administrative Actions</CardTitle>
        <CardDescription className="text-slate-400">Frequently used system operations</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button onClick={() => navigate("ambassadors")} variant="outline" className="h-20 flex flex-col space-y-2 border-slate-600 text-slate-300 hover:bg-slate-700">
            <Users className="w-6 h-6" />
            <span className="text-sm">User Management</span>
          </Button>
          <Button onClick={() => navigate("financial")} variant="outline" className="h-20 flex flex-col space-y-2 border-slate-600 text-slate-300 hover:bg-slate-700">
            <DollarSign className="w-6 h-6" />
            <span className="text-sm">Process Payouts</span>
          </Button>
          <Button asChild variant="outline" className="h-20 border-slate-600 text-slate-300 hover:bg-slate-700">
            <a href="https://supabase.com/dashboard/project/rpkttbmlvjshkbjrmnvo/database/backups" target="_blank" rel="noopener noreferrer" className="flex flex-col gap-2">
              <Database className="w-6 h-6" /><span className="text-sm">Database Backups</span>
            </a>
          </Button>
          <Button onClick={() => navigate("analytics")} variant="outline" className="h-20 flex flex-col space-y-2 border-slate-600 text-slate-300 hover:bg-slate-700">
            <TrendingUp className="w-6 h-6" />
            <span className="text-sm">Generate Reports</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickAdminActions;
