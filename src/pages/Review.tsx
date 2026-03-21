import { useState } from "react";
import { Calendar, Download, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useReviewData, generateMarkdown, type PeriodType } from "@/hooks/use-review-data";
import PeriodCard from "@/components/review/PeriodCard";

export default function Review() {
  const [period, setPeriod] = useState<PeriodType>("daily");
  const { data: summaries, isLoading } = useReviewData(period);

  const handleExport = () => {
    if (!summaries) return;
    const md = generateMarkdown(summaries, period);
    const blob = new Blob([md], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `复盘报告_${period}_${new Date().toISOString().slice(0, 10)}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 max-w-[1400px]">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            周期复盘
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            按时间周期汇总交易表现，导出 Markdown 报告
          </p>
        </div>
        <Button onClick={handleExport} size="sm" variant="outline" disabled={!summaries?.length}>
          <Download className="w-4 h-4 mr-1" />
          导出报告
        </Button>
      </div>

      <Tabs value={period} onValueChange={(v) => setPeriod(v as PeriodType)}>
        <TabsList>
          <TabsTrigger value="daily">每日</TabsTrigger>
          <TabsTrigger value="weekly">每周</TabsTrigger>
          <TabsTrigger value="monthly">每月</TabsTrigger>
        </TabsList>
      </Tabs>

      {isLoading ? (
        <div className="flex items-center justify-center py-20 text-muted-foreground">
          <Loader2 className="w-5 h-5 animate-spin mr-2" />
          加载中…
        </div>
      ) : !summaries?.length ? (
        <Card>
          <CardContent className="py-16 text-center text-muted-foreground">
            暂无交易数据
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {summaries.map((s) => (
            <PeriodCard key={s.label} summary={s} />
          ))}
        </div>
      )}
    </div>
  );
}
