import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface AdminReport {
  metrics: {
    totalUsers: number; activeUsers: number; pendingUsers: number;
    totalRevenueUsd: number; pendingPayoutsUsd: number; pendingPayoutCount: number;
    approvedPayoutsUsd: number; approvedPayoutCount: number; paidThisMonthUsd: number; paidThisMonthCount: number;
    activationRevenueUsd: number; salesRevenueUsd: number; appointmentRevenueUsd: number;
    activationRevenueEstimated: number;
  };
  monthly: { month: string; ambassadors: number; earnings: number; paid: number }[];
  countries: { name: string; value: number }[];
  earningsBreakdown: { type: string; amount: number }[];
  topPerformers: { name: string; region: string; referrals: number; earnings: number }[];
}

export function useAdminReport(months = 6) {
  const { user, isAdmin } = useAuth();
  return useQuery({
    queryKey: ['admin-report', user?.id, months],
    enabled: Boolean(user && isAdmin),
    queryFn: async (): Promise<AdminReport> => {
      const { data, error } = await supabase.rpc('get_admin_report', { p_months: months });
      if (error) throw error;
      if (!data || typeof data !== 'object' || Array.isArray(data)) throw new Error('Report unavailable');
      return data as unknown as AdminReport;
    },
    refetchInterval: 30_000,
  });
}
