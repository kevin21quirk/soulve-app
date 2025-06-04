
import { supabase } from '@/integrations/supabase/client';

interface ContentFilterResult {
  isAllowed: boolean;
  reasons: string[];
  severity: 'low' | 'medium' | 'high';
  autoAction: 'none' | 'flag' | 'block';
}

// Simple content filtering rules (in production, you'd use AI/ML services)
const BLOCKED_WORDS = [
  'spam', 'scam', 'fraud', 'hate', 'abuse', 'violent', 'illegal'
];

const SUSPICIOUS_PATTERNS = [
  /(\w)\1{4,}/g, // Repeated characters (aaaa)
  /[A-Z]{10,}/g, // Excessive caps
  /(buy now|click here|limited time)/gi, // Spam phrases
  /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/g // Credit card patterns
];

export class ContentModerationService {
  static async filterContent(content: string, title?: string): Promise<ContentFilterResult> {
    const fullText = `${title || ''} ${content}`.toLowerCase();
    const reasons: string[] = [];
    let severity: 'low' | 'medium' | 'high' = 'low';
    let autoAction: 'none' | 'flag' | 'block' = 'none';

    // Check for blocked words
    const foundBlockedWords = BLOCKED_WORDS.filter(word => fullText.includes(word));
    if (foundBlockedWords.length > 0) {
      reasons.push(`Contains blocked words: ${foundBlockedWords.join(', ')}`);
      severity = 'high';
      autoAction = 'block';
    }

    // Check suspicious patterns
    for (const pattern of SUSPICIOUS_PATTERNS) {
      if (pattern.test(fullText)) {
        reasons.push('Contains suspicious patterns');
        if (severity === 'low') severity = 'medium';
        if (autoAction === 'none') autoAction = 'flag';
      }
    }

    // Check content length (very short or very long posts)
    if (content.length < 10) {
      reasons.push('Content too short');
      if (severity === 'low') severity = 'medium';
      if (autoAction === 'none') autoAction = 'flag';
    }

    if (content.length > 5000) {
      reasons.push('Content too long');
      if (severity === 'low') severity = 'medium';
      if (autoAction === 'none') autoAction = 'flag';
    }

    const isAllowed = autoAction !== 'block';

    // Log the moderation result
    if (reasons.length > 0) {
      await this.logModerationAction(content, reasons, severity, autoAction);
    }

    return {
      isAllowed,
      reasons,
      severity,
      autoAction
    };
  }

  static async logModerationAction(
    content: string,
    reasons: string[],
    severity: string,
    action: string
  ) {
    try {
      const { data: user } = await supabase.auth.getUser();
      
      await supabase
        .from('reports')
        .insert({
          reporter_id: null, // System-generated
          reported_post_id: null,
          report_type: 'automated_filter',
          reason: `Automated filter: ${reasons.join(', ')}`,
          status: action === 'block' ? 'auto_blocked' : 'pending'
        });
    } catch (error) {
      console.error('Error logging moderation action:', error);
    }
  }

  static async createAppeal(reportId: string, appealReason: string) {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user.user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('content_appeals')
      .insert({
        report_id: reportId,
        user_id: user.user.id,
        appeal_reason: appealReason,
        status: 'pending'
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async deletePost(postId: string) {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user.user) throw new Error('User not authenticated');

    // Check if user owns the post
    const { data: post } = await supabase
      .from('posts')
      .select('author_id')
      .eq('id', postId)
      .single();

    if (!post || post.author_id !== user.user.id) {
      throw new Error('You can only delete your own posts');
    }

    // Soft delete by setting is_active to false
    const { error } = await supabase
      .from('posts')
      .update({ is_active: false })
      .eq('id', postId);

    if (error) throw error;
    return true;
  }
}
