-- SECURITY FIX MIGRATION (error-level issues)
-- 1) Ensure RLS is enabled on sensitive tables
ALTER TABLE public.coupon_redemptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;

-- 2) Fix public PII exposure: remove public SELECT on coupon_redemptions and deny by default
DROP POLICY IF EXISTS "Anyone can view redemptions" ON public.coupon_redemptions;
CREATE POLICY "No public read of redemptions"
ON public.coupon_redemptions
FOR SELECT
USING (false);

-- Keep existing INSERT policy temporarily to avoid downtime in the UI; will be revisited after server flow is live

-- 3) Fix unrestricted updates on coupons: remove public UPDATE policy
DROP POLICY IF EXISTS "Anyone can update coupons" ON public.coupons;

-- 4) Add DB-backed rate limiting support table (no public access)
CREATE TABLE IF NOT EXISTS public.coupon_redemption_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_address text NOT NULL,
  phone_number text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.coupon_redemption_attempts ENABLE ROW LEVEL SECURITY;

-- Deny public reads (no data exposure)
DROP POLICY IF EXISTS "Public can view attempts" ON public.coupon_redemption_attempts;
CREATE POLICY "No public read on attempts"
ON public.coupon_redemption_attempts
FOR SELECT
USING (false);

-- Intentionally no INSERT/UPDATE/DELETE policies so only server (service role) can write