-- Criar tabela para armazenar informações de pagamentos
CREATE TABLE public.payments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  whatsapp TEXT NOT NULL,
  email TEXT NOT NULL,
  plan_type TEXT NOT NULL,
  coupon_code TEXT,
  discount_percent INTEGER DEFAULT 0,
  final_price DECIMAL(10,2) NOT NULL,
  preference_id TEXT NOT NULL,
  payment_status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Política para impedir leitura pública (apenas admin pode ver)
CREATE POLICY "No public read of payments" 
ON public.payments 
FOR SELECT 
USING (false);