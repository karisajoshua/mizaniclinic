
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface CreateReferralData {
  referredUserId: string;
  referralCode: string;
  country: string;
}

export const useCreateReferral = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateReferralData) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data: referral, error } = await supabase
        .from('referrals')
        .insert({
          referrer_id: user.id,
          referred_id: data.referredUserId,
          referral_code: data.referralCode,
          country: data.country,
          status: 'pending'
        })
        .select()
        .single();

      if (error) throw error;
      return referral;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ambassador-stats'] });
      queryClient.invalidateQueries({ queryKey: ['referrals'] });
      toast({
        title: "Referral Created!",
        description: "New referral has been successfully added to your network.",
      });
    },
    onError: (error: any) => {
      console.error('Error creating referral:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create referral",
        variant: "destructive",
      });
    },
  });
};
