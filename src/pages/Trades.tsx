import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import TradeList from "@/components/trades/TradeList";
import TradeFormDialog from "@/components/trades/TradeFormDialog";
import PreTradeChecklist from "@/components/trades/PreTradeChecklist";
import { useChecklistItems } from "@/hooks/use-checklist";

export default function Trades() {
  const [formOpen, setFormOpen] = useState(false);
  const [checklistOpen, setChecklistOpen] = useState(false);
  const { data: checklistItems } = useChecklistItems();

  const handleNewTrade = () => {
    if (checklistItems && checklistItems.length > 0) {
      setChecklistOpen(true);
    } else {
      setFormOpen(true);
    }
  };

  return (
    <div className="space-y-6 max-w-[1400px]">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">交易日志</h1>
          <p className="text-sm text-muted-foreground mt-0.5">记录每一笔交易，回顾决策过程</p>
        </div>
        <Button onClick={handleNewTrade} size="sm">
          <Plus className="w-4 h-4 mr-1" />
          录入交易
        </Button>
      </div>
      <TradeList />
      <PreTradeChecklist
        open={checklistOpen}
        onOpenChange={setChecklistOpen}
        onComplete={() => setFormOpen(true)}
      />
      <TradeFormDialog open={formOpen} onOpenChange={setFormOpen} />
    </div>
  );
}
