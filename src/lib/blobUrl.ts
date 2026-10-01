// Client-side detection of Vercel Blob URLs. Mirrors the stricter
// server-side validation in src/api/lib/blobUrl.ts — used only to choose
// between the private-document download endpoint and the legacy Supabase
// signed-URL fallback.
const BLOB_HOSTNAME_RE =
  /^[a-z0-9]+\.(?:public|private)\.blob\.vercel-storage\.com$/;

export function isBlobUrl(value: string | null | undefined): boolean {
  if (!value) return false;
  try {
    const u = new URL(value);
    return u.protocol === 'https:' && BLOB_HOSTNAME_RE.test(u.hostname);
  } catch {
    return false;
  }
}
