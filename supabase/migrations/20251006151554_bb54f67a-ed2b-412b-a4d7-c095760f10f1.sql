
-- ============================================
-- CRITICAL FIX: RLS Infinite Recursion & Performance
-- ============================================

-- Step 1: Drop all problematic recursive policies on admin_roles
DROP POLICY IF EXISTS "Admins can manage admin roles" ON public.admin_roles;
DROP POLICY IF EXISTS "Admins can manage all admin roles" ON public.admin_roles;
DROP POLICY IF EXISTS "Users can view their own admin status" ON public.admin_roles;

-- Step 2: Create new safe policies using the existing is_admin() function
CREATE POLICY "admin_roles_select_own" ON public.admin_roles
FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "admin_roles_admin_all" ON public.admin_roles
FOR ALL USING (is_admin(auth.uid()));

-- Step 3: Drop problematic campaign_participants policies
DROP POLICY IF EXISTS "Campaign participants visible to campaign creator and participa" ON public.campaign_participants;
DROP POLICY IF EXISTS "Campaign creators can view all participants" ON public.campaign_participants;
DROP POLICY IF EXISTS "Users can view their own participations" ON public.campaign_participants;

-- The newer safe policies (cp_select_access, cp_insert_own, etc.) are already good
-- Just ensure we have comprehensive coverage

-- Step 4: Add missing safe policy for campaign updates by creator
CREATE POLICY "cp_update_creator" ON public.campaign_participants
FOR UPDATE USING (
  is_campaign_creator(campaign_id, auth.uid()) OR is_user_admin(auth.uid())
)
WITH CHECK (
  is_campaign_creator(campaign_id, auth.uid()) OR is_user_admin(auth.uid())
);

-- ============================================
-- PERFORMANCE OPTIMIZATIONS
-- ============================================

-- Step 5: Add critical indexes for connections
CREATE INDEX IF NOT EXISTS idx_connections_requester_status 
ON public.connections(requester_id, status);

CREATE INDEX IF NOT EXISTS idx_connections_addressee_status 
ON public.connections(addressee_id, status);

CREATE INDEX IF NOT EXISTS idx_connections_both_users 
ON public.connections(requester_id, addressee_id);

-- Step 6: Add indexes for profiles search
CREATE INDEX IF NOT EXISTS idx_profiles_name_search 
ON public.profiles(first_name, last_name) 
WHERE first_name IS NOT NULL OR last_name IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_profiles_location 
ON public.profiles(location) 
WHERE location IS NOT NULL;

-- Step 7: Add indexes for posts/feed performance
CREATE INDEX IF NOT EXISTS idx_posts_author_created 
ON public.posts(author_id, created_at DESC) 
WHERE is_active = true;

CREATE INDEX IF NOT EXISTS idx_posts_category_created 
ON public.posts(category, created_at DESC) 
WHERE is_active = true;

-- Step 8: Add indexes for notifications
CREATE INDEX IF NOT EXISTS idx_notifications_recipient_read 
ON public.notifications(recipient_id, is_read, created_at DESC);

-- Step 9: Add indexes for messages
CREATE INDEX IF NOT EXISTS idx_messages_conversation 
ON public.messages(sender_id, recipient_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_messages_unread 
ON public.messages(recipient_id, is_read) 
WHERE is_read = false;

-- Step 10: Add indexes for campaign performance
CREATE INDEX IF NOT EXISTS idx_campaigns_creator_status 
ON public.campaigns(creator_id, status);

CREATE INDEX IF NOT EXISTS idx_campaign_participants_user 
ON public.campaign_participants(user_id, campaign_id);

-- ============================================
-- ADDITIONAL SECURITY FUNCTIONS
-- ============================================

-- Step 11: Create helper function to prevent duplicate connections
CREATE OR REPLACE FUNCTION public.prevent_duplicate_connections()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Prevent self-connections
  IF NEW.requester_id = NEW.addressee_id THEN
    RAISE EXCEPTION 'Cannot connect with yourself';
  END IF;
  
  -- Check for existing connection in either direction
  IF EXISTS (
    SELECT 1 FROM public.connections
    WHERE (requester_id = NEW.requester_id AND addressee_id = NEW.addressee_id)
       OR (requester_id = NEW.addressee_id AND addressee_id = NEW.requester_id)
  ) THEN
    RAISE EXCEPTION 'Connection already exists';
  END IF;
  
  RETURN NEW;
END;
$$;

-- Step 12: Add trigger for duplicate prevention
DROP TRIGGER IF EXISTS prevent_duplicate_connections_trigger ON public.connections;
CREATE TRIGGER prevent_duplicate_connections_trigger
  BEFORE INSERT ON public.connections
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_duplicate_connections();

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Verify no recursive policies remain
DO $$
BEGIN
  RAISE NOTICE 'Migration completed successfully!';
  RAISE NOTICE 'Please verify:';
  RAISE NOTICE '1. No infinite recursion errors in logs';
  RAISE NOTICE '2. Admin users can access admin panel';
  RAISE NOTICE '3. Connections display correctly';
  RAISE NOTICE '4. Campaign participants can be viewed';
END $$;
