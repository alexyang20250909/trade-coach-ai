import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import type { EquityPoint } from "@/hooks/use-analytics";
import { Card, CardContent } from "@/components/ui/card";

interface Props {
  data: EquityPoint[];
}

export default function EquityCurveChart({ data }: Props) {
  const isPositive = data.length > 0 && data[data.length - 1].equity >= 0;

  return (
    <Card>
      <CardContent className="p-5">
        <h3 className="text-sm font-semibold text-foreground mb-4">净值曲线</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="equityGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={isPositive ? "hsl(145,100%,45%)" : "hsl(0,85%,60%)"} stopOpacity={0.3} />
                  <stop offset="100%" stopColor={isPositive ? "hsl(145,100%,45%)" : "hsl(0,85%,60%)"} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,14%,16%)" />
              <XAxis
                dataKey="date"
                tick={{ fill: "hsl(215,12%,50%)", fontSize: 11 }}
                axisLine={{ stroke: "hsl(220,14%,16%)" }}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "hsl(215,12%,50%)", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `¥${v}`}
              />
              <ReferenceLine y={0} stroke="hsl(215,12%,30%)" strokeDasharray="3 3" />
              <Tooltip
                contentStyle={{
                  background: "hsl(220,18%,12%)",
                  border: "1px solid hsl(220,14%,20%)",
                  borderRadius: 8,
                  fontSize: 12,
                }}
                labelStyle={{ color: "hsl(215,12%,50%)" }}
                formatter={(value: number) => [`¥${value}`, "累计盈亏"]}
              />
              <Area
                type="monotone"
                dataKey="equity"
                stroke={isPositive ? "hsl(145,100%,45%)" : "hsl(0,85%,60%)"}
                strokeWidth={2}
                fill="url(#equityGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
