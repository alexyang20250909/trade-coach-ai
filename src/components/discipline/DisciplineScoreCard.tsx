import { motion } from "framer-motion";
import { useDisciplineScore } from "@/hooks/use-trading-data";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function DisciplineScoreCard() {
  const { data, isLoading } = useDisciplineScore();

  const score = data?.score ?? 100;
  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 85 ? "text-[hsl(var(--profit))]" : score >= 70 ? "text-warning" : "text-[hsl(var(--loss))]";
  const strokeColor = score >= 85 ? "hsl(var(--profit))" : score >= 70 ? "hsl(var(--warning))" : "hsl(var(--loss))";

  return (
    <Card className="lg:col-span-1">
      <CardContent className="p-6 flex flex-col items-center justify-center">
        <h3 className="text-sm font-semibold text-foreground mb-4">纪律评分</h3>
        {isLoading ? (
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        ) : (
          <>
            <div className="relative w-32 h-32">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="hsl(var(--muted))" strokeWidth="6" />
                <motion.circle
                  cx="50" cy="50" r="45" fill="none"
                  stroke={strokeColor}
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  initial={{ strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset: offset }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-3xl font-bold font-mono ${color}`}>{score}</span>
                <span className="text-[10px] text-muted-foreground">/ 100</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              共 {data?.totalLogs ?? 0} 条违规记录
            </p>
          </>
        )}
      </CardContent>
    </Card>
  );
}
