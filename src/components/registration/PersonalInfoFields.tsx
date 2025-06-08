
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Phone, Key, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

interface PersonalInfoFieldsProps {
  formData: {
    fullName: string;
    email: string;
    password: string;
    phone: string;
  };
  onChange: (field: string, value: string) => void;
}

const PersonalInfoFields = ({ formData, onChange }: PersonalInfoFieldsProps) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <>
      <div className="space-y-3">
        <Label htmlFor="fullName" className="text-tanzania-navy font-medium flex items-center">
          <User className="w-4 h-4 mr-2 text-tanzania-green" />
          Full Name *
        </Label>
        <Input
          id="fullName"
          placeholder="Enter your full name"
          value={formData.fullName}
          onChange={(e) => onChange('fullName', e.target.value)}
          className="h-12 border-2 border-tanzania-grey/50 focus:border-tanzania-green rounded-xl transition-all duration-300"
        />
      </div>

      <div className="space-y-3">
        <Label htmlFor="email" className="text-tanzania-navy font-medium flex items-center">
          <Phone className="w-4 h-4 mr-2 text-tanzania-green" />
          Email *
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={(e) => onChange('email', e.target.value)}
          className="h-12 border-2 border-tanzania-grey/50 focus:border-tanzania-green rounded-xl transition-all duration-300"
        />
      </div>

      <div className="space-y-3">
        <Label htmlFor="password" className="text-tanzania-navy font-medium flex items-center">
          <Key className="w-4 h-4 mr-2 text-tanzania-green" />
          Password *
        </Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Create a password"
            value={formData.password}
            onChange={(e) => onChange('password', e.target.value)}
            minLength={6}
            className="h-12 border-2 border-tanzania-grey/50 focus:border-tanzania-green rounded-xl transition-all duration-300 pr-12"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-tanzania-grey hover:text-tanzania-green transition-colors"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <Label htmlFor="phone" className="text-tanzania-navy font-medium flex items-center">
          <Phone className="w-4 h-4 mr-2 text-tanzania-green" />
          Phone Number *
        </Label>
        <Input
          id="phone"
          placeholder="+255 XXX XXX XXX"
          value={formData.phone}
          onChange={(e) => onChange('phone', e.target.value)}
          className="h-12 border-2 border-tanzania-grey/50 focus:border-tanzania-green rounded-xl transition-all duration-300"
        />
      </div>
    </>
  );
};

export default PersonalInfoFields;
