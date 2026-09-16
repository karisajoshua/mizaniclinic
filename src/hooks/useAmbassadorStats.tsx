import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import type { AmbassadorStats } from '@/types/dashboard';

export const useAmbassadorStats = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['ambassador-stats', user?.id],
    queryFn: async (): Promise<AmbassadorStats> => {
      const { data, error } = await supabase.rpc('get_ambassador_dashboard');
      if (error) throw error;
      if (!data || typeof data !== 'object' || Array.isArray(data)) throw new Error('Dashboard data is unavailable.');
      return data as unknown as AmbassadorStats;
    },
    enabled: Boolean(user),
    refetchInterval: 30_000,
  });
};
