// PostgREST-compatible query layer over Neon.
//
// Lets the existing supabase-js client (`supabase.from('x').select(...)`,
// inserts, updates, deletes, rpc) keep working while the requests actually
// hit our own API and run against Neon under real RLS.
//
// Every request runs inside a transaction as the `app_user` role with
// actor GUCs set (app.actor_id / app.actor_email / app.actor_role), so the
// ported RLS policies enforce exactly the same rules Supabase did.
//
// Supported PostgREST subset:
//   select=col,alias:col,embed(cols),embed!fk(cols),embed!inner(cols)
//   filters: eq neq gt gte lt lte like ilike is in cs cd ov + not. + or/and()
//   order=col.asc|desc(.nullsfirst|.nullslast), limit, offset, Range header
//   POST insert / upsert (Prefer: resolution=merge|ignore-duplicates,
//        on_conflict=cols), PATCH update, DELETE
//   Prefer: return=representation|minimal, count=exact (Content-Range)
//   Accept: application/vnd.pgrst.object+json  (.single()/.maybeSingle())
//   POST /rpc/<fn> with named-arg JSON body

import { Hono, type Context } from 'hono';
import { Pool } from '@neondatabase/serverless';
import { verifyToken } from '@clerk/backend';
import { resolveCaller } from '../lib/authz.js';

const rest = new Hono();

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error('DATABASE_URL environment variable is required');
const pool = new Pool({ connectionString });

// ── Request context ───────────────────────────────────────────────────────

interface Actor {
  profileId: string | null;
  email: string | null;
  role: 'authenticated' | 'anon';
}

async function getActor(authHeader: string | undefined): Promise<Actor> {
  if (!authHeader?.startsWith('Bearer ')) {
    return { profileId: null, email: null, role: 'anon' };
  }
  try {
    const payload = await verifyToken(authHeader.slice(7), {
      secretKey: process.env.CLERK_SECRET_KEY!,
    });
    const caller = await resolveCaller(payload.sub as string);
    if (!caller) return { profileId: null, email: null, role: 'anon' };
    return { profileId: caller.profileId, email: caller.email, role: 'authenticated' };
  } catch {
    return { profileId: null, email: null, role: 'anon' };
  }
}

// ── Schema caches ─────────────────────────────────────────────────────────

interface ColInfo { name: string; type: string; }
interface FkInfo {
  table: string;        // table holding the FK columns
  refTable: string;     // referenced table
  cols: string[];
  refCols: string[];
  constraint: string;
}

const tableCols = new Map<string, ColInfo[]>();
const tableFks = new Map<string, FkInfo[]>();
const tablePks = new Map<string, string[]>();
const tableSet = new Set<string>();
let schemaLoaded = false;

async function loadSchema(client: { query: (q: string, p?: unknown[]) => Promise<{ rows: Record<string, unknown>[] }> }) {
  if (schemaLoaded) return;
  const { rows: cols } = await client.query(
    `SELECT table_name, column_name, data_type, udt_name
       FROM information_schema.columns
      WHERE table_schema = 'public'`,
  );
  for (const r of cols) {
    const t = r.table_name as string;
    tableSet.add(t);
    const list = tableCols.get(t) ?? [];
    list.push({ name: r.column_name as string, type: r.udt_name as string });
    tableCols.set(t, list);
  }
  const { rows: fks } = await client.query(
    `SELECT tc.constraint_name, tc.table_name, kcu.column_name,
            ccu.table_name AS ref_table, ccu.column_name AS ref_column
       FROM information_schema.table_constraints tc
       JOIN information_schema.key_column_usage kcu
         ON tc.constraint_name = kcu.constraint_name AND tc.table_schema = kcu.table_schema
       JOIN information_schema.constraint_column_usage ccu
         ON tc.constraint_name = ccu.constraint_name AND tc.table_schema = ccu.table_schema
      WHERE tc.constraint_type = 'FOREIGN KEY' AND tc.table_schema = 'public'`,
  );
  const fkMap = new Map<string, FkInfo>();
  for (const r of fks) {
    const key = r.constraint_name as string;
    const fk = fkMap.get(key) ?? {
      table: r.table_name as string,
      refTable: r.ref_table as string,
      cols: [], refCols: [], constraint: key,
    };
    fk.cols.push(r.column_name as string);
    fk.refCols.push(r.ref_column as string);
    fkMap.set(key, fk);
  }
  for (const fk of fkMap.values()) {
    const list = tableFks.get(fk.table) ?? [];
    list.push(fk);
    tableFks.set(fk.table, list);
  }
  const { rows: pks } = await client.query(
    `SELECT tc.table_name, kcu.column_name
       FROM information_schema.table_constraints tc
       JOIN information_schema.key_column_usage kcu
         ON tc.constraint_name = kcu.constraint_name AND tc.table_schema = kcu.table_schema
      WHERE tc.constraint_type = 'PRIMARY KEY' AND tc.table_schema = 'public'`,
  );
  for (const r of pks) {
    const list = tablePks.get(r.table_name as string) ?? [];
    list.push(r.column_name as string);
    tablePks.set(r.table_name as string, list);
  }
  schemaLoaded = true;
}

// ── Identifier / literal helpers ──────────────────────────────────────────

const IDENT_RE = /^[a-z_][a-z0-9_]*$/i;
const ident = (s: string) => {
  if (!IDENT_RE.test(s)) throw new RestError(400, `Invalid identifier: ${s}`);
  return `"${s}"`;
};

class RestError extends Error {
  constructor(public status: number, message: string, public code?: string) {
    super(message);
  }
}

const pgrstError = (status: number, message: string, code = 'PGRST301') =>
  new RestError(status, message, code);

function colType(table: string, col: string): string {
  const c = tableCols.get(table)?.find((x) => x.name === col);
  return c?.type ?? 'text';
}

// Postgres type name for a cast expression.
function castType(udt: string): string {
  if (udt.startsWith('_')) return `${udt.slice(1)}[]`;
  const map: Record<string, string> = {
    timestamptz: 'timestamptz', timestamp: 'timestamp', date: 'date', time: 'time',
    uuid: 'uuid', int2: 'smallint', int4: 'int', int8: 'bigint', float4: 'real',
    float8: 'double precision', numeric: 'numeric', bool: 'boolean',
    json: 'json', jsonb: 'jsonb', text: 'text', varchar: 'text', bpchar: 'text',
    inet: 'inet', interval: 'interval', bytea: 'bytea',
  };
  return map[udt] ?? 'text';
}

// ── Filter parsing ────────────────────────────────────────────────────────

const OPS: Record<string, string> = {
  eq: '=', neq: '<>', gt: '>', gte: '>=', lt: '<', lte: '<=',
  like: 'LIKE', ilike: 'ILIKE', match: '@@', matchphrase: '@@',
};

function splitTopLevel(s: string, sep = ','): string[] {
  const out: string[] = [];
  let depth = 0, inQ = false;
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (inQ) { if (ch === '"' && s[i + 1] === '"') i++; else if (ch === '"') inQ = false; continue; }
    if (ch === '"') inQ = true;
    else if (ch === '(') depth++;
    else if (ch === ')') depth--;
    else if (ch === sep && depth === 0) { out.push(s.slice(0, i)); s = s.slice(i + 1); i = -1; }
  }
  out.push(s);
  return out.map((x) => x.trim());
}

const unquote = (v: string) => {
  v = v.trim();
  return v.startsWith('"') && v.endsWith('"')
    ? v.slice(1, -1).replace(/""/g, '"')
    : v;
};

interface Ctx {
  table: string;
  params: unknown[];
}

function buildCond(table: string, key: string, raw: string, ctx: Ctx, alias = ''): string {
  // or=(cond,cond) / and=(...) logical grouping
  const logic = key.match(/^(or|and)$/);
  if (logic && raw.startsWith('(') && raw.endsWith(')')) {
    const inner = raw.slice(1, -1);
    const parts = splitTopLevel(inner).map((c) => {
      const m = c.match(/^([a-zA-Z0-9_.]+)\.(not\.)?(.+)$/);
      if (!m) throw pgrstError(400, `Cannot parse filter: ${c}`);
      return buildCond(table, m[1], (m[2] ?? '') + m[3], ctx, alias);
    });
    return `(${parts.join(logic[1] === 'or' ? ' OR ' : ' AND ')})`;
  }

  // col=op.value  or  col=not.op.value  (inside or()/and(), key is col and
  // raw is `col.op.value` or `col.not.op.value`)
  let col = key;
  let body = raw;
  const embedded = raw.match(/^([a-zA-Z0-9_]+)\.((?:not\.)?(?:eq|neq|gt|gte|lt|lte|like|ilike|is|in|cs|cd|ov|fts|plfts|phfts|wfts)\.[\s\S]*)$/);
  if (embedded) { col = embedded[1]; body = embedded[2]; }

  const m = body.match(/^(?:(not)\.)?([a-z]+)\.([\s\S]*)$/);
  if (!m) throw pgrstError(400, `Cannot parse filter ${key}=${raw}`);
  const [, not, op, valRaw] = m;

  const colExpr = `${alias}${ident(col)}`;
  const udt = colType(table, col);
  const cast = castType(udt);
  const val = unquote(valRaw);

  const neg = (sql: string) => (not ? `(NOT ${sql})` : sql);

  switch (op) {
    case 'eq': case 'neq': case 'gt': case 'gte': case 'lt': case 'lte': {
      ctx.params.push(val);
      return neg(`${colExpr} ${OPS[op]} $${ctx.params.length}::${cast}`);
    }
    case 'like': case 'ilike': {
      ctx.params.push(val.replace(/\*/g, '%'));
      return neg(`${colExpr} ${OPS[op]} $${ctx.params.length}`);
    }
    case 'is': {
      const v = val.toLowerCase();
      if (v === 'null') return neg(`${colExpr} IS NULL`);
      if (v === 'true') return neg(`${colExpr} IS TRUE`);
      if (v === 'false') return neg(`${colExpr} IS FALSE`);
      throw pgrstError(400, `Invalid IS value: ${val}`);
    }
    case 'in': {
      const list = splitTopLevel(val.replace(/^\(|\)$/g, '')).map(unquote);
      ctx.params.push(list);
      return neg(`${colExpr} = ANY($${ctx.params.length}::${cast}[])`);
    }
    case 'cs': case 'cd': case 'ov': {
      const sqlOp = op === 'cs' ? '@>' : op === 'cd' ? '<@' : '&&';
      ctx.params.push(val);
      return neg(`${colExpr} ${sqlOp} $${ctx.params.length}::${cast}`);
    }
    case 'fts': case 'plfts': case 'phfts': case 'wfts': {
      ctx.params.push(val);
      const fn = { fts: 'to_tsquery', plfts: 'plainto_tsquery', phfts: 'phraseto_tsquery', wfts: 'websearch_to_tsquery' }[op];
      return neg(`${colExpr} @@ ${fn}('english', $${ctx.params.length})`);
    }
    default:
      throw pgrstError(400, `Unsupported filter operator: ${op}`);
  }
}

function buildWhere(table: string, q: URLSearchParams, ctx: Ctx): string {
  const conds: string[] = [];
  for (const [key, val] of q.entries()) {
    if (['select', 'order', 'limit', 'offset', 'on_conflict', 'columns'].includes(key)) continue;

    // Embedded-resource filter: rel.col=op.value → EXISTS against the
    // related table (PostgREST applies these inside the embed).
    const relMatch = key.match(/^([a-zA-Z0-9_]+)\.([a-zA-Z0-9_]+)$/);
    if (relMatch && !tableCols.get(table)?.some((ci) => ci.name === relMatch[1])) {
      const rel = findFkBetween(table, relMatch[1]);
      if (!rel) throw pgrstError(400, `Cannot filter on unknown resource: ${key}`);
      const x = 'fx';
      const childCtx: Ctx = { table: rel.from === table ? rel.to : rel.from, params: ctx.params };
      const cond = buildCond(childCtx.table, relMatch[2], val, childCtx, `${x}.`);
      const join = rel.from === table
        ? rel.fk.refCols.map((rc, i) => `${x}.${ident(rc)} = t.${ident(rel.fk.cols[i])}`).join(' AND ')
        : rel.fk.cols.map((cc, i) => `${x}.${ident(cc)} = t.${ident(rel.fk.refCols[i])}`).join(' AND ');
      conds.push(`EXISTS (SELECT 1 FROM ${ident(childCtx.table)} ${x} WHERE ${join} AND ${cond})`);
      continue;
    }

    conds.push(buildCond(table, key, val, ctx, 't.'));
  }
  return conds.length ? `WHERE ${conds.join(' AND ')}` : '';
}

// ── SELECT list / embeds ──────────────────────────────────────────────────

interface SelectItem {
  kind: 'col' | 'embed' | 'count';
  name: string;
  alias?: string;
  hint?: string;      // !fk_name
  inner?: boolean;    // !inner
  children?: SelectItem[];
}

function parseSelect(select: string): SelectItem[] {
  return splitTopLevel(select).map((part) => {
    const embed = part.match(/^([a-zA-Z0-9_]+:)?([a-zA-Z0-9_]+)(?:!([a-zA-Z0-9_]+))?\((.*)\)$/s);
    if (embed) {
      const hint = embed[3];
      const inner = hint === 'inner';
      return {
        kind: 'embed', name: embed[2], alias: embed[1]?.slice(0, -1),
        hint: inner ? undefined : hint, inner,
        children: parseSelect(embed[4]),
      };
    }
    const aliasCol = part.match(/^([a-zA-Z0-9_]+):(.+)$/);
    const name = aliasCol ? aliasCol[2] : part;
    if (name === 'count()' || name === 'count') {
      return { kind: 'count' as const, name: 'count', alias: aliasCol?.[1] };
    }
    return { kind: 'col' as const, name, alias: aliasCol?.[1] };
  });
}

function findFkBetween(a: string, b: string, hint?: string): { from: string; to: string; fk: FkInfo } | null {
  // FK declared on `a` pointing to `b`
  for (const fk of tableFks.get(a) ?? []) {
    if (fk.refTable === b && (!hint || fk.constraint === hint || fk.cols.includes(hint))) {
      return { from: a, to: b, fk };
    }
  }
  // FK declared on `b` pointing to `a`
  for (const fk of tableFks.get(b) ?? []) {
    if (fk.refTable === a && (!hint || fk.constraint === hint || fk.cols.includes(hint))) {
      return { from: b, to: a, fk };
    }
  }
  return null;
}

function buildSelectList(baseTable: string, items: SelectItem[], ctx: Ctx, alias = 't'): { select: string; innerJoins: string[] } {
  const cols: string[] = [];
  const innerJoins: string[] = [];
  let starHandled = false;

  for (const item of items) {
    if (item.kind === 'col') {
      if (item.name === '*') {
        if (!starHandled) { cols.push(`${alias}.*`); starHandled = true; }
        continue;
      }
      // allow casts like col::text
      const castM = item.name.match(/^([a-zA-Z0-9_]+)(::[a-zA-Z]+)?$/);
      if (!castM) throw pgrstError(400, `Bad select item: ${item.name}`);
      const out = `${alias}.${ident(castM[1])}${castM[2] ?? ''}`;
      cols.push(item.alias ? `${out} AS ${ident(item.alias)}` : out);
    } else if (item.kind === 'count') {
      cols.push(`count(*)${item.alias ? ` AS ${ident(item.alias)}` : ''}`);
    } else {
      const rel = findFkBetween(baseTable, item.name, item.hint);
      if (!rel) throw pgrstError(400, `No relationship between ${baseTable} and ${item.name}`);
      const eAlias = `e_${cols.length}`;
      const outName = item.alias ?? item.name;
      const child = buildSelectList(rel.to === baseTable ? rel.from : rel.to, item.children ?? [{ kind: 'col', name: '*' }], ctx, eAlias);

      if (rel.from === baseTable) {
        // many-to-one: base.fkCols → embed.refCols → single object
        const conds = rel.fk.refCols.map((rc, i) => `${eAlias}.${ident(rc)} = ${alias}.${ident(rel.fk.cols[i])}`).join(' AND ');
        cols.push(
          `(SELECT to_jsonb(${eAlias}_row) FROM (SELECT ${child.select} FROM ${ident(rel.to)} ${eAlias} WHERE ${conds}) ${eAlias}_row) AS ${ident(outName)}`,
        );
      } else {
        // one-to-many: embed.fkCols → base.refCols → array
        const conds = rel.fk.cols.map((cc, i) => `${eAlias}.${ident(cc)} = ${alias}.${ident(rel.fk.refCols[i])}`).join(' AND ');
        const innerCond = item.inner ? conds : null;
        if (innerCond) innerJoins.push(`EXISTS (SELECT 1 FROM ${ident(rel.from)} ij_${cols.length} WHERE ${rel.fk.cols.map((cc, i2) => `ij_${cols.length}.${ident(cc)} = ${alias}.${ident(rel.fk.refCols[i2])}`).join(' AND ')})`);
        cols.push(
          `(SELECT COALESCE(jsonb_agg(${eAlias}_row), '[]'::jsonb) FROM (SELECT ${child.select} FROM ${ident(rel.from)} ${eAlias} WHERE ${conds}) ${eAlias}_row) AS ${ident(outName)}`,
        );
      }
    }
  }
  return { select: cols.join(', ') || `${alias}.*`, innerJoins };
}

// ── Order / pagination ────────────────────────────────────────────────────

function buildOrder(q: URLSearchParams, alias = 't'): string {
  const raw = q.get('order');
  if (!raw) return '';
  const parts = splitTopLevel(raw).map((o) => {
    const m = o.match(/^([a-zA-Z0-9_]+)\.(asc|desc)(\.(nullsfirst|nullslast))?$/i);
    if (!m) return null; // embedded ordering like rel(col).asc — unsupported, skip
    return `${alias}.${ident(m[1])} ${m[2].toUpperCase()}${m[4] ? ` NULLS ${m[4] === 'nullsfirst' ? 'FIRST' : 'LAST'}` : ''}`;
  }).filter(Boolean);
  return parts.length ? `ORDER BY ${parts.join(', ')}` : '';
}

function parseRange(req: Request, q: URLSearchParams): { limit?: number; offset?: number } {
  const range = req.headers.get('Range');
  if (range) {
    const m = range.match(/^(\d*)-(\d*)$/);
    if (m) {
      const offset = m[1] ? parseInt(m[1]) : undefined;
      const end = m[2] ? parseInt(m[2]) : undefined;
      return { offset, limit: end !== undefined && offset !== undefined ? end - offset + 1 : undefined };
    }
  }
  return {
    limit: q.get('limit') ? parseInt(q.get('limit')!) : undefined,
    offset: q.get('offset') ? parseInt(q.get('offset')!) : undefined,
  };
}

// ── Transaction runner with actor context ────────────────────────────────

async function withActor<T>(actor: Actor, fn: (q: (text: string, params?: unknown[]) => Promise<{ rows: Record<string, unknown>[] }>) => Promise<T>): Promise<T> {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    // Schema metadata must be loaded as the owner role — information_schema
    // only exposes constraints on objects the current role owns/has grants on.
    await loadSchema(client);
    await client.query(actor.role === 'authenticated' ? 'SET LOCAL ROLE authenticated' : 'SET LOCAL ROLE anon');
    await client.query('SELECT set_config($1, $2, true)', ['app.actor_id', actor.profileId ?? '']);
    await client.query('SELECT set_config($1, $2, true)', ['app.actor_email', actor.email ?? '']);
    await client.query('SELECT set_config($1, $2, true)', ['app.actor_role', actor.role]);
    const result = await fn((text, params) => client.query(text, params));
    await client.query('COMMIT');
    return result;
  } catch (e) {
    await client.query('ROLLBACK').catch(() => {});
    throw e;
  } finally {
    client.release();
  }
}

// ── Shared response shaping ──────────────────────────────────────────────

function prefers(headers: Headers, name: string): string | undefined {
  const p = headers.get('Prefer');
  if (!p) return undefined;
  return p.split(',').map((s) => s.trim()).find((s) => s.startsWith(`${name}=`))?.split('=')[1];
}

function shapeResponse(c: Context,
  rows: Record<string, unknown>[], count: number | null, headers: Headers, emptyStatus = 200) {
  const single = headers.get('Accept')?.includes('vnd.pgrst.object');
  const h: Record<string, string> = {};
  if (count !== null) {
    h['Content-Range'] = rows.length ? `0-${rows.length - 1}/${count}` : `*/${count}`;
    h['Range-Unit'] = 'items';
  }
  if (single) {
    if (rows.length !== 1) {
      throw new RestError(406, 'Cannot coerce the result to a single JSON object', 'PGRST116');
    }
    return c.json(rows[0], 200, h);
  }
  return c.json(rows, emptyStatus as 200, h);
}

// ── GET/HEAD /rest/v1/:table ──────────────────────────────────────────────

rest.on(['GET', 'HEAD'], '/v1/:table', async (c) => {
  const table = c.req.param('table');
  const actor = await getActor(c.req.header('Authorization'));

  try {
    return await withActor(actor, async (q) => {
      if (!tableSet.has(table)) throw pgrstError(404, `Not found: ${table}`, 'PGRST205');

      const url = new URL(c.req.url);
      const ctx: Ctx = { table, params: [] };
      const selectItems = parseSelect(url.searchParams.get('select') ?? '*');
      const { select, innerJoins } = buildSelectList(table, selectItems, ctx);
      const where = buildWhere(table, url.searchParams, ctx);
      const innerWhere = innerJoins.length
        ? `${where ? `${where} AND` : 'WHERE'} ${innerJoins.join(' AND ')}`
        : where;
      const order = buildOrder(url.searchParams);
      const { limit, offset } = parseRange(c.req.raw, url.searchParams);
      const paging = `${limit != null ? ` LIMIT ${limit}` : ''}${offset != null ? ` OFFSET ${offset}` : ''}`;

      const wantCount = prefers(c.req.raw.headers, 'count') === 'exact' || c.req.method === 'HEAD';
      let count: number | null = null;
      if (wantCount) {
        const cnt = await q(
          `SELECT count(*)::int AS n FROM ${ident(table)} t ${innerWhere}`, ctx.params,
        );
        count = cnt.rows[0]?.n as number ?? 0;
      }

      const rows = c.req.method === 'HEAD' ? [] : (
        await q(`SELECT ${select} FROM ${ident(table)} t ${innerWhere} ${order}${paging}`, ctx.params)
      ).rows;

      return shapeResponse(c, rows as Record<string, unknown>[], count, c.req.raw.headers);
    });
  } catch (e) {
    return handleErr(c, e);
  }
});

// ── POST /rest/v1/:table  (insert / upsert) ───────────────────────────────

rest.post('/v1/:table', async (c) => {
  const table = c.req.param('table');
  const actor = await getActor(c.req.header('Authorization'));
  try {
    return await withActor(actor, async (q) => {
      if (!tableSet.has(table)) throw pgrstError(404, `Not found: ${table}`, 'PGRST205');
      const url = new URL(c.req.url);
      const body = await c.req.json().catch(() => null);
      if (!body || typeof body !== 'object') throw pgrstError(400, 'Body must be a JSON object or array');
      const rowsIn = Array.isArray(body) ? body : [body];
      if (!rowsIn.length) throw pgrstError(400, 'Empty array');

      const headers = c.req.raw.headers;
      const resolution = prefers(headers, 'resolution');
      const onConflict = url.searchParams.get('on_conflict');
      const wantReturn = prefers(headers, 'return') !== 'minimal';

      const columnsParam = url.searchParams.get('columns');
      const allowed = columnsParam
        ? new Set(columnsParam.split(',').map((s) => s.trim()))
        : null;
      const allCols = [...new Set(rowsIn.flatMap((r) => Object.keys(r)))];
      const validCols = allCols.filter((col) =>
        tableCols.get(table)?.some((ci) => ci.name === col) &&
        (!allowed || allowed.has(col)));
      if (!validCols.length) throw pgrstError(400, 'No valid columns');

      const params: unknown[] = [];
      const valuesSql = rowsIn.map((r) => `(${validCols.map((col) => {
        params.push((r as Record<string, unknown>)[col] ?? null);
        const udt = colType(table, col);
        return `$${params.length}::${castType(udt)}`;
      }).join(', ')})`).join(', ');

      let conflictSql = '';
      if (onConflict) {
        const target = onConflict.split(',').map((s) => ident(s.trim())).join(', ');
        if (resolution === 'ignore-duplicates') {
          conflictSql = ` ON CONFLICT (${target}) DO NOTHING`;
        } else {
          const updates = validCols
            .filter((col) => !onConflict.split(',').map((s) => s.trim()).includes(col))
            .map((col) => `${ident(col)} = EXCLUDED.${ident(col)}`);
          conflictSql = ` ON CONFLICT (${target}) DO ${updates.length ? `UPDATE SET ${updates.join(', ')}` : 'NOTHING'}`;
        }
      }

      const sql = `INSERT INTO ${ident(table)} (${validCols.map(ident).join(', ')}) VALUES ${valuesSql}${conflictSql}${wantReturn ? ' RETURNING *' : ''}`;
      const res = await q(sql, params);

      if (!wantReturn) return c.body(null, 201);
      return shapeResponse(c, res.rows, null, headers, 201);
    });
  } catch (e) {
    return handleErr(c, e);
  }
});

// ── PATCH /rest/v1/:table ─────────────────────────────────────────────────

rest.patch('/v1/:table', async (c) => {
  const table = c.req.param('table');
  const actor = await getActor(c.req.header('Authorization'));
  try {
    return await withActor(actor, async (q) => {
      if (!tableSet.has(table)) throw pgrstError(404, `Not found: ${table}`, 'PGRST205');
      const url = new URL(c.req.url);
      const body = await c.req.json().catch(() => null);
      if (!body || typeof body !== 'object' || Array.isArray(body)) {
        throw pgrstError(400, 'PATCH body must be a JSON object');
      }
      const headers = c.req.raw.headers;
      const ctx: Ctx = { table, params: [] };

      const sets: string[] = [];
      for (const [col, val] of Object.entries(body)) {
        if (!tableCols.get(table)?.some((ci) => ci.name === col)) continue;
        ctx.params.push(val);
        sets.push(`${ident(col)} = $${ctx.params.length}::${castType(colType(table, col))}`);
      }
      if (!sets.length) throw pgrstError(400, 'No valid columns to update');

      const where = buildWhere(table, url.searchParams, ctx);
      const wantReturn = prefers(headers, 'return') !== 'minimal';
      const res = await q(
        `UPDATE ${ident(table)} SET ${sets.join(', ')} ${where}${wantReturn ? ' RETURNING *' : ''}`,
        ctx.params,
      );
      if (!wantReturn) return c.body(null, 204);
      return shapeResponse(c, res.rows, null, headers);
    });
  } catch (e) {
    return handleErr(c, e);
  }
});

// ── DELETE /rest/v1/:table ────────────────────────────────────────────────

rest.delete('/v1/:table', async (c) => {
  const table = c.req.param('table');
  const actor = await getActor(c.req.header('Authorization'));
  try {
    return await withActor(actor, async (q) => {
      if (!tableSet.has(table)) throw pgrstError(404, `Not found: ${table}`, 'PGRST205');
      const url = new URL(c.req.url);
      const ctx: Ctx = { table, params: [] };
      const where = buildWhere(table, url.searchParams, ctx);
      const wantReturn = prefers(c.req.raw.headers, 'return') === 'representation';
      const res = await q(
        `DELETE FROM ${ident(table)} ${where}${wantReturn ? ' RETURNING *' : ''}`,
        ctx.params,
      );
      if (!wantReturn) return c.body(null, 204);
      return shapeResponse(c, res.rows, null, c.req.raw.headers);
    });
  } catch (e) {
    return handleErr(c, e);
  }
});

// ── POST/GET /rest/v1/rpc/:fn ─────────────────────────────────────────────

rest.on(['GET', 'POST'], '/v1/rpc/:fn', async (c) => {
  const fn = c.req.param('fn');
  if (!IDENT_RE.test(fn)) throw pgrstError(404, `Not found: ${fn}`, 'PGRST202');
  const actor = await getActor(c.req.header('Authorization'));
  try {
    return await withActor(actor, async (q) => {
      const args: Record<string, unknown> = c.req.method === 'POST'
        ? (await c.req.json().catch(() => ({})))
        : Object.fromEntries(new URL(c.req.url).searchParams);

      // Resolve overload by matching provided arg names to the signature.
      const { rows: sigs } = await q(
        `SELECT p.proretset,
                pg_get_function_arguments(p.oid) AS argstr,
                pg_get_function_result(p.oid) AS ret
           FROM pg_proc p JOIN pg_namespace n ON n.oid = p.pronamespace
          WHERE p.proname = $1 AND n.nspname = 'public'`,
        [fn],
      );
      if (!sigs.length) throw pgrstError(404, `No function ${fn}`, 'PGRST202');
      const argKeys = Object.keys(args);
      const sig = sigs.find((s) => {
        const names = [...(s.argstr as string).matchAll(/(?:^|,\s*)([a-zA-Z0-9_]+)\s+[a-zA-Z]/g)].map((m) => m[1]);
        return argKeys.every((k) => names.includes(k));
      }) ?? sigs[0];

      const params: unknown[] = [];
      const callArgs = argKeys.map((k) => {
        params.push(typeof args[k] === 'object' && args[k] !== null ? JSON.stringify(args[k]) : args[k]);
        return `${ident(k)} := $${params.length}`;
      }).join(', ');

      const isTable = /SETOF|record|TABLE/.test(sig.ret as string);
      const sql = isTable
        ? `SELECT to_jsonb(r) AS row FROM public.${ident(fn)}(${callArgs}) r`
        : `SELECT public.${ident(fn)}(${callArgs}) AS value`;
      const res = await q(sql, params);

      if (isTable) {
        return c.json(res.rows.map((r) => r.row), 200);
      }
      return c.json(res.rows[0]?.value ?? null, 200);
    });
  } catch (e) {
    return handleErr(c, e);
  }
});

function handleErr(c: Context, e: unknown) {
  if (e instanceof RestError) {
    return c.json({ code: e.code ?? 'PGRST000', message: e.message, details: null, hint: null }, e.status as 400);
  }
  console.error('[rest]', e);
  const msg = e instanceof Error ? e.message : String(e);
  return c.json({ code: 'PGRST000', message: msg, details: null, hint: null }, 500);
}

export default rest;
