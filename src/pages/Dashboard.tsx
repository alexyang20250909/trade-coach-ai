import { TrendingUp, Target, BarChart3, Award } from "lucide-react";
import MetricCard from "@/components/dashboard/MetricCard";
import EquityCurve from "@/components/dashboard/EquityCurve";
import RecentTrades from "@/components/dashboard/RecentTrades";
import DisciplineGauge from "@/components/dashboard/DisciplineGauge";
import AIInsight from "@/components/dashboard/AIInsight";
import { useTradeStats } from "@/hooks/use-trading-data";

export default function Dashboard() {
  const { data: stats } = useTradeStats();

  return (
    <div className="space-y-6 max-w-[1400px]">
      <div>
        <h1 className="text-xl font-bold text-foreground">交易仪表盘</h1>
        <p className="text-sm text-muted-foreground mt-0.5">2026年3月 · 实时追踪交易表现与执行力</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        <MetricCard
          title="本月盈亏"
          value={stats ? `¥${stats.totalPnl.toLocaleString()}` : "¥0"}
          change={stats ? `${stats.totalTrades} 笔交易` : "暂无数据"}
          changeType={stats && stats.totalPnl >= 0 ? "profit" : "loss"}
          icon={TrendingUp}
          delay={0}
        />
        <MetricCard
          title="胜率"
          value={stats ? `${stats.winRate.toFixed(1)}%` : "0%"}
          change={stats ? `${stats.wins}/${stats.totalTrades} 胜` : "暂无数据"}
          changeType={stats && stats.winRate >= 50 ? "profit" : "loss"}
          icon={Target}
          delay={0.05}
        />
        <MetricCard
          title="R 乘数均值"
          value={stats ? `${stats.avgR >= 0 ? "+" : ""}${stats.avgR.toFixed(1)}R` : "0R"}
          change={stats && stats.avgR > 0 ? "期望值为正" : "暂无数据"}
          changeType={stats && stats.avgR > 0 ? "profit" : "neutral"}
          icon={BarChart3}
          delay={0.1}
        />
        <MetricCard
          title="纪律评分"
          value="--"
          change="登录后显示"
          changeType="neutral"
          icon={Award}
          delay={0.15}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <EquityCurve />
        </div>
        <DisciplineGauge />
      </div>

      <AIInsight />
      <RecentTrades />
    </div>
  );
}
