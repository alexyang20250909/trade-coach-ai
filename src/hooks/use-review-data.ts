import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Trade } from "@/hooks/use-trading-data";
import {
  startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth,
  format, subDays, subWeeks, subMonths, isWithinInterval,
} from "date-fns";

export type PeriodType = "daily" | "weekly" | "monthly";

export interface PeriodSummary {
  label: string;
  start: Date;
  end: Date;
  trades: Trade[];
  totalPnl: number;
  winRate: number;
  avgR: number;
  wins: number;
  losses: number;
  maxWin: number;
  maxLoss: number;
}

function buildPeriods(type: PeriodType, count: number): { label: string; start: Date; end: Date }[] {
  const now = new Date();
  const periods: { label: string; start: Date; end: Date }[] = [];
  for (let i = 0; i < count; i++) {
    let start: Date, end: Date, label: string;
    if (type === "daily") {
      const d = subDays(now, i);
      start = startOfDay(d);
      end = endOfDay(d);
      label = format(d, "yyyy-MM-dd");
    } else if (type === "weekly") {
      const d = subWeeks(now, i);
      start = startOfWeek(d, { weekStartsOn: 1 });
      end = endOfWeek(d, { weekStartsOn: 1 });
      label = `${format(start, "MM/dd")} ~ ${format(end, "MM/dd")}`;
    } else {
      const d = subMonths(now, i);
      start = startOfMonth(d);
      end = endOfMonth(d);
      label = format(d, "yyyy年MM月");
    }
    periods.push({ label, start, end });
  }
  return periods;
}

function summarize(trades: Trade[], periods: { label: string; start: Date; end: Date }[]): PeriodSummary[] {
  return periods.map(({ label, start, end }) => {
    const filtered = trades.filter((t) => {
      const d = new Date(t.closed_at || t.opened_at);
      return isWithinInterval(d, { start, end });
    });
    const pnls = filtered.map((t) => Number(t.pnl) || 0);
    const rValues = filtered.map((t) => Number(t.r_multiple) || 0);
    const wins = pnls.filter((p) => p > 0).length;
    return {
      label,
      start,
      end,
      trades: filtered,
      totalPnl: pnls.reduce((s, p) => s + p, 0),
      winRate: filtered.length > 0 ? Math.round((wins / filtered.length) * 100) : 0,
      avgR: rValues.length > 0 ? Math.round((rValues.reduce((s, r) => s + r, 0) / rValues.length) * 100) / 100 : 0,
      wins,
      losses: filtered.length - wins,
      maxWin: pnls.length ? Math.max(...pnls, 0) : 0,
      maxLoss: pnls.length ? Math.min(...pnls, 0) : 0,
    };
  });
}

export function useReviewData(type: PeriodType) {
  const count = type === "daily" ? 14 : type === "weekly" ? 8 : 6;
  return useQuery({
    queryKey: ["review", type],
    queryFn: async () => {
      const periods = buildPeriods(type, count);
      const earliest = periods[periods.length - 1].start;
      const { data, error } = await supabase
        .from("trades")
        .select("*")
        .gte("opened_at", earliest.toISOString())
        .order("opened_at", { ascending: false });
      if (error) throw error;
      return summarize(data as Trade[], periods);
    },
  });
}

export function generateMarkdown(summaries: PeriodSummary[], type: PeriodType): string {
  const typeLabel = type === "daily" ? "每日" : type === "weekly" ? "每周" : "每月";
  const lines: string[] = [
    `# ${typeLabel}交易复盘报告`,
    `> 生成时间: ${format(new Date(), "yyyy-MM-dd HH:mm")}`,
    "",
  ];

  for (const s of summaries) {
    if (s.trades.length === 0) continue;
    lines.push(`## ${s.label}`);
    lines.push("");
    lines.push(`| 指标 | 数值 |`);
    lines.push(`| --- | --- |`);
    lines.push(`| 交易笔数 | ${s.trades.length} |`);
    lines.push(`| 胜率 | ${s.winRate}% (${s.wins}胜 ${s.losses}负) |`);
    lines.push(`| 总盈亏 | ¥${s.totalPnl > 0 ? "+" : ""}${s.totalPnl.toFixed(2)} |`);
    lines.push(`| 平均R | ${s.avgR > 0 ? "+" : ""}${s.avgR}R |`);
    lines.push(`| 最大单笔盈利 | ¥${s.maxWin.toFixed(2)} |`);
    lines.push(`| 最大单笔亏损 | ¥${s.maxLoss.toFixed(2)} |`);
    lines.push("");

    lines.push(`### 交易明细`);
    lines.push("");
    lines.push(`| 标的 | 方向 | 入场 | 出场 | 盈亏 | R |`);
    lines.push(`| --- | --- | --- | --- | --- | --- |`);
    for (const t of s.trades) {
      const pnl = Number(t.pnl) || 0;
      lines.push(
        `| ${t.symbol} ${t.name} | ${t.direction === "long" ? "多" : "空"} | ${t.entry_price} | ${t.exit_price ?? "-"} | ${pnl > 0 ? "+" : ""}${pnl.toFixed(2)} | ${Number(t.r_multiple || 0).toFixed(1)}R |`
      );
    }
    lines.push("");
  }

  if (summaries.every((s) => s.trades.length === 0)) {
    lines.push("*该周期内无交易记录*");
  }

  return lines.join("\n");
}
