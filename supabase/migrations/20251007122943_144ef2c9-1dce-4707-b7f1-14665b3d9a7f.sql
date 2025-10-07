-- =====================================================
-- PHASE 1: CRITICAL SECURITY INFRASTRUCTURE
-- Safe Space Safeguarding System
-- =====================================================

-- 1. Create safeguarding role enum
CREATE TYPE public.safeguarding_role AS ENUM (
  'safeguarding_lead',
  'senior_reviewer', 
  'crisis_manager'
);

-- 2. Create safeguarding_roles table
CREATE TABLE public.safeguarding_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.safeguarding_role NOT NULL,
  assigned_by UUID REFERENCES auth.users(id),
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, role)
);

ALTER TABLE public.safeguarding_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Safeguarding leads can view all roles"
  ON public.safeguarding_roles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.safeguarding_roles sr
      WHERE sr.user_id = auth.uid()
        AND sr.role = 'safeguarding_lead'
        AND sr.is_active = true
    )
  );

CREATE POLICY "Safeguarding leads can manage roles"
  ON public.safeguarding_roles FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.safeguarding_roles sr
      WHERE sr.user_id = auth.uid()
        AND sr.role = 'safeguarding_lead'
        AND sr.is_active = true
    )
  );

-- 3. Create security definer functions
CREATE OR REPLACE FUNCTION public.has_safeguarding_role(_user_id UUID, _role public.safeguarding_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.safeguarding_roles
    WHERE user_id = _user_id
      AND role = _role
      AND is_active = true
  );
$$;

CREATE OR REPLACE FUNCTION public.is_safeguarding_staff(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.safeguarding_roles
    WHERE user_id = _user_id
      AND is_active = true
  );
$$;

-- 4. Create safe_space_audit_log table
CREATE TABLE public.safe_space_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  action_type TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id UUID,
  details JSONB DEFAULT '{}',
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.safe_space_audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Safeguarding staff can view audit logs"
  ON public.safe_space_audit_log FOR SELECT
  USING (is_safeguarding_staff(auth.uid()));

CREATE POLICY "System can insert audit logs"
  ON public.safe_space_audit_log FOR INSERT
  WITH CHECK (true);

-- 5. Create safe_space_emergency_alerts table
CREATE TABLE public.safe_space_emergency_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES public.safe_space_sessions(id) ON DELETE CASCADE,
  message_id UUID REFERENCES public.safe_space_messages(id) ON DELETE SET NULL,
  alert_type TEXT NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  risk_score INTEGER CHECK (risk_score BETWEEN 0 AND 100),
  detected_keywords TEXT[],
  ai_analysis JSONB DEFAULT '{}',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'acknowledged', 'reviewing', 'resolved', 'escalated')),
  assigned_to UUID REFERENCES auth.users(id),
  acknowledged_at TIMESTAMP WITH TIME ZONE,
  resolved_at TIMESTAMP WITH TIME ZONE,
  resolution_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.safe_space_emergency_alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Safeguarding staff can view alerts"
  ON public.safe_space_emergency_alerts FOR SELECT
  USING (is_safeguarding_staff(auth.uid()));

CREATE POLICY "Safeguarding staff can update alerts"
  ON public.safe_space_emergency_alerts FOR UPDATE
  USING (is_safeguarding_staff(auth.uid()));

CREATE POLICY "System can create alerts"
  ON public.safe_space_emergency_alerts FOR INSERT
  WITH CHECK (true);

-- 6. Create safe_space_flagged_keywords table
CREATE TABLE public.safe_space_flagged_keywords (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  keyword TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  requires_immediate_escalation BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.safe_space_flagged_keywords ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Safeguarding staff can manage keywords"
  ON public.safe_space_flagged_keywords FOR ALL
  USING (is_safeguarding_staff(auth.uid()));

CREATE POLICY "System can read keywords"
  ON public.safe_space_flagged_keywords FOR SELECT
  USING (true);

-- Insert UK-specific crisis keywords
INSERT INTO public.safe_space_flagged_keywords (keyword, category, severity, requires_immediate_escalation) VALUES
  ('suicide', 'self_harm', 'critical', true),
  ('kill myself', 'self_harm', 'critical', true),
  ('end it all', 'self_harm', 'critical', true),
  ('want to die', 'self_harm', 'critical', true),
  ('overdose', 'self_harm', 'critical', true),
  ('cutting', 'self_harm', 'high', true),
  ('self harm', 'self_harm', 'high', true),
  ('harm myself', 'self_harm', 'high', true),
  ('razor', 'self_harm', 'high', false),
  ('pills', 'self_harm', 'medium', false),
  ('jump off', 'self_harm', 'critical', true),
  ('hanging', 'self_harm', 'critical', true),
  ('abuse', 'safety', 'high', true),
  ('hurting me', 'safety', 'high', true),
  ('scared', 'wellbeing', 'medium', false),
  ('alone', 'wellbeing', 'low', false),
  ('hopeless', 'wellbeing', 'medium', false),
  ('no point', 'wellbeing', 'medium', false);

-- 7. Enable pgcrypto extension
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 8. Add encryption columns to safe_space_messages
ALTER TABLE public.safe_space_messages
  ADD COLUMN IF NOT EXISTS encrypted_content BYTEA,
  ADD COLUMN IF NOT EXISTS is_encrypted BOOLEAN DEFAULT false;

-- 9. Create message encryption functions
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

-- 10. Add emergency contact fields to safe_space_helpers
ALTER TABLE public.safe_space_helpers
  ADD COLUMN IF NOT EXISTS emergency_contact_name TEXT,
  ADD COLUMN IF NOT EXISTS emergency_contact_phone TEXT,
  ADD COLUMN IF NOT EXISTS emergency_contact_relationship TEXT,
  ADD COLUMN IF NOT EXISTS dbs_required BOOLEAN DEFAULT false;

-- 11. Add DBS fields to safe_space_verification_documents
ALTER TABLE public.safe_space_verification_documents
  ADD COLUMN IF NOT EXISTS dbs_certificate_number TEXT,
  ADD COLUMN IF NOT EXISTS dbs_issue_date DATE,
  ADD COLUMN IF NOT EXISTS dbs_expiry_date DATE,
  ADD COLUMN IF NOT EXISTS dbs_check_level TEXT CHECK (dbs_check_level IN ('basic', 'standard', 'enhanced'));

-- 12. Update RLS policies for safe_space_sessions
DROP POLICY IF EXISTS "Users can view their own sessions" ON public.safe_space_sessions;
CREATE POLICY "Users can view their own sessions"
  ON public.safe_space_sessions FOR SELECT
  USING (
    auth.uid() = requester_id 
    OR auth.uid() = helper_id 
    OR is_safeguarding_staff(auth.uid())
  );

-- 13. Update RLS policies for safe_space_messages
DROP POLICY IF EXISTS "Participants can view messages" ON public.safe_space_messages;
CREATE POLICY "Participants can view messages"
  ON public.safe_space_messages FOR SELECT
  USING (
    session_id IN (
      SELECT id FROM public.safe_space_sessions
      WHERE requester_id = auth.uid() OR helper_id = auth.uid()
    )
    OR is_safeguarding_staff(auth.uid())
  );

DROP POLICY IF EXISTS "Participants can send messages" ON public.safe_space_messages;
CREATE POLICY "Participants can send messages"
  ON public.safe_space_messages FOR INSERT
  WITH CHECK (
    session_id IN (
      SELECT id FROM public.safe_space_sessions
      WHERE requester_id = auth.uid() OR helper_id = auth.uid()
    )
  );

-- 14. Update RLS policies for safe_space_helpers
DROP POLICY IF EXISTS "Anyone can view verified helpers" ON public.safe_space_helpers;
CREATE POLICY "Anyone can view verified helpers"
  ON public.safe_space_helpers FOR SELECT
  USING (
    verification_status = 'verified'
    OR user_id = auth.uid()
    OR is_safeguarding_staff(auth.uid())
  );

DROP POLICY IF EXISTS "Helpers can update their own profile" ON public.safe_space_helpers;
CREATE POLICY "Helpers can update their own profile"
  ON public.safe_space_helpers FOR UPDATE
  USING (
    user_id = auth.uid()
    OR is_safeguarding_staff(auth.uid())
  );

-- 15. Update RLS policies for safe_space_helper_applications
DROP POLICY IF EXISTS "Admins can view all applications" ON public.safe_space_helper_applications;
DROP POLICY IF EXISTS "Admins can update all applications" ON public.safe_space_helper_applications;

CREATE POLICY "Safeguarding staff can view all applications"
  ON public.safe_space_helper_applications FOR SELECT
  USING (
    user_id = auth.uid()
    OR is_admin(auth.uid())
    OR is_safeguarding_staff(auth.uid())
  );

CREATE POLICY "Safeguarding staff can update applications"
  ON public.safe_space_helper_applications FOR UPDATE
  USING (
    is_admin(auth.uid())
    OR is_safeguarding_staff(auth.uid())
  );

-- 16. Update RLS policies for safe_space_verification_documents
DROP POLICY IF EXISTS "Helpers can upload their documents" ON public.safe_space_verification_documents;
DROP POLICY IF EXISTS "Admins can view all documents" ON public.safe_space_verification_documents;

CREATE POLICY "Helpers can upload their documents"
  ON public.safe_space_verification_documents FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Helpers and safeguarding can view documents"
  ON public.safe_space_verification_documents FOR SELECT
  USING (
    user_id = auth.uid()
    OR is_admin(auth.uid())
    OR is_safeguarding_staff(auth.uid())
  );

CREATE POLICY "Safeguarding staff can update documents"
  ON public.safe_space_verification_documents FOR UPDATE
  USING (
    is_admin(auth.uid())
    OR is_safeguarding_staff(auth.uid())
  );

-- 17. Create triggers for updated_at
CREATE OR REPLACE FUNCTION public.update_safe_space_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_safeguarding_roles_updated_at
  BEFORE UPDATE ON public.safeguarding_roles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_safe_space_updated_at();

CREATE TRIGGER update_emergency_alerts_updated_at
  BEFORE UPDATE ON public.safe_space_emergency_alerts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_safe_space_updated_at();

CREATE TRIGGER update_flagged_keywords_updated_at
  BEFORE UPDATE ON public.safe_space_flagged_keywords
  FOR EACH ROW
  EXECUTE FUNCTION public.update_safe_space_updated_at();

-- 18. Log migration completion (fixed JSONB casting)
INSERT INTO public.safe_space_audit_log (user_id, action_type, resource_type, details)
SELECT 
  id,
  'system_migration',
  'database',
  jsonb_build_object(
    'phase', '1',
    'description', 'Critical Security Infrastructure deployed',
    'timestamp', now()
  )
FROM auth.users
LIMIT 1;