import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import PlanList from "@/components/plans/PlanList";
import PlanFormDialog from "@/components/plans/PlanFormDialog";

export default function Plans() {
  const [formOpen, setFormOpen] = useState(false);

  return (
    <div className="space-y-6 max-w-[1400px]">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">盘前推演</h1>
          <p className="text-sm text-muted-foreground mt-0.5">提前规划交易，做到心中有数再出手</p>
        </div>
        <Button onClick={() => setFormOpen(true)} size="sm">
          <Plus className="w-4 h-4 mr-1" />
          新建计划
        </Button>
      </div>
      <PlanList />
      <PlanFormDialog open={formOpen} onOpenChange={setFormOpen} />
    </div>
  );
}
