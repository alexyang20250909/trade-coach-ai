import { motion } from "framer-motion";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { useTrades } from "@/hooks/use-trading-data";

export default function RecentTrades() {
  const { data: trades, isLoading } = useTrades(10);

  const displayTrades = trades?.length ? trades : [
    { id: "demo-1", symbol: "600519", name: "贵州茅台", direction: "long", entry_price: 1680, exit_price: 1725, pnl: 4500, pnl_percent: 2.68, r_multiple: 2.1, opened_at: "2026-03-17T00:00:00Z", status: "closed" },
    { id: "demo-2", symbol: "300750", name: "宁德时代", direction: "long", entry_price: 198, exit_price: 189, pnl: -2700, pnl_percent: -4.55, r_multiple: -1.2, opened_at: "2026-03-16T00:00:00Z", status: "closed" },
    { id: "demo-3", symbol: "000858", name: "五粮液", direction: "long", entry_price: 142, exit_price: 148.5, pnl: 3250, pnl_percent: 4.58, r_multiple: 1.8, opened_at: "2026-03-15T00:00:00Z", status: "closed" },
    { id: "demo-4", symbol: "601318", name: "中国平安", direction: "long", entry_price: 48.2, exit_price: 46.8, pnl: -1400, pnl_percent: -2.90, r_multiple: -0.8, opened_at: "2026-03-14T00:00:00Z", status: "closed" },
    { id: "demo-5", symbol: "002594", name: "比亚迪", direction: "long", entry_price: 265, exit_price: 278, pnl: 5200, pnl_percent: 4.91, r_multiple: 2.5, opened_at: "2026-03-13T00:00:00Z", status: "closed" },
  ];

  const isDemo = !trades?.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="gradient-card rounded-xl border border-border p-4 lg:p-5"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-foreground">近期交易</h3>
          {isDemo && (
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-warning/10 text-warning">示例数据</span>
          )}
        </div>
        <button className="text-xs text-primary hover:underline">查看全部</button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-muted-foreground text-xs uppercase tracking-wider">
              <th className="text-left pb-3 font-medium">标的</th>
              <th className="text-left pb-3 font-medium hidden sm:table-cell">方向</th>
              <th className="text-right pb-3 font-medium">盈亏</th>
              <th className="text-right pb-3 font-medium hidden md:table-cell">R 乘数</th>
              <th className="text-right pb-3 font-medium hidden lg:table-cell">日期</th>
            </tr>
          </thead>
          <tbody>
            {displayTrades.map((trade: any) => {
              const pnl = Number(trade.pnl) || 0;
              const isProfit = pnl >= 0;
              const date = new Date(trade.opened_at).toLocaleDateString("zh-CN", { month: "2-digit", day: "2-digit" });
              return (
                <tr key={trade.id} className="border-t border-border/50 hover:bg-accent/30 transition-colors cursor-pointer">
                  <td className="py-3">
                    <p className="font-medium text-foreground">{trade.name}</p>
                    <p className="text-xs text-muted-foreground font-mono">{trade.symbol}</p>
                  </td>
                  <td className="py-3 hidden sm:table-cell">
                    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded ${
                      trade.direction === "long" ? "bg-profit/10 text-profit" : "bg-loss/10 text-loss"
                    }`}>
                      {trade.direction === "long" ? <><ArrowUpRight className="w-3 h-3" /> 做多</> : <><ArrowDownRight className="w-3 h-3" /> 做空</>}
                    </span>
                  </td>
                  <td className={`py-3 text-right font-mono font-medium ${isProfit ? "text-profit" : "text-loss"}`}>
                    {isProfit ? "+" : ""}{pnl.toLocaleString()}
                  </td>
                  <td className={`py-3 text-right font-mono hidden md:table-cell ${Number(trade.r_multiple) >= 0 ? "text-profit" : "text-loss"}`}>
                    {Number(trade.r_multiple) > 0 ? "+" : ""}{Number(trade.r_multiple).toFixed(1)}R
                  </td>
                  <td className="py-3 text-right text-muted-foreground font-mono text-xs hidden lg:table-cell">{date}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
