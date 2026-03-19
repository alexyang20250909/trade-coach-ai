import { motion } from "framer-motion";
import { Shield, AlertTriangle, TrendingDown } from "lucide-react";

const violations = [
  { type: "冲动开仓", count: 2, severity: "high" as const },
  { type: "扛单（拓宽止损）", count: 1, severity: "medium" as const },
  { type: "未执行盘前计划", count: 3, severity: "high" as const },
];

export default function DisciplineGauge() {
  const score = 76;
  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 85 ? "text-profit" : score >= 70 ? "text-warning" : "text-loss";
  const strokeColor = score >= 85 ? "hsl(145,100%,45%)" : score >= 70 ? "hsl(38,92%,50%)" : "hsl(0,85%,60%)";

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

      <div className="flex items-center gap-6">
        {/* Gauge */}
        <div className="relative w-28 h-28 flex-shrink-0">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="none" stroke="hsl(220,14%,16%)" strokeWidth="6" />
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

        {/* Violations */}
        <div className="flex-1 space-y-2">
          {violations.map((v) => (
            <div key={v.type} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                {v.severity === "high" ? (
                  <AlertTriangle className="w-3 h-3 text-loss" />
                ) : (
                  <TrendingDown className="w-3 h-3 text-warning" />
                )}
                <span className="text-muted-foreground">{v.type}</span>
              </div>
              <span className={`font-mono font-medium ${
                v.severity === "high" ? "text-loss" : "text-warning"
              }`}>
                ×{v.count}
              </span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
