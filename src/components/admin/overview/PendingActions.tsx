
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";

const PendingActions = () => {
  const pendingActions = [
    { action: "Approve 12 new ambassador applications", count: 12, urgent: true },
    { action: "Review 5 high-value payout requests", count: 5, urgent: true },
    { action: "Update regional commission rates", count: 3, urgent: false },
    { action: "Generate monthly financial report", count: 1, urgent: false },
  ];

  return (
    <Card className="bg-slate-800 border-slate-700 shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-white">
          <Shield className="w-5 h-5 text-blue-400" />
          <span>Pending Admin Actions</span>
        </CardTitle>
        <CardDescription className="text-slate-400">Tasks requiring immediate attention</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {pendingActions.map((item, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg border border-slate-700">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${item.urgent ? 'bg-red-400' : 'bg-blue-400'}`}></div>
                <div>
                  <p className="text-sm font-medium text-white">{item.action}</p>
                  <span className="text-xs text-slate-400">Count: {item.count}</span>
                </div>
              </div>
              <Button 
                size="sm" 
                variant={item.urgent ? "destructive" : "outline"}
                className="text-xs"
              >
                {item.urgent ? 'Urgent' : 'Review'}
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PendingActions;
