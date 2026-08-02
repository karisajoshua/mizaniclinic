import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

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
}

export const useAdminAmbassadors = () => {
  return useQuery({
    queryKey: ["admin-ambassadors"],
    queryFn: async (): Promise<AdminAmbassador[]> => {
      const [profilesRes, statsRes] = await Promise.all([
        supabase
          .from("profiles")
          .select(
            "id,full_name,phone,region,country,ambassador_id,status,created_at,registration_date,activated_at"
          )
          .order("created_at", { ascending: false }),
        supabase
          .from("ambassador_stats")
          .select(
            "user_id,total_referrals,active_referrals,total_earnings_usd,current_commission_tier"
          ),
      ]);

      if (profilesRes.error) throw profilesRes.error;
      if (statsRes.error) throw statsRes.error;

      const statsByUser = new Map(
        (statsRes.data ?? []).map((s) => [s.user_id as string, s])
      );

      return (profilesRes.data ?? []).map((p) => {
        const s = statsByUser.get(p.id);
        return {
          id: p.id,
          name: p.full_name || "Unnamed",
          ambassadorId: p.ambassador_id || "—",
          phone: p.phone || "—",
          region: p.region || "Unknown",
          country: p.country || "Unknown",
          totalReferrals: Number(s?.total_referrals ?? 0),
          activeReferrals: Number(s?.active_referrals ?? 0),
          totalEarnings: Number(s?.total_earnings_usd ?? 0),
          status: p.status || "pending",
          tier: s?.current_commission_tier || "Standard",
          joinDate: (p.registration_date || p.created_at || "").slice(0, 10),
          activatedAt: p.activated_at,
        };
      });
    },
  });
};

export const useApproveAmbassadors = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (ids: string[]) => {
      if (ids.length === 0) return 0;
      const { error } = await supabase
        .from("profiles")
        .update({ status: "active", activated_at: new Date().toISOString() })
        .in("id", ids);
      if (error) throw error;
      return ids.length;
    },
    onSuccess: (count) => {
      queryClient.invalidateQueries({ queryKey: ["admin-ambassadors"] });
      queryClient.invalidateQueries({ queryKey: ["admin-metrics"] });
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
}

export const useAdminPayouts = () => {
  return useQuery({
    queryKey: ["admin-payouts"],
    queryFn: async (): Promise<AdminPayout[]> => {
      const { data: earnings, error } = await supabase
        .from("earnings")
        .select(
          "id,user_id,amount_usd,currency,status,earning_type,earned_date,paid_date"
        )
        .order("earned_date", { ascending: false })
        .limit(500);
      if (error) throw error;

      const userIds = [
        ...new Set((earnings ?? []).map((e) => e.user_id).filter(Boolean)),
      ] as string[];

      let profileMap = new Map<string, { full_name: string | null; ambassador_id: string | null }>();
      if (userIds.length > 0) {
        const { data: profiles, error: pErr } = await supabase
          .from("profiles")
          .select("id,full_name,ambassador_id")
          .in("id", userIds);
        if (pErr) throw pErr;
        profileMap = new Map((profiles ?? []).map((p) => [p.id, p]));
      }

      return (earnings ?? []).map((e) => {
        const p = e.user_id ? profileMap.get(e.user_id) : undefined;
        return {
          id: e.id,
          ambassadorName: p?.full_name || "Unknown ambassador",
          ambassadorCode: p?.ambassador_id || "—",
          amount: Number(e.amount_usd ?? 0),
          currency: e.currency || "USD",
          status: e.status || "pending",
          type: e.earning_type || "commission",
          earnedDate: (e.earned_date || "").slice(0, 10),
          paidDate: e.paid_date ? e.paid_date.slice(0, 10) : null,
        };
      });
    },
  });
};

export const useProcessPayouts = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (ids: string[]) => {
      if (ids.length === 0) return 0;
      const { error } = await supabase
        .from("earnings")
        .update({ status: "paid", paid_date: new Date().toISOString() })
        .in("id", ids);
      if (error) throw error;
      return ids.length;
    },
    onSuccess: (count) => {
      queryClient.invalidateQueries({ queryKey: ["admin-payouts"] });
      queryClient.invalidateQueries({ queryKey: ["admin-metrics"] });
      toast({
        title: "Payouts processed",
        description: `${count} payout${count === 1 ? "" : "s"} marked as paid.`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Payout failed",
        description: error.message,
        variant: "destructive",
      });
    },
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
  return useQuery({
    queryKey: ["admin-country-stats"],
    queryFn: async (): Promise<Record<string, CountryStat>> => {
      const { data, error } = await supabase
        .from("profiles")
        .select("country,status,created_at,registration_date");
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
      queryClient.invalidateQueries({ queryKey: ["country-limits"] });
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
      queryClient.invalidateQueries({ queryKey: ["country-limits"] });
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
      queryClient.invalidateQueries({ queryKey: ["country-limits"] });
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
  const headers = Object.keys(rows[0]);
  const escape = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const csv = [
    headers.join(","),
    ...rows.map((r) => headers.map((h) => escape(r[h])).join(",")),
  ].join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};
