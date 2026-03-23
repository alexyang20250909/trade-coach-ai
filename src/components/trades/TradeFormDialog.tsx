import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCreateTrade, useUpdateTrade, useCreateDisciplineLog, Trade } from "@/hooks/use-trading-data";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

const schema = z.object({
  symbol: z.string().trim().min(1, "请输入标的代码").max(20),
  name: z.string().trim().min(1, "请输入标的名称").max(50),
  direction: z.enum(["long", "short"]),
  entry_price: z.coerce.number().positive("入场价必须大于0"),
  quantity: z.coerce.number().positive("数量必须大于0"),
  exit_price: z.preprocess(
    (v) => (v === "" || v === undefined || v === null ? undefined : Number(v)),
    z.number().positive("出场价必须大于0").optional()
  ),
  status: z.enum(["open", "closed"]),
  decision_logic: z.string().max(200).optional(),
  confidence_score: z.number().min(0).max(100).optional(),
  fomo_score: z.number().min(0).max(100).optional(),
  notes: z.string().max(500).optional(),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  trade?: Trade | null;
}

export default function TradeFormDialog({ open, onOpenChange, trade }: Props) {
  const isEdit = !!trade;
  const createTrade = useCreateTrade();
  const updateTrade = useUpdateTrade();
  const createDisciplineLog = useCreateDisciplineLog();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      symbol: "", name: "", direction: "long", status: "open",
      entry_price: "" as any, quantity: "" as any, exit_price: undefined,
      decision_logic: "", confidence_score: 50, fomo_score: 20, notes: "",
    },
  });

  useEffect(() => {
    if (trade && open) {
      form.reset({
        symbol: trade.symbol,
        name: trade.name,
        direction: trade.direction as "long" | "short",
        entry_price: trade.entry_price,
        quantity: trade.quantity as any,
        exit_price: trade.exit_price ?? undefined,
        status: trade.status as "open" | "closed",
        decision_logic: trade.decision_logic ?? "",
        confidence_score: trade.confidence_score ?? 50,
        fomo_score: trade.fomo_score ?? 20,
        notes: trade.notes ?? "",
      });
    } else if (!trade && open) {
      form.reset({
        symbol: "", name: "", direction: "long", status: "open",
        entry_price: "" as any, quantity: "" as any, exit_price: undefined,
        decision_logic: "", confidence_score: 50, fomo_score: 20, notes: "",
      });
    }
  }, [trade, open]);

  async function onSubmit(values: FormValues) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({ title: "请先登录", variant: "destructive" });
      return;
    }

    const exitPrice = values.exit_price ? Number(values.exit_price) : null;
    const pnl = values.status === "closed" && exitPrice
      ? (values.direction === "long" ? exitPrice - values.entry_price : values.entry_price - exitPrice) * values.quantity
      : null;
    const pnlPercent = pnl != null ? (pnl / (values.entry_price * values.quantity)) * 100 : null;

    if (isEdit) {
      updateTrade.mutate(
        {
          id: trade!.id,
          symbol: values.symbol, name: values.name, direction: values.direction,
          entry_price: values.entry_price, quantity: values.quantity,
          exit_price: exitPrice, status: values.status,
          closed_at: values.status === "closed" ? (trade!.closed_at || new Date().toISOString()) : null,
          pnl, pnl_percent: pnlPercent,
          decision_logic: values.decision_logic || null,
          confidence_score: values.confidence_score ?? null,
          fomo_score: values.fomo_score ?? null,
          notes: values.notes || null,
        },
        {
          onSuccess: () => {
            toast({ title: "✅ 交易已更新" });
            onOpenChange(false);
          },
          onError: (err) => toast({ title: "更新失败", description: err.message, variant: "destructive" }),
        }
      );
      return;
    }

    // --- Create flow (unchanged logic) ---
    const { data: matchingPlans } = await supabase
      .from("trade_plans")
      .select("id, planned_entry, stop_loss, take_profit")
      .eq("user_id", user.id)
      .eq("symbol", values.symbol.toUpperCase())
      .eq("direction", values.direction)
      .in("status", ["pending", "executed"]);

    const hasPlan = matchingPlans && matchingPlans.length > 0;
    const matchedPlan = hasPlan ? matchingPlans[0] : null;

    createTrade.mutate(
      {
        user_id: user.id, symbol: values.symbol, name: values.name,
        direction: values.direction, entry_price: values.entry_price,
        quantity: values.quantity, exit_price: exitPrice, status: values.status,
        closed_at: values.status === "closed" ? new Date().toISOString() : null,
        pnl, pnl_percent: pnlPercent,
        decision_logic: values.decision_logic || null,
        confidence_score: values.confidence_score ?? null,
        fomo_score: values.fomo_score ?? null,
        notes: values.notes || null,
        plan_id: matchedPlan?.id || null,
      },
      {
        onSuccess: (newTrade) => {
          if (!hasPlan) {
            createDisciplineLog.mutate({
              user_id: user.id, trade_id: newTrade.id,
              violation_type: "冲动开仓", severity: "high", penalty_points: 10,
              description: `标的 ${values.symbol} 无盘前推演计划即开仓`,
            });
            toast({ title: "⚠️ 纪律警告：冲动开仓", description: `未找到 ${values.symbol} 的盘前推演计划，已扣减10分`, variant: "destructive" });
          } else {
            const planned = Number(matchedPlan!.planned_entry);
            const deviation = Math.abs(values.entry_price - planned) / planned * 100;
            if (deviation > 3) {
              createDisciplineLog.mutate({
                user_id: user.id, trade_id: newTrade.id,
                violation_type: "偏离计划入场", severity: "medium", penalty_points: 5,
                description: `实际入场 ${values.entry_price} 偏离计划 ${planned} 达 ${deviation.toFixed(1)}%`,
              });
              toast({ title: "⚠️ 入场偏离计划", description: `偏离 ${deviation.toFixed(1)}%，已扣减5分`, variant: "destructive" });
            } else {
              toast({ title: "✅ 交易已保存，执行符合计划" });
            }
            supabase.from("trade_plans").update({ status: "executed" }).eq("id", matchedPlan!.id).then();
          }
          form.reset();
          onOpenChange(false);
        },
        onError: (err) => toast({ title: "保存失败", description: err.message, variant: "destructive" }),
      }
    );
  }

  const isPending = createTrade.isPending || updateTrade.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? "编辑交易" : "录入交易"}</DialogTitle>
          <DialogDescription>{isEdit ? "修改交易记录信息" : "填写交易详情并保存"}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <FormField control={form.control} name="symbol" render={({ field }) => (
                <FormItem><FormLabel>标的代码</FormLabel><FormControl><Input placeholder="AAPL" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="name" render={({ field }) => (
                <FormItem><FormLabel>标的名称</FormLabel><FormControl><Input placeholder="苹果" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <FormField control={form.control} name="direction" render={({ field }) => (
                <FormItem><FormLabel>方向</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                    <SelectContent><SelectItem value="long">做多</SelectItem><SelectItem value="short">做空</SelectItem></SelectContent>
                  </Select><FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="status" render={({ field }) => (
                <FormItem><FormLabel>状态</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                    <SelectContent><SelectItem value="open">持仓中</SelectItem><SelectItem value="closed">已平仓</SelectItem></SelectContent>
                  </Select><FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="quantity" render={({ field }) => (
                <FormItem><FormLabel>数量(手)</FormLabel><FormControl><Input type="number" step="any" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <FormField control={form.control} name="entry_price" render={({ field }) => (
                <FormItem><FormLabel>入场价</FormLabel><FormControl><Input type="number" step="any" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="exit_price" render={({ field }) => (
                <FormItem><FormLabel>出场价 (选填)</FormLabel><FormControl><Input type="number" step="any" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
            </div>
            <FormField control={form.control} name="decision_logic" render={({ field }) => (
              <FormItem><FormLabel>决策逻辑</FormLabel><FormControl><Input placeholder="例: 突破前高+放量" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="confidence_score" render={({ field }) => (
                <FormItem><FormLabel>信心指数: {field.value}</FormLabel><FormControl>
                  <Slider min={0} max={100} step={5} value={[field.value ?? 50]} onValueChange={([v]) => field.onChange(v)} />
                </FormControl></FormItem>
              )} />
              <FormField control={form.control} name="fomo_score" render={({ field }) => (
                <FormItem><FormLabel>FOMO指数: {field.value}</FormLabel><FormControl>
                  <Slider min={0} max={100} step={5} value={[field.value ?? 20]} onValueChange={([v]) => field.onChange(v)} />
                </FormControl></FormItem>
              )} />
            </div>
            <FormField control={form.control} name="notes" render={({ field }) => (
              <FormItem><FormLabel>备注</FormLabel><FormControl><Textarea rows={2} placeholder="交易心得或复盘笔记…" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "保存中…" : isEdit ? "更新交易" : "保存交易"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
