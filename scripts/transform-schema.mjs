import { readFileSync, writeFileSync } from 'fs';

const inputFile = './schema_final.sql';
const outputFile = './neon_schema.sql';

// Read + normalise CRLF → LF
let raw = readFileSync(inputFile, 'utf-8').replace(/\r\n/g, '\n');

// ── Phase 1: line-level removals (things safe to strip per-line) ───────────
raw = raw.split('\n').filter(line => {
  if (/REPLICA\s+IDENTITY/i.test(line)) return false;
  if (/ENABLE\s+ROW\s+LEVEL\s+SECURITY/i.test(line)) return false;
  if (/DISABLE\s+ROW\s+LEVEL\s+SECURITY/i.test(line)) return false;
  if (/^SET\s+row_security/i.test(line)) return false;
  return true;
}).join('\n');

// ── Phase 2: simple text substitutions ────────────────────────────────────
raw = raw.replace(/REFERENCES\s+auth\.users\s*\(id\)/g, 'REFERENCES public.profiles(id)');
raw = raw.replace(/REFERENCES\s+"auth"\."users"\s*\("id"\)/g, 'REFERENCES public.profiles(id)');

// ── Phase 3: block-level filtering (split on double-blank-line = \n\n\n) ──
const blocks = raw.split('\n\n\n');

// Patterns where the ENTIRE BLOCK should be dropped
const SKIP_BLOCK = [
  /^--\n-- Name:[^\n]+Type: POLICY/m,   // pg_dump comment identifying a POLICY block
  /^\s*CREATE\s+POLICY\b/im,
  /^\s*DROP\s+POLICY\b/im,
  /^\s*REVOKE\b/im,
  /^\s*GRANT\b/im,
  /^\s*CREATE\s+SCHEMA\b/im,
  /^\s*COMMENT\s+ON\s+SCHEMA\b/im,
  /^\s*ALTER\s+DEFAULT\s+PRIVILEGES\b/im,
  /^\s*INSERT\s+INTO\s+storage\./im,
  /^\s*CREATE\s+EXTENSION[^\n]*pg_net/im,
];

const kept = blocks.filter(b => !SKIP_BLOCK.some(p => p.test(b)));

let out = kept.join('\n\n\n');

// ── Phase 4: remove leftover single-line statements that slipped through ──
out = out.split('\n').filter(line => {
  if (/^\s*REVOKE\b/i.test(line) && line.includes(';')) return false;
  if (/^\s*GRANT\b/i.test(line) && line.includes(';')) return false;
  return true;
}).join('\n');

// ── Phase 5: Add clerk_user_id to profiles table ──────────────────────────
out = out.replace(
  /(CREATE TABLE public\.profiles\s*\([\s\S]*?)(    email text)([\s\n]*\);)/,
  '$1$2,\n    clerk_user_id text UNIQUE$3'
);

// Collapse 4+ blank lines
out = out.replace(/\n{4,}/g, '\n\n\n');

const header = `-- Neon schema for SouLVE
-- Supabase RLS/policies/auth.users/storage removed; clerk_user_id added to profiles
-- Neon project: patient-pine-72857484
--
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS pgcrypto;

`;

const final = header + out;
writeFileSync(outputFile, final, 'utf-8');

// ── Verification ───────────────────────────────────────────────────────────
console.log('✅ Done:', {
  blocksIn: blocks.length, blocksKept: kept.length, blocksSkipped: blocks.length - kept.length,
  lines: final.split('\n').length,
  authUsers: (final.match(/REFERENCES auth\.users/g)||[]).length,
  policies: (final.match(/^\s*CREATE POLICY/gim)||[]).length,
  enableRLS: (final.match(/ENABLE ROW LEVEL/gim)||[]).length,
  replicaIdentity: (final.match(/REPLICA IDENTITY/gi)||[]).length,
  clerkAdded: final.includes('clerk_user_id text UNIQUE'),
  tables: (final.match(/^CREATE TABLE\b/gm)||[]).length,
  profilesTable: final.includes('CREATE TABLE public.profiles'),
});
