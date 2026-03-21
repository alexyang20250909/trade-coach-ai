import { useDisciplineScore } from "@/hooks/use-trading-data";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, Loader2 } from "lucide-react";

const severityMap: Record<string, { label: string; color: string }> = {
  "冲动开仓": { label: "冲动开仓", color: "bg-[hsl(var(--loss))]" },
  "偏离计划入场": { label: "偏离计划入场", color: "bg-warning" },
  "扛单（拓宽止损）": { label: "扛单", color: "bg-[hsl(var(--loss))]" },
  "未执行盘前计划": { label: "未执行计划", color: "bg-warning" },
};

export default function ViolationBreakdown() {
  const { data, isLoading } = useDisciplineScore();

  const entries = Object.entries(data?.violations ?? {}).sort((a, b) => b[1] - a[1]);
  const maxCount = entries.length ? Math.max(...entries.map(([, c]) => c)) : 1;

  return (
    <Card className="lg:col-span-2">
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="w-4 h-4 text-warning" />
          <h3 className="text-sm font-semibold text-foreground">违规类型分布</h3>
        </div>
        {isLoading ? (
          <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
        ) : entries.length === 0 ? (
          <p className="text-sm text-muted-foreground py-8 text-center">暂无违规记录，继续保持 🎉</p>
        ) : (
          <div className="space-y-3">
            {entries.map(([type, count]) => {
              const info = severityMap[type] || { label: type, color: "bg-muted-foreground" };
              return (
                <div key={type} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">{info.label}</span>
                    <span className="font-mono font-medium text-foreground">×{count}</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className={`h-full rounded-full ${info.color} transition-all`}
                      style={{ width: `${(count / maxCount) * 100}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
