import { useState, useEffect } from "react";
import { CheckSquare, AlertTriangle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useChecklistItems, useCreateChecklistLog } from "@/hooks/use-checklist";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onComplete: () => void;
}

export default function PreTradeChecklist({ open, onOpenChange, onComplete }: Props) {
  const { user } = useAuth();
  const { data: items, isLoading } = useChecklistItems();
  const createLog = useCreateChecklistLog();
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (open) setChecked({});
  }, [open]);

  const activeItems = items || [];
  const allChecked = activeItems.length > 0 && activeItems.every((item) => checked[item.id]);
  const checkedCount = activeItems.filter((item) => checked[item.id]).length;

  const handleConfirm = () => {
    if (!user) return;
    const completedItems = activeItems.filter((i) => checked[i.id]).map((i) => i.label);
    createLog.mutate({
      user_id: user.id,
      completed_items: completedItems,
      all_checked: allChecked,
    });

    if (!allChecked) {
      toast({
        title: "⚠️ 部分检查项未完成",
        description: `${checkedCount}/${activeItems.length} 项已确认，请注意风险`,
        variant: "destructive",
      });
    }

    onOpenChange(false);
    onComplete();
  };

  const handleSkip = () => {
    onOpenChange(false);
    onComplete();
  };

  if (activeItems.length === 0 && !isLoading) {
    // No checklist items configured, skip directly
    if (open) {
      onOpenChange(false);
      onComplete();
    }
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-primary" />
            交易前检查清单
          </DialogTitle>
          <DialogDescription>请在开仓前逐项确认以下检查项</DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="py-8 text-center text-muted-foreground text-sm">加载中…</div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-3">
              {activeItems.map((item) => (
                <label
                  key={item.id}
                  className="flex items-start gap-3 p-3 rounded-lg border border-border hover:bg-accent/50 cursor-pointer transition-colors"
                >
                  <Checkbox
                    checked={!!checked[item.id]}
                    onCheckedChange={(v) => setChecked((prev) => ({ ...prev, [item.id]: !!v }))}
                    className="mt-0.5"
                  />
                  <span className="text-sm text-foreground leading-relaxed">{item.label}</span>
                </label>
              ))}
            </div>

            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>已确认 {checkedCount}/{activeItems.length} 项</span>
              {!allChecked && checkedCount > 0 && (
                <span className="flex items-center gap-1 text-yellow-500">
                  <AlertTriangle className="w-3 h-3" /> 部分未确认
                </span>
              )}
            </div>

            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={handleSkip}>
                跳过
              </Button>
              <Button className="flex-1" onClick={handleConfirm}>
                {allChecked ? "全部确认，开始录入" : "继续录入"}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
