# AWS Migration Guide

This guide outlines the process for migrating SouLVE from local development to AWS infrastructure.

## Architecture Overview

### Current Stack (Local Development)
- **Database**: Supabase PostgreSQL (local via Docker)
- **Auth**: Supabase Auth
- **Storage**: Supabase Storage
- **Functions**: Supabase Edge Functions
- **Frontend**: React + Vite (localhost:8080)

### Target AWS Stack

**Option A: AWS RDS + Supabase Services (Recommended for easiest migration)**
- **Database**: AWS RDS PostgreSQL
- **Auth**: Supabase Auth (hosted)
- **Storage**: AWS S3 (or keep Supabase Storage)
- **Functions**: AWS Lambda
- **Frontend**: AWS Amplify or S3 + CloudFront
- **API**: AWS API Gateway

**Option B: Full AWS Native Stack (Most control)**
- **Database**: AWS RDS PostgreSQL
- **Auth**: AWS Cognito
- **Storage**: AWS S3
- **Functions**: AWS Lambda
- **Frontend**: AWS Amplify or S3 + CloudFront
- **API**: AWS API Gateway
- **CDN**: AWS CloudFront

**Option C: Self-Hosted Supabase on AWS (Keep all features)**
- **Database**: AWS RDS PostgreSQL
- **Supabase**: Self-hosted on EC2/ECS
- **Storage**: AWS S3 (via Supabase)
- **Frontend**: AWS Amplify or S3 + CloudFront

---

## Pre-Migration Checklist

- [ ] Test all features locally
- [ ] Document all environment variables
- [ ] Export database schema and data
- [ ] List all Supabase functions used
- [ ] Identify all storage buckets and files
- [ ] Review authentication flows
- [ ] Document API endpoints
- [ ] Create backup of current production data (if applicable)

---

## Migration Path: Option A (Recommended)

This approach minimizes code changes while moving to AWS infrastructure.

### Phase 1: Set Up AWS Infrastructure

#### 1.1 Create AWS RDS PostgreSQL Instance

```bash
# Via AWS CLI
aws rds create-db-instance \
  --db-instance-identifier soulve-production \
  --db-instance-class db.t3.medium \
  --engine postgres \
  --engine-version 15.4 \
  --master-username soulveadmin \
  --master-user-password <secure-password> \
  --allocated-storage 20 \
  --storage-type gp3 \
  --vpc-security-group-ids sg-xxxxx \
  --db-subnet-group-name soulve-db-subnet \
  --backup-retention-period 7 \
  --preferred-backup-window "03:00-04:00" \
  --preferred-maintenance-window "sun:04:00-sun:05:00" \
  --publicly-accessible false \
  --storage-encrypted \
  --enable-cloudwatch-logs-exports '["postgresql"]'
```

**Or via AWS Console:**
1. Go to RDS → Create database
2. Choose PostgreSQL 15.x
3. Select production template
4. Configure:
   - DB instance identifier: `soulve-production`
   - Master username: `soulveadmin`
   - Master password: (secure password)
   - Instance type: `db.t3.medium` (adjust based on needs)
   - Storage: 20 GB SSD (auto-scaling enabled)
   - VPC: Create new or use existing
   - Public access: No (use VPN or bastion host)
   - Encryption: Enabled
   - Backup: 7 days retention

#### 1.2 Configure Security Groups

```bash
# Allow PostgreSQL access from your application
aws ec2 authorize-security-group-ingress \
  --group-id sg-xxxxx \
  --protocol tcp \
  --port 5432 \
  --source-group sg-app-xxxxx
```

#### 1.3 Create S3 Bucket for Storage

```bash
aws s3 mb s3://soulve-production-storage
aws s3api put-bucket-versioning \
  --bucket soulve-production-storage \
  --versioning-configuration Status=Enabled
```

### Phase 2: Database Migration

#### 2.1 Export Local Database Schema

```powershell
# Export schema and data
supabase db dump -f backup.sql

# Or export schema only
supabase db dump --schema-only -f schema.sql
```

#### 2.2 Connect to AWS RDS

```powershell
# Get RDS endpoint from AWS Console
$RDS_ENDPOINT = "soulve-production.xxxxx.us-east-1.rds.amazonaws.com"

# Connect via psql
psql -h $RDS_ENDPOINT -U soulveadmin -d postgres
```

#### 2.3 Import Database

```powershell
# Create database
psql -h $RDS_ENDPOINT -U soulveadmin -d postgres -c "CREATE DATABASE soulve;"

# Import schema and data
psql -h $RDS_ENDPOINT -U soulveadmin -d soulve -f backup.sql

# Or run migrations in order
Get-ChildItem supabase/migrations/*.sql | Sort-Object Name | ForEach-Object {
    Write-Host "Running migration: $($_.Name)"
    psql -h $RDS_ENDPOINT -U soulveadmin -d soulve -f $_.FullName
}
```

#### 2.4 Verify Migration

```sql
-- Connect to RDS
psql -h $RDS_ENDPOINT -U soulveadmin -d soulve

-- Check tables
\dt

-- Verify row counts
SELECT 
  schemaname,
  tablename,
  n_live_tup as row_count
FROM pg_stat_user_tables
ORDER BY n_live_tup DESC;

-- Test a query
SELECT COUNT(*) FROM profiles;
```

### Phase 3: Configure Supabase to Use AWS RDS

#### 3.1 Update Supabase Project Settings

1. Go to Supabase Dashboard
2. Project Settings → Database
3. Update connection pooler to point to AWS RDS (if using Supabase Auth)

**Or** create a new Supabase project and link it to your RDS:
- This requires Supabase Enterprise plan
- Contact Supabase support for custom database configuration

#### 3.2 Alternative: Direct RDS Connection

Update your app to connect directly to RDS:

```typescript
// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

// For direct RDS connection (requires custom auth implementation)
const databaseUrl = import.meta.env.VITE_DATABASE_URL

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

### Phase 4: Migrate Edge Functions to AWS Lambda

#### 4.1 Convert Supabase Functions to Lambda

Example: Convert `ai-recommendations` function

```typescript
// Original: supabase/functions/ai-recommendations/index.ts
// Target: AWS Lambda handler

import { APIGatewayProxyHandler } from 'aws-lambda';

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    // Your existing function logic here
    const body = JSON.parse(event.body || '{}');
    
    // Process request
    const result = await processRecommendations(body);
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(result)
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
```

#### 4.2 Deploy Functions

```bash
# Using AWS SAM
sam build
sam deploy --guided

# Or using Serverless Framework
serverless deploy
```

### Phase 5: Deploy Frontend to AWS

#### Option A: AWS Amplify (Easiest)

```bash
# Install Amplify CLI
npm install -g @aws-amplify/cli

# Initialize Amplify
amplify init

# Add hosting
amplify add hosting

# Deploy
amplify publish
```

#### Option B: S3 + CloudFront

```bash
# Build the app
npm run build

# Upload to S3
aws s3 sync dist/ s3://soulve-production-web

# Create CloudFront distribution
aws cloudfront create-distribution \
  --origin-domain-name soulve-production-web.s3.amazonaws.com \
  --default-root-object index.html
```

### Phase 6: Update Environment Variables

#### Production Environment Variables

```env
# AWS RDS Database
VITE_DATABASE_URL=postgresql://soulveadmin:password@soulve-production.xxxxx.rds.amazonaws.com:5432/soulve

# Supabase (if keeping Supabase Auth)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your_production_key
VITE_SUPABASE_PROJECT_ID=your_project_id

# AWS Services
VITE_AWS_REGION=us-east-1
VITE_AWS_S3_BUCKET=soulve-production-storage
VITE_AWS_API_GATEWAY_URL=https://xxxxx.execute-api.us-east-1.amazonaws.com

# Other
VITE_APP_ENV=production
```

### Phase 7: Testing

#### 7.1 Test Database Connection

```typescript
// Test script
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_PUBLISHABLE_KEY!
)

async function testConnection() {
  const { data, error } = await supabase.from('profiles').select('count')
  console.log('Connection test:', { data, error })
}

testConnection()
```

#### 7.2 Test Authentication

- Sign up new user
- Sign in existing user
- Password reset flow
- Email verification

#### 7.3 Test Core Features

- [ ] User registration and login
- [ ] Profile management
- [ ] Campaign creation
- [ ] Donations
- [ ] ESG tracking
- [ ] Messaging
- [ ] File uploads
- [ ] Search functionality

### Phase 8: DNS and Domain Setup

```bash
# Point domain to CloudFront/Amplify
# Update DNS records in your domain registrar

# Example Route 53 record
aws route53 change-resource-record-sets \
  --hosted-zone-id Z1234567890ABC \
  --change-batch file://dns-change.json
```

---

## Cost Estimation

### Monthly AWS Costs (Estimated)

**Small Scale (< 1000 users)**
- RDS db.t3.medium: ~$60/month
- S3 Storage (100 GB): ~$2.30/month
- CloudFront (100 GB transfer): ~$8.50/month
- Lambda (1M requests): ~$0.20/month
- **Total: ~$71/month**

**Medium Scale (1000-10000 users)**
- RDS db.t3.large: ~$120/month
- S3 Storage (500 GB): ~$11.50/month
- CloudFront (500 GB transfer): ~$42.50/month
- Lambda (10M requests): ~$2/month
- **Total: ~$176/month**

**Large Scale (10000+ users)**
- RDS db.r5.xlarge: ~$400/month
- S3 Storage (2 TB): ~$47/month
- CloudFront (2 TB transfer): ~$170/month
- Lambda (50M requests): ~$10/month
- **Total: ~$627/month**

---

## Rollback Plan

If issues occur during migration:

1. **Keep local Supabase running** as backup
2. **Maintain current production** until AWS is fully tested
3. **Use feature flags** to gradually roll out AWS backend
4. **Database backup** before any destructive operations
5. **DNS TTL** set to low value (300s) for quick rollback

---

## Post-Migration Tasks

- [ ] Set up monitoring (CloudWatch, Datadog, etc.)
- [ ] Configure automated backups
- [ ] Set up CI/CD pipeline
- [ ] Enable AWS WAF for security
- [ ] Configure auto-scaling
- [ ] Set up alerting
- [ ] Document new architecture
- [ ] Update team documentation
- [ ] Train team on AWS services

---

## Support Resources

- **AWS Support**: https://console.aws.amazon.com/support/
- **Supabase Docs**: https://supabase.com/docs
- **AWS RDS Docs**: https://docs.aws.amazon.com/rds/
- **AWS Lambda Docs**: https://docs.aws.amazon.com/lambda/

---

## Timeline Estimate

- **Phase 1-2** (Infrastructure + DB): 1-2 days
- **Phase 3-4** (Services + Functions): 2-3 days
- **Phase 5** (Frontend deployment): 1 day
- **Phase 6-7** (Config + Testing): 2-3 days
- **Phase 8** (DNS + Go-live): 1 day

**Total: 7-10 days** (depending on complexity and testing requirements)
