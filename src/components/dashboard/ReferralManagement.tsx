
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { UserPlus, Users, TrendingUp } from "lucide-react";
import { useCreateReferral } from "@/hooks/useCreateReferral";
import { toast } from "@/hooks/use-toast";

const ReferralManagement = () => {
  const [newReferral, setNewReferral] = useState({
    name: "",
    phone: "",
    country: "",
    referralCode: ""
  });

  const createReferralMutation = useCreateReferral();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newReferral.name || !newReferral.phone || !newReferral.country) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    // In a real implementation, you would create the user first
    // For now, we'll show a message about the manual process
    toast({
      title: "Referral Process",
      description: "Please have your referral register using your referral code through the registration page.",
    });

    // Reset form
    setNewReferral({
      name: "",
      phone: "",
      country: "",
      referralCode: ""
    });
  };

  const countries = [
    { code: "TZ", name: "Tanzania" },
    { code: "KE", name: "Kenya" },
    { code: "UG", name: "Uganda" },
    { code: "RW", name: "Rwanda" },
    { code: "BI", name: "Burundi" },
    { code: "CD", name: "DRC" }
  ];

  return (
    <Card className="border-0 bg-white/90 backdrop-blur-sm shadow-xl animate-fade-in">
      <CardHeader className="px-4 sm:px-6">
        <CardTitle className="text-gray-800 text-lg sm:text-xl font-black flex items-center">
          <UserPlus className="w-5 h-5 sm:w-6 sm:h-6 mr-3 text-green-500" />
          Quick Referral Tracker
        </CardTitle>
        <CardDescription className="font-semibold text-sm sm:text-base">
          Track potential referrals and share your code
        </CardDescription>
      </CardHeader>
      <CardContent className="px-4 sm:px-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-700 font-medium">
                Contact Name
              </Label>
              <Input
                id="name"
                placeholder="John Doe"
                value={newReferral.name}
                onChange={(e) => setNewReferral(prev => ({ ...prev, name: e.target.value }))}
                className="border-2 border-gray-200 focus:border-green-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-gray-700 font-medium">
                Phone Number
              </Label>
              <Input
                id="phone"
                placeholder="+255 XXX XXX XXX"
                value={newReferral.phone}
                onChange={(e) => setNewReferral(prev => ({ ...prev, phone: e.target.value }))}
                className="border-2 border-gray-200 focus:border-green-500"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="country" className="text-gray-700 font-medium">
              Country
            </Label>
            <Select value={newReferral.country} onValueChange={(value) => setNewReferral(prev => ({ ...prev, country: value }))}>
              <SelectTrigger className="border-2 border-gray-200 focus:border-green-500">
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent>
                {countries.map((country) => (
                  <SelectItem key={country.code} value={country.code}>
                    {country.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4">
            <h4 className="font-bold text-green-800 mb-2 flex items-center">
              <TrendingUp className="w-4 h-4 mr-2" />
              How to Complete the Referral:
            </h4>
            <ol className="text-sm text-green-700 space-y-1 list-decimal list-inside">
              <li>Save their contact information above</li>
              <li>Share your referral code with them</li>
              <li>Direct them to register at the registration page</li>
              <li>They must use your code during registration</li>
              <li>Earn commission once they activate!</li>
            </ol>
          </div>

          <Button 
            type="submit"
            className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold h-12 rounded-xl"
            disabled={createReferralMutation.isPending}
          >
            <Users className="w-4 h-4 mr-2" />
            {createReferralMutation.isPending ? "Saving..." : "Save Contact & Get Instructions"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ReferralManagement;
