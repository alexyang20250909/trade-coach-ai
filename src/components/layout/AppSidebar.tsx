import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  FileText,
  Target,
  BarChart3,
  Brain,
  ClipboardCheck,
  Calendar,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
} from "lucide-react";

interface NavItem {
  icon: React.ElementType;
  label: string;
  path: string;
  category?: string;
}

const navItems: NavItem[] = [
  { icon: LayoutDashboard, label: "仪表盘", path: "/", category: "核心" },
  { icon: FileText, label: "交易日志", path: "/trades", category: "核心" },
  { icon: Target, label: "盘前推演", path: "/plans", category: "核心" },
  { icon: ClipboardCheck, label: "执行监控", path: "/discipline", category: "分析" },
  { icon: BarChart3, label: "数据分析", path: "/analytics", category: "分析" },
  { icon: Calendar, label: "周期复盘", path: "/review", category: "分析" },
  { icon: Brain, label: "AI 教练", path: "/ai-coach", category: "AI" },
  { icon: Settings, label: "设置", path: "/settings", category: "其他" },
];

export default function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const categories = [...new Set(navItems.map((i) => i.category))];

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 240 }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
      className="fixed left-0 top-0 h-screen z-50 flex flex-col border-r border-border"
      style={{ background: "var(--gradient-sidebar)" }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-border">
        <div className="w-9 h-9 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
          <TrendingUp className="w-5 h-5 text-primary" />
        </div>
        {!collapsed && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-foreground font-semibold text-lg tracking-tight"
          >
            TradeLog
          </motion.span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
        {categories.map((cat) => (
          <div key={cat} className="mb-3">
            {!collapsed && (
              <p className="text-[11px] uppercase tracking-wider text-muted-foreground px-3 mb-2 font-medium">
                {cat}
              </p>
            )}
            {navItems
              .filter((i) => i.category === cat)
              .map((item) => {
                const active = location.pathname === item.path;
                return (
                  <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${
                      active
                        ? "bg-primary/10 text-primary"
                        : "text-sidebar-foreground hover:bg-accent hover:text-accent-foreground"
                    }`}
                  >
                    <item.icon
                      className={`w-[18px] h-[18px] flex-shrink-0 ${
                        active ? "text-primary" : "text-muted-foreground group-hover:text-accent-foreground"
                      }`}
                    />
                    {!collapsed && <span>{item.label}</span>}
                    {active && !collapsed && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="ml-auto w-1.5 h-1.5 rounded-full bg-primary"
                      />
                    )}
                  </button>
                );
              })}
          </div>
        ))}
      </nav>

      {/* Collapse toggle */}
      <div className="border-t border-border p-2">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors text-sm"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          {!collapsed && <span>收起菜单</span>}
        </button>
      </div>
    </motion.aside>
  );
}
