import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Trade = Database["public"]["Tables"]["trades"]["Row"];
type TradeInsert = Database["public"]["Tables"]["trades"]["Insert"];
type TradePlan = Database["public"]["Tables"]["trade_plans"]["Row"];
type TradePlanInsert = Database["public"]["Tables"]["trade_plans"]["Insert"];
type DisciplineLog = Database["public"]["Tables"]["discipline_logs"]["Row"];
type MarketContext = Database["public"]["Tables"]["market_context"]["Row"];

export type { Trade, TradeInsert, TradePlan, TradePlanInsert, DisciplineLog, MarketContext };

export function useTrades(limit = 20) {
  return useQuery({
    queryKey: ["trades", limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("trades")
        .select("*")
        .order("opened_at", { ascending: false })
        .limit(limit);
      if (error) throw error;
      return data as Trade[];
    },
  });
}

export function useTradeStats() {
  return useQuery({
    queryKey: ["trade-stats"],
    queryFn: async () => {
      const { data: trades, error } = await supabase
        .from("trades")
        .select("pnl, pnl_percent, r_multiple, status, opened_at")
        .eq("status", "closed");
      if (error) throw error;
      if (!trades?.length) return null;

      const totalPnl = trades.reduce((s, t) => s + (Number(t.pnl) || 0), 0);
      const wins = trades.filter((t) => (Number(t.pnl) || 0) > 0).length;
      const winRate = trades.length > 0 ? (wins / trades.length) * 100 : 0;
      const avgR = trades.reduce((s, t) => s + (Number(t.r_multiple) || 0), 0) / trades.length;

      return { totalPnl, winRate, avgR, totalTrades: trades.length, wins };
    },
  });
}

export function useCreateTrade() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (trade: TradeInsert) => {
      const { data, error } = await supabase.from("trades").insert(trade).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["trades"] });
      qc.invalidateQueries({ queryKey: ["trade-stats"] });
    },
  });
}

export function useTradePlans() {
  return useQuery({
    queryKey: ["trade-plans"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("trade_plans")
        .select("*")
        .order("plan_date", { ascending: false })
        .limit(20);
      if (error) throw error;
      return data as TradePlan[];
    },
  });
}

export function useCreateTradePlan() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (plan: TradePlanInsert) => {
      const { data, error } = await supabase.from("trade_plans").insert(plan).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["trade-plans"] }),
  });
}

export function useDisciplineLogs() {
  return useQuery({
    queryKey: ["discipline-logs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("discipline_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);
      if (error) throw error;
      return data as DisciplineLog[];
    },
  });
}

export function useDisciplineScore() {
  return useQuery({
    queryKey: ["discipline-score"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("discipline_logs")
        .select("penalty_points, violation_type, severity");
      if (error) throw error;
      const totalPenalty = (data || []).reduce((s, d) => s + (d.penalty_points || 0), 0);
      const score = Math.max(0, 100 - totalPenalty);
      const violations = (data || []).reduce((acc, d) => {
        acc[d.violation_type] = (acc[d.violation_type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      return { score, violations, totalLogs: data?.length || 0 };
    },
  });
}
