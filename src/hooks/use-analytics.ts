import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Trade } from "@/hooks/use-trading-data";

export interface EquityPoint {
  date: string;
  equity: number;
  pnl: number;
}

export interface WinRatePoint {
  date: string;
  winRate: number;
  trades: number;
}

export interface RMultipleBucket {
  range: string;
  count: number;
}

export interface AnalyticsSummary {
  totalTrades: number;
  winRate: number;
  avgR: number;
  maxDrawdown: number;
  profitFactor: number;
  expectancy: number;
}

function computeAnalytics(trades: Trade[]) {
  // Sort by closed_at ascending
  const closed = trades
    .filter((t) => t.status === "closed" && t.closed_at)
    .sort((a, b) => new Date(a.closed_at!).getTime() - new Date(b.closed_at!).getTime());

  if (!closed.length) return null;

  // Equity curve
  let cumPnl = 0;
  const equityCurve: EquityPoint[] = closed.map((t) => {
    const pnl = Number(t.pnl) || 0;
    cumPnl += pnl;
    return {
      date: new Date(t.closed_at!).toLocaleDateString("zh-CN", { month: "2-digit", day: "2-digit" }),
      equity: Math.round(cumPnl * 100) / 100,
      pnl: Math.round(pnl * 100) / 100,
    };
  });

  // Rolling win rate (window of 10)
  const winRateTrend: WinRatePoint[] = [];
  for (let i = 0; i < closed.length; i++) {
    const windowStart = Math.max(0, i - 9);
    const window = closed.slice(windowStart, i + 1);
    const wins = window.filter((t) => (Number(t.pnl) || 0) > 0).length;
    winRateTrend.push({
      date: new Date(closed[i].closed_at!).toLocaleDateString("zh-CN", { month: "2-digit", day: "2-digit" }),
      winRate: Math.round((wins / window.length) * 100),
      trades: window.length,
    });
  }

  // R-multiple distribution
  const rValues = closed.map((t) => Number(t.r_multiple) || 0);
  const buckets: RMultipleBucket[] = [
    { range: "< -2R", count: rValues.filter((r) => r < -2).length },
    { range: "-2~-1R", count: rValues.filter((r) => r >= -2 && r < -1).length },
    { range: "-1~0R", count: rValues.filter((r) => r >= -1 && r < 0).length },
    { range: "0~1R", count: rValues.filter((r) => r >= 0 && r < 1).length },
    { range: "1~2R", count: rValues.filter((r) => r >= 1 && r < 2).length },
    { range: "2~3R", count: rValues.filter((r) => r >= 2 && r < 3).length },
    { range: "> 3R", count: rValues.filter((r) => r >= 3).length },
  ];

  // Summary stats
  const wins = closed.filter((t) => (Number(t.pnl) || 0) > 0);
  const losses = closed.filter((t) => (Number(t.pnl) || 0) <= 0);
  const grossProfit = wins.reduce((s, t) => s + (Number(t.pnl) || 0), 0);
  const grossLoss = Math.abs(losses.reduce((s, t) => s + (Number(t.pnl) || 0), 0));
  const avgR = rValues.reduce((s, r) => s + r, 0) / rValues.length;

  // Max drawdown
  let peak = 0;
  let maxDd = 0;
  let cum = 0;
  for (const t of closed) {
    cum += Number(t.pnl) || 0;
    if (cum > peak) peak = cum;
    const dd = peak - cum;
    if (dd > maxDd) maxDd = dd;
  }

  const summary: AnalyticsSummary = {
    totalTrades: closed.length,
    winRate: Math.round((wins.length / closed.length) * 100),
    avgR: Math.round(avgR * 100) / 100,
    maxDrawdown: Math.round(maxDd * 100) / 100,
    profitFactor: grossLoss > 0 ? Math.round((grossProfit / grossLoss) * 100) / 100 : grossProfit > 0 ? Infinity : 0,
    expectancy: Math.round((grossProfit - grossLoss) / closed.length * 100) / 100,
  };

  return { equityCurve, winRateTrend, rDistribution: buckets, summary };
}

export function useAnalytics() {
  return useQuery({
    queryKey: ["analytics"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("trades")
        .select("*")
        .eq("status", "closed")
        .order("closed_at", { ascending: true });
      if (error) throw error;
      return computeAnalytics(data as Trade[]);
    },
  });
}
