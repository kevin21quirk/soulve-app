import { supabase } from "@/integrations/supabase/client";

export interface URLPreview {
  url: string;
  title: string | null;
  description: string | null;
  image_url: string | null;
  site_name: string | null;
  favicon: string | null;
  metadata?: {
    type?: string;
    author?: string;
  };
}

// Regex to detect URLs in text
const URL_REGEX = /(https?:\/\/[^\s]+)/gi;

export class URLPreviewService {
  /**
   * Detect URLs in text content
   */
  static detectURLs(text: string): string[] {
    const matches = text.match(URL_REGEX);
    return matches || [];
  }

  /**
   * Fetch preview data for a URL
   */
  static async fetchPreview(url: string): Promise<URLPreview | null> {
    try {
      console.log('Fetching preview for URL:', url);

      // Call our edge function
      const { data, error } = await supabase.functions.invoke('fetch-url-preview', {
        body: { url }
      });

      if (error) {
        console.error('Error fetching preview:', error);
        return null;
      }

      if (data?.success && data?.preview) {
        return data.preview as URLPreview;
      }

      return null;
    } catch (error) {
      console.error('Error in fetchPreview:', error);
      return null;
    }
  }

  /**
   * Get cached preview from database
   */
  static async getCachedPreview(url: string): Promise<URLPreview | null> {
    try {
      const { data, error } = await supabase
        .from('url_previews')
        .select('*')
        .eq('url', url)
        .gt('expires_at', new Date().toISOString())
        .single();

      if (error || !data) {
        return null;
      }

      return data as URLPreview;
    } catch (error) {
      console.error('Error getting cached preview:', error);
      return null;
    }
  }

  /**
   * Extract the first URL from text and fetch its preview
   */
  static async getFirstURLPreview(text: string): Promise<URLPreview | null> {
    const urls = this.detectURLs(text);
    if (urls.length === 0) {
      return null;
    }

    // Try to get from cache first
    const cached = await this.getCachedPreview(urls[0]);
    if (cached) {
      return cached;
    }

    // Fetch new preview
    return await this.fetchPreview(urls[0]);
  }
}
