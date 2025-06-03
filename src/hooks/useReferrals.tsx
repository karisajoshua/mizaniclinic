
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Referral } from "@/types/dashboard";

export const useReferrals = () => {
  return useQuery({
    queryKey: ['referrals'],
    queryFn: async (): Promise<Referral[]> => {
      // Check if user is logged in via localStorage (for real ambassadors)
      const currentUser = localStorage.getItem('currentUser');
      if (currentUser) {
        const userData = JSON.parse(currentUser);
        
        // For real ambassador accounts, return mock referral data based on their relationships
        if (userData.isRealAccount) {
          if (userData.ambassadorId === 'TO001DSM') {
            return [
              {
                name: 'Margareth Alex Tendwa',
                joinDate: new Date().toISOString().split('T')[0],
                location: 'Dar es Salaam',
                status: 'Active'
              },
              {
                name: 'Hussein Kyakalaba', 
                joinDate: new Date().toISOString().split('T')[0],
                location: 'Mbezi Luis',
                status: 'Active'
              }
            ];
          } else if (userData.ambassadorId === 'TO003DSM') {
            return [
              {
                name: 'Mapigano Hellon Lisso',
                joinDate: new Date().toISOString().split('T')[0], 
                location: 'Kimara Suka',
                status: 'Active'
              }
            ];
          } else {
            return [];
          }
        }
      }

      // Original Supabase logic for other authenticated users
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data: referrals, error } = await supabase
        .from('referrals')
        .select(`
          *,
          referred:profiles!referrals_referred_id_fkey(full_name, region)
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
