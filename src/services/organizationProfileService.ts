import { supabase } from '@/integrations/supabase/client';

export interface OrganizationProfileUpdate {
  name?: string;
  organization_type?: string;
  description?: string;
  mission?: string;
  vision?: string;
  website?: string;
  location?: string;
  contact_email?: string;
  contact_phone?: string;
  established_year?: number;
  registration_number?: string;
  social_links?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
  tags?: string[];
  avatar_url?: string;
  banner_url?: string;
}

export const fetchOrganizationProfile = async (orgId: string) => {
  try {
    const { data, error } = await supabase
      .from('organizations')
      .select('*')
      .eq('id', orgId)
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching organization profile:', error);
    return { data: null, error };
  }
};

export const updateOrganizationProfile = async (
  orgId: string,
  updates: OrganizationProfileUpdate
) => {
  try {
    const { error } = await supabase
      .from('organizations')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', orgId);

    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('Error updating organization profile:', error);
    return { error };
  }
};

// ── Shared upload helper ─────────────────────────────────────────────────
// All org image uploads route through the server-side /api/upload endpoint.
// The server derives ownership from the Clerk bearer token; no Blob
// credentials are passed from the client.
async function uploadToBlob(file: File, folder: 'org-avatars' | 'org-banners', token: string): Promise<string | null> {
  const form = new FormData();
  form.append('file', file);
  form.append('folder', folder);

  const res = await fetch('/api/upload', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: form,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error((err as { error?: string }).error ?? res.statusText);
  }

  const { url } = (await res.json()) as { url: string };
  return url;
}

// ── Shared delete helper ─────────────────────────────────────────────────
// Note: the DELETE endpoint enforces segments[1] === clerkUserId, so only
// the user who uploaded the image can delete it. When the same Clerk user
// manages the org profile this works correctly. If ownership changes (e.g.
// a different admin takes over), the old file becomes orphaned — acceptable
// for public images since Neon always stores the current URL reference.
async function deleteFromBlob(url: string, token: string): Promise<{ error: unknown | null }> {
  try {
    const res = await fetch('/api/upload', {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: res.statusText }));
      throw new Error((err as { error?: string }).error ?? res.statusText);
    }

    return { error: null };
  } catch (error) {
    console.error('Error deleting org image from Blob:', error);
    return { error };
  }
}

/**
 * Uploads an organisation avatar via the server-side Vercel Blob endpoint.
 * @param orgId  - Organisation ID (used for logging/context only; path uses clerkUserId)
 * @param file   - The image file to upload
 * @param token  - Clerk session JWT (from useAuth().getToken())
 */
export const uploadOrganizationAvatar = async (
  orgId: string,
  file: File,
  token: string,
): Promise<string | null> => {
  try {
    return await uploadToBlob(file, 'org-avatars', token);
  } catch (error) {
    console.error('Error uploading organization avatar:', error);
    return null;
  }
};

/**
 * Uploads an organisation banner via the server-side Vercel Blob endpoint.
 */
export const uploadOrganizationBanner = async (
  orgId: string,
  file: File,
  token: string,
): Promise<string | null> => {
  try {
    return await uploadToBlob(file, 'org-banners', token);
  } catch (error) {
    console.error('Error uploading organization banner:', error);
    return null;
  }
};

/**
 * Deletes an organisation avatar by its Vercel Blob URL.
 * Only succeeds if the authenticated user uploaded the file.
 */
export const deleteOrganizationAvatar = async (url: string, token: string) =>
  deleteFromBlob(url, token);

/**
 * Deletes an organisation banner by its Vercel Blob URL.
 */
export const deleteOrganizationBanner = async (url: string, token: string) =>
  deleteFromBlob(url, token);
