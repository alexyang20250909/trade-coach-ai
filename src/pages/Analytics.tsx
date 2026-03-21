import { BarChart3, Loader2 } from "lucide-react";
import { useAnalytics } from "@/hooks/use-analytics";
import { Card, CardContent } from "@/components/ui/card";
import EquityCurveChart from "@/components/analytics/EquityCurveChart";
import WinRateChart from "@/components/analytics/WinRateChart";
import RMultipleChart from "@/components/analytics/RMultipleChart";
import AnalyticsSummaryCards from "@/components/analytics/AnalyticsSummaryCards";

export default function Analytics() {
  const { data, isLoading } = useAnalytics();

  return (
    <div className="space-y-6 max-w-[1400px]">
      <div>
        <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-primary" />
          数据分析
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          深度剖析交易绩效，发现策略优势与弱点
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20 text-muted-foreground">
          <Loader2 className="w-5 h-5 animate-spin mr-2" />
          加载中…
        </div>
      ) : !data ? (
        <Card>
          <CardContent className="py-16 text-center text-muted-foreground">
            暂无已平仓交易数据，请先录入并关闭一些交易
          </CardContent>
        </Card>
      ) : (
        <>
          <AnalyticsSummaryCards summary={data.summary} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <EquityCurveChart data={data.equityCurve} />
            <WinRateChart data={data.winRateTrend} />
          </div>
          <RMultipleChart data={data.rDistribution} />
        </>
      )}
    </div>
  );
}
