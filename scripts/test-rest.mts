// Local smoke test for the PostgREST-compat route (anon role — no Clerk JWT).
import { readFileSync } from 'node:fs';
for (const line of readFileSync('.env.local', 'utf8').split('\n')) {
  const m = line.match(/^([A-Z_]+)=(.*)$/);
  if (m) process.env[m[1]] = m[2].trim();
}
const { default: rest } = await import('../src/api/routes/rest.js');

const base = 'http://test.local/v1';
const hit = async (path: string, init?: RequestInit) => {
  const res = await rest.fetch(new Request(`${base}${path}`, init));
  const text = await res.text();
  console.log(`${init?.method ?? 'GET'} ${path} -> ${res.status} ${text.slice(0, 200)}`);
};

// anon role — only policies granting public/anon access return rows
await hit('/profiles?select=id,email&limit=3');
await hit('/profiles?select=*,badges(*)&limit=2');
await hit('/posts?select=id,author_id&order=created_at.desc&limit=3');
await hit('/posts?select=id,profiles!inner(first_name)&limit=2');
await hit('/campaigns?id=eq.00000000-0000-0000-0000-000000000000', { headers: { Accept: 'application/vnd.pgrst.object+json' } });
await hit('/nonexistent_table?select=*');
// public-insert policy ("Anyone can submit contact forms") exercises POST
await hit('/contact_submissions', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', Prefer: 'return=minimal' },
  body: JSON.stringify({ name: 'rest-test', email: 'rest@test.local', message: 'rls smoke test', subject: 'test', contact_type: 'general', status: 'new' }),
});
// count header
await hit('/profiles?select=id', { headers: { Prefer: 'count=exact' } });
process.exit(0);
