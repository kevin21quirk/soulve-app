import { supabase } from '@/integrations/supabase/client';

export interface ImportedContentData {
  platform: string;
  title: string;
  description: string;
  author?: string;
  thumbnailUrl?: string;
  tags?: string[];
  sourceUrl: string;
}

export class ContentImportService {
  static async importFromURL(url: string): Promise<ImportedContentData> {
    try {
      console.log('🎬 [ContentImport] Starting import from URL:', url);
      
      // Call the import-content edge function
      const { data, error } = await supabase.functions.invoke('import-content', {
        body: { url }
      });

      console.log('🎬 [ContentImport] Edge function response:', { data, error });

      if (error) {
        console.error('🎬 [ContentImport] Import error:', error);
        throw new Error(`Failed to import content: ${error.message}`);
      }

      if (!data) {
        console.error('🎬 [ContentImport] No data returned');
        throw new Error('No data returned from import service');
      }

      console.log('🎬 [ContentImport] Import successful:', data);
      return data as ImportedContentData;
    } catch (error: any) {
      console.error('🎬 [ContentImport] Service error:', error);
      throw new Error(error.message || 'Failed to import content from URL');
    }
  }

  static detectURLType(url: string): string {
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      return 'YouTube';
    }
    if (url.includes('twitter.com') || url.includes('x.com')) {
      return 'Twitter';
    }
    if (url.includes('instagram.com')) {
      return 'Instagram';
    }
    if (url.includes('medium.com') || url.includes('blog')) {
      return 'Article';
    }
    return 'Website';
  }

  static isValidURL(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }
}
