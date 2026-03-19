
-- Timestamp update function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- ============================================
-- 1. trades - 核心交易流水
-- ============================================
CREATE TABLE public.trades (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  symbol TEXT NOT NULL,
  name TEXT NOT NULL,
  direction TEXT NOT NULL CHECK (direction IN ('long', 'short')),
  entry_price NUMERIC NOT NULL,
  exit_price NUMERIC,
  quantity NUMERIC NOT NULL,
  commission NUMERIC DEFAULT 0,
  slippage NUMERIC DEFAULT 0,
  pnl NUMERIC,
  pnl_percent NUMERIC,
  r_multiple NUMERIC,
  plan_id UUID,
  decision_logic TEXT CHECK (decision_logic IN ('fundamental', 'technical', 'mixed')),
  fomo_score INTEGER CHECK (fomo_score BETWEEN 1 AND 5),
  confidence_score INTEGER CHECK (confidence_score BETWEEN 1 AND 5),
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'closed')),
  opened_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  closed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.trades ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own trades" ON public.trades FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX idx_trades_user_date ON public.trades(user_id, opened_at DESC);
CREATE TRIGGER update_trades_ts BEFORE UPDATE ON public.trades FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- 2. trade_plans - 盘前推演 / 预设计划
-- ============================================
CREATE TABLE public.trade_plans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  symbol TEXT NOT NULL,
  name TEXT NOT NULL,
  direction TEXT NOT NULL CHECK (direction IN ('long', 'short')),
  planned_entry NUMERIC NOT NULL,
  stop_loss NUMERIC NOT NULL,
  take_profit NUMERIC,
  position_size NUMERIC,
  rationale TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'executed', 'cancelled', 'expired')),
  plan_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.trade_plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own plans" ON public.trade_plans FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX idx_plans_user_date ON public.trade_plans(user_id, plan_date DESC);
CREATE TRIGGER update_plans_ts BEFORE UPDATE ON public.trade_plans FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Add FK from trades to plans
ALTER TABLE public.trades ADD CONSTRAINT fk_trades_plan FOREIGN KEY (plan_id) REFERENCES public.trade_plans(id) ON DELETE SET NULL;

-- ============================================
-- 3. discipline_logs - 纪律违规记录
-- ============================================
CREATE TABLE public.discipline_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  trade_id UUID REFERENCES public.trades(id) ON DELETE CASCADE,
  violation_type TEXT NOT NULL CHECK (violation_type IN ('impulse_open', 'widened_stop', 'no_plan_heavy', 'early_exit', 'revenge_trade', 'other')),
  severity TEXT NOT NULL DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high')),
  penalty_points INTEGER NOT NULL DEFAULT 0,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.discipline_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own discipline logs" ON public.discipline_logs FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX idx_discipline_user ON public.discipline_logs(user_id, created_at DESC);

-- ============================================
-- 4. market_context - 当日市场背景
-- ============================================
CREATE TABLE public.market_context (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  context_date DATE NOT NULL,
  market_trend TEXT CHECK (market_trend IN ('bullish', 'bearish', 'neutral', 'volatile')),
  sector_highlights TEXT,
  key_news TEXT,
  sentiment TEXT CHECK (sentiment IN ('greedy', 'fearful', 'neutral')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.market_context ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own market context" ON public.market_context FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE UNIQUE INDEX idx_market_user_date ON public.market_context(user_id, context_date);
CREATE TRIGGER update_market_ts BEFORE UPDATE ON public.market_context FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- 5. ai_sessions - AI 复盘对话
-- ============================================
CREATE TABLE public.ai_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  trade_id UUID REFERENCES public.trades(id) ON DELETE SET NULL,
  session_type TEXT NOT NULL DEFAULT 'review' CHECK (session_type IN ('review', 'emotion', 'strategy', 'general')),
  messages JSONB NOT NULL DEFAULT '[]'::jsonb,
  summary TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.ai_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own ai sessions" ON public.ai_sessions FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX idx_ai_sessions_user ON public.ai_sessions(user_id, created_at DESC);
CREATE TRIGGER update_ai_sessions_ts BEFORE UPDATE ON public.ai_sessions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
