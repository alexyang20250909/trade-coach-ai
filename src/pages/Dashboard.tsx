import { TrendingUp, Target, BarChart3, Award } from "lucide-react";
import MetricCard from "@/components/dashboard/MetricCard";
import EquityCurve from "@/components/dashboard/EquityCurve";
import RecentTrades from "@/components/dashboard/RecentTrades";
import DisciplineGauge from "@/components/dashboard/DisciplineGauge";
import AIInsight from "@/components/dashboard/AIInsight";

export default function Dashboard() {
  return (
    <div className="space-y-6 max-w-[1400px]">
      <div>
        <h1 className="text-xl font-bold text-foreground">交易仪表盘</h1>
        <p className="text-sm text-muted-foreground mt-0.5">2026年3月 · 实时追踪交易表现与执行力</p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="本月盈亏"
          value="¥18,200"
          change="+12.3% vs 上月"
          changeType="profit"
          icon={TrendingUp}
          delay={0}
        />
        <MetricCard
          title="胜率"
          value="62.5%"
          change="+5.2% vs 上月"
          changeType="profit"
          icon={Target}
          delay={0.05}
        />
        <MetricCard
          title="R 乘数均值"
          value="+1.4R"
          change="期望值为正"
          changeType="profit"
          icon={BarChart3}
          delay={0.1}
        />
        <MetricCard
          title="纪律评分"
          value="76"
          change="-8 vs 上月"
          changeType="loss"
          icon={Award}
          delay={0.15}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <EquityCurve />
        </div>
        <DisciplineGauge />
      </div>

      {/* AI Insight */}
      <AIInsight />

      {/* Recent Trades */}
      <RecentTrades />
    </div>
  );
}
