
import { useState } from 'react';
import { ContentModerationService } from '@/services/contentModerationService';
import { useToast } from '@/hooks/use-toast';

export const useContentModeration = () => {
  const [isModeratingContent, setIsModeratingContent] = useState(false);
  const { toast } = useToast();

  const moderateContent = async (content: string, title?: string) => {
    setIsModeratingContent(true);
    
    try {
      const result = await ContentModerationService.filterContent(content, title);
      
      if (!result.isAllowed) {
        toast({
          title: "Content flagged",
          description: `Your post contains content that needs review: ${result.reasons.join(', ')}`,
          variant: "destructive"
        });
        
        // For high severity issues, block immediately
        if (result.severity === 'high') {
          return { allowed: false, blocked: true, message: "Content blocked due to policy violations" };
        }
        
        // For medium severity, flag for review but allow posting
        return { allowed: true, flagged: true, message: "Content flagged for review" };
      }
      
      return { allowed: true, flagged: false, message: "Content approved" };
    } catch (error) {
      console.error('Content moderation error:', error);
      // In case of moderation service failure, allow posting but log error
      return { allowed: true, flagged: false, message: "Moderation service unavailable" };
    } finally {
      setIsModeratingContent(false);
    }
  };

  return {
    moderateContent,
    isModeratingContent
  };
};
