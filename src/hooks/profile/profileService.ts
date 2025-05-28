
import { supabase } from '@/integrations/supabase/client';
import { DatabaseProfile } from './types';

export const fetchUserProfile = async (userId: string): Promise<{ data: DatabaseProfile | null; error: any }> => {
  try {
    const { data: profile, error: profileError } = await (supabase as any)
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle() as { data: DatabaseProfile | null; error: any };

    return { data: profile, error: profileError };
  } catch (error) {
    console.error('Error in fetchUserProfile:', error);
    return { data: null, error };
  }
};

export const upsertUserProfile = async (profileData: any): Promise<{ error: any }> => {
  try {
    const { error } = await (supabase as any)
      .from('profiles')
      .upsert(profileData);

    return { error };
  } catch (error) {
    console.error('Error in upsertUserProfile:', error);
    return { error };
  }
};
