# Supabase Key Update Instructions

## ✅ Keys Rotated Successfully

Your new Supabase credentials have been generated:

- **Publishable Key**: `sb_publishable_lPZSDy9TO63MMVlrT6IxpQ_CVinox2l`
- **Secret Key**: `sb_secret_***` (stored securely, not in git)

---

## 🔧 What Has Been Updated

### 1. Client Configuration
✅ **Updated**: `src/integrations/supabase/client.ts`
- New publishable key set as fallback value
- Frontend will use this key automatically

### 2. Environment Template
✅ **Updated**: `.env.example`
- New publishable key added
- Instructions for team members

---

## 📝 Manual Updates Required

### Local Development (.env)

Create or update your local `.env` file:

```env
VITE_SUPABASE_URL=https://btwuqhrkhbblszuipumg.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_lPZSDy9TO63MMVlrT6IxpQ_CVinox2l
VITE_SUPABASE_PROJECT_ID=btwuqhrkhbblszuipumg
```

### Production Environment (.env.production)

Update your `.env.production` file:

```env
# Production Environment Variables for AWS Deployment

VITE_SUPABASE_URL=https://btwuqhrkhbblszuipumg.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_lPZSDy9TO63MMVlrT6IxpQ_CVinox2l
VITE_SUPABASE_PROJECT_ID=btwuqhrkhbblszuipumg
```

---

## 🚀 AWS Amplify Configuration

When deploying to AWS Amplify, add these environment variables:

**In AWS Amplify Console → App Settings → Environment Variables:**

| Variable Name | Value |
|--------------|-------|
| `VITE_SUPABASE_URL` | `https://btwuqhrkhbblszuipumg.supabase.co` |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | `sb_publishable_lPZSDy9TO63MMVlrT6IxpQ_CVinox2l` |
| `VITE_SUPABASE_PROJECT_ID` | `btwuqhrkhbblszuipumg` |

**Mark as secret**: ✅ (for publishable key)

---

## 🔐 Secret Key Usage

### ⚠️ IMPORTANT: Secret Key Security

The **secret key** (`sb_secret_***`) should:

- ❌ **NEVER** be used in frontend code
- ❌ **NEVER** be committed to git
- ❌ **NEVER** be exposed to client-side JavaScript

### ✅ Where to Use Secret Key:

**Only use in backend/server environments:**

1. **AWS Lambda Functions**:
   ```typescript
   // In Lambda function environment variables
   const supabaseAdmin = createClient(
     process.env.SUPABASE_URL,
     process.env.SUPABASE_SECRET_KEY // Secret key here
   )
   ```

2. **Server-side API Routes** (if you add them):
   ```typescript
   // In Node.js backend
   const supabaseAdmin = createClient(
     process.env.SUPABASE_URL,
     process.env.SUPABASE_SECRET_KEY
   )
   ```

3. **Database Migrations/Scripts**:
   ```bash
   # In CI/CD environment variables
   SUPABASE_SECRET_KEY=sb_secret_*** # Your actual secret key
   ```

### AWS Lambda Environment Variables:

If you create Lambda functions, add in AWS Console:

```
SUPABASE_URL=https://btwuqhrkhbblszuipumg.supabase.co
SUPABASE_SECRET_KEY=sb_secret_*** # Your actual secret key
```

---

## 🧪 Testing New Keys

### 1. Test Local Development

```bash
# Restart dev server
npm run dev

# Test authentication
# - Sign up new user
# - Sign in existing user
# - Test protected routes
```

### 2. Verify Supabase Connection

```bash
# In browser console
console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL)
console.log('Key prefix:', import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY?.substring(0, 20))
```

### 3. Test Key Features

- ✅ User authentication (sign up/sign in)
- ✅ Profile data loading
- ✅ Database queries
- ✅ File uploads (avatars)
- ✅ Real-time subscriptions

---

## 🔄 Vercel Deployment (Current)

If still using Vercel, update environment variables:

1. Go to Vercel Dashboard → Project Settings → Environment Variables
2. Update:
   - `VITE_SUPABASE_PUBLISHABLE_KEY` → `sb_publishable_lPZSDy9TO63MMVlrT6IxpQ_CVinox2l`
3. Redeploy

---

## 📋 Checklist

- [ ] Update local `.env` file with new publishable key
- [ ] Update `.env.production` file with new publishable key
- [ ] Test local development server
- [ ] Verify authentication works
- [ ] Update AWS Amplify environment variables (when ready)
- [ ] Store secret key securely (password manager)
- [ ] Document secret key location for team
- [ ] Test production deployment after AWS migration

---

## 🆘 Troubleshooting

### "Invalid API key" error:
- Verify key is copied correctly (no extra spaces)
- Check environment variable name matches exactly
- Restart dev server after updating .env

### "Authentication failed":
- Confirm new keys are active in Supabase dashboard
- Check Supabase project status (not paused)
- Verify URL matches project ID

### "Database connection error":
- Ensure Supabase project is running
- Check network connectivity
- Verify RLS policies are configured

---

## 📚 References

- **Supabase Dashboard**: https://app.supabase.com/project/btwuqhrkhbblszuipumg
- **API Settings**: https://app.supabase.com/project/btwuqhrkhbblszuipumg/settings/api
- **Supabase Docs**: https://supabase.com/docs/guides/api
