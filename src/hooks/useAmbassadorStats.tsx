
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { AmbassadorStats } from "@/types/dashboard";

export const useAmbassadorStats = () => {
  return useQuery({
    queryKey: ['ambassador-stats'],
    queryFn: async (): Promise<AmbassadorStats> => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Get ambassador stats from database
      const { data: stats, error: statsError } = await supabase
        .from('ambassador_stats')
        .select('*')
        .eq('user_id', user.id)
         .maybeSingle();
        

      if (statsError && statsError.code !== 'PGRST116') {
        console.error('Error fetching ambassador stats:', statsError);
        throw statsError;
      }

      // Get referrals by country
      const { data: referrals, error: referralsError } = await supabase
        .from('referrals')
        .select('country')
        .eq('referrer_id', user.id)
        .eq('status', 'active');

      // Get the ambassador's own country and the live country limits
      const { data: profile } = await supabase
        .from('profiles')
        .select('country')
        .eq('id', user.id)
        .maybeSingle();

      const { data: countryLimits } = await supabase
        .from('country_limits')
        .select('country_name, current_count, ambassador_limit');

      if (referralsError) {
        console.error('Error fetching referrals:', referralsError);
        throw referralsError;
      }

      // Get team bonus progress
      const { data: bonuses, error: bonusesError } = await supabase
        .from('team_bonuses')
        .select('*')
        .eq('user_id', user.id);

      if (bonusesError) {
        console.error('Error fetching bonuses:', bonusesError);
      }

      // Count referrals by country
      const referralsByCountry = {
        Tanzania: 0,
        Kenya: 0,
        Uganda: 0,
        Rwanda: 0,
        Burundi: 0,
        DRC: 0
      };

      const codeToName: Record<string, keyof typeof referralsByCountry> = {
        TZ: 'Tanzania',
        KE: 'Kenya',
        UG: 'Uganda',
        RW: 'Rwanda',
        BI: 'Burundi',
        CD: 'DRC',
        Tanzania: 'Tanzania',
        Kenya: 'Kenya',
        Uganda: 'Uganda',
        Rwanda: 'Rwanda',
        Burundi: 'Burundi',
        DRC: 'DRC',
      };

      referrals?.forEach(referral => {
        const name = codeToName[referral.country as string];
        if (name) referralsByCountry[name]++;
      });

      const countryName = profile?.country || 'Tanzania';
      const ownLimit = countryLimits?.find(c => c.country_name === countryName);

      // Get team progress values from bonuses
      const motorbikeBonus = bonuses?.find(b => b.bonus_type === 'motorbike');
      const carBonus = bonuses?.find(b => b.bonus_type === 'car');

      return {
        totalEarnings: (stats?.total_earnings_usd || 0) * 2500, // Convert back to TZS for display
        activationPackEarnings: (stats?.activation_pack_earnings_usd || 0) * 2500,
        directReferralEarnings: (stats?.direct_sales_earnings_usd || 0) * 2500,
        secondLevelEarnings: (stats?.second_level_earnings_usd || 0) * 2500,
        teamProgressLevel1: (motorbikeBonus?.current_amount_usd || 0) * 2500,
        teamProgressLevel2: (carBonus?.current_amount_usd || 0) * 2500,
        totalReferrals: stats?.total_referrals || 0,
        activeReferrals: stats?.active_referrals || 0,
        pendingReferrals: stats?.pending_referrals || 0,
        referralsByCountry,
        ambassadorLimit: ownLimit?.ambassador_limit ?? 100,
        countryName,
        countryActiveCount: ownLimit?.current_count ?? 0,
        currentCommissionTier: stats?.current_commission_tier || "Standard",
        nextPayoutDate: stats?.next_payout_date || "2024-02-01"
      };
    },
    enabled: true,
    refetchInterval: 30000, // Refetch every 30 seconds
  });
};
