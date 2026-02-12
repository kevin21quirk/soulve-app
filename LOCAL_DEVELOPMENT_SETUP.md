# Local Development Setup Guide

This guide explains how to run SouLVE locally with a PostgreSQL database before deploying to AWS.

## Overview

You have two options for local development:

1. **Supabase Local Development** (Recommended) - Full local stack with Auth, Storage, Edge Functions
2. **Direct PostgreSQL** - Simpler but requires manual setup of Auth and other services

---

## Option 1: Supabase Local Development (Recommended)

This approach runs a complete Supabase stack locally using Docker, making it easier to migrate to AWS later.

### Prerequisites

1. **Docker Desktop** - Required for running local Supabase
   - Download: https://www.docker.com/products/docker-desktop/
   - Install and ensure Docker is running

2. **Supabase CLI**
   ```powershell
   # Install via npm (globally)
   npm install -g supabase
   
   # Or via Scoop (Windows package manager)
   scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
   scoop install supabase
   ```

### Setup Steps

1. **Start Local Supabase**
   ```powershell
   # Initialize (only needed once)
   supabase init
   
   # Start all services (PostgreSQL, Auth, Storage, etc.)
   supabase start
   ```
   
   This will:
   - Start PostgreSQL on `localhost:54322`
   - Start Supabase Studio on `http://localhost:54323`
   - Apply all migrations from `supabase/migrations/`
   - Set up Auth, Storage, and Edge Functions

2. **Get Local Credentials**
   ```powershell
   supabase status
   ```
   
   This displays your local connection details:
   - API URL: `http://localhost:54321`
   - DB URL: `postgresql://postgres:postgres@localhost:54322/postgres`
   - Studio URL: `http://localhost:54323`
   - Anon Key: (local development key)
   - Service Role Key: (local admin key)

3. **Update Environment Variables**
   
   Create `.env.local` file:
   ```env
   VITE_SUPABASE_URL=http://localhost:54321
   VITE_SUPABASE_PUBLISHABLE_KEY=<anon_key_from_supabase_status>
   VITE_SUPABASE_PROJECT_ID=local
   ```

4. **Run the App**
   ```powershell
   npm run dev
   ```
   
   Your app will now connect to the local database!

5. **Access Supabase Studio**
   
   Open `http://localhost:54323` to:
   - View/edit database tables
   - Test SQL queries
   - Manage users and auth
   - Monitor logs

### Daily Workflow

```powershell
# Start local Supabase
supabase start

# Run your app
npm run dev

# When done, stop Supabase
supabase stop
```

### Database Migrations

```powershell
# Create a new migration
supabase migration new migration_name

# Apply migrations
supabase db reset  # Resets DB and applies all migrations

# Push local changes to remote (when ready)
supabase db push
```

---

## Option 2: Direct PostgreSQL Connection

If you prefer not to use Docker, you can install PostgreSQL directly.

### Prerequisites

1. **PostgreSQL 15+**
   - Download: https://www.postgresql.org/download/windows/
   - Or via Chocolatey: `choco install postgresql`

### Setup Steps

1. **Install PostgreSQL**
   - Set password for `postgres` user during installation
   - Default port: 5432

2. **Create Database**
   ```powershell
   # Connect to PostgreSQL
   psql -U postgres
   
   # Create database
   CREATE DATABASE soulve_local;
   
   # Exit
   \q
   ```

3. **Apply Migrations Manually**
   
   You'll need to run all 37 migration files in order:
   ```powershell
   # Run each migration file
   psql -U postgres -d soulve_local -f supabase/migrations/20240101000000_phase1_optimizations.sql
   # ... repeat for all migrations in chronological order
   ```

4. **Update Environment Variables**
   
   Create `.env.local`:
   ```env
   # Direct PostgreSQL connection
   DATABASE_URL=postgresql://postgres:your_password@localhost:5432/soulve_local
   
   # Note: You'll need to handle Auth separately
   # Supabase Auth won't work with direct PostgreSQL
   ```

5. **Handle Authentication**
   
   With direct PostgreSQL, you'll need to:
   - Implement your own auth system, OR
   - Use a third-party auth provider (Auth0, Clerk, etc.), OR
   - Modify the app to work without Supabase Auth

**⚠️ Warning**: This option requires significant code changes since the app uses Supabase Auth extensively.

---

## Migrating to AWS

Once you're happy with local development, here's the path to AWS:

### AWS Setup Options

**Option A: AWS RDS PostgreSQL + Supabase (Hybrid)**
1. Create RDS PostgreSQL instance
2. Run migrations on RDS
3. Keep using Supabase Auth (hosted) but point to RDS
4. Host Edge Functions on AWS Lambda

**Option B: Full AWS Stack**
1. **Database**: AWS RDS PostgreSQL
2. **Auth**: AWS Cognito or custom solution
3. **Storage**: AWS S3
4. **Functions**: AWS Lambda
5. **API**: AWS API Gateway

**Option C: Self-Hosted Supabase on AWS**
1. Deploy Supabase on EC2/ECS
2. Use RDS PostgreSQL as backend
3. Keep all Supabase features

### Migration Steps

1. **Export Local Schema**
   ```powershell
   supabase db dump -f schema.sql
   ```

2. **Set up AWS RDS**
   - Create PostgreSQL instance
   - Configure security groups
   - Note connection details

3. **Import to AWS**
   ```powershell
   psql -h your-rds-endpoint.amazonaws.com -U postgres -d soulve -f schema.sql
   ```

4. **Update Environment Variables**
   ```env
   VITE_SUPABASE_URL=https://your-aws-endpoint.com
   VITE_SUPABASE_PUBLISHABLE_KEY=your_production_key
   ```

5. **Deploy Application**
   - AWS Amplify (easiest for React apps)
   - AWS EC2 + Nginx
   - AWS ECS (Docker containers)
   - AWS S3 + CloudFront (static hosting)

---

## Recommended Approach

**For your use case**, I recommend:

1. ✅ **Start with Supabase Local** (Option 1)
   - Easiest setup
   - Preserves all existing functionality
   - All 37 migrations work automatically
   - Auth, Storage, Functions included

2. ✅ **Develop and test locally**
   - Make changes
   - Test thoroughly
   - Iterate quickly

3. ✅ **Deploy to AWS with RDS**
   - Create RDS PostgreSQL instance
   - Run migrations on RDS
   - Update connection strings
   - Deploy app to AWS Amplify/EC2

This gives you the best of both worlds: easy local development with full feature parity, and production deployment on AWS infrastructure.

---

## Next Steps

1. Install Docker Desktop
2. Install Supabase CLI
3. Run `supabase start`
4. Create `.env.local` with local credentials
5. Test the app locally
6. Plan AWS architecture

## Useful Commands

```powershell
# Supabase
supabase start          # Start local stack
supabase stop           # Stop local stack
supabase status         # Show connection details
supabase db reset       # Reset DB and reapply migrations
supabase db diff        # Show schema differences
supabase db push        # Push local changes to remote

# Database
psql -h localhost -p 54322 -U postgres  # Connect to local DB

# App
npm run dev             # Start dev server
npm run build           # Build for production
```

## Support

- Supabase Docs: https://supabase.com/docs/guides/local-development
- AWS RDS Docs: https://docs.aws.amazon.com/rds/
- PostgreSQL Docs: https://www.postgresql.org/docs/
