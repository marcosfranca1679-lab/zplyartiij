-- Criar tabela de pagamentos de clientes
CREATE TABLE public.client_payments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  payment_month DATE NOT NULL,
  payment_type TEXT NOT NULL CHECK (payment_type IN ('monthly', 'quarterly')),
  amount NUMERIC NOT NULL,
  paid_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.client_payments ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view payments of their own clients" 
ON public.client_payments 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.clients 
    WHERE clients.id = client_payments.client_id 
    AND clients.created_by = auth.uid()
  )
);

CREATE POLICY "Users can insert payments for their own clients" 
ON public.client_payments 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.clients 
    WHERE clients.id = client_payments.client_id 
    AND clients.created_by = auth.uid()
  )
);

CREATE POLICY "Users can delete payments of their own clients" 
ON public.client_payments 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.clients 
    WHERE clients.id = client_payments.client_id 
    AND clients.created_by = auth.uid()
  )
);

-- Create index for faster queries
CREATE INDEX idx_client_payments_client_id ON public.client_payments(client_id);
CREATE INDEX idx_client_payments_payment_month ON public.client_payments(payment_month);