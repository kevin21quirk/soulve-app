
import { useState, useEffect } from "react";
import { FeedPost } from "@/types/feed";
import { useToast } from "@/hooks/use-toast";

export const useRealTimeFeed = (initialPosts: FeedPost[]) => {
  const [posts, setPosts] = useState<FeedPost[]>(initialPosts);
  const [isConnected, setIsConnected] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Simulate real-time connection
    setIsConnected(true);
    
    // Simulate real-time updates every 30 seconds
    const interval = setInterval(() => {
      // Randomly add new posts or update existing ones
      if (Math.random() < 0.3) { // 30% chance
        const newPost: FeedPost = {
          id: Date.now().toString(),
          author: `User ${Math.floor(Math.random() * 100)}`,
          authorId: `mock-user-${Date.now()}`,
          avatar: "",
          title: "Real-time update: New help request",
          description: "This is a live update that just came in!",
          category: Math.random() > 0.5 ? "help-needed" : "help-offered",
          timestamp: "Just now",
          location: "Live location",
          responses: 0,
          likes: 0,
          shares: 0,
          isLiked: false,
          isBookmarked: false,
          isShared: false,
          urgency: "high",
          tags: ["live", "real-time"],
          visibility: "public",
          reactions: [],
          comments: []
        };
        
        setPosts(prev => [newPost, ...prev]);
        
        toast({
          title: "New post available!",
          description: "A new post just appeared in your feed.",
        });
      }
    }, 30000);

    return () => {
      clearInterval(interval);
      setIsConnected(false);
    };
  }, [toast]);

  const addPost = (post: FeedPost) => {
    setPosts(prev => [post, ...prev]);
  };

  const updatePost = (postId: string, updates: Partial<FeedPost>) => {
    setPosts(prev => 
      prev.map(post => 
        post.id === postId ? { ...post, ...updates } : post
      )
    );
  };

  const removePost = (postId: string) => {
    setPosts(prev => prev.filter(post => post.id !== postId));
  };

  return {
    posts,
    isConnected,
    addPost,
    updatePost,
    removePost,
  };
};
