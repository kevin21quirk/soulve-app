# Supabase Data Migration Guide

## Overview
Migrating data from old Supabase project to new project:
- **Old Project**: `anuvztvypsihzlbkewci`
- **New Project**: `btwuqhrkhbblszuipumg`

## Migration Steps

### 1. Export Data from Old Project

#### Option A: Using Supabase Dashboard (Recommended for Small Datasets)

1. **Go to old project SQL Editor:**
   https://supabase.com/dashboard/project/anuvztvypsihzlbkewci/sql/new

2. **Export each table as CSV:**
   ```sql
   -- Export profiles
   COPY (SELECT * FROM public.profiles) TO STDOUT WITH CSV HEADER;
   
   -- Export questionnaire_responses
   COPY (SELECT * FROM public.questionnaire_responses) TO STDOUT WITH CSV HEADER;
   
   -- Export posts (if any)
   COPY (SELECT * FROM public.posts) TO STDOUT WITH CSV HEADER;
   
   -- Add other tables as needed
   ```

3. **Save each export to a CSV file**

#### Option B: Using pg_dump (Recommended for Large Datasets)

1. **Get connection strings from both projects:**
   - Old: https://supabase.com/dashboard/project/anuvztvypsihzlbkewci/settings/database
   - New: https://supabase.com/dashboard/project/btwuqhrkhbblszuipumg/settings/database

2. **Export schema and data:**
   ```bash
   # Export only data (no schema) from old project
   pg_dump "postgresql://postgres:[OLD_PASSWORD]@db.anuvztvypsihzlbkewci.supabase.co:5432/postgres" \
     --data-only \
     --schema=public \
     --exclude-table-data='auth.*' \
     --exclude-table-data='storage.*' \
     > old_data.sql
   ```

3. **Import to new project:**
   ```bash
   psql "postgresql://postgres:[NEW_PASSWORD]@db.btwuqhrkhbblszuipumg.supabase.co:5432/postgres" \
     < old_data.sql
   ```

### 2. Migrate Auth Users

**IMPORTANT:** Auth users are in the `auth.users` table and need special handling.

#### Step 1: Export users from old project
```sql
-- Run in OLD project SQL Editor
SELECT 
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_user_meta_data,
  raw_app_meta_data
FROM auth.users
ORDER BY created_at;
```

Save this data to a CSV or JSON file.

#### Step 2: Import users to new project

**Option A: Invite users to re-register**
- Send password reset emails to all users
- They create new accounts in the new system

**Option B: Manually migrate users (requires Supabase CLI)**
```bash
# Use Supabase CLI to create users with same IDs
supabase db remote commit --project-ref btwuqhrkhbblszuipumg
```

**Option C: SQL Script (Advanced)**
```sql
-- Run in NEW project SQL Editor
-- WARNING: This requires matching user IDs between projects

INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_user_meta_data,
  raw_app_meta_data
)
SELECT 
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_user_meta_data,
  raw_app_meta_data
FROM old_users_backup
ON CONFLICT (id) DO NOTHING;
```

### 3. Migrate Storage Files

1. **Download files from old storage:**
   - Go to: https://supabase.com/dashboard/project/anuvztvypsihzlbkewci/storage/buckets
   - Download all buckets (avatars, banners, post-media, etc.)

2. **Upload to new storage:**
   - Go to: https://supabase.com/dashboard/project/btwuqhrkhbblszuipumg/storage/buckets
   - Create matching buckets
   - Upload files maintaining the same folder structure

### 4. Verify Migration

Run these checks in the NEW project:

```sql
-- Check user counts match
SELECT COUNT(*) as total_users FROM auth.users;
SELECT COUNT(*) as total_profiles FROM public.profiles;

-- Check data integrity
SELECT 
  u.email,
  p.first_name,
  p.last_name,
  p.waitlist_status,
  CASE 
    WHEN qr.id IS NOT NULL THEN 'Has Questionnaire'
    ELSE 'Missing Questionnaire'
  END as onboarding_status
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
LEFT JOIN public.questionnaire_responses qr ON u.id = qr.user_id
ORDER BY u.created_at DESC
LIMIT 20;

-- Check for orphaned records
SELECT 'Profiles without users' as issue, COUNT(*) as count
FROM public.profiles p
LEFT JOIN auth.users u ON p.id = u.id
WHERE u.id IS NULL

UNION ALL

SELECT 'Users without profiles' as issue, COUNT(*) as count
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE p.id IS NULL;
```

## Important Notes

1. **Backup first:** Always backup both databases before migration
2. **Test in staging:** If possible, test the migration process first
3. **User IDs must match:** Profile IDs must match auth.users IDs
4. **Email verification:** Users may need to re-verify emails
5. **Storage URLs:** Update any hardcoded storage URLs in the app
6. **RLS Policies:** Ensure all RLS policies are set up in new project

## Rollback Plan

If migration fails:
1. Re-pause the new project
2. Re-activate the old project
3. Point the app back to the old project URL
4. Investigate issues before retrying

## Post-Migration Checklist

- [ ] All users can log in
- [ ] All profiles display correctly
- [ ] All posts/content visible
- [ ] File uploads work
- [ ] Admin functions work
- [ ] Waitlist system works
- [ ] Email notifications work
- [ ] Update environment variables in deployment (AWS Amplify)
