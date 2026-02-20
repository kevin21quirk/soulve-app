# AWS Deployment Checklist

## Pre-Migration Verification ✅

### 1. Git Repository Status
- [x] **Git repo clean and working** - No uncommitted changes
- [x] **All changes pushed to GitHub** - Latest commit: `af90e67`
- [x] **.env files removed from git tracking** - Credentials secured
- [x] **.gitignore updated** - Environment files properly ignored
- [ ] **Create .env.example** - Template for team members

### 2. Environment Variables Separation

#### Current Status:
- ✅ **Production Supabase keys identified**:
  - URL: `https://btwuqhrkhbblszuipumg.supabase.co`
  - Project ID: `btwuqhrkhbblszuipumg`
  - Publishable Key: `sb_publishable_qJHjWrPXzQFhSNsuAqYD_Q_O6d_XN41`

- ⚠️ **SECURITY ISSUE**: `.env` and `.env.production` were tracked in git
  - **FIXED**: Removed from git tracking
  - **ACTION REQUIRED**: Rotate Supabase keys after migration

#### Environment Files Structure:
```
.env                    # Local development (gitignored)
.env.production         # Production reference (gitignored)
.env.example            # Template for team (committed)
```

### 3. Supabase Configuration

#### Current Setup:
- **Database**: Production Supabase PostgreSQL
- **Auth**: Supabase Auth (production)
- **Storage**: Supabase Storage (needs `avatars` bucket)
- **Client**: `src/integrations/supabase/client.ts` with fallback values

#### For AWS Migration:
- [ ] **Keep Supabase Auth & Database** (recommended)
- [ ] **Or migrate to AWS RDS** (see AWS_MIGRATION_GUIDE.md)
- [ ] **Create avatars bucket in Supabase Storage**
- [ ] **Document all Supabase Edge Functions** (if any)

---

## AWS Architecture (from your diagram)

```
Users (Mobile & Web)
        ↓
Amazon CloudFront (CDN)
        ↓
AWS Amplify (Frontend Hosting)
        ↓
AWS Lambda (Backend Functions)
        ↓
Supabase (Auth & Database)
   ├── Auth & Realtime
   └── Postgres & Storage
```

### AWS WAF (Security Layer)
- Protects against common web exploits
- Rate limiting
- IP filtering

---

## AWS Amplify Deployment Steps

### Step 1: Prepare Build Configuration

Create `amplify.yml` in project root:

```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: dist
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
```

### Step 2: Set Environment Variables in AWS Amplify

**Required Variables:**
```
VITE_SUPABASE_URL=https://btwuqhrkhbblszuipumg.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_qJHjWrPXzQFhSNsuAqYD_Q_O6d_XN41
VITE_SUPABASE_PROJECT_ID=btwuqhrkhbblszuipumg
```

**Set in AWS Amplify Console:**
1. Go to App Settings → Environment variables
2. Add each variable
3. Mark as secret (for keys)

### Step 3: Connect GitHub Repository

```bash
# Via AWS CLI
aws amplify create-app \
  --name soulve-app \
  --repository https://github.com/kevin21quirk/soulve-app \
  --oauth-token <your-github-token> \
  --build-spec amplify.yml

# Or use AWS Console:
# 1. Go to AWS Amplify Console
# 2. Click "New app" → "Host web app"
# 3. Connect GitHub repository
# 4. Select branch: main
# 5. Configure build settings (auto-detected from amplify.yml)
```

### Step 4: Configure CloudFront CDN

**Amplify automatically creates CloudFront distribution, but you can customize:**

1. **Custom Domain**:
   - Add domain in Amplify Console
   - Update DNS records (Route 53 or your registrar)

2. **SSL Certificate**:
   - Amplify provides free SSL via AWS Certificate Manager
   - Or upload custom certificate

3. **Cache Settings**:
   - Default: Optimized for SPA
   - Customize in CloudFront settings if needed

### Step 5: Set Up AWS Lambda Functions (Optional)

If you need backend functions beyond Supabase:

```bash
# Create Lambda function
aws lambda create-function \
  --function-name soulve-api \
  --runtime nodejs18.x \
  --role arn:aws:iam::ACCOUNT_ID:role/lambda-execution-role \
  --handler index.handler \
  --zip-file fileb://function.zip

# Connect to API Gateway
aws apigatewayv2 create-api \
  --name soulve-api \
  --protocol-type HTTP \
  --target arn:aws:lambda:REGION:ACCOUNT_ID:function:soulve-api
```

### Step 6: Configure AWS WAF (Security)

```bash
# Create Web ACL
aws wafv2 create-web-acl \
  --name soulve-waf \
  --scope CLOUDFRONT \
  --default-action Allow={} \
  --rules file://waf-rules.json

# Associate with CloudFront
aws wafv2 associate-web-acl \
  --web-acl-arn arn:aws:wafv2:... \
  --resource-arn arn:aws:cloudfront:...
```

**Recommended WAF Rules:**
- Rate limiting (1000 requests per 5 minutes per IP)
- SQL injection protection
- XSS protection
- Geographic restrictions (if needed)

---

## Deployment Workflow

### Initial Deployment

1. **Commit and push to GitHub**:
   ```bash
   git add .
   git commit -m "Prepare for AWS Amplify deployment"
   git push origin main
   ```

2. **AWS Amplify auto-deploys** on push to main branch

3. **Monitor build** in Amplify Console

4. **Test deployment** at Amplify-provided URL

### Continuous Deployment

- **Every push to main** triggers automatic build and deploy
- **Preview deployments** for pull requests (optional)
- **Rollback** available in Amplify Console

---

## Post-Deployment Tasks

### Immediate:
- [ ] **Test all features** on AWS deployment
- [ ] **Verify Supabase connection** works from AWS
- [ ] **Test authentication** flows
- [ ] **Check file uploads** (avatars bucket)
- [ ] **Verify API calls** to Supabase
- [ ] **Test mobile app** with new backend

### Security:
- [ ] **Rotate Supabase keys** (since they were in git)
- [ ] **Enable AWS WAF** rules
- [ ] **Set up CloudWatch** monitoring
- [ ] **Configure alerts** for errors/downtime
- [ ] **Review IAM permissions**

### Performance:
- [ ] **Enable CloudFront caching**
- [ ] **Configure compression** (gzip/brotli)
- [ ] **Set up performance monitoring**
- [ ] **Optimize bundle size** if needed

### Documentation:
- [ ] **Update README** with AWS deployment info
- [ ] **Document environment variables**
- [ ] **Create runbook** for common issues
- [ ] **Update team on new workflow**

---

## Cost Estimation (AWS)

### AWS Amplify Hosting:
- **Build minutes**: $0.01 per minute (first 1000 free)
- **Hosting**: $0.15/GB stored + $0.15/GB served
- **Estimated**: $5-15/month for small app

### CloudFront CDN:
- **Data transfer**: $0.085/GB (first 10TB)
- **Requests**: $0.0075 per 10,000 requests
- **Estimated**: $10-30/month

### AWS Lambda (if used):
- **Requests**: $0.20 per 1M requests
- **Compute**: $0.0000166667 per GB-second
- **Estimated**: $0-5/month for light usage

### AWS WAF:
- **Web ACL**: $5/month
- **Rules**: $1/month per rule
- **Requests**: $0.60 per 1M requests
- **Estimated**: $10-20/month

### Supabase (Current):
- **Free tier**: Up to 500MB database, 1GB file storage
- **Pro tier**: $25/month (if needed)

**Total Estimated Monthly Cost**: $30-95/month

---

## Rollback Plan

If issues occur:

1. **Immediate rollback** in Amplify Console:
   - Go to App → Deployments
   - Click "Redeploy" on previous version

2. **DNS rollback** (if using custom domain):
   - Update DNS to point back to Vercel
   - TTL: 300s for quick propagation

3. **Keep Vercel deployment** active during transition period

---

## Migration Timeline

- **Day 1**: Set up AWS Amplify, connect GitHub
- **Day 2**: Configure environment variables, test deployment
- **Day 3**: Set up CloudFront, AWS WAF
- **Day 4**: Testing and verification
- **Day 5**: DNS cutover, monitoring

**Total**: 3-5 days for safe migration

---

## Support Resources

- **AWS Amplify Docs**: https://docs.amplify.aws/
- **CloudFront Docs**: https://docs.aws.amazon.com/cloudfront/
- **AWS WAF Docs**: https://docs.aws.amazon.com/waf/
- **Supabase Docs**: https://supabase.com/docs

---

## Next Steps

1. ✅ **Review this checklist**
2. ⚠️ **Rotate Supabase keys** (exposed in git history)
3. 📝 **Create amplify.yml** build configuration
4. 🚀 **Set up AWS Amplify** app
5. 🔐 **Configure environment variables** in AWS
6. 🧪 **Test deployment** thoroughly
7. 🌐 **Update DNS** when ready
