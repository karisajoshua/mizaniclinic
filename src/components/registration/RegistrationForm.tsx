
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useRegistration, type RegistrationData } from "@/hooks/useRegistration";
import { createSystemProfile } from "@/utils/createSystemProfile";
import { supabase } from "@/integrations/supabase/client";
import PersonalInfoFields from "./PersonalInfoFields";
import LocationFields from "./LocationFields";
import ReferralCodeField from "./ReferralCodeField";

const RegistrationForm = () => {
  const [formData, setFormData] = useState<RegistrationData>({
    fullName: "",
    email: "",
    password: "",
    referralCode: "",
    region: "",
    country: "Tanzania",
    phone: ""
  });

  const [isReferralCodeValid, setIsReferralCodeValid] = useState(false);
  const [searchParams] = useSearchParams();
  const { loading, submitRegistration } = useRegistration();

  // Pre-fill referral code from URL if available
  useEffect(() => {
    const refCode = searchParams.get('ref');
    if (refCode) {
      setFormData(prev => ({ ...prev, referralCode: refCode }));
    }
  }, [searchParams]);

  // Ensure system profile exists
  useEffect(() => {
    const ensureSystemProfile = async () => {
      // Check if system profile exists
      const { data: systemProfile, error } = await supabase
        .from('profiles')
        .select('id')
        .eq('ambassador_id', 'MCA25-T0000DSM')
        .single();

      if (error && error.code === 'PGRST116') {
        // Profile doesn't exist, create it
        console.log('System profile not found, creating...');
        const result = await createSystemProfile();
        if (result.error) {
          console.error('Failed to create system profile:', result.error);
        } else {
          console.log('System profile created successfully');
        }
      }
    };

    ensureSystemProfile();
  }, []);

  const handleFieldChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleReferralValidationChange = (isValid: boolean) => {
    setIsReferralCodeValid(isValid);
  };

  const isFormValid = () => {
    return (
      formData.fullName.trim() && 
      formData.email.trim() && 
      formData.password.trim() && 
      formData.referralCode.trim() && 
      formData.region.trim() && 
      formData.phone.trim() &&
      isReferralCodeValid
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormValid()) {
      toast({
        title: "Error",
        description: "Please fill in all required fields with valid information",
        variant: "destructive"
      });
      return;
    }

    // Since we've already validated the referral code in real-time,
    // we can proceed directly to registration
    await submitRegistration(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PersonalInfoFields 
        formData={formData} 
        onChange={handleFieldChange} 
      />

      <ReferralCodeField 
        value={formData.referralCode}
        onChange={(value) => handleFieldChange('referralCode', value)}
        onValidationChange={handleReferralValidationChange}
      />

      <LocationFields 
        formData={formData} 
        onChange={handleFieldChange} 
      />

      <Button 
        type="submit"
        className="w-full h-12 bg-gradient-to-r from-tanzania-green to-green-500 hover:from-green-500 hover:to-tanzania-green text-white text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
        disabled={loading || !isFormValid()}
      >
        {loading ? "Creating Account..." : "Complete Registration"}
        <ArrowRight className="ml-2 w-5 h-5" />
      </Button>
    </form>
  );
};

export default RegistrationForm;
