# SouLVE — Required Environment Variables

Set these in your Vercel project settings **before** deploying.
Values marked `SECRET` must never be committed to the repository.

---

## Frontend (exposed to browser — prefix `VITE_`)

| Variable | Description | Where to get it |
|---|---|---|
| `VITE_CLERK_PUBLISHABLE_KEY` | Clerk publishable key (`pk_live_...` / `pk_test_...`) | Clerk Dashboard → API Keys |
| `VITE_SENTRY_DSN` | Sentry DSN for error tracking (optional) | Sentry project settings |
| `VITE_GA4_MEASUREMENT_ID` | Google Analytics 4 measurement ID (optional) | GA4 → Admin → Data Streams |

---

## API / Serverless functions (server-only — never prefix `VITE_`)

| Variable | Description | Where to get it |
|---|---|---|
| `DATABASE_URL` | **SECRET** Neon PostgreSQL connection string with `sslmode=require` | Neon Dashboard → Connection Details |
| `CLERK_SECRET_KEY` | **SECRET** Clerk secret key (`sk_live_...` / `sk_test_...`) | Clerk Dashboard → API Keys |
| `CLERK_WEBHOOK_SECRET` | **SECRET** Svix webhook signing secret | Clerk Dashboard → Webhooks → signing secret |
| `BLOB_READ_WRITE_TOKEN` | **SECRET** Vercel Blob read/write token | Vercel Dashboard → Storage → Blob → Tokens |

---

## Optional / integrations

| Variable | Description |
|---|---|
| `VITE_PUSHER_KEY` | Pusher app key (Phase 2 — realtime) |
| `VITE_PUSHER_CLUSTER` | Pusher cluster e.g. `eu` (Phase 2) |
| `PUSHER_APP_ID` | Pusher app ID — server-side (Phase 2) |
| `PUSHER_SECRET` | **SECRET** Pusher secret — server-side (Phase 2) |

---

## Clerk Webhook setup

1. Go to **Clerk Dashboard → Webhooks → Add endpoint**
2. URL: `https://soulve-app.vercel.app/api/webhooks/clerk`
3. Subscribe to events: `user.created`, `user.updated`, `user.deleted`
4. Copy the **Signing Secret** into `CLERK_WEBHOOK_SECRET` on Vercel

---

## Neon connection string format

```
postgresql://neondb_owner:<password>@<endpoint>/<dbname>?sslmode=require
```

The current project endpoint:
```
ep-still-frog-zae224pk-pooler.c-2.eu-west-2.aws.neon.tech
```

---

## Local development

Create `.env.local` (gitignored) with:

```bash
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
DATABASE_URL=postgresql://...?sslmode=require
CLERK_SECRET_KEY=sk_test_...
CLERK_WEBHOOK_SECRET=whsec_...
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_...
```
