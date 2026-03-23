import { useState } from "react";
import { useTrades, useDeleteTrade, Trade } from "@/hooks/use-trading-data";
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
import { ArrowUpRight, ArrowDownRight, Loader2, Pencil, Trash2 } from "lucide-react";
import TradeFormDialog from "./TradeFormDialog";

export default function TradeList() {
  const { data: trades, isLoading } = useTrades(50);
  const deleteTrade = useDeleteTrade();
  const [editingTrade, setEditingTrade] = useState<Trade | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20 text-muted-foreground">
        <Loader2 className="w-5 h-5 animate-spin mr-2" />
        加载中…
      </div>
    );
  }

  if (!trades?.length) {
    return (
      <Card>
        <CardContent className="py-16 text-center text-muted-foreground">
          暂无交易记录，点击右上角「录入交易」开始记录
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="space-y-2">
        {trades.map((t) => {
          const pnl = Number(t.pnl) || 0;
          const isProfit = pnl >= 0;
          return (
            <Card key={t.id} className="hover:border-primary/30 transition-colors group">
              <CardContent className="p-4 flex items-center gap-4">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  t.direction === "long" ? "bg-[hsl(var(--profit))]/10" : "bg-[hsl(var(--loss))]/10"
                }`}>
                  {t.direction === "long" ? (
                    <ArrowUpRight className="w-4 h-4 text-[hsl(var(--profit))]" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4 text-[hsl(var(--loss))]" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-foreground text-sm">{t.symbol}</span>
                    <span className="text-xs text-muted-foreground">{t.name}</span>
                    <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                      {t.status === "open" ? "持仓" : "已平"}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {format(new Date(t.opened_at), "MM/dd HH:mm")} · 入场 {t.entry_price}
                    {t.exit_price ? ` → ${t.exit_price}` : ""} · {t.quantity}手
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setEditingTrade(t)}>
                      <Pencil className="w-3.5 h-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => setDeleteId(t.id)}>
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>

                  <div className="text-right flex-shrink-0 min-w-[60px]">
                    {t.status === "closed" ? (
                      <>
                        <p className={`text-sm font-semibold ${isProfit ? "text-[hsl(var(--profit))]" : "text-[hsl(var(--loss))]"}`}>
                          {isProfit ? "+" : ""}{pnl.toFixed(2)}
                        </p>
                        {t.r_multiple != null && (
                          <p className="text-[11px] text-muted-foreground">{Number(t.r_multiple).toFixed(1)}R</p>
                        )}
                      </>
                    ) : (
                      <p className="text-xs text-muted-foreground">持仓中</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {editingTrade && (
        <TradeFormDialog
          open={!!editingTrade}
          onOpenChange={(v) => { if (!v) setEditingTrade(null); }}
          trade={editingTrade}
        />
      )}

      <AlertDialog open={!!deleteId} onOpenChange={(v) => { if (!v) setDeleteId(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除</AlertDialogTitle>
            <AlertDialogDescription>删除后无法恢复，确定要删除这条交易记录吗？</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                if (deleteId) deleteTrade.mutate(deleteId);
                setDeleteId(null);
              }}
            >
              删除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
