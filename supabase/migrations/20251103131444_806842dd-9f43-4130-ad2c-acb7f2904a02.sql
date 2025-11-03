-- Add device fingerprint column to coupon_redemptions
ALTER TABLE public.coupon_redemptions
ADD COLUMN device_fingerprint TEXT;

-- Add unique constraint on device fingerprint
ALTER TABLE public.coupon_redemptions
ADD CONSTRAINT unique_device_fingerprint UNIQUE (device_fingerprint);