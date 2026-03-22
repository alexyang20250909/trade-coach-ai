import { motion } from "framer-motion";
import { Brain, Sparkles, ArrowRight, Loader2 } from "lucide-react";
import { useTradeStats, useDisciplineScore } from "@/hooks/use-trading-data";
import { useNavigate } from "react-router-dom";

export default function AIInsight() {
  const { data: stats, isLoading: statsLoading } = useTradeStats();
  const { data: discipline, isLoading: discLoading } = useDisciplineScore();
  const navigate = useNavigate();

  const isLoading = statsLoading || discLoading;

  const insights: string[] = [];
  if (stats) {
    if (stats.winRate < 50) {
      insights.push(`📊 当前胜率 ${stats.winRate.toFixed(1)}%，低于50%警戒线。建议减少交易频次，专注高确定性机会。`);
    } else {
      insights.push(`📊 当前胜率 ${stats.winRate.toFixed(1)}%，共 ${stats.totalTrades} 笔交易，${stats.wins} 胜。保持当前策略节奏。`);
    }
    if (stats.avgR < 0) {
      insights.push(`⚠️ R乘数均值 ${stats.avgR.toFixed(2)}R，期望值为负。建议检查止损设置和持仓时间。`);
    } else if (stats.avgR > 1) {
      insights.push(`🎯 R乘数均值 +${stats.avgR.toFixed(2)}R，表现优异。继续保持当前风险管理策略。`);
    }
  }
  if (discipline) {
    const topViolation = Object.entries(discipline.violations).sort((a, b) => b[1] - a[1])[0];
    if (topViolation) {
      insights.push(`🚨 最频繁违规：「${topViolation[0]}」共 ${topViolation[1]} 次，纪律评分 ${discipline.score}/100。`);
    }
  }

  if (!insights.length && !isLoading) {
    insights.push("📝 暂无交易数据，录入交易后将自动生成 AI 洞察分析。");
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.35 }}
      className="rounded-xl border border-primary/20 p-5 relative overflow-hidden"
      style={{ background: "linear-gradient(135deg, hsl(var(--primary) / 0.05), hsl(var(--background)))" }}
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />
      <div className="flex items-center gap-2 mb-3">
        <Brain className="w-4 h-4 text-primary" />
        <h3 className="text-sm font-semibold text-foreground">AI 教练洞察</h3>
        <Sparkles className="w-3 h-3 text-primary animate-pulse-glow" />
      </div>

      {isLoading ? (
        <div className="flex items-center gap-2 py-4">
          <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
          <span className="text-xs text-muted-foreground">分析中…</span>
        </div>
      ) : (
        <div className="space-y-3">
          {insights.map((text, i) => (
            <div key={i} className="bg-muted/50 rounded-lg p-3">
              <p className="text-xs text-muted-foreground leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={() => navigate("/ai-coach")}
        className="mt-3 flex items-center gap-1 text-xs text-primary hover:underline font-medium"
      >
        开始 AI 对话 <ArrowRight className="w-3 h-3" />
      </button>
    </motion.div>
  );
}
