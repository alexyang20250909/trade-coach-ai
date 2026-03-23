
-- Checklist item templates (user-customizable)
CREATE TABLE public.checklist_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.checklist_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own checklist items"
  ON public.checklist_items FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Checklist completion logs per trade
CREATE TABLE public.checklist_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  trade_id UUID REFERENCES public.trades(id) ON DELETE SET NULL,
  completed_items JSONB NOT NULL DEFAULT '[]'::jsonb,
  all_checked BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.checklist_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own checklist logs"
  ON public.checklist_logs FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
