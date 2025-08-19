-- Clean up duplicate policy (we have two similar SELECT policies)
DROP POLICY IF EXISTS "Users can view their own impact metrics" ON public.impact_metrics;