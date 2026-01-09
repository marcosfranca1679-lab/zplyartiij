-- Add password_hash column to store hashed passwords securely
ALTER TABLE public.clients
ADD COLUMN password_hash TEXT;

-- Note: Existing plaintext passwords cannot be migrated to hashes
-- as we cannot reverse-hash them. They will remain in the password column
-- until the old column is dropped and users set new passwords.

-- Drop the insecure plaintext password column
ALTER TABLE public.clients DROP COLUMN password;