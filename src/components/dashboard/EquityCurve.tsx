import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { date: "02/01", value: 100000 },
  { date: "02/05", value: 102300 },
  { date: "02/10", value: 98700 },
  { date: "02/15", value: 103500 },
  { date: "02/20", value: 106200 },
  { date: "02/25", value: 104800 },
  { date: "03/01", value: 108900 },
  { date: "03/05", value: 112400 },
  { date: "03/10", value: 109600 },
  { date: "03/15", value: 115800 },
  { date: "03/17", value: 118200 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-glass rounded-lg px-3 py-2 border border-border text-xs">
      <p className="text-muted-foreground">{label}</p>
      <p className="font-mono font-bold text-foreground">
        ¥{payload[0].value.toLocaleString()}
      </p>
    </div>
  );
};

export default function EquityCurve() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="gradient-card rounded-xl border border-border p-5"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-foreground">净值曲线</h3>
        <div className="flex gap-1">
          {["1周", "1月", "3月", "全部"].map((period) => (
            <button
              key={period}
              className="px-2.5 py-1 text-xs rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors first:bg-accent first:text-accent-foreground"
            >
              {period}
            </button>
          ))}
        </div>
      </div>
      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="profitGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(145, 100%, 45%)" stopOpacity={0.3} />
                <stop offset="100%" stopColor="hsl(145, 100%, 45%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 14%, 16%)" />
            <XAxis
              dataKey="date"
              tick={{ fill: "hsl(215, 12%, 50%)", fontSize: 11 }}
              axisLine={{ stroke: "hsl(220, 14%, 16%)" }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "hsl(215, 12%, 50%)", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="value"
              stroke="hsl(145, 100%, 45%)"
              strokeWidth={2}
              fill="url(#profitGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
