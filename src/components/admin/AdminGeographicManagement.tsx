import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MapPin, Plus, Loader2 } from "lucide-react";
import { useCountryLimits } from "@/hooks/useCountryLimits";
import {
  useAdminCountryStats,
  useUpdateCountryLimit,
  useToggleCountryPremium,
  useAddCountry,
} from "@/hooks/useAdminData";
import GeographicOverviewCards from "./geographic/GeographicOverviewCards";
import CountryManagementCards from "./geographic/CountryManagementCards";
import RegionalAnalytics from "./geographic/RegionalAnalytics";

const AdminGeographicManagement = () => {
  const { data: countries, isLoading } = useCountryLimits();
  const { data: countryStats } = useAdminCountryStats();
  const updateLimit = useUpdateCountryLimit();
  const togglePremium = useToggleCountryPremium();
  const addCountry = useAddCountry();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [newCountry, setNewCountry] = useState({ code: "", name: "", limit: "100" });

  const handleUpdateLimit = (countryCode: string, newLimit: number) => {
    updateLimit.mutate({ code: countryCode, limit: newLimit });
  };

  const handleTogglePremium = (countryCode: string, premium: boolean) => {
    togglePremium.mutate({ code: countryCode, premium });
  };

  const handleAddCountry = () => {
    const limit = parseInt(newCountry.limit, 10);
    if (!newCountry.code.trim() || !newCountry.name.trim() || Number.isNaN(limit)) return;
    addCountry.mutate(
      { code: newCountry.code.trim(), name: newCountry.name.trim(), limit },
      {
        onSuccess: () => {
          setDialogOpen(false);
          setNewCountry({ code: "", name: "", limit: "100" });
        },
      }
    );
  };

  return (
    <div className="space-y-6">
      {/* Geographic Overview */}
      <GeographicOverviewCards countries={countries} />

      {/* Country Management */}
      <Card className="bg-slate-800 border-slate-700 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-white">
            <span className="flex items-center space-x-2">
              <MapPin className="w-6 h-6 text-blue-400" />
              <span>Country Limits Management</span>
            </span>
            <Button onClick={() => setDialogOpen(true)} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Add New Country
            </Button>
          </CardTitle>
          <CardDescription className="text-slate-400">
            Manage ambassador limits and premium status for each country
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-16 text-slate-400">
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Loading countries...
            </div>
          ) : !countries || countries.length === 0 ? (
            <div className="py-16 text-center text-slate-400">No countries configured yet.</div>
          ) : (
            <CountryManagementCards
              countries={countries}
              stats={countryStats}
              onUpdateLimit={handleUpdateLimit}
              onTogglePremium={handleTogglePremium}
              isUpdating={updateLimit.isPending || togglePremium.isPending}
            />
          )}
        </CardContent>
      </Card>

      {/* Regional Performance */}
      <RegionalAnalytics countries={countries} stats={countryStats} />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add new country</DialogTitle>
            <DialogDescription>
              Create a new ambassador capacity entry for a country.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="country-code">Country code</Label>
              <Input
                id="country-code"
                maxLength={2}
                placeholder="KE"
                value={newCountry.code}
                onChange={(e) => setNewCountry({ ...newCountry, code: e.target.value.toUpperCase() })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country-name">Country name</Label>
              <Input
                id="country-name"
                placeholder="Kenya"
                value={newCountry.name}
                onChange={(e) => setNewCountry({ ...newCountry, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country-limit">Ambassador limit</Label>
              <Input
                id="country-limit"
                type="number"
                min={1}
                value={newCountry.limit}
                onChange={(e) => setNewCountry({ ...newCountry, limit: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddCountry} disabled={addCountry.isPending}>
              {addCountry.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Add country
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminGeographicManagement;
