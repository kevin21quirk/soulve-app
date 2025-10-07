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

export const uploadOrganizationAvatar = async (
  orgId: string,
  file: File
): Promise<string | null> => {
  try {
    // Delete existing avatar if any
    const { data: existingFiles } = await supabase.storage
      .from('organization-avatars')
      .list(orgId);

    if (existingFiles && existingFiles.length > 0) {
      const filesToRemove = existingFiles.map(x => `${orgId}/${x.name}`);
      await supabase.storage
        .from('organization-avatars')
        .remove(filesToRemove);
    }

    // Upload new avatar
    const fileExt = file.name.split('.').pop();
    const fileName = `${orgId}/avatar-${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('organization-avatars')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) throw uploadError;

    // Get public URL
    const { data } = supabase.storage
      .from('organization-avatars')
      .getPublicUrl(fileName);

    return data.publicUrl;
  } catch (error) {
    console.error('Error uploading organization avatar:', error);
    return null;
  }
};

export const uploadOrganizationBanner = async (
  orgId: string,
  file: File
): Promise<string | null> => {
  try {
    // Delete existing banner if any
    const { data: existingFiles } = await supabase.storage
      .from('organization-banners')
      .list(orgId);

    if (existingFiles && existingFiles.length > 0) {
      const filesToRemove = existingFiles.map(x => `${orgId}/${x.name}`);
      await supabase.storage
        .from('organization-banners')
        .remove(filesToRemove);
    }

    // Upload new banner
    const fileExt = file.name.split('.').pop();
    const fileName = `${orgId}/banner-${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('organization-banners')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) throw uploadError;

    // Get public URL
    const { data } = supabase.storage
      .from('organization-banners')
      .getPublicUrl(fileName);

    return data.publicUrl;
  } catch (error) {
    console.error('Error uploading organization banner:', error);
    return null;
  }
};

export const deleteOrganizationAvatar = async (orgId: string) => {
  try {
    const { data: files } = await supabase.storage
      .from('organization-avatars')
      .list(orgId);

    if (files && files.length > 0) {
      const filesToRemove = files.map(x => `${orgId}/${x.name}`);
      await supabase.storage
        .from('organization-avatars')
        .remove(filesToRemove);
    }

    return { error: null };
  } catch (error) {
    console.error('Error deleting organization avatar:', error);
    return { error };
  }
};

export const deleteOrganizationBanner = async (orgId: string) => {
  try {
    const { data: files } = await supabase.storage
      .from('organization-banners')
      .list(orgId);

    if (files && files.length > 0) {
      const filesToRemove = files.map(x => `${orgId}/${x.name}`);
      await supabase.storage
        .from('organization-banners')
        .remove(filesToRemove);
    }

    return { error: null };
  } catch (error) {
    console.error('Error deleting organization banner:', error);
    return { error };
  }
};
