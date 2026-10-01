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

---

## Vercel Blob storage (`soulve-storage`)

The Blob store is connected to the project via OIDC. On Vercel (production and preview),
`VERCEL_OIDC_TOKEN` and `BLOB_STORE_ID` are **automatically injected** by the runtime —
no manual Blob variables need to be added to Vercel project settings.

Vercel will have already created these in your project environment automatically:

| Variable | Set by | Notes |
|---|---|---|
| `BLOB_STORE_ID` | Vercel (auto) | Injected when store is connected — do not set manually |
| `BLOB_WEBHOOK_PUBLIC_KEY` | Vercel (auto) | Used to verify Blob webhook signatures |
| `BLOB_READ_WRITE_TOKEN` | Vercel (auto, also needed for local dev) | Used in local development only; ignored on Vercel when OIDC is active |

`soulve-storage` is a **private-access** store — it rejects `access:'public'` uploads.
Public assets (avatars, post media, banners) require a second, **public-access** Blob
store connected with env prefix `PUBLIC_MEDIA`:

| Variable | Set by | Notes |
|---|---|---|
| `PUBLIC_MEDIA_STORE_ID` / `PUBLIC_MEDIA_WEBHOOK_PUBLIC_KEY` | Vercel (auto) | Injected on connect |
| `PUBLIC_MEDIA_READ_WRITE_TOKEN` | Vercel (auto) | Routes public `put`/`del` calls to the public store |

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

# Vercel Blob — only needed for local dev (OIDC handles auth on Vercel automatically)
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_...
```

### Blob authentication by environment

| Environment | Auth method | What you need |
|---|---|---|
| Vercel Production | OIDC (auto) | Nothing — Vercel injects `VERCEL_OIDC_TOKEN` + `BLOB_STORE_ID` |
| Vercel Preview | OIDC (auto) | Nothing |
| Local dev | Read-write token | `BLOB_READ_WRITE_TOKEN` in `.env.local` |
