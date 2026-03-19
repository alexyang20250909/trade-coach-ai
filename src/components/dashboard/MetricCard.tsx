import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string;
  change?: string;
  changeType?: "profit" | "loss" | "neutral";
  icon: LucideIcon;
  delay?: number;
}

export default function MetricCard({ title, value, change, changeType = "neutral", icon: Icon, delay = 0 }: MetricCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="gradient-card rounded-xl border border-border p-5 relative overflow-hidden group hover:border-primary/20 transition-colors"
    >
      <div className={`absolute top-0 right-0 w-24 h-24 rounded-full blur-3xl opacity-10 ${
        changeType === "profit" ? "bg-profit" : changeType === "loss" ? "bg-loss" : "bg-info"
      }`} />
      <div className="flex items-start justify-between mb-3">
        <p className="text-muted-foreground text-xs font-medium uppercase tracking-wider">{title}</p>
        <div className={`p-2 rounded-lg ${
          changeType === "profit" ? "bg-profit/10" : changeType === "loss" ? "bg-loss/10" : "bg-info/10"
        }`}>
          <Icon className={`w-4 h-4 ${
            changeType === "profit" ? "text-profit" : changeType === "loss" ? "text-loss" : "text-info"
          }`} />
        </div>
      </div>
      <p className="text-2xl font-bold font-mono text-foreground tracking-tight">{value}</p>
      {change && (
        <p className={`text-xs font-mono mt-1 ${
          changeType === "profit" ? "text-profit" : changeType === "loss" ? "text-loss" : "text-muted-foreground"
        }`}>
          {change}
        </p>
      )}
    </motion.div>
  );
}
