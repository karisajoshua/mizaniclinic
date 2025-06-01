
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle, Clock } from "lucide-react";

const SystemAlerts = () => {
  const systemAlerts = [
    { type: "warning", message: "Tanzania approaching 85% ambassador capacity", time: "5 min ago", priority: "high" },
    { type: "info", message: "Scheduled maintenance in 2 days", time: "1 hour ago", priority: "medium" },
    { type: "success", message: "Monthly payout batch completed successfully", time: "2 hours ago", priority: "low" },
    { type: "warning", message: "High payout request volume detected", time: "4 hours ago", priority: "high" },
  ];

  return (
    <Card className="bg-slate-800 border-slate-700 shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-white">
          <AlertTriangle className="w-5 h-5 text-yellow-400" />
          <span>System Alerts</span>
          <Badge variant="destructive" className="ml-2">4</Badge>
        </CardTitle>
        <CardDescription className="text-slate-400">Critical system notifications</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {systemAlerts.map((alert, index) => (
            <div key={index} className="flex items-start space-x-3 p-4 bg-slate-900/50 rounded-lg border border-slate-700">
              {alert.type === 'warning' ? (
                <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5" />
              ) : alert.type === 'success' ? (
                <CheckCircle className="w-5 h-5 text-emerald-400 mt-0.5" />
              ) : (
                <Clock className="w-5 h-5 text-blue-400 mt-0.5" />
              )}
              <div className="flex-1">
                <p className="text-sm font-medium text-white">{alert.message}</p>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="text-xs text-slate-400">{alert.time}</span>
                  <Badge 
                    variant={alert.priority === 'high' ? 'destructive' : alert.priority === 'medium' ? 'secondary' : 'outline'}
                    className="text-xs"
                  >
                    {alert.priority}
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SystemAlerts;
