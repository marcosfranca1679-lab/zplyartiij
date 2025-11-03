-- Add IP address column to coupon_redemptions
ALTER TABLE public.coupon_redemptions
ADD COLUMN ip_address TEXT;

-- Add unique constraint on IP address
ALTER TABLE public.coupon_redemptions
ADD CONSTRAINT unique_ip_address UNIQUE (ip_address);