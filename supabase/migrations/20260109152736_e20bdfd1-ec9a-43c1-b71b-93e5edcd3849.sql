-- Create clients table for registrations
CREATE TABLE public.clients (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  client_code TEXT NOT NULL,
  subscription_type TEXT NOT NULL CHECK (subscription_type IN ('mensal', 'trimestral')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;

-- Only authenticated users can insert
CREATE POLICY "Authenticated users can insert clients"
ON public.clients
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = created_by);

-- Only authenticated users can view their own clients
CREATE POLICY "Users can view their own clients"
ON public.clients
FOR SELECT
TO authenticated
USING (auth.uid() = created_by);

-- Users can update their own clients
CREATE POLICY "Users can update their own clients"
ON public.clients
FOR UPDATE
TO authenticated
USING (auth.uid() = created_by);

-- Users can delete their own clients
CREATE POLICY "Users can delete their own clients"
ON public.clients
FOR DELETE
TO authenticated
USING (auth.uid() = created_by);