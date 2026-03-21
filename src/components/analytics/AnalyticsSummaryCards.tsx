import type { AnalyticsSummary } from "@/hooks/use-analytics";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, Target, AlertTriangle, DollarSign } from "lucide-react";

interface Props {
  summary: AnalyticsSummary;
}

const metrics = [
  { key: "totalTrades" as const, label: "已平仓", icon: Target, format: (v: number) => `${v} 笔` },
  { key: "winRate" as const, label: "胜率", icon: TrendingUp, format: (v: number) => `${v}%` },
  { key: "avgR" as const, label: "平均R", icon: DollarSign, format: (v: number) => `${v > 0 ? "+" : ""}${v}R` },
  { key: "profitFactor" as const, label: "盈亏比", icon: TrendingUp, format: (v: number) => v === Infinity ? "∞" : `${v}` },
  { key: "maxDrawdown" as const, label: "最大回撤", icon: AlertTriangle, format: (v: number) => `¥${v}` },
  { key: "expectancy" as const, label: "期望值", icon: DollarSign, format: (v: number) => `¥${v > 0 ? "+" : ""}${v}` },
];

export default function AnalyticsSummaryCards({ summary }: Props) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      {metrics.map((m) => {
        const value = summary[m.key];
        const isPositive = m.key === "avgR" || m.key === "expectancy" ? value > 0 : m.key === "winRate" ? value >= 50 : true;
        return (
          <Card key={m.key}>
            <CardContent className="p-4">
              <div className="flex items-center gap-1.5 mb-2">
                <m.icon className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-[11px] text-muted-foreground">{m.label}</span>
              </div>
              <p className={`text-lg font-bold font-mono ${
                m.key === "maxDrawdown"
                  ? "text-[hsl(var(--loss))]"
                  : isPositive
                  ? "text-[hsl(var(--profit))]"
                  : "text-[hsl(var(--loss))]"
              }`}>
                {m.format(value)}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
