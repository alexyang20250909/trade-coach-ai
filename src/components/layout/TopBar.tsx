import { Bell, Search, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

export default function TopBar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };

  return (
    <header className="h-14 border-b border-border flex items-center justify-between px-6 bg-card/50 backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            placeholder="搜索交易记录、标的..."
            className="bg-muted border-none rounded-lg pl-9 pr-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary w-72"
          />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-xs font-mono text-muted-foreground">
          {new Date().toLocaleDateString("zh-CN", { year: "numeric", month: "2-digit", day: "2-digit", weekday: "short" })}
        </span>
        <button className="relative p-2 rounded-lg hover:bg-accent transition-colors">
          <Bell className="w-4 h-4 text-muted-foreground" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-loss rounded-full" />
        </button>
        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold">
          {user?.email?.charAt(0).toUpperCase() || "T"}
        </div>
        <button
          onClick={handleSignOut}
          className="p-2 rounded-lg hover:bg-accent transition-colors"
          title="退出登录"
        >
          <LogOut className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>
    </header>
  );
}
