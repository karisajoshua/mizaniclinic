
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Referral } from "@/types/dashboard";

export const useReferrals = () => {
  return useQuery({
    queryKey: ['referrals'],
    queryFn: async (): Promise<Referral[]> => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data: referrals, error } = await supabase
        .from('referrals')
        .select(`
          *,
          referred:profiles!referrals_referred_id_fkey(full_name, region, country)
        `)
        .eq('referrer_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Error fetching referrals:', error);
        throw error;
      }

      return referrals?.map(referral => ({
        name: referral.referred?.full_name || 'Unknown',
        joinDate: new Date(referral.joined_date).toISOString().split('T')[0],
        location: referral.referred?.region || referral.country,
        status: referral.status === 'active' ? 'Active' : 'Pending'
      })) || [];
    },
    enabled: true,
  });
};
