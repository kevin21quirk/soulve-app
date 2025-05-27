
import { useState, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";
import { FeedPost } from "@/types/feed";
import { mockPosts } from "@/data/mockPosts";

export const useSocialFeed = () => {
  const { toast } = useToast();
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [posts, setPosts] = useState<FeedPost[]>(mockPosts);

  const handlePostCreated = (newPost: FeedPost) => {
    setIsLoading(true);
    setTimeout(() => {
      setPosts(prevPosts => [newPost, ...prevPosts]);
      setIsLoading(false);
      toast({
        title: "Post published!",
        description: "Your post is now live in the community feed.",
      });
    }, 800);
  };

  const handleLike = (postId: string) => {
    setPosts(prevPosts => 
      prevPosts.map(post => 
        post.id === postId 
          ? { 
              ...post, 
              isLiked: !post.isLiked,
              likes: post.isLiked ? post.likes - 1 : post.likes + 1
            }
          : post
      )
    );
  };

  const handleShare = (postId: string) => {
    toast({
      title: "Post shared!",
      description: "This post has been shared with your network.",
    });
  };

  const handleRespond = (postId: string) => {
    toast({
      title: "Response sent!",
      description: "Your offer to help has been sent to the requester.",
    });
  };

  const filteredPosts = useMemo(() => {
    let filtered = activeFilter === "all" 
      ? posts 
      : posts.filter(post => post.category === activeFilter);

    if (searchQuery) {
      filtered = filtered.filter(post => 
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  }, [posts, activeFilter, searchQuery]);

  const getPostCounts = () => ({
    all: posts.length,
    "help-needed": posts.filter(p => p.category === "help-needed").length,
    "help-offered": posts.filter(p => p.category === "help-offered").length,
    "success-story": posts.filter(p => p.category === "success-story").length,
  });

  return {
    posts,
    filteredPosts,
    activeFilter,
    setActiveFilter,
    searchQuery,
    setSearchQuery,
    isLoading,
    handlePostCreated,
    handleLike,
    handleShare,
    handleRespond,
    getPostCounts,
  };
};
