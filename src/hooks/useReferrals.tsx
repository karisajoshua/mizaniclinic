import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Referral } from '@/types/dashboard';
import { useAuth } from '@/hooks/useAuth';

export const useReferrals = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['referrals', user?.id], enabled: Boolean(user),
    queryFn: async (): Promise<Referral[]> => {
      const { data, error } = await supabase.rpc('get_recent_referrals');
      if (error) throw error;
      return (data ?? []).map(r => ({ name: r.name, joinDate: r.join_date, location: r.location, status: r.status === 'active' ? 'Active' : 'Pending' }));
    },
  });
};
