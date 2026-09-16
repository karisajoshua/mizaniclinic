import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useAdminReport, type AdminReport } from "@/hooks/useAdminReport";
import { useAuth } from "@/hooks/useAuth";
import { toCsv } from "@/lib/reporting";

export type AdminMetrics = AdminReport['metrics'];
export const useAdminMetrics = () => {
  const report = useAdminReport();
  return { ...report, data: report.data?.metrics };
};

// Page through complete result sets; Supabase caps an individual response.
async function readAll<T>(page: (from: number, to: number) => PromiseLike<{ data: T[] | null; error: { message: string } | null }>) {
  const data: T[] = [];
  for (let from = 0; ; from += 500) {
    const result = await page(from, from + 499);
    if (result.error) throw new Error(result.error.message);
    data.push(...(result.data ?? []));
    if ((result.data?.length ?? 0) < 500) return { data, error: null };
  }
}

/* ------------------------------------------------------------------ */
/* Ambassadors                                                         */
/* ------------------------------------------------------------------ */

export interface AdminAmbassador {
  id: string;
  name: string;
  ambassadorId: string;
  phone: string;
  region: string;
  country: string;
  totalReferrals: number;
  activeReferrals: number;
  totalEarnings: number;
  status: string;
  tier: string;
  joinDate: string;
  activatedAt: string | null;
  canApprove: boolean;
}

export const useAdminAmbassadors = () => {
  const { user, isAdmin } = useAuth();
  return useQuery({
    queryKey: ["admin-ambassadors", user?.id],
    enabled: Boolean(user && isAdmin),
    queryFn: async (): Promise<AdminAmbassador[]> => {
      const { data } = await readAll((from, to) => supabase.rpc('get_admin_ambassadors').order('id').range(from, to));
      return data.map(p => ({
        id: p.id, name: p.full_name || 'Unnamed', ambassadorId: p.ambassador_id || '—',
        phone: p.phone || '—', region: p.region || 'Unknown', country: p.country || 'Unknown',
        totalReferrals: Number(p.total_referrals), activeReferrals: Number(p.active_referrals),
        totalEarnings: Number(p.total_earnings), status: p.status || 'pending', tier: p.tier,
        joinDate: (p.joined_at || '').slice(0, 10), activatedAt: p.activated_at, canApprove: p.receipt_verified,
      }));
    },
  });
};

export const useApproveAmbassadors = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (ids: string[]) => {
      if (ids.length === 0) return 0;
      const { data, error } = await supabase.rpc('approve_verified_ambassadors', { p_ids: ids });
      if (error) throw error;
      return data;
    },
    onSuccess: (count) => {
      queryClient.invalidateQueries({ queryKey: ["admin-ambassadors"] });
      queryClient.invalidateQueries({ queryKey: ["admin-report"] });
      queryClient.invalidateQueries({ queryKey: ["admin-country-stats"] });
      toast({
        title: "Approved",
        description: `${count} ambassador${count === 1 ? "" : "s"} activated.`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Approval failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

/* ------------------------------------------------------------------ */
/* Payouts                                                             */
/* ------------------------------------------------------------------ */

export interface AdminPayout {
  id: string;
  ambassadorName: string;
  ambassadorCode: string;
  amount: number;
  currency: string;
  status: string;
  type: string;
  earnedDate: string;
  paidDate: string | null;
  reference: string | null;
}

export const useAdminPayouts = () => {
  const { user, isAdmin } = useAuth();
  return useQuery({
    queryKey: ["admin-payouts", user?.id],
    enabled: Boolean(user && isAdmin),
    queryFn: async (): Promise<AdminPayout[]> => {
      const { data: earnings, error } = await readAll((from, to) => supabase.from("earnings")
        .select("id,user_id,amount_usd,currency,status,earning_type,earned_date,paid_date,payout_reference")
        .order("earned_date", { ascending: false }).order("id").range(from, to));
      if (error) throw error;

      const { data: profiles } = await readAll((from, to) => supabase.from('profiles')
        .select('id,full_name,ambassador_id').order('id').range(from, to));
      const profileMap = new Map(profiles.map(p => [p.id, p]));

      return (earnings ?? []).map((e) => {
        const p = e.user_id ? profileMap.get(e.user_id) : undefined;
        return {
          id: e.id,
          ambassadorName: p?.full_name || "Unknown ambassador",
          ambassadorCode: p?.ambassador_id || "—",
          amount: Number(e.amount_usd ?? 0),
          currency: "USD",
          status: e.status || "pending",
          type: e.earning_type || "commission",
          earnedDate: (e.earned_date || "").slice(0, 10),
          reference: e.payout_reference,
          paidDate: e.paid_date ? e.paid_date.slice(0, 10) : null,
        };
      });
    },
  });
};

export const useProcessPayouts = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ ids, status, reference = null }: { ids: string[]; status: 'approved' | 'paid'; reference?: string | null }) => {
      if (!ids.length) return 0;
      const { data, error } = await supabase.rpc('transition_earnings', {
        p_ids: ids, p_status: status, p_reference: reference,
      });
      if (error) throw error;
      return data;
    },
    onSuccess: (count) => {
      ['admin-payouts', 'admin-report', 'admin-ambassadors', 'ambassador-stats', 'earnings-breakdown'].forEach(key =>
        queryClient.invalidateQueries({ queryKey: [key] }));
      toast({ title: 'Payout records updated', description: `${count} commission records updated.` });
    },
    onError: (error: Error) => toast({ title: 'Payout update failed', description: error.message, variant: 'destructive' }),
  });
};

/* ------------------------------------------------------------------ */
/* Geography                                                           */
/* ------------------------------------------------------------------ */

export interface CountryStat {
  country: string;
  total: number;
  active: number;
  last30Days: number;
  previous30Days: number;
  growthPercent: number;
}

export const useAdminCountryStats = () => {
  const { user, isAdmin } = useAuth();
  return useQuery({
    queryKey: ["admin-country-stats", user?.id],
    enabled: Boolean(user && isAdmin),
    queryFn: async (): Promise<Record<string, CountryStat>> => {
      const { data, error } = await readAll((from, to) => supabase.from("profiles")
        .select("country,status,created_at,registration_date").order('id').range(from, to));
      if (error) throw error;

      const now = Date.now();
      const day = 24 * 60 * 60 * 1000;
      const stats: Record<string, CountryStat> = {};

      for (const row of data ?? []) {
        const key = row.country || "Unknown";
        if (!stats[key]) {
          stats[key] = {
            country: key,
            total: 0,
            active: 0,
            last30Days: 0,
            previous30Days: 0,
            growthPercent: 0,
          };
        }
        const s = stats[key];
        s.total += 1;
        if (row.status === "active") s.active += 1;
        const joined = new Date(
          row.registration_date || row.created_at || 0
        ).getTime();
        const age = now - joined;
        if (age <= 30 * day) s.last30Days += 1;
        else if (age <= 60 * day) s.previous30Days += 1;
      }

      for (const s of Object.values(stats)) {
        s.growthPercent =
          s.previous30Days > 0
            ? Math.round(((s.last30Days - s.previous30Days) / s.previous30Days) * 100)
            : s.last30Days > 0
              ? 100
              : 0;
      }

      return stats;
    },
  });
};

export const useUpdateCountryLimit = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ code, limit }: { code: string; limit: number }) => {
      const { error } = await supabase
        .from("country_limits")
        .update({ ambassador_limit: limit, updated_at: new Date().toISOString() })
        .eq("country_code", code);
      if (error) throw error;
    },
    onSuccess: () => {
      ['country-limits', 'admin-ambassadors', 'ambassador-stats', 'admin-report'].forEach(key => queryClient.invalidateQueries({ queryKey: [key] }));
      toast({ title: "Limit updated" });
    },
    onError: (error: Error) => {
      toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useToggleCountryPremium = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ code, premium }: { code: string; premium: boolean }) => {
      const { error } = await supabase
        .from("country_limits")
        .update({ premium_unlocked: premium, updated_at: new Date().toISOString() })
        .eq("country_code", code);
      if (error) throw error;
    },
    onSuccess: () => {
      ['country-limits', 'admin-ambassadors', 'ambassador-stats', 'admin-report'].forEach(key => queryClient.invalidateQueries({ queryKey: [key] }));
      toast({ title: "Premium status updated" });
    },
    onError: (error: Error) => {
      toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useAddCountry = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: { code: string; name: string; limit: number }) => {
      const { error } = await supabase.from("country_limits").insert({
        country_code: input.code.toUpperCase(),
        country_name: input.name,
        ambassador_limit: input.limit,
        is_active: true,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      ['country-limits', 'admin-ambassadors', 'ambassador-stats', 'admin-report'].forEach(key => queryClient.invalidateQueries({ queryKey: [key] }));
      toast({ title: "Country added" });
    },
    onError: (error: Error) => {
      toast({
        title: "Could not add country",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

export const downloadCsv = (filename: string, rows: Record<string, unknown>[]) => {
  if (rows.length === 0) {
    toast({ title: "Nothing to export", variant: "destructive" });
    return;
  }
  const csv = toCsv(rows);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};
