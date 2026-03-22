import { Bell } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useNotifications } from "@/hooks/use-notifications";
import { formatDistanceToNow } from "date-fns";
import { zhCN } from "date-fns/locale";

const typeIcons: Record<string, string> = {
  discipline: "⚠️",
  review: "📅",
  ai: "🤖",
};

export default function NotificationPopover() {
  const { data: notifications = [] } = useNotifications();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="relative p-2 rounded-lg hover:bg-accent transition-colors">
          <Bell className="w-4 h-4 text-muted-foreground" />
          {notifications.length > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 bg-loss rounded-full" />
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="px-4 py-3 border-b border-border">
          <h3 className="text-sm font-semibold text-foreground">消息通知</h3>
          <p className="text-xs text-muted-foreground">{notifications.length} 条未读</p>
        </div>
        <div className="max-h-72 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-6 text-center text-xs text-muted-foreground">暂无通知</div>
          ) : (
            notifications.map((n) => (
              <div key={n.id} className="px-4 py-3 border-b border-border last:border-0 hover:bg-accent/50 transition-colors">
                <div className="flex items-start gap-2">
                  <span className="text-sm">{typeIcons[n.type] || "📌"}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-foreground truncate">{n.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{n.description}</p>
                    <p className="text-[10px] text-muted-foreground mt-1">
                      {formatDistanceToNow(new Date(n.time), { addSuffix: true, locale: zhCN })}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
