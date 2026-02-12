# Quick Start - Local Development

## Current Situation

Your migrations are incremental changes to an existing production database. To run locally from scratch, you have two options:

## Option 1: Start Fresh with Empty Database (Recommended for Now)

This gets you running immediately without migrations:

1. **Start Supabase without migrations**
   ```powershell
   # Temporarily move migrations folder
   Rename-Item supabase\migrations supabase\migrations_backup
   
   # Start Supabase
   npx supabase start
   
   # Restore migrations folder
   Rename-Item supabase\migrations_backup supabase\migrations
   ```

2. **Get your local credentials**
   ```powershell
   npx supabase status
   ```

3. **Create `.env.local`**
   ```env
   VITE_SUPABASE_URL=http://localhost:54321
   VITE_SUPABASE_PUBLISHABLE_KEY=<anon_key_from_status>
   VITE_SUPABASE_PROJECT_ID=local
   ```

4. **Run the app**
   ```powershell
   npm run dev
   ```

5. **Build your schema manually** in Supabase Studio at `http://localhost:54323`

## Option 2: Clone Production Schema (Better for Testing)

This copies your production database structure locally:

1. **Get production database password** from your Supabase dashboard

2. **Export production schema**
   ```powershell
   # You'll need the database password from Supabase dashboard
   npx supabase db dump --db-url "postgresql://postgres:[PASSWORD]@db.anuvztvypsihzlbkewci.supabase.co:5432/postgres" -f schema.sql
   ```

3. **Start local Supabase (without migrations)**
   ```powershell
   # Move migrations temporarily
   Rename-Item supabase\migrations supabase\migrations_backup
   
   # Start Supabase
   npx supabase start
   ```

4. **Import schema to local database**
   ```powershell
   # Get local DB password from: npx supabase status
   psql -h localhost -p 54322 -U postgres -f schema.sql
   ```

5. **Configure and run**
   - Create `.env.local` with local credentials
   - Run `npm run dev`

## Option 3: Use Production Database Temporarily

While setting up local, you can keep using production:

1. **Keep using `.env` file** (already configured for production)
2. **Run the app**: `npm run dev`
3. **Be careful** - changes will affect production!

## Recommended Workflow

For your use case (local dev → Vercel → AWS later):

1. **Now**: Use Option 1 or keep using production temporarily
2. **Build features locally** with fresh database
3. **When ready**: Push to GitHub
4. **Deploy to Vercel** with production Supabase
5. **Later**: Migrate to AWS with proper schema export

## Next Steps

Choose an option above and let me know which one you'd like to proceed with!
