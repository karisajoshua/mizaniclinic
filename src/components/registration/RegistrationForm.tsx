import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSearchParams } from "react-router-dom";
import { ArrowRight, ArrowLeft, User, Phone, Key, Eye, EyeOff } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useRegistration, type RegistrationData } from "@/hooks/useRegistration";
import LocationFields from "./LocationFields";
import ReferralCodeField from "./ReferralCodeField";

const TOTAL_STEPS = 3;

const RegistrationForm = () => {
  const [formData, setFormData] = useState<RegistrationData>({
    fullName: "",
    password: "",
    referralCode: "",
    region: "",
    country: "Tanzania",
    phone: ""
  });

  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [searchParams] = useSearchParams();
  const { loading, submitRegistration } = useRegistration();

  // Pre-fill referral code from URL if available
  useEffect(() => {
    const refCode = searchParams.get('ref');
    if (refCode) {
      setFormData(prev => ({ ...prev, referralCode: refCode.toUpperCase() }));
    }
  }, [searchParams]);

  const handleFieldChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateStep = () => {
    if (step === 1) {
      if (!formData.fullName || !formData.phone) return "Please enter your name and phone number";
    }
    if (step === 2) {
      if (!formData.country || !formData.region) return "Please select your country and city";
    }
    if (step === 3) {
      if (!formData.referralCode) return "Please enter your referral code";
      if (!formData.password || formData.password.length < 6) return "Please create a password with at least 6 characters";
    }
    return null;
  };

  const goNext = () => {
    const error = validateStep();
    if (error) {
      toast({ title: "Missing information", description: error, variant: "destructive" });
      return;
    }
    setStep(prev => Math.min(prev + 1, TOTAL_STEPS));
  };

  const goBack = () => setStep(prev => Math.max(prev - 1, 1));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (step < TOTAL_STEPS) {
      goNext();
      return;
    }

    const error = validateStep();
    if (error) {
      toast({ title: "Missing information", description: error, variant: "destructive" });
      return;
    }

    await submitRegistration(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Step progress */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm text-tanzania-text/60">
          <span>Step {step} of {TOTAL_STEPS}</span>
          <span>
            {step === 1 ? "Your details" : step === 2 ? "Where you are" : "Sponsor & password"}
          </span>
        </div>
        <div className="h-2 w-full bg-tanzania-grey/40 rounded-full overflow-hidden">
          <div
            className="h-2 bg-gradient-to-r from-tanzania-green to-green-500 rounded-full transition-all duration-300"
            style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
          />
        </div>
      </div>

      {step === 1 && (
        <div className="space-y-6 animate-fade-in">
          <div className="space-y-3">
            <Label htmlFor="fullName" className="text-tanzania-navy font-medium flex items-center">
              <User className="w-4 h-4 mr-2 text-tanzania-green" />
              Full Name *
            </Label>
            <Input
              id="fullName"
              placeholder="Enter your full name"
              value={formData.fullName}
              onChange={(e) => handleFieldChange('fullName', e.target.value)}
              className="h-12 border-2 border-tanzania-grey/50 focus:border-tanzania-green rounded-xl transition-all duration-300"
            />
          </div>

          <div className="space-y-3">
            <Label htmlFor="phone" className="text-tanzania-navy font-medium flex items-center">
              <Phone className="w-4 h-4 mr-2 text-tanzania-green" />
              Phone Number *
            </Label>
            <Input
              id="phone"
              inputMode="tel"
              placeholder="+255 XXX XXX XXX"
              value={formData.phone}
              onChange={(e) => handleFieldChange('phone', e.target.value)}
              className="h-12 border-2 border-tanzania-grey/50 focus:border-tanzania-green rounded-xl transition-all duration-300"
            />
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6 animate-fade-in">
          <LocationFields
            formData={formData}
            onChange={handleFieldChange}
          />
        </div>
      )}

      {step === 3 && (
        <div className="space-y-6 animate-fade-in">
          <ReferralCodeField
            value={formData.referralCode}
            onChange={(value) => handleFieldChange('referralCode', value)}
          />

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
                onChange={(e) => handleFieldChange('password', e.target.value)}
                minLength={6}
                className="h-12 border-2 border-tanzania-grey/50 focus:border-tanzania-green rounded-xl transition-all duration-300 pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-tanzania-grey hover:text-tanzania-green transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center gap-3">
        {step > 1 && (
          <Button
            type="button"
            variant="outline"
            onClick={goBack}
            className="h-12 rounded-xl border-2 border-tanzania-grey/50"
            disabled={loading}
          >
            <ArrowLeft className="mr-2 w-5 h-5" />
            Back
          </Button>
        )}

        <Button
          type="submit"
          className="flex-1 h-12 bg-gradient-to-r from-tanzania-green to-green-500 hover:from-green-500 hover:to-tanzania-green text-white text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          disabled={loading}
        >
          {step < TOTAL_STEPS ? "Next" : loading ? "Creating Account..." : "Complete Registration"}
          <ArrowRight className="ml-2 w-5 h-5" />
        </Button>
      </div>
    </form>
  );
};

export default RegistrationForm;
