// Applies a SQL migration file to a Postgres connection string, statement by
// statement, collecting per-statement errors. Splits on top-level ';' while
// respecting $$ dollar-quoted bodies and single-quoted strings.
//
//   node scripts/apply-sql-file.mjs <file> <connection-string> [--dry]

import { readFileSync } from 'node:fs';
import pg from 'pg';

const [file, conn] = process.argv.slice(2);
const src = readFileSync(file, 'utf8');

function splitStatements(sql) {
  // First strip line comments (safe: strip only when not inside a string —
  // done on a second pass below, since '--' can legally appear inside
  // dollar-quoted function bodies and string literals).
  const out = [];
  let cur = '';
  let inDollar = false;
  let inSingle = false;
  let inDouble = false; // "..." quoted identifiers — may contain apostrophes
  const push = () => { if (cur.trim()) out.push(cur.trim()); cur = ''; };
  for (let i = 0; i < sql.length; i++) {
    const ch = sql[i];
    const two = sql.slice(i, i + 2);
    if (!inDollar && !inSingle && !inDouble && two === '--') {
      // line comment: skip to newline
      while (i < sql.length && sql[i] !== '\n') i++;
      continue;
    }
    if (!inSingle && !inDouble && two === '$$') { inDollar = !inDollar; cur += two; i++; continue; }
    if (!inDollar && !inSingle && ch === '"') {
      if (inDouble && sql[i + 1] === '"') { cur += '""'; i++; continue; }
      inDouble = !inDouble; cur += ch; continue;
    }
    if (!inDollar && !inDouble && ch === "'") {
      if (inSingle && sql[i + 1] === "'") { cur += "''"; i++; continue; }
      inSingle = !inSingle; cur += ch; continue;
    }
    if (!inDollar && !inSingle && !inDouble && ch === ';') { push(); continue; }
    cur += ch;
  }
  push();
  return out;
}

const stmts = splitStatements(src);
console.log(`${stmts.length} statements`);

if (process.argv.includes('--dry')) process.exit(0);

const client = new pg.Client({ connectionString: conn, ssl: { rejectUnauthorized: false } });
await client.connect();

const errors = [];
for (const [i, s] of stmts.entries()) {
  try {
    await client.query(s);
  } catch (e) {
    errors.push({ i, msg: e.message, preview: s.slice(0, 140).replace(/\s+/g, ' ') });
  }
}

console.log(`ok: ${stmts.length - errors.length}, failed: ${errors.length}`);
for (const e of errors) {
  console.log(`[${e.i}] ${e.msg}\n    ${e.preview}`);
}
await client.end();
process.exit(errors.length ? 1 : 0);
