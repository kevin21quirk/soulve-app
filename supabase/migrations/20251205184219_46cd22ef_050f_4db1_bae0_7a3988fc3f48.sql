-- Add user to admin_roles table with super_admin role
INSERT INTO admin_roles (user_id, role)
VALUES ('7443738d-7bb0-4fce-aeca-e6a6c5ae3721', 'super_admin');

-- Update waitlist_status to approved as backup
UPDATE profiles 
SET waitlist_status = 'approved' 
WHERE id = '7443738d-7bb0-4fce-aeca-e6a6c5ae3721';