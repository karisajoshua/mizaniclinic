
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Settings, Save, RefreshCw, Shield, Bell } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const AdminSystemConfiguration = () => {
  const handleSaveSettings = () => {
    console.log("Saving system settings");
    // In production, this would update the database
  };

  const commissionTiers = [
    {
      name: "Standard",
      activationPack: 35,
      directSalesMin: 25,
      directSalesMax: 35,
      secondLevel: 10,
      status: "active"
    },
    {
      name: "Premium",
      activationPack: 70,
      directSalesMin: 35,
      directSalesMax: 75,
      secondLevel: 20,
      status: "active"
    }
  ];

  const systemSettings = [
    { key: "default_ambassador_limit", label: "Default Ambassador Limit", value: "100", type: "number" },
    { key: "currency_exchange_rate", label: "USD to TZS Rate", value: "2500", type: "number" },
    { key: "minimum_payout_amount", label: "Minimum Payout Amount (USD)", value: "50", type: "number" },
    { key: "payout_schedule", label: "Payout Schedule", value: "monthly", type: "text" },
    { key: "referral_code_prefix", label: "Referral Code Prefix", value: "MC", type: "text" }
  ];

  return (
    <div className="space-y-6">
      {/* Commission Tiers Configuration */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="w-6 h-6 text-blue-500" />
            <span>Commission Tier Configuration</span>
          </CardTitle>
          <CardDescription>Manage commission rates for different ambassador tiers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {commissionTiers.map((tier, index) => (
              <Card key={index} className="border-2 border-gray-200">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{tier.name} Tier</CardTitle>
                    <Badge variant={tier.status === 'active' ? 'default' : 'secondary'}>
                      {tier.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <Label htmlFor={`${tier.name}-activation`}>Activation Pack (%)</Label>
                      <Input
                        id={`${tier.name}-activation`}
                        type="number"
                        defaultValue={tier.activationPack}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`${tier.name}-direct-min`}>Direct Sales Min (%)</Label>
                      <Input
                        id={`${tier.name}-direct-min`}
                        type="number"
                        defaultValue={tier.directSalesMin}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`${tier.name}-direct-max`}>Direct Sales Max (%)</Label>
                      <Input
                        id={`${tier.name}-direct-max`}
                        type="number"
                        defaultValue={tier.directSalesMax}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`${tier.name}-second`}>First Generation (%)</Label>
                      <Input
                        id={`${tier.name}-second`}
                        type="number"
                        defaultValue={tier.secondLevel}
                        className="mt-1"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end mt-4">
                    <Button size="sm">
                      <Save className="w-4 h-4 mr-2" />
                      Update {tier.name} Tier
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* System Settings */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>General System Settings</CardTitle>
          <CardDescription>Configure global system parameters</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {systemSettings.map((setting, index) => (
              <div key={index}>
                <Label htmlFor={setting.key}>{setting.label}</Label>
                <Input
                  id={setting.key}
                  type={setting.type}
                  defaultValue={setting.value}
                  className="mt-1"
                />
              </div>
            ))}
          </div>
          <Separator className="my-6" />
          <div className="flex justify-between">
            <Button variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Reset to Defaults
            </Button>
            <Button onClick={handleSaveSettings}>
              <Save className="w-4 h-4 mr-2" />
              Save All Settings
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Product Configuration */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Product Configuration</CardTitle>
          <CardDescription>Manage products and their commission eligibility</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Card className="border border-gray-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold">Mizani Activation Pack</h4>
                    <p className="text-sm text-gray-600">Ambassador registration package</p>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">$35 USD</div>
                    <Badge className="mt-1">Commission Eligible</Badge>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <Label htmlFor="activation-price">Price (USD)</Label>
                    <Input id="activation-price" type="number" defaultValue="35" />
                  </div>
                  <div>
                    <Label htmlFor="activation-local">Price (TZS)</Label>
                    <Input id="activation-local" type="number" defaultValue="87500" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="w-6 h-6 text-green-500" />
            <span>Security & Access Control</span>
          </CardTitle>
          <CardDescription>Manage admin access and security settings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h4 className="font-medium">Admin Email Verification</h4>
                <p className="text-sm text-gray-600">Require email verification for admin accounts</p>
              </div>
              <Badge variant="default">Enabled</Badge>
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h4 className="font-medium">Audit Logging</h4>
                <p className="text-sm text-gray-600">Log all administrative actions</p>
              </div>
              <Badge variant="default">Enabled</Badge>
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h4 className="font-medium">Two-Factor Authentication</h4>
                <p className="text-sm text-gray-600">Require 2FA for admin access</p>
              </div>
              <Badge variant="secondary">Disabled</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bell className="w-6 h-6 text-blue-500" />
            <span>Notification Configuration</span>
          </CardTitle>
          <CardDescription>Configure system notifications and alerts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-medium">Email Notifications</h4>
              <div className="space-y-2">
                <label className="flex items-center space-x-2">
                  <input type="checkbox" defaultChecked className="rounded" />
                  <span className="text-sm">New ambassador registrations</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" defaultChecked className="rounded" />
                  <span className="text-sm">Payout requests</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" defaultChecked className="rounded" />
                  <span className="text-sm">Country limit warnings</span>
                </label>
              </div>
            </div>
            <div className="space-y-3">
              <h4 className="font-medium">System Alerts</h4>
              <div className="space-y-2">
                <label className="flex items-center space-x-2">
                  <input type="checkbox" defaultChecked className="rounded" />
                  <span className="text-sm">High payout amounts</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" defaultChecked className="rounded" />
                  <span className="text-sm">Suspicious activity</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" className="rounded" />
                  <span className="text-sm">Performance milestones</span>
                </label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSystemConfiguration;
