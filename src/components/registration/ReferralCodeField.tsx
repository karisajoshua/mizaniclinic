
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Key, CheckCircle, AlertCircle, Loader2, User } from "lucide-react";
import { useState, useEffect } from "react";
import { useReferralCodeValidation } from "@/hooks/useReferralCodeValidation";

interface ReferralCodeFieldProps {
  value: string;
  onChange: (value: string) => void;
  onValidationChange?: (isValid: boolean) => void;
}

const ReferralCodeField = ({ value, onChange, onValidationChange }: ReferralCodeFieldProps) => {
  const [isValidFormat, setIsValidFormat] = useState(false);
  const { isValid, isChecking, sponsorName, error } = useReferralCodeValidation(value);

  useEffect(() => {
    // Check if the referral code matches the expected format
    const formatValid = /^MCA25-[A-Z0-9]+$/.test(value);
    setIsValidFormat(formatValid);
  }, [value]);

  // Notify parent component of validation status
  useEffect(() => {
    if (onValidationChange) {
      onValidationChange(isValid && isValidFormat);
    }
  }, [isValid, isValidFormat, onValidationChange]);

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

  const getValidationIcon = () => {
    if (!value) return null;
    if (isChecking) return <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />;
    if (!isValidFormat) return <AlertCircle className="w-5 h-5 text-red-400" />;
    if (isValid) return <CheckCircle className="w-5 h-5 text-tanzania-green" />;
    if (error) return <AlertCircle className="w-5 h-5 text-red-400" />;
    return null;
  };

  const getFieldBorderColor = () => {
    if (!value) return 'border-tanzania-grey/50 focus:border-tanzania-green';
    if (isChecking) return 'border-blue-300 focus:border-blue-400';
    if (!isValidFormat) return 'border-red-300 focus:border-red-400';
    if (isValid) return 'border-tanzania-green focus:border-tanzania-green';
    if (error) return 'border-red-300 focus:border-red-400';
    return 'border-tanzania-grey/50 focus:border-tanzania-green';
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
          className={`h-12 border-2 rounded-xl transition-all duration-300 font-mono pr-10 ${getFieldBorderColor()}`}
        />
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
          {getValidationIcon()}
        </div>
      </div>
      <div className="space-y-1">
        {!value && (
          <p className="text-sm text-tanzania-text/60 flex items-center">
            <CheckCircle className="w-3 h-3 mr-1" />
            Enter the referral code from your sponsor
          </p>
        )}
        
        {value && isChecking && (
          <p className="text-sm text-blue-600 flex items-center">
            <Loader2 className="w-3 h-3 mr-1 animate-spin" />
            Checking referral code...
          </p>
        )}
        
        {value && !isValidFormat && !isChecking && (
          <p className="text-sm text-red-500 flex items-center">
            <AlertCircle className="w-3 h-3 mr-1" />
            Format should be MCA25-XXXXX (e.g., MCA25-T0001DSM)
          </p>
        )}
        
        {value && isValidFormat && isValid && sponsorName && (
          <p className="text-sm text-tanzania-green flex items-center">
            <User className="w-3 h-3 mr-1" />
            Valid referral code from {sponsorName} ✓
          </p>
        )}
        
        {value && isValidFormat && error && !isChecking && (
          <p className="text-sm text-red-500 flex items-center">
            <AlertCircle className="w-3 h-3 mr-1" />
            {error}
          </p>
        )}
      </div>
    </div>
  );
};

export default ReferralCodeField;
