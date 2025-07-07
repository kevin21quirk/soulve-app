-- Fix the infinite recursion in organization_members RLS policy
DROP POLICY IF EXISTS "Users can update their own memberships" ON organization_members;

CREATE POLICY "Users can update their own memberships" 
ON organization_members 
FOR UPDATE 
USING (
  (auth.uid() = user_id) OR 
  (EXISTS ( 
    SELECT 1
    FROM organization_members om_admin
    WHERE om_admin.organization_id = organization_members.organization_id 
      AND om_admin.user_id = auth.uid() 
      AND om_admin.role = 'admin'::text 
      AND om_admin.is_active = true
  ))
);