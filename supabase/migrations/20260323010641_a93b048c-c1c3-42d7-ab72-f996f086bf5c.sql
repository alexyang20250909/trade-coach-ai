ALTER TABLE public.trades DROP CONSTRAINT trades_confidence_score_check;
ALTER TABLE public.trades DROP CONSTRAINT trades_fomo_score_check;
ALTER TABLE public.trades DROP CONSTRAINT trades_decision_logic_check;
ALTER TABLE public.trades ADD CONSTRAINT trades_confidence_score_check CHECK (confidence_score >= 0 AND confidence_score <= 100);
ALTER TABLE public.trades ADD CONSTRAINT trades_fomo_score_check CHECK (fomo_score >= 0 AND fomo_score <= 100);