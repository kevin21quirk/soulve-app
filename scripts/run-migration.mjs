import { neon } from '@neondatabase/serverless';
import { readFileSync } from 'fs';

const DATABASE_URL = 'postgresql://neondb_owner:npg_psb3oVKHzgl2@ep-still-frog-zae224pk-pooler.c-2.eu-west-2.aws.neon.tech/neondb?sslmode=require';
const db = neon(DATABASE_URL);

const migrationFile = process.argv[2] ?? './neon_schema.sql';
const raw = readFileSync(migrationFile, 'utf-8');
console.log(`Applying: ${migrationFile}`);

// Extract SQL statements: strip comment-only lines, then split on
// lines that start with a known SQL keyword (new statement boundary)
// Approach: collect lines, strip leading comments, find semicolons
const lines = raw.split('\n');
const sqlLines = [];
for (const line of lines) {
  // Skip pure comment lines and empty lines when building statement list
  if (/^\s*--/.test(line)) continue;
  sqlLines.push(line);
}
const sqlText = sqlLines.join('\n');

// Now split on semicolons, respecting dollar-quotes and single-quotes
function extractStatements(text) {
  const stmts = [];
  let cur = '';
  let inDollar = false, dollarTag = '', inSQ = false;
  let i = 0;
  while (i < text.length) {
    const ch = text[i];
    if (!inDollar && !inSQ) {
      if (ch === '$') {
        // Only valid PG dollar-quote tags: $$ or $identifier$
        const m = text.slice(i).match(/^\$([a-zA-Z_]\w*)?\$/);
        if (m) {
          dollarTag = m[0]; inDollar = true; cur += dollarTag; i += dollarTag.length; continue;
        }
      }
      if (ch === "'") { inSQ = true; cur += ch; i++; continue; }
      if (ch === ';') {
        const s = (cur + ch).trim();
        if (s.length > 1) stmts.push(s);
        cur = ''; i++; continue;
      }
    } else if (inDollar) {
      if (ch === '$' && text.slice(i).startsWith(dollarTag)) {
        cur += dollarTag; i += dollarTag.length; inDollar = false; dollarTag = ''; continue;
      }
    } else if (inSQ) {
      if (ch === "'" && text[i+1] === "'") { cur += "''"; i += 2; continue; }
      if (ch === "'") inSQ = false;
    }
    cur += ch; i++;
  }
  return stmts;
}

const stmts = extractStatements(sqlText);
console.log(`Running ${stmts.length} SQL statements against Neon...`);

let ok = 0, errors = [];
for (let i = 0; i < stmts.length; i++) {
  const stmt = stmts[i];
  try {
    await db.query(stmt);
    ok++;
    if ((i+1) % 100 === 0) console.log(`  ${i+1}/${stmts.length}`);
  } catch (e) {
    const msg = e.message || String(e);
    if (msg.includes('already exists') || msg.includes('duplicate key')) {
      ok++;
    } else {
      errors.push({ idx: i+1, error: msg, stmt: stmt.slice(0, 130).replace(/\n/g,' ') });
    }
  }
}

console.log(`\n✅ OK: ${ok}/${stmts.length}`);
if (errors.length) {
  console.log(`\n❌ Errors: ${errors.length}`);
  errors.slice(0, 30).forEach(e => console.log(`  [${e.idx}] ${e.error}\n    >> ${e.stmt}\n`));
}
