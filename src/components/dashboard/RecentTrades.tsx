import { motion } from "framer-motion";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

interface Trade {
  id: string;
  symbol: string;
  name: string;
  direction: "long" | "short";
  entryPrice: number;
  exitPrice: number;
  pnl: number;
  pnlPercent: number;
  rMultiple: number;
  disciplineScore: number;
  date: string;
}

const mockTrades: Trade[] = [
  { id: "1", symbol: "600519", name: "贵州茅台", direction: "long", entryPrice: 1680, exitPrice: 1725, pnl: 4500, pnlPercent: 2.68, rMultiple: 2.1, disciplineScore: 92, date: "03/17" },
  { id: "2", symbol: "300750", name: "宁德时代", direction: "long", entryPrice: 198, exitPrice: 189, pnl: -2700, pnlPercent: -4.55, rMultiple: -1.2, disciplineScore: 65, date: "03/16" },
  { id: "3", symbol: "000858", name: "五粮液", direction: "long", entryPrice: 142, exitPrice: 148.5, pnl: 3250, pnlPercent: 4.58, rMultiple: 1.8, disciplineScore: 88, date: "03/15" },
  { id: "4", symbol: "601318", name: "中国平安", direction: "long", entryPrice: 48.2, exitPrice: 46.8, pnl: -1400, pnlPercent: -2.90, rMultiple: -0.8, disciplineScore: 78, date: "03/14" },
  { id: "5", symbol: "002594", name: "比亚迪", direction: "long", entryPrice: 265, exitPrice: 278, pnl: 5200, pnlPercent: 4.91, rMultiple: 2.5, disciplineScore: 95, date: "03/13" },
];

export default function RecentTrades() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="gradient-card rounded-xl border border-border p-5"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-foreground">近期交易</h3>
        <button className="text-xs text-primary hover:underline">查看全部</button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-muted-foreground text-xs uppercase tracking-wider">
              <th className="text-left pb-3 font-medium">标的</th>
              <th className="text-left pb-3 font-medium">方向</th>
              <th className="text-right pb-3 font-medium">盈亏</th>
              <th className="text-right pb-3 font-medium">R 乘数</th>
              <th className="text-right pb-3 font-medium">纪律分</th>
              <th className="text-right pb-3 font-medium">日期</th>
            </tr>
          </thead>
          <tbody>
            {mockTrades.map((trade) => {
              const isProfit = trade.pnl >= 0;
              return (
                <tr key={trade.id} className="border-t border-border/50 hover:bg-accent/30 transition-colors cursor-pointer">
                  <td className="py-3">
                    <div>
                      <p className="font-medium text-foreground">{trade.name}</p>
                      <p className="text-xs text-muted-foreground font-mono">{trade.symbol}</p>
                    </div>
                  </td>
                  <td className="py-3">
                    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded ${
                      trade.direction === "long" ? "bg-profit/10 text-profit" : "bg-loss/10 text-loss"
                    }`}>
                      {trade.direction === "long" ? (
                        <><ArrowUpRight className="w-3 h-3" /> 做多</>
                      ) : (
                        <><ArrowDownRight className="w-3 h-3" /> 做空</>
                      )}
                    </span>
                  </td>
                  <td className={`py-3 text-right font-mono font-medium ${isProfit ? "text-profit" : "text-loss"}`}>
                    {isProfit ? "+" : ""}{trade.pnl.toLocaleString()}
                    <span className="text-xs ml-1">({isProfit ? "+" : ""}{trade.pnlPercent}%)</span>
                  </td>
                  <td className={`py-3 text-right font-mono ${trade.rMultiple >= 0 ? "text-profit" : "text-loss"}`}>
                    {trade.rMultiple > 0 ? "+" : ""}{trade.rMultiple.toFixed(1)}R
                  </td>
                  <td className="py-3 text-right">
                    <span className={`font-mono font-medium ${
                      trade.disciplineScore >= 85 ? "text-profit" : trade.disciplineScore >= 70 ? "text-warning" : "text-loss"
                    }`}>
                      {trade.disciplineScore}
                    </span>
                  </td>
                  <td className="py-3 text-right text-muted-foreground font-mono text-xs">{trade.date}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
