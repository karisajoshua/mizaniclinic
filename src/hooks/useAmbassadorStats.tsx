
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { AmbassadorStats } from "@/types/dashboard";

export const useAmbassadorStats = () => {
  return useQuery({
    queryKey: ['ambassador-stats'],
    queryFn: async (): Promise<AmbassadorStats> => {
      // Check if user is logged in via localStorage (for real ambassadors)
      const currentUser = localStorage.getItem('currentUser');
      if (currentUser) {
        const userData = JSON.parse(currentUser);
        
        // For real ambassador accounts, return mock stats based on their data
        if (userData.isRealAccount) {
          const baseStats = {
            totalEarnings: 0,
            activationPackEarnings: 0,
            directReferralEarnings: 0,
            secondLevelEarnings: 0,
            teamProgressLevel1: 0,
            teamProgressLevel2: 0,
            totalReferrals: 0,
            activeReferrals: 0,
            pendingReferrals: 0,
            referralsByCountry: {
              Tanzania: 0,
              Kenya: 0,
              Uganda: 0,
              Rwanda: 0,
              Burundi: 0,
              DRC: 0
            },
            ambassadorLimit: 856,
            currentCommissionTier: "Standard",
            nextPayoutDate: "2024-02-15"
          };

          // Customize stats based on ambassador
          if (userData.ambassadorId === 'TO001DSM') {
            return {
              ...baseStats,
              totalEarnings: 5000,
              directReferralEarnings: 5000,
              totalReferrals: 2,
              activeReferrals: 2,
              referralsByCountry: {
                ...baseStats.referralsByCountry,
                Tanzania: 2
              }
            };
          } else if (userData.ambassadorId === 'TO003DSM') {
            return {
              ...baseStats,
              totalEarnings: 2500,
              directReferralEarnings: 2500,
              totalReferrals: 1,
              activeReferrals: 1,
              referralsByCountry: {
                ...baseStats.referralsByCountry,
                Tanzania: 1
              }
            };
          } else {
            return baseStats;
          }
        }
      }

      // Original Supabase logic for other authenticated users
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Get ambassador stats from database
      const { data: stats, error: statsError } = await supabase
        .from('ambassador_stats')
        .select('*')
        .eq('user_id', user.id)
        .single();

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

      if (referralsError) {
        console.error('Error fetching referrals:', referralsError);
        throw referralsError;
      }

      const { data: bonuses, error: bonusesError } = await supabase
        .from('team_bonuses')
        .select('*')
        .eq('user_id', user.id);

      if (bonusesError) {
        console.error('Error fetching bonuses:', bonusesError);
      }

      const referralsByCountry = {
        Tanzania: 0,
        Kenya: 0,
        Uganda: 0,
        Rwanda: 0,
        Burundi: 0,
        DRC: 0
      };

      referrals?.forEach(referral => {
        switch (referral.country) {
          case 'TZ':
            referralsByCountry.Tanzania++;
            break;
          case 'KE':
            referralsByCountry.Kenya++;
            break;
          case 'UG':
            referralsByCountry.Uganda++;
            break;
          case 'RW':
            referralsByCountry.Rwanda++;
            break;
          case 'BI':
            referralsByCountry.Burundi++;
            break;
          case 'CD':
            referralsByCountry.DRC++;
            break;
        }
      });

      const motorbikeBonus = bonuses?.find(b => b.bonus_type === 'motorbike');
      const carBonus = bonuses?.find(b => b.bonus_type === 'car');

      return {
        totalEarnings: (stats?.total_earnings_usd || 0) * 2500,
        activationPackEarnings: (stats?.activation_pack_earnings_usd || 0) * 2500,
        directReferralEarnings: (stats?.direct_sales_earnings_usd || 0) * 2500,
        secondLevelEarnings: (stats?.second_level_earnings_usd || 0) * 2500,
        teamProgressLevel1: (motorbikeBonus?.current_amount_usd || 0) * 2500,
        teamProgressLevel2: (carBonus?.current_amount_usd || 0) * 2500,
        totalReferrals: stats?.total_referrals || 0,
        activeReferrals: stats?.active_referrals || 0,
        pendingReferrals: stats?.pending_referrals || 0,
        referralsByCountry,
        ambassadorLimit: 856,
        currentCommissionTier: stats?.current_commission_tier || "Standard",
        nextPayoutDate: stats?.next_payout_date || "2024-02-01"
      };
    },
    enabled: true,
    refetchInterval: 30000,
  });
};
