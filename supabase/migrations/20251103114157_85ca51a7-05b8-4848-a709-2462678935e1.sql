-- Create table for coupon codes
CREATE TABLE public.coupons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  is_redeemed BOOLEAN NOT NULL DEFAULT false,
  redeemed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for coupon redemptions
CREATE TABLE public.coupon_redemptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone_number TEXT NOT NULL,
  coupon_id UUID REFERENCES public.coupons(id) ON DELETE CASCADE,
  redeemed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(phone_number)
);

-- Enable RLS
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupon_redemptions ENABLE ROW LEVEL SECURITY;

-- RLS Policies - Allow everyone to read coupons
CREATE POLICY "Anyone can view coupons"
ON public.coupons
FOR SELECT
USING (true);

-- Allow anyone to view redemptions (to check if phone already redeemed)
CREATE POLICY "Anyone can view redemptions"
ON public.coupon_redemptions
FOR SELECT
USING (true);

-- Allow anyone to insert redemptions
CREATE POLICY "Anyone can redeem coupons"
ON public.coupon_redemptions
FOR INSERT
WITH CHECK (true);

-- Allow system to update coupons when redeemed
CREATE POLICY "Anyone can update coupons"
ON public.coupons
FOR UPDATE
USING (true);

-- Insert the 32 coupon codes
INSERT INTO public.coupons (code) VALUES
('X4G7P2LM'),
('A9T6Z3QK'),
('R7B1V5NC'),
('T2L8H9SF'),
('Z5D3X7KM'),
('P8F2C9RJ'),
('G4B1T6QW'),
('N3V7Y2PL'),
('M6K4X1EJ'),
('H2Q9R5AT'),
('J7N3B8UZ'),
('F9T2S6CX'),
('W5V4P1MD'),
('Q8G3Z7LH'),
('Y6A9R4KT'),
('L2J5X8FP'),
('D7T1Y3BW'),
('K9M4Q2RS'),
('C3Z6V5NX'),
('U8R7H2PG'),
('S5B1W9KQ'),
('O4J3X8LE'),
('M7F6T2PD'),
('P1V9A5HR'),
('G3N8Y4CK'),
('Z6L2Q9TB'),
('D7S5R1MW'),
('E4C8X2JN'),
('H9Y7K3QP'),
('V2B4M6LX'),
('N8R1F5GC'),
('T3J9Z7DW');