# Vercel Deployment Guide

This guide explains how to deploy SouLVE to Vercel for online showcase.

## Prerequisites

- GitHub repository: `https://github.com/kevin21quirk/soulve-app` ✅
- Vercel account (free): https://vercel.com/signup
- Production Supabase credentials (from `.env` file)

## Deployment Steps

### 1. Push Your Code to GitHub

Your code is already synced with GitHub. Before deploying, make sure all changes are committed:

```powershell
git add .
git commit -m "Ready for Vercel deployment"
git push
```

### 2. Create Vercel Project

**Option A: Via Vercel Dashboard (Recommended)**

1. Go to https://vercel.com/new
2. Click "Import Git Repository"
3. Select your GitHub account
4. Find and import `kevin21quirk/soulve-app`
5. Configure project:
   - **Framework Preset**: Vite
   - **Root Directory**: `./` (leave as default)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

**Option B: Via Vercel CLI**

```powershell
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel
```

### 3. Configure Environment Variables

In Vercel dashboard, go to: **Project Settings → Environment Variables**

Add these variables (use values from your `.env` file):

```
VITE_SUPABASE_URL=https://anuvztvypsihzlbkewci.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_SUPABASE_PROJECT_ID=anuvztvypsihzlbkewci
```

**Important**: Use your **production** Supabase credentials, NOT the local ones!

### 4. Deploy

Click **Deploy** button in Vercel dashboard.

Vercel will:
- Clone your repository
- Install dependencies
- Build the project
- Deploy to a production URL

Your app will be live at: `https://your-project-name.vercel.app`

## Automatic Deployments

Vercel automatically deploys when you push to GitHub:

- **Push to `main` branch** → Production deployment
- **Push to other branches** → Preview deployment

### Workflow:

```powershell
# Make changes locally
# Test with local Supabase

# Commit and push
git add .
git commit -m "Add new feature"
git push

# Vercel automatically deploys!
```

## Custom Domain (Optional)

To use your own domain:

1. Go to **Project Settings → Domains**
2. Add your domain (e.g., `soulve.com`)
3. Update DNS records as instructed
4. Vercel handles SSL automatically

## Environment Management

### Local Development
- Uses `.env.local` (local Supabase)
- Database: `http://localhost:54321`
- Changes stay local

### Vercel Production
- Uses environment variables in Vercel dashboard
- Database: Production Supabase
- Live for users

### Keeping Them Separate

```
Local (.env.local)          Production (Vercel)
├─ Local Supabase          ├─ Production Supabase
├─ Test data               ├─ Real user data
├─ Safe to break           ├─ Must be stable
└─ Not in git              └─ Configured in Vercel
```

## Deployment Checklist

Before deploying to production:

- [ ] All features tested locally
- [ ] No console errors
- [ ] Environment variables configured in Vercel
- [ ] Using production Supabase credentials
- [ ] Code pushed to GitHub
- [ ] Build succeeds locally (`npm run build`)

## Troubleshooting

### Build Fails

Check build logs in Vercel dashboard. Common issues:

```powershell
# Test build locally first
npm run build

# Check for TypeScript errors
npm run lint
```

### Environment Variables Not Working

- Ensure variables start with `VITE_`
- Redeploy after adding variables
- Check variable names match exactly

### Database Connection Issues

- Verify Supabase URL and key in Vercel
- Check Supabase project is active
- Ensure RLS policies allow access

## Monitoring

Vercel provides:
- **Analytics**: Traffic and performance
- **Logs**: Runtime errors and warnings
- **Deployments**: History and rollback

Access at: `https://vercel.com/[your-username]/soulve-app`

## Rollback

If something goes wrong:

1. Go to **Deployments** tab
2. Find previous working deployment
3. Click **⋯** → **Promote to Production**

## Cost

Vercel Free Tier includes:
- Unlimited deployments
- 100 GB bandwidth/month
- Automatic HTTPS
- Preview deployments

Perfect for showcasing your app!

## Next Steps

1. ✅ Deploy to Vercel
2. ✅ Test production deployment
3. ✅ Share URL with stakeholders
4. Later: Migrate to AWS when ready

## Useful Commands

```powershell
# Local development
npm run dev                 # Start local dev server
npx supabase start         # Start local Supabase
npx supabase stop          # Stop local Supabase

# Production
git push                   # Triggers Vercel deployment
vercel --prod              # Manual production deploy
vercel logs                # View production logs

# Testing
npm run build              # Test production build
npm run preview            # Preview production build locally
```

## Support

- Vercel Docs: https://vercel.com/docs
- Vercel Discord: https://vercel.com/discord
- Your GitHub: https://github.com/kevin21quirk/soulve-app
