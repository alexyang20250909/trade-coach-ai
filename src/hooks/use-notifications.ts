import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export interface Notification {
  id: string;
  type: "discipline" | "review" | "ai";
  title: string;
  description: string;
  time: string;
  read: boolean;
}

export function useNotifications() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["notifications", user?.id],
    enabled: !!user,
    queryFn: async (): Promise<Notification[]> => {
      // Fetch recent discipline violations as notifications
      const { data: logs } = await supabase
        .from("discipline_logs")
        .select("*")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false })
        .limit(10);

      const notifications: Notification[] = (logs || []).map((log) => ({
        id: log.id,
        type: "discipline" as const,
        title: `纪律违规：${log.violation_type}`,
        description: log.description || `扣 ${log.penalty_points} 分`,
        time: log.created_at,
        read: false,
      }));

      // Add a review reminder if it's end of week (Friday+)
      const day = new Date().getDay();
      if (day >= 5) {
        notifications.unshift({
          id: "review-reminder",
          type: "review",
          title: "周复盘提醒",
          description: "本周交易即将结束，记得完成周期复盘",
          time: new Date().toISOString(),
          read: false,
        });
      }

      return notifications;
    },
    refetchInterval: 60000,
  });
}
