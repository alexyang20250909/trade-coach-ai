import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import type { RMultipleBucket } from "@/hooks/use-analytics";
import { Card, CardContent } from "@/components/ui/card";

interface Props {
  data: RMultipleBucket[];
}

const barColors = [
  "hsl(0,85%,60%)",    // < -2R
  "hsl(0,70%,55%)",    // -2~-1R
  "hsl(0,55%,50%)",    // -1~0R
  "hsl(215,12%,40%)",  // 0~1R
  "hsl(145,60%,40%)",  // 1~2R
  "hsl(145,80%,42%)",  // 2~3R
  "hsl(145,100%,45%)", // > 3R
];

export default function RMultipleChart({ data }: Props) {
  return (
    <Card>
      <CardContent className="p-5">
        <h3 className="text-sm font-semibold text-foreground mb-1">R乘数分布</h3>
        <p className="text-[11px] text-muted-foreground mb-4">盈亏按风险单位(R)分组统计</p>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,14%,16%)" vertical={false} />
              <XAxis
                dataKey="range"
                tick={{ fill: "hsl(215,12%,50%)", fontSize: 11 }}
                axisLine={{ stroke: "hsl(220,14%,16%)" }}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "hsl(215,12%,50%)", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{
                  background: "hsl(220,18%,12%)",
                  border: "1px solid hsl(220,14%,20%)",
                  borderRadius: 8,
                  fontSize: 12,
                }}
                labelStyle={{ color: "hsl(215,12%,50%)" }}
                formatter={(value: number) => [`${value} 笔`, "交易数"]}
              />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {data.map((_, i) => (
                  <Cell key={i} fill={barColors[i]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
