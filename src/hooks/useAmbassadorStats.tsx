import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { AmbassadorStats } from "@/types/dashboard";

export const useAmbassadorStats = () => {
  return useQuery({
    queryKey: ['ambassador-stats'],
    queryFn: async (): Promise<AmbassadorStats> => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const [statsRes, profileRes, limitsRes, earningsRes] = await Promise.all([
        supabase.from('ambassador_stats').select('*').eq('user_id', user.id).maybeSingle(),
        supabase.from('profiles').select('country').eq('id', user.id).maybeSingle(),
        supabase.from('country_limits').select('country_name, current_count, ambassador_limit, premium_unlocked'),
        supabase.from('earnings').select('amount_usd, status, earned_date').eq('user_id', user.id),
      ]);

      if (statsRes.error && statsRes.error.code !== 'PGRST116') throw statsRes.error;
      const stats = statsRes.data;

      const countryName = profileRes.data?.country || 'Tanzania';
      const own = limitsRes.data?.find(c => c.country_name === countryName);
      const limit = own?.ambassador_limit ?? 100;
      const count = own?.current_count ?? 0;

      // Bonus progress is based on the commissions your team activity has earned you
      const valid = (earningsRes.data || []).filter(e => e.status !== 'cancelled');
      const monthStart = new Date();
      monthStart.setDate(1);
      monthStart.setHours(0, 0, 0, 0);
      const allTime = valid.reduce((s, e) => s + Number(e.amount_usd || 0), 0);
      const thisMonth = valid
        .filter(e => new Date(e.earned_date) >= monthStart)
        .reduce((s, e) => s + Number(e.amount_usd || 0), 0);

      return {
        totalEarnings: Number(stats?.total_earnings_usd || 0),
        pendingEarnings: Number(stats?.pending_earnings_usd || 0),
        approvedEarnings: Number(stats?.approved_earnings_usd || 0),
        paidEarnings: Number(stats?.paid_earnings_usd || 0),
        activationPackEarnings: Number(stats?.activation_pack_earnings_usd || 0),
        directReferralEarnings: Number(stats?.direct_sales_earnings_usd || 0),
        secondLevelEarnings: Number(stats?.second_level_earnings_usd || 0),
        teamProgressLevel1: allTime,
        teamProgressLevel2: thisMonth,
        totalReferrals: stats?.total_referrals || 0,
        activeReferrals: stats?.active_referrals || 0,
        pendingReferrals: stats?.pending_referrals || 0,
        ambassadorLimit: limit,
        countryName,
        countryActiveCount: count,
        premiumUnlocked: Boolean(own?.premium_unlocked) || (limit > 0 && count >= limit),
      };
    },
    refetchInterval: 30000,
  });
};
