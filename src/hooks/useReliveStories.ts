
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { ReliveStoriesService, ReliveStory, StoryUpdate } from '@/services/reliveStoriesService';

export const useReliveStories = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [stories, setStories] = useState<ReliveStory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadUserStories = async () => {
    if (!user?.id) return;

    setLoading(true);
    setError(null);
    try {
      const userStories = await ReliveStoriesService.getUserStories(user.id);
      setStories(userStories);
    } catch (err) {
      setError('Failed to load your stories');
      console.error('Error loading stories:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadPublicStories = async () => {
    setLoading(true);
    setError(null);
    try {
      const publicStories = await ReliveStoriesService.getAllPublicStories();
      setStories(publicStories);
    } catch (err) {
      setError('Failed to load stories');
      console.error('Error loading public stories:', err);
    } finally {
      setLoading(false);
    }
  };

  const createStoryUpdate = async (
    postId: string,
    updateData: {
      update_type: 'progress' | 'completion' | 'impact' | 'reflection';
      title: string;
      content: string;
      media_url?: string;
      media_type?: 'image' | 'video';
      emotions?: string[];
      stats?: any;
    }
  ): Promise<StoryUpdate | null> => {
    if (!user?.id) {
      toast({
        title: "Authentication Required",
        description: "Please log in to add story updates.",
        variant: "destructive"
      });
      return null;
    }

    try {
      const newUpdate = await ReliveStoriesService.createStoryUpdate(postId, updateData);
      
      // Update local state
      setStories(prev => prev.map(story => 
        story.post_id === postId 
          ? { ...story, updates: [...story.updates, newUpdate] }
          : story
      ));

      toast({
        title: "Story update added! ✨",
        description: "Your progress has been captured and will be part of everyone's relive experience.",
      });

      return newUpdate;
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to add story update. Please try again.",
        variant: "destructive"
      });
      console.error('Error creating story update:', err);
      return null;
    }
  };

  useEffect(() => {
    if (user?.id) {
      loadUserStories();
    }
  }, [user?.id]);

  return {
    stories,
    loading,
    error,
    loadUserStories,
    loadPublicStories,
    createStoryUpdate,
    refreshStories: loadUserStories
  };
};
