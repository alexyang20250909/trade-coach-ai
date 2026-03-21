import { useDisciplineLogs } from "@/hooks/use-trading-data";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Loader2, AlertTriangle, AlertCircle } from "lucide-react";

export default function DisciplineLogList() {
  const { data: logs, isLoading } = useDisciplineLogs();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12 text-muted-foreground">
        <Loader2 className="w-5 h-5 animate-spin mr-2" />
        加载中…
      </div>
    );
  }

  if (!logs?.length) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-muted-foreground">
          暂无纪律违规记录
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-foreground">违规日志</h3>
      {logs.map((log) => (
        <Card key={log.id} className="hover:border-warning/30 transition-colors">
          <CardContent className="p-4 flex items-center gap-4">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
              log.severity === "high" ? "bg-[hsl(var(--loss))]/10" : "bg-warning/10"
            }`}>
              {log.severity === "high" ? (
                <AlertTriangle className="w-4 h-4 text-[hsl(var(--loss))]" />
              ) : (
                <AlertCircle className="w-4 h-4 text-warning" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm text-foreground">{log.violation_type}</span>
                <Badge
                  variant="outline"
                  className={`text-[10px] px-1.5 py-0 ${
                    log.severity === "high" ? "border-[hsl(var(--loss))]/30 text-[hsl(var(--loss))]" : "border-warning/30 text-warning"
                  }`}
                >
                  {log.severity === "high" ? "严重" : "中等"}
                </Badge>
              </div>
              {log.description && (
                <p className="text-xs text-muted-foreground mt-0.5 truncate">{log.description}</p>
              )}
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-xs font-mono text-[hsl(var(--loss))]">-{log.penalty_points}分</p>
              <p className="text-[10px] text-muted-foreground">
                {format(new Date(log.created_at), "MM/dd HH:mm")}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
