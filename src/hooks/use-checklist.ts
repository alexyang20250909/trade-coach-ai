import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface ChecklistItem {
  id: string;
  user_id: string;
  label: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

export function useChecklistItems() {
  return useQuery({
    queryKey: ["checklist-items"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("checklist_items")
        .select("*")
        .eq("is_active", true)
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data as ChecklistItem[];
    },
  });
}

export function useAllChecklistItems() {
  return useQuery({
    queryKey: ["checklist-items-all"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("checklist_items")
        .select("*")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data as ChecklistItem[];
    },
  });
}

export function useCreateChecklistItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (item: { user_id: string; label: string; sort_order: number }) => {
      const { data, error } = await supabase.from("checklist_items").insert(item).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["checklist-items"] });
      qc.invalidateQueries({ queryKey: ["checklist-items-all"] });
    },
  });
}

export function useUpdateChecklistItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: string; label?: string; sort_order?: number; is_active?: boolean }) => {
      const { error } = await supabase.from("checklist_items").update(updates).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["checklist-items"] });
      qc.invalidateQueries({ queryKey: ["checklist-items-all"] });
    },
  });
}

export function useDeleteChecklistItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("checklist_items").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["checklist-items"] });
      qc.invalidateQueries({ queryKey: ["checklist-items-all"] });
    },
  });
}

export function useCreateChecklistLog() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (log: { user_id: string; trade_id?: string; completed_items: string[]; all_checked: boolean }) => {
      const { data, error } = await supabase.from("checklist_logs").insert({
        ...log,
        completed_items: log.completed_items as any,
      }).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["checklist-logs"] }),
  });
}
