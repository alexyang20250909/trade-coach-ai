import { motion } from "framer-motion";
import { ChevronDown, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { PeriodSummary } from "@/hooks/use-review-data";

interface Props {
  summary: PeriodSummary;
}

export default function PeriodCard({ summary: s }: Props) {
  const [expanded, setExpanded] = useState(false);
  const hasTrades = s.trades.length > 0;
  const isProfit = s.totalPnl > 0;
  const isFlat = s.totalPnl === 0;

  return (
    <Card
      className={`transition-colors ${!hasTrades ? "opacity-50" : "hover:border-primary/30 cursor-pointer"}`}
      onClick={() => hasTrades && setExpanded(!expanded)}
    >
      <CardContent className="p-4">
        {/* Header row */}
        <div className="flex items-center gap-4">
          <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
            !hasTrades ? "bg-muted" : isProfit ? "bg-[hsl(var(--profit))]/10" : isFlat ? "bg-muted" : "bg-[hsl(var(--loss))]/10"
          }`}>
            {!hasTrades || isFlat ? (
              <Minus className="w-4 h-4 text-muted-foreground" />
            ) : isProfit ? (
              <TrendingUp className="w-4 h-4 text-[hsl(var(--profit))]" />
            ) : (
              <TrendingDown className="w-4 h-4 text-[hsl(var(--loss))]" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm text-foreground">{s.label}</span>
              {hasTrades && (
                <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                  {s.trades.length} 笔
                </Badge>
              )}
            </div>
            {hasTrades && (
              <p className="text-xs text-muted-foreground mt-0.5">
                胜率 {s.winRate}% · 平均R {s.avgR > 0 ? "+" : ""}{s.avgR} · {s.wins}胜{s.losses}负
              </p>
            )}
          </div>

          <div className="text-right flex-shrink-0">
            {hasTrades ? (
              <p className={`text-sm font-bold font-mono ${
                isProfit ? "text-[hsl(var(--profit))]" : isFlat ? "text-muted-foreground" : "text-[hsl(var(--loss))]"
              }`}>
                {isProfit ? "+" : ""}{s.totalPnl.toFixed(2)}
              </p>
            ) : (
              <p className="text-xs text-muted-foreground">无交易</p>
            )}
          </div>

          {hasTrades && (
            <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${expanded ? "rotate-180" : ""}`} />
          )}
        </div>

        {/* Expanded detail */}
        {expanded && hasTrades && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="mt-4 overflow-hidden"
          >
            {/* Stats row */}
            <div className="grid grid-cols-4 gap-3 mb-4">
              {[
                { label: "最大盈利", value: `¥${s.maxWin.toFixed(2)}`, color: "text-[hsl(var(--profit))]" },
                { label: "最大亏损", value: `¥${s.maxLoss.toFixed(2)}`, color: "text-[hsl(var(--loss))]" },
                { label: "胜率", value: `${s.winRate}%`, color: s.winRate >= 50 ? "text-[hsl(var(--profit))]" : "text-[hsl(var(--loss))]" },
                { label: "平均R", value: `${s.avgR}R`, color: s.avgR >= 0 ? "text-[hsl(var(--profit))]" : "text-[hsl(var(--loss))]" },
              ].map((m) => (
                <div key={m.label} className="bg-muted/50 rounded-lg p-2.5 text-center">
                  <p className="text-[10px] text-muted-foreground mb-1">{m.label}</p>
                  <p className={`text-sm font-bold font-mono ${m.color}`}>{m.value}</p>
                </div>
              ))}
            </div>

            {/* Trade list */}
            <div className="border-t border-border pt-3 space-y-1.5">
              {s.trades.map((t) => {
                const pnl = Number(t.pnl) || 0;
                return (
                  <div key={t.id} className="flex items-center justify-between text-xs px-1">
                    <div className="flex items-center gap-2">
                      <span className={`w-1.5 h-1.5 rounded-full ${t.direction === "long" ? "bg-[hsl(var(--profit))]" : "bg-[hsl(var(--loss))]"}`} />
                      <span className="text-foreground font-medium">{t.symbol}</span>
                      <span className="text-muted-foreground">{t.name}</span>
                      <span className="text-muted-foreground">
                        {t.entry_price}{t.exit_price ? ` → ${t.exit_price}` : ""}
                      </span>
                    </div>
                    <span className={`font-mono font-medium ${pnl > 0 ? "text-[hsl(var(--profit))]" : pnl < 0 ? "text-[hsl(var(--loss))]" : "text-muted-foreground"}`}>
                      {pnl > 0 ? "+" : ""}{pnl.toFixed(2)}
                    </span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}
