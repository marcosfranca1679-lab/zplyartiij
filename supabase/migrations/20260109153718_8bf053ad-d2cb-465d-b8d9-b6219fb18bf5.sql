-- Add registration_date column to clients table
ALTER TABLE public.clients 
ADD COLUMN registration_date DATE NOT NULL DEFAULT CURRENT_DATE;