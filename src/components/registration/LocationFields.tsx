
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin } from "lucide-react";
import { EAST_AFRICAN_COUNTRIES, COUNTRY_REGIONS } from "@/utils/eastAfricaData";

interface LocationFieldsProps {
  formData: {
    country: string;
    region: string;
  };
  onChange: (field: string, value: string) => void;
}

const LocationFields = ({ formData, onChange }: LocationFieldsProps) => {
  const handleCountryChange = (country: string) => {
    onChange('country', country);
    onChange('region', ''); // Reset region when country changes
  };

  const availableRegions = COUNTRY_REGIONS[formData.country] || [];

  return (
    <>
      <div className="space-y-3">
        <Label htmlFor="country" className="text-tanzania-navy font-medium flex items-center">
          <MapPin className="w-4 h-4 mr-2 text-tanzania-green" />
          Country *
        </Label>
        <Select value={formData.country} onValueChange={handleCountryChange}>
          <SelectTrigger className="h-12 border-2 border-tanzania-grey/50 focus:border-tanzania-green rounded-xl transition-all duration-300">
            <SelectValue placeholder="Select your country" />
          </SelectTrigger>
          <SelectContent className="max-h-60 bg-white/95 backdrop-blur-sm">
            {EAST_AFRICAN_COUNTRIES.map((country) => (
              <SelectItem key={country.name} value={country.name} className="hover:bg-tanzania-green/10">
                {country.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        <Label htmlFor="region" className="text-tanzania-navy font-medium flex items-center">
          <MapPin className="w-4 h-4 mr-2 text-tanzania-green" />
          Region/City *
        </Label>
        <Select value={formData.region} onValueChange={(value) => onChange('region', value)}>
          <SelectTrigger className="h-12 border-2 border-tanzania-grey/50 focus:border-tanzania-green rounded-xl transition-all duration-300">
            <SelectValue placeholder="Select your region" />
          </SelectTrigger>
          <SelectContent className="max-h-60 bg-white/95 backdrop-blur-sm">
            {availableRegions.map((region) => (
              <SelectItem key={region} value={region} className="hover:bg-tanzania-green/10">
                {region}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </>
  );
};

export default LocationFields;
