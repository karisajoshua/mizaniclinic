
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, CreditCard, Banknote, Download } from "lucide-react";

const RevenueBreakdown = () => {
  const handleQuickAction = (action: string) => {
    console.log(`Executing quick action: ${action}`);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Revenue Sources */}
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
            <Button 
              variant="outline" 
              className="h-20 flex flex-col space-y-2 border-slate-600 text-slate-300 hover:bg-slate-700"
              onClick={() => handleQuickAction('batch_payout')}
            >
              <Banknote className="w-6 h-6" />
              <span className="text-sm">Process Batch Payout</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex flex-col space-y-2 border-slate-600 text-slate-300 hover:bg-slate-700"
              onClick={() => handleQuickAction('payment_methods')}
            >
              <CreditCard className="w-6 h-6" />
              <span className="text-sm">Update Payment Methods</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex flex-col space-y-2 border-slate-600 text-slate-300 hover:bg-slate-700"
              onClick={() => handleQuickAction('commission_config')}
            >
              <TrendingUp className="w-6 h-6" />
              <span className="text-sm">Commission Rate Config</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex flex-col space-y-2 border-slate-600 text-slate-300 hover:bg-slate-700"
              onClick={() => handleQuickAction('financial_reports')}
            >
              <Download className="w-6 h-6" />
              <span className="text-sm">Financial Reports</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RevenueBreakdown;
