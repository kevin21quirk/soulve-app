
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { FeedPost } from "@/types/feed";

export const usePostCreation = (
  setPosts: React.Dispatch<React.SetStateAction<FeedPost[]>>
) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

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

  return {
    isLoading,
    handlePostCreated,
  };
};
