
import SystemMetricsCards from "./overview/SystemMetricsCards";
import SystemAlerts from "./overview/SystemAlerts";
import PendingActions from "./overview/PendingActions";
import RegionalStatusGrid from "./overview/RegionalStatusGrid";
import QuickAdminActions from "./overview/QuickAdminActions";

const AdminOverview = () => {
  return (
    <div className="space-y-8">
      {/* System Metrics */}
      <SystemMetricsCards />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* System Alerts */}
        <SystemAlerts />

        {/* Pending Actions */}
        <PendingActions />
      </div>

      {/* Regional Status Grid */}
      <RegionalStatusGrid />

      {/* Quick Admin Actions */}
      <QuickAdminActions />
    </div>
  );
};

export default AdminOverview;
