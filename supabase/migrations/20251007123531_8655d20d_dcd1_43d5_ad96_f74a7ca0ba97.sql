-- Fix search_path security warning for encryption and trigger functions

CREATE OR REPLACE FUNCTION public.encrypt_message(message_text TEXT)
RETURNS BYTEA
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  encryption_key TEXT;
BEGIN
  encryption_key := COALESCE(current_setting('app.encryption_key', true), 'default_key_change_in_production');
  RETURN pgp_sym_encrypt(message_text, encryption_key);
END;
$$;

CREATE OR REPLACE FUNCTION public.decrypt_message(encrypted_data BYTEA)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  encryption_key TEXT;
BEGIN
  encryption_key := COALESCE(current_setting('app.encryption_key', true), 'default_key_change_in_production');
  RETURN pgp_sym_decrypt(encrypted_data, encryption_key);
END;
$$;

CREATE OR REPLACE FUNCTION public.update_safe_space_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;