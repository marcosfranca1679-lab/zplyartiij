-- Add username and password fields to clients table
ALTER TABLE public.clients
ADD COLUMN username TEXT,
ADD COLUMN password TEXT;