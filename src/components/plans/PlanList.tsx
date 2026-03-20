import { useTradePlans } from "@/hooks/use-trading-data";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Target, Loader2, ArrowUpRight, ArrowDownRight } from "lucide-react";

const statusMap: Record<string, { label: string; variant: "default" | "secondary" | "outline" | "destructive" }> = {
  pending: { label: "待执行", variant: "outline" },
  executed: { label: "已执行", variant: "default" },
  skipped: { label: "已跳过", variant: "secondary" },
  expired: { label: "已过期", variant: "destructive" },
};

export default function PlanList() {
  const { data: plans, isLoading } = useTradePlans();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20 text-muted-foreground">
        <Loader2 className="w-5 h-5 animate-spin mr-2" />
        加载中…
      </div>
    );
  }

  if (!plans?.length) {
    return (
      <Card>
        <CardContent className="py-16 text-center text-muted-foreground">
          暂无推演计划，点击右上角「新建计划」开始规划
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-2">
      {plans.map((p) => {
        const s = statusMap[p.status] || statusMap.pending;
        const riskReward =
          p.take_profit != null
            ? (
                Math.abs(Number(p.take_profit) - Number(p.planned_entry)) /
                Math.abs(Number(p.planned_entry) - Number(p.stop_loss))
              ).toFixed(1)
            : null;

        return (
          <Card key={p.id} className="hover:border-primary/30 transition-colors">
            <CardContent className="p-4 flex items-center gap-4">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                p.direction === "long" ? "bg-[hsl(var(--profit))]/10" : "bg-[hsl(var(--loss))]/10"
              }`}>
                {p.direction === "long" ? (
                  <ArrowUpRight className="w-4 h-4 text-[hsl(var(--profit))]" />
                ) : (
                  <ArrowDownRight className="w-4 h-4 text-[hsl(var(--loss))]" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-foreground text-sm">{p.symbol}</span>
                  <span className="text-xs text-muted-foreground">{p.name}</span>
                  <Badge variant={s.variant} className="text-[10px] px-1.5 py-0">{s.label}</Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {format(new Date(p.plan_date), "MM/dd")} · 入场 {Number(p.planned_entry).toFixed(2)} · 止损 {Number(p.stop_loss).toFixed(2)}
                  {p.take_profit != null && ` · 目标 ${Number(p.take_profit).toFixed(2)}`}
                </p>
              </div>

              <div className="text-right flex-shrink-0 space-y-0.5">
                {riskReward && (
                  <p className="text-sm font-semibold text-[hsl(var(--info))]">{riskReward}R</p>
                )}
                {p.position_size != null && (
                  <p className="text-[11px] text-muted-foreground">{Number(p.position_size)}手</p>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
