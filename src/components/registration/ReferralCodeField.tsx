
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Key, CheckCircle, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";

interface ReferralCodeFieldProps {
  value: string;
  onChange: (value: string) => void;
}

const ReferralCodeField = ({ value, onChange }: ReferralCodeFieldProps) => {
  const [isValidFormat, setIsValidFormat] = useState(false);

  useEffect(() => {
    // Check if the referral code matches the expected format
    const isValid = /^MCA25-[A-Z0-9]+$/.test(value);
    setIsValidFormat(isValid);
  }, [value]);

  const handleChange = (inputValue: string) => {
    // Auto-format to uppercase and ensure it starts with MCA25-
    let formattedValue = inputValue.toUpperCase();
    
    // Auto-add MCA25- prefix if user starts typing without it
    if (formattedValue && !formattedValue.startsWith('MCA25-')) {
      if (formattedValue.startsWith('MCA25')) {
        formattedValue = formattedValue.replace('MCA25', 'MCA25-');
      } else {
        formattedValue = 'MCA25-' + formattedValue;
      }
    }
    
    onChange(formattedValue);
  };

  return (
    <div className="space-y-3">
      <Label htmlFor="referralCode" className="text-tanzania-navy font-medium flex items-center">
        <Key className="w-4 h-4 mr-2 text-tanzania-green" />
        Referral Code *
      </Label>
      <div className="relative">
        <Input
          id="referralCode"
          placeholder="MCA25-T0001DSM"
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          className={`h-12 border-2 rounded-xl transition-all duration-300 font-mono pr-10 ${
            value && isValidFormat 
              ? 'border-tanzania-green focus:border-tanzania-green' 
              : value 
                ? 'border-red-300 focus:border-red-400' 
                : 'border-tanzania-grey/50 focus:border-tanzania-green'
          }`}
        />
        {value && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            {isValidFormat ? (
              <CheckCircle className="w-5 h-5 text-tanzania-green" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-400" />
            )}
          </div>
        )}
      </div>
      <div className="space-y-1">
        <p className={`text-sm flex items-center transition-colors ${
          value && isValidFormat ? 'text-tanzania-green' : 'text-tanzania-text/60'
        }`}>
          <CheckCircle className="w-3 h-3 mr-1" />
          Enter the referral code from your sponsor
        </p>
        {value && !isValidFormat && (
          <p className="text-sm text-red-500 flex items-center">
            <AlertCircle className="w-3 h-3 mr-1" />
            Format should be MCA25-XXXXX (e.g., MCA25-T0001DSM)
          </p>
        )}
      </div>
    </div>
  );
};

export default ReferralCodeField;
