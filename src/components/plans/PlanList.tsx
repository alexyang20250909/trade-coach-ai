import { useState } from "react";
import { useTradePlans, useDeleteTradePlan } from "@/hooks/use-trading-data";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { format } from "date-fns";
import { Target, Loader2, ArrowUpRight, ArrowDownRight, ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const statusMap: Record<string, { label: string; variant: "default" | "secondary" | "outline" | "destructive" }> = {
  pending: { label: "待执行", variant: "outline" },
  executed: { label: "已执行", variant: "default" },
  skipped: { label: "已跳过", variant: "secondary" },
  expired: { label: "已过期", variant: "destructive" },
};

export default function PlanList() {
  const { data: plans, isLoading } = useTradePlans();
  const deletePlan = useDeleteTradePlan();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

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

  function handleDelete() {
    if (!deleteId) return;
    deletePlan.mutate(deleteId, {
      onSuccess: () => {
        toast({ title: "计划已删除" });
        setDeleteId(null);
      },
      onError: (err) => {
        toast({ title: "删除失败", description: err.message, variant: "destructive" });
      },
    });
  }

  return (
    <>
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
          const isExpanded = expandedId === p.id;

          return (
            <Card key={p.id} className="hover:border-primary/30 transition-colors">
              <CardContent className="p-4">
                <div
                  className="flex items-center gap-4 cursor-pointer"
                  onClick={() => setExpandedId(isExpanded ? null : p.id)}
                >
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

                  <div className="text-right flex-shrink-0 flex items-center gap-3">
                    <div className="space-y-0.5">
                      {riskReward && (
                        <p className="text-sm font-semibold text-[hsl(var(--info))]">{riskReward}R</p>
                      )}
                      {p.position_size != null && (
                        <p className="text-[11px] text-muted-foreground">{Number(p.position_size)}手</p>
                      )}
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-muted-foreground" />
                    )}
                  </div>
                </div>

                {isExpanded && (
                  <div className="mt-4 pt-3 border-t border-border space-y-3">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                      <div>
                        <span className="text-muted-foreground">方向</span>
                        <p className="font-medium text-foreground">{p.direction === "long" ? "做多" : "做空"}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">计划入场</span>
                        <p className="font-mono font-medium text-foreground">{Number(p.planned_entry).toFixed(2)}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">止损位</span>
                        <p className="font-mono font-medium text-[hsl(var(--loss))]">{Number(p.stop_loss).toFixed(2)}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">目标位</span>
                        <p className="font-mono font-medium text-[hsl(var(--profit))]">
                          {p.take_profit != null ? Number(p.take_profit).toFixed(2) : "--"}
                        </p>
                      </div>
                    </div>
                    {p.rationale && (
                      <div className="text-xs">
                        <span className="text-muted-foreground">交易逻辑：</span>
                        <p className="text-foreground mt-0.5">{p.rationale}</p>
                      </div>
                    )}
                    <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                      <span>创建于 {format(new Date(p.created_at), "yyyy-MM-dd HH:mm")}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-[hsl(var(--loss))] hover:text-[hsl(var(--loss))] hover:bg-[hsl(var(--loss))]/10 h-7 px-2"
                        onClick={(e) => { e.stopPropagation(); setDeleteId(p.id); }}
                      >
                        <Trash2 className="w-3.5 h-3.5 mr-1" />
                        删除
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={(v) => !v && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除</AlertDialogTitle>
            <AlertDialogDescription>删除后无法恢复，确定要删除该推演计划吗？</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={deletePlan.isPending}>
              {deletePlan.isPending ? "删除中…" : "确认删除"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
