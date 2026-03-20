import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCreateTradePlan } from "@/hooks/use-trading-data";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
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

const schema = z.object({
  symbol: z.string().trim().min(1, "请输入标的代码").max(20),
  name: z.string().trim().min(1, "请输入标的名称").max(50),
  direction: z.enum(["long", "short"]),
  planned_entry: z.coerce.number().positive("入场价必须大于0"),
  stop_loss: z.coerce.number().positive("止损价必须大于0"),
  take_profit: z.coerce.number().positive("目标价必须大于0").optional().or(z.literal("")),
  position_size: z.coerce.number().positive("仓位必须大于0").optional().or(z.literal("")),
  rationale: z.string().max(500).optional(),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}

export default function PlanFormDialog({ open, onOpenChange }: Props) {
  const createPlan = useCreateTradePlan();
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      symbol: "",
      name: "",
      direction: "long",
      planned_entry: "" as any,
      stop_loss: "" as any,
      take_profit: "",
      position_size: "",
      rationale: "",
    },
  });

  async function onSubmit(values: FormValues) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({ title: "请先登录", variant: "destructive" });
      return;
    }

    createPlan.mutate(
      {
        user_id: user.id,
        symbol: values.symbol,
        name: values.name,
        direction: values.direction,
        planned_entry: values.planned_entry,
        stop_loss: values.stop_loss,
        take_profit: values.take_profit ? Number(values.take_profit) : null,
        position_size: values.position_size ? Number(values.position_size) : null,
        rationale: values.rationale || null,
      },
      {
        onSuccess: () => {
          toast({ title: "推演计划已保存" });
          form.reset();
          onOpenChange(false);
        },
        onError: (err) => {
          toast({ title: "保存失败", description: err.message, variant: "destructive" });
        },
      }
    );
  }

  // Live risk-reward calculation
  const entry = form.watch("planned_entry");
  const stop = form.watch("stop_loss");
  const tp = form.watch("take_profit");
  const riskReward =
    entry && stop && tp && Number(tp) && Number(entry) && Number(stop)
      ? (Math.abs(Number(tp) - Number(entry)) / Math.abs(Number(entry) - Number(stop))).toFixed(1)
      : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>新建盘前推演</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <FormField control={form.control} name="symbol" render={({ field }) => (
                <FormItem>
                  <FormLabel>标的代码</FormLabel>
                  <FormControl><Input placeholder="AAPL" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="name" render={({ field }) => (
                <FormItem>
                  <FormLabel>标的名称</FormLabel>
                  <FormControl><Input placeholder="苹果" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <FormField control={form.control} name="direction" render={({ field }) => (
                <FormItem>
                  <FormLabel>方向</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                    <SelectContent>
                      <SelectItem value="long">做多</SelectItem>
                      <SelectItem value="short">做空</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="position_size" render={({ field }) => (
                <FormItem>
                  <FormLabel>计划仓位 (手)</FormLabel>
                  <FormControl><Input type="number" step="any" placeholder="选填" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <FormField control={form.control} name="planned_entry" render={({ field }) => (
                <FormItem>
                  <FormLabel>计划入场价</FormLabel>
                  <FormControl><Input type="number" step="any" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="stop_loss" render={({ field }) => (
                <FormItem>
                  <FormLabel>止损价</FormLabel>
                  <FormControl><Input type="number" step="any" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="take_profit" render={({ field }) => (
                <FormItem>
                  <FormLabel>目标价</FormLabel>
                  <FormControl><Input type="number" step="any" placeholder="选填" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            {riskReward && (
              <div className="rounded-lg bg-secondary/50 px-3 py-2 text-sm">
                盈亏比: <span className="font-semibold text-[hsl(var(--info))]">{riskReward}R</span>
              </div>
            )}

            <FormField control={form.control} name="rationale" render={({ field }) => (
              <FormItem>
                <FormLabel>交易逻辑 / 推演依据</FormLabel>
                <FormControl><Textarea rows={3} placeholder="例: 日线级别突破整理区间，量能配合良好…" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <Button type="submit" className="w-full" disabled={createPlan.isPending}>
              {createPlan.isPending ? "保存中…" : "保存推演计划"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
