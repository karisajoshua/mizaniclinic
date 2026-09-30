import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Referral } from "@/types/dashboard";

export const useReferrals = () => {
  return useQuery({
    queryKey: ['referrals'],
    queryFn: async (): Promise<Referral[]> => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const [refRes, earnRes] = await Promise.all([
        supabase
          .from('referrals')
          .select(`*, referred:profiles!referrals_referred_id_fkey(full_name, region)`)
          .eq('referrer_id', user.id)
          .order('created_at', { ascending: false })
          .limit(20),
        supabase
          .from('earnings')
          .select('amount_usd, source_transaction_id, status')
          .eq('user_id', user.id)
          .eq('earning_type', 'activation_pack'),
      ]);

      if (refRes.error) throw refRes.error;

      const commissionBy = new Map<string, number>();
      (earnRes.data || []).forEach(e => {
        if (e.status === 'cancelled' || !e.source_transaction_id) return;
        commissionBy.set(e.source_transaction_id, (commissionBy.get(e.source_transaction_id) || 0) + Number(e.amount_usd));
      });

      return (refRes.data || []).map(r => ({
        name: r.referred?.full_name || 'Unknown',
        joinDate: new Date(r.joined_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
        location: r.referred?.region || r.country,
        status: r.status === 'active' ? 'Active' : 'Pending',
        commission: r.referred_id ? commissionBy.get(r.referred_id) || 0 : 0,
      }));
    },
  });
};
