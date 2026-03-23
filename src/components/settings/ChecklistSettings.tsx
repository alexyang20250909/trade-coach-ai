import { useState } from "react";
import { Plus, Trash2, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useAllChecklistItems, useCreateChecklistItem, useUpdateChecklistItem, useDeleteChecklistItem } from "@/hooks/use-checklist";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";

export default function ChecklistSettings() {
  const { user } = useAuth();
  const { data: items, isLoading } = useAllChecklistItems();
  const createItem = useCreateChecklistItem();
  const updateItem = useUpdateChecklistItem();
  const deleteItem = useDeleteChecklistItem();
  const [newLabel, setNewLabel] = useState("");

  const handleAdd = () => {
    if (!user || !newLabel.trim()) return;
    createItem.mutate(
      { user_id: user.id, label: newLabel.trim(), sort_order: (items?.length || 0) + 1 },
      {
        onSuccess: () => {
          setNewLabel("");
          toast({ title: "✅ 检查项已添加" });
        },
      }
    );
  };

  const handleDelete = (id: string) => {
    deleteItem.mutate(id, {
      onSuccess: () => toast({ title: "检查项已删除" }),
    });
  };

  const handleToggle = (id: string, isActive: boolean) => {
    updateItem.mutate({ id, is_active: isActive });
  };

  return (
    <div className="rounded-xl border border-border bg-card p-5 space-y-4">
      <div>
        <h2 className="text-sm font-semibold text-foreground">交易前检查清单</h2>
        <p className="text-xs text-muted-foreground mt-1">自定义交易前必须确认的检查项，录入交易时会弹出确认</p>
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">加载中…</p>
      ) : (
        <div className="space-y-2">
          {items?.map((item) => (
            <div key={item.id} className="flex items-center gap-3 p-2.5 rounded-lg border border-border bg-background">
              <GripVertical className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              <span className={`text-sm flex-1 ${!item.is_active ? "line-through text-muted-foreground" : "text-foreground"}`}>
                {item.label}
              </span>
              <Switch
                checked={item.is_active}
                onCheckedChange={(v) => handleToggle(item.id, v)}
                className="flex-shrink-0"
              />
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-muted-foreground hover:text-destructive"
                onClick={() => handleDelete(item.id)}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
          ))}
          {(!items || items.length === 0) && (
            <p className="text-xs text-muted-foreground py-3 text-center">暂无检查项，添加后将在录入交易前弹出确认</p>
          )}
        </div>
      )}

      <div className="flex gap-2">
        <Input
          placeholder="例：是否设置止损？"
          value={newLabel}
          onChange={(e) => setNewLabel(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          className="flex-1"
        />
        <Button size="sm" onClick={handleAdd} disabled={!newLabel.trim() || createItem.isPending}>
          <Plus className="w-4 h-4 mr-1" /> 添加
        </Button>
      </div>
    </div>
  );
}
