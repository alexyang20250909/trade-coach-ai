import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import type { WinRatePoint } from "@/hooks/use-analytics";
import { Card, CardContent } from "@/components/ui/card";

interface Props {
  data: WinRatePoint[];
}

export default function WinRateChart({ data }: Props) {
  return (
    <Card>
      <CardContent className="p-5">
        <h3 className="text-sm font-semibold text-foreground mb-1">滚动胜率</h3>
        <p className="text-[11px] text-muted-foreground mb-4">最近10笔交易滚动窗口</p>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,14%,16%)" />
              <XAxis
                dataKey="date"
                tick={{ fill: "hsl(215,12%,50%)", fontSize: 11 }}
                axisLine={{ stroke: "hsl(220,14%,16%)" }}
                tickLine={false}
              />
              <YAxis
                domain={[0, 100]}
                tick={{ fill: "hsl(215,12%,50%)", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `${v}%`}
              />
              <ReferenceLine y={50} stroke="hsl(38,92%,50%)" strokeDasharray="4 4" label={{ value: "50%", fill: "hsl(38,92%,50%)", fontSize: 10 }} />
              <Tooltip
                contentStyle={{
                  background: "hsl(220,18%,12%)",
                  border: "1px solid hsl(220,14%,20%)",
                  borderRadius: 8,
                  fontSize: 12,
                }}
                labelStyle={{ color: "hsl(215,12%,50%)" }}
                formatter={(value: number) => [`${value}%`, "胜率"]}
              />
              <Line
                type="monotone"
                dataKey="winRate"
                stroke="hsl(210,100%,56%)"
                strokeWidth={2}
                dot={{ fill: "hsl(210,100%,56%)", r: 3 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
