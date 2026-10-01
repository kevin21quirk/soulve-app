// Shared Vercel Blob URL helpers — used by the upload delete route and the
// private documents route to validate that a stored URL belongs to our Blob
// store before calling del() or issuing a signed token.

// Vercel Blob URL hostname pattern — prevents del()/presignUrl() being invoked
// on arbitrary external URLs sourced from Neon rows or client input.
export const BLOB_HOSTNAME_RE =
  /^[a-z0-9]+\.(?:public|private)\.blob\.vercel-storage\.com$/;

/**
 * Returns the blob pathname when `value` is a HTTPS URL on our Vercel Blob
 * store, otherwise null. Never throws.
 */
export function parseBlobPathname(value: string | null | undefined): string | null {
  if (!value || typeof value !== 'string') return null;
  let parsed: URL;
  try {
    parsed = new URL(value);
  } catch {
    return null;
  }
  if (parsed.protocol !== 'https:' || !BLOB_HOSTNAME_RE.test(parsed.hostname)) {
    return null;
  }
  const pathname = parsed.pathname.replace(/^\//, '');
  return pathname.length ? pathname : null;
}

/** True when the stored value is a Vercel Blob URL (vs a legacy Supabase ref). */
export function isBlobUrl(value: string | null | undefined): boolean {
  return parseBlobPathname(value) !== null;
}
