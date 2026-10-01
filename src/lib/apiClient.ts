/**
 * Typed API client — wraps fetch calls to /api/* with Clerk auth header.
 * All application data calls should go through this client.
 */

type FetchOptions = Omit<RequestInit, 'body'> & {
  body?: unknown;
};

async function apiFetch<T>(
  path: string,
  options: FetchOptions = {},
  getToken?: () => Promise<string | null>,
): Promise<T> {
  const token = getToken ? await getToken() : null;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`/api${path}`, {
    ...options,
    headers,
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error((err as { error?: string }).error ?? `API error ${res.status}`);
  }

  return res.json() as Promise<T>;
}

// Multipart upload — must NOT set Content-Type (browser sets the boundary).
async function apiUpload<T>(
  path: string,
  form: FormData,
  getToken?: () => Promise<string | null>,
): Promise<T> {
  const token = getToken ? await getToken() : null;
  const headers: Record<string, string> = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`/api${path}`, { method: 'POST', headers, body: form });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error((err as { error?: string }).error ?? `API error ${res.status}`);
  }
  return res.json() as Promise<T>;
}

// ── Factory — call createApiClient(getToken) once per session ─────────────
export function createApiClient(getToken: () => Promise<string | null>) {
  const get  = <T>(path: string, opts?: FetchOptions) =>
    apiFetch<T>(path, { ...opts, method: 'GET' }, getToken);
  const post = <T>(path: string, body?: unknown, opts?: FetchOptions) =>
    apiFetch<T>(path, { ...opts, method: 'POST', body }, getToken);
  const patch = <T>(path: string, body?: unknown, opts?: FetchOptions) =>
    apiFetch<T>(path, { ...opts, method: 'PATCH', body }, getToken);
  const del  = <T>(path: string, opts?: FetchOptions) =>
    apiFetch<T>(path, { ...opts, method: 'DELETE' }, getToken);
  const upload = <T>(path: string, form: FormData) =>
    apiUpload<T>(path, form, getToken);

  return { get, post, patch, del, upload };
}

export type ApiClient = ReturnType<typeof createApiClient>;
