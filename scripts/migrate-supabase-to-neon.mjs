// Supabase → Neon data migration.
//
// Usage:
//   node scripts/migrate-supabase-to-neon.mjs --audit                # row-count comparison
//   node scripts/migrate-supabase-to-neon.mjs --run                  # copy all shared tables
//   node scripts/migrate-supabase-to-neon.mjs --run --tables=profiles,posts
//   node scripts/migrate-supabase-to-neon.mjs --clerk                # backfill clerk_user_id
//
// Env (in .env.local):
//   DATABASE_URL            — Neon target (required)
//   SOURCE_DATABASE_URL     — Supabase Postgres session/pooler string for the
//                             ACTIVE project (btwuqhrkhbblszuipumg)
//   OLD_SOURCE_DATABASE_URL — optional second Supabase project; loaded after
//                             the primary source so primary rows win
//                             (ON CONFLICT DO NOTHING).
//   CLERK_SECRET_KEY        — only for --clerk
//
// Behaviour:
//   * Only public.* tables existing in BOTH source and target are migrated.
//   * Column sets are intersected per table, so schema drift is tolerated.
//   * ON CONFLICT DO NOTHING — safe to re-run; existing target rows win.
//   * session_replication_role=replica on the target disables FK triggers
//     during the load (Neon supports this for the owner role), so table
//     order doesn't matter.
//   * Serial/identity sequences are reset after the load.

import pg from 'pg';
import { existsSync } from 'fs';

for (const f of ['.env.local', '.env']) {
  if (existsSync(f)) { try { process.loadEnvFile(f); } catch {} }
}

const TARGET_URL = process.env.DATABASE_URL;
const SOURCES = [process.env.SOURCE_DATABASE_URL, process.env.OLD_SOURCE_DATABASE_URL].filter(Boolean);

if (!TARGET_URL) { console.error('DATABASE_URL required'); process.exit(1); }

const args = process.argv.slice(2);
const AUDIT = args.includes('--audit');
const RUN = args.includes('--run');
const CLERK = args.includes('--clerk');
const tablesArg = args.find(a => a.startsWith('--tables='));
const ONLY = tablesArg ? new Set(tablesArg.slice(9).split(',')) : null;

if (!AUDIT && !RUN && !CLERK) {
  console.error('Specify --audit, --run, or --clerk');
  process.exit(1);
}

const BATCH = 500;

// ── Clerk backfill ──────────────────────────────────────────────────────
async function clerkBackfill(target) {
  const key = process.env.CLERK_SECRET_KEY;
  if (!key) { console.error('CLERK_SECRET_KEY required for --clerk'); process.exit(1); }

  const emailToClerkId = new Map();
  let offset = 0;
  for (;;) {
    const res = await fetch(`https://api.clerk.com/v1/users?limit=500&offset=${offset}`, {
      headers: { Authorization: `Bearer ${key}` },
    });
    if (!res.ok) throw new Error(`Clerk API ${res.status}`);
    const users = await res.json();
    if (!users.length) break;
    for (const u of users) {
      for (const e of u.email_addresses ?? []) {
        emailToClerkId.set(e.email_address.toLowerCase(), u.id);
      }
    }
    offset += users.length;
    if (users.length < 500) break;
  }
  console.log(`Clerk: ${emailToClerkId.size} email addresses loaded`);

  const profiles = await target.query(
    'SELECT id, email FROM profiles WHERE email IS NOT NULL AND clerk_user_id IS NULL'
  );
  let matched = 0;
  for (const p of profiles.rows) {
    const clerkId = emailToClerkId.get(String(p.email).toLowerCase());
    if (clerkId) {
      await target.query('UPDATE profiles SET clerk_user_id=$2, updated_at=now() WHERE id=$1', [p.id, clerkId]);
      matched++;
    }
  }
  console.log(`Backfilled clerk_user_id for ${matched}/${profiles.rows.length} profiles`);
  const remaining = profiles.rows.length - matched;
  if (remaining) console.log(`  ⚠ ${remaining} profiles have no matching Clerk account (not yet signed up via Clerk)`);
}

// ── Schema helpers ──────────────────────────────────────────────────────
async function publicTables(client) {
  const r = await client.query(
    `SELECT table_name FROM information_schema.tables
     WHERE table_schema='public' AND table_type='BASE TABLE'`
  );
  return new Set(r.rows.map(x => x.table_name));
}

async function columnInfo(client, table) {
  const r = await client.query(
    `SELECT column_name, udt_name FROM information_schema.columns
     WHERE table_schema='public' AND table_name=$1 ORDER BY ordinal_position`,
    [table]
  );
  return r.rows;
}

function serialize(value, udt) {
  if (value === null || value === undefined) return null;
  if (udt === 'json' || udt === 'jsonb') return JSON.stringify(value);
  if (value instanceof Date) return value.toISOString();
  if (Buffer.isBuffer(value)) return `\\x${value.toString('hex')}`;
  return value;
}

async function copyTable(src, dst, table) {
  const srcCols = await columnInfo(src, table);
  const dstCols = new Set((await columnInfo(dst, table)).map(c => c.column_name));
  const cols = srcCols.filter(c => dstCols.has(c.column_name));
  if (!cols.length) return { table, copied: 0, note: 'no shared columns' };

  const colNames = cols.map(c => `"${c.column_name}"`).join(',');
  const rows = await src.query(`SELECT ${colNames} FROM public."${table}"`);
  if (!rows.rows.length) return { table, copied: 0 };

  let copied = 0;
  for (let i = 0; i < rows.rows.length; i += BATCH) {
    const batch = rows.rows.slice(i, i + BATCH);
    const values = [];
    const params = [];
    let p = 1;
    for (const row of batch) {
      values.push('(' + cols.map(() => `$${p++}`).join(',') + ')');
      for (const c of cols) params.push(serialize(row[c.column_name], c.udt_name));
    }
    await dst.query(
      `INSERT INTO public."${table}" (${colNames}) VALUES ${values.join(',')} ON CONFLICT DO NOTHING`,
      params
    );
    copied += batch.length;
  }
  return { table, copied, sourceTotal: rows.rows.length };
}

async function resetSequences(dst) {
  const seqs = await dst.query(
    `SELECT t.table_name, c.column_name,
            pg_get_serial_sequence('public.'||t.table_name, c.column_name) AS seq
     FROM information_schema.tables t
     JOIN information_schema.columns c
       ON c.table_schema='public' AND c.table_name=t.table_name
     WHERE t.table_schema='public' AND c.column_default LIKE 'nextval%'`
  );
  for (const s of seqs.rows) {
    if (!s.seq) continue;
    await dst.query(
      `SELECT setval($1, COALESCE((SELECT MAX("${s.column_name}") FROM public."${s.table_name}"), 1))`,
      [s.seq]
    );
  }
  return seqs.rows.length;
}

// ── Main ────────────────────────────────────────────────────────────────
const dst = new pg.Client({ connectionString: TARGET_URL, ssl: { rejectUnauthorized: false } });
await dst.connect();

if (CLERK) {
  await clerkBackfill(dst);
  await dst.end();
  process.exit(0);
}

const targetTables = await publicTables(dst);

for (const [i, url] of SOURCES.entries()) {
  const label = i === 0 ? 'SOURCE' : 'OLD_SOURCE';
  const src = new pg.Client({ connectionString: url, ssl: { rejectUnauthorized: false } });
  try {
    await src.connect();
  } catch (e) {
    console.error(`${label}: connection failed — ${e.message}`);
    continue;
  }
  const srcTables = await publicTables(src);
  const shared = [...srcTables].filter(t => targetTables.has(t) && (!ONLY || ONLY.has(t))).sort();

  console.log(`\n=== ${label}: ${shared.length} shared tables ===`);

  if (AUDIT) {
    for (const t of shared) {
      const sc = (await src.query(`SELECT count(*) c FROM public."${t}"`)).rows[0].c;
      const dc = (await dst.query(`SELECT count(*) c FROM public."${t}"`)).rows[0].c;
      if (sc !== '0' || dc !== '0') console.log(`${t.padEnd(45)} src=${sc} dst=${dc}`);
    }
    await src.end();
    continue;
  }

  // RUN mode — disable FK triggers on target for the duration.
  let fkSuspended = false;
  try {
    await dst.query(`SET session_replication_role = replica`);
    fkSuspended = true;
  } catch (e) {
    console.warn(`Could not suspend FK checks (${e.message}) — falling back to ordered inserts`);
  }

  const summary = [];
  for (const t of shared) {
    try {
      const r = await copyTable(src, dst, t);
      if (r.copied) console.log(`  ${t}: ${r.copied} rows`);
      summary.push(r);
    } catch (e) {
      summary.push({ table: t, copied: 0, error: e.message });
      console.error(`  ${t}: FAILED — ${e.message.slice(0, 120)}`);
    }
  }
  if (fkSuspended) await dst.query(`SET session_replication_role = DEFAULT`);
  await src.end();

  const failed = summary.filter(s => s.error);
  console.log(`\n${label} done: ${summary.reduce((a, s) => a + (s.copied || 0), 0)} rows, ${failed.length} failed`);
}

if (RUN) {
  const n = await resetSequences(dst);
  console.log(`Sequences reset: ${n}`);
  console.log(`\nNext: run --clerk to backfill profiles.clerk_user_id`);
}

await dst.end();
