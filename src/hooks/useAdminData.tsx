import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface AdminMetrics {
  totalUsers: number;
  activeUsers: number;
  pendingUsers: number;
  totalRevenueUsd: number;
  pendingPayoutsUsd: number;
  pendingPayoutCount: number;
  paidThisMonthUsd: number;
  paidThisMonthCount: number;
}

export const useAdminMetrics = () => {
  return useQuery({
    queryKey: ["admin-metrics"],
    queryFn: async (): Promise<AdminMetrics> => {
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const [profilesRes, earningsRes] = await Promise.all([
        supabase.from("profiles").select("id,status"),
        supabase.from("earnings").select("amount_usd,status,paid_date"),
      ]);

      if (profilesRes.error) throw profilesRes.error;
      if (earningsRes.error) throw earningsRes.error;

      const profiles = profilesRes.data ?? [];
      const earnings = earningsRes.data ?? [];

      const sum = (rows: typeof earnings) =>
        rows.reduce((acc, e) => acc + Number(e.amount_usd ?? 0), 0);

      const pending = earnings.filter((e) => e.status === "pending");
      const paid = earnings.filter((e) => e.status === "paid");
      const paidThisMonth = paid.filter(
        (e) => e.paid_date && new Date(e.paid_date) >= startOfMonth
      );

      return {
        totalUsers: profiles.length,
        activeUsers: profiles.filter((p) => p.status === "active").length,
        pendingUsers: profiles.filter((p) => p.status !== "active").length,
        totalRevenueUsd: sum(paid),
        pendingPayoutsUsd: sum(pending),
        pendingPayoutCount: pending.length,
        paidThisMonthUsd: sum(paidThisMonth),
        paidThisMonthCount: paidThisMonth.length,
      };
    },
  });
};
