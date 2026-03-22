import { motion } from "framer-motion";
import { Shield, AlertTriangle, TrendingDown, Loader2 } from "lucide-react";
import { useDisciplineScore } from "@/hooks/use-trading-data";

export default function DisciplineGauge() {
  const { data, isLoading } = useDisciplineScore();

  const score = data?.score ?? 100;
  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 85 ? "text-[hsl(var(--profit))]" : score >= 70 ? "text-warning" : "text-[hsl(var(--loss))]";
  const strokeColor = score >= 85 ? "hsl(var(--profit))" : score >= 70 ? "hsl(var(--warning))" : "hsl(var(--loss))";

  const violations = Object.entries(data?.violations ?? {})
    .map(([type, count]) => ({
      type,
      count: count as number,
      severity: (type === "冲动开仓" || type === "未执行盘前计划") ? "high" as const : "medium" as const,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 4);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.25 }}
      className="gradient-card rounded-xl border border-border p-5"
    >
      <div className="flex items-center gap-2 mb-4">
        <Shield className="w-4 h-4 text-warning" />
        <h3 className="text-sm font-semibold text-foreground">纪律评分</h3>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="flex items-center gap-6">
          <div className="relative w-28 h-28 flex-shrink-0">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="none" stroke="hsl(var(--muted))" strokeWidth="6" />
              <motion.circle
                cx="50" cy="50" r="45" fill="none"
                stroke={strokeColor}
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset: offset }}
                transition={{ duration: 1.2, ease: "easeOut", delay: 0.5 }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-2xl font-bold font-mono ${color}`}>{score}</span>
              <span className="text-[10px] text-muted-foreground">/ 100</span>
            </div>
          </div>

          <div className="flex-1 space-y-2">
            {violations.length === 0 ? (
              <p className="text-xs text-muted-foreground">暂无违规记录 🎉</p>
            ) : (
              violations.map((v) => (
                <div key={v.type} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    {v.severity === "high" ? (
                      <AlertTriangle className="w-3 h-3 text-[hsl(var(--loss))]" />
                    ) : (
                      <TrendingDown className="w-3 h-3 text-warning" />
                    )}
                    <span className="text-muted-foreground">{v.type}</span>
                  </div>
                  <span className={`font-mono font-medium ${
                    v.severity === "high" ? "text-[hsl(var(--loss))]" : "text-warning"
                  }`}>
                    ×{v.count}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
}
