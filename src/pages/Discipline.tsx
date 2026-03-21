import { Shield } from "lucide-react";
import DisciplineScoreCard from "@/components/discipline/DisciplineScoreCard";
import DisciplineLogList from "@/components/discipline/DisciplineLogList";
import ViolationBreakdown from "@/components/discipline/ViolationBreakdown";

export default function Discipline() {
  return (
    <div className="space-y-6 max-w-[1400px]">
      <div>
        <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
          <Shield className="w-5 h-5 text-warning" />
          执行监控
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          量化纪律执行力，识别行为偏差
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <DisciplineScoreCard />
        <ViolationBreakdown />
      </div>

      <DisciplineLogList />
    </div>
  );
}
