
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Key, CheckCircle } from "lucide-react";

interface ReferralCodeFieldProps {
  value: string;
  onChange: (value: string) => void;
}

const ReferralCodeField = ({ value, onChange }: ReferralCodeFieldProps) => {
  return (
    <div className="space-y-3">
      <Label htmlFor="referralCode" className="text-tanzania-navy font-medium flex items-center">
        <Key className="w-4 h-4 mr-2 text-tanzania-green" />
        Referral Code *
      </Label>
      <Input
        id="referralCode"
        placeholder="MAP26-T1001DSM"

        value={value}
        onChange={(e) => onChange(e.target.value.toUpperCase())}
        className="h-12 border-2 border-tanzania-grey/50 focus:border-tanzania-green rounded-xl transition-all duration-300 font-mono"
      />
      <p className="text-sm text-tanzania-text/60 flex items-center">
        <CheckCircle className="w-3 h-3 mr-1 text-tanzania-green" />
        Enter the referral code from your sponsor (e.g., MAP26-T1001DSM)
      </p>
    </div>
  );
};

export default ReferralCodeField;
