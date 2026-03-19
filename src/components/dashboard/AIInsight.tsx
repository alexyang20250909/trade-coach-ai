import { motion } from "framer-motion";
import { Brain, Sparkles, ArrowRight } from "lucide-react";

export default function AIInsight() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.35 }}
      className="rounded-xl border border-primary/20 p-5 relative overflow-hidden"
      style={{ background: "linear-gradient(135deg, hsl(145 100% 45% / 0.05), hsl(220 18% 10%))" }}
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />
      <div className="flex items-center gap-2 mb-3">
        <Brain className="w-4 h-4 text-primary" />
        <h3 className="text-sm font-semibold text-foreground">AI 教练洞察</h3>
        <Sparkles className="w-3 h-3 text-primary animate-pulse-glow" />
      </div>
      
      <div className="space-y-3">
        <div className="bg-muted/50 rounded-lg p-3">
          <p className="text-xs text-muted-foreground leading-relaxed">
            📊 本周分析：你在<span className="text-warning font-medium">周二和周四</span>的交易纪律明显下滑，
            冲动开仓比例达到 <span className="text-loss font-mono font-medium">40%</span>。建议在这两天
            减少交易频次，严格执行盘前计划。
          </p>
        </div>
        <div className="bg-muted/50 rounded-lg p-3">
          <p className="text-xs text-muted-foreground leading-relaxed">
            🎯 策略反馈：<span className="text-profit font-medium">均线突破策略</span>在近 30 天的胜率为 
            <span className="text-profit font-mono font-medium">67%</span>，R 乘数均值 
            <span className="text-profit font-mono font-medium">+1.8R</span>，表现优异。
            建议增加该策略仓位比例。
          </p>
        </div>
      </div>

      <button className="mt-3 flex items-center gap-1 text-xs text-primary hover:underline font-medium">
        开始 AI 对话 <ArrowRight className="w-3 h-3" />
      </button>
    </motion.div>
  );
}
